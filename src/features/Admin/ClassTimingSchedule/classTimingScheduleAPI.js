import api from "../../../api/axios";

const CLASS_TIMING_SCHEDULE_ENDPOINT = "/class-timing-schedule";

export const getClassTimingSchedules = (params) =>
  api.get(CLASS_TIMING_SCHEDULE_ENDPOINT, { params });

export const createClassTimingSchedule = (data) =>
  api.post(CLASS_TIMING_SCHEDULE_ENDPOINT, data);

export const updateClassTimingSchedule = (id, data) =>
  api.put(`${CLASS_TIMING_SCHEDULE_ENDPOINT}/${id}`, data);

export const deleteClassTimingSchedule = (id) =>
  api.delete(`${CLASS_TIMING_SCHEDULE_ENDPOINT}/${id}`);
