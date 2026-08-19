import API from "../../../services/api";

export const createPayslipAPI = (payload) =>
  API.post("/payslips", payload, { skipErrorToast: true });

export const getPayslipAPI = (id) =>
  API.get(`/payslips/${id}`, { skipErrorToast: true });

export const deletePayslipAPI = (id) =>
  API.delete(`/payslips/${id}`, { skipErrorToast: true });
