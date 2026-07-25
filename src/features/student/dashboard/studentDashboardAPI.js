import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// Get student dashboard data
export const fetchStudentDashboardAPI = (studentId) => {
  return API.get(`/dashboard/student/${studentId}`, {
    headers: getAuthHeader(),
  });
};

// Get student attendance chart data
export const fetchStudentAttendanceChartAPI = (studentId) => {
  return API.get(`/dashboard/student/${studentId}/attendance`, {
    headers: getAuthHeader(),
  });
};
