import superAdminApi from "../../../SuperAdmin/api/axios";

export const loginSuperAdmin = (credentials) =>
  superAdminApi.post("/master/auth/login", credentials, {
    skipAuth: true,
    skipErrorToast: true,
  });
