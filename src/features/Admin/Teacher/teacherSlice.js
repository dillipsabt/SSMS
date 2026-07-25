import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
    getTeachers,
    addTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getReligions,
    getBloodGroups,
    getSubjectsAPI,
} from "./teacherServiceApi";

// ✅ GET
export const getTeachersAsync = createAppAsyncThunk(
    "teacher/getTeachers",
    () => getTeachers()
);

// ✅ GET ID
export const getTeacherByIdAsync = createAppAsyncThunk(
    "teacher/getById",
    (id) => getTeacherById(id)
);

// ✅ ADD
export const addTeacherAsync = createAppAsyncThunk(
    "teacher/addTeacher",
    (data) => addTeacher(data)
);

// ✅ UPDATE
export const updateTeacherAsync = createAppAsyncThunk(
    "teacher/updateTeacher",
    ({ id, data }) => updateTeacher(id, data)
);

// ✅ DELETE
export const deleteTeacherAsync = createAppAsyncThunk(
    "teacher/deleteTeacher",
    async (id) => {
        const res = await deleteTeacher(id);
        return { id, message: res.data.message };
    }
);

export const getReligionsAsync = createAppAsyncThunk(
    "teacher/getReligions",
    () => getReligions()
);

// ✅ GET BLOOD GROUPS
export const getBloodGroupsAsync = createAppAsyncThunk(
    "teacher/getBloodGroups",
    () => getBloodGroups()
);

// ✅ GET SUBJECTS
export const getSubjectsAsync = createAppAsyncThunk(
  "teacher/getSubjects",
  () => getSubjectsAPI()
);

const teacherSlice = createSlice({
    name: "teacher",
    initialState: {
        teachers: [],
        singleTeacher: null,
        religions: [],
        bloodGroups: [],
        loading: false,
        error: null,
        message: null,
        subjects: [],
    },
    reducers: {
        resetTeacherState: (state) => {
            state.teachers = [];
            state.singleTeacher = null;
            state.religions = [];
            state.bloodGroups = [];
            state.loading = false;
            state.error = null;
            state.message = null;
            state.subjects = [];
        },
    },
    extraReducers: (builder) => {
        builder

            // GET
            .addCase(getTeachersAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeachersAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
            })
            .addCase(getTeachersAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET ID
            .addCase(getTeacherByIdAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeacherByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.singleTeacher = action.payload || null;
            })
            .addCase(getTeacherByIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ADD
            .addCase(addTeacherAsync.fulfilled, (state, action) => {
                if (action.payload) {
                    state.teachers.push(action.payload);
                }
            })

            .addCase(updateTeacherAsync.fulfilled, (state, action) => {
                const updated = action.payload;

                if (updated && updated.id) {
                    const index = state.teachers.findIndex((t) => t.id === updated.id);

                    if (index !== -1) {
                        state.teachers[index] = {
                            ...state.teachers[index],
                            ...updated,
                        };
                    }
                }
            })

            // DELETE
            .addCase(deleteTeacherAsync.fulfilled, (state, action) => {
                state.teachers = state.teachers.filter(
                    (t) => t.id !== action.payload.id
                );
                state.message = action.payload.message
            })

            .addCase(getReligionsAsync.fulfilled, (state, action) => {
                state.religions = action.payload || [];
            })

            .addCase(getBloodGroupsAsync.fulfilled, (state, action) => {
                state.bloodGroups = action.payload || [];
            })

            .addCase(getSubjectsAsync.fulfilled, (state, action) => {
                state.subjects = action.payload || [];
            });
    },
});

export const { resetTeacherState } = teacherSlice.actions;
export const clearSuccess = resetTeacherState;
export const clearError = resetTeacherState;

export default teacherSlice.reducer;
