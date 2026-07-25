import API from "../../../services/api";

// GET ALL HOMEWORK
export const getAllHomework = () => {
  return API.get("/admin/homework/all").then((res) => res.data);
};

// GET ALL HOMEWORK SUBMISSIONS
export const getHomeworkSubmissions = () => {
  return API.get("/admin/homework/submissions").then((res) => res.data);
};
