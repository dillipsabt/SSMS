import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// GET PARENT'S STUDENTS
export const getParentStudentsAPI = () => {
  const parentId = localStorage.getItem("profileId");
  return API.get(`/students/get-by-parentId?parentId=${parentId}`, {
    headers: getAuthHeader(),
  });
};

// GET PARENT DASHBOARD DATA
export const fetchParentDashboardAPI = (params) => {
  return API.get("/parent/dashboard", { params });
};

// GET ACADEMIC YEARS
export const getAcademicYearsAPI = () => {
  return API.get("/academic-years", {
    headers: getAuthHeader(),
  });
};

// GET EXAMINATION TYPES
export const getExaminationTypesAPI = () => {
  return API.get("/examination-types", {
    headers: getAuthHeader(),
  });
};
