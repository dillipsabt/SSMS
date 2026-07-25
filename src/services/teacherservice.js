// ✅ GET SINGLE TEACHER BY ID
export const getTeacherById = (id) => {
  return API.get(`/teachers/${id}`);
};