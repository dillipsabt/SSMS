import API from "../../../services/api";

export const getStudentHallTickets = () => API.get("/hall-ticket/student");

export const downloadStudentHallTicket = (hallTicketId) =>
  API.get(`/hall-ticket/download/${hallTicketId}`, {
    responseType: "blob",
  });
