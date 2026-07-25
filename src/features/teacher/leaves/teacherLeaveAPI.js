// import API from "../../../../services/api";
import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

//Get leaves by Teacher ID
export const fetchLeavesByTeacherIdAPI = (userId) => {
  return API.get(`/leaves/user/${userId}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
};
// Apply for leave
export const applyLeaveAPI = (leaveData) => {
  return API.post("/leaves/apply", leaveData, {
    headers: {
      ...getAuthHeader(),
    },
  });
};
