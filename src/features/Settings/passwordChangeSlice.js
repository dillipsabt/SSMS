import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../utils/createAppAsyncThunk";
import { changePassword } from "./passwordChangeAPI";

export const changePasswordAsync = createAppAsyncThunk(
  "passwordChange/change",
  (data) => changePassword(data),
);

const passwordChangeSlice = createSlice({
  name: "passwordChange",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearPasswordChangeStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || action.error?.message || "Something went wrong";
      });
  },
});

export const { clearPasswordChangeStatus } = passwordChangeSlice.actions;
export default passwordChangeSlice.reducer;
