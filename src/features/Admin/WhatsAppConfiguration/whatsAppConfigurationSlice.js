import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { commonState } from "../../../utils/commonState";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { saveWhatsAppConfiguration } from "./whatsAppConfigurationApi";

export const saveWhatsAppConfigurationAsync = createAppAsyncThunk(
  "whatsAppConfiguration/save",
  (data) => saveWhatsAppConfiguration(data),
);

const whatsAppConfigurationSlice = createSlice({
  name: "whatsAppConfiguration",
  initialState: {
    configuration: null,
    ...commonState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveWhatsAppConfigurationAsync.pending, handlePending)
      .addCase(saveWhatsAppConfigurationAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.configuration = action.payload;
      })
      .addCase(saveWhatsAppConfigurationAsync.rejected, handleRejected);
  },
});

export default whatsAppConfigurationSlice.reducer;
