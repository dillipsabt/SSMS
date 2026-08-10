import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, Link as LinkIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import {
  getExpensesAsync,
  getExpenseByIdAsync,
  createExpenseAsync,
  updateExpenseAsync,
  deleteExpenseAsync,
  clearSuccess,
  clearError,
  resetExpenseDetails,
} from "../../features/Admin/Expenses/expensesSlice";

const EXPENSE_CATEGORIES = [
  "TEACHER_SALARY",
  "STAFF_SALARY",
  "MAINTENANCE",
  "UTILITIES",
  "MARKETING",
  "OTHER",
];

const NewExpenses = () => {
  const dispatch = useDispatch();
  const { expenseList, expenseDetails, pagination, loading, error, success, successMessage } = useSelector(
    (state) => state.expenses
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    expenseName: "",
    expenseDate: "",
    totalAmount: "",
    expenseCategory: "",
    description: "",
    uploadBill: null,
  });

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Fetch expenses on component mount and when filters/pagination change
  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
      ...(searchTerm && { search: searchTerm }),
      ...(dateFilter && { fromDate: dateFilter }),
    };
    dispatch(getExpensesAsync(params));
  }, [dispatch, currentPage, rowsPerPage, searchTerm, dateFilter]);

  // Populate form when editing
  useEffect(() => {
    if (expenseDetails && isEditMode) {
      setFormData({
        expenseName: expenseDetails.expenseName || "",
        expenseDate: expenseDetails.expenseDate ? expenseDetails.expenseDate.split("T")[0] : "",
        totalAmount: expenseDetails.totalAmount || "",
        expenseCategory: expenseDetails.expenseCategory || "",
        description: expenseDetails.description || "",
        uploadBill: null,
      });
    }
  }, [expenseDetails, isEditMode]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(
        isEditMode
          ? "Expense updated successfully! ✅"
          : "Expense created successfully! ✅"
      );
      dispatch(clearSuccess());

      // Refresh expenses list after save/delete
      const params = {
        page: isEditMode ? currentPage - 1 : 0,
        size: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(dateFilter && { fromDate: dateFilter }),
      };
      dispatch(getExpensesAsync(params));

      if (!isEditMode) {
        setCurrentPage(1);
      }

      // Reset form
      setFormData({
        expenseName: "",
        expenseDate: "",
        totalAmount: "",
        expenseCategory: "",
        description: "",
        uploadBill: null,
      });
      setIsEditMode(false);
      setEditingId(null);
    }
  }, [success, isEditMode, currentPage, rowsPerPage, searchTerm, dateFilter, dispatch]);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === "string" ? error : error?.message || "An error occurred";
      toast.error(`Error: ${errorMessage} ❌`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, uploadBill: e.target.files[0] });
  };

  const handleSave = async () => {
    if (!formData.expenseName || !formData.expenseDate || !formData.totalAmount || !formData.expenseCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append(
      "dto",
      JSON.stringify({
        expenseName: formData.expenseName,
        expenseDate: formData.expenseDate,
        totalAmount: parseFloat(formData.totalAmount),
        description: formData.description,
        expenseCategory: formData.expenseCategory,
      })
    );

    if (formData.uploadBill) {
      uploadFormData.append("billFile", formData.uploadBill);
    }

    if (isEditMode && editingId) {
      dispatch(updateExpenseAsync({ id: editingId, formData: uploadFormData }));
    } else {
      dispatch(createExpenseAsync(uploadFormData));
    }
  };

  const handleEditClick = (expenseId) => {
    setEditingId(expenseId);
    setIsEditMode(true);
    dispatch(getExpenseByIdAsync(expenseId));
  };

  const handleDeleteClick = (expenseId) => {
    setSelectedId(expenseId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await dispatch(deleteExpenseAsync(selectedId));
      if (res?.meta?.requestStatus === "fulfilled") {
        toast.success("Expense deleted successfully! ✅");
      } else {
        toast.error(res?.payload?.message || "Failed to delete expense");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setDeleteModal(false);
      setSelectedId(null);
    }
  };

  const handleAttachmentClick = (billUrl) => {
    if (billUrl) {
      window.open(billUrl, "_blank");
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      expenseName: "",
      expenseDate: "",
      totalAmount: "",
      expenseCategory: "",
      description: "",
      uploadBill: null,
    });
    dispatch(resetExpenseDetails());
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <h2 className="text-[18px] font-semibold text-[#333333]">New Expenses</h2>
      <p className="text-[12px] text-gray-500 mb-6">Home / New Expenses</p>

      {/* Add/Edit Expenses Form */}
      <div className="card mb-6">
        <h3 className="card-section">{isEditMode ? "Edit Expense" : "Add New Expenses"}</h3>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div>
              <label className="form-label">Expense Name</label>
              <input
                type="text"
                name="expenseName"
                value={formData.expenseName}
                onChange={handleInputChange}
                placeholder="Expense Name"
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">Expense Date</label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                placeholder="Total Amount"
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">Expense Category</label>
              <select
                name="expenseCategory"
                value={formData.expenseCategory}
                onChange={handleInputChange}
                className="form-select mt-1"
              >
                <option value="">Select Category</option>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Upload Bill</label>
              <div className="mt-1">
                <label className="inline-flex items-center px-3 py-2 rounded bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-200 text-xs font-medium">
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </label>
                <span className="ml-2 text-xs text-gray-600">
                  {formData.uploadBill ? formData.uploadBill.name : "No choose file"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="form-textarea mt-1"
            />
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          {isEditMode && (
            <button onClick={handleCancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
          <button onClick={handleSave} className="btn-primary" disabled={loading}>
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Expenses Lists */}
      <div className="card">
        <h3 className="card-section">Expenses Lists</h3>

        {/* Filter Row */}
        <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search Expense Name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
          />
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] sm:text-[13px]">
            <thead className="thead-row">
              <tr>
                <th className="px-4 py-3 text-left min-w-[50px]">S.No.</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Created Date</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Expense Name</th>
                <th className="px-4 py-3 text-left min-w-[140px]">Category</th>
                <th className="px-4 py-3 text-left min-w-[110px]">Expense Date</th>
                <th className="px-4 py-3 text-left min-w-[80px]">Attachment</th>
                <th className="px-4 py-3 text-left min-w-[200px]">Description</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Total Amount</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenseList && expenseList.length > 0 ? (
                expenseList.map((item, index) => (
                  <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-3">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">{item.expenseName}</td>
                    <td className="px-4 py-3">{item.expenseCategory || "-"}</td>
                    <td className="px-4 py-3">
                      {item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleAttachmentClick(item.billUrl)}
                        disabled={!item.billUrl}
                        className={`${
                          item.billUrl ? "text-blue-600 hover:text-blue-800" : "text-gray-400"
                        }`}
                      >
                        <LinkIcon size={18} />
                      </button>
                    </td>
                    <td className="px-4 py-3">{item.description || "-"}</td>
                    <td className="px-4 py-3">{item.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleEditClick(item.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                    {loading ? "Loading expenses..." : "No expenses found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages || 1}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={(newSize) => {
              setRowsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default NewExpenses;
