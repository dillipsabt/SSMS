import API from "../../../services/api";

export const getHallTicketExams = ({ academicYearId, classId }) =>
  API.get("/exams/published/dropdown", { params: { academicYearId, classId } });

export const generateHallTickets = (data) =>
  API.post("/hall-ticket/generate", data);

export const getStudentWiseHallTickets = (params) =>
  API.get("/hall-ticket/student-wise", { params });

export const publishHallTickets = (data) =>
  API.post("/hall-ticket/publish", data);

export const deleteHallTicket = (hallTicketId) =>
  API.delete(`/hall-ticket/${hallTicketId}`);

export const getAdminHallTicketDetails = (hallTicketNo) =>
  API.get(`/hall-ticket/admin/${hallTicketNo}`);

export const downloadHallTicket = (hallTicketNo) =>
  API.get(`/hall-ticket/download/${hallTicketNo}`, {});
