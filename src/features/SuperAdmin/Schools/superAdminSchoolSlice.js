import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import {
  createSuperAdminSchool,
  deleteSuperAdminSchool,
  getSuperAdminSchools,
  updateSuperAdminSchool,
  uploadSuperAdminSchoolLogo,
} from "./superAdminSchoolAPI";

export const fetchSuperAdminSchoolsAsync = createAppAsyncThunk(
  "superAdminSchools/fetchAll",
  (params) => getSuperAdminSchools(params),
);

export const createSuperAdminSchoolAsync = createAppAsyncThunk(
  "superAdminSchools/create",
  (data) => createSuperAdminSchool(data),
);

export const updateSuperAdminSchoolAsync = createAppAsyncThunk(
  "superAdminSchools/update",
  (payload) => updateSuperAdminSchool(payload),
);

export const uploadSchoolLogoAsync = createAppAsyncThunk(
  "superAdminSchools/uploadLogo",
  (payload) => uploadSuperAdminSchoolLogo(payload),
);

export const deleteSuperAdminSchoolAsync = createAppAsyncThunk(
  "superAdminSchools/delete",
  async (id) => {
    await deleteSuperAdminSchool(id);
    return id;
  },
);

const initialState = {
  schools: [],
  page: 1,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  last: true,
  uploadLoading: false,
  uploadSuccess: false,
  uploadError: null,
  ...commonState,
};

const superAdminSchoolSlice = createSlice({
  name: "superAdminSchools",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    clearUploadState: (state) => {
      state.uploadSuccess = false;
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminSchoolsAsync.pending, handlePending)
      .addCase(fetchSuperAdminSchoolsAsync.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.loading = false;
        state.error = null;
        state.schools = payload.content || [];
        state.page = payload.page ?? 1;
        state.size = payload.size ?? 20;
        state.totalElements = payload.totalElements ?? 0;
        state.totalPages = payload.totalPages ?? 0;
        state.last = payload.last ?? true;
      })
      .addCase(fetchSuperAdminSchoolsAsync.rejected, handleRejected)

      .addCase(createSuperAdminSchoolAsync.pending, handlePending)
      .addCase(createSuperAdminSchoolAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      })
      .addCase(createSuperAdminSchoolAsync.rejected, handleRejected)

      .addCase(updateSuperAdminSchoolAsync.pending, handlePending)
      .addCase(updateSuperAdminSchoolAsync.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(updateSuperAdminSchoolAsync.rejected, handleRejected)

      .addCase(uploadSchoolLogoAsync.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadSchoolLogoAsync.fulfilled, (state) => {
        state.uploadLoading = false;
        state.uploadError = null;
        state.uploadSuccess = true;
      })
      .addCase(uploadSchoolLogoAsync.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload || action.error?.message || "Something went wrong";
        state.uploadSuccess = false;
      })

      .addCase(deleteSuperAdminSchoolAsync.pending, handlePending)
      .addCase(deleteSuperAdminSchoolAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.schools = state.schools.filter((school) => school.id !== action.payload);
      })
      .addCase(deleteSuperAdminSchoolAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, clearUploadState } = superAdminSchoolSlice.actions;
export default superAdminSchoolSlice.reducer;
