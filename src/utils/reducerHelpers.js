export const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

export const handleRejected = (state, action) => {
  state.loading = false;

  state.error =
    action.payload?.message ||
    action.payload ||
    action.error?.message ||
    "Something went wrong";

  state.success = false;
};

export const handleSuccess = (state, message = "Success") => {
  state.loading = false;
  state.error = null;
  state.success = true;
  state.successMessage = message;
};
