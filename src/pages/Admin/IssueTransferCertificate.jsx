import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  getStudentDetailsByAdmissionNoAsync,
  createTransferCertificateAsync,
  updateTransferCertificateAsync,
  getTransferCertificateByIdAsync,
  resetCertificateDetails,
  resetStudentDetails,
  clearSuccess,
  clearError,
} from "../../features/Admin/TransferCertificate/transferCertificateSlice";

const Input = ({ label, required, name, onChange, value, type = "text", disabled = false }) => (
  <div>
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="form-input mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

const Select = ({ label, required, name, onChange, value, options = [] }) => (
  <div>
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="form-select mt-1"
    >
      <option value="">Select</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const IssueTransferCertificate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { studentDetails, certificateDetails, loading, success, error, successMessage } = useSelector(
    (state) => state.transferCertificate
  );

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    admissionNo: "",
    studentName: "",
    dateOfBirth: "",
    classSection: "",
    fatherName: "",
    dateOfLeaving: "",
    reasonForLeaving: "",
    otherReason: "",
    issueDate: "",
  });

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getTransferCertificateByIdAsync(id));
    }

    return () => {
      dispatch(resetStudentDetails());
      dispatch(resetCertificateDetails());
    };
  }, [isEditMode, id, dispatch]);

  useEffect(() => {
    if (certificateDetails && isEditMode) {
      setForm({
        admissionNo: certificateDetails.admissionNo || "",
        studentName: certificateDetails.studentName || "",
        dateOfBirth: certificateDetails.dateOfBirth || "",
        classSection: certificateDetails.classSection || "",
        fatherName: certificateDetails.fatherName || "",
        dateOfLeaving: certificateDetails.dateOfLeaving || "",
        reasonForLeaving: certificateDetails.reasonForLeaving || "",
        otherReason: "",
        issueDate: certificateDetails.issueDate || "",
      });
    }
  }, [certificateDetails, isEditMode]);

  useEffect(() => {
    if (studentDetails) {
      setForm((prev) => ({
        ...prev,
        studentName: studentDetails.studentName || prev.studentName,
        fatherName: studentDetails.fatherName || prev.fatherName,
        classSection: studentDetails.classSection || prev.classSection,
        dateOfBirth: studentDetails.dateOfBirth || prev.dateOfBirth,
      }));
    }
  }, [studentDetails]);

  useEffect(() => {
    if (success) {
      toast.success(
        isEditMode
          ? "Transfer certificate updated successfully! ✅"
          : "Transfer certificate created successfully! ✅"
      );
      dispatch(clearSuccess());
      setTimeout(() => {
        navigate("/transfer-certificate-list");
      }, 500);
    }
  }, [success, isEditMode, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === "string" ? error : error?.message || "An error occurred";
      toast.error(`Error: ${errorMessage} ❌`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "admissionNo" && value.trim()) {
      dispatch(getStudentDetailsByAdmissionNoAsync(value.trim()));
    } else if (name === "admissionNo") {
      dispatch(resetStudentDetails());
      setForm((prev) => ({
        ...prev,
        admissionNo: "",
        studentName: "",
        dateOfBirth: "",
        classSection: "",
        fatherName: "",
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "reasonForLeaving" && value !== "Other" ? { otherReason: "" } : {}),
    }));
  };

  const handleSaveAndPreview = () => {
    const reasonForLeaving = form.reasonForLeaving === "Other"
      ? form.otherReason.trim()
      : form.reasonForLeaving;

    if (!form.admissionNo || !form.studentName || !form.dateOfBirth || !form.classSection || !form.fatherName || !form.dateOfLeaving || !reasonForLeaving || !form.issueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      admissionNo: form.admissionNo,
      dateOfLeaving: form.dateOfLeaving,
      reasonForLeaving,
      issueDate: form.issueDate,
    };

    if (isEditMode && id) {
      dispatch(updateTransferCertificateAsync({ id, data: payload }));
    } else {
      dispatch(createTransferCertificateAsync(payload));
    }
  };

  const reasonOptions = [
    { label: "Course Completed", value: "Course Completed" },
    { label: "Course Discontinued", value: "Course Discontinued" },
    { label: "Transfer", value: "Transfer" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">Transfer Certificate</h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Transfer Certificate / Issue Transfer Certificate
      </p>

      <div className="card">
        <div className="card-section">Issue Transfer Certificate</div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Admission No."
              required
              name="admissionNo"
              value={form.admissionNo}
              onChange={handleInputChange}
            />

            <Input
              label="Student Name"
              required
              name="studentName"
              value={form.studentName}
              onChange={handleInputChange}
              disabled={true}
            />

            <Input
              label="Class / Section"
              required
              name="classSection"
              value={form.classSection}
              onChange={handleInputChange}
              disabled={true}
            />

            <Input
              label="Date of Birth"
              required
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleInputChange}
              type="date"
              disabled={true}
            />

            <Input
              label="Father / Guardian Name"
              required
              name="fatherName"
              value={form.fatherName}
              onChange={handleInputChange}
              disabled={true}
            />

            <Input
              label="Date Of Leaving"
              required
              name="dateOfLeaving"
              value={form.dateOfLeaving}
              onChange={handleInputChange}
              type="date"
            />

            <Select
              label="Reason for Leaving"
              required
              name="reasonForLeaving"
              value={form.reasonForLeaving}
              onChange={handleInputChange}
              options={reasonOptions}
            />

            {form.reasonForLeaving === "Other" && (
              <Input
                label="Enter Reason"
                required
                name="otherReason"
                value={form.otherReason}
                onChange={handleInputChange}
              />
            )}

            <Input
              label="Date Of Issue Transfer Certificate"
              required
              name="issueDate"
              value={form.issueDate}
              onChange={handleInputChange}
              type="date"
            />
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={() => navigate("/transfer-certificate-list")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndPreview}
              className="btn-primary"
            >
              Save & Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueTransferCertificate;
