import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getTeacherRaiseRequests } from "./teacherRaiseRequestsAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchTeacherRaiseRequests = createAppAsyncThunk(
  "teacherRaiseRequests/fetchByTeacherId",
  (teacherId) => getTeacherRaiseRequests(teacherId)
);

const initialState = {
  raiseRequests: [],
  ...commonState,
};

const teacherRaiseRequestsSlice = createSlice({
  name: "teacherRaiseRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FETCH RAISE REQUESTS
      .addCase(fetchTeacherRaiseRequests.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchTeacherRaiseRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.raiseRequests = action.payload || [];
      })
      .addCase(fetchTeacherRaiseRequests.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export default teacherRaiseRequestsSlice.reducer;
