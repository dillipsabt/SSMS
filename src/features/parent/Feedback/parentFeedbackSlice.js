import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getParentFeedbackAPI, submitFeedbackAPI } from "./parentfeedbackAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const getParentFeedback = createAppAsyncThunk(
    "parentFeedback/getParentFeedback",
    (params) => getParentFeedbackAPI(params)
);

export const submitFeedback = createAppAsyncThunk(
    "parentFeedback/submitFeedback",
    (data) => submitFeedbackAPI(data)
);

const parentFeedbackSlice = createSlice({
    name: "parentFeedback",
    initialState: {
        feedbackList: [],
        ...commonState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getParentFeedback.pending, (state) => {
                handlePending(state);
            })
            .addCase(getParentFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbackList = action.payload;
            })
            .addCase(getParentFeedback.rejected, (state, action) => {
                handleRejected(state, action);
            })
            .addCase(submitFeedback.pending, (state) => {
                handlePending(state);
            })
            .addCase(submitFeedback.fulfilled, (state) => {
                handleSuccess(state);
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                handleRejected(state, action);
            });
    },
});
export default parentFeedbackSlice.reducer;
