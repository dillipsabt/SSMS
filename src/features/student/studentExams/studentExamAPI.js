import API from "../../../services/api";
import { getAuthHeader } from "../../../utils/fileUtils";

// ==========================
// GET STUDENT EXAMS
// ==========================
export const studentExamAPI = () => {
  return API.get("/exams/student", {
    headers: getAuthHeader(),
  });
};

// ==========================
// GET STUDENT EXAM RESULTS
// ==========================
export const studentExamResultsAPI = (
  studentId,
  academicYearId,
  examinationTypeId,
) => {
  return API.get(
    `/exam-results/student/${studentId}?academicYearId=${academicYearId}&examinationTypeId=${examinationTypeId}`,
    {
      headers: getAuthHeader(),
    },
  );
};

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
