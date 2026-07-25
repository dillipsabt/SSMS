import API from "../../../services/api";

// ============================
// NEW ADMIN STUDENT PERFORMANCE APIs
// ============================

// Get available dates for filtering
export const getAvailableDates = () => {
  return API.get("/admin/student-performance/dates");
};

// Get teachers for a selected date
export const getTeachersByDate = (date) => {
  return API.get("/admin/student-performance/teachers", {
    params: { date },
  });
};

// Get classes for selected date and teacher
export const getClassesByDateAndTeacher = (date, teacherId) => {
  return API.get("/admin/student-performance/classes", {
    params: { date, teacherId },
  });
};

// Get student performance list
export const getStudentPerformanceList = (params) => {
  return API.get("/admin/student-performance/students", {
    params,
  });
};

// Get student performance details
export const getStudentPerformanceDetails = (performanceId) => {
  return API.get(`/admin/student-performance/${performanceId}`);
};
