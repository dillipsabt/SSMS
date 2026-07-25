// src/features/Admin/ExamSchedule/examScheduleSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";

import {
  getExamSchedules,
  getAcademicYears,
  getExaminationTypes,
  getClasses,
  addExamSchedule,
  publishExamSchedule,
} from "./examScheduleAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// GET EXAMS
export const fetchExamSchedules = createAppAsyncThunk(
  "examSchedule/fetchExamSchedules",
  () => getExamSchedules()
);

// GET ACADEMIC YEARS
export const fetchAcademicYears = createAppAsyncThunk(
  "examSchedule/fetchAcademicYears",
  () => getAcademicYears()
);

// GET EXAM TYPES
export const fetchExaminationTypes = createAppAsyncThunk(
  "examSchedule/fetchExaminationTypes",
  () => getExaminationTypes()
);

// GET CLASSES
export const fetchClasses = createAppAsyncThunk(
  "examSchedule/fetchClasses",
  () => getClasses()
);

// ADD EXAM
export const createExamSchedule = createAppAsyncThunk(
  "examSchedule/createExamSchedule",
  ({ params, formData }) => addExamSchedule(params, formData)
);

// PUBLISH EXAM
export const updateExamStatus = createAppAsyncThunk(
  "examSchedule/updateExamStatus",
  (payload) => publishExamSchedule(payload)
);

const examScheduleSlice = createSlice({
  name: "examSchedule",

  initialState: {
    examSchedules: [],
    academicYears: [],
    examinationTypes: [],
    classes: [],
    ...commonState,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET EXAMS
      .addCase(fetchExamSchedules.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchExamSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.examSchedules = action.payload;
      })

      .addCase(fetchExamSchedules.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // GET ACADEMIC YEARS
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.academicYears = action.payload;
      })

      // GET EXAM TYPES
      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.examinationTypes = action.payload;
      })

      // GET CLASSES
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = action.payload;
      })

      // CREATE EXAM
      .addCase(createExamSchedule.pending, (state) => {
        handlePending(state);
      })

      .addCase(createExamSchedule.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createExamSchedule.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // UPDATE EXAM STATUS
      .addCase(updateExamStatus.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateExamStatus.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateExamStatus.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export default examScheduleSlice.reducer;
