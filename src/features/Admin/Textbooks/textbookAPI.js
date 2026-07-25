import API from "../../../services/api";

const TEXTBOOKS_ENDPOINT = "/lms/textbooks";

export const getTextbooks = (params) => API.get(TEXTBOOKS_ENDPOINT, { params });

export const getTextbookById = (id) => API.get(`${TEXTBOOKS_ENDPOINT}/${id}`);

export const createTextbook = (data) => API.post(TEXTBOOKS_ENDPOINT, data);

export const updateTextbook = (id, data) => API.put(`${TEXTBOOKS_ENDPOINT}/${id}`, data);

export const deleteTextbook = (id) => API.delete(`${TEXTBOOKS_ENDPOINT}/${id}`);
