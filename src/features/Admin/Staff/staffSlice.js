import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import {
  getStaffAPI,
  getStaffByIdAPI,
  addStaffAPI,
  updateStaffAPI,
  deleteStaffAPI,
  getReligionsAPI,
  getBloodGroupsAPI,
  getDepartmentsAPI,
} from "./staffServiceApi";

export const getStaffAsync = createAppAsyncThunk(
  "staff/getAll",
  () => getStaffAPI()
);

export const getStaffByIdAsync = createAppAsyncThunk(
  "staff/getById",
  (id) => getStaffByIdAPI(id)
);

export const addStaffAsync = createAppAsyncThunk(
  "staff/add",
  (formData) => addStaffAPI(formData)
);

export const updateStaffAsync = createAppAsyncThunk(
  "staff/update",
  ({ id, data }) => updateStaffAPI(id, data)
);

export const deleteStaffAsync = createAppAsyncThunk(
  "staff/delete",
  (id) => deleteStaffAPI(id)
);

export const getReligionsAsync = createAppAsyncThunk(
  "staff/getReligions",
  () => getReligionsAPI()
);

export const getBloodGroupsAsync = createAppAsyncThunk(
  "staff/getBloodGroups",
  () => getBloodGroupsAPI()
);

export const getDepartmentsAsync = createAppAsyncThunk(
  "staff/getDepartments",
  () => getDepartmentsAPI()
);

const initialState = {
  staff: [],
  singleStaff: null,
  religions: [],
  bloodGroups: [],
  departments: [],
  message: null,
  ...commonState,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    resetStaffState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStaffAsync.pending, handlePending)
      .addCase(getStaffAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(getStaffAsync.rejected, handleRejected)

      .addCase(getStaffByIdAsync.pending, handlePending)
      .addCase(getStaffByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.singleStaff = action.payload || null;
      })
      .addCase(getStaffByIdAsync.rejected, handleRejected)

      .addCase(addStaffAsync.pending, handlePending)
      .addCase(addStaffAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.message = action.payload;
      })
      .addCase(addStaffAsync.rejected, handleRejected)

      .addCase(updateStaffAsync.pending, handlePending)
      .addCase(updateStaffAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.message = action.payload;
      })
      .addCase(updateStaffAsync.rejected, handleRejected)

      .addCase(deleteStaffAsync.pending, handlePending)
      .addCase(deleteStaffAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.message = action.payload;
      })
      .addCase(deleteStaffAsync.rejected, handleRejected)

      .addCase(getReligionsAsync.pending, handlePending)
      .addCase(getReligionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.religions = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(getReligionsAsync.rejected, handleRejected)

      .addCase(getBloodGroupsAsync.pending, handlePending)
      .addCase(getBloodGroupsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodGroups = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(getBloodGroupsAsync.rejected, handleRejected)

      .addCase(getDepartmentsAsync.pending, handlePending)
      .addCase(getDepartmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(getDepartmentsAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, resetStaffState } = staffSlice.actions;
export default staffSlice.reducer;
