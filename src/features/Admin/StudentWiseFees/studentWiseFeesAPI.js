// ==============================================
// src/features/Admin/StudentWiseFees/studentWiseFeesAPI.js
// ==============================================

import API from "../../../services/api";

// ==============================================
// GET ALL STUDENT WISE FEES
// ==============================================

export const getStudentWiseFees = (params = {}) => {
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? 10,
  };

  return API.get("/student-wise-fees", {
    params: queryParams,
  });
};

// ==============================================
// GET BY ID
// ==============================================

export const getStudentWiseFeesById = (id) => {
  return API.get(`/student-wise-fees/${id}`);
};

// ==============================================
// CREATE
// ==============================================

export const createStudentWiseFees = (data) => {
  const formData = new FormData();

  formData.append("rollNo", data.rollNo);
  formData.append("concessionFees", data.concessionFees);

  if (data.document) {
    formData.append("document", data.document);
  }

  return API.post("/student-wise-fees", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==============================================
// UPDATE
// ==============================================

export const updateStudentWiseFees = (id, data) => {
  const formData = new FormData();

  if (data.rollNo) {
    formData.append("rollNo", data.rollNo);
  }

  if (data.concessionFees !== undefined) {
    formData.append("concessionFees", data.concessionFees);
  }

  if (data.document) {
    formData.append("document", data.document);
  }

  return API.put(`/student-wise-fees/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==============================================
// DELETE
// ==============================================

export const deleteStudentWiseFees = (id) => {
  return API.delete(`/student-wise-fees/${id}`);
};

// ==============================================
// GET STUDENT BY ROLL NUMBER
// ==============================================

export const getStudentByRollNumber = async (rollNo) => {
  const response = await API.get(`/fees/student/${encodeURIComponent(rollNo)}`);
  return response.data;
};
