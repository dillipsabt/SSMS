// ==============================================
// src/features/Admin/ExamResult/examResultAPI.js
// ==============================================

import API from "../../../services/api";

// ==============================================
// ADMIN EXAM RESULTS (TEACHER ADMIN VIEW)
// ==============================================

// GET EXAM RESULTS WITH TEACHER ADMIN VIEW
export const getExamResults = (params) => {
  return API.get("/exam-results/teacher/admin-view", {
    params,
  });
};

// GET STUDENT MARKS BY CLASS + SUBJECT
export const getStudentResultSummary = (params) => {
  return API.get(
    "/exam-results/teacher/admin-view",
    {
      params,
    }
  );
};

export const getReportCards = (params) => {
  return API.get("/exam-results/report-cards", { params });
};

export const downloadReportCard = (params) => {
  return API.get("/exam-results/report-card/download", { params });
};

// ==============================================
// SUBJECTS
// ==============================================

export const getSubjects = () => {
  return API.get("/subjects");
};

// ==============================================
// EXAMINATION TYPES
// ==============================================

export const getExaminationTypes = () => {
  return API.get("/examination-types");
};

// ==============================================
// CLASSES
// ==============================================

export const getClasses = () => {
  return API.get("/classes/get-all");
};
