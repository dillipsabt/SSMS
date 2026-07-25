import API from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const loginUser = async (data) => {
  const response = await API.post(API_ENDPOINTS.auth.login, data, {
    skipErrorToast: true,
  });

  return response.data;
};
