import API from "../../../services/api";

// =========================
// 📌 STAFF APIs
// =========================

// GET ALL STAFF
export const getStaffAPI = () => {
  return API.get("/staff");
};

// GET STAFF BY ID
export const getStaffByIdAPI = (id) => {
  return API.get(`/staff/${id}`);
};

// ADD STAFF
export const addStaffAPI = (formData) => {
  return API.post("/staff", formData);
};

// UPDATE STAFF
export const updateStaffAPI = (id, formData) => {
  return API.put(`/staff/${id}`, formData);
};

// DELETE STAFF
export const deleteStaffAPI = (id) => {
  return API.delete(`/staff/${id}`);
};

// =========================
// 📌 MASTER DATA (same style as teacher)
// =========================

// GET RELIGIONS
export const getReligionsAPI = () => {
  return API.get("/religions");
};

// GET BLOOD GROUPS
export const getBloodGroupsAPI = () => {
  return API.get("/blood-groups");
};

// GET DEPARTMENTS
export const getDepartmentsAPI = () => {
  return API.get("/departments");
};
