import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

//Get Student Details API
export const fetchStudentDetailsAPI = (id) => {
  return API.get(`/students/${id}`, {});
};
//Get Student Details By Profile API - accepts studentId parameter
export const fetchStudentDetailsByProfileAPI = (studentId) => {
  return API.get(`/students/${studentId}`, {
    headers: getAuthHeader(),
  });
};
