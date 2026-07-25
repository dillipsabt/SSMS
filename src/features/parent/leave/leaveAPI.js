import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

export const getStudentsByParentId = async (parentId) => {
  const response = await API.get(
    `/students/get-by-parentId?parentId=${parentId}`,
    getAuthHeader()
  );

  return response.data;
};

export const getStudentLeaves = async (studentId) => {
  const response = await API.get(
    `/student-leaves/student/${studentId}`,
    getAuthHeader()
  );

  return response.data;
};

export const applyLeave = async (payload) => {
  const response = await API.post(
    "/student-leaves/apply",
    payload,
    getAuthHeader()
  );

  return response.data;
};