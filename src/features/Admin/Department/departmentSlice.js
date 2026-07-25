import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./departmentAPI";

// FETCH ALL DEPARTMENTS
export const fetchDepartmentsAsync = createAsyncThunk(
  "department/fetchDepartments",
  async (params = {}) => {
    const response = await getDepartments(params);
    return response.data;
  }
);

// FETCH DEPARTMENT BY ID
export const fetchDepartmentByIdAsync = createAsyncThunk(
  "department/fetchDepartmentById",
  async (id) => {
    const response = await getDepartmentById(id);
    return response.data;
  }
);

// CREATE DEPARTMENT
export const createDepartmentAsync = createAsyncThunk(
  "department/createDepartment",
  async (data) => {
    const response = await createDepartment(data);
    return response.data;
  }
);

// UPDATE DEPARTMENT
export const updateDepartmentAsync = createAsyncThunk(
  "department/updateDepartment",
  async ({ id, data }) => {
    const response = await updateDepartment(id, data);
    return response.data;
  }
);

// DELETE DEPARTMENT
export const deleteDepartmentAsync = createAsyncThunk(
  "department/deleteDepartment",
  async (id) => {
    const response = await deleteDepartment(id);
    return response.data;
  }
);

const initialState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  error: null,
  successMessage: "",
};

const departmentSlice = createSlice({
  name: "department",
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
    // FETCH DEPARTMENTS
    builder
      .addCase(fetchDepartmentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartmentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // FETCH DEPARTMENT BY ID
    builder
      .addCase(fetchDepartmentByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDepartment = action.payload;
      })
      .addCase(fetchDepartmentByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // CREATE DEPARTMENT
    builder
      .addCase(createDepartmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Department created successfully";
        state.departments.push(action.payload);
      })
      .addCase(createDepartmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // UPDATE DEPARTMENT
    builder
      .addCase(updateDepartmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Department updated successfully";
        const index = state.departments.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      .addCase(updateDepartmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // DELETE DEPARTMENT
    builder
      .addCase(deleteDepartmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Department deleted successfully";
        state.departments = state.departments.filter(
          (d) => d.id !== action.meta.arg
        );
      })
      .addCase(deleteDepartmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSuccess, clearError } = departmentSlice.actions;
export default departmentSlice.reducer;
