import API from "../../../services/api";

// ✅ GET ALL TICKETS
export const getTickets = () => {
  return API.get("/tickets");
};

// ✅ CREATE TICKET
export const createTicket = (payload) => {
  return API.post("/tickets/raise", payload);
};

// ✅ UPDATE TICKET (Resolve / Reject)
export const updateTicket = (id, payload) => {
  return API.put(`/tickets/${id}`, payload);
};

// ✅ DELETE TICKET
export const deleteTicket = (id) => {
  return API.delete(`/tickets/${id}`);
};