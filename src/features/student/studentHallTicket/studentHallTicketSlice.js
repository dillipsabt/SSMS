import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  downloadStudentHallTicket,
  getStudentHallTickets,
} from "./studentHallTicketAPI";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchStudentHallTickets = createAppAsyncThunk(
  "studentHallTicket/fetchAll",
  () => getStudentHallTickets(),
);

export const downloadStudentHallTicketAsync = createAppAsyncThunk(
  "studentHallTicket/download",
  (hallTicketId) => downloadStudentHallTicket(hallTicketId),
);

const studentHallTicketSlice = createSlice({
  name: "studentHallTicket",
  initialState: {
    hallTickets: [],
    ...commonState,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentHallTickets.pending, handlePending)
      .addCase(fetchStudentHallTickets.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.hallTickets = Array.isArray(payload)
          ? payload
          : payload?.content || payload?.data || [];
      })
      .addCase(fetchStudentHallTickets.rejected, handleRejected)
      .addCase(downloadStudentHallTicketAsync.rejected, handleRejected);
  },
});

export const { clearError } = studentHallTicketSlice.actions;
export default studentHallTicketSlice.reducer;
