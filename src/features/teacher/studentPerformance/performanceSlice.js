import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  createPerformance,
  updatePerformance as updatePerformanceAPI,
  getPerformanceById,
  getStudentByRollNumber,
  getPerformanceList,
  getAvailableDates,
  getClassesForForm,
  getClassesByDate,
  getSubjects,
} from "./performaceApi";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// ============================
// ASYNC THUNKS
// ============================

export const fetchSubjects = createAppAsyncThunk(
  "teacherPerformance/fetchSubjects",
  () => getSubjects()
);

export const fetchClasses = createAppAsyncThunk(
  "teacherPerformance/fetchClasses",
  () => getClassesForForm()
);

export const fetchStudentByRollNumber = createAppAsyncThunk(
  "teacherPerformance/fetchStudentByRollNumber",
  (rollNo) => getStudentByRollNumber(rollNo)
);

export const createPerformanceThunk = createAppAsyncThunk(
  "teacherPerformance/create",
  (data) => createPerformance(data)
);

export const updatePerformanceThunk = createAppAsyncThunk(
  "teacherPerformance/update",
  ({ id, data }) => updatePerformanceAPI({ id, data })
);

export const getPerformanceByIdThunk = createAppAsyncThunk(
  "teacherPerformance/getById",
  (id) => getPerformanceById(id)
);

export const fetchPerformanceList = createAppAsyncThunk(
  "teacherPerformance/fetchList",
  (params) => getPerformanceList(params)
);

export const fetchAvailableDates = createAppAsyncThunk(
  "teacherPerformance/fetchDates",
  ({ startDate, endDate }) => getAvailableDates(startDate, endDate)
);

export const fetchClassesByDate = createAppAsyncThunk(
  "teacherPerformance/fetchClassesByDate",
  ({ startDate, endDate }) => getClassesByDate(startDate, endDate)
);

/* ===========================
   INITIAL STATE
=========================== */

const initialState = {
  // Daily Student Performance
  subjects: [],
  classes: [],
  studentInfo: null,
  currentPerformance: null,

  // Student Performance List
  performanceListData: null,
  availableDates: [],
  classesFromAPI: [],
  dateRange: {
    startDate: null,
    endDate: null,
  },

  // Common states
  studentLoading: false,
  loading: false,
  error: null,
  success: false,
};

/* ===========================
   SLICE
=========================== */

const performanceSlice = createSlice({
  name: "teacherPerformance",
  initialState,
  reducers: {
    resetPerformanceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPerformance = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearStudentInfo: (state) => {
      state.studentInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================
      // FETCH SUBJECTS
      // ============================
      .addCase(fetchSubjects.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // FETCH CLASSES
      // ============================
      .addCase(fetchClasses.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // FETCH STUDENT BY ROLL NUMBER
      // ============================
      .addCase(fetchStudentByRollNumber.pending, (state) => {
        state.studentLoading = true;
        state.studentInfo = null;
      })
      .addCase(fetchStudentByRollNumber.fulfilled, (state, action) => {
        state.studentLoading = false;
        state.studentInfo = action.payload;
      })
      .addCase(fetchStudentByRollNumber.rejected, (state, action) => {
        state.studentLoading = false;
        state.error = action.payload;
        state.studentInfo = null;
      })

      // ============================
      // CREATE PERFORMANCE
      // ============================
      .addCase(createPerformanceThunk.pending, (state) => {
        handlePending(state);
      })
      .addCase(createPerformanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.currentPerformance = action.payload;
      })
      .addCase(createPerformanceThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // UPDATE PERFORMANCE
      // ============================
      .addCase(updatePerformanceThunk.pending, (state) => {
        handlePending(state);
      })
      .addCase(updatePerformanceThunk.fulfilled, (state, action) => {
        handleSuccess(state);
        state.currentPerformance = action.payload;
      })
      .addCase(updatePerformanceThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // GET PERFORMANCE BY ID
      // ============================
      .addCase(getPerformanceByIdThunk.pending, (state) => {
        handlePending(state);
      })
      .addCase(getPerformanceByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPerformance = action.payload;
      })
      .addCase(getPerformanceByIdThunk.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // FETCH PERFORMANCE LIST
      // ============================
      .addCase(fetchPerformanceList.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchPerformanceList.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct payload and wrapped response
        const payload = action.payload;
        state.performanceListData = payload?.data || payload;
      })
      .addCase(fetchPerformanceList.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // FETCH AVAILABLE DATES
      // ============================
      .addCase(fetchAvailableDates.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchAvailableDates.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // Store available dates list
        state.availableDates = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.dates)
          ? payload.dates
          : payload?.data || [];
      })
      .addCase(fetchAvailableDates.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ============================
      // FETCH CLASSES BY DATE
      // ============================
      .addCase(fetchClassesByDate.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchClassesByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.classesFromAPI = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchClassesByDate.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { resetPerformanceState, clearSuccess, clearStudentInfo } = performanceSlice.actions;
export default performanceSlice.reducer;
