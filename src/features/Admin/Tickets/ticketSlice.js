import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "./ticketAPI";

export const fetchTickets = createAppAsyncThunk(
  "tickets/fetch",
  () => getTickets()
);

export const addTicket = createAppAsyncThunk(
  "tickets/add",
  (payload) => createTicket(payload)
);

export const editTicket = createAppAsyncThunk(
  "tickets/update",
  ({ id, payload }) => updateTicket(id, payload)
);

export const removeTicket = createAppAsyncThunk(
  "tickets/delete",
  async (id) => {
    await deleteTicket(id);
    return id;
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    data: [],
    loading: false,
    updateLoading: false,
    deleteLoading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })

      /* CREATE */
      .addCase(addTicket.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })

/* UPDATE */
      .addCase(editTicket.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(editTicket.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.data.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(editTicket.rejected, (state) => {
        state.updateLoading = false;
      })

/* DELETE */
      .addCase(removeTicket.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(removeTicket.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.data = state.data.filter(
          (d) => d.id !== action.payload
        );
      })
      .addCase(removeTicket.rejected, (state) => {
        state.deleteLoading = false;
      });
  },
});

export default ticketSlice.reducer;
