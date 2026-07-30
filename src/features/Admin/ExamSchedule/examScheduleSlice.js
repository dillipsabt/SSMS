import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  addExamSchedule,
  deleteExamSchedule,
  getAcademicYears,
  getClasses,
  getExamSchedule,
  getExamSchedules,
  getExaminationTypes,
  getSubjects,
  publishExamSchedules,
  updateExamSchedule,
  updateExamStatus,
} from "./examScheduleAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

const listPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.content || payload?.data || [];
};

export const fetchExamSchedules = createAppAsyncThunk(
  "examSchedule/fetchExamSchedules",
  () => getExamSchedules(),
);

export const fetchExamSchedule = createAppAsyncThunk(
  "examSchedule/fetchExamSchedule",
  (id) => getExamSchedule(id),
);

export const fetchAcademicYears = createAppAsyncThunk(
  "examSchedule/fetchAcademicYears",
  () => getAcademicYears(),
);

export const fetchExaminationTypes = createAppAsyncThunk(
  "examSchedule/fetchExaminationTypes",
  () => getExaminationTypes(),
);

export const fetchClasses = createAppAsyncThunk(
  "examSchedule/fetchClasses",
  () => getClasses(),
);

export const fetchSubjects = createAppAsyncThunk(
  "examSchedule/fetchSubjects",
  () => getSubjects(),
);

export const createExamSchedule = createAppAsyncThunk(
  "examSchedule/createExamSchedule",
  (data) => addExamSchedule(data),
);

export const updateExamScheduleAsync = createAppAsyncThunk(
  "examSchedule/updateExamSchedule",
  ({ id, data }) => updateExamSchedule(id, data),
);

export const deleteExamScheduleAsync = createAppAsyncThunk(
  "examSchedule/deleteExamSchedule",
  async (id) => {
    await deleteExamSchedule(id);
    return id;
  },
);

export const publishExamSchedulesAsync = createAppAsyncThunk(
  "examSchedule/publishExamSchedules",
  (data) => publishExamSchedules(data),
);

export const updateExamStatusAsync = createAppAsyncThunk(
  "examSchedule/updateExamStatus",
  (data) => updateExamStatus(data),
);

const examScheduleSlice = createSlice({
  name: "examSchedule",
  initialState: {
    examSchedules: [],
    examDetails: null,
    academicYears: [],
    examinationTypes: [],
    classes: [],
    subjects: [],
    ...commonState,
  },
  reducers: {
    clearExamDetails: (state) => {
      state.examDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamSchedules.pending, handlePending)
      .addCase(fetchExamSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.examSchedules = listPayload(action.payload);
      })
      .addCase(fetchExamSchedules.rejected, handleRejected)
      .addCase(fetchExamSchedule.pending, handlePending)
      .addCase(fetchExamSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.examDetails = action.payload;
      })
      .addCase(fetchExamSchedule.rejected, handleRejected)
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.academicYears = listPayload(action.payload);
      })
      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.examinationTypes = listPayload(action.payload);
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = listPayload(action.payload);
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = listPayload(action.payload);
      })
      .addCase(createExamSchedule.pending, handlePending)
      .addCase(createExamSchedule.fulfilled, (state) => {
        handleSuccess(state, "Exam schedule created successfully");
      })
      .addCase(createExamSchedule.rejected, handleRejected)
      .addCase(updateExamScheduleAsync.pending, handlePending)
      .addCase(updateExamScheduleAsync.fulfilled, (state) => {
        handleSuccess(state, "Exam schedule updated successfully");
      })
      .addCase(updateExamScheduleAsync.rejected, handleRejected)
      .addCase(deleteExamScheduleAsync.pending, handlePending)
      .addCase(deleteExamScheduleAsync.fulfilled, (state, action) => {
        handleSuccess(state, "Exam schedule deleted successfully");
        state.examSchedules = state.examSchedules.filter(
          (exam) => (exam.id || exam.examId) !== action.payload,
        );
      })
      .addCase(deleteExamScheduleAsync.rejected, handleRejected)
      .addCase(publishExamSchedulesAsync.pending, handlePending)
      .addCase(publishExamSchedulesAsync.fulfilled, (state) => {
        handleSuccess(state, "Exam schedules published successfully");
      })
      .addCase(publishExamSchedulesAsync.rejected, handleRejected)
      .addCase(updateExamStatusAsync.pending, handlePending)
      .addCase(updateExamStatusAsync.fulfilled, (state) => {
        handleSuccess(state, "Exam status updated successfully");
      })
      .addCase(updateExamStatusAsync.rejected, handleRejected);
  },
});

export const { clearExamDetails } = examScheduleSlice.actions;
export default examScheduleSlice.reducer;
