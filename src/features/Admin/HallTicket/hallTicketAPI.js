import API from "../../../services/api";

export const getHallTicketExams = () =>
  API.get("/exams");

export const generateHallTickets = (data) =>
  API.post("/hall-ticket/generate", data);

export const getStudentWiseHallTickets = (params) =>
  API.get("/hall-ticket/student-wise", { params });

export const publishHallTickets = (data) =>
  API.post("/hall-ticket/publish", data);

export const deleteHallTicket = (hallTicketId) =>
  API.delete(`/hall-ticket/${hallTicketId}`);

export const downloadHallTicket = (hallTicketId) =>
  API.get(`/hall-ticket/download/${hallTicketId}`, {
    responseType: "blob",
  });
