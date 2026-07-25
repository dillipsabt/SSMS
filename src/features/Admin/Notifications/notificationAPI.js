import API from "../../../services/api";

// =====================================
// NOTIFICATION ENDPOINTS
// =====================================

// GET ALL NOTIFICATIONS
export const getAllNotifications = (params) => {
  return API.get("/notifications", { params });
};

// GET NOTIFICATION BY ID
export const getNotificationById = (notificationId) => {
  return API.get(`/notifications/${notificationId}`);
};

// CREATE NOTIFICATION
export const createNotification = (data) => {
  return API.post("/notifications", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// DELETE NOTIFICATION
export const deleteNotification = (notificationId) => {
  return API.delete(`/notifications/${notificationId}`);
};

// =====================================
// AUDIENCE DROPDOWN DATA ENDPOINTS
// =====================================

// GET ALL CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};

// GET CLASS SECTIONS (returns section data within class response)
export const getClassSections = () => {
  return API.get("/classes/get-all");
};

// GET ALL STUDENTS
export const getStudents = () => {
  return API.get("/students");
};

// GET ALL TEACHERS
export const getTeachers = () => {
  return API.get("/teachers");
};

// GET ALL DEPARTMENTS
export const getDepartments = () => {
  return API.get("/departments");
};

// GET ALL SUBJECTS
export const getSubjects = () => {
  return API.get("/subjects");
};

// GET ALL STUDENT GROUPS
export const getStudentGroups = () => {
  return API.get("/groups");
};
