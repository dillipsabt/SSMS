import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  createTeacherTimetableRequestAPI,
  fetchClassesAPI,
  fetchSubjectsAPI,
  fetchTeacherTimetableAPI,
  fetchTeacherTimetableRequestsAPI,
  fetchTimeSlotsAPI,
} from "./teacherTimetableAPI";

const getPayload = (payload) => payload?.data ?? payload;
const getList = (payload) => {
  const data = getPayload(payload);
  return data?.content ?? data?.items ?? data?.scheduleItems ?? data?.teacherScheduleDetails ?? (Array.isArray(data) ? data : []);
};

export const fetchTeacherTimetableAsync = createAppAsyncThunk(
  "teacherTimetable/fetchTimetable",
  () => fetchTeacherTimetableAPI(),
);

export const fetchTeacherTimetableRequestsAsync = createAppAsyncThunk(
  "teacherTimetable/fetchRequests",
  (params = {}) => fetchTeacherTimetableRequestsAPI(params),
);

export const createTeacherTimetableRequestAsync = createAppAsyncThunk(
  "teacherTimetable/createRequest",
  (payload) => createTeacherTimetableRequestAPI(payload),
);

export const fetchSubjectsAsync = createAppAsyncThunk(
  "teacherTimetable/fetchSubjects",
  () => fetchSubjectsAPI(),
);

export const fetchClassesAsync = createAppAsyncThunk(
  "teacherTimetable/fetchClasses",
  () => fetchClassesAPI(),
);

export const fetchTimeSlotsAsync = createAppAsyncThunk(
  "teacherTimetable/fetchTimeSlots",
  () => fetchTimeSlotsAPI(),
);

const teacherTimetableSlice = createSlice({
  name: "teacherTimetable",
  initialState: {
    timetable: [],
    requests: [],
    subjects: [],
    classes: [],
    timeSlots: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherTimetableAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherTimetableAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = getPayload(action.payload);
      })
      .addCase(fetchTeacherTimetableAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unable to load timetable";
      })
      .addCase(fetchTeacherTimetableRequestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherTimetableRequestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = getList(action.payload);
      })
      .addCase(fetchTeacherTimetableRequestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unable to load requests";
      })
      .addCase(createTeacherTimetableRequestAsync.fulfilled, (state, action) => {
        const request = getPayload(action.payload);
        if (request?.id) state.requests.unshift(request);
      })
      .addCase(fetchSubjectsAsync.fulfilled, (state, action) => {
        state.subjects = getList(action.payload);
      })
      .addCase(fetchClassesAsync.fulfilled, (state, action) => {
        state.classes = getList(action.payload);
      })
      .addCase(fetchTimeSlotsAsync.fulfilled, (state, action) => {
        state.timeSlots = getList(action.payload);
      });
  },
});

export default teacherTimetableSlice.reducer;
