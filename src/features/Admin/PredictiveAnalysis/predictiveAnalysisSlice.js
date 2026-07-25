import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  uploadFile,
  analyzeImage,
  analyzeFile,
  analyzeStudent,
  analyzeBulk,
  getDashboard,
  getScans,
  getReportDetails,
  getStudentReports,
  getStudentTrendChart,
  getRiskDistributionChart,
  getClassPerformanceChart,
  getCategoryBreakdownChart,
  getUploadTemplate,
} from "./predictiveAnalysisAPI";

export const uploadDatasetAsync = createAppAsyncThunk(
  "predictiveAnalysis/uploadDataset",
  (file) => uploadFile(file)
);

export const analyzeImageAsync = createAppAsyncThunk(
  "predictiveAnalysis/analyzeImage",
  (file) => analyzeImage(file)
);

export const analyzeFileAsync = createAppAsyncThunk(
  "predictiveAnalysis/analyzeFile",
  ({ file, docType }) => analyzeFile(file, docType)
);

export const analyseStudentAsync = createAppAsyncThunk(
  "predictiveAnalysis/analyseStudent",
  ({ studentId, categories }) => analyzeStudent(studentId, categories)
);

export const analyseBulkAsync = createAppAsyncThunk(
  "predictiveAnalysis/analyseBulk",
  ({ classId, studentIds, categories }) => analyzeBulk(classId, studentIds, categories)
);

export const fetchPredictiveDashboard = createAppAsyncThunk(
  "predictiveAnalysis/fetchPredictiveDashboard",
  () => getDashboard()
);

export const fetchScansAsync = createAppAsyncThunk(
  "predictiveAnalysis/fetchScans",
  () => getScans()
);

export const fetchReportByIdAsync = createAppAsyncThunk(
  "predictiveAnalysis/fetchReportById",
  (id) => getReportDetails(id)
);

export const fetchStudentReportsAsync = createAppAsyncThunk(
  "predictiveAnalysis/fetchStudentReports",
  (id) => getStudentReports(id)
);

export const fetchStudentTrendAsync = createAppAsyncThunk(
  "predictiveAnalysis/fetchStudentTrend",
  (id) => getStudentTrendChart(id)
);

export const fetchRiskDistributionChart = createAppAsyncThunk(
  "predictiveAnalysis/fetchRiskDistributionChart",
  () => getRiskDistributionChart()
);

export const fetchClassPerformanceChart = createAppAsyncThunk(
  "predictiveAnalysis/fetchClassPerformanceChart",
  () => getClassPerformanceChart()
);

export const fetchCategoryBreakdownChart = createAppAsyncThunk(
  "predictiveAnalysis/fetchCategoryBreakdownChart",
  () => getCategoryBreakdownChart()
);

export const downloadTemplateAsync = createAppAsyncThunk(
  "predictiveAnalysis/downloadTemplate",
  () => getUploadTemplate()
);

const initialState = {
  analysisData: null,
  dashboardData: {
    totalStudentsAnalysed: 0,
    riskDistribution: {},
    categoryBreakdown: {},
    topAtRiskStudents: [],
    averagePredictedScore: 0,
    averageConfidence: 0,
    classWiseRiskData: [],
  },
  scans: [],
  reportDetails: null,
  studentReports: [],
  charts: {
    studentTrend: null,
    riskDistribution: null,
    classPerformance: null,
    categoryBreakdown: null,
  },
  uploadTemplate: null,
  bulkAnalysisResults: [],
  loading: false,
  error: null,
  successMessage: null,
};

const predictiveAnalysisSlice = createSlice({
  name: "predictiveAnalysis",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    resetAnalysisData: (state) => {
      state.analysisData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // UPLOAD DATASET
      .addCase(uploadDatasetAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDatasetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Dataset uploaded successfully";
      })
      .addCase(uploadDatasetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ANALYZE IMAGE
      .addCase(analyzeImageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeImageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisData = action.payload;
        state.successMessage = "Image analyzed successfully";
      })
      .addCase(analyzeImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ANALYZE FILE
      .addCase(analyzeFileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeFileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisData = action.payload;
        state.successMessage = "File analyzed successfully";
      })
      .addCase(analyzeFileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ANALYZE SINGLE STUDENT
      .addCase(analyseStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyseStudentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentReports = [action.payload];
        state.successMessage = "Student analyzed successfully";
      })
      .addCase(analyseStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ANALYZE BULK STUDENTS
      .addCase(analyseBulkAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyseBulkAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bulkAnalysisResults = action.payload;
        state.successMessage = "Bulk analysis completed successfully";
      })
      .addCase(analyseBulkAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PREDICTIVE DASHBOARD
      .addCase(fetchPredictiveDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictiveDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchPredictiveDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SCANS HISTORY
      .addCase(fetchScansAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScansAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.scans = action.payload;
      })
      .addCase(fetchScansAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH REPORT BY ID
      .addCase(fetchReportByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reportDetails = action.payload;
      })
      .addCase(fetchReportByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH STUDENT REPORTS
      .addCase(fetchStudentReportsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentReportsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentReports = action.payload;
      })
      .addCase(fetchStudentReportsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH STUDENT TREND CHART
      .addCase(fetchStudentTrendAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentTrendAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.charts.studentTrend = action.payload;
      })
      .addCase(fetchStudentTrendAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH RISK DISTRIBUTION CHART
      .addCase(fetchRiskDistributionChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiskDistributionChart.fulfilled, (state, action) => {
        state.loading = false;
        state.charts.riskDistribution = action.payload;
      })
      .addCase(fetchRiskDistributionChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH CLASS PERFORMANCE CHART
      .addCase(fetchClassPerformanceChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassPerformanceChart.fulfilled, (state, action) => {
        state.loading = false;
        state.charts.classPerformance = action.payload;
      })
      .addCase(fetchClassPerformanceChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH CATEGORY BREAKDOWN CHART
      .addCase(fetchCategoryBreakdownChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBreakdownChart.fulfilled, (state, action) => {
        state.loading = false;
        state.charts.categoryBreakdown = action.payload;
      })
      .addCase(fetchCategoryBreakdownChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DOWNLOAD TEMPLATE
      .addCase(downloadTemplateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadTemplateAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadTemplate = action.payload;
        state.successMessage = "Template downloaded successfully";
      })
      .addCase(downloadTemplateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetAnalysisData } = predictiveAnalysisSlice.actions;
export default predictiveAnalysisSlice.reducer;
