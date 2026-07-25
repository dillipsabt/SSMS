import API from "../../../services/api";

// =====================================
// TRANSFER CERTIFICATE ENDPOINTS
// =====================================

// GET ALL TRANSFER CERTIFICATES
export const getTransferCertificates = (params) => {
  return API.get("/transfer-certificates", { params });
};

// GET TRANSFER CERTIFICATE BY ID
export const getTransferCertificateById = (certificateId) => {
  return API.get(`/transfer-certificates/${certificateId}`);
};

// CREATE TRANSFER CERTIFICATE
export const createTransferCertificate = (data) => {
  return API.post("/transfer-certificates", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// UPDATE TRANSFER CERTIFICATE
export const updateTransferCertificate = (certificateId, data) => {
  return API.put(`/transfer-certificates/${certificateId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// DELETE TRANSFER CERTIFICATE
export const deleteTransferCertificate = (certificateId) => {
  return API.delete(`/transfer-certificates/${certificateId}`);
};

// GET STUDENT DETAILS BY ADMISSION NO
export const getStudentDetailsByAdmissionNo = (admissionNo) => {
  return API.get("/transfer-certificates/student-details", {
    params: { admissionNo },
  });
};

// =====================================
// SCHOOL DETAILS
// =====================================

// GET SCHOOL DETAILS
export const getSchoolDetails = () => {
  return API.get("/school-details");
};
