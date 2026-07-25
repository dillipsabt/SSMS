import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStudentNotifications,
  getTeacherNotifications,
  markNotificationAsRead,
} from "./notificationsAPI";

// GET STUDENT NOTIFICATIONS
export const fetchStudentNotifications = createAsyncThunk(
  "notifications/fetchStudentNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getStudentNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

// GET TEACHER NOTIFICATIONS
export const fetchTeacherNotifications = createAsyncThunk(
  "notifications/fetchTeacherNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getTeacherNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

// MARK NOTIFICATION AS READ
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to mark notification as read"
      );
    }
  }
);

const initialState = {
  notificationsList: [],
  selectedNotification: null,
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "userNotifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET STUDENT NOTIFICATIONS
      .addCase(fetchStudentNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentNotifications.fulfilled, (state, action) => {
        state.loading = false;
        let notificationsArray = [];

        // Handle grouped format (with today/earlier properties)
        if (action.payload.today || action.payload.earlier) {
          notificationsArray = [
            ...(action.payload.today || []),
            ...(action.payload.earlier || []),
          ];
        }
        // Handle flat array format
        else if (Array.isArray(action.payload)) {
          notificationsArray = action.payload;
        }
        // Handle paginated response
        else if (action.payload.content) {
          notificationsArray = action.payload.content;
        }

        state.notificationsList = notificationsArray;
        state.unreadCount = notificationsArray.filter(
          (n) => !n.isRead
        ).length;
      })
      .addCase(fetchStudentNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET TEACHER NOTIFICATIONS
      .addCase(fetchTeacherNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherNotifications.fulfilled, (state, action) => {
        state.loading = false;
        let notificationsArray = [];

        // Handle grouped format (with today/earlier properties)
        if (action.payload.today || action.payload.earlier) {
          notificationsArray = [
            ...(action.payload.today || []),
            ...(action.payload.earlier || []),
          ];
        }
        // Handle flat array format
        else if (Array.isArray(action.payload)) {
          notificationsArray = action.payload;
        }
        // Handle paginated response
        else if (action.payload.content) {
          notificationsArray = action.payload.content;
        }

        state.notificationsList = notificationsArray;
        state.unreadCount = notificationsArray.filter(
          (n) => !n.isRead
        ).length;
      })
      .addCase(fetchTeacherNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MARK AS READ
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notification = state.notificationsList.find(
          (n) => n.id === action.payload.id
        );
        if (notification) {
          notification.isRead = true;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedNotification, updateUnreadCount } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
