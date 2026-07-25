import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  getClasses,
  getStudents,
  getTeachers,
  getDepartments,
  getSubjects,
  getStudentGroups,
} from "./notificationAPI";

export const fetchAllNotifications = createAppAsyncThunk(
  "notification/fetchAllNotifications",
  (params) => getAllNotifications(params)
);

export const fetchNotificationById = createAppAsyncThunk(
  "notification/fetchNotificationById",
  (notificationId) => getNotificationById(notificationId)
);

export const createNotificationAsync = createAppAsyncThunk(
  "notification/createNotification",
  (data) => createNotification(data)
);

export const deleteNotificationAsync = createAppAsyncThunk(
  "notification/deleteNotification",
  (notificationId) => deleteNotification(notificationId)
);

export const fetchClasses = createAppAsyncThunk(
  "notification/fetchClasses",
  () => getClasses()
);

export const fetchStudents = createAppAsyncThunk(
  "notification/fetchStudents",
  () => getStudents()
);

export const fetchTeachers = createAppAsyncThunk(
  "notification/fetchTeachers",
  () => getTeachers()
);

export const fetchDepartments = createAppAsyncThunk(
  "notification/fetchDepartments",
  () => getDepartments()
);

export const fetchSubjects = createAppAsyncThunk(
  "notification/fetchSubjects",
  () => getSubjects()
);

export const fetchStudentGroups = createAppAsyncThunk(
  "notification/fetchStudentGroups",
  () => getStudentGroups()
);

const initialState = {
  notificationList: [],
  currentNotification: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  classes: [],
  students: [],
  teachers: [],
  departments: [],
  subjects: [],
  studentGroups: [],
  loading: false,
  error: null,
  success: false,
};

const notificationSlice = createSlice({
  name: "notification",
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

      // GET ALL NOTIFICATIONS
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationList = action.payload.content || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET NOTIFICATION BY ID
      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotification = action.payload;
      })

      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE NOTIFICATION
      .addCase(createNotificationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createNotificationAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(createNotificationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // DELETE NOTIFICATION
      .addCase(deleteNotificationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteNotificationAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(deleteNotificationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // GET CLASSES
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload || [];
      })

      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET STUDENTS
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload || [];
      })

      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET TEACHERS
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload || [];
      })

      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET DEPARTMENTS
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload || [];
      })

      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET SUBJECTS
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload || [];
      })

      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET STUDENT GROUPS
      .addCase(fetchStudentGroups.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchStudentGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.studentGroups = action.payload || [];
      })

      .addCase(fetchStudentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = notificationSlice.actions;
export default notificationSlice.reducer;
