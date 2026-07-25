import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";

import {
  getLeaves,
  getLeaveStatus,
  updateLeaveStatus,
  getDepartments,
} from "./leaveService";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// ================= GET LEAVES =================

export const getLeavesAsync = createAppAsyncThunk(
  "leave/getLeaves",
  () => getLeaves()
);

// ================= GET STATUS =================

export const getLeaveStatusAsync = createAppAsyncThunk(
  "leave/getStatus",
  () => getLeaveStatus()
);

// ================= UPDATE STATUS =================

export const updateLeaveStatusAsync = createAppAsyncThunk(
  "leave/updateStatus",
  ({ id, status, comment }) => updateLeaveStatus(id, status, comment)
);

// ================= GET DEPARTMENTS =================

export const getDepartmentsAsync = createAppAsyncThunk(
  "leave/getDepartments",
  () => getDepartments()
);

const initialState = {
  leaves: [],
  statusSummary: {},
  departments: [],
  ...commonState,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
   reducers: {
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET LEAVES =================

      .addCase(getLeavesAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getLeavesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })

      .addCase(getLeavesAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ================= GET STATUS =================

      .addCase(getLeaveStatusAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getLeaveStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.statusSummary = action.payload;
      })

      .addCase(getLeaveStatusAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ================= UPDATE STATUS =================

      .addCase(updateLeaveStatusAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateLeaveStatusAsync.fulfilled, (state, action) => {
        handleSuccess(state);

        const updatedLeave = action.payload;

        state.leaves = state.leaves.map((item) =>
          item.id === updatedLeave.id ? updatedLeave : item,
        );
      })

      .addCase(updateLeaveStatusAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })
      // ================= GET DEPARTMENTS =================

      .addCase(getDepartmentsAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getDepartmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })

      .addCase(getDepartmentsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearSuccess, clearError } = leaveSlice.actions;

export default leaveSlice.reducer;
