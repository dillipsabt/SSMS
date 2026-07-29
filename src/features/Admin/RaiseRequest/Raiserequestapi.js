import API from "../../../api/axios";

export const getTeacherRequests = (params = {}) =>
  API.get("/api/teacher-schedules/admin-request-list", { params });

export const approveTeacherRequest = (id, payload) =>
  API.put(`/api/teacher-schedules/${id}/approve`, payload);

export const rejectTeacherRequest = (id, payload) =>
  API.put(`/api/teacher-schedules/${id}/reject`, payload);
