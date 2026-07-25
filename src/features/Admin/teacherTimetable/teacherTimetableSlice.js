import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
    createTimetable,
    getAdminTimetables,
    publishTimetableAPI,
    updateTimetable,
    deleteTimetable,
    getClasses,
    getTimeSlots,
    getSubjectsAPI,
} from "./teacherTimetableAPI";

const normalize = (data) => ({
    id: data.timetableId,
    teacherId: data.teacherId,
    date: data.createdDate,
    teacher: data.teacherName,
    scheduleDate: data.scheduledDate,
    status: data.status,
    slots: data.slots || [],
});

export const fetchTimetable = createAppAsyncThunk(
    "timetable/fetch",
    ({ teacherId, date } = {}) => getAdminTimetables(teacherId || null, date || null)
);

export const publishTimetable = createAppAsyncThunk(
    "timetable/publish",
    (timetableIds) => publishTimetableAPI(timetableIds)
);

export const addTimetable = createAppAsyncThunk(
    "timetable/add",
    (payload) => createTimetable(payload)
);

export const editTimetable = createAppAsyncThunk(
    "timetable/update",
    ({ id, payload }) => updateTimetable(id, payload)
);

export const removeTimetable = createAppAsyncThunk(
    "timetable/delete",
    async (id) => {
        await deleteTimetable(id);
        return id;
    }
);

export const fetchClasses = createAppAsyncThunk(
    "timetable/fetchClasses",
    () => getClasses()
);

export const fetchTimeSlots = createAppAsyncThunk(
    "timetable/fetchTimeSlots",
    () => getTimeSlots()
);

export const getSubjectsAsync = createAppAsyncThunk(
    "teacher/getSubjects",
    async () => {
        const res = await getSubjectsAPI();
        return res.data?.data || res.data;
    }
);

const slice = createSlice({
    name: "timetable",
    initialState: {
        data: [],
        loading: false,
        classes: [],
        timeSlots: [],
        subjects: [],
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(fetchTimetable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTimetable.fulfilled, (state, action) => {
                state.loading = false;

                if (!action.payload) {
                    state.data = [];
                    return;
                }

                state.data =
                    action.payload?.teacherTimetableList?.map(
                        normalize
                    ) || [];
            })
            .addCase(fetchTimetable.rejected, (state) => {
                state.loading = false;
                state.data = [];
            })

            .addCase(
                publishTimetable.fulfilled,
                (state) => {
                    state.data = state.data.map(
                        (item) => ({
                            ...item,
                            status: "PUBLISHED",
                        })
                    );
                }
            )

            .addCase(addTimetable.fulfilled, (state, action) => {
                state.data = [normalize(action.payload)];
            })

            .addCase(editTimetable.fulfilled, (state, action) => {
                const updated = normalize(action.payload);

                const index = state.data.findIndex((d) => d.id === updated.id);
                if (index !== -1) state.data[index] = updated;
            })

            .addCase(removeTimetable.fulfilled, (state, action) => {
                state.data = state.data.filter((d) => d.id !== action.payload);
            })

            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload || [];
            })
            .addCase(fetchClasses.rejected, (state) => {
                state.loading = false;
            })

            // TIME SLOTS
            .addCase(fetchTimeSlots.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTimeSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.timeSlots = action.payload || [];
            })
            .addCase(fetchTimeSlots.rejected, (state) => {
                state.loading = false;
            })

            // SUBJECTS
            .addCase(getSubjectsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubjectsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.subjects = action.payload || [];
            })
            .addCase(getSubjectsAsync.rejected, (state) => {
                state.loading = false;
            })
    },
});

export default slice.reducer;
