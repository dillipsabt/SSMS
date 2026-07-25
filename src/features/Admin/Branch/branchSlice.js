import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "./branchAPI";

export const fetchBranchesAsync = createAsyncThunk(
  "branch/fetchBranches",
  async (params = {}) => {
    const response = await getBranches(params);
    return response.data;
  }
);

export const fetchBranchByIdAsync = createAsyncThunk(
  "branch/fetchBranchById",
  async (id) => {
    const response = await getBranchById(id);
    return response.data;
  }
);

export const createBranchAsync = createAsyncThunk(
  "branch/createBranch",
  async (data) => {
    const response = await createBranch(data);
    return response.data;
  }
);

export const updateBranchAsync = createAsyncThunk(
  "branch/updateBranch",
  async ({ id, data }) => {
    const response = await updateBranch(id, data);
    return response.data;
  }
);

export const deleteBranchAsync = createAsyncThunk(
  "branch/deleteBranch",
  async (id) => {
    const response = await deleteBranch(id);
    return response.data;
  }
);

const initialState = {
  branches: [],
  selectedBranch: null,
  loading: false,
  error: null,
  successMessage: "",
};

const branchSlice = createSlice({
  name: "branch",
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
      .addCase(fetchBranchesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranchesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchBranchByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBranch = action.payload;
      })
      .addCase(fetchBranchByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(createBranchAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Branch created successfully";
        state.branches.push(action.payload);
      })
      .addCase(createBranchAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(updateBranchAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Branch updated successfully";
        const index = state.branches.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranchAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(deleteBranchAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Branch deleted successfully";
        state.branches = state.branches.filter(
          (b) => b.id !== action.meta.arg
        );
      })
      .addCase(deleteBranchAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSuccess, clearError } = branchSlice.actions;
export default branchSlice.reducer;
