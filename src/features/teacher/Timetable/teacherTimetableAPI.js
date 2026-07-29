import API from "../../../api/axios";

export const fetchTeacherTimetableAPI = () =>
  API.get("/teacher-schedules/published-schedule");

export const fetchTeacherTimetableRequestsAPI = (params = {}) =>
  API.get("/teacher-schedules/teacher-request-list", { params });

export const createTeacherTimetableRequestAPI = (payload) =>
  API.post("/teacher-schedules/raise-requests", payload);

export const fetchSubjectsAPI = () => API.get("/subjects");
export const fetchClassesAPI = () => API.get("/classes/get-all");
export const fetchTimeSlotsAPI = () => API.get("/admin/time-slots");
