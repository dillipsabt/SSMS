import API from "../../../services/api";

// GET ALL CLASSES
export const getClasses = (params = {}) => {
  return API.get("/classes/get-all", { params });
};

// GET CLASS BY ID
export const getClassById = (id) => {
  return API.get(`/classes/${id}`);
};

// CREATE CLASS
export const createClass = (data) => {
  return API.post("/classes/create", data);
};

// UPDATE CLASS
export const updateClass = (id, data) => {
  return API.put(`/classes/${id}`, data);
};

// DELETE CLASS
export const deleteClass = (id) => {
  return API.delete(`/classes/${id}`);
};
