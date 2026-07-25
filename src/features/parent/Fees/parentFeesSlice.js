import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getParentFeesLedger } from "./parentFeesAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchParentFeesLedger = createAppAsyncThunk(
  "parentFees/fetchLedger",
  () => getParentFeesLedger()
);

const initialState = {
  totalFees: 0,
  paidFees: 0,
  pendingFees: 0,
  transactions: [],
  ...commonState,
};

const parentFeesSlice = createSlice({
  name: "parentFees",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentFeesLedger.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchParentFeesLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.totalFees = action.payload.totalFees || 0;
        state.paidFees = action.payload.paidFees || 0;
        state.pendingFees = action.payload.pendingFees || 0;
        state.transactions = action.payload.transactions || [];
      })
      .addCase(fetchParentFeesLedger.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearError } = parentFeesSlice.actions;
export default parentFeesSlice.reducer;
