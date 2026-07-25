import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getFeesStatus, getClasses } from "./feesStatusAPI";

const initialState = {
  feesStatusList: [],
  classes: [],
  loading: false,
  error: null,
};

// Fees Status
export const getFeesStatusAsync = createAppAsyncThunk(
  "feesStatus/getFeesStatus",
  async (params) => {
    const response = await getFeesStatus(params);
    return response.data;
  },
);

// Classes
export const getClassesAsync = createAppAsyncThunk(
  "feesStatus/getClasses",
  async () => {
    const response = await getClasses();
    return response.data;
  },
);

const feesStatusSlice = createSlice({
  name: "feesStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeesStatusAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeesStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.feesStatusList = action.payload;
      })
      .addCase(getFeesStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      .addCase(getClassesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getClassesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default feesStatusSlice.reducer;
