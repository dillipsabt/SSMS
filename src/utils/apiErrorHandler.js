export const getErrorMessage = (error) => {
  if (!error.response) {
    return "Network Error. Please check your internet connection.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
};