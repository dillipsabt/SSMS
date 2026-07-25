import API from "../../../services/api";
const teacherId = localStorage.getItem("profileId") || null;

// =========================
// GET ALL TEACHERS
// =========================
export const fetchTeachersAPI = () => {
  return API.get("/teachers");
};

// =========================
// GET TEACHER TIMETABLE
// =========================
export const fetchTeacherTimetableAPI = (
  teacherId, date
) => {
  return API.get(
    `/timetable/teacher/${teacherId}/date/${date}`
  );
};

// =========================
// GET ALL CLASSES
// =========================
export const fetchClassesAPI = () => {
  return API.get("/classes/get-all");
};

// =========================
// GET ALL SUBJECTS
// =========================
export const fetchSubjectsAPI = () => {
  return API.get("/subjects");
};

// =========================
// GET TEACHER TIMETABLE REQUESTS
// =========================
export const fetchTeacherTimetableRequestsAPI = (
  teacherId
) => {
  return API.get(
    `/teacher/timetable/requests/${teacherId}`
  );
};

// =========================
// RAISE TIMETABLE REQUEST
// =========================
export const createTeacherTimetableRequestAPI = (
  data
) => {
  return API.post(
    "/teacher/timetable/request-change",
    data
  );
};

// =========================
// GET TIME SLOTS
// =========================
export const fetchTimeSlotsAPI = () => {
  return API.get("/admin/time-slots");
};
