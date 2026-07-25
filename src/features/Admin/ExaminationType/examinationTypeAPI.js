import API from "../../../api/axios";

export const getExaminationTypes = () => API.get("/examination-types");

export const createExaminationType = (examType) =>
  API.post("/examination-types", null, { params: { examType } });

export const updateExaminationType = (id, examType) =>
  API.put(`/examination-types/${id}`, null, { params: { examType } });

export const deleteExaminationType = (id) => API.delete(`/examination-types/${id}`);
