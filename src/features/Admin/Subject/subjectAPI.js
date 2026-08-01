import API from "../../../services/api";

export const getSubjects = (params = {}) => {
  return API.get("/subjects", { params });
};

export const getSubjectById = (id) => {
  return API.get(`/subjects/${id}`);
};

export const createSubject = (data) => {
  return API.post("/subjects", data);
};

export const updateSubject = (id, data) => {
  return API.put(`/subjects/${id}`, data);
};

export const deleteSubject = (id) => {
  return API.delete(`/subjects/${id}`);
};
