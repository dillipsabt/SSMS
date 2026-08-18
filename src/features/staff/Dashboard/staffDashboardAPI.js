import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// Get staff dashboard data
export const fetchStaffDashboardAPI = (staffId, params = {}) => {
  return API.get(`/staff/dashboard/${staffId}`, {
    params,
    headers: getAuthHeader(),
  });
};

// Get staff attendance chart data
export const fetchStaffAttendanceChartAPI = (staffId, params = {}) => {
  return API.get(`/staff/dashboard/${staffId}/attendance`, {
    params,
    headers: getAuthHeader(),
  });
};
