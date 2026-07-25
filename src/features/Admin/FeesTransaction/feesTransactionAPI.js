// ==============================================
// src/features/Admin/FeesTransaction/feesTransactionAPI.js
// ==============================================

import API from "../../../services/api";

// ==============================================
// GET STUDENT FEES BY ROLL NUMBER
// ==============================================

export const getStudentFees = async (rollNo) => {
  const response = await API.get(
    `/fees/student/${encodeURIComponent(rollNo)}`
  );

  return response.data;
};

// ==============================================
// CREATE PAYMENT TRANSACTION
// ==============================================

export const createPaymentTransaction = async (data) => {
  const response = await API.post("/fees/payment", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// ==============================================
// GET RECEIPTS
// ==============================================

export const getReceipts = async (params = {}) => {
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? 10,
  };

  if (params.startDate) {
    queryParams.startDate = params.startDate;
  }

  if (params.endDate) {
    queryParams.endDate = params.endDate;
  }

  const response = await API.get("/fees/receipts", {
    params: queryParams,
  });

  return response.data;
};

// ==============================================
// GET RECEIPT BY TRANSACTION ID
// ==============================================

export const getReceiptByTransactionId = async (transactionId) => {
  const response = await API.get(
    `/fees/receipt/${encodeURIComponent(transactionId)}`
  );

  return response.data;
};

// ==============================================
// GET PAYMENT HISTORY BY ROLL NUMBER
// ==============================================

export const getPaymentHistory = async (admissionNo, params = {}) => {
  const queryParams = {
    page: params.page ?? 0,
    size: params.size ?? 10,
  };

  const response = await API.get(
    `/fees/history/${encodeURIComponent(admissionNo)}`,
    {
      params: queryParams,
    }
  );

  return response.data;
};