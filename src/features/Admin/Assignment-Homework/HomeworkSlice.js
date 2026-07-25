import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import {
  getAllHomework,
  getHomeworkSubmissions,
} from "./HomeworkAPI";

// GET ALL HOMEWORK
export const getAllHomeworkAsync = createAppAsyncThunk(
  "homework/getAllHomework",
  () => getAllHomework()
);

// GET SUBMISSIONS
export const getHomeworkSubmissionsAsync = createAppAsyncThunk(
  "homework/getHomeworkSubmissions",
  () => getHomeworkSubmissions()
);

const initialState = {
  homeworkList: [],
  submissions: [],
  ...commonState,
};

const homeworkSlice = createSlice({
  name: "homework",
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

      // GET ALL HOMEWORK
      .addCase(getAllHomeworkAsync.pending, handlePending)
      .addCase(getAllHomeworkAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworkList = action.payload || [];
      })
      .addCase(getAllHomeworkAsync.rejected, handleRejected)

      // GET SUBMISSIONS
      .addCase(getHomeworkSubmissionsAsync.pending, handlePending)
      .addCase(getHomeworkSubmissionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload || [];
      })
      .addCase(getHomeworkSubmissionsAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = homeworkSlice.actions;
export default homeworkSlice.reducer;
