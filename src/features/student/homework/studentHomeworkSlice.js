import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getStudentHomework, submitStudentHomework } from "./studentHomeworkAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchStudentHomework = createAppAsyncThunk(
    "studentHomework/fetchStudentHomework",
    (studentId) => getStudentHomework(studentId)
);

export const submitHomework = createAppAsyncThunk(
    "studentHomework/submitHomework",
    ({ studentId, dto, files }) => submitStudentHomework({ studentId, dto, files })
);

const studentHomeworkSlice = createSlice({
    name: "studentHomework",
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
            .addCase(fetchStudentHomework.pending, (state) => {
                handlePending(state);
            })
            .addCase(fetchStudentHomework.fulfilled, (state, action) => {
                state.loading = false;
                state.homeworkList = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
            })
            .addCase(fetchStudentHomework.rejected, (state, action) => {
                handleRejected(state, action);
            })
            // Submit homework
            .addCase(submitHomework.pending, (state) => {
                handlePending(state);
            })
            .addCase(submitHomework.fulfilled, (state) => {
                handleSuccess(state);
            })
            .addCase(submitHomework.rejected, (state, action) => {
                handleRejected(state, action);
            });
    },
});

export const { resetSubmitState, clearSuccess, clearError } = studentHomeworkSlice.actions;
export default studentHomeworkSlice.reducer;
