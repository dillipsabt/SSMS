import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import { fetchTeacherDashboardAPI } from "./teacherDashboardAPI";

export const fetchTeacherDashboard = createAppAsyncThunk(
  "teacherDashboard/fetchDashboard",
  () => fetchTeacherDashboardAPI()
);

const initialState = {
  profile: null,
  attendance: null,
  upcomingEvents: [],
  leaveRequests: [],
  homeworkAssignments: [],
  studentMarks: [],
  todayClasses: [],
  ...commonState,
};

const teacherDashboardSlice = createSlice({
  name: "teacherDashboard",
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
      .addCase(fetchTeacherDashboard.pending, handlePending)
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile || null;
        state.attendance = action.payload.attendance || null;
        state.upcomingEvents = action.payload.upcomingEvents || [];
        state.leaveRequests = action.payload.leaveRequests || [];
        state.homeworkAssignments = action.payload.homeworkAssignments || [];
        state.studentMarks = action.payload.studentMarks || [];
        state.todayClasses = action.payload.todayClasses || [];
      })
      .addCase(fetchTeacherDashboard.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = teacherDashboardSlice.actions;
export default teacherDashboardSlice.reducer;
