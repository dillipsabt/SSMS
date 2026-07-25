import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = (
  typePrefix,
  asyncFunction
) => {
  return createAsyncThunk(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        const response = await asyncFunction(arg);

        // Handle both cases:
        // 1. API function returns axios response (response.data contains actual data)
        // 2. API function returns response.data directly (already extracted)
        if (response && typeof response === 'object') {
          // If it has a 'data' property (axios response), extract it
          if ('data' in response && !('content' in response)) {
            return response.data;
          }
          // Otherwise it's already the data payload, return as is
          return response;
        }

        return response;
      } catch (error) {
        const errorData = error.response?.data || {};
        return rejectWithValue({
          status: error.response?.status,
          message:
            errorData.message ||
            errorData.error ||
            error.message ||
            "Something went wrong",
          errors: errorData.errors || null,
          totalRecords: errorData.totalRecords,
          successCount: errorData.successCount,
          errorCount: errorData.errorCount,
        });
      }
    }
  );
};
