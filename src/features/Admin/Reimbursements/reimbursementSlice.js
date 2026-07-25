import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getReimbursements,
  updateReimbursementStatus,
} from "../Reimbursements/reimbursementsAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const getReimbursementsAsync = createAppAsyncThunk(
  "reimbursement/getAll",
  () => getReimbursements()
);

export const updateReimbursementStatusAsync = createAppAsyncThunk(
  "reimbursement/updateStatus",
  ({ id, payload }) => updateReimbursementStatus(id, payload)
);

const reimbursementSlice = createSlice({
  name: "reimbursement",
  initialState: {
    data: [],
    ...commonState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getReimbursementsAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(getReimbursementsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReimbursementsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // UPDATE
      .addCase(updateReimbursementStatusAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(updateReimbursementStatusAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.data = state.data.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                status: action.payload.status,
                comment: action.payload.comment,
              }
            : item
        );
      })
      .addCase(updateReimbursementStatusAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export default reimbursementSlice.reducer;
