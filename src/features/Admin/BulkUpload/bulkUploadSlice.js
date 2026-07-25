import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  uploadStudents,
  uploadTeachers,
  uploadStaff,
} from "./bulkUploadAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";

// Async Thunks
export const uploadStudentsAsync = createAppAsyncThunk(
  "bulkUpload/uploadStudents",
  (file) => uploadStudents(file)
);

export const uploadTeachersAsync = createAppAsyncThunk(
  "bulkUpload/uploadTeachers",
  (file) => uploadTeachers(file)
);

export const uploadStaffAsync = createAppAsyncThunk(
  "bulkUpload/uploadStaff",
  (file) => uploadStaff(file)
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  successMessage: null,
  studentUpload: {
    loading: false,
    success: false,
    error: null,
  },
  teacherUpload: {
    loading: false,
    success: false,
    error: null,
  },
  staffUpload: {
    loading: false,
    success: false,
    error: null,
  },
};

const bulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
      state.studentUpload.success = false;
      state.teacherUpload.success = false;
      state.staffUpload.success = false;
    },
    clearError: (state) => {
      state.error = null;
      state.studentUpload.error = null;
      state.teacherUpload.error = null;
      state.staffUpload.error = null;
      state.historyError = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Students
    builder
      .addCase(uploadStudentsAsync.pending, (state) => {
        state.studentUpload.loading = true;
        state.studentUpload.error = null;
      })
      .addCase(uploadStudentsAsync.fulfilled, (state, action) => {
        state.studentUpload.loading = false;

        // Check if there are errors in the response
        if (action.payload?.errorCount > 0) {
          const errorData = action.payload;
          let errorMessage = "Bulk Upload Failed";

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += "\n\n";
            errorMessage += errorData.errors.map(err => `• ${err}`).join("\n");
          }

          state.studentUpload.error = errorMessage;
          state.error = errorMessage;
          state.studentUpload.success = false;
        } else {
          // True success - no errors
          state.studentUpload.success = true;
          state.success = true;

          let successMessage = "Bulk Upload Completed Successfully";
          if (action.payload?.totalRecords !== undefined) {
            successMessage += `\n\nTotal Records: ${action.payload.totalRecords}`;
            successMessage += `\n\nUploaded: ${action.payload.successCount || 0}`;
            successMessage += `\n\nFailed: ${action.payload.errorCount || 0}`;
          }

          state.successMessage = successMessage;
        }
      })
      .addCase(uploadStudentsAsync.rejected, (state, action) => {
        state.studentUpload.loading = false;
        const errorData = action.payload;

        let errorMessage = "Bulk Upload Failed";
        if (errorData?.totalRecords !== undefined) {

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += "\n\n";
            errorMessage += errorData.errors.map(err => `• ${err}`).join("\n");
          }
        } else {
          errorMessage = action.payload?.message || action.error?.message || "Failed to upload students";
        }

        state.studentUpload.error = errorMessage;
        state.error = errorMessage;
      });

    // Upload Teachers
    builder
      .addCase(uploadTeachersAsync.pending, (state) => {
        state.teacherUpload.loading = true;
        state.teacherUpload.error = null;
      })
      .addCase(uploadTeachersAsync.fulfilled, (state, action) => {
        state.teacherUpload.loading = false;

        // Check if there are errors in the response
        if (action.payload?.errorCount > 0) {
          const errorData = action.payload;
          let errorMessage = "Bulk Upload Failed";

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += "\n\n";
            errorMessage += errorData.errors.map(err => `• ${err}`).join("\n");
          }

          state.teacherUpload.error = errorMessage;
          state.error = errorMessage;
          state.teacherUpload.success = false;
        } else {
          // True success - no errors
          state.teacherUpload.success = true;
          state.success = true;

          let successMessage = "Bulk Upload Completed Successfully";
          if (action.payload?.totalRecords !== undefined) {
            successMessage += `\n\nTotal Records: ${action.payload.totalRecords}`;
            successMessage += `\n\nUploaded: ${action.payload.successCount || 0}`;
            successMessage += `\n\nFailed: ${action.payload.errorCount || 0}`;
          }

          state.successMessage = successMessage;
        }
      })
      .addCase(uploadTeachersAsync.rejected, (state, action) => {
        state.teacherUpload.loading = false;
        const errorData = action.payload;

        let errorMessage = "Bulk Upload Failed";
        if (errorData?.totalRecords !== undefined) {

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += "\n\n";
            errorMessage += errorData.errors.map(err => `• ${err}`).join("\n");
          }
        } else {
          errorMessage = action.payload?.message || action.error?.message || "Failed to upload teachers";
        }

        state.teacherUpload.error = errorMessage;
        state.error = errorMessage;
      });

    // Upload Staff
    builder
      .addCase(uploadStaffAsync.pending, (state) => {
        state.staffUpload.loading = true;
        state.staffUpload.error = null;
      })
      .addCase(uploadStaffAsync.fulfilled, (state, action) => {
        state.staffUpload.loading = false;

        // Check if there are errors in the response
        if (action.payload?.errorCount > 0) {
          const errorData = action.payload;
          let errorMessage = "Bulk Upload Failed";

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += "\n\n";
            errorMessage += errorData.errors.map(err => `• ${err}`).join("\n");
          }

          state.staffUpload.error = errorMessage;
          state.error = errorMessage;
          state.staffUpload.success = false;
        } else {
          // True success - no errors
          state.staffUpload.success = true;
          state.success = true;

          let successMessage = "Bulk Upload Completed Successfully";
          if (action.payload?.totalRecords !== undefined) {
            successMessage += `\n\nTotal Records: ${action.payload.totalRecords}`;
            successMessage += `\n\nUploaded: ${action.payload.successCount || 0}`;
            successMessage += `\n\nFailed: ${action.payload.errorCount || 0}`;
          }

          state.successMessage = successMessage;
        }
      })
      .addCase(uploadStaffAsync.rejected, (state, action) => {
        state.staffUpload.loading = false;
        const errorData = action.payload;

        let errorMessage = "Bulk Upload Failed";
        if (errorData?.totalRecords !== undefined) {

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += "\n\n";
            errorMessage += errorData.errors.map(err => `• ${err}`).join("\n");
          }
        } else {
          errorMessage = action.payload?.message || action.error?.message || "Failed to upload staff";
        }

        state.staffUpload.error = errorMessage;
        state.error = errorMessage;
      });

  },
});

export const { clearSuccess, clearError } = bulkUploadSlice.actions;
export default bulkUploadSlice.reducer;
