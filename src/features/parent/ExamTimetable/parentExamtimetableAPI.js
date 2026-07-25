import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// GET EXAMINATION TIMETABLE FOR A STUDENT
export const getExaminationTimeAPI = async (studentId) => {
  return await API.get(`/parent/exam-timetable/student/${studentId}`, {
    headers: getAuthHeader(),
  });
};

// GET ACADEMIC YEARS
export const getAcademicYearsAPI = async () => {
  return await API.get("/academic-years", {
    headers: getAuthHeader(),
  });
};

// GET EXAMINATION TYPES
export const getExaminationTypesAPI = async () => {
  return await API.get("/examination-types", {
    headers: getAuthHeader(),
  });
};
