import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import {
  fetchStaffAttendanceAPI,
  fetchStaffPunchDetailsAPI,
  punchInStaffAPI,
  punchOutStaffAPI,
} from "./staffAttendanceAPI";

export const punchInStaff = createAppAsyncThunk(
  "staffAttendance/punchIn",
  (data) => punchInStaffAPI(data),
);

export const punchOutStaff = createAppAsyncThunk(
  "staffAttendance/punchOut",
  (data) => punchOutStaffAPI(data),
);

export const fetchStaffAttendance = createAppAsyncThunk(
  "staffAttendance/fetchList",
  (staffId) =>
    fetchStaffAttendanceAPI(staffId).then((response) => ({
      records: response?.data ?? response,
      staffId,
    })),
);

export const fetchStaffPunchDetails = createAppAsyncThunk(
  "staffAttendance/fetchPunchDetails",
  ({ staffId, date }) =>
    fetchStaffPunchDetailsAPI({ staffId, date }).then(
      (response) => response?.data ?? response,
    ),
);

const toLocalDateKey = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getAttendanceOwnerId = (record) =>
  record?.staffId ?? record?.staff?.id ?? record?.employeeId ?? record?.profileId;

const initialState = {
  todayAttendance: null,
  attendanceList: [],
  punchDetails: null,
  punchDetailsLoaded: false,
  punchDetailsLoading: false,
  punchLoading: false,
  ...commonState,
};

const staffAttendanceSlice = createSlice({
  name: "staffAttendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(punchInStaff.pending, (state) => {
        state.punchLoading = true;
        state.error = null;
      })
      .addCase(punchInStaff.fulfilled, (state) => {
        state.punchLoading = false;
      })
      .addCase(punchInStaff.rejected, (state, action) => {
        state.punchLoading = false;
        handleRejected(state, action);
      })
      .addCase(punchOutStaff.pending, (state) => {
        state.punchLoading = true;
        state.error = null;
      })
      .addCase(punchOutStaff.fulfilled, (state) => {
        state.punchLoading = false;
      })
      .addCase(punchOutStaff.rejected, (state, action) => {
        state.punchLoading = false;
        handleRejected(state, action);
      })
      .addCase(fetchStaffAttendance.pending, handlePending)
      .addCase(fetchStaffAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const { records, staffId } = action.payload || {};
        const attendanceList = Array.isArray(records)
          ? records
          : records?.attendanceList || [];
        const today = toLocalDateKey(new Date());
        state.attendanceList = attendanceList;
        state.todayAttendance = attendanceList.find((record) =>
          toLocalDateKey(record.attendanceDate) === today &&
          (!staffId || String(getAttendanceOwnerId(record)) === String(staffId)),
        ) || null;
      })
      .addCase(fetchStaffAttendance.rejected, handleRejected)
      .addCase(fetchStaffPunchDetails.pending, (state) => {
        state.punchDetailsLoaded = false;
        state.punchDetailsLoading = true;
      })
      .addCase(fetchStaffPunchDetails.fulfilled, (state, action) => {
        state.punchDetailsLoading = false;
        state.punchDetailsLoaded = true;
        state.punchDetails = action.payload || null;
      })
      .addCase(fetchStaffPunchDetails.rejected, (state, action) => {
        state.punchDetailsLoading = false;
        state.punchDetailsLoaded = false;
        state.punchDetails = null;
        handleRejected(state, action);
      });
  },
});

export default staffAttendanceSlice.reducer;
