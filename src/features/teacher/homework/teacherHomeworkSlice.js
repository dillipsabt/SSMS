import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  fetchHomeworkAPI,
  createHomeworkAPI,
  acceptHomeworkAPI,
  rejectHomeworkAPI,
  fetchHomeworkSubmissionsAPI,
  fetchClassesAPI,
  fetchSubjectsAPI,
  fetchTeachersAPI,
} from "./teacherHomeworkAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchTeachersAsync = createAppAsyncThunk(
  "teacherHomework/fetchTeachers",
  () => fetchTeachersAPI()
);

export const fetchHomeworkAsync = createAppAsyncThunk(
  "teacherHomework/fetchHomework",
  (teacherId) => fetchHomeworkAPI(teacherId)
);

export const createHomeworkAsync = createAppAsyncThunk(
  "teacherHomework/createHomework",
  (formData) => createHomeworkAPI(formData)
);

export const acceptHomeworkAsync = createAppAsyncThunk(
  "teacherHomework/acceptHomework",
  (submissionId) => acceptHomeworkAPI(submissionId)
);

export const rejectHomeworkAsync = createAppAsyncThunk(
  "teacherHomework/rejectHomework",
  (data) => rejectHomeworkAPI(data)
);

export const fetchHomeworkSubmissionsAsync = createAppAsyncThunk(
  "teacherHomework/fetchSubmissions",
  (params) => fetchHomeworkSubmissionsAPI(params)
);

export const fetchClassesAsync = createAppAsyncThunk(
  "teacherHomework/fetchClasses",
  () => fetchClassesAPI()
);

export const fetchSubjectsAsync = createAppAsyncThunk(
  "teacherHomework/fetchSubjects",
  () => fetchSubjectsAPI()
);

const teacherHomeworkSlice = createSlice({
  name: "teacherHomework",

  initialState: {
    teachers: [],
    homeworks: [],
    submissions: [],
    classes: [],
    subjects: [],
    ...commonState,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH TEACHERS
      .addCase(fetchTeachersAsync.fulfilled, (state, action) => {
        state.teachers = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      // FETCH HOMEWORK
      .addCase(fetchHomeworkAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchHomeworkAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworks = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      .addCase(fetchHomeworkAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // CREATE HOMEWORK
      .addCase(createHomeworkAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createHomeworkAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        if (action.payload) {
          state.homeworks = [action.payload, ...state.homeworks];
        }
      })

      .addCase(createHomeworkAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ACCEPT HOMEWORK
      .addCase(acceptHomeworkAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(acceptHomeworkAsync.fulfilled, (state, action) => {
        handleSuccess(state);
      })

      .addCase(acceptHomeworkAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // REJECT HOMEWORK
      .addCase(rejectHomeworkAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(rejectHomeworkAsync.fulfilled, (state, action) => {
        handleSuccess(state);
      })

      .addCase(rejectHomeworkAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // FETCH CLASSES
      .addCase(fetchClassesAsync.fulfilled, (state, action) => {
        state.classes = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      // FETCH SUBJECTS
      .addCase(fetchSubjectsAsync.fulfilled, (state, action) => {
        state.subjects = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })

      // FETCH SUBMISSIONS
      .addCase(
        fetchHomeworkSubmissionsAsync.pending,
        (state) => {
          handlePending(state);
        }
      )

      .addCase(
        fetchHomeworkSubmissionsAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.submissions = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
        }
      )

      .addCase(
        fetchHomeworkSubmissionsAsync.rejected,
        (state, action) => {
          handleRejected(state, action);
        }
      );
  },
});

export default teacherHomeworkSlice.reducer;
