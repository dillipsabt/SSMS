import API from "../../../services/api";

// =====================================
// SCHOOL DETAILS ENDPOINTS
// =====================================

// GET SCHOOL DETAILS
export const getSchoolDetails = () => {
  return API.get("/school-details");
};

// CREATE SCHOOL DETAILS
export const createSchoolDetails = (formData) => {
  return API.post("/school-details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UPDATE SCHOOL DETAILS
export const updateSchoolDetails = (formData) => {
  return API.put("/school-details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE SCHOOL LOGO
export const deleteSchoolLogo = () => {
  return API.delete("/school-details/logo");
};
