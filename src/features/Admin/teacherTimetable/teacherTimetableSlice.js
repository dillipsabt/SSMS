import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  createTeacherSchedule,
  deleteTeacherSchedule,
  getClasses,
  getSubjectsAPI,
  getTeacherSchedule,
  getTeacherSchedules,
  getTimeSlots,
  publishTeacherSchedules,
  updateTeacherSchedule,
} from "./teacherTimetableAPI";

const getPayload = (payload) => payload?.data ?? payload;

const getList = (payload) => {
  const data = getPayload(payload);
  return data?.content ?? data?.items ?? data?.teacherScheduleList ?? (Array.isArray(data) ? data : []);
};

const normalizeItem = (item) => ({
  ...item,
  id: item.id ?? item.teacherScheduleId,
  teacherId: item.teacherId ?? item.teacher?.id,
  teacherName: item.teacherName ?? item.teacher?.fullName ?? item.teacher?.name ?? "-",
  createdDate: item.createdDate ?? item.date,
  startDate: item.startDate ?? item.scheduledDate,
  endDate: item.endDate ?? item.startDate ?? item.scheduledDate,
  status: item.status ?? "DRAFT",
  scheduleItems: item.scheduleItems ?? item.slots ?? item.teacherScheduleDetails ?? [],
});

export const fetchTimetable = createAppAsyncThunk(
  "timetable/fetch",
  (params = {}) => getTeacherSchedules(params),
);

export const fetchTimetableDetail = createAppAsyncThunk(
  "timetable/fetchDetail",
  (id) => getTeacherSchedule(id),
);

export const publishTimetable = createAppAsyncThunk(
  "timetable/publish",
  (payload) => publishTeacherSchedules(payload),
);

export const addTimetable = createAppAsyncThunk(
  "timetable/add",
  (payload) => createTeacherSchedule(payload),
);

export const editTimetable = createAppAsyncThunk(
  "timetable/update",
  ({ id, payload }) => updateTeacherSchedule(id, payload),
);

export const removeTimetable = createAppAsyncThunk(
  "timetable/delete",
  async (id) => {
    await deleteTeacherSchedule(id);
    return id;
  },
);

export const fetchClasses = createAppAsyncThunk(
  "timetable/fetchClasses",
  () => getClasses(),
);

export const fetchTimeSlots = createAppAsyncThunk(
  "timetable/fetchTimeSlots",
  () => getTimeSlots(),
);

export const getSubjectsAsync = createAppAsyncThunk(
  "timetable/fetchSubjects",
  () => getSubjectsAPI(),
);

const slice = createSlice({
  name: "timetable",
  initialState: {
    data: [],
    selectedSchedule: null,
    loading: false,
    classes: [],
    timeSlots: [],
    subjects: [],
    pagination: { page: 1, size: 10, totalPages: 1, totalElements: 0 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        const result = getPayload(action.payload);
        state.loading = false;
        state.data = getList(action.payload).map(normalizeItem);
        state.pagination = {
          page: result?.page ?? result?.pageNumber ?? (result?.number != null ? result.number + 1 : 1),
          size: result?.size ?? result?.pageSize ?? 10,
          totalPages: result?.totalPages ?? 1,
          totalElements: result?.totalElements ?? result?.totalRecords ?? state.data.length,
        };
      })
      .addCase(fetchTimetable.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchTimetableDetail.fulfilled, (state, action) => {
        state.selectedSchedule = normalizeItem(getPayload(action.payload));
      })
      .addCase(addTimetable.fulfilled, (state, action) => {
        const schedule = getPayload(action.payload);
        if (schedule?.id || schedule?.teacherScheduleId) state.data.unshift(normalizeItem(schedule));
      })
      .addCase(editTimetable.fulfilled, (state, action) => {
        const updated = normalizeItem(getPayload(action.payload));
        const index = state.data.findIndex((item) => item.id === updated.id);
        if (index !== -1) state.data[index] = updated;
        state.selectedSchedule = updated;
      })
      .addCase(removeTimetable.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = getList(action.payload);
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.timeSlots = getList(action.payload);
      })
      .addCase(getSubjectsAsync.fulfilled, (state, action) => {
        state.subjects = getList(action.payload);
      });
  },
});

export default slice.reducer;
