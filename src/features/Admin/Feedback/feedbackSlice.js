import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getFeedbackById,
  createFeedback,
  updateFeedback,
  updateFeedbackStatus,
  getAllFeedbacks,
  getClasses,
  getAllFeedbackSubmissions,
  getFeedbackSubmissionById,
} from "./feedbackAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// GET FEEDBACK BY ID
export const fetchFeedbackById = createAppAsyncThunk(
  "feedback/fetchFeedbackById",
  (feedbackId) => getFeedbackById(feedbackId)
);

// CREATE FEEDBACK
export const createFeedbackAsync = createAppAsyncThunk(
  "feedback/createFeedback",
  (data) => createFeedback(data)
);

// UPDATE FEEDBACK
export const updateFeedbackAsync = createAppAsyncThunk(
  "feedback/updateFeedback",
  ({ feedbackId, data }) => updateFeedback(feedbackId, data)
);

// UPDATE FEEDBACK STATUS
export const updateFeedbackStatusAsync = createAppAsyncThunk(
  "feedback/updateFeedbackStatus",
  ({ feedbackId, data }) => updateFeedbackStatus(feedbackId, data)
);

// GET ALL FEEDBACKS
export const fetchAllFeedbacks = createAppAsyncThunk(
  "feedback/fetchAllFeedbacks",
  (params) => getAllFeedbacks(params)
);

// GET CLASSES
export const fetchClasses = createAppAsyncThunk(
  "feedback/fetchClasses",
  () => getClasses()
);

// GET ALL FEEDBACK SUBMISSIONS
export const fetchAllFeedbackSubmissions = createAppAsyncThunk(
  "feedback/fetchAllFeedbackSubmissions",
  (params) => getAllFeedbackSubmissions(params)
);

// GET FEEDBACK SUBMISSION DETAILS
export const fetchFeedbackSubmissionById = createAppAsyncThunk(
  "feedback/fetchFeedbackSubmissionById",
  (submissionId) => getFeedbackSubmissionById(submissionId)
);

const initialState = {
  feedbackList: [],
  submissionDetails: null,
  currentFeedback: null,
  classes: [],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  ...commonState,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET FEEDBACK BY ID
      .addCase(fetchFeedbackById.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFeedback = action.payload;
      })

      .addCase(fetchFeedbackById.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // CREATE FEEDBACK
      .addCase(createFeedbackAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createFeedbackAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createFeedbackAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // UPDATE FEEDBACK
      .addCase(updateFeedbackAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateFeedbackAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateFeedbackAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // UPDATE FEEDBACK STATUS
      .addCase(updateFeedbackStatusAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateFeedbackStatusAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateFeedbackStatusAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // GET ALL FEEDBACKS
      .addCase(fetchAllFeedbacks.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchAllFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackList = action.payload.feedBacks || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(fetchAllFeedbacks.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // GET CLASSES
      .addCase(fetchClasses.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload || [];
      })

      .addCase(fetchClasses.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // GET ALL FEEDBACK SUBMISSIONS
      .addCase(fetchAllFeedbackSubmissions.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchAllFeedbackSubmissions.fulfilled, (state, action) => {
        state.loading = false;

        state.feedbackList = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchAllFeedbackSubmissions.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // GET FEEDBACK SUBMISSION DETAILS
      .addCase(fetchFeedbackSubmissionById.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchFeedbackSubmissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionDetails = action.payload;
      })

      .addCase(fetchFeedbackSubmissionById.rejected, (state, action) => {
        handleRejected(state, action);
      })

  },
});

export const { clearError, clearSuccess } = feedbackSlice.actions;
export default feedbackSlice.reducer;
