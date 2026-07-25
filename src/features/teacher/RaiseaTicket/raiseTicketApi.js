import API from "../../../services/api";

// POST: Raise Ticket
export const raiseTicket = async (data) => {
  const response = await API.post("/tickets/raise", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// GET: All Tickets
export const getTickets = async () => {
  const response = await API.get("/tickets");

  return response.data;
};

export const getDepartments = async () => {
  const response = await API.get("/departments");

  return response.data;
};
// Get Issue Types
export const getIssueTypes = async () => {
  const response = await API.get("/issue-types");
  return response.data;
};

//update ticket
export const updateTicket = async (data) => {
  const response = await API.put(`/tickets/${data.id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

//delete ticket
export const deleteTicket = async (id) => {
  const response = await API.delete(`/tickets/${id}`);
  return response.data;
};
