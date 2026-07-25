import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getExaminationTimeAPI,
  getAcademicYearsAPI,
  getExaminationTypesAPI,
} from "./parentExamtimetableAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchParentExamTimetable = createAppAsyncThunk(
  "parentExamtimetable/fetchParentExamTimetable",
  (studentId) => getExaminationTimeAPI(studentId)
);

export const fetchAcademicYears = createAppAsyncThunk(
  "parentExamtimetable/fetchAcademicYears",
  () => getAcademicYearsAPI()
);

export const fetchExaminationTypes = createAppAsyncThunk(
  "parentExamtimetable/fetchExaminationTypes",
  () => getExaminationTypesAPI()
);

const initialState = {
  timetableData: [],
  academicYears: [],
  examinationTypes: [],
  ...commonState,
};

const parentExamtimetableSlice = createSlice({
  name: "parentExamtimetable",
  initialState,
  reducers: {
    clearExamTimetable: (state) => {
      state.timetableData = [];
      state.academicYears = [];
      state.examinationTypes = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // Timetable
      .addCase(fetchParentExamTimetable.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchParentExamTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetableData = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchParentExamTimetable.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // Academic Years
      .addCase(fetchAcademicYears.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchAcademicYears.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // Examination Types
      .addCase(fetchExaminationTypes.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchExaminationTypes.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearExamTimetable } = parentExamtimetableSlice.actions;

export default parentExamtimetableSlice.reducer;
