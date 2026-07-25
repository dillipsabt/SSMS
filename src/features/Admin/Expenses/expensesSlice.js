import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expensesAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// =====================================
// ASYNC THUNKS
// =====================================

// GET ALL EXPENSES
export const getExpensesAsync = createAppAsyncThunk(
  "expenses/getExpenses",
  (params) => getAllExpenses(params)
);

// GET EXPENSE BY ID
export const getExpenseByIdAsync = createAppAsyncThunk(
  "expenses/getExpenseById",
  (expenseId) => getExpenseById(expenseId)
);

// CREATE EXPENSE
export const createExpenseAsync = createAppAsyncThunk(
  "expenses/createExpense",
  (formData) => createExpense(formData)
);

// UPDATE EXPENSE
export const updateExpenseAsync = createAppAsyncThunk(
  "expenses/updateExpense",
  ({ id, formData }) => updateExpense(id, formData)
);

// DELETE EXPENSE
export const deleteExpenseAsync = createAppAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId) => {
    await deleteExpense(expenseId);
    return expenseId;
  }
);

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  expenseList: [],
  expenseDetails: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  ...commonState,
  successMessage: null,
};

// =====================================
// SLICE
// =====================================

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    resetExpenseDetails: (state) => {
      state.expenseDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ====== GET ALL EXPENSES ======
      .addCase(getExpensesAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getExpensesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseList = action.payload.content || action.payload || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(getExpensesAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET EXPENSE BY ID ======
      .addCase(getExpenseByIdAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getExpenseByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseDetails = action.payload;
      })

      .addCase(getExpenseByIdAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== CREATE EXPENSE ======
      .addCase(createExpenseAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createExpenseAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createExpenseAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== UPDATE EXPENSE ======
      .addCase(updateExpenseAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateExpenseAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateExpenseAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== DELETE EXPENSE ======
      .addCase(deleteExpenseAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.expenseList = state.expenseList.filter(
          (expense) => expense.id !== action.payload
        );
      })

      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearError, clearSuccess, resetExpenseDetails } = expensesSlice.actions;
export default expensesSlice.reducer;
