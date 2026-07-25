import API from "../../../services/api";

export const getFinancialDashboard = () =>
  API.get("/financial-dashboard/financial-dashboard");

export const getRevenueBreakdown = (params) =>
  API.get("/financial-dashboard/revenue-breakdown", { params });

export const getExpenseBreakdown = (params) =>
  API.get("/financial-dashboard/expense-breakdown", { params });

export const getFinancialTrend = (params) =>
  API.get("/financial-dashboard/trend", { params });
