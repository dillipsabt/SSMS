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

const createFaceFormData = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
};

export const enrollTeacherFaceAPI = ({ userId, file }) =>
  API.post(`/face/enroll/${userId}`, createFaceFormData(file), {
    skipErrorToast: true,
  });

export const verifyTeacherFaceAPI = ({ userId, file }) =>
  API.post(`/face/verify/${userId}`, createFaceFormData(file), {
    skipErrorToast: true,
  });
