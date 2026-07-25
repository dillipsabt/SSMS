import API from "../../services/api";

// GET STUDENT NOTIFICATIONS
export const getStudentNotifications = (params = {}) => {
  return API.get("/user-notifications/student", { params });
};

// GET TEACHER NOTIFICATIONS
export const getTeacherNotifications = (params = {}) => {
  return API.get("/user-notifications/teacher", { params });
};

// MARK NOTIFICATION AS READ
export const markNotificationAsRead = (notificationId) => {
  return API.put(`/user-notifications/${notificationId}/read`);
};
