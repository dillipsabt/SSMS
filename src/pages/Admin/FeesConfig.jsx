import React, { useEffect, useState } from "react";
import { Edit, Trash2, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchFeesConfigsAsync,
  createFeesConfigAsync,
  updateFeesConfigAsync,
  deleteFeesConfigAsync,
  fetchClassesAsync,
} from "../../features/Admin/FeesConfig/feesConfigSlice";
import { fetchAcademicYears } from "../../features/Admin/AcademicYear/academicYearSlice";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { toast } from "sonner";

const FeesConfig = () => {
  const dispatch = useDispatch();

  const { feesConfigs, classes } = useSelector(
    (state) => state.feesConfig
  );
  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  const [editId, setEditId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
  });

  const [formData, setFormData] = useState({
    academicYearId: "",
    classId: "",
    admissionFees: "",
    schoolFees: "",
    busFees: "",
    booksFees: "",
    labFees: "",
    specialFees: "",
    registrationFees: "",
    sa1Fee: "",
    sa2Fee: "",
    sa3Fee: "",
    sa4Fee: "",
  });

  useEffect(() => {
    dispatch(fetchFeesConfigsAsync());
    dispatch(fetchClassesAsync());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  // ==========================================
  // SEARCH + FILTER API
  // ==========================================

  useEffect(() => {
    const params = {};

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    dispatch(fetchFeesConfigsAsync(params));
  }, [filters, dispatch]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async () => {
    if (!formData.academicYearId) {
      toast.error("Please select an academic year");
      return;
    }

    const payload = {
      academicYearId: Number(formData.academicYearId),
      classId: Number(formData.classId),
      admissionFees: Number(formData.admissionFees),
      schoolFees: Number(formData.schoolFees),
      busFees: Number(formData.busFees),
      booksFees: Number(formData.booksFees),
      labFees: Number(formData.labFees),
      specialFees: Number(formData.specialFees),
      registrationFees: Number(formData.registrationFees),
      sa1Fee: Number(formData.sa1Fee),
      sa2Fee: Number(formData.sa2Fee),
      sa3Fee: Number(formData.sa3Fee),
      sa4Fee: Number(formData.sa4Fee),
    };

    try {

      if (editId) {

        const response = await dispatch(
          updateFeesConfigAsync({
            id: editId,
            data: payload,
          })
        );

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Fees configuration updated successfully! ✅");
        } else {
          toast.error(response?.payload?.message || "Failed to update fees configuration");
        }

      } else {

        const response = await dispatch(
          createFeesConfigAsync(payload)
        );

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Fees configuration created successfully! ✅");
        } else {
          toast.error(response?.payload?.message || "Failed to create fees configuration");
        }
      }

      dispatch(fetchFeesConfigsAsync());

      setEditId(null);

      setFormData({
        academicYearId: "",
        classId: "",
        admissionFees: "",
        schoolFees: "",
        busFees: "",
        booksFees: "",
        labFees: "",
        specialFees: "",
        registrationFees: "",
        sa1Fee: "",
        sa2Fee: "",
        sa3Fee: "",
        sa4Fee: "",
      });

    } catch (error) {

      const errorMessage = typeof error === "string" ? error : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (row) => {
    setEditId(row.id);

    setFormData({
      academicYearId: row.academicYearId || row.academicYear?.id || "",
      classId: row.classId || "",
      admissionFees: row.admissionFees || "",
      schoolFees: row.schoolFees || "",
      busFees: row.busFees || "",
      booksFees: row.booksFees || "",
      labFees: row.labFees || "",
      specialFees: row.specialFees || "",
      registrationFees: row.registrationFees || "",
      sa1Fee: row.sa1Fee || "",
      sa2Fee: row.sa2Fee || "",
      sa3Fee: row.sa3Fee || "",
      sa4Fee: row.sa4Fee || "",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {

    try {

      const response = await dispatch(
        deleteFeesConfigAsync(selectedDeleteId)
      );

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Fees configuration deleted successfully! ✅");
      } else {
        toast.error(response?.payload?.message || "Failed to delete fees configuration");
      }

      dispatch(fetchFeesConfigsAsync());

      setDeleteModalOpen(false);
      setSelectedDeleteId(null);

    } catch (error) {

      const errorMessage = typeof error === "string" ? error : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen fees-theme-scope">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
        Fees Configure
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
          Add Fees Configure
        </h3>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>

            <select
              name="classId"
              value={formData.classId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select</option>

              {classes?.map((cls) => (
                <option
                  key={cls.id}
                  value={cls.id}
                >
                  {cls.classCode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              name="academicYearId"
              value={formData.academicYearId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((academicYear) => (
                <option key={academicYear.id} value={academicYear.id}>
                  {academicYear.year || academicYear.academicYear || academicYear.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Admission Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="admissionFees"
              value={formData.admissionFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              School Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="schoolFees"
              value={formData.schoolFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bus Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="busFees"
              value={formData.busFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Books Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="booksFees"
              value={formData.booksFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Lab Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="labFees"
              value={formData.labFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Special Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="specialFees"
              value={formData.specialFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Registration Fees <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="registrationFees"
              value={formData.registrationFees}
              onChange={handleFormChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Exam Fees */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Exam Fees <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div>
              <label className="block text-xs text-black mb-1">
                SA1
              </label>
              <input
                type="text"
                name="sa1Fee"
                value={formData.sa1Fee}
                onChange={handleFormChange}
                placeholder="Enter Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">
                SA2
              </label>
              <input
                type="text"
                name="sa2Fee"
                value={formData.sa2Fee}
                onChange={handleFormChange}
                placeholder="Enter Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">
                SA3
              </label>
              <input
                type="text"
                name="sa3Fee"
                value={formData.sa3Fee}
                onChange={handleFormChange}
                placeholder="Enter Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">
                SA4
              </label>
              <input
                type="text"
                name="sa4Fee"
                value={formData.sa4Fee}
                onChange={handleFormChange}
                placeholder="Enter Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
          >
            📋 {editId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-end items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-1"
            />

            <span>-</span>

            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search"
            className="px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-full">

            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  S.No.
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Admin Name
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Created Date
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Class
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Admission Fees
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  School Fees
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Bus Fees
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Books Fees
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Lab Fees
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {feesConfigs?.map((row, idx) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 py-2 text-gray-800">
                    {idx + 1}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.adminName}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.createdDate}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.className}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.admissionFees}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.schoolFees}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.busFees}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.booksFees}
                  </td>

                  <td className="px-3 py-2 text-gray-800">
                    {row.labFees}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex gap-2">

                      <Edit
                        onClick={() => handleEdit(row)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />

                      <Trash2
                        onClick={() => handleDeleteClick(row.id)}
                        className="w-4 h-4 text-red-600 cursor-pointer"
                      />

                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Fees Configuration"
        message="Are you sure you want to delete this fees configuration?"
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FeesConfig;
