// src/features/Admin/ExamSchedule/examScheduleAPI.js

import API from "../../../services/api";

export const getExamSchedules = () => API.get("/exams");

export const getExamSchedule = (id) => API.get(`/exams/${id}`);

// GET ACADEMIC YEARS
export const getAcademicYears = () => {
  return API.get("/academic-years");
};

export const getExaminationTypes = () => API.get("/examination-types");

export const getSubjects = () => API.get("/subjects");

// GET CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};

export const addExamSchedule = (data) => API.post("/exams", data);

export const updateExamSchedule = (id, data) => API.put(`/exams/${id}`, data);

export const deleteExamSchedule = (id) => API.delete(`/exams/${id}`);

export const publishExamSchedules = (data) => API.patch("/exams/publish", data);

export const updateExamStatus = (data) => API.patch("/exams/exam-status", data);
