import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import {
  fetchStudentDashboardAPI,
  fetchStudentAttendanceChartAPI,
} from "./studentDashboardAPI";

export const getStudentDashboardAsync = createAppAsyncThunk(
  "studentDashboard/getStudentDashboard",
  (studentId) => fetchStudentDashboardAPI(studentId)
);

export const getStudentAttendanceChartAsync = createAppAsyncThunk(
  "studentDashboard/getStudentAttendanceChart",
  (studentId) => fetchStudentAttendanceChartAPI(studentId)
);

const initialState = {
  dashboardData: null,
  attendanceChartData: null,
  ...commonState,
};

const studentDashboardSlice = createSlice({
  name: "studentDashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetStudentDashboard: () => initialState,
    resetDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudentDashboardAsync.pending, handlePending)
      .addCase(getStudentDashboardAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getStudentDashboardAsync.rejected, handleRejected)
      .addCase(getStudentAttendanceChartAsync.pending, handlePending)
      .addCase(getStudentAttendanceChartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceChartData = action.payload;
      })
      .addCase(getStudentAttendanceChartAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, resetStudentDashboard, resetDashboardError } = studentDashboardSlice.actions;
export default studentDashboardSlice.reducer;
