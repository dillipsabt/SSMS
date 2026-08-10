import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// ✅ GET ALL STUDENTS
export const getAdminStudents = () => {
  return API.get("/students");
};

// ✅ GET SINGLE STUDENT BY ID
export const getAdminStudentById = (id) => {
  return API.get(`/students/${id}`);
};

// ✅ ADD STUDENT
export const addAdminStudent = (formData) => {
  return API.post("/students", formData, {
    headers: {
      ...getAuthHeader(),
    },
  });
};

// ✅ UPDATE STUDENT
export const updateAdminStudent = (id, formData) => {
  return API.put(`/students/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
    },
  });
};

// ✅ DELETE STUDENT
export const deleteAdminStudent = (id) => {
  return API.delete(`/students/${id}`);
};

// ✅ GET RELIGIONS
export const getAdminReligions = () => {
  return API.get("/religions");
};

// ✅ GET BLOOD GROUPS
export const getAdminBloodGroups = () => {
  return API.get("/blood-groups");
};

// ✅ GET CASTS
export const getAdminCasts = () => {
  return API.get("/castes");
};

// =========================
// GET ALL CLASSES
// =========================
export const fetchClassesAPI = () => {
  return API.get("/classes/get-all");
};

export const getStudentIdCardList = (classId) =>
  API.get("/students/id-card-list", { params: { classId } });

export const getStudentIdCardDetails = (studentId) =>
  API.get("/students/download-id-card", { params: { studentId } });
