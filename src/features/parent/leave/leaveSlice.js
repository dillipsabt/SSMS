import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getStudentsByParentId,
  getStudentLeaves,
  applyLeave,
} from "./leaveAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const getStudentsByParentThunk = createAppAsyncThunk(
  "parentLeave/getStudentsByParent",
  (parentId) => getStudentsByParentId(parentId)
);

export const getStudentLeavesThunk = createAppAsyncThunk(
  "parentLeave/getStudentLeaves",
  (studentId) => getStudentLeaves(studentId)
);

export const applyLeaveThunk = createAppAsyncThunk(
  "parentLeave/applyLeave",
  (leaveData) => applyLeave(leaveData)
);

// ================= INITIAL STATE =================

const initialState = {
  students: [],
  leaves: [],
  ...commonState,
};

// ================= SLICE =================

const leaveSlice = createSlice({
  name: "parentLeave",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET STUDENTS =================

      .addCase(getStudentsByParentThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(getStudentsByParentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.students = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(getStudentsByParentThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ================= GET STUDENT LEAVES =================

      .addCase(getStudentLeavesThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(getStudentLeavesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(getStudentLeavesThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ================= APPLY LEAVE =================

      .addCase(applyLeaveThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(applyLeaveThunk.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(applyLeaveThunk.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearSuccess, clearError } = leaveSlice.actions;

export default leaveSlice.reducer;
