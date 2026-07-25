import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  studentExamAPI,
  studentExamResultsAPI,
  getAcademicYearsAPI,
  getExaminationTypesAPI,
} from "./studentExamAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchStudentExams = createAppAsyncThunk(
  "studentExam/fetchStudentExams",
  () => studentExamAPI()
);

export const fetchStudentExamResults = createAppAsyncThunk(
  "studentExam/fetchStudentExamResults",
  ({ studentId, academicYearId, examinationTypeId }) =>
    studentExamResultsAPI(studentId, academicYearId, examinationTypeId)
);

export const fetchAcademicYears = createAppAsyncThunk(
  "studentExam/fetchAcademicYears",
  () => getAcademicYearsAPI()
);

export const fetchExaminationTypes = createAppAsyncThunk(
  "studentExam/fetchExaminationTypes",
  () => getExaminationTypesAPI()
);

const initialState = {
  exams: [],
  examResults: [],
  academicYears: [],
  examinationTypes: [],
  ...commonState,
};

const studentExamSlice = createSlice({
  name: "studentExam",
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

      // ==========================
      // STUDENT EXAMS
      // ==========================
      .addCase(fetchStudentExams.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchStudentExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(fetchStudentExams.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ==========================
      // STUDENT EXAM RESULTS
      // ==========================
      .addCase(fetchStudentExamResults.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchStudentExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.examResults = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(fetchStudentExamResults.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ==========================
      // ACADEMIC YEARS
      // ==========================
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

      // ==========================
      // EXAMINATION TYPES
      // ==========================
      .addCase(fetchExaminationTypes.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(fetchExaminationTypes.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearSuccess, clearError } = studentExamSlice.actions;

export default studentExamSlice.reducer;
