import API from "../../../services/api";

// =====================================
// ANNOUNCEMENTS ENDPOINTS
// =====================================

// GET ALL ANNOUNCEMENTS
export const getAllAnnouncements = (params) => {
  return API.get("/announcements", { params });
};

// GET ANNOUNCEMENT BY ID
export const getAnnouncementById = (announcementId) => {
  return API.get(`/announcements/${announcementId}`);
};

// CREATE ANNOUNCEMENT
export const createAnnouncement = (data) => {
  return API.post("/announcements", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// UPDATE ANNOUNCEMENT
export const updateAnnouncement = (announcementId, data) => {
  return API.put(`/announcements/${announcementId}`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// DELETE ANNOUNCEMENT
export const deleteAnnouncement = (announcementId) => {
  return API.delete(`/announcements/${announcementId}`);
};

// PUBLISH ANNOUNCEMENT
export const publishAnnouncement = (announcementId) => {
  return API.patch(`/announcements/${announcementId}/publish`);
};

// SEND ANNOUNCEMENT
export const sendAnnouncement = (announcementId) => {
  return API.post(`/announcements/${announcementId}/send`);
};

// =====================================
// AUDIENCE DROPDOWN DATA ENDPOINTS
// =====================================

// GET ALL CLASSES
export const getClasses = () => {
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
