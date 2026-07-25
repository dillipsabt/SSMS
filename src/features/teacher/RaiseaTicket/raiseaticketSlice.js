import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  raiseTicket,
  getTickets,
  getDepartments,
  getIssueTypes,
  updateTicket,
  deleteTicket,
} from "./raiseTicketApi";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const getTicketsThunk = createAppAsyncThunk(
  "ticket/getAll",
  () => getTickets()
);

export const getDepartmentsThunk = createAppAsyncThunk(
  "ticket/departments",
  () => getDepartments()
);

export const getIssueTypesThunk = createAppAsyncThunk(
  "ticket/issue-types",
  () => getIssueTypes()
);

export const raiseTicketThunk = createAppAsyncThunk(
  "ticket/raise",
  (ticketData) => raiseTicket(ticketData)
);

export const updateTicketThunk = createAppAsyncThunk(
  "ticket/update",
  (payload) => updateTicket(payload)
);

export const deleteTicketThunk = createAppAsyncThunk(
  "ticket/delete",
  (id) => deleteTicket(id)
);

// 🔹 Initial state
const initialState = {
  list: [],
  departments: [],
  issueTypes: [],
  ...commonState,
};

// 🔹 Slice
const raiseTicketSlice = createSlice({
  name: "raiseTicket",
  initialState,
  reducers: {
    resetTicketState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.list = [];
      state.departments = [];
      state.issueTypes = [];
      // state.ticket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(raiseTicketThunk.pending, (state) => {
        handlePending(state);
      })
      .addCase(raiseTicketThunk.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(raiseTicketThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })
      .addCase(getTicketsThunk.fulfilled, (state, action) => {
        state.list = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(getDepartmentsThunk.fulfilled, (state, action) => {
        state.departments = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(getIssueTypesThunk.fulfilled, (state, action) => {
        state.issueTypes = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(updateTicketThunk.pending, (state) => {
        handlePending(state);
      })
      .addCase(updateTicketThunk.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(updateTicketThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })
      .addCase(deleteTicketThunk.pending, (state) => {
        handlePending(state);
      })
      .addCase(deleteTicketThunk.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(deleteTicketThunk.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { resetTicketState } = raiseTicketSlice.actions;
export default raiseTicketSlice.reducer;
