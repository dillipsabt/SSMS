import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAdminStudents,
  getAdminStudentById,
  addAdminStudent,
  updateAdminStudent,
  deleteAdminStudent,
  getAdminReligions,
  getAdminBloodGroups,
  getAdminCasts,
  fetchClassesAPI,
} from "./studentAPI";

// 🔹 GET ALL
export const getStudentsAsync = createAppAsyncThunk(
  "student/getAdminStudents",
  () => getAdminStudents()
);

// 🔹 GET BY ID
export const getStudentByIdAsync = createAppAsyncThunk(
  "student/getAdminStudentById",
  (id) => getAdminStudentById(id)
);

// 🔹 ADD
export const addStudentAsync = createAppAsyncThunk(
  "student/addAdminStudent",
  (formData) => addAdminStudent(formData)
);

// 🔹 UPDATE
export const updateStudentAsync = createAppAsyncThunk(
  "student/updateAdminStudent",
  ({ id, formData }) =>
    updateAdminStudent(id, formData)
);

// 🔹 DELETE
export const deleteStudentAsync = createAsyncThunk(
  "student/deleteAdminStudent",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteAdminStudent(id);
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

export const getReligionsAsync = createAsyncThunk(
  "student/getAdminReligions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminReligions();
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

// ✅ GET BLOOD GROUPS
export const getBloodGroupsAsync = createAsyncThunk(
  "student/getAdminBloodGroups",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminBloodGroups();
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

export const getCastsAsync = createAsyncThunk(
  "student/getAdminCasts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminCasts();
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

// =========================
// FETCH CLASSES
// =========================
export const fetchClassesAsync = createAsyncThunk(
  "student/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchClassesAPI();

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: [],
    classes: [],
    student: null,
    loading: false,
    error: null,
    message: null,
    success: false,
    religions: [],
    bloodGroups: [],
    castes: [],
  },
  reducers: {
    resetStudentState: (state) => {
      state.student = null;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getStudentsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.students = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(getStudentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getStudentByIdAsync.fulfilled, (state, action) => {
        state.student = action.payload || null;
      })

      // ADD
      .addCase(addStudentAsync.fulfilled, (state, action) => {
        state.success = true;
        if (action.payload) {
          state.students.push(action.payload);
        }
      })

      // UPDATE
      .addCase(updateStudentAsync.fulfilled, (state, action) => {
        state.success = true;

        const updatedStudent = action.payload;

        if (updatedStudent && updatedStudent.id) {
          const index = state.students.findIndex(
            (s) => s.id === updatedStudent.id,
          );

          if (index !== -1) {
            state.students[index] = {
              ...state.students[index],
              ...updatedStudent,
            };
          }
        }
      })

      // DELETE
      .addCase(deleteStudentAsync.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (s) => s.id !== action.payload.id,
        );
        state.message = action.payload.message;
      })

      .addCase(getReligionsAsync.fulfilled, (state, action) => {
        state.religions = action.payload;
      })

      .addCase(getBloodGroupsAsync.fulfilled, (state, action) => {
        state.bloodGroups = action.payload;
      })

      .addCase(getCastsAsync.fulfilled, (state, action) => {
        state.castes = action.payload;
      })

      // =========================
      // CLASSES
      // =========================
      .addCase(fetchClassesAsync.fulfilled, (state, action) => {
        state.classes = action.payload;
      });
  },
});

export const { resetStudentState } = studentSlice.actions;

export const clearSuccess = resetStudentState;
export const clearError = resetStudentState;

export default studentSlice.reducer;
