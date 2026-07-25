import API from "../../../services/api";

// ✅ GET REQUESTS BY TEACHER ID
export const getTeacherRequests = (teacherId) => {
  return API.get(
    `/teacher/timetable/requests/${teacherId}`
  );
};

// ✅ APPROVE REQUEST
export const approveTeacherRequest = (
  id,
  payload
) => {
  return API.put(
    `/admin/timetable/requests/${id}/approve`,
    null,
    {
      params: {
        reason: payload.reason,
      },
    }
  );
};

// ✅ REJECT REQUEST
export const rejectTeacherRequest = (
  id,
  payload
) => {
  return API.put(
    `/admin/timetable/requests/${id}/reject`,
    null,
    {
      params: {
        reason: payload.reason,
      },
    }
  );
};