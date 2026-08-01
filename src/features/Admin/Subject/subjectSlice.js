import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "./subjectAPI";

export const fetchSubjectsAsync = createAsyncThunk(
  "subject/fetchSubjects",
  async (params = {}) => {
    const response = await getSubjects(params);
    return response.data;
  }
);

export const fetchSubjectByIdAsync = createAsyncThunk(
  "subject/fetchSubjectById",
  async (id) => {
    const response = await getSubjectById(id);
    return response.data;
  }
);

export const createSubjectAsync = createAsyncThunk(
  "subject/createSubject",
  async (data) => {
    const response = await createSubject(data);
    return response.data;
  }
);

export const updateSubjectAsync = createAsyncThunk(
  "subject/updateSubject",
  async ({ id, data }) => {
    const response = await updateSubject(id, data);
    return response.data;
  }
);

export const deleteSubjectAsync = createAsyncThunk(
  "subject/deleteSubject",
  async (id) => {
    const response = await deleteSubject(id);
    return response.data;
  }
);

const initialState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
  successMessage: "",
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.successMessage = "";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchSubjectByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubject = action.payload;
      })
      .addCase(fetchSubjectByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(createSubjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubjectAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Subject created successfully";
        state.subjects.push(action.payload);
      })
      .addCase(createSubjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(updateSubjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubjectAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Subject updated successfully";
        const index = state.subjects.findIndex(
          (subject) => subject.id === action.payload.id
        );
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(updateSubjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(deleteSubjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubjectAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Subject deleted successfully";
        state.subjects = state.subjects.filter(
          (subject) => subject.id !== action.meta.arg
        );
      })
      .addCase(deleteSubjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSuccess, clearError } = subjectSlice.actions;
export default subjectSlice.reducer;
