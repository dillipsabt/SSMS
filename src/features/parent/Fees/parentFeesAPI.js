import API from "../../../services/api";

// GET PARENT FEES LEDGER
export const getParentFeesLedger = () => {
  return API.get("/fees/parent/fees/ledger");
};
