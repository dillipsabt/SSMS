import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAcademicYearsAPI,
  getExaminationTypesAPI,
  parentExamResultsAPI,
  getStudentsByParentIdAPI,
} from "./parentExamReportsAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const getStudentsByParentThunk = createAppAsyncThunk(
  "parentExamReports/getStudentsByParent",
  (parentId) => getStudentsByParentIdAPI(parentId)
);

export const fetchAcademicYears = createAppAsyncThunk(
  "parentExamReports/fetchAcademicYears",
  () => getAcademicYearsAPI()
);

export const fetchExaminationTypes = createAppAsyncThunk(
  "parentExamReports/fetchExaminationTypes",
  () => getExaminationTypesAPI()
);

export const fetchStudentExamResults = createAppAsyncThunk(
  "parentExamReports/fetchStudentExamResults",
  ({ studentId, academicYearId, examinationTypeId }) =>
    parentExamResultsAPI(studentId, academicYearId, examinationTypeId)
);

// ==========================
// INITIAL STATE
// ==========================
const initialState = {
  students: [],
  academicYears: [],
  examinationTypes: [],
  examResults: [],
  ...commonState,
};

// ==========================
// SLICE
// ==========================
const parentExamReportsSlice = createSlice({
  name: "parentExamReports",
  initialState,
  reducers: {
    clearExamResults: (state) => {
      state.examResults = [];
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Students by Parent
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

      // Academic Years
      .addCase(fetchAcademicYears.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchAcademicYears.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // Examination Types
      .addCase(fetchExaminationTypes.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchExaminationTypes.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // Student Exam Results
      .addCase(fetchStudentExamResults.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchStudentExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.examResults = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchStudentExamResults.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearExamResults, clearSuccess, clearError } = parentExamReportsSlice.actions;

export default parentExamReportsSlice.reducer;
