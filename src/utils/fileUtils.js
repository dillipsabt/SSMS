import { isJwtExpired } from "./jwt";
import { clearAuthStorage, getAuthToken } from "./storage";

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const checkTokenExpiry = () => {
  const token = getAuthToken();

  if (token && isJwtExpired(token)) {
    clearAuthStorage();
    window.location.assign("/");
  }
};
