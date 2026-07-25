import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getParentStudentHomework,
  submitParentStudentHomework,
} from "./parentHomeworkAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchParentStudentHomework = createAppAsyncThunk(
  "parentHomework/fetchParentStudentHomework",
  (studentId) => getParentStudentHomework(studentId)
);

export const submitParentHomework = createAppAsyncThunk(
  "parentHomework/submitParentHomework",
  ({ dto, files }) =>
    submitParentStudentHomework({ dto, files })
);

const parentHomeworkSlice = createSlice({
  name: "parentHomework",
  initialState: {
    homeworkList: [],
    ...commonState,
  },
  reducers: {
    resetSubmitState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch homework
      .addCase(fetchParentStudentHomework.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchParentStudentHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworkList = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchParentStudentHomework.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // Submit homework
      .addCase(submitParentHomework.pending, (state) => {
        handlePending(state);
      })
      .addCase(submitParentHomework.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(submitParentHomework.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { resetSubmitState, clearSuccess, clearError } =
  parentHomeworkSlice.actions;

export default parentHomeworkSlice.reducer;