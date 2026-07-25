import API from "../../../services/api";

// ✅ GET ALL TEACHERS
export const getTeachers = () => {
  return API.get("/teachers");
};

// ✅ GET SINGLE TEACHER BY ID
export const getTeacherById = (id) => {
  return API.get(`/teachers/${id}`);
};

// ✅ ADD TEACHER
export const addTeacher = (formData) => {
  return API.post("/teachers", formData);
};

// ✅ UPDATE TEACHER
export const updateTeacher = (id, formData) => {
  return API.put(`/teachers/${id}`, formData);
};

// ✅ DELETE TEACHER
export const deleteTeacher = (id) => {
  return API.delete(`/teachers/${id}`);
};

// ✅ TEACHER TIMETABLE
export const getTeacherTimetable = (teacherId, date) => {
  return API.get(`/timetable/teacher/${teacherId}/date/${date}`);
};

// ✅ GET RELIGIONS
export const getReligions = () => {
  return API.get("/religions");
};

// ✅ GET BLOOD GROUPS
export const getBloodGroups = () => {
  return API.get("/blood-groups");
};

// ✅ GET SUBJECTS
export const getSubjectsAPI = () => {
  return API.get("/subjects");
};
