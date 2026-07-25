import API from "../../../services/api";

// GET ALL NOTICES
export const getAllNotices = (params) => {
  return API.get("/notice-board", { params });
};

// GET NOTICE BY ID
export const getNoticeById = (noticeId) => {
  return API.get(`/notice-board/${noticeId}`);
};

// CREATE NOTICE
export const createNotice = (data) => {
  return API.post("/notice-board", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// UPDATE NOTICE
export const updateNotice = (noticeId, data) => {
  return API.put(`/notice-board/${noticeId}`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// DELETE NOTICE
export const deleteNotice = (noticeId) => {
  return API.delete(`/notice-board/${noticeId}`);
};

// PUBLISH NOTICE
export const publishNotice = (data) => {
  return API.post("/notice-board/publish", data);
};
