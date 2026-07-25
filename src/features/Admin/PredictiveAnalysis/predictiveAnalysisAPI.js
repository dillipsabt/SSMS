import API from "../../../services/api";

// UPLOAD FILE
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/predictive/upload", formData);
};

// ANALYZE IMAGE
export const analyzeImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/predictive/analyze-image", formData);
};

// ANALYZE FILE (PDF, Excel, CSV, etc)
export const analyzeFile = (file, docType = "report_card") => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/predictive/analyze-file", formData, {
    params: {
      docType,
    },
  });
};

// ANALYZE SINGLE STUDENT
export const analyzeStudent = (studentId, categories = ["ACADEMIC"]) => {
  return API.post("/predictive/analyse/student", {
    studentId,
    categories,
  });
};

// ANALYZE BULK STUDENTS
export const analyzeBulk = (classId, studentIds, categories = ["ACADEMIC"]) => {
  return API.post("/predictive/analyse/bulk", {
    classId,
    studentIds,
    categories,
  });
};

// GET DASHBOARD
export const getDashboard = () => {
  return API.get("/predictive/dashboard");
};

// GET SCANS HISTORY
export const getScans = () => {
  return API.get("/predictive/scans");
};

// GET REPORT DETAILS
export const getReportDetails = (id) => {
  return API.get(`/predictive/report/${id}`);
};

// GET STUDENT REPORTS
export const getStudentReports = (id) => {
  return API.get(`/predictive/student/${id}`);
};

// GET CHARTS
export const getStudentTrendChart = (id) => {
  return API.get(`/predictive/charts/student-trend/${id}`);
};

export const getRiskDistributionChart = () => {
  return API.get("/predictive/charts/risk-distribution");
};

export const getClassPerformanceChart = () => {
  return API.get("/predictive/charts/class-performance");
};

export const getCategoryBreakdownChart = () => {
  return API.get("/predictive/charts/category-breakdown");
};

// GET UPLOAD TEMPLATE
export const getUploadTemplate = () => {
  return API.get("/predictive/upload/template");
};
