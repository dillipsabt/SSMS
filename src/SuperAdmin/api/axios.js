import axios from "axios";
import { toast } from "sonner";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Unable to complete the request. Please try again.";

const superAdminApi = axios.create({
  baseURL: import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL?.trim() || undefined,
  timeout: Number(import.meta.env.VITE_SUPER_ADMIN_API_TIMEOUT_MS) || 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

superAdminApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("superAdminToken");
  const isLoginRequest = config.url === "/master/auth/login";

  if (token && !isLoginRequest && !config.skipAuth) {
    config.headers = config.headers || {};
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers = config.headers || {};
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Content-Type");
    } else {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }

  return config;
});

superAdminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status && !error.config?.skipErrorToast) {
      toast.error(getErrorMessage(error));
    }

    if (status === 401 || status === 403) {
      [
        "superAdminAuthenticated",
        "superAdminToken",
        "superAdminUserId",
        "superAdminUsername",
        "superAdminRole",
        "superAdminName",
      ].forEach((key) => sessionStorage.removeItem(key));

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default superAdminApi;
