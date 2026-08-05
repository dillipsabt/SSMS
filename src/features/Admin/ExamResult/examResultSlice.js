import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import {
    getExamResults,
    getStudentResultSummary,
    getReportCards,
    downloadReportCard,
    getExaminationTypes,
    getClasses,
    getSubjects,
} from "./examResultAPI";

export const fetchExamResults = createAppAsyncThunk(
    "examResult/fetchExamResults",
    (params) => getExamResults(params)
);

export const fetchStudentResultSummary = createAppAsyncThunk(
    "examResult/fetchStudentResultSummary",
    (params) => getStudentResultSummary(params)
);

export const fetchReportCards = createAppAsyncThunk(
    "examResult/fetchReportCards",
    (params) => getReportCards(params)
);

export const fetchReportCardDownload = createAppAsyncThunk(
    "examResult/fetchReportCardDownload",
    (params) => downloadReportCard(params)
);

export const fetchExaminationTypes = createAppAsyncThunk(
    "examResult/fetchExaminationTypes",
    () => getExaminationTypes()
);

export const fetchClasses = createAppAsyncThunk(
    "examResult/fetchClasses",
    () => getClasses()
);

export const fetchSubjects = createAppAsyncThunk(
    "examResult/fetchSubjects",
    () => getSubjects()
);

const initialState = {
    examResults: [],
    resultSummary: null,
    examinationTypes: [],
    classes: [],
    subjects: [],
    stats: {
        totalStudents: 0,
        passStudents: 0,
        failStudents: 0,
    },
    ...commonState,
};

const examResultSlice = createSlice({
    name: "examResult",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        resetExamResultState: (state) => {
            state.loading = false;
            state.error = null;
            state.resultSummary = null;
            state.examResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExamResults.pending, handlePending)
            .addCase(fetchExamResults.fulfilled, (state, action) => {
                state.loading = false;
                state.examResults = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.examResultResponse || [];
            })
            .addCase(fetchExamResults.rejected, handleRejected)
            .addCase(fetchStudentResultSummary.pending, handlePending)
            .addCase(fetchStudentResultSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.resultSummary = action.payload;
            })
            .addCase(fetchStudentResultSummary.rejected, handleRejected)
            .addCase(fetchReportCards.pending, handlePending)
            .addCase(fetchReportCards.fulfilled, (state, action) => {
                state.loading = false;
                state.examResults = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchReportCards.rejected, handleRejected)
            .addCase(fetchReportCardDownload.pending, handlePending)
            .addCase(fetchReportCardDownload.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchReportCardDownload.rejected, handleRejected)
            .addCase(fetchExaminationTypes.pending, handlePending)
            .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.examinationTypes = action.payload;
            })
            .addCase(fetchExaminationTypes.rejected, handleRejected)
            .addCase(fetchClasses.pending, handlePending)
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload || [];
            })
            .addCase(fetchClasses.rejected, handleRejected)
            .addCase(fetchSubjects.pending, handlePending)
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.loading = false;
                state.subjects = action.payload || [];
            })
            .addCase(fetchSubjects.rejected, handleRejected);
    },
});

export const { clearError, clearSuccess, resetExamResultState } = examResultSlice.actions;
export default examResultSlice.reducer;
