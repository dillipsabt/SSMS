import API from "../../../services/api";

// ANALYZE IMAGE
export const analyzeImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/predictive/analyze-image", formData);
};

// ANALYZE FILE (PDF, Excel, CSV, etc)
export const analyzeFile = (file, docType = "exam_paper") => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/predictive/analyze-file", formData, {
    params: {
      docType,
    },
  });
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
