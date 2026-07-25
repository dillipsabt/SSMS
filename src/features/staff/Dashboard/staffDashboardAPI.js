import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// Get staff dashboard data
export const fetchStaffDashboardAPI = (staffId) => {
  return API.get(`/staff/dashboard/${staffId}`, {
    headers: getAuthHeader(),
  });
};

// Get staff attendance chart data
export const fetchStaffAttendanceChartAPI = (staffId) => {
  return API.get(`/staff/dashboard/${staffId}/attendance`, {
    headers: getAuthHeader(),
  });
};
