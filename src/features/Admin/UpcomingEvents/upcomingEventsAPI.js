import API from "../../../services/api";

// =====================================
// UPCOMING EVENTS ENDPOINTS
// =====================================

// GET ALL UPCOMING EVENTS
export const getAllUpcomingEvents = (params) => {
  return API.get("/upcoming-events", { params });
};

// GET UPCOMING EVENT BY ID
export const getUpcomingEventById = (eventId) => {
  return API.get(`/upcoming-events/${eventId}`);
};

// CREATE UPCOMING EVENT
export const createUpcomingEvent = (data) => {
  return API.post("/upcoming-events", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// UPDATE UPCOMING EVENT
export const updateUpcomingEvent = (eventId, data) => {
  return API.put(`/upcoming-events/${eventId}`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// DELETE UPCOMING EVENT
export const deleteUpcomingEvent = (eventId) => {
  return API.delete(`/upcoming-events/${eventId}`);
};

// PUBLISH UPCOMING EVENTS
export const publishUpcomingEvents = (publishData) => {
  return API.post("/upcoming-events/publish", publishData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// GET PUBLISHED UPCOMING EVENTS
export const getPublishedUpcomingEvents = (params) => {
  return API.get("/upcoming-events/published", { params });
};
