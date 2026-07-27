import API from "../../services/api";

export const changePassword = (data) => API.put("/password/change", data);
