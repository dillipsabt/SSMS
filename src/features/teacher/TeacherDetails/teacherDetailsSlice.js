import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  fetchTeacherProfileAPI,
} from "./teacherDetailsAPI";

export const fetchTeacherProfileAsync = createAppAsyncThunk(
  "teacherDetails/fetchTeacherProfile",
  () => fetchTeacherProfileAPI()
);

const teacherDetailsSlice = createSlice({
  name: "teacherDetails",

  initialState: {
    teacher: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH TEACHER PROFILE
      // =========================
      .addCase(
        fetchTeacherProfileAsync.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchTeacherProfileAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.teacher = action.payload;
        }
      )

      .addCase(
        fetchTeacherProfileAsync.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default teacherDetailsSlice.reducer;
