import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  fetchStudentDetailsAPI,
  fetchStudentDetailsByProfileAPI,
} from "./studentDetailsAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchStudentDetails = createAppAsyncThunk(
  "studentDetails/fetchStudentDetails",
  (id) => fetchStudentDetailsAPI(id)
);

export const fetchStudentDetailsByProfile = createAppAsyncThunk(
  "studentDetails/fetchStudentDetailsByProfile",
  (studentId) => fetchStudentDetailsByProfileAPI(studentId)
);

const studentDetailsSlice = createSlice({
  name: "studentDetails",
  initialState: {
    studentDetails: null,
    ...commonState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDetails.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDetails = action.payload;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        handleRejected(state, action);
      })
      .addCase(fetchStudentDetailsByProfile.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchStudentDetailsByProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDetails = action.payload;
      })
      .addCase(fetchStudentDetailsByProfile.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export default studentDetailsSlice.reducer;
