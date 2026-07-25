import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAllUpcomingEvents,
  getUpcomingEventById,
  createUpcomingEvent,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  publishUpcomingEvents,
  getPublishedUpcomingEvents,
} from "./upcomingEventsAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// =====================================
// ASYNC THUNKS
// =====================================

// GET ALL UPCOMING EVENTS
export const fetchAllUpcomingEvents = createAppAsyncThunk(
  "upcomingEvents/fetchAllUpcomingEvents",
  (params) => getAllUpcomingEvents(params)
);

// GET UPCOMING EVENT BY ID
export const fetchUpcomingEventById = createAppAsyncThunk(
  "upcomingEvents/fetchUpcomingEventById",
  (eventId) => getUpcomingEventById(eventId)
);

// CREATE UPCOMING EVENT
export const createUpcomingEventAsync = createAppAsyncThunk(
  "upcomingEvents/createUpcomingEvent",
  (data) => createUpcomingEvent(data)
);

// UPDATE UPCOMING EVENT
export const updateUpcomingEventAsync = createAppAsyncThunk(
  "upcomingEvents/updateUpcomingEvent",
  ({ id, data }) => updateUpcomingEvent(id, data)
);

// DELETE UPCOMING EVENT
export const deleteUpcomingEventAsync = createAppAsyncThunk(
  "upcomingEvents/deleteUpcomingEvent",
  async (eventId) => {
    await deleteUpcomingEvent(eventId);
    return eventId;
  }
);

// PUBLISH UPCOMING EVENTS
export const publishUpcomingEventsAsync = createAppAsyncThunk(
  "upcomingEvents/publishUpcomingEvents",
  (publishData) => publishUpcomingEvents(publishData)
);

// GET PUBLISHED UPCOMING EVENTS
export const fetchPublishedUpcomingEvents = createAppAsyncThunk(
  "upcomingEvents/fetchPublishedUpcomingEvents",
  (params) => getPublishedUpcomingEvents(params)
);

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  upcomingEventsList: [],
  currentUpcomingEvent: null,
  publishedUpcomingEventsList: [],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  ...commonState,
  successMessage: null,
};

// =====================================
// SLICE
// =====================================

const upcomingEventsSlice = createSlice({
  name: "upcomingEvents",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    resetCurrentEvent: (state) => {
      state.currentUpcomingEvent = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ====== GET ALL UPCOMING EVENTS ======
      .addCase(fetchAllUpcomingEvents.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchAllUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEventsList = action.payload.content || action.payload || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(fetchAllUpcomingEvents.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET UPCOMING EVENT BY ID ======
      .addCase(fetchUpcomingEventById.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchUpcomingEventById.fulfilled, (state, action) => {
        handleSuccess(state);
        state.currentUpcomingEvent = action.payload;
      })

      .addCase(fetchUpcomingEventById.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== CREATE UPCOMING EVENT ======
      .addCase(createUpcomingEventAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createUpcomingEventAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createUpcomingEventAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== UPDATE UPCOMING EVENT ======
      .addCase(updateUpcomingEventAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateUpcomingEventAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateUpcomingEventAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== DELETE UPCOMING EVENT ======
      .addCase(deleteUpcomingEventAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteUpcomingEventAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.upcomingEventsList = state.upcomingEventsList.filter(
          (event) => event.id !== action.payload
        );
      })

      .addCase(deleteUpcomingEventAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== PUBLISH UPCOMING EVENTS ======
      .addCase(publishUpcomingEventsAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(publishUpcomingEventsAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(publishUpcomingEventsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET PUBLISHED UPCOMING EVENTS ======
      .addCase(fetchPublishedUpcomingEvents.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchPublishedUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.publishedUpcomingEventsList = action.payload.content || action.payload || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(fetchPublishedUpcomingEvents.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearError, clearSuccess, resetCurrentEvent } = upcomingEventsSlice.actions;
export default upcomingEventsSlice.reducer;
