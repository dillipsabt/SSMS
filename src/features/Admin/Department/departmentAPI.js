import API from "../../../services/api";

// GET ALL DEPARTMENTS
export const getDepartments = (params = {}) => {
  return API.get("/departments", { params });
};

// GET DEPARTMENT BY ID
export const getDepartmentById = (id) => {
  return API.get(`/departments/${id}`);
};

// CREATE DEPARTMENT
export const createDepartment = (data) => {
  return API.post("/departments", data);
};

// UPDATE DEPARTMENT
export const updateDepartment = (id, data) => {
  return API.put(`/departments/${id}`, data);
};

// DELETE DEPARTMENT
export const deleteDepartment = (id) => {
  return API.delete(`/departments/${id}`);
};
