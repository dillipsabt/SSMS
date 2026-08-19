import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { createPayslipAPI, deletePayslipAPI, getPayslipAPI } from "./payslipAPI";

export const createPayslip = createAppAsyncThunk(
  "payslip/create",
  (payload) => createPayslipAPI(payload),
);

export const getPayslip = createAppAsyncThunk(
  "payslip/getById",
  (id) => getPayslipAPI(id),
);

export const deletePayslip = createAppAsyncThunk(
  "payslip/delete",
  (id) => deletePayslipAPI(id),
);

const initialState = {
  currentPayslip: null,
  payslips: [],
  ...commonState,
};

const payslipSlice = createSlice({
  name: "payslip",
  initialState,
  reducers: {
    clearPayslipError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentPayslip = action.payload;
        state.payslips.unshift(action.payload);
      })
      .addCase(createPayslip.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || action.payload || action.error?.message || "Unable to save payslip";
      })
      .addCase(getPayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayslip = action.payload;
      })
      .addCase(getPayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || action.error?.message || "Unable to load payslip";
      })
      .addCase(deletePayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.payslips = state.payslips.filter((payslip) => payslip.id !== action.meta.arg);
      })
      .addCase(deletePayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || action.error?.message || "Unable to delete payslip";
      });
  },
});

export const { clearPayslipError } = payslipSlice.actions;
export default payslipSlice.reducer;
