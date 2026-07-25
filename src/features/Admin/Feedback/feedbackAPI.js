import API from "../../../services/api";

// GET ALL FEEDBACKS
export const getAllFeedbacks = (params) => {
  return API.get("/feedback", { params });
};

// GET FEEDBACK BY ID
export const getFeedbackById = (feedbackId) => {
  return API.get(`/feedback/view/${feedbackId}`);
};

// CREATE FEEDBACK
export const createFeedback = (data) => {
  return API.post("/feedback/create", data);
};

// UPDATE FEEDBACK
export const updateFeedback = (feedbackId, data) => {
  return API.put(`/feedback/${feedbackId}`, data);
};

// UPDATE FEEDBACK STATUS
export const updateFeedbackStatus = (feedbackId, data) => {
  return API.patch(`/feedback/${feedbackId}/status`, data);
};

// GET CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};

// GET ALL FEEDBACK SUBMISSIONS
export const getAllFeedbackSubmissions = (params) => {
  return API.get("/admin/feedback/submissions", { params });
};

// GET FEEDBACK SUBMISSION BY ID
export const getFeedbackSubmissionById = (submissionId) => {
  return API.get(`/admin/feedback/submissions/${submissionId}`);
};