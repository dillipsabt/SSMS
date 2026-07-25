import { useEffect } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

const useToastMessage = ({
  success,
  error,
  successMessage,
  clearSuccess,
  clearError,
  onSuccess,
  onError,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      toast.success(successMessage || "Operation completed successfully", {
        duration: 5000,
        position: "top-right",
      });

      if (onSuccess) {
        onSuccess();
      }

      dispatch(clearSuccess());
    }
  }, [
    success,
    successMessage,
    dispatch,
    clearSuccess,
    onSuccess,
  ]);

  useEffect(() => {
    if (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong";

      toast.error(msg, {
        duration: 5000,
        position: "top-right",
      });

      if (onError) {
        onError(msg);
      }

      dispatch(clearError());
    }
  }, [error, dispatch, clearError, onError]);
};

export default useToastMessage;
