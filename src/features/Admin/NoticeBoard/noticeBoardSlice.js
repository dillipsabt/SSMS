import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  publishNotice,
} from "./noticeBoardAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// GET ALL NOTICES
export const getNoticeBoardListAsync = createAppAsyncThunk(
  "noticeBoard/getNoticeBoardList",
  (params) => getAllNotices(params)
);

// GET NOTICE BY ID
export const getNoticeBoardByIdAsync = createAppAsyncThunk(
  "noticeBoard/getNoticeBoardById",
  (noticeId) => getNoticeById(noticeId)
);

// CREATE NOTICE
export const createNoticeBoardAsync = createAppAsyncThunk(
  "noticeBoard/createNoticeBoard",
  (data) => createNotice(data)
);

// UPDATE NOTICE
export const updateNoticeBoardAsync = createAppAsyncThunk(
  "noticeBoard/updateNoticeBoard",
  ({ id, data }) => updateNotice(id, data)
);

// DELETE NOTICE
export const deleteNoticeBoardAsync = createAppAsyncThunk(
  "noticeBoard/deleteNoticeBoard",
  async (noticeId) => {
    await deleteNotice(noticeId);
    return noticeId;
  }
);

// PUBLISH NOTICE
export const publishNoticeBoardAsync = createAppAsyncThunk(
  "noticeBoard/publishNoticeBoard",
  (data) => publishNotice(data)
);

const initialState = {
  noticeList: [],
  currentNotice: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  ...commonState,
};

const noticeBoardSlice = createSlice({
  name: "noticeBoard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET ALL NOTICES
      .addCase(getNoticeBoardListAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getNoticeBoardListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.noticeList = action.payload.content || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(getNoticeBoardListAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // GET NOTICE BY ID
      .addCase(getNoticeBoardByIdAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getNoticeBoardByIdAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.currentNotice = action.payload;
      })

      .addCase(getNoticeBoardByIdAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // CREATE NOTICE
      .addCase(createNoticeBoardAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createNoticeBoardAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createNoticeBoardAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // UPDATE NOTICE
      .addCase(updateNoticeBoardAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateNoticeBoardAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateNoticeBoardAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // DELETE NOTICE
      .addCase(deleteNoticeBoardAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteNoticeBoardAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(deleteNoticeBoardAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // PUBLISH NOTICE
      .addCase(publishNoticeBoardAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(publishNoticeBoardAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(publishNoticeBoardAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearError, clearSuccess, resetState } = noticeBoardSlice.actions;
export default noticeBoardSlice.reducer;
