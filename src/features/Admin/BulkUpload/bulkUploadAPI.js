import API from "../../../services/api";

export const uploadStudents = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("bulk/students/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadTeachers = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("bulk/teachers/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadStaff = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("bulk/staff/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
