import API from "../../../services/api";

// ✅ GET ALL REIMBURSEMENTS
export const getReimbursements = () => {
  return API.get("/reimbursements");
};

// ✅ UPDATE STATUS (APPROVE / REJECT)
export const updateReimbursementStatus = (id, payload) => {
  return API.put(`/reimbursements/${id}`, payload);
};