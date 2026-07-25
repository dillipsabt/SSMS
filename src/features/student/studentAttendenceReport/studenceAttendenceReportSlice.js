import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { fetchStudentViewAttendenceReportAPI } from "./studentAttendenceReportAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchStudentViewAttendenceReport = createAppAsyncThunk(
  "studentAttendenceReport/fetchStudentViewAttendenceReport",
  (params) => fetchStudentViewAttendenceReportAPI(params)
);

const studentAttendenceReportSlice = createSlice({
  name: "studentAttendenceReport",
  initialState: {
    studentViewAttendenceReport: null,
    ...commonState,
  },
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
      .addCase(fetchStudentViewAttendenceReport.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchStudentViewAttendenceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.studentViewAttendenceReport = action.payload;
      })
      .addCase(fetchStudentViewAttendenceReport.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearSuccess, clearError } = studentAttendenceReportSlice.actions;

export default studentAttendenceReportSlice.reducer;
