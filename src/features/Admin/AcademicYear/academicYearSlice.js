import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "./academicYearAPI";

export const fetchAcademicYears = createAppAsyncThunk(
  "academicYear/fetchAll",
  async () => (await getAcademicYears()).data,
);
export const createAcademicYearAsync = createAppAsyncThunk(
  "academicYear/create",
  async (year) => (await createAcademicYear(year)).data,
);
export const updateAcademicYearAsync = createAppAsyncThunk(
  "academicYear/update",
  async ({ id, year }) => (await updateAcademicYear(id, year)).data,
);
export const deleteAcademicYearAsync = createAppAsyncThunk(
  "academicYear/delete",
  async (id) => {
    await deleteAcademicYear(id);
    return id;
  },
);

const academicYearSlice = createSlice({
  name: "academicYear",
  initialState: { academicYears: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = action.payload;
      })
      .addCase(createAcademicYearAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears.push(action.payload);
      })
      .addCase(updateAcademicYearAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.academicYears.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.academicYears[index] = action.payload;
      })
      .addCase(deleteAcademicYearAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = state.academicYears.filter((item) => item.id !== action.payload);
      })
      .addMatcher((action) => action.type.startsWith("academicYear/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("academicYear/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default academicYearSlice.reducer;
