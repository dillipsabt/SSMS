import API from "../../../services/api";

// =========================
// GET ALL TEACHERS
// =========================
export const fetchTeachersAPI = () => {
  return API.get("/teachers");
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
// GET HOMEWORK BY TEACHER ID
// =========================
export const fetchHomeworkAPI = (teacherId) => {
  return API.get(`/teacher/homework?teacherId=${teacherId}`);
};

// =========================
// CREATE HOMEWORK
// =========================
export const createHomeworkAPI = (formData) => {
  return API.post("/teacher/homework", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================
// ACCEPT HOMEWORK
// =========================
export const acceptHomeworkAPI = (submissionId) => {
  return API.patch(
    `/teacher/homework/accept?submissionId=${submissionId}`
  );
};

// =========================
// REJECT HOMEWORK
// =========================
// REJECT HOMEWORK
export const rejectHomeworkAPI = (data) => {
  return API.patch(
    `/teacher/homework/reject?submissionId=${data.submissionId}&comments=${encodeURIComponent(data.comments)}`
  );
};

// =========================
// GET HOMEWORK SUBMISSIONS
// =========================
export const fetchHomeworkSubmissionsAPI = (params) => {
  return API.get(
    `/teacher/homework/teacher/submissions?teacherId=${params.teacherId}&classId=${params.classId}`
  );
};