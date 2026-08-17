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
  fetchTeacherPunchDetailsAPI,
  fetchTeacherAttendanceHistoryAPI,
  enrollTeacherFaceAPI,
  verifyTeacherFaceAPI,
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
  ({ teacherId }) => fetchTeacherAttendanceAPI({ teacherId }).then((response) => ({
    response: response?.data ?? response,
    teacherId,
  }))
);

export const fetchTeacherPunchDetails = createAppAsyncThunk(
  "teacherAttendance/fetchPunchDetails",
  ({ teacherId, date }) =>
    fetchTeacherPunchDetailsAPI({ teacherId, date }).then((response) =>
      response?.data ?? response
    )
);

export const fetchTeacherAttendanceHistory = createAppAsyncThunk(
  "teacherAttendance/fetchHistory",
  (teacherId) => fetchTeacherAttendanceHistoryAPI(teacherId)
);

export const enrollTeacherFace = createAppAsyncThunk(
  "teacherAttendance/enrollFace",
  (data) => enrollTeacherFaceAPI(data)
);

export const verifyTeacherFace = createAppAsyncThunk(
  "teacherAttendance/verifyFace",
  (data) => verifyTeacherFaceAPI(data)
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

const getAttendanceOwnerId = (record) =>
  record?.teacherId ?? record?.staffId ?? record?.employeeId ?? record?.profileId;

const initialState = {
  isPunchedIn: false,
  isPunchedOut: false,
  todayAttendance: null,
  punchDetails: null,
  punchDetailsLoaded: false,
  punchDetailsLoading: false,
  attendanceList: [],
  totalPresent: 0,
  totalAbsent: 0,
  totalHalfDay: 0,
  history: [],
  punchLoading: false,
  faceLoading: false,
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

      .addCase(enrollTeacherFace.pending, (state) => {
        state.faceLoading = true;
        state.error = null;
      })
      .addCase(enrollTeacherFace.fulfilled, (state) => {
        state.faceLoading = false;
      })
      .addCase(enrollTeacherFace.rejected, (state, action) => {
        state.faceLoading = false;
        handleRejected(state, action);
      })

      .addCase(verifyTeacherFace.pending, (state) => {
        state.faceLoading = true;
        state.error = null;
      })
      .addCase(verifyTeacherFace.fulfilled, (state) => {
        state.faceLoading = false;
      })
      .addCase(verifyTeacherFace.rejected, (state, action) => {
        state.faceLoading = false;
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
          (record) => {
            const isToday =
              toLocalDateKey(record.attendanceDate) === today ||
              toLocalDateKey(record.punchIn) === today ||
              toLocalDateKey(record.punchOut) === today;

            return isToday && (!teacherId || String(getAttendanceOwnerId(record)) === String(teacherId));
          }
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

      // ─── Current Punch Details ───
      .addCase(fetchTeacherPunchDetails.pending, (state) => {
        state.punchDetailsLoaded = false;
        state.punchDetailsLoading = true;
      })
      .addCase(fetchTeacherPunchDetails.fulfilled, (state, action) => {
        state.punchDetailsLoading = false;
        state.punchDetailsLoaded = true;
        state.punchDetails = action.payload || null;
      })
      .addCase(fetchTeacherPunchDetails.rejected, (state, action) => {
        state.punchDetailsLoading = false;
        state.punchDetailsLoaded = false;
        state.punchDetails = null;
        handleRejected(state, action);
      })

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
