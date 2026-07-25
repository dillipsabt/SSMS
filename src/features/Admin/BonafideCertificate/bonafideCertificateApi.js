import API from "../../../services/api";

// =====================================
// BONAFIDE CERTIFICATE ENDPOINTS
// =====================================

// GET ALL BONAFIDE CERTIFICATES
export const getBonafideCertificates = (params) => {
  return API.get("/bonafide-certificates", { params });
};

// GET BONAFIDE CERTIFICATE BY ID
export const getBonafideCertificateById = (certificateId) => {
  return API.get(`/bonafide-certificates/${certificateId}`);
};

// CREATE BONAFIDE CERTIFICATE
export const createBonafideCertificate = (data) => {
  return API.post("/bonafide-certificates", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// UPDATE BONAFIDE CERTIFICATE
export const updateBonafideCertificate = (certificateId, data) => {
  return API.put(`/bonafide-certificates/${certificateId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// DELETE BONAFIDE CERTIFICATE
export const deleteBonafideCertificate = (certificateId) => {
  return API.delete(`/bonafide-certificates/${certificateId}`);
};

// GET STUDENT DETAILS BY ADMISSION NO
export const getStudentDetailsByAdmissionNo = (admissionNo) => {
  return API.get("/bonafide-certificates/student-details", {
    params: { admissionNo },
  });
};
