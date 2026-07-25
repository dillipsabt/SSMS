import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import {
  fetchStaffDashboardAPI,
  fetchStaffAttendanceChartAPI,
} from "./staffDashboardAPI";

export const getStaffDashboardAsync = createAsyncThunk(
  "staffDashboard/getStaffDashboard",
  async (staffId, { rejectWithValue }) => {
    try {
      const response = await fetchStaffDashboardAPI(staffId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch dashboard");
    }
  },
);

export const getStaffAttendanceChartAsync = createAsyncThunk(
  "staffDashboard/getStaffAttendanceChart",
  async (staffId, { rejectWithValue }) => {
    try {
      const response = await fetchStaffAttendanceChartAPI(staffId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch attendance chart");
    }
  },
);

const initialState = {
  dashboardData: null,
  attendanceChartData: null,
  ...commonState,
};

const staffDashboardSlice = createSlice({
  name: "staffDashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetStaffDashboard: () => initialState,
    resetDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStaffDashboardAsync.pending, handlePending)
      .addCase(getStaffDashboardAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getStaffDashboardAsync.rejected, handleRejected)
      .addCase(getStaffAttendanceChartAsync.pending, handlePending)
      .addCase(getStaffAttendanceChartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceChartData = action.payload;
      })
      .addCase(getStaffAttendanceChartAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, resetStaffDashboard, resetDashboardError } = staffDashboardSlice.actions;
export default staffDashboardSlice.reducer;
