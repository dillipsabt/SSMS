import axios from "axios";
import { toast } from "sonner";
import { getTenantId } from "./tenant";
import { getApiBaseUrl, getApiTimeout } from "../utils/env";
import { getAuthToken } from "../utils/storage";

const getErrorMessage = (error) => {
  const message = error.response?.data?.message || error.response?.data?.error;
  return typeof message === "string" && message.trim()
    ? message.trim().slice(0, 300)
    : "Unable to complete the request. Please try again.";
};

const api = axios.create({
  timeout: getApiTimeout(),
});

api.interceptors.request.use((config) => {
  const tenantId = getTenantId();
  const token = getAuthToken();

  config.baseURL = getApiBaseUrl();

  if (tenantId) {
    config.headers["X-Tenant-ID"] = tenantId;
  } else if (import.meta.env.DEV) {
    console.warn("Missing VITE_TENANT_ID for localhost requests.");
  }

  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status && !error.config?.skipErrorToast) {
      toast.error(getErrorMessage(error));
    }

    if (import.meta.env.DEV) {
      console.error("[API] Request failed", {
        status,
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
