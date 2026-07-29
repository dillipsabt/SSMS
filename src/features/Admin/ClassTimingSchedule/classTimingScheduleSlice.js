import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  createClassTimingSchedule,
  deleteClassTimingSchedule,
  getClassTimingSchedules,
  updateClassTimingSchedule,
} from "./classTimingScheduleAPI";

export const fetchClassTimingSchedulesAsync = createAppAsyncThunk(
  "classTimingSchedule/fetchAll",
  (params) => getClassTimingSchedules(params),
);

export const createClassTimingScheduleAsync = createAppAsyncThunk(
  "classTimingSchedule/create",
  (data) => createClassTimingSchedule(data),
);

export const updateClassTimingScheduleAsync = createAppAsyncThunk(
  "classTimingSchedule/update",
  ({ id, data }) => updateClassTimingSchedule(id, data),
);

export const deleteClassTimingScheduleAsync = createAppAsyncThunk(
  "classTimingSchedule/delete",
  async (id) => {
    await deleteClassTimingSchedule(id);
    return id;
  },
);

const initialState = {
  schedules: [],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  loading: false,
  mutationLoading: false,
  error: null,
};

const classTimingScheduleSlice = createSlice({
  name: "classTimingSchedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassTimingSchedulesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassTimingSchedulesAsync.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.schedules = Array.isArray(payload) ? payload : payload?.content || [];
        state.pagination = {
          page: payload?.page ?? payload?.number ?? 0,
          size: payload?.size ?? 10,
          totalElements: payload?.totalElements ?? state.schedules.length,
          totalPages: payload?.totalPages ?? (state.schedules.length ? 1 : 0),
        };
      })
      .addCase(fetchClassTimingSchedulesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("classTimingSchedule/") &&
          (action.type.endsWith("/pending") || action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")) &&
          !action.type.includes("/fetchAll/"),
        (state, action) => {
          state.mutationLoading = action.type.endsWith("/pending");
          if (action.type.endsWith("/pending")) state.error = null;
          if (action.type.endsWith("/rejected")) {
            state.error = action.payload?.message || action.error.message;
          }
        },
      );
  },
});

export default classTimingScheduleSlice.reducer;
