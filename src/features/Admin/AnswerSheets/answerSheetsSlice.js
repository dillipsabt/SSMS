import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  analyzeImage,
  analyzeFile,
  getScans,
  getReportDetails,
  getStudentReports,
} from "./answerSheetsAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// ANALYZE IMAGE
export const analyzeImageAsync = createAppAsyncThunk(
  "answerSheets/analyzeImage",
  (file) => analyzeImage(file)
);

// ANALYZE FILE
export const analyzeFileAsync = createAppAsyncThunk(
  "answerSheets/analyzeFile",
  ({ file, docType }) => analyzeFile(file, docType)
);

// FETCH SCANS
export const fetchScansAsync = createAppAsyncThunk(
  "answerSheets/fetchScans",
  () => getScans()
);

// FETCH REPORT DETAILS
export const fetchReportAsync = createAppAsyncThunk(
  "answerSheets/fetchReport",
  (id) => getReportDetails(id)
);

// FETCH STUDENT REPORTS
export const fetchStudentReportsAsync = createAppAsyncThunk(
  "answerSheets/fetchStudentReports",
  (id) => getStudentReports(id)
);

const initialState = {
  analysisData: null,
  scans: [],
  reportDetails: null,
  studentReports: [],
  ...commonState,
};

const answerSheetsSlice = createSlice({
  name: "answerSheets",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetAnalysisData: (state) => {
      state.analysisData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ANALYZE IMAGE
      .addCase(analyzeImageAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(analyzeImageAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.analysisData = action.payload;
      })
      .addCase(analyzeImageAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ANALYZE FILE
      .addCase(analyzeFileAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(analyzeFileAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.analysisData = action.payload;
      })
      .addCase(analyzeFileAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // FETCH SCANS
      .addCase(fetchScansAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchScansAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.scans = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchScansAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // FETCH REPORT
      .addCase(fetchReportAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchReportAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reportDetails = action.payload;
      })
      .addCase(fetchReportAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // FETCH STUDENT REPORTS
      .addCase(fetchStudentReportsAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchStudentReportsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentReports = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchStudentReportsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearError, clearSuccess, resetAnalysisData } = answerSheetsSlice.actions;
export default answerSheetsSlice.reducer;
