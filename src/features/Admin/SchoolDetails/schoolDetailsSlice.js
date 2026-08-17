import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import {
  getSchoolDetails,
  createSchoolDetails,
  updateSchoolDetails,
  deleteSchoolLogo,
} from "./schoolDetailsApi";

export const getSchoolDetailsAsync = createAppAsyncThunk(
  "schoolDetails/getSchoolDetails",
  async () => (await getSchoolDetails()).data
);

export const createSchoolDetailsAsync = createAppAsyncThunk(
  "schoolDetails/createSchoolDetails",
  (formData) => createSchoolDetails(formData)
);

export const updateSchoolDetailsAsync = createAppAsyncThunk(
  "schoolDetails/updateSchoolDetails",
  (formData) => updateSchoolDetails(formData)
);

export const deleteSchoolLogoAsync = createAppAsyncThunk(
  "schoolDetails/deleteSchoolLogo",
  async () => {
    await deleteSchoolLogo();
    return null;
  }
);

const initialState = {
  schoolDetails: null,
  successMessage: null,
  ...commonState,
};

const schoolDetailsSlice = createSlice({
  name: "schoolDetails",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    resetSchoolDetails: (state) => {
      state.schoolDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSchoolDetailsAsync.pending, handlePending)
      .addCase(getSchoolDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolDetails = action.payload;
      })
      .addCase(getSchoolDetailsAsync.rejected, handleRejected)

      .addCase(createSchoolDetailsAsync.pending, handlePending)
      .addCase(createSchoolDetailsAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.successMessage = "School details created successfully";
        state.schoolDetails = action.payload;
      })
      .addCase(createSchoolDetailsAsync.rejected, handleRejected)

      .addCase(updateSchoolDetailsAsync.pending, handlePending)
      .addCase(updateSchoolDetailsAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.successMessage = "School details updated successfully";
        state.schoolDetails = action.payload;
      })
      .addCase(updateSchoolDetailsAsync.rejected, handleRejected)

      .addCase(deleteSchoolLogoAsync.pending, handlePending)
      .addCase(deleteSchoolLogoAsync.fulfilled, (state) => {
        handleSuccess(state);
        state.successMessage = "School logo deleted successfully";
        if (state.schoolDetails) {
          state.schoolDetails.schoolLogoUrl = null;
          state.schoolDetails.schoolLogoFileName = null;
        }
      })
      .addCase(deleteSchoolLogoAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, resetSchoolDetails } = schoolDetailsSlice.actions;
export default schoolDetailsSlice.reducer;
