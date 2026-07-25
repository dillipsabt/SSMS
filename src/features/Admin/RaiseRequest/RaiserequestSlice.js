import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getTeacherRequests,
  approveTeacherRequest,
  rejectTeacherRequest,
} from "./Raiserequestapi";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchTeacherRequests = createAppAsyncThunk(
  "raiserequest/fetchTeacherRequests",
  (teacherId) => getTeacherRequests(teacherId)
);

export const approveTeacherRequestAsync = createAppAsyncThunk(
  "raiserequest/approveTeacherRequest",
  ({ id, payload }) => approveTeacherRequest(id, payload)
);

export const rejectTeacherRequestAsync = createAppAsyncThunk(
  "raiserequest/rejectTeacherRequest",
  ({ id, payload }) => rejectTeacherRequest(id, payload)
);

const RaiserequestSlice = createSlice({
  name: "raiserequest",

  initialState: {
    requests: [],
    ...commonState,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ✅ FETCH
      .addCase(
        fetchTeacherRequests.pending,
        (state) => {
          handlePending(state);
        }
      )

      .addCase(
        fetchTeacherRequests.fulfilled,
        (state, action) => {
          state.loading = false;

          state.requests =
            action.payload || [];
        }
      )

      .addCase(
        fetchTeacherRequests.rejected,
        (state, action) => {
          handleRejected(state, action);
        }
      )

      // ✅ APPROVE
      .addCase(
        approveTeacherRequestAsync.pending,
        (state) => {
          handlePending(state);
        }
      )

      .addCase(
        approveTeacherRequestAsync.fulfilled,
        (state, action) => {
          handleSuccess(state);

          const updated =
            action.payload?.data;

          if (!updated) return;

          const index =
            state.requests.findIndex(
              (r) =>
                r.id === updated.id
            );

          if (index !== -1) {
            state.requests[index] =
              updated;
          }
        }
      )

      .addCase(
        approveTeacherRequestAsync.rejected,
        (state, action) => {
          handleRejected(state, action);
        }
      )

      // ✅ REJECT
      .addCase(
        rejectTeacherRequestAsync.pending,
        (state) => {
          handlePending(state);
        }
      )

      .addCase(
        rejectTeacherRequestAsync.fulfilled,
        (state, action) => {
          handleSuccess(state);

          const updated =
            action.payload?.data;

          if (!updated) return;

          const index =
            state.requests.findIndex(
              (r) =>
                r.id === updated.id
            );

          if (index !== -1) {
            state.requests[index] =
              updated;
          }
        }
      )

      .addCase(
        rejectTeacherRequestAsync.rejected,
        (state, action) => {
          handleRejected(state, action);
        }
      );
  },
});

export default RaiserequestSlice.reducer;
