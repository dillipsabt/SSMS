const AUTH_KEYS = [
  "token",
  "role",
  "user",
  "userId",
  "profileId",
  "schoolLogourl",
  "isLoggedIn",
];

export const clearAuthStorage = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getAuthToken = () => localStorage.getItem("token");
