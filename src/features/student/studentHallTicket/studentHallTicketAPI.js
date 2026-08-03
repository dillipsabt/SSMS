import API from "../../../services/api";

export const getStudentHallTickets = () => API.get("/hall-ticket/student");

export const downloadStudentHallTicket = (hallTicketNo) =>
  API.get(`/hall-ticket/download/${hallTicketNo}`);
