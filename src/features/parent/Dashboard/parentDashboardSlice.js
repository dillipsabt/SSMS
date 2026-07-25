import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import { fetchParentDashboardAPI, getParentStudentsAPI } from "./parentDashboardAPI";

export const fetchParentStudents = createAppAsyncThunk(
  "parentDashboard/fetchStudents",
  () => getParentStudentsAPI()
);

export const fetchParentDashboard = createAppAsyncThunk(
  "parentDashboard/fetchDashboard",
  (params) => fetchParentDashboardAPI(params)
);

const initialState = {
  students: [],
  selectedStudentId: null,
  studentProfile: null,
  performance: null,
  upcomingEvents: [],
  attendance: null,
  dailyClasses: [],
  leaveStatus: [],
  feesReminder: null,
  assignments: [],
  examResults: [],
  noticeBoard: [],
  ...commonState,
};

const parentDashboardSlice = createSlice({
  name: "parentDashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentStudents.pending, handlePending)
      .addCase(fetchParentStudents.fulfilled, (state, action) => {
        state.loading = false;
        const studentsData = Array.isArray(action.payload) ? action.payload : [];
        state.students = studentsData;
        if (studentsData.length > 0 && !state.selectedStudentId) {
          state.selectedStudentId = studentsData[0].id;
        }
      })
      .addCase(fetchParentStudents.rejected, handleRejected)
      .addCase(fetchParentDashboard.pending, handlePending)
      .addCase(fetchParentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.studentProfile = action.payload.studentProfile || null;
        state.performance = action.payload.performance || null;
        state.upcomingEvents = action.payload.upcomingEvents || [];
        state.attendance = action.payload.attendance || null;
        state.dailyClasses = action.payload.dailyClasses || [];
        state.leaveStatus = action.payload.leaveStatus || [];
        state.feesReminder = action.payload.feesReminder || null;
        state.assignments = action.payload.assignments || [];
        state.examResults = action.payload.examResults || [];
        state.noticeBoard = action.payload.noticeBoard || [];
      })
      .addCase(fetchParentDashboard.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, setSelectedStudent } = parentDashboardSlice.actions;
export default parentDashboardSlice.reducer;
