import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassesAsync,
  createClassAsync,
  updateClassAsync,
  deleteClassAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/Class/classSlice";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { toast } from "sonner";
import { BOARD_OPTIONS } from "../../features/Admin/academicOptions";

const Class = () => {
  const dispatch = useDispatch();

  const { classes, loading, error, successMessage } = useSelector(
    (state) => state.class
  );

  const [editId, setEditId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [formData, setFormData] = useState({
    className: "",
    section: "",
    board: "",
  });

  useEffect(() => {
    dispatch(fetchClassesAsync());
  }, [dispatch]);

  // SEARCH FILTER
  useEffect(() => {
    const params = {};
    if (filters.search) {
      params.search = filters.search;
    }
    dispatch(fetchClassesAsync(params));
  }, [filters, dispatch]);

  // FORM CHANGE
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FILTER CHANGE
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SAVE
  const handleSubmit = async () => {
    if (!formData.className || !formData.section || !formData.board) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        className: formData.className,
        section: formData.section,
        board: formData.board,
      };

      if (editId) {
        const response = await dispatch(
          updateClassAsync({
            id: editId,
            data: payload,
          })
        );

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Class updated successfully! ✅");
        } else {
          toast.error(response?.payload?.message || "Failed to update class");
        }
      } else {
        const response = await dispatch(createClassAsync(payload));

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Class created successfully! ✅");
        } else {
          toast.error(response?.payload?.message || "Failed to create class");
        }
      }

      dispatch(fetchClassesAsync());
      setEditId(null);
      setFormData({
        className: "",
        section: "",
        board: "",
      });
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  // EDIT
  const handleEdit = (row) => {
    setEditId(row.id);
    setFormData({
      className: row.className || "",
      section: row.section || "",
      board: row.board || "",
    });
  };

  // DELETE
  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await dispatch(deleteClassAsync(selectedDeleteId));

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Class deleted successfully! ✅");
      } else {
        toast.error(response?.payload?.message || "Failed to delete class");
      }

      dispatch(fetchClassesAsync());
      setDeleteModalOpen(false);
      setSelectedDeleteId(null);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
        Class Management
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
          {editId ? "Edit Class" : "Add Class"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleFormChange}
              placeholder="Enter class name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Section *
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleFormChange}
              placeholder="Enter section"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Board *
            </label>
            <select
              name="board"
              value={formData.board}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select board</option>
              {BOARD_OPTIONS.map((board) => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            📋 {editId ? "Update" : "Save"}
          </button>
        </div>

      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <input
            type="text"
            name="search"
            placeholder="Search by class name..."
            value={filters.search}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 text-xs w-full sm:w-64"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Class Code
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Class Name
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Section
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : classes?.length > 0 ? (
                classes.map((classItem) => (
                  <tr key={classItem.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">
                      {classItem.classCode}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {classItem.className}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {classItem.section}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">

                        <Edit
                          onClick={() => handleEdit(classItem)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />

                        <Trash2
                          onClick={() => handleDeleteClick(classItem.id)}
                          className="w-4 h-4 text-red-600 cursor-pointer"
                        />

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Class"
        message="Are you sure you want to delete this class?"
      />
    </div>
  );
};

export default Class;
