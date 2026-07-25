import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getClasses,
  getSubjects,
  getAttendanceReport,
  takeAttendance,
} from "./attendanceApi";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const getClassesThunk = createAppAsyncThunk(
  "attendance/classes",
  () => getClasses()
);

export const getSubjectsThunk = createAppAsyncThunk(
  "attendance/subjects",
  () => getSubjects()
);

export const getAttendanceReportThunk = createAppAsyncThunk(
  "attendance/report",
  ({ studentId, year }) => getAttendanceReport(studentId, year)
);

export const takeAttendanceThunk = createAppAsyncThunk(
  "attendance/take",
  (data) => takeAttendance(data)
);

const initialState = {
  classes: [],
  subjects: [],
  report: [],
  ...commonState,
};

const attendanceSlice = createSlice({
  name: "attendance",

  initialState,

  reducers: {
    resetAttendanceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // TAKE ATTENDANCE
      // =========================

      .addCase(takeAttendanceThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(takeAttendanceThunk.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(takeAttendanceThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // =========================
      // GET CLASSES
      // =========================

      .addCase(getClassesThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(getClassesThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.classes = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(getClassesThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // =========================
      // GET SUBJECTS
      // =========================

      .addCase(getSubjectsThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(getSubjectsThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.subjects = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(getSubjectsThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // =========================
      // GET REPORT
      // =========================

      .addCase(getAttendanceReportThunk.pending, (state) => {
        handlePending(state);
      })

      .addCase(getAttendanceReportThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.report = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(getAttendanceReportThunk.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { resetAttendanceState } = attendanceSlice.actions;

export default attendanceSlice.reducer;
