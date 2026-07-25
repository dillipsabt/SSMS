import API from "../../../services/api";

// GET TEACHER DASHBOARD DATA
export const fetchTeacherDashboardAPI = () => {
  return API.get("/teachers/dashboard");
};
