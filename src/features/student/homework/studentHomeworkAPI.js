import API from "../../../services/api";

// GET - Fetch all homework for a student
export const getStudentHomework = async (studentId) => {
  const response = await API.get(
    `/parent-student/homework?studentId=${studentId}`,
  );
  return response.data;
};

// POST - Submit homework with file (pdf, image, doc, etc.)
export const submitStudentHomework = async ({ studentId, dto, files }) => {
  const formData = new FormData();

  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], {
      type: "application/json",
    }),
  );

  // backend expects "file"
  files.forEach((file) => {
    formData.append("file", file);
  });

  const response = await API.post(
    `/parent-student/homework/submit?studentId=${studentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
