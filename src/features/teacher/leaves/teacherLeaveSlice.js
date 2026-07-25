import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { fetchLeavesByTeacherIdAPI, applyLeaveAPI } from "./teacherleaveAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchLeavesByTeacherId = createAppAsyncThunk(
  "teacherLeaves/fetchByUserId",
  (userId) => fetchLeavesByTeacherIdAPI(userId)
);

export const applyLeave = createAppAsyncThunk(
  "teacherLeaves/apply",
  (leaveData) => applyLeaveAPI(leaveData)
);

const leaveSlice = createSlice({
  name: "teacherLeaves",
  initialState: {
    teacherLeaves: [],
    ...commonState,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // 🔹 fetch leaves
      .addCase(fetchLeavesByTeacherId.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchLeavesByTeacherId.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherLeaves = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchLeavesByTeacherId.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // 🔹 apply leave
      .addCase(applyLeave.pending, (state) => {
        handlePending(state);
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        handleSuccess(state);

        // if API returns the created leave, add it to list
        if (action.payload) {
          state.teacherLeaves.unshift(action.payload);
        }
      })
      .addCase(applyLeave.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export default leaveSlice.reducer;
