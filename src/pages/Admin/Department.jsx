import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartmentsAsync,
  createDepartmentAsync,
  updateDepartmentAsync,
  deleteDepartmentAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/Department/departmentSlice";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { toast } from "sonner";

const Department = () => {
  const dispatch = useDispatch();

  const { departments, loading, error, successMessage } = useSelector(
    (state) => state.department
  );

  const [editId, setEditId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    deptCode: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchDepartmentsAsync());
  }, [dispatch]);

  // SEARCH FILTER
  useEffect(() => {
    const params = {};
    if (filters.search) {
      params.search = filters.search;
    }
    dispatch(fetchDepartmentsAsync(params));
  }, [filters, dispatch]);

  // FORM CHANGE
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    if (!formData.name || !formData.deptCode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        deptCode: formData.deptCode,
        isActive: formData.isActive,
      };

      if (editId) {
        const response = await dispatch(
          updateDepartmentAsync({
            id: editId,
            data: payload,
          })
        );

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Department updated successfully! ✅");
        } else {
          toast.error(
            response?.payload?.message || "Failed to update department"
          );
        }
      } else {
        const response = await dispatch(createDepartmentAsync(payload));

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Department created successfully! ✅");
        } else {
          toast.error(
            response?.payload?.message || "Failed to create department"
          );
        }
      }

      dispatch(fetchDepartmentsAsync());
      setEditId(null);
      setFormData({
        name: "",
        deptCode: "",
        isActive: true,
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
      name: row.name || "",
      deptCode: row.deptCode || "",
      isActive: row.active || true,
    });
  };

  // DELETE
  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await dispatch(deleteDepartmentAsync(selectedDeleteId));

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Department deleted successfully! ✅");
      } else {
        toast.error(
          response?.payload?.message || "Failed to delete department"
        );
      }

      dispatch(fetchDepartmentsAsync());
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
        Department Management
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
          {editId ? "Edit Department" : "Add Department"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Department Code *
            </label>
            <input
              type="text"
              name="deptCode"
              value={formData.deptCode}
              onChange={handleFormChange}
              placeholder="Enter department code"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter department name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFormChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-700">Active</span>
            </label>
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
            placeholder="Search by department name..."
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
                  Department Code
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Department Name
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Staff Count
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Active Status
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : departments?.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{dept.deptCode}</td>
                    <td className="px-4 py-3 text-gray-800">{dept.name}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {dept.staffCount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${dept.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {dept.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">

                        <Edit
                          onClick={() => handleEdit(dept)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />

                        <Trash2
                          onClick={() => handleDeleteClick(dept.id)}
                          className="w-4 h-4 text-red-600 cursor-pointer"
                        />

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No departments found
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
        title="Delete Department"
        message="Are you sure you want to delete this department?"
      />
    </div>
  );
};

export default Department;
