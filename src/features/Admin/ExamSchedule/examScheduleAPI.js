// src/features/Admin/ExamSchedule/examScheduleAPI.js

import API from "../../../services/api";

// GET ALL EXAMS
export const getExamSchedules = () => {
  return API.get("/exams");
};

// GET ACADEMIC YEARS
export const getAcademicYears = () => {
  return API.get("/academic-years");
};

// GET EXAM TYPES
export const getExaminationTypes = () => {
  return API.get("/examination-types");
};

// GET CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};

// ADD EXAM SCHEDULE
export const addExamSchedule = (params, formData) => {
  return API.post("/exams", formData, {
    params,
  });
};

// PUBLISH EXAM SCHEDULE
export const publishExamSchedule = (data) => {
  return API.patch("/exams/exam-status", data);
};