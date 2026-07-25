import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import useToastMessage from "../../utils/useToastMessage";
import {
  getSchoolDetailsAsync,
  createSchoolDetailsAsync,
  updateSchoolDetailsAsync,
  deleteSchoolLogoAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/SchoolDetails/schoolDetailsSlice";

const SchoolDetailsView = () => {
  const dispatch = useDispatch();
  const { schoolDetails, loading, error, success, successMessage } = useSelector(
    (state) => state.schoolDetails
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolType: "",
    instituteId: "",
    foundingYear: "",
    phoneNo: "",
    websiteUrl: "",
    primaryEmail: "",
    address: "",
    principalName: "",
    principalEmail: "",
    principalPhoneNo: "",
    logo: null,
  });

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Fetch school details on component mount
  useEffect(() => {
    dispatch(getSchoolDetailsAsync());
  }, [dispatch]);

  // Populate form when school details are loaded
  useEffect(() => {
    if (schoolDetails) {
      setFormData({
        schoolName: schoolDetails.schoolName || "",
        schoolType: schoolDetails.schoolType || "",
        instituteId: schoolDetails.instituteId || "",
        foundingYear: schoolDetails.foundingYear || "",
        phoneNo: schoolDetails.phoneNo || "",
        websiteUrl: schoolDetails.websiteUrl || "",
        primaryEmail: schoolDetails.primaryEmail || "",
        address: schoolDetails.address || "",
        principalName: schoolDetails.principalName || "",
        principalEmail: schoolDetails.principalEmail || "",
        principalPhoneNo: schoolDetails.principalPhoneNo || "",
        logo: null,
      });
    }
  }, [schoolDetails]);

  // Handle success/error messages
  useToastMessage({
    success,
    error,
    successMessage: successMessage || "School details updated successfully",
    clearSuccess,
    clearError,
    onSuccess: () => {
      setIsEditMode(false);
      // Refresh school details
      dispatch(getSchoolDetailsAsync());
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSave = () => {
    if (!formData.schoolName || !formData.primaryEmail || !formData.phoneNo) {
      toast.error("Please fill in all required fields");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append(
      "request",
      JSON.stringify({
        schoolName: formData.schoolName,
        schoolType: formData.schoolType,
        instituteId: formData.instituteId,
        foundingYear: formData.foundingYear ? parseInt(formData.foundingYear) : null,
        phoneNo: formData.phoneNo,
        websiteUrl: formData.websiteUrl,
        primaryEmail: formData.primaryEmail,
        address: formData.address,
        principalName: formData.principalName,
        principalEmail: formData.principalEmail,
        principalPhoneNo: formData.principalPhoneNo,
      })
    );

    if (formData.logo) {
      uploadFormData.append("logo", formData.logo);
    }

    // If school details exist, update; otherwise create
    if (schoolDetails?.id) {
      dispatch(updateSchoolDetailsAsync(uploadFormData));
    } else {
      dispatch(createSchoolDetailsAsync(uploadFormData));
    }
  };

  const handleDeleteLogoClick = () => {
    setDeleteModal(true);
  };

  const confirmDeleteLogo = async () => {
    dispatch(deleteSchoolLogoAsync());
    setDeleteModal(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reload original data
    if (schoolDetails) {
      setFormData({
        schoolName: schoolDetails.schoolName || "",
        schoolType: schoolDetails.schoolType || "",
        instituteId: schoolDetails.instituteId || "",
        foundingYear: schoolDetails.foundingYear || "",
        phoneNo: schoolDetails.phoneNo || "",
        websiteUrl: schoolDetails.websiteUrl || "",
        primaryEmail: schoolDetails.primaryEmail || "",
        address: schoolDetails.address || "",
        principalName: schoolDetails.principalName || "",
        principalEmail: schoolDetails.principalEmail || "",
        principalPhoneNo: schoolDetails.principalPhoneNo || "",
        logo: null,
      });
    }
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        {isEditMode ? "Edit School Details" : "School Details"}
      </h2>
      <p className="text-[12px] text-gray-500 mb-6">
        Home / {isEditMode ? "Edit School Details" : "School Details"}
      </p>

      {isEditMode ? (
        <>
          {/* Edit Mode */}

          {/* General Information Section */}
          <div className="card mb-6">
            <h3 className="card-section">General Information</h3>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Institute ID</label>
                  <input
                    type="text"
                    name="instituteId"
                    value={formData.instituteId}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Founding Year</label>
                  <input
                    type="number"
                    name="foundingYear"
                    value={formData.foundingYear}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="form-label">School Type</label>
                  <input
                    type="text"
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Upload School Logo</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center px-3 py-2 rounded bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-200 text-xs font-medium">
                      Choose File
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.gif"
                      />
                    </label>
                    {schoolDetails?.schoolLogoFileName && !formData.logo && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                          {schoolDetails.schoolLogoFileName}
                        </span>
                        <button
                          onClick={handleDeleteLogoClick}
                          className="text-xs text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {formData.logo && (
                      <span className="ml-2 text-xs text-gray-600">{formData.logo.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Address Section */}
          <div className="card mb-6">
            <h3 className="card-section">Contact Address</h3>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Primary Email</label>
                  <input
                    type="email"
                    name="primaryEmail"
                    value={formData.primaryEmail}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Phone No.</label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Website URL</label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea mt-1"
                />
              </div>
            </div>
          </div>

          {/* Administrative Contacts Section */}
          <div className="card mb-6">
            <h3 className="card-section">Administrative Contacts</h3>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Principal/Director Name</label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Principal Email</label>
                  <input
                    type="email"
                    name="principalEmail"
                    value={formData.principalEmail}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                <div>
                  <label className="form-label">Principal Phone No.</label>
                  <input
                    type="text"
                    name="principalPhoneNo"
                    value={formData.principalPhoneNo}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mb-6">
            <button onClick={handleCancel} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary" disabled={loading}>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          {/* View Mode */}

          {/* General Information Section */}
          <div className="card mb-6">
            <h3 className="card-section">General Information</h3>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    School Name
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.schoolName || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Institute ID
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.instituteId || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Founding Year
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.foundingYear || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    School Type
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.schoolType || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Upload School Logo
                  </label>
                  {schoolDetails?.schoolLogoUrl ? (
                    <a
                      href={schoolDetails.schoolLogoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 cursor-pointer hover:underline"
                    >
                      {schoolDetails.schoolLogoFileName || "View Logo"}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600">No logo uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Address Section */}
          <div className="card mb-6">
            <h3 className="card-section">Contact Address</h3>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Primary Email
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.primaryEmail || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Phone No.
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.phoneNo || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Website URL
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.websiteUrl || "-"}</p>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Address
                </label>
                <p className="text-sm text-gray-600">{schoolDetails?.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Administrative Contacts Section */}
          <div className="card mb-6">
            <h3 className="card-section">Administrative Contacts</h3>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Principal/Director Name
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.principalName || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Principal Email
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.principalEmail || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Principal Phone No.
                  </label>
                  <p className="text-sm text-gray-600">{schoolDetails?.principalPhoneNo || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <button onClick={handleEdit} className="btn-primary" disabled={loading}>
              Edit
            </button>
          </div>
        </>
      )}

      {/* Delete Logo Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete School Logo"
        message="Are you sure you want to delete the school logo? This action cannot be undone."
        onClose={() => setDeleteModal(false)}
        onConfirm={confirmDeleteLogo}
      />
    </div>
  );
};

export default SchoolDetailsView;
