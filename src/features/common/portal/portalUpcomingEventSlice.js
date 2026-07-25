import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import { getPortalUpcomingEvents } from "./upcomingEventPortalApi";

export const getPortalUpcomingEventsAsync = createAppAsyncThunk(
  "portalUpcomingEvent/getPortalUpcomingEvents",
  ({ role, title, eventDate }) => {
    const params = {};
    if (title) params.title = title;
    if (eventDate) params.eventDate = eventDate;
    return getPortalUpcomingEvents(role, params);
  }
);

const initialState = {
  todayEvents: [],
  earlierEvents: [],
  ...commonState,
};

const portalUpcomingEventSlice = createSlice({
  name: "portalUpcomingEvent",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPortalUpcomingEventsAsync.pending, handlePending)
      .addCase(getPortalUpcomingEventsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.todayEvents = action.payload.today || [];
        state.earlierEvents = action.payload.earlier || [];
        state.success = true;
      })
      .addCase(getPortalUpcomingEventsAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = portalUpcomingEventSlice.actions;
export default portalUpcomingEventSlice.reducer;
