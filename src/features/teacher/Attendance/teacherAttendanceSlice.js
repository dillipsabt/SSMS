import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import {
  punchInTeacherAPI,
  punchOutTeacherAPI,
  fetchTeacherAttendanceAPI,
  fetchTeacherAttendanceHistoryAPI,
} from "./teacherAttendanceAPI";

export const punchInTeacher = createAppAsyncThunk(
  "teacherAttendance/punchIn",
  (data) => punchInTeacherAPI(data)
);

export const punchOutTeacher = createAppAsyncThunk(
  "teacherAttendance/punchOut",
  (data) => punchOutTeacherAPI(data)
);

export const fetchTeacherAttendance = createAppAsyncThunk(
  "teacherAttendance/fetchList",
  ({ teacherId }) => fetchTeacherAttendanceAPI().then((response) => ({
    response: response?.data ?? response,
    teacherId,
  }))
);

export const fetchTeacherAttendanceHistory = createAppAsyncThunk(
  "teacherAttendance/fetchHistory",
  (teacherId) => fetchTeacherAttendanceHistoryAPI(teacherId)
);

const toLocalDateKey = (value) => {
  if (!value) return null;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialState = {
  isPunchedIn: false,
  isPunchedOut: false,
  todayAttendance: null,
  attendanceList: [],
  totalPresent: 0,
  totalAbsent: 0,
  totalHalfDay: 0,
  history: [],
  punchLoading: false,
  ...commonState,
};

const teacherAttendanceSlice = createSlice({
  name: "teacherAttendance",
  initialState,
  reducers: {
    clearTeacherAttendanceSuccess: (state) => {
      state.success = false;
    },
    clearTeacherAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Punch In ───
      .addCase(punchInTeacher.pending, (state) => {
        state.punchLoading = true;
        state.error = null;
      })
      .addCase(punchInTeacher.fulfilled, (state) => {
        state.punchLoading = false;
        state.success = true;
      })
      .addCase(punchInTeacher.rejected, (state, action) => {
        state.punchLoading = false;
        handleRejected(state, action);
      })

      // ─── Punch Out ───
      .addCase(punchOutTeacher.pending, (state) => {
        state.punchLoading = true;
        state.error = null;
      })
      .addCase(punchOutTeacher.fulfilled, (state) => {
        state.punchLoading = false;
        state.success = true;
      })
      .addCase(punchOutTeacher.rejected, (state, action) => {
        state.punchLoading = false;
        handleRejected(state, action);
      })

      // ─── Attendance List ───
      .addCase(fetchTeacherAttendance.pending, handlePending)
      .addCase(fetchTeacherAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const { response: payload = {}, teacherId } = action.payload || {};
        const attendanceList = payload.attendanceList || [];
        const today = toLocalDateKey(new Date());
        const todayAttendance = attendanceList.find(
          (record) =>
            toLocalDateKey(record.attendanceDate) === today &&
            (!teacherId || String(record.teacherId) === String(teacherId))
        ) || null;

        state.attendanceList = attendanceList;
        state.todayAttendance = todayAttendance;
        state.isPunchedIn = Boolean(todayAttendance?.punchIn);
        state.isPunchedOut = Boolean(todayAttendance?.punchOut);
        state.totalPresent = payload.totalPresent || 0;
        state.totalAbsent = payload.totalAbsent || 0;
        state.totalHalfDay = payload.totalHalfDay || 0;
      })
      .addCase(fetchTeacherAttendance.rejected, handleRejected)

      // ─── Attendance History ───
      .addCase(fetchTeacherAttendanceHistory.pending, handlePending)
      .addCase(fetchTeacherAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.attendanceList || [];
      })
      .addCase(fetchTeacherAttendanceHistory.rejected, handleRejected);
  },
});

export const {
  clearTeacherAttendanceSuccess,
  clearTeacherAttendanceError,
} = teacherAttendanceSlice.actions;

export default teacherAttendanceSlice.reducer;
