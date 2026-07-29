import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  approveTeacherRequest,
  getTeacherRequests,
  rejectTeacherRequest,
} from "./Raiserequestapi";

const getPayload = (payload) => payload?.data ?? payload;
const getRequests = (payload) => {
  const data = getPayload(payload);
  return data?.content ?? data?.items ?? (Array.isArray(data) ? data : []);
};

export const fetchTeacherRequests = createAppAsyncThunk(
  "raiserequest/fetchTeacherRequests",
  (params = {}) => getTeacherRequests(params),
);

export const approveTeacherRequestAsync = createAppAsyncThunk(
  "raiserequest/approveTeacherRequest",
  ({ id, payload }) => approveTeacherRequest(id, payload),
);

export const rejectTeacherRequestAsync = createAppAsyncThunk(
  "raiserequest/rejectTeacherRequest",
  ({ id, payload }) => rejectTeacherRequest(id, payload),
);

const requestSlice = createSlice({
  name: "raiserequest",
  initialState: { requests: [], loading: false, error: null, pagination: { totalPages: 1 } },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherRequests.fulfilled, (state, action) => {
        const data = getPayload(action.payload);
        state.loading = false;
        state.requests = getRequests(action.payload);
        state.pagination = {
          totalPages: data?.totalPages ?? 1,
          totalElements: data?.totalElements ?? data?.totalRecords ?? state.requests.length,
        };
      })
      .addCase(fetchTeacherRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unable to load requests";
      })
      .addCase(approveTeacherRequestAsync.fulfilled, (state, action) => {
        const updated = getPayload(action.payload);
        const index = state.requests.findIndex((request) => request.id === updated?.id);
        if (index !== -1) state.requests[index] = updated;
      })
      .addCase(rejectTeacherRequestAsync.fulfilled, (state, action) => {
        const updated = getPayload(action.payload);
        const index = state.requests.findIndex((request) => request.id === updated?.id);
        if (index !== -1) state.requests[index] = updated;
      });
  },
});

export default requestSlice.reducer;
