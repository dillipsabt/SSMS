import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getStudentWiseFees,
  getStudentWiseFeesById,
  createStudentWiseFees,
  updateStudentWiseFees,
  deleteStudentWiseFees,
  getStudentByRollNumber,
} from "./studentWiseFeesAPI";

export const fetchStudentWiseFeesAsync = createAppAsyncThunk(
  "studentWiseFees/fetchStudentWiseFees",
  (params) => getStudentWiseFees(params)
);

export const fetchStudentWiseFeesById = createAppAsyncThunk(
  "studentWiseFees/fetchStudentWiseFeesById",
  (id) => getStudentWiseFeesById(id)
);

export const createStudentWiseFeesAsync = createAppAsyncThunk(
  "studentWiseFees/createStudentWiseFees",
  (data) => createStudentWiseFees(data)
);

export const updateStudentWiseFeesAsync = createAppAsyncThunk(
  "studentWiseFees/updateStudentWiseFees",
  ({ id, data }) => updateStudentWiseFees(id, data)
);

export const deleteStudentWiseFeesAsync = createAppAsyncThunk(
  "studentWiseFees/deleteStudentWiseFees",
  (id) => deleteStudentWiseFees(id)
);

export const fetchStudentByRollNumberAsync = createAppAsyncThunk(
  "studentWiseFees/fetchStudentByRollNumber",
  (rollNo) => getStudentByRollNumber(rollNo)
);

// ==============================================
// INITIAL STATE
// ==============================================

const initialState = {
  studentWiseFees: [],
  selectedFee: null,
  studentData: null,
  searchRollNo: "",
  loading: false,
  error: null,
  success: false,
};

// ==============================================
// SLICE
// ==============================================

const studentWiseFeesSlice = createSlice({
  name: "studentWiseFees",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH ALL STUDENT WISE FEES
      // ==========================================

      .addCase(fetchStudentWiseFeesAsync.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchStudentWiseFeesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentWiseFees = action.payload.content || action.payload || [];
      })

      .addCase(fetchStudentWiseFeesAsync.rejected, (state, action) => {
        state.loading = false;

        // 404 means no data found
        if (action.payload?.status === 404) {
          state.studentWiseFees = [];
          state.error = null;
        } else {
          state.error = action.payload;
        }
      })

      // ==========================================
      // FETCH STUDENT WISE FEES BY ID
      // ==========================================

      .addCase(fetchStudentWiseFeesById.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchStudentWiseFeesById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFee = action.payload;
      })

      .addCase(fetchStudentWiseFeesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // CREATE STUDENT WISE FEES
      // ==========================================

      .addCase(createStudentWiseFeesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createStudentWiseFeesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentWiseFees.unshift(action.payload);
        state.success = true;
      })

      .addCase(createStudentWiseFeesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // UPDATE STUDENT WISE FEES
      // ==========================================

      .addCase(updateStudentWiseFeesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateStudentWiseFeesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.studentWiseFees.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.studentWiseFees[index] = action.payload;
        }
        state.success = true;
      })

      .addCase(updateStudentWiseFeesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // DELETE STUDENT WISE FEES
      // ==========================================

      .addCase(deleteStudentWiseFeesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteStudentWiseFeesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentWiseFees = state.studentWiseFees.filter(
          (item) => item.id !== action.payload
        );
        state.success = true;
      })

      .addCase(deleteStudentWiseFeesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // FETCH STUDENT BY ROLL NUMBER
      // ==========================================

      .addCase(fetchStudentByRollNumberAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchStudentByRollNumberAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.studentData = action.payload || null;
      })

      .addCase(fetchStudentByRollNumberAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.studentData = null;
      });
  },
});

export const { clearError, clearSuccess } = studentWiseFeesSlice.actions;
export default studentWiseFeesSlice.reducer;
