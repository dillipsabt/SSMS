import API from "../../../services/api";

export const fetchStudentViewAttendenceReportAPI = ({ studentCode, year }) => {
  return API.get(`/attendance/view-report/${studentCode}/${year}`);
};
