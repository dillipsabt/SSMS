import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  deleteHallTicket,
  downloadHallTicket,
  generateHallTickets,
  getHallTicketExams,
  getAdminHallTicketDetails,
  getStudentWiseHallTickets,
  publishHallTickets,
} from "./hallTicketAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchHallTicketExaminationTypes = createAppAsyncThunk(
  "hallTicket/fetchExaminationTypes",
  ({ academicYearId, classId }) => getHallTicketExams({ academicYearId, classId }),
);

export const fetchAdminHallTicketDetails = createAppAsyncThunk(
  "hallTicket/fetchAdminDetails",
  (hallTicketNo) => getAdminHallTicketDetails(hallTicketNo),
);

export const fetchStudentWiseHallTickets = createAppAsyncThunk(
  "hallTicket/fetchStudentWise",
  (params) => getStudentWiseHallTickets(params),
);

export const generateHallTicketsAsync = createAppAsyncThunk(
  "hallTicket/generate",
  (data) => generateHallTickets(data),
);

export const publishHallTicketsAsync = createAppAsyncThunk(
  "hallTicket/publish",
  (data) => publishHallTickets(data),
);

export const deleteHallTicketAsync = createAppAsyncThunk(
  "hallTicket/delete",
  async (hallTicketId) => {
    await deleteHallTicket(hallTicketId);
    return hallTicketId;
  },
);

export const downloadHallTicketAsync = createAppAsyncThunk(
  "hallTicket/download",
  (hallTicketNo) => downloadHallTicket(hallTicketNo),
);

const initialState = {
  examinationTypes: [],
  students: [],
  generatedDate: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  successMessage: null,
  ...commonState,
};

const hallTicketSlice = createSlice({
  name: "hallTicket",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHallTicketExaminationTypes.pending, handlePending)
      .addCase(fetchHallTicketExaminationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || action.payload?.data || [];
      })
      .addCase(fetchHallTicketExaminationTypes.rejected, handleRejected)
      .addCase(fetchAdminHallTicketDetails.pending, handlePending)
      .addCase(fetchAdminHallTicketDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAdminHallTicketDetails.rejected, handleRejected)
      .addCase(fetchStudentWiseHallTickets.pending, handlePending)
      .addCase(fetchStudentWiseHallTickets.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const studentPage = payload.students || payload;
        state.loading = false;
        state.generatedDate = payload.generatedDate || null;
        state.students = studentPage.content || [];
        state.pagination = {
          page: studentPage.number || 0,
          size: studentPage.size || 10,
          totalElements: studentPage.totalElements || 0,
          totalPages: studentPage.totalPages || 0,
        };
      })
      .addCase(fetchStudentWiseHallTickets.rejected, handleRejected)
      .addCase(generateHallTicketsAsync.pending, handlePending)
      .addCase(generateHallTicketsAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.successMessage =
          action.payload?.message || "Hall tickets generated successfully";
      })
      .addCase(generateHallTicketsAsync.rejected, handleRejected)
      .addCase(publishHallTicketsAsync.pending, handlePending)
      .addCase(publishHallTicketsAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.successMessage =
          action.payload?.message || "Hall tickets published successfully";
      })
      .addCase(publishHallTicketsAsync.rejected, handleRejected)
      .addCase(deleteHallTicketAsync.pending, handlePending)
      .addCase(deleteHallTicketAsync.fulfilled, (state, action) => {
        handleSuccess(state);
        state.successMessage = "Hall ticket deleted successfully";
        state.students = state.students.filter((student) => {
          const id = student.hallTicketId || student.id;
          return id !== action.payload;
        });
      })
      .addCase(deleteHallTicketAsync.rejected, handleRejected)
      .addCase(downloadHallTicketAsync.rejected, handleRejected);
  },
});

export const { clearError, clearSuccess } = hallTicketSlice.actions;
export default hallTicketSlice.reducer;
