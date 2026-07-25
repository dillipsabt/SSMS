import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// GET PARENT FEEDBACK
export const getParentFeedbackAPI = (studentId) => {
  return API.get(`/parent/feedback/view/forms/${studentId}`, {
    headers: getAuthHeader(),
  });
};

// SUBMIT FEEDBACK
export const submitFeedbackAPI = (data) => {
  return API.post("/parent/feedback/submit", data, {
    headers: getAuthHeader(),
  });
};