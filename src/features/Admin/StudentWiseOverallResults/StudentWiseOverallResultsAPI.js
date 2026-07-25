import API from "../../../services/api";

export const getStudentPerformanceList = (params) => {
  return API.get("/performance/admin/admin-performance-list", {
    params,
  });
};

export const getStudentPerformance = (params) => {
  return API.get("/performance/student-performance", { params });
};

export const getAcademicYears = () => {
  return API.get("/academic-years");
};

export const getStudents = () => {
  return API.get("/students");
};

export const getClasses = () => {
  return API.get("/classes/get-all");
};

export const getExaminationTypes = () => {
  return API.get("/examination-types");
};