import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "./classAPI";

// FETCH ALL CLASSES
export const fetchClassesAsync = createAsyncThunk(
  "class/fetchClasses",
  async (params = {}) => {
    const response = await getClasses(params);
    return response.data;
  }
);

// FETCH CLASS BY ID
export const fetchClassByIdAsync = createAsyncThunk(
  "class/fetchClassById",
  async (id) => {
    const response = await getClassById(id);
    return response.data;
  }
);

// CREATE CLASS
export const createClassAsync = createAsyncThunk(
  "class/createClass",
  async (data) => {
    const response = await createClass(data);
    return response.data;
  }
);

// UPDATE CLASS
export const updateClassAsync = createAsyncThunk(
  "class/updateClass",
  async ({ id, data }) => {
    const response = await updateClass(id, data);
    return response.data;
  }
);

// DELETE CLASS
export const deleteClassAsync = createAsyncThunk(
  "class/deleteClass",
  async (id) => {
    const response = await deleteClass(id);
    return response.data;
  }
);

const initialState = {
  classes: [],
  selectedClass: null,
  loading: false,
  error: null,
  successMessage: "",
};

const classSlice = createSlice({
  name: "class",
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
    // FETCH CLASSES
    builder
      .addCase(fetchClassesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClassesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // FETCH CLASS BY ID
    builder
      .addCase(fetchClassByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClass = action.payload;
      })
      .addCase(fetchClassByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // CREATE CLASS
    builder
      .addCase(createClassAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClassAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Class created successfully";
        state.classes.push(action.payload);
      })
      .addCase(createClassAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // UPDATE CLASS
    builder
      .addCase(updateClassAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClassAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Class updated successfully";
        const index = state.classes.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(updateClassAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // DELETE CLASS
    builder
      .addCase(deleteClassAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClassAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Class deleted successfully";
        state.classes = state.classes.filter(
          (c) => c.id !== action.meta.arg
        );
      })
      .addCase(deleteClassAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSuccess, clearError } = classSlice.actions;
export default classSlice.reducer;
