import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getSchoolInfo } from "./schoolBrandingAPI";

export const fetchSchoolInfo = createAppAsyncThunk(
  "schoolBranding/fetchSchoolInfo",
  async () => (await getSchoolInfo()).data,
);

const schoolBrandingSlice = createSlice({
  name: "schoolBranding",
  initialState: {
    schoolId: null,
    schoolName: "",
    logoUrl: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolId = action.payload?.schoolId ?? null;
        state.schoolName = action.payload?.schoolName || "";
        state.logoUrl = action.payload?.logoUrl || "";
      })
      .addCase(fetchSchoolInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default schoolBrandingSlice.reducer;
