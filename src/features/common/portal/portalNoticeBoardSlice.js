import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected } from "../../../utils/reducerHelpers";
import { getPortalNotices } from "./noticeBoardPortalApi";

export const getPortalNoticesAsync = createAppAsyncThunk(
  "portalNoticeBoard/getPortalNotices",
  ({ role, title, noticeDate }) => {
    const params = {};
    if (title) params.title = title;
    if (noticeDate) params.noticeDate = noticeDate;
    return getPortalNotices(role, params);
  }
);

const initialState = {
  todayNotices: [],
  earlierNotices: [],
  ...commonState,
};

const portalNoticeBoardSlice = createSlice({
  name: "portalNoticeBoard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPortalNoticesAsync.pending, handlePending)
      .addCase(getPortalNoticesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.todayNotices = action.payload.today || [];
        state.earlierNotices = action.payload.earlier || [];
        state.success = true;
      })
      .addCase(getPortalNoticesAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = portalNoticeBoardSlice.actions;
export default portalNoticeBoardSlice.reducer;
