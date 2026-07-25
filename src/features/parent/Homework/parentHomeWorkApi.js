import API from "../../../services/api";

// GET - Fetch homework by studentId
export const getParentStudentHomework = async (studentId) => {
    const response = await API.get(
        `/parent-student/homework?studentId=${studentId}`
    );
    return response.data;
};

// POST - Submit homework with file
export const submitParentStudentHomework = async ({
    dto,
    files,
}) => {
    const formData = new FormData();

    formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], {
            type: "application/json",
        })
    );

    // backend expects "file"
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append("file", file);
        });
    }

    const response = await API.post(
        "/parent-student/homework/submit",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};