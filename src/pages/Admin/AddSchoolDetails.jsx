import React, { useState } from "react";
import { toast } from "sonner";

const AddSchoolDetails = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolType: "",
    instituteId: "",
    foundingYear: "",
    uploadSchoolLogo: null,
    phoneNo: "",
    websiteUrl: "",
    primaryEmail: "",
    address: "",
    principalName: "",
    principalEmail: "",
    principalPhoneNo: "",
  });

  const [fileName, setFileName] = useState("No file chosen");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "No file chosen");
    setFormData({ ...formData, uploadSchoolLogo: file });
  };

  const handleSave = () => {
    // Validate required fields
    if (
      !formData.schoolName ||
      !formData.schoolType ||
      !formData.instituteId ||
      !formData.foundingYear ||
      !formData.phoneNo ||
      !formData.primaryEmail ||
      !formData.address ||
      !formData.principalName ||
      !formData.principalEmail ||
      !formData.principalPhoneNo
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("School details saved successfully");
    // API call would go here
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <h2 className="text-[18px] font-semibold text-[#333333]">Add School Details</h2>
      <p className="text-[12px] text-gray-500 mb-6">Home / Add School Details</p>

      {/* General Information Section */}
      <div className="card mb-6">
        <h3 className="card-section">General Informatin</h3>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">
                Institute ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="instituteId"
                value={formData.instituteId}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">
                Founding Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="foundingYear"
                value={formData.foundingYear}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">
                School Type <span className="text-red-500">*</span>
              </label>
              <select
                name="schoolType"
                value={formData.schoolType}
                onChange={handleInputChange}
                className="form-select mt-1"
              >
                <option value="">Select</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Higher Education">Higher Education</option>
              </select>
            </div>
            <div>
              <label className="form-label">
                Upload School Logo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md mt-1 h-9 overflow-hidden bg-white">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logoInput"
                />
                <label
                  htmlFor="logoInput"
                  className="bg-brand-100 text-brand-600 px-3 text-[12px] h-full flex items-center cursor-pointer shrink-0 hover:bg-brand-50 transition-colors"
                >
                  Choose File
                </label>
                <span className="text-gray-400 text-[12px] px-2 truncate">
                  {fileName}
                </span>
              </div>
            </div>
            <div>
              <label className="form-label">
                Phone No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              className="form-input mt-1"
            />
          </div>
        </div>
      </div>

      {/* Contact Address Section */}
      <div className="card mb-6">
        <h3 className="card-section">Contact Address</h3>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">
                Primary Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">
                Phone No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">
                Website URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input mt-1 resize-none h-24"
            />
          </div>
        </div>
      </div>

      {/* Administrative Contacts Section */}
      <div className="card mb-6">
        <h3 className="card-section">Administrative Contacts</h3>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">
                Principal/Director Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">
                Principal Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="principalEmail"
                value={formData.principalEmail}
                onChange={handleInputChange}
                className="form-input mt-1"
              />
            </div>
            <div>
              <label className="form-label">
                Principal Phone No. <span className="text-red-500">*</span>
              </label>
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

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSchoolDetails;
