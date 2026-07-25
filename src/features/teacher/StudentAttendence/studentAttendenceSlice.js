import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  fetchStudentAttendenceAPI,
  fetchClassesAPI,
  fetchSubjectsAPI,
} from "./studentAttendenceAPI";
import {
  handlePending,
  handleRejected,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchStudentAttendence = createAppAsyncThunk(
  "studentAttendence/fetchStudentAttendence",
  (params) => fetchStudentAttendenceAPI(params)
);

export const fetchClasses = createAppAsyncThunk(
  "studentAttendence/fetchClasses",
  () => fetchClassesAPI()
);

export const fetchSubjects = createAppAsyncThunk(
  "studentAttendence/fetchSubjects",
  () => fetchSubjectsAPI()
);
const studentAttendenceSlice = createSlice({
  name: "studentAttendence",
  initialState: {
    attendenceDetails: [],
    classes: [],
    subjects: [],
    ...commonState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAttendence.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchStudentAttendence.fulfilled, (state, action) => {
        state.loading = false;
        state.attendenceDetails = action.payload;
      })
      .addCase(fetchStudentAttendence.rejected, (state, action) => {
        handleRejected(state, action);
      })
      .addCase(fetchClasses.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        handleRejected(state, action);
      })
      .addCase(fetchSubjects.pending, (state) => {
        handlePending(state);
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});
export default studentAttendenceSlice.reducer;
