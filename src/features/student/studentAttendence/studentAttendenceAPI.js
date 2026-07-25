import API from "../../../services/api";

// Get student attendance details
export const fetchStudentAttendenceAPI = async (params) => {
  const response = await API.get("/attendance/teacher-view", {
    params,
  });

  return response.data;
};
//Get Subjects
export const fetchSubjectsAPI = () => {
  return API.get(`/subjects`);
};
// Get Classes
export const fetchClassesAPI = () => {
  return API.get(`/classes/get-all`);
};
