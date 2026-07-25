import API from "../../../services/api";

// GET ALL CLASSES
export const getClasses = async () => {
  const response = await API.get("/classes/get-all");

  return response.data;
};

// GET ALL SUBJECTS
export const getSubjects = async () => {
  const response = await API.get("/subjects");

  return response.data;
};

// VIEW ATTENDANCE REPORT
export const getAttendanceReport = async (studentId, year) => {
  const response = await API.get(
    `/attendance/view-report/${studentId}/${year}`,
  );

  return response.data;
};

// TAKE ATTENDANCE
export const takeAttendance = async (data) => {
  const response = await API.post("/attendance/save-attendance", data);

  return response.data;
};
