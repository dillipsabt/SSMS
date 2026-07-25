import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// ✅ GET ALL
export const getReimbursements = () => {
  return API.get("/reimbursements", {});
};

// ✅ ADD
export const addReimbursement = (payload) => {
  return API.post("/reimbursements", payload, {
    headers: {
      ...getAuthHeader(),
    },
  });
};
