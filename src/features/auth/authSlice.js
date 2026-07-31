import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../services/authService";
import API from "../../api/axios";
import { parseJwt } from "../../utils/jwt";
import { clearAuthStorage } from "../../utils/storage";

// ✅ ROLE NORMALIZATION FUNCTION
const normalizeRole = (rawRole, email) => {
  switch (rawRole) {
    case "ROLE_ADMIN":
      return "admin";

    case "ROLE_TEACHER":
      return "teacher-portal";

    case "ROLE_STUDENT":
      return "student-portal";

    case "ROLE_PARENT":
      return "parent-portal";

    case "ROLE_STAFF":
      return "staff-portal";

    default:
      // fallback check using email
      if (email?.includes("parent")) {
        return "parent-portal";
      }

      return "admin";
  }
};

const getDepartmentName = (data, payload) =>
  data.departmentName ||
  data.department?.name ||
  data.staff?.departmentName ||
  data.staff?.department?.name ||
  data.profile?.departmentName ||
  data.profile?.department?.name ||
  payload?.departmentName ||
  payload?.department?.name ||
  "";

// ✅ LOGIN ACTION
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginUser(credentials);

      if (!data.token) {
        return thunkAPI.rejectWithValue("No token received from server");
      }

      const payload = parseJwt(data.token);

      const rawRole = payload?.roles?.[0] || data.role || "";

      const role = normalizeRole(rawRole, data.email);
      let departmentName = getDepartmentName(data, payload);

      if (role === "staff-portal" && !departmentName && data.profileId) {
        try {
          const response = await API.get(`/staff/${data.profileId}`, {
            headers: { Authorization: `Bearer ${data.token}` },
            skipErrorToast: true,
          });
          departmentName = getDepartmentName(response.data, null);
        } catch {
          departmentName = "";
        }
      }

      const isAdministration =
        role === "staff-portal" &&
        departmentName.trim().toLowerCase() === "administration";

      const loginPayload = {
        token: data.token,
        user: payload?.sub || data.email || "user",
        userId: data.userId || null,
        profileId: data.profileId || null,
        role: role || "admin",
        isAdministration,
        schoolLogourl: data.schoolLogourl || null,
      };

      return loginPayload;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: localStorage.getItem("user") || null,
    userId: localStorage.getItem("userId") || null,
    profileId: localStorage.getItem("profileId") || null,
    schoolLogourl: localStorage.getItem("schoolLogourl") || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    isAdministration: localStorage.getItem("isAdministration") === "true",
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.profileId = null;
      state.token = null;
      state.role = null;
      state.isAdministration = false;

      clearAuthStorage();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.profileId = action.payload.profileId;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAdministration = action.payload.isAdministration;

        localStorage.setItem("token", action.payload.token || "");
        localStorage.setItem("role", action.payload.role || "admin");
        localStorage.setItem("isAdministration", String(action.payload.isAdministration));
        localStorage.setItem("user", action.payload.user || "");
        if (action.payload.userId) localStorage.setItem("userId", action.payload.userId);
        if (action.payload.profileId) localStorage.setItem("profileId", action.payload.profileId);
        if (action.payload.schoolLogourl) localStorage.setItem("schoolLogourl", action.payload.schoolLogourl);
        localStorage.setItem("isLoggedIn", "true");
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
