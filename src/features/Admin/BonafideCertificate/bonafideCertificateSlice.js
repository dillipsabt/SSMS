import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getBonafideCertificates,
  getBonafideCertificateById,
  createBonafideCertificate,
  updateBonafideCertificate,
  deleteBonafideCertificate,
  getStudentDetailsByAdmissionNo,
} from "./bonafideCertificateApi";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

// =====================================
// ASYNC THUNKS
// =====================================

// GET ALL BONAFIDE CERTIFICATES
export const getBonafideCertificatesAsync = createAppAsyncThunk(
  "bonafideCertificate/getBonafideCertificates",
  (params) => getBonafideCertificates(params)
);

// GET BONAFIDE CERTIFICATE BY ID
export const getBonafideCertificateByIdAsync = createAppAsyncThunk(
  "bonafideCertificate/getBonafideCertificateById",
  (certificateId) => getBonafideCertificateById(certificateId)
);

// CREATE BONAFIDE CERTIFICATE
export const createBonafideCertificateAsync = createAppAsyncThunk(
  "bonafideCertificate/createBonafideCertificate",
  (data) => createBonafideCertificate(data)
);

// UPDATE BONAFIDE CERTIFICATE
export const updateBonafideCertificateAsync = createAppAsyncThunk(
  "bonafideCertificate/updateBonafideCertificate",
  ({ id, data }) => updateBonafideCertificate(id, data)
);

// DELETE BONAFIDE CERTIFICATE
export const deleteBonafideCertificateAsync = createAppAsyncThunk(
  "bonafideCertificate/deleteBonafideCertificate",
  async (certificateId) => {
    await deleteBonafideCertificate(certificateId);
    return certificateId;
  }
);

// GET STUDENT DETAILS BY ADMISSION NO
export const getStudentDetailsByAdmissionNoAsync = createAppAsyncThunk(
  "bonafideCertificate/getStudentDetailsByAdmissionNo",
  (admissionNo) => getStudentDetailsByAdmissionNo(admissionNo)
);

// =====================================
// INITIAL STATE
// =====================================

const initialState = {
  certificateList: [],
  certificateDetails: null,
  studentDetails: null,
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

const bonafideCertificateSlice = createSlice({
  name: "bonafideCertificate",
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
  },

  extraReducers: (builder) => {
    builder

      // ====== GET ALL BONAFIDE CERTIFICATES ======
      .addCase(getBonafideCertificatesAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getBonafideCertificatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateList = action.payload.content || action.payload || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })

      .addCase(getBonafideCertificatesAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET BONAFIDE CERTIFICATE BY ID ======
      .addCase(getBonafideCertificateByIdAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getBonafideCertificateByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateDetails = action.payload;
      })

      .addCase(getBonafideCertificateByIdAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== CREATE BONAFIDE CERTIFICATE ======
      .addCase(createBonafideCertificateAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(createBonafideCertificateAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(createBonafideCertificateAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== UPDATE BONAFIDE CERTIFICATE ======
      .addCase(updateBonafideCertificateAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateBonafideCertificateAsync.fulfilled, (state) => {
        handleSuccess(state);
      })

      .addCase(updateBonafideCertificateAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== DELETE BONAFIDE CERTIFICATE ======
      .addCase(deleteBonafideCertificateAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteBonafideCertificateAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.certificateList = state.certificateList.filter(
          (cert) => cert.id !== action.payload
        );
      })

      .addCase(deleteBonafideCertificateAsync.rejected, (state, action) => {
        handleRejected(state, action);
      })

      // ====== GET STUDENT DETAILS BY ADMISSION NO ======
      .addCase(getStudentDetailsByAdmissionNoAsync.pending, (state) => {
        handlePending(state);
      })

      .addCase(getStudentDetailsByAdmissionNoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDetails = action.payload;
      })

      .addCase(getStudentDetailsByAdmissionNoAsync.rejected, (state, action) => {
        handleRejected(state, action);
      });
  },
});

export const { clearError, clearSuccess, resetCertificateDetails, resetStudentDetails } = bonafideCertificateSlice.actions;
export default bonafideCertificateSlice.reducer;
