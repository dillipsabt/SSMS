import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import {
  getStudentFees,
  createPaymentTransaction,
  getReceipts,
  getReceiptByTransactionId,
  getPaymentHistory,
} from "./feesTransactionAPI";

export const fetchStudentFeesAsync = createAppAsyncThunk(
  "feesTransaction/fetchStudentFees",
  (rollNo) => getStudentFees(rollNo)
);

export const createPaymentTransactionAsync = createAppAsyncThunk(
  "feesTransaction/createPaymentTransaction",
  (data) => createPaymentTransaction(data)
);

export const fetchReceiptsAsync = createAppAsyncThunk(
  "feesTransaction/fetchReceipts",
  (params) => getReceipts(params)
);

export const fetchReceiptByTransactionIdAsync = createAppAsyncThunk(
  "feesTransaction/fetchReceiptByTransactionId",
  (transactionId) => getReceiptByTransactionId(transactionId)
);

export const fetchPaymentHistoryAsync = createAppAsyncThunk(
  "feesTransaction/fetchPaymentHistory",
  ({ admissionNo, params }) => getPaymentHistory(admissionNo, params)
);

const initialState = {
  studentFees: null,
  receipts: [],
  selectedReceipt: null,
  paymentHistory: [],
  transaction: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  historyPagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  ...commonState,
};

const feesTransactionSlice = createSlice({
  name: "feesTransaction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearSelectedReceipt: (state) => {
      state.selectedReceipt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentFeesAsync.pending, handlePending)
      .addCase(fetchStudentFeesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFees = action.payload;
      })
      .addCase(fetchStudentFeesAsync.rejected, handleRejected)

      .addCase(createPaymentTransactionAsync.pending, handlePending)
      .addCase(createPaymentTransactionAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.transaction = action.payload;
      })
      .addCase(createPaymentTransactionAsync.rejected, handleRejected)

      .addCase(fetchReceiptsAsync.pending, handlePending)
      .addCase(fetchReceiptsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload?.content || action.payload || [];
        state.pagination = {
          page: action.payload?.page || 0,
          size: action.payload?.size || 10,
          totalElements: action.payload?.totalElements || 0,
          totalPages: action.payload?.totalPages || 0,
        };
      })
      .addCase(fetchReceiptsAsync.rejected, handleRejected)

      .addCase(fetchReceiptByTransactionIdAsync.pending, handlePending)
      .addCase(fetchReceiptByTransactionIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReceipt = action.payload;
      })
      .addCase(fetchReceiptByTransactionIdAsync.rejected, handleRejected)

      .addCase(fetchPaymentHistoryAsync.pending, handlePending)
      .addCase(fetchPaymentHistoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.content || action.payload || [];
        state.historyPagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchPaymentHistoryAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, clearSelectedReceipt } = feesTransactionSlice.actions;
export default feesTransactionSlice.reducer;
