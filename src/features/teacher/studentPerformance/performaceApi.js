import API from "../../../services/api";

// ============================
// DAILY STUDENT PERFORMANCE
// ============================

export const createPerformance = async (data) => {
  try {
    const response = await API.post(
      "/teacher/student-performance",
      data
    );
    return response.data || { success: true };
  } catch (error) {
    console.error("createPerformance error:", error);
    throw error;
  }
};

export const updatePerformance = async ({ id, data }) => {
  const response = await API.put(
    `/teacher/student-performance/${id}`,
    data
  );
  return response.data;
};

export const getPerformanceById = async (id) => {
  const response = await API.get(
    `/teacher/student-performance/${id}`
  );
  return response.data;
};

export const getStudentByRollNumber = async (rollNo) => {
  const response = await API.get(
    `/teacher/student-performance/student/${encodeURIComponent(rollNo)}`
  );
  return response.data;
};

// ============================
// STUDENT PERFORMANCE LIST
// ============================

export const getPerformanceList = async (params) => {
  const response = await API.get(
    "/teacher/student-performance/list",
    { params }
  );
  return response.data;
};

export const getAvailableDates = async (startDate, endDate) => {
  const response = await API.get(
    "/teacher/student-performance/dates",
    { params: { startDate, endDate } }
  );
  return response.data;
};

export const getClassesForForm = async () => {
  const response = await API.get("/classes/get-all");
  return response.data;
};

export const getClassesByDate = async (startDate, endDate) => {
  const response = await API.get(
    "/teacher/student-performance/classes",
    { params: { date: startDate } }
  );
  return response.data;
};

export const getSubjects = async () => {
  const response = await API.get("/subjects");
  return response.data;
};
