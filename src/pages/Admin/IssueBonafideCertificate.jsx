import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  getStudentDetailsByAdmissionNoAsync,
  getBonafideCertificateByIdAsync,
  createBonafideCertificateAsync,
  updateBonafideCertificateAsync,
  clearSuccess,
  clearError,
  resetStudentDetails,
  resetCertificateDetails,
} from "../../features/Admin/BonafideCertificate/bonafideCertificateSlice";

const Input = ({ label, required, name, onChange, value, type = "text" }) => (
  <div>
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input mt-1"
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

const IssueBonafideCertificate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { studentDetails, certificateDetails, loading, error, success, successMessage } = useSelector(
    (state) => state.bonafideCertificate
  );

  const isEditMode = !!id;

  const [form, setForm] = useState({
    admissionNo: "",
    studentName: "",
    fatherGuardianName: "",
    class: "",
    academicYear: "",
    schoolName: "",
    dateOfIssueBonafideCertificate: "",
  });

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Load certificate data if editing
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getBonafideCertificateByIdAsync(id));
    }
  }, [isEditMode, id, dispatch]);

  // Populate form from certificate details
  useEffect(() => {
    if (certificateDetails && isEditMode) {
      setForm({
        admissionNo: certificateDetails.admissionNo || "",
        studentName: certificateDetails.studentName || "",
        fatherGuardianName: certificateDetails.fatherName || "",
        class: certificateDetails.classSection || "",
        academicYear: certificateDetails.academicYear || "",
        schoolName: certificateDetails.schoolName || "",
        dateOfIssueBonafideCertificate: certificateDetails.issueDate ? certificateDetails.issueDate.split("T")[0] : "",
      });
    }
  }, [certificateDetails, isEditMode]);

  // Populate student details when fetched
  useEffect(() => {
    if (studentDetails) {
      setForm((prev) => ({
        ...prev,
        studentName: studentDetails.studentName || prev.studentName,
        fatherGuardianName: studentDetails.fatherName || prev.fatherGuardianName,
        class: studentDetails.classSection || prev.class,
        academicYear: studentDetails.academicYear || prev.academicYear,
        schoolName: studentDetails.schoolName || prev.schoolName,
      }));
    }
  }, [studentDetails]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(
        isEditMode
          ? "Bonafide certificate updated successfully! ✅"
          : "Bonafide certificate created successfully! ✅"
      );
      dispatch(clearSuccess());
      setTimeout(() => {
        navigate("/bonafide-certificate-list");
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
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-fetch student details when admission number changes
    if (name === "admissionNo" && value.trim()) {
      dispatch(getStudentDetailsByAdmissionNoAsync(value));
    }
  };

  const handleSaveAndPreview = () => {
    if (!form.admissionNo || !form.dateOfIssueBonafideCertificate) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      admissionNo: form.admissionNo,
      issueDate: form.dateOfIssueBonafideCertificate,
    };

    if (isEditMode && id) {
      dispatch(updateBonafideCertificateAsync({ id, data: payload }));
    } else {
      dispatch(createBonafideCertificateAsync(payload));
    }
  };


  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">Bonafide Certificate</h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Bonafide Certificate / Issue Bonafide Certificate
      </p>

      <div className="card">
        <div className="card-section">Issue Bonafide Certificate</div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Admission No."
              required
              name="admissionNo"
              value={form.admissionNo}
              onChange={handleInputChange}
            />

            <div>
              <label className="form-label">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={form.studentName}
                disabled
                className="form-input mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="form-label">Class / Section</label>
              <input
                type="text"
                name="class"
                value={form.class}
                disabled
                className="form-input mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="form-label">Father / Guardian Name</label>
              <input
                type="text"
                name="fatherGuardianName"
                value={form.fatherGuardianName}
                disabled
                className="form-input mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={form.academicYear}
                disabled
                className="form-input mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="form-label">School Name</label>
              <input
                type="text"
                name="schoolName"
                value={form.schoolName}
                disabled
                className="form-input mt-1 bg-gray-100"
              />
            </div>

            <Input
              label="Date Of Issue Bonafide Certificate"
              required
              name="dateOfIssueBonafideCertificate"
              value={form.dateOfIssueBonafideCertificate}
              onChange={handleInputChange}
              type="date"
            />
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={() => navigate("/bonafide-certificate-list")}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndPreview}
              className="btn-primary"
              disabled={loading}
            >
              {isEditMode ? "Update & Preview" : "Save & Preview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBonafideCertificate;
