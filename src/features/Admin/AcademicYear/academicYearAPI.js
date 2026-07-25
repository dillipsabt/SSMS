import API from "../../../api/axios";

export const getAcademicYears = () => API.get("/academic-years");

export const createAcademicYear = (year) =>
  API.post("/academic-years", null, { params: { year } });

export const updateAcademicYear = (id, year) =>
  API.put(`/academic-years/${id}`, null, { params: { year } });

export const deleteAcademicYear = (id) => API.delete(`/academic-years/${id}`);
