import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranchesAsync,
  fetchBranchByIdAsync,
  createBranchAsync,
  updateBranchAsync,
  deleteBranchAsync,
} from "../../features/Admin/Branch/branchSlice";
import {
  fetchCountriesAsync,
  fetchStatesAsync,
  fetchCitiesAsync,
  clearStates,
  clearCities,
} from "../../features/Admin/Location/locationSlice";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { toast } from "sonner";

const Branches = () => {
  const dispatch = useDispatch();

  const { branches, selectedBranch, loading } = useSelector((state) => state.branch);
  const { countries, states, cities } = useSelector((state) => state.location);

  const [editId, setEditId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [formData, setFormData] = useState({
    branchName: "",
    branchCode: "",
    countryId: "",
    stateId: "",
    cityId: "",
    address: "",
    pincode: "",
    phone: "",
    email: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchBranchesAsync());
    dispatch(fetchCountriesAsync());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (filters.search) {
      params.search = filters.search;
    }
    dispatch(fetchBranchesAsync(params));
  }, [filters, dispatch]);


  useEffect(() => {
    if (selectedBranch && editId) {
      setFormData({
        branchName: selectedBranch.name || "",
        branchCode: selectedBranch.code || "",
        countryId: selectedBranch.countryId || "",
        stateId: selectedBranch.stateId || "",
        cityId: selectedBranch.cityId || "",
        address: selectedBranch.address || "",
        pincode: selectedBranch.pincode || "",
        phone: selectedBranch.phone || "",
        email: selectedBranch.email || "",
        isActive: selectedBranch.active || true,
      });

      if (selectedBranch.countryId) {
        dispatch(fetchStatesAsync(selectedBranch.countryId)).then(() => {
          if (selectedBranch.stateId) {
            dispatch(fetchCitiesAsync(selectedBranch.stateId));
          }
        });
      }
    }
  }, [selectedBranch, editId, dispatch]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "countryId") {
      dispatch(clearStates());
      dispatch(clearCities());
      setFormData((prev) => ({
        ...prev,
        stateId: "",
        cityId: "",
      }));
      if (newValue) {
        dispatch(fetchStatesAsync(newValue));
      }
    } else if (name === "stateId") {
      dispatch(clearCities());
      setFormData((prev) => ({
        ...prev,
        cityId: "",
      }));
      if (newValue) {
        dispatch(fetchCitiesAsync(newValue));
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.branchName || !formData.branchCode || !formData.countryId || !formData.stateId || !formData.cityId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: formData.branchName,
        code: formData.branchCode,
        countryId: parseInt(formData.countryId),
        stateId: parseInt(formData.stateId),
        cityId: parseInt(formData.cityId),
        address: formData.address,
        pincode: formData.pincode,
        phone: formData.phone,
        email: formData.email,
        active: formData.isActive,
      };

      if (editId) {
        const response = await dispatch(
          updateBranchAsync({
            id: editId,
            data: payload,
          })
        );

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Branch updated successfully! ✅");
        } else {
          toast.error(response?.payload?.message || "Failed to update branch");
        }
      } else {
        const response = await dispatch(createBranchAsync(payload));

        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Branch created successfully! ✅");
        } else {
          toast.error(response?.payload?.message || "Failed to create branch");
        }
      }

      dispatch(fetchBranchesAsync());
      setEditId(null);
      setFormData({
        branchName: "",
        branchCode: "",
        countryId: "",
        stateId: "",
        cityId: "",
        address: "",
        pincode: "",
        phone: "",
        email: "",
        isActive: true,
      });
      dispatch(clearStates());
      dispatch(clearCities());
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    dispatch(fetchBranchByIdAsync(row.id));
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await dispatch(deleteBranchAsync(selectedDeleteId));

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Branch deleted successfully! ✅");
      } else {
        toast.error(response?.payload?.message || "Failed to delete branch");
      }

      dispatch(fetchBranchesAsync());
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
        Branch Management
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
          {editId ? "Edit Branch" : "Add Branch"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Branch Code *
            </label>
            <input
              type="text"
              name="branchCode"
              value={formData.branchCode}
              onChange={handleFormChange}
              placeholder="Enter branch code"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Branch Name *
            </label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleFormChange}
              placeholder="Enter branch name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              name="stateId"
              value={formData.stateId}
              onChange={handleFormChange}
              disabled={!formData.countryId}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              City *
            </label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleFormChange}
              disabled={!formData.stateId}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Enter address"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleFormChange}
              placeholder="Enter pincode"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Enter phone"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Enter email"
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
            placeholder="Search by branch name..."
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
                  Branch Code
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Branch Name
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Country
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  State
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  City
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Phone
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Active
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : branches?.length > 0 ? (
                branches.map((branch) => (
                  <tr key={branch.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{branch.code}</td>
                    <td className="px-4 py-3 text-gray-800">{branch.name}</td>
                    <td className="px-4 py-3 text-gray-800">{branch.countryName}</td>
                    <td className="px-4 py-3 text-gray-800">{branch.stateName}</td>
                    <td className="px-4 py-3 text-gray-800">{branch.cityName}</td>
                    <td className="px-4 py-3 text-gray-800">{branch.phone}</td>
                    <td className="px-4 py-3 text-gray-800">{branch.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          branch.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {branch.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Edit
                          onClick={() => handleEdit(branch)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <Trash2
                          onClick={() => handleDeleteClick(branch.id)}
                          className="w-4 h-4 text-red-600 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No branches found
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
        title="Delete Branch"
        message="Are you sure you want to delete this branch?"
      />
    </div>
  );
};

export default Branches;
