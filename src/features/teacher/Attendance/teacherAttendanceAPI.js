import API from "../../../services/api";

export const punchInTeacherAPI = (data) =>
  API.post("/teacher-attendance/punch-in", data, { skipErrorToast: true });

export const punchOutTeacherAPI = (data) =>
  API.post("/teacher-attendance/punch-out", data, { skipErrorToast: true });

export const fetchTeacherAttendanceAPI = (params) =>
  API.get("/teacher-attendance", { params, skipErrorToast: true });

export const fetchTeacherAttendanceHistoryAPI = (teacherId) =>
  API.get(`/teacher-attendance/teacher/${teacherId}`, {
    skipErrorToast: true,
  });
