import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getStudentPerformanceList,
  getStudentPerformance,
  getAcademicYears,
  getStudents,
  getClasses,
  getExaminationTypes,
} from "./StudentWiseOverallResultsAPI";

export const fetchStudentPerformanceList = createAppAsyncThunk(
  "studentPerformance/fetchStudentPerformanceList",
  (params) => getStudentPerformanceList(params)
);

export const fetchStudentPerformance = createAppAsyncThunk(
  "studentPerformance/fetchStudentPerformance",
  (params) => getStudentPerformance(params)
);

export const fetchAcademicYears = createAppAsyncThunk(
  "studentPerformance/fetchAcademicYears",
  () => getAcademicYears()
);

export const fetchStudents = createAppAsyncThunk(
  "studentPerformance/fetchStudents",
  () => getStudents()
);

export const fetchClasses = createAppAsyncThunk(
  "studentPerformance/fetchClasses",
  () => getClasses()
);

export const fetchExaminationTypes = createAppAsyncThunk(
  "studentPerformance/fetchExaminationTypes",
  () => getExaminationTypes()
);

const StudentWiseOverallResultsSlice = createSlice({
  name: "StudentWiseOverallResults",
  initialState: {
    performanceListData: null,
    performanceData: null,
    academicYears: [],
    students: [],
    classes: [],
    examinationTypes: [],
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
      .addCase(fetchStudentPerformanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentPerformanceList.fulfilled, (state, action) => {

        state.loading = false;
        state.performanceListData = action.payload;

        state.dates = action.payload?.dates || [];
        if (state.allDates.length === 0) {
          state.allDates = action.payload.dates;
        }
        state.teachers = action.payload?.teachers || [];
        state.classesFromAPI = action.payload?.classes || [];
      })
      .addCase(fetchStudentPerformanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStudentPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.performanceData = action.payload;
      })
      .addCase(fetchStudentPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.academicYears = action.payload;
      })

      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload;
      })

      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = action.payload;
      })

      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.examinationTypes = action.payload;
      });
  },
});

export const { resetPerformanceState } = StudentWiseOverallResultsSlice.actions;
export default StudentWiseOverallResultsSlice.reducer;
