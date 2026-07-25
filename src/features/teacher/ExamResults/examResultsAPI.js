// =========================
// examResultsAPI.js
// =========================

import API from "../../../services/api";

// =========================
// GET ALL EXAM RESULTS
// =========================
export const getAllExamResultsAPI = () => {
  return API.get("/exam-results");
};

// =========================
// GET TEACHER EXAM RESULTS (UPDATED API)
// =========================
export const getTeacherExamResultsAPI = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.academicYearId)
    params.append("academicYearId", filters.academicYearId);

  if (filters.classId)
    params.append("classId", filters.classId);

  if (filters.subjectId)
    params.append("subjectId", filters.subjectId);

  if (filters.examinationTypeId)
    params.append("examinationTypeId", filters.examinationTypeId);

  return API.get(`/exam-results/teacher-view?${params.toString()}`);
};

// =========================
// GET STUDENT RESULTS
// =========================
export const getStudentResultsAPI = (
  academicYearId,
  classId,
  subjectId,
  examinationTypeId
) => {
  return API.get(
    `/exam-results/teacher-view?academicYearId=${academicYearId}&classId=${classId}&subjectId=${subjectId}&examinationTypeId=${examinationTypeId}`
  );
};

// =========================
// GET EXAM RESULTS BY CLASS
// =========================
export const getExamResultsByClassAPI = (classId) => {
  return API.get(`/exam-results/class/${classId}`);
};

// =========================
// GET SINGLE EXAM RESULT
// =========================
export const getExamResultByIdAPI = (id) => {
  return API.get(`/exam-results/${id}`);
};

// =========================
// CREATE EXAM RESULT
// =========================
export const createExamResultAPI = (examData) => {
  return API.post("/exam-results/save-all", examData);
};

// =========================
// UPDATE EXAM RESULT
// =========================
export const updateExamResultAPI = (id, examData) => {
  return API.put(`/exam-results/${id}`, examData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// =========================
// DELETE EXAM RESULT
// =========================
export const deleteExamResultAPI = (id) => {
  return API.delete(`/exam-results/${id}`);
};

// =========================
// GET ALL ACADEMIC YEARS
// =========================
export const getAcademicYearsAPI = () => {
  return API.get("/academic-years");
};

// =========================
// GET ALL CLASSES
// =========================
export const getClassesAPI = () => {
  return API.get("/classes/get-all");
};

// =========================
// GET ALL SUBJECTS
// =========================
export const getSubjectsAPI = () => {
  return API.get("/subjects");
};

// =========================
// GET ALL EXAMINATION TYPES
// =========================
export const getExaminationTypesAPI = () => {
  return API.get("/examination-types");
};

// =========================
// GET STUDENTS BY CLASS
// =========================
export const getStudentsByClassAPI = (classRoomId) => {
  return API.get(`/attendance/take-attendance?classRoomId=${classRoomId}`);
};