import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, X } from "lucide-react";
import {
  uploadStudentsAsync,
  uploadTeachersAsync,
  uploadStaffAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/BulkUpload/bulkUploadSlice";
import useToastMessage from "../../utils/useToastMessage";

const BulkUpload = () => {
  const dispatch = useDispatch();

  const {
    studentUpload,
    teacherUpload,
    staffUpload,
    success,
    error,
    successMessage,
  } = useSelector((state) => state.bulkUpload);

  const [studentFile, setStudentFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [staffFile, setStaffFile] = useState(null);

  const allowedFormats = [".csv", ".xlsx", ".xls"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  useToastMessage({
    createSuccess: success,
    error: error,
    createMessage: successMessage,
    clearSuccess: clearSuccess,
    clearError: clearError,
    onSuccess: () => {
      setStudentFile(null);
      setTeacherFile(null);
      setStaffFile(null);
    },
  });

  const validateFile = (file) => {
    if (!file) return { valid: false, message: "Please select a file" };

    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      return {
        valid: false,
        message: "Only CSV, XLSX, and XLS files are allowed",
      };
    }

    if (file.size > maxFileSize) {
      return {
        valid: false,
        message: "File size should be less than 10MB",
      };
    }

    return { valid: true };
  };

  const handleFileSelect = (e, setFile) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      e.target.value = "";
      return;
    }
    setFile(file);
  };

  const handleDragDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      return;
    }
    setFile(file);
  };

  const handleUpload = async (file, uploadFn) => {
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.valid) {
      return;
    }
    dispatch(uploadFn(file));
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        disabled: "bg-gray-300",
      },
      green: {
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700",
        disabled: "bg-gray-300",
      },
      purple: {
        icon: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
        disabled: "bg-gray-300",
      },
    };
    return colors[color] || colors.blue;
  };

  const UploadPanel = ({ title, file, setFile, uploadFn, loading, icon, color }) => {
    const colorClasses = getColorClasses(color);

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>

        {/* Drag and Drop */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDragDrop(e, setFile)}
          className="mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:bg-gray-100 transition"
        >
          <Upload size={32} className={`mb-2 ${colorClasses.icon}`} />
          <p className="text-center text-sm font-medium text-gray-700">
            Drag and drop your file here or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: CSV, XLSX, XLS (Max 10MB)
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => handleFileSelect(e, setFile)}
            className="hidden"
            id={`file-${title}`}
          />
          <label
            htmlFor={`file-${title}`}
            className={`mt-3 cursor-pointer rounded-md ${colorClasses.button} px-4 py-2 text-white text-sm font-medium transition`}
          >
            Choose File
          </label>
        </div>

        {/* Selected File */}
        {file && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-500 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div>
          <button
            onClick={() => handleUpload(file, uploadFn)}
            disabled={!file || loading}
            className={`w-full rounded-md px-4 py-2 font-medium text-white transition ${
              file && !loading ? colorClasses.button : colorClasses.disabled
            } ${!file || loading ? "cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Bulk Upload</h1>
        <p className="mt-2 text-gray-600">
          Upload Students, Teachers and Staff using CSV or Excel files.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Students Upload Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Students Upload</p>
              <p className="mt-2 text-lg font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        {/* Teachers Upload Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Teachers Upload</p>
              <p className="mt-2 text-lg font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        {/* Staff Upload Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.488M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 10-20 0v2h2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Staff Upload</p>
              <p className="mt-2 text-lg font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Panels */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadPanel
          title="Students Upload"
          file={studentFile}
          setFile={setStudentFile}
          uploadFn={uploadStudentsAsync}
          loading={studentUpload.loading}
          icon={<Upload />}
          color="blue"
        />
        <UploadPanel
          title="Teachers Upload"
          file={teacherFile}
          setFile={setTeacherFile}
          uploadFn={uploadTeachersAsync}
          loading={teacherUpload.loading}
          icon={<Upload />}
          color="green"
        />
      </div>

      {/* Staff Upload - Full Width on Small Screens */}
      <div className="mb-6">
        <UploadPanel
          title="Staff Upload"
          file={staffFile}
          setFile={setStaffFile}
          uploadFn={uploadStaffAsync}
          loading={staffUpload.loading}
          icon={<Upload />}
          color="purple"
        />
      </div>
    </div>
  );
};

export default BulkUpload;
