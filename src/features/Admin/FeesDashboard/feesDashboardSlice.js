import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import { getDashboardSummary, getDashboardTrends } from "./feesDashboardAPI";

export const fetchDashboardSummary = createAppAsyncThunk(
  "feesDashboard/fetchDashboardSummary",
  () => getDashboardSummary()
);

export const fetchDashboardTrends = createAppAsyncThunk(
  "feesDashboard/fetchDashboardTrends",
  ({ academicYearId, billingType }) => getDashboardTrends(academicYearId, billingType)
);

const initialState = {
  summary: {
    totalRevenue: 0,
    totalReceived: 0,
    totalOutstanding: 0,
    collectionPercentage: 0,
    recentTransactions: [],
  },
  trends: [],
  ...commonState,
};

const feesDashboardSlice = createSlice({
  name: "feesDashboard",
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
      .addCase(fetchDashboardSummary.pending, handlePending)
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, handleRejected)

      .addCase(fetchDashboardTrends.pending, handlePending)
      .addCase(fetchDashboardTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchDashboardTrends.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = feesDashboardSlice.actions;
export default feesDashboardSlice.reducer;
