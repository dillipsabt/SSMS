import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAvailableDates,
  getTeachersByDate,
  getClassesByDateAndTeacher,
  getStudentPerformanceList,
  getStudentPerformanceDetails,
} from "./studentPerformanceAPI";

// ============================
// NEW ASYNC THUNKS
// ============================

export const fetchAvailableDates = createAppAsyncThunk(
  "studentPerformance/fetchAvailableDates",
  () => getAvailableDates()
);

export const fetchTeachersByDate = createAppAsyncThunk(
  "studentPerformance/fetchTeachersByDate",
  (date) => getTeachersByDate(date)
);

export const fetchClassesByDateAndTeacher = createAppAsyncThunk(
  "studentPerformance/fetchClassesByDateAndTeacher",
  ({ date, teacherId }) => getClassesByDateAndTeacher(date, teacherId)
);

export const fetchStudentPerformanceList = createAppAsyncThunk(
  "studentPerformance/fetchStudentPerformanceList",
  (params) => getStudentPerformanceList(params)
);

export const fetchStudentPerformanceDetails = createAppAsyncThunk(
  "studentPerformance/fetchStudentPerformanceDetails",
  (performanceId) => getStudentPerformanceDetails(performanceId)
);

const studentPerformanceSlice = createSlice({
  name: "studentPerformance",
  initialState: {
    performanceListData: null,
    performanceData: null,
    dates: [],
    allDates: [],
    teachers: [],
    classesFromAPI: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetPerformanceState: (state) => {
      state.performanceListData = null;
      state.performanceData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================
      // FETCH AVAILABLE DATES
      // ============================
      .addCase(fetchAvailableDates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableDates.fulfilled, (state, action) => {
        state.loading = false;
        state.dates = Array.isArray(action.payload) ? action.payload : action.payload?.dates || [];
        if (state.allDates.length === 0) {
          state.allDates = state.dates;
        }
      })
      .addCase(fetchAvailableDates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // FETCH TEACHERS BY DATE
      // ============================
      .addCase(fetchTeachersByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachersByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = Array.isArray(action.payload) ? action.payload : action.payload?.teachers || [];
      })
      .addCase(fetchTeachersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // FETCH CLASSES BY DATE & TEACHER
      // ============================
      .addCase(fetchClassesByDateAndTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassesByDateAndTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.classesFromAPI = Array.isArray(action.payload) ? action.payload : action.payload?.classes || [];
      })
      .addCase(fetchClassesByDateAndTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // FETCH STUDENT PERFORMANCE LIST
      // ============================
      .addCase(fetchStudentPerformanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentPerformanceList.fulfilled, (state, action) => {
        state.loading = false;
        state.performanceListData = action.payload;
      })
      .addCase(fetchStudentPerformanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================
      // FETCH STUDENT PERFORMANCE DETAILS
      // ============================
      .addCase(fetchStudentPerformanceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentPerformanceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.performanceData = action.payload;
      })
      .addCase(fetchStudentPerformanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPerformanceState } = studentPerformanceSlice.actions;
export default studentPerformanceSlice.reducer;
