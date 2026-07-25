import API from "../../../services/api";

// GET FEES DASHBOARD SUMMARY
export const getDashboardSummary = () => {
  return API.get("/fees/dashboard");
};

// GET FEES DASHBOARD TRENDS
export const getDashboardTrends = (academicYearId , billingType) => {
  return API.get("/fees/dashboard/trends", {
    params: {
      academicYearId,
      billingType,
    },
  });
};
