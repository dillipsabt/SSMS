import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getExaminationTypes,
  createExaminationType,
  updateExaminationType,
  deleteExaminationType,
} from "./examinationTypeAPI";

export const fetchExaminationTypes = createAppAsyncThunk(
  "examinationType/fetchAll",
  async () => (await getExaminationTypes()).data,
);
export const createExaminationTypeAsync = createAppAsyncThunk(
  "examinationType/create",
  async (examType) => (await createExaminationType(examType)).data,
);
export const updateExaminationTypeAsync = createAppAsyncThunk(
  "examinationType/update",
  async ({ id, examType }) => (await updateExaminationType(id, examType)).data,
);
export const deleteExaminationTypeAsync = createAppAsyncThunk(
  "examinationType/delete",
  async (id) => {
    await deleteExaminationType(id);
    return id;
  },
);

const examinationTypeSlice = createSlice({
  name: "examinationType",
  initialState: { examinationTypes: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = action.payload;
      })
      .addCase(createExaminationTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes.push(action.payload);
      })
      .addCase(updateExaminationTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.examinationTypes.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.examinationTypes[index] = action.payload;
      })
      .addCase(deleteExaminationTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = state.examinationTypes.filter((item) => item.id !== action.payload);
      })
      .addMatcher((action) => action.type.startsWith("examinationType/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("examinationType/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default examinationTypeSlice.reducer;
