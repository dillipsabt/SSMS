import API from "../../../services/api";

// ROLE MAPPING
const roleMap = {
  "admin-portal": "admin",
  "teacher-portal": "teacher",
  "student-portal": "student",
  "parent-portal": "parent",
};

// GET PORTAL NOTICES BY ROLE
export const getPortalNotices = (role, params = {}) => {
  const mappedRole = roleMap[role] || role.toLowerCase();
  const endpoint = `/portal/notices/${mappedRole}`;
  return API.get(endpoint, { params });
};
