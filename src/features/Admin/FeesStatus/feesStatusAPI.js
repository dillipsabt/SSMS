import API from "../../../services/api";

// GET FEES STATUS LIST
export const getFeesStatus = (params) => {
  return API.get("/fees/status", {
    params,
  });
};
//GET CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};
