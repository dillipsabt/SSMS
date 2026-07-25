// ==============================================
// src/features/Admin/FeesConfig/feesConfigSlice.js
// ==============================================

import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";

import {
  getFeesConfigs,
  createFeesConfig,
  updateFeesConfig,
  deleteFeesConfig,
  getClasses,
} from "./feesConfigAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// ==============================================
// GET FEES CONFIG
// ==============================================

export const fetchFeesConfigsAsync = createAppAsyncThunk(
  "feesConfig/fetchFeesConfigs",
  (params) => getFeesConfigs(params)
);

// ==============================================
// CREATE FEES CONFIG
// ==============================================

export const createFeesConfigAsync = createAppAsyncThunk(
  "feesConfig/createFeesConfig",
  (data) => createFeesConfig(data)
);

// ==============================================
// UPDATE FEES CONFIG
// ==============================================

export const updateFeesConfigAsync = createAppAsyncThunk(
  "feesConfig/updateFeesConfig",
  ({ id, data }) => updateFeesConfig(id, data)
);

// ==============================================
// DELETE FEES CONFIG
// ==============================================

export const deleteFeesConfigAsync = createAppAsyncThunk(
  "feesConfig/deleteFeesConfig",
  async (id) => {
    await deleteFeesConfig(id);
    return id;
  }
);

// ==============================================
// GET CLASSES
// ==============================================

export const fetchClassesAsync = createAppAsyncThunk(
  "feesConfig/fetchClasses",
  () => getClasses()
);

// ==============================================
// INITIAL STATE
// ==============================================

const initialState = {
  feesConfigs: [],
  classes: [],
  ...commonState,
};

// ==============================================
// SLICE
// ==============================================

const feesConfigSlice = createSlice({
  name: "feesConfig",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH FEES CONFIG
      // ==========================================

      .addCase(fetchFeesConfigsAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchFeesConfigsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.feesConfigs = action.payload || [];
      })

      .addCase(fetchFeesConfigsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ==========================================
      // CREATE FEES CONFIG
      // ==========================================

      .addCase(createFeesConfigAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createFeesConfigAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.feesConfigs.unshift(action.payload);
      })

      .addCase(createFeesConfigAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ==========================================
      // UPDATE FEES CONFIG
      // ==========================================

      .addCase(updateFeesConfigAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateFeesConfigAsync.fulfilled, (state, action) => {
        handleSuccess(state);

        const index = state.feesConfigs.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.feesConfigs[index] = action.payload;
        }
      })

      .addCase(updateFeesConfigAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ==========================================
      // DELETE FEES CONFIG
      // ==========================================

      .addCase(deleteFeesConfigAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteFeesConfigAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.feesConfigs = state.feesConfigs.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(deleteFeesConfigAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ==========================================
      // FETCH CLASSES
      // ==========================================

      .addCase(fetchClassesAsync.fulfilled, (state, action) => {
        state.classes = action.payload || [];
      });
  },
});

export default feesConfigSlice.reducer;
