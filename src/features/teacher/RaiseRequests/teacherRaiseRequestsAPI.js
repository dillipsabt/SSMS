import API from "../../../services/api";

// ✅ GET RAISE REQUESTS BY TEACHER ID
export const getTeacherRaiseRequests = (teacherId) => {
  return API.get(`/teacher/timetable/requests/${teacherId}`);
};
