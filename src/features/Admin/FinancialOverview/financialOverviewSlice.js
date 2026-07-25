import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getExpenseBreakdown,
  getFinancialDashboard,
  getFinancialTrend,
  getRevenueBreakdown,
} from "./financialOverviewAPI";

export const fetchFinancialDashboard = createAppAsyncThunk(
  "financialOverview/fetchFinancialDashboard",
  getFinancialDashboard,
);

export const fetchRevenueBreakdown = createAppAsyncThunk(
  "financialOverview/fetchRevenueBreakdown",
  getRevenueBreakdown,
);

export const fetchExpenseBreakdown = createAppAsyncThunk(
  "financialOverview/fetchExpenseBreakdown",
  getExpenseBreakdown,
);

export const fetchFinancialTrend = createAppAsyncThunk(
  "financialOverview/fetchFinancialTrend",
  getFinancialTrend,
);

const initialState = {
  dashboard: null,
  revenueBreakdown: null,
  expenseBreakdown: null,
  trend: [],
  loadingDashboard: false,
  loadingRevenueBreakdown: false,
  loadingExpenseBreakdown: false,
  loadingTrend: false,
  error: null,
};

const setRejected = (state, action, loadingKey) => {
  state[loadingKey] = false;
  state.error = action.payload || action.error?.message || "Something went wrong";
};

const financialOverviewSlice = createSlice({
  name: "financialOverview",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialDashboard.pending, (state) => {
        state.loadingDashboard = true;
        state.error = null;
      })
      .addCase(fetchFinancialDashboard.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboard = action.payload || null;
      })
      .addCase(fetchFinancialDashboard.rejected, (state, action) => {
        setRejected(state, action, "loadingDashboard");
      })
      .addCase(fetchRevenueBreakdown.pending, (state) => {
        state.loadingRevenueBreakdown = true;
        state.error = null;
      })
      .addCase(fetchRevenueBreakdown.fulfilled, (state, action) => {
        state.loadingRevenueBreakdown = false;
        state.revenueBreakdown = action.payload || null;
      })
      .addCase(fetchRevenueBreakdown.rejected, (state, action) => {
        setRejected(state, action, "loadingRevenueBreakdown");
      })
      .addCase(fetchExpenseBreakdown.pending, (state) => {
        state.loadingExpenseBreakdown = true;
        state.error = null;
      })
      .addCase(fetchExpenseBreakdown.fulfilled, (state, action) => {
        state.loadingExpenseBreakdown = false;
        state.expenseBreakdown = action.payload || null;
      })
      .addCase(fetchExpenseBreakdown.rejected, (state, action) => {
        setRejected(state, action, "loadingExpenseBreakdown");
      })
      .addCase(fetchFinancialTrend.pending, (state) => {
        state.loadingTrend = true;
        state.error = null;
      })
      .addCase(fetchFinancialTrend.fulfilled, (state, action) => {
        state.loadingTrend = false;
        state.trend = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFinancialTrend.rejected, (state, action) => {
        setRejected(state, action, "loadingTrend");
      });
  },
});

export const { clearError } = financialOverviewSlice.actions;
export default financialOverviewSlice.reducer;
