import API from "../../../services/api";

// ROLE MAPPING
const roleMap = {
  "admin-portal": "admin",
  "teacher-portal": "teacher",
  "student-portal": "student",
  "parent-portal": "parent",
};

// GET PORTAL UPCOMING EVENTS BY ROLE
export const getPortalUpcomingEvents = (role, params = {}) => {
  const mappedRole = roleMap[role] || role.toLowerCase();
  const endpoint = `/portal/upcoming-events/${mappedRole}`;
  return API.get(endpoint, { params });
};
