import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// ==========================
// GET ACADEMIC YEARS
// ==========================
export const getAcademicYearsAPI = () => {
  return API.get("/academic-years", {
    headers: getAuthHeader(),
  });
};

// ==========================
// GET EXAMINATION TYPES
// ==========================
export const getExaminationTypesAPI = () => {
  return API.get("/examination-types", {
    headers: getAuthHeader(),
  });
};
// ==========================
// GET STUDENTS BY PARENT ID
// ==========================
export const getStudentsByParentIdAPI = async (parentId) => {
  const response = await API.get(
    `/students/get-by-parentId?parentId=${parentId}`,
    getAuthHeader()
  );

  return response.data;
};

// ==========================
// GET STUDENT EXAM RESULTS
// ==========================
export const parentExamResultsAPI = (
  studentId,
  academicYearId,
  examinationTypeId,
) => {
  return API.get(
    `/parent/exam-results/student/${studentId}?academicYearId=${academicYearId}&examinationTypeId=${examinationTypeId}`,
    {
      headers: getAuthHeader(),
    },
  );
};
