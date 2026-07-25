import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import {
  getDashboardData,
  updateLeaveStatus,
  getClasses,
  getClassPerformance,
  getAttendance,
} from "./dashboardAPI";

export const fetchDashboardData = createAppAsyncThunk(
  "dashboard/fetchDashboardData",
  (params) => getDashboardData(params)
);

export const updateLeaveRequestStatus = createAppAsyncThunk(
  "dashboard/updateLeaveStatus",
  ({ id, tabContext, status, comments = "" }) => updateLeaveStatus(id, tabContext, status, comments)
);

export const fetchClasses = createAppAsyncThunk(
  "dashboard/fetchClasses",
  () => getClasses()
);

export const fetchClassPerformance = createAppAsyncThunk(
  "dashboard/fetchClassPerformance",
  (classId) => getClassPerformance(classId)
);

export const fetchAttendance = createAsyncThunk(
  "dashboard/fetchAttendance",
  async (
    { tab = "STUDENT", breakdownType = "TODAY" },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAttendance(tab, breakdownType);
      return {
        ...response.data,
        tab,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch attendance"
      );
    }
  }
);

const initialState = {
  dashboardData: {
    studentsOverview: { total: 0, active: 0, leaves: 0 },
    teachersOverview: { total: 0, active: 0, leaves: 0 },
    staffOverview: { total: 0, active: 0, leaves: 0 },
    subjectsOverview: { totalSubjects: 0, totalClasses: 0 },
    attendance: {
      percentage: 0,
      present: 0,
      absent: 0,
      halfDay: 0,
      late: 0,
    },
    performance: {
      statusLabel: "",
      topStudents: 0,
      averageStudents: 0,
      belowAverageStudents: 0,
    },
    upcomingEvents: [],
    bestPerformer: { name: "", subtitle: "" },
    starStudent: { name: "", subtitle: "" },
    leaveRequests: [],
    feesOverview: {
      totalFees: 0,
      totalFeesReceived: 0,
      totalOutstanding: 0,
      receivedPercentage: 0,
    },
    notices: [],
  },
  classPerformance: {
    statusLabel: "",
    topStudents: 0,
    averageStudents: 0,
    belowAverageStudents: 0,
  },
  attendanceData: {
    STUDENT: {
      percentage: 0,
      present: 0,
      absent: 0,
      halfDay: 0,
      late: 0,
    },
    TEACHER: {
      percentage: 94,
      present: 23,
      absent: 1,
      halfDay: 1,
      late: 0,
    },
    STAFF: {
      percentage: 97,
      present: 14,
      absent: 0,
      halfDay: 1,
      late: 0,
    },
  },
  classes: [],
  successMessage: null,
  ...commonState,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, handlePending)
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, handleRejected)

      .addCase(updateLeaveRequestStatus.pending, handlePending)
      .addCase(updateLeaveRequestStatus.fulfilled, (state, action) => {
        handleSuccess(state);
        state.successMessage = action.payload?.responseStatusInfo || "Leave status updated successfully";
        const updatedLeave = action.payload;
        if (updatedLeave?.id && state.dashboardData.leaveRequests) {
          state.dashboardData.leaveRequests = state.dashboardData.leaveRequests.map((item) =>
            item.id === updatedLeave.id ? updatedLeave : item
          );
        }
      })
      .addCase(updateLeaveRequestStatus.rejected, handleRejected)

      .addCase(fetchClasses.pending, handlePending)
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload || [];
      })
      .addCase(fetchClasses.rejected, handleRejected)

      .addCase(fetchClassPerformance.pending, handlePending)
      .addCase(fetchClassPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.classPerformance = action.payload;
      })
      .addCase(fetchClassPerformance.rejected, handleRejected)

      .addCase(fetchAttendance.pending, handlePending)
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const { tab, ...attendanceData } = action.payload;
        state.attendanceData[tab] = attendanceData;
      })
      .addCase(fetchAttendance.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = dashboardSlice.actions;
export default dashboardSlice.reducer;
