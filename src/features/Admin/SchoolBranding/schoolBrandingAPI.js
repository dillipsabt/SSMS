import API from "../../../api/axios";

export const getSchoolInfo = () =>
  API.get("/public/school-info", { skipErrorToast: true });
