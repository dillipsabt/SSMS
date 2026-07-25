// ==============================================
// src/features/Admin/FeesConfig/feesConfigAPI.js
// ==============================================

import API from "../../../services/api";

// ==============================================
// FEES CONFIG APIs
// ==============================================

// GET ALL FEES CONFIG
export const getFeesConfigs = (params) => {
  return API.get("/fees-config", {
    params,
  });
};

// GET FEES CONFIG BY ID
export const getFeesConfigById = (id) => {
  return API.get(`/fees-config/${id}`);
};

// CREATE FEES CONFIG
export const createFeesConfig = (data) => {
  return API.post("/fees-config", data);
};

// UPDATE FEES CONFIG
export const updateFeesConfig = (id, data) => {
  return API.put(`/fees-config/${id}`, data);
};

// DELETE FEES CONFIG
export const deleteFeesConfig = (id) => {
  return API.delete(`/fees-config/${id}`);
};

// ==============================================
// CLASSES
// ==============================================

export const getClasses = () => {
  return API.get("/classes/get-all");
};