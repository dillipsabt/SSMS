import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import { handlePending, handleRejected, handleSuccess } from "../../../utils/reducerHelpers";
import { loginSuperAdmin } from "./superAdminAuthAPI";

const STORAGE_KEYS = {
  authenticated: "superAdminAuthenticated",
  token: "superAdminToken",
  userId: "superAdminUserId",
  username: "superAdminUsername",
  role: "superAdminRole",
  name: "superAdminName",
};

export const loginSuperAdminAsync = createAppAsyncThunk(
  "superAdminAuth/login",
  (credentials) => loginSuperAdmin(credentials),
);

const initialState = {
  token: sessionStorage.getItem(STORAGE_KEYS.token),
  userId: sessionStorage.getItem(STORAGE_KEYS.userId),
  username: sessionStorage.getItem(STORAGE_KEYS.username),
  role: sessionStorage.getItem(STORAGE_KEYS.role),
  name: sessionStorage.getItem(STORAGE_KEYS.name),
  ...commonState,
};

const superAdminAuthSlice = createSlice({
  name: "superAdminAuth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    logoutSuperAdmin: (state) => {
      Object.values(STORAGE_KEYS).forEach((key) => sessionStorage.removeItem(key));
      state.token = null;
      state.userId = null;
      state.username = null;
      state.role = null;
      state.name = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuperAdminAsync.pending, handlePending)
      .addCase(loginSuperAdminAsync.fulfilled, (state, action) => {
        const { token, userId, username, role, name } = action.payload || {};

        if (!token || role !== "SUPER_ADMIN") {
          state.loading = false;
          state.success = false;
          state.error = { message: token ? "This account is not authorized for the Super Admin portal" : "No token received from server" };
          return;
        }

        handleSuccess(state);
        state.token = token;
        state.userId = userId ?? null;
        state.username = username ?? null;
        state.role = role ?? null;
        state.name = name ?? null;

        sessionStorage.setItem(STORAGE_KEYS.authenticated, "true");
        sessionStorage.setItem(STORAGE_KEYS.token, token);
        sessionStorage.setItem(STORAGE_KEYS.userId, String(userId ?? ""));
        sessionStorage.setItem(STORAGE_KEYS.username, username ?? "");
        sessionStorage.setItem(STORAGE_KEYS.role, role ?? "");
        sessionStorage.setItem(STORAGE_KEYS.name, name ?? "");
      })
      .addCase(loginSuperAdminAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess, logoutSuperAdmin } = superAdminAuthSlice.actions;
export default superAdminAuthSlice.reducer;
