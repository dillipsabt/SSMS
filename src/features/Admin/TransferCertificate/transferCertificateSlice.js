import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getTransferCertificates,
  getTransferCertificateById,
  createTransferCertificate,
  updateTransferCertificate,
  deleteTransferCertificate,
  getStudentDetailsByAdmissionNo,
  getSchoolDetails,
} from "./transferCertificateApi";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// =====================================
// ASYNC THUNKS
// =====================================

// GET SCHOOL DETAILS
export const getSchoolDetailsAsync = createAppAsyncThunk(
  "transferCertificate/getSchoolDetails",
  () => getSchoolDetails(),
);

// GET ALL TRANSFER CERTIFICATES
export const getTransferCertificatesAsync = createAppAsyncThunk(
  "transferCertificate/getTransferCertificates",
  (params) => getTransferCertificates(params),
);

// GET TRANSFER CERTIFICATE BY ID
export const getTransferCertificateByIdAsync = createAppAsyncThunk(
  "transferCertificate/getTransferCertificateById",
  (certificateId) => getTransferCertificateById(certificateId),
);

// CREATE TRANSFER CERTIFICATE
export const createTransferCertificateAsync = createAppAsyncThunk(
  "transferCertificate/createTransferCertificate",
  (data) => createTransferCertificate(data),
);

// UPDATE TRANSFER CERTIFICATE
export const updateTransferCertificateAsync = createAppAsyncThunk(
  "transferCertificate/updateTransferCertificate",
  ({ id, data }) => updateTransferCertificate(id, data),
);

// DELETE TRANSFER CERTIFICATE
export const deleteTransferCertificateAsync = createAppAsyncThunk(
  "transferCertificate/deleteTransferCertificate",
  async (certificateId) => {
    await deleteTransferCertificate(certificateId);
    return certificateId;
  },
);

// GET STUDENT DETAILS BY ADMISSION NO
export const getStudentDetailsByAdmissionNoAsync = createAppAsyncThunk(
  "transferCertificate/getStudentDetailsByAdmissionNo",
  (admissionNo) => getStudentDetailsByAdmissionNo(admissionNo),
);

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  certificateList: [],
  certificateDetails: null,
  studentDetails: null,
  schoolDetails: null,

  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  ...commonState,
  successMessage: null,
};

// =====================================
// SLICE
// =====================================

const transferCertificateSlice = createSlice({
  name: "transferCertificate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    resetCertificateDetails: (state) => {
      state.certificateDetails = null;
    },
    resetStudentDetails: (state) => {
      state.studentDetails = null;
    },
    // FIXED: Added missing reducer logic to support the exported action
    resetSchoolDetails: (state) => {
      state.schoolDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ====== GET ALL TRANSFER CERTIFICATES ======
      .addCase(getTransferCertificatesAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(getTransferCertificatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateList = action.payload?.content || action.payload || [];
        state.pagination = {
          page: action.payload?.page || 0,
          size: action.payload?.size || 10,
          totalElements: action.payload?.totalElements || 0,
          totalPages: action.payload?.totalPages || 0,
        };
      })
      .addCase(getTransferCertificatesAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET TRANSFER CERTIFICATE BY ID ======
      .addCase(getTransferCertificateByIdAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(getTransferCertificateByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateDetails = action.payload;
      })
      .addCase(getTransferCertificateByIdAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== CREATE TRANSFER CERTIFICATE ======
      .addCase(createTransferCertificateAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(createTransferCertificateAsync.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(createTransferCertificateAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== UPDATE TRANSFER CERTIFICATE ======
      .addCase(updateTransferCertificateAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(updateTransferCertificateAsync.fulfilled, (state) => {
        handleSuccess(state);
      })
      .addCase(updateTransferCertificateAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== DELETE TRANSFER CERTIFICATE ======
      .addCase(deleteTransferCertificateAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(deleteTransferCertificateAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.certificateList = state.certificateList.filter(
          (cert) => cert.id !== action.payload,
        );
      })
      .addCase(deleteTransferCertificateAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET STUDENT DETAILS BY ADMISSION NO ======
      .addCase(getStudentDetailsByAdmissionNoAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(
        getStudentDetailsByAdmissionNoAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.studentDetails = action.payload;
        },
      )
      .addCase(
        getStudentDetailsByAdmissionNoAsync.rejected,
        (state, action) => {
          handleRejected(state, action);
        },
      )

      // ====== GET SCHOOL DETAILS ======
      .addCase(getSchoolDetailsAsync.pending, (state) => {
        handlePending(state);
      })
      .addCase(getSchoolDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Extract action.payload.data if it exists, otherwise fall back to action.payload
        state.schoolDetails = action.payload?.data || action.payload;
      })
      .addCase(getSchoolDetailsAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetCertificateDetails,
  resetStudentDetails,
  resetSchoolDetails,
} = transferCertificateSlice.actions;

export default transferCertificateSlice.reducer;
