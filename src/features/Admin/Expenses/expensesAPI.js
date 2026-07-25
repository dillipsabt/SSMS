import API from "../../../services/api";

// =====================================
// EXPENSES ENDPOINTS
// =====================================

// GET ALL EXPENSES
export const getAllExpenses = (params) => {
  return API.get("/expenses", { params });
};

// GET EXPENSE BY ID
export const getExpenseById = (expenseId) => {
  return API.get(`/expenses/${expenseId}`);
};

// CREATE EXPENSE
export const createExpense = (formData) => {
  return API.post("/expenses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UPDATE EXPENSE
export const updateExpense = (expenseId, formData) => {
  return API.put(`/expenses/${expenseId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE EXPENSE
export const deleteExpense = (expenseId) => {
  return API.delete(`/expenses/${expenseId}`);
};
