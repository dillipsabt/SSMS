import API from "../../../services/api";

// CREATE
export const createTimetable = (payload) => {
  return API.post("/timetable/create", payload);
};

// GET 
export const getAdminTimetables = (
  teacherId,
  date,
  teacherName
) => {
  return API.get("/timetable/admin/timetables", {
    params: {
      teacherId,
      date,
      teacherName,
    },
  });
};

export const publishTimetableAPI = (
  timetableIds
) => {
  return API.patch(
    "/timetable/update/status",
    {
      timetableIds,
      status: "PUBLISHED",
    }
  );
};

// UPDATE
export const updateTimetable = (id, payload) => {
  return API.put(`/timetable/update/${id}`, payload);
};

// DELETE
export const deleteTimetable = (id) => {
  return API.delete(`/timetable/${id}`);
};

// GET ALL CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};

// GET TIME SLOTS
export const getTimeSlots = () => {
  return API.get("/admin/time-slots");
};

// ✅ GET SUBJECTS
export const getSubjectsAPI = () => {
  return API.get("/subjects");
};