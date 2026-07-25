import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import {
  createTextbook,
  deleteTextbook,
  getTextbookById,
  getTextbooks,
  updateTextbook,
} from "./textbookAPI";

export const fetchTextbooksAsync = createAppAsyncThunk(
  "textbooks/fetchAll",
  (params) => getTextbooks(params),
);

export const fetchTextbookByIdAsync = createAppAsyncThunk(
  "textbooks/fetchById",
  (id) => getTextbookById(id),
);

export const createTextbookAsync = createAppAsyncThunk(
  "textbooks/create",
  (data) => createTextbook(data),
);

export const updateTextbookAsync = createAppAsyncThunk(
  "textbooks/update",
  ({ id, data }) => updateTextbook(id, data),
);

export const deleteTextbookAsync = createAppAsyncThunk(
  "textbooks/delete",
  async (id) => {
    await deleteTextbook(id);
    return id;
  },
);


const initialState = {
  textbooks: [],
  selectedBook: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  success: false,
};

const textbooksSlice = createSlice({
  name: "textbooks",
  initialState,
  reducers: {
    clearTextbookError: (state) => {
      state.error = null;
    },
    clearTextbookSuccess: (state) => {
      state.success = false;
    },
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTextbooksAsync.pending, handlePending)
      .addCase(fetchTextbooksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.textbooks = action.payload?.content || [];
        state.pagination = {
          page: action.payload?.page ?? 0,
          size: action.payload?.size ?? 10,
          totalElements: action.payload?.totalElements ?? 0,
          totalPages: action.payload?.totalPages ?? 0,
        };
      })
      .addCase(fetchTextbooksAsync.rejected, handleRejected)
      .addCase(fetchTextbookByIdAsync.pending, handlePending)
      .addCase(fetchTextbookByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchTextbookByIdAsync.rejected, handleRejected)
      .addCase(createTextbookAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTextbookAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        if (action.payload) state.textbooks.unshift(action.payload);
      })
      .addCase(createTextbookAsync.rejected, (state, action) => {
        state.createLoading = false;
        handleRejected(state, action);
      })
      .addCase(updateTextbookAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateTextbookAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        const index = state.textbooks.findIndex((book) => book.id === action.payload?.id);
        if (index !== -1) state.textbooks[index] = action.payload;
      })
      .addCase(updateTextbookAsync.rejected, (state, action) => {
        state.updateLoading = false;
        handleRejected(state, action);
      })
      .addCase(deleteTextbookAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteTextbookAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success = true;
        state.textbooks = state.textbooks.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteTextbookAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        handleRejected(state, action);
      })
;
  },
});

export const { clearTextbookError, clearTextbookSuccess, clearSelectedBook } = textbooksSlice.actions;
export default textbooksSlice.reducer;
