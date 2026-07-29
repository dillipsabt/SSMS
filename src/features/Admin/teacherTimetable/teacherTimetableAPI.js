import API from "../../../api/axios";

export const getTeacherSchedules = (params = {}) =>
  API.get("/teacher-schedules", { params });

export const getTeacherSchedule = (id) =>
  API.get(`/teacher-schedules/${id}`);

export const createTeacherSchedule = (payload) =>
  API.post("/teacher-schedules", payload);

export const updateTeacherSchedule = (id, payload) =>
  API.put(`/teacher-schedules/${id}`, payload);

export const deleteTeacherSchedule = (id) =>
  API.delete(`/teacher-schedules/${id}`);

export const publishTeacherSchedules = (payload) =>
  API.put("/teacher-schedules/publish", payload);

export const getClasses = () => API.get("/classes/get-all");

export const getTimeSlots = () => API.get("/admin/time-slots");

export const getSubjectsAPI = () => API.get("/subjects");
