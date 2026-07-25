import API from "../../../services/api";

export const getBranches = (params = {}) => {
  return API.get("/branches", { params });
};

export const getBranchById = (id) => {
  return API.get(`/branches/${id}`);
};

export const createBranch = (data) => {
  return API.post("/branches", data);
};

export const updateBranch = (id, data) => {
  return API.put(`/branches/${id}`, data);
};

export const deleteBranch = (id) => {
  return API.delete(`/branches/${id}`);
};
