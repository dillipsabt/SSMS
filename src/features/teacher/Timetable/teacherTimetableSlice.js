import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";

import {
    fetchTeachersAPI,
    fetchTeacherTimetableAPI,
    fetchSubjectsAPI,
    fetchClassesAPI,
    fetchTeacherTimetableRequestsAPI,
    createTeacherTimetableRequestAPI,
    fetchTimeSlotsAPI,
} from "./teacherTimetableAPI";

export const fetchTeachersAsync = createAppAsyncThunk(
    "teacherTimetable/fetchTeachers",
    () => fetchTeachersAPI()
);

export const fetchTeacherTimetableAsync = createAppAsyncThunk(
    "teacherTimetable/fetchTimetable",
    ({ teacherId, date }) =>
        fetchTeacherTimetableAPI(
            teacherId,
            date
        )
);

export const fetchSubjectsAsync = createAppAsyncThunk(
    "teacherTimetable/fetchSubjects",
    () => fetchSubjectsAPI()
);

export const fetchClassesAsync = createAppAsyncThunk(
    "teacherTimetable/fetchClasses",
    () => fetchClassesAPI()
);

export const fetchTeacherTimetableRequestsAsync =
    createAppAsyncThunk(
        "teacherTimetable/fetchRequests",
        (teacherId) =>
            fetchTeacherTimetableRequestsAPI(
                teacherId
            )
    );

export const createTeacherTimetableRequestAsync =
    createAppAsyncThunk(
        "teacherTimetable/createRequest",
        (data) =>
            createTeacherTimetableRequestAPI(
                data
            )
    );

export const fetchTimeSlotsAsync =
    createAppAsyncThunk(
        "teacherTimetable/fetchTimeSlots",
        () => fetchTimeSlotsAPI()
    );

const teacherTimetableSlice =
    createSlice({
        name: "teacherTimetable",

        initialState: {
            teachers: [],
            timetable: [],
            subjects: [],
            classes: [],
            requests: [],
            timeSlots: [],
            loading: false,
            error: null,
            success: false,
        },

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

                // =========================
                // FETCH TEACHERS
                // =========================
                .addCase(
                    fetchTeachersAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchTeachersAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.teachers =
                            action.payload;
                    }
                )

                .addCase(
                    fetchTeachersAsync.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload?.message ||
                            action.payload ||
                            "Failed to fetch teachers";
                    }
                )

                // =========================
                // FETCH TIMETABLE
                // =========================
                .addCase(
                    fetchTeacherTimetableAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchTeacherTimetableAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.timetable =
                            action.payload ||
                            [];
                    }
                )

                .addCase(
                    fetchTeacherTimetableAsync.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload?.message ||
                            action.payload ||
                            "Failed to fetch timetable";
                    }
                )

                // =========================
                // SUBJECTS
                // =========================
                .addCase(
                    fetchSubjectsAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchSubjectsAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.subjects =
                            action.payload ||
                            [];
                    }
                )

                .addCase(
                    fetchSubjectsAsync.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload?.message ||
                            action.payload ||
                            "Failed to fetch subjects";
                    }
                )

                // =========================
                // CLASSES
                // =========================
                .addCase(
                    fetchClassesAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchClassesAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.classes =
                            action.payload ||
                            [];
                    }
                )

                .addCase(
                    fetchClassesAsync.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload?.message ||
                            action.payload ||
                            "Failed to fetch classes";
                    }
                )

                // =========================
                // FETCH REQUESTS
                // =========================
                .addCase(
                    fetchTeacherTimetableRequestsAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchTeacherTimetableRequestsAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.requests =
                            action.payload ||
                            [];
                    }
                )

                .addCase(
                    fetchTeacherTimetableRequestsAsync.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload?.message ||
                            action.payload ||
                            "Failed to fetch requests";
                    }
                )

                // =========================
                // CREATE REQUEST
                // =========================
                .addCase(
                    createTeacherTimetableRequestAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                        state.success = false;
                    }
                )

                .addCase(
                    createTeacherTimetableRequestAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.success =
                            action.payload?.message ||
                            "Request created successfully";

                        if (
                            action.payload?.data
                        ) {
                            state.requests = [
                                action.payload
                                    .data,
                                ...state.requests,
                            ];
                        } else {
                            state.requests = [
                                action.payload,
                                ...state.requests,
                            ];
                        }
                    }
                )

                .addCase(
                    createTeacherTimetableRequestAsync.rejected,
                    (state, action) => {
                        state.loading = false;

                        state.error =
                            action.payload?.message ||
                            "Failed to create request";

                        state.success =
                            false;
                    }
                )

                // =========================
                // TIME SLOTS
                // =========================
                .addCase(
                    fetchTimeSlotsAsync.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchTimeSlotsAsync.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.timeSlots =
                            action.payload ||
                            [];
                    }
                )

                .addCase(
                    fetchTimeSlotsAsync.rejected,
                    (state, action) => {
                        state.loading = false;

                        state.error =
                            action.payload?.message ||
                            action.payload ||
                            "Failed to fetch time slots";
                    }
                );
        },
    });

export const {
    clearError,
    clearSuccess,
} = teacherTimetableSlice.actions;

export default teacherTimetableSlice.reducer;