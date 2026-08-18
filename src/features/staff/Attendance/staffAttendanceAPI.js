import API from "../../../services/api";

export const punchInStaffAPI = (data) =>
  API.post("/staff-attendance/punch-in", data, { skipErrorToast: true });

export const punchOutStaffAPI = (data) =>
  API.post("/staff-attendance/punch-out", data, { skipErrorToast: true });

export const fetchStaffAttendanceAPI = (staffId) =>
  API.get(`/staff-attendance/staff/${staffId}`, { skipErrorToast: true });

export const fetchStaffPunchDetailsAPI = ({ staffId, date }) =>
  API.get("/staff-attendance/get-punch-details", {
    params: { staffId, date },
    skipErrorToast: true,
  });
