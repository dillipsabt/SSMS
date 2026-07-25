import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { analyzeFileAsync } from "../../features/Admin/AnswerSheets/answerSheetsSlice";

const AnswerSheetsUpload = ({ onAnalyze, isLoading }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.answerSheets);

  const allowedExtensions = [".jpg", ".png", ".csv", ".json", ".xlsx", ".pdf", ".txt"];

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).filter((file) => {
      const ext = "." + file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(ext);
    });

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleAnalyzeClick = () => {
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];

      try {
        dispatch(analyzeFileAsync({ file, docType: "exam_paper" }));
        onAnalyze(file);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  if (loading || isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
          <h2 className="text-white text-2xl font-semibold mb-2">
            Analyzing student data...
          </h2>
          <p className="text-slate-300 text-sm">
            AI is extracting performance insights from your file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
        Answer Sheets
      </h1>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Home / Predictive Analysis Dashboard / Answer Sheets
      </p>

      {/* Upload Section */}
      <div className="bg-white rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm mb-4 sm:mb-6">
        <p className="text-gray-700 font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
          Upload student answer sheets for AI-powered evaluation and analysis
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-blue-600 bg-gradient-to-b from-blue-950 to-blue-900 rounded-lg p-6 sm:p-12 text-center cursor-pointer transition hover:border-blue-500 mb-4 sm:mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg
                className="w-6 sm:w-8 h-6 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-white text-base sm:text-lg font-medium mb-2">
              Drop files here or <span className="text-blue-300 underline">browse</span>
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
              Answer sheet images, CSV, JSON, PDF, Excel or text files
            </p>

            {/* File Type Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[".jpg/.png", ".csv", ".json", ".xlsx", ".pdf", ".txt"].map(
                (type) => (
                  <span
                    key={type}
                    className="bg-blue-800 text-blue-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium"
                  >
                    {type}
                  </span>
                )
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleInputChange}
            className="hidden"
            accept=".jpg,.png,.csv,.json,.xlsx,.pdf,.txt,.xls"
          />
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 sm:mb-6">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 mb-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 16.5a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"
                    />
                  </svg>
                  <span className="text-gray-800 text-xs sm:text-sm font-medium truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition flex-shrink-0 ml-2"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyzeClick}
          disabled={uploadedFiles.length === 0}
          className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 text-sm sm:text-base ${
            uploadedFiles.length > 0
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-4 sm:w-5 h-4 sm:h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Analyze with AI
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        {/* Automated Extraction */}
        <div className="bg-purple-100 rounded-lg p-4 sm:p-6 border border-purple-200">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                Automated Extraction
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                OCR technology identifies answers from scanned answer sheets with
                handwriting recognition.
              </p>
            </div>
          </div>
        </div>

        {/* Pattern Matching */}
        <div className="bg-red-100 rounded-lg p-4 sm:p-6 border border-red-200">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                Answer Evaluation
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                Our models evaluate answers against rubrics based on 1.2M student
                data points for accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Predictive Logic */}
        <div className="bg-green-100 rounded-lg p-4 sm:p-6 border border-green-200">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                Performance Insights
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                Generates detailed feedback on student performance and areas for
                improvement based on answer analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerSheetsUpload;
