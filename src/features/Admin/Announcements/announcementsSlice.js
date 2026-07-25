import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  sendAnnouncement,
  getClasses,
  getStudents,
  getTeachers,
  getDepartments,
  getSubjects,
  getStudentGroups,
} from "./announcementsAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// GET ALL ANNOUNCEMENTS
export const fetchAllAnnouncements = createAppAsyncThunk(
  "announcements/fetchAllAnnouncements",
  (params) => getAllAnnouncements(params)
);

// GET ANNOUNCEMENT BY ID
export const fetchAnnouncementById = createAppAsyncThunk(
  "announcements/fetchAnnouncementById",
  (announcementId) => getAnnouncementById(announcementId)
);

// CREATE ANNOUNCEMENT
export const createAnnouncementAsync = createAppAsyncThunk(
  "announcements/createAnnouncement",
  (data) => createAnnouncement(data)
);

// UPDATE ANNOUNCEMENT
export const updateAnnouncementAsync = createAppAsyncThunk(
  "announcements/updateAnnouncement",
  ({ id, data }) => updateAnnouncement(id, data)
);

// DELETE ANNOUNCEMENT
export const deleteAnnouncementAsync = createAppAsyncThunk(
  "announcements/deleteAnnouncement",
  async (announcementId) => {
    await deleteAnnouncement(announcementId);
    return announcementId;
  }
);

// PUBLISH ANNOUNCEMENT
export const publishAnnouncementAsync = createAppAsyncThunk(
  "announcements/publishAnnouncement",
  (announcementId) => publishAnnouncement(announcementId)
);

// SEND ANNOUNCEMENT
export const sendAnnouncementAsync = createAppAsyncThunk(
  "announcements/sendAnnouncement",
  (announcementId) => sendAnnouncement(announcementId)
);

// =====================================
// AUDIENCE DATA THUNKS
// =====================================

// GET ALL CLASSES
export const fetchClasses = createAppAsyncThunk(
  "announcements/fetchClasses",
  () => getClasses()
);

// GET ALL STUDENTS
export const fetchStudents = createAppAsyncThunk(
  "announcements/fetchStudents",
  () => getStudents()
);

// GET ALL TEACHERS
export const fetchTeachers = createAppAsyncThunk(
  "announcements/fetchTeachers",
  () => getTeachers()
);

// GET ALL DEPARTMENTS
export const fetchDepartments = createAppAsyncThunk(
  "announcements/fetchDepartments",
  () => getDepartments()
);

// GET ALL SUBJECTS
export const fetchSubjects = createAppAsyncThunk(
  "announcements/fetchSubjects",
  () => getSubjects()
);

// GET ALL STUDENT GROUPS
export const fetchStudentGroups = createAppAsyncThunk(
  "announcements/fetchStudentGroups",
  () => getStudentGroups()
);

const initialState = {
  announcementList: [],
  currentAnnouncement: null,
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
  ...commonState,
};

const announcementsSlice = createSlice({
  name: "announcements",
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

      // GET ALL ANNOUNCEMENTS
      .addCase(fetchAllAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcementList = action.payload.content || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      // GET ANNOUNCEMENT BY ID
      .addCase(fetchAnnouncementById.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnnouncement = action.payload;
      })

      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // CREATE ANNOUNCEMENT
      .addCase(createAnnouncementAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createAnnouncementAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createAnnouncementAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // UPDATE ANNOUNCEMENT
      .addCase(updateAnnouncementAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateAnnouncementAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateAnnouncementAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // DELETE ANNOUNCEMENT
      .addCase(deleteAnnouncementAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteAnnouncementAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(deleteAnnouncementAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // PUBLISH ANNOUNCEMENT
      .addCase(publishAnnouncementAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(publishAnnouncementAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(publishAnnouncementAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // SEND ANNOUNCEMENT
      .addCase(sendAnnouncementAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(sendAnnouncementAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(sendAnnouncementAsync.rejected, (state, action) => {
        handleRejected(state, action);
        state.success = false;
      })

      // GET CLASSES
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
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

export const { clearError, clearSuccess } = announcementsSlice.actions;
export default announcementsSlice.reducer;
