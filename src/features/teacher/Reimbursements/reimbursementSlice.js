import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import { getReimbursements, addReimbursement } from "./reimbursementsAPI";
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

export const addReimbursementAsync = createAppAsyncThunk(
  "reimbursement/add",
  (payload) => addReimbursement(payload)
);

const reimbursementSlice = createSlice({
  name: "reimbursement",
  initialState: {
    list: [],
    ...commonState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ✅ GET
      .addCase(getReimbursementsAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(getReimbursementsAsync.fulfilled, (state, action) => {
        state.loading = false;

        const p = action.payload;

        if (Array.isArray(p)) {
          state.list = p;
        } else if (Array.isArray(p.data)) {
          state.list = p.data;
        } else {
          state.list = [];
        }
      })
      .addCase(getReimbursementsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ✅ ADD (optional immediate UI update)
      .addCase(addReimbursementAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(addReimbursementAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.list.unshift(action.payload);
      })
      .addCase(addReimbursementAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export default reimbursementSlice.reducer;
