import API from "../../../services/api";

// =========================
// GET TEACHER PROFILE DETAILS
// =========================
export const fetchTeacherProfileAPI = () => {
  return API.get("/teachers/profile-details");
};