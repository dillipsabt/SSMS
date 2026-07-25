import superAdminApi from "../../../SuperAdmin/api/axios";

export const getSuperAdminSchools = (params) =>
  superAdminApi.get("/master/schools", { params });

export const createSuperAdminSchool = (data) =>
  superAdminApi.post("/master/schools", data);

export const updateSuperAdminSchool = ({ id, data }) =>
  superAdminApi.put(`/master/schools/${id}`, data);

export const uploadSuperAdminSchoolLogo = ({ schoolId, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  return superAdminApi.post(`/master/school/media/${schoolId}/logo`, formData);
};

export const deleteSuperAdminSchool = (id) =>
  superAdminApi.delete(`/master/schools/${id}`);
