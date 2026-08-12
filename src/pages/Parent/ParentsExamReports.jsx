import React, { useEffect, useState } from "react";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchReportCardDownload } from "../../features/Admin/ExamResult/examResultSlice";
import { generateStudentReportCardPdf } from "../../utils/generateStudentReportCardPdf";
import useToastMessage from "../../utils/useToastMessage";
import {
  getStudentsByParentThunk,
  fetchAcademicYears,
  fetchExaminationTypes,
  fetchStudentExamResults,
  clearSuccess,
  clearError,
} from "../../features/parent/ExamReports/parentExamReportsSlice";

export default function ParentsExamReports() {
  const dispatch = useDispatch();

  const { profileId: parentId } = useSelector((state) => state.auth);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [examTypeId, setExamTypeId] = useState("");

  const {
    students = [],
    academicYears,
    examinationTypes,
    examResults,
    loading,
    error,
    success,
  } = useSelector((state) => state.parentExamReports);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Show toast on success/error
  useToastMessage({
    success,
    error,
    successMessage: "Exam reports fetched successfully! ✅",
    clearSuccess,
    clearError,
  });

  useEffect(() => {
    if (parentId) {
      dispatch(getStudentsByParentThunk(parentId));
    }
    dispatch(fetchAcademicYears());
    dispatch(fetchExaminationTypes());
  }, [dispatch, parentId]);

  const handleSearch = () => {
    if (!selectedStudentId) {
      toast.warning("Please select student");
      return;
    }

    if (!academicYearId) {
      toast.warning("Please select academic year");
      return;
    }

    if (!examTypeId) {
      toast.warning("Please select exam type");
      return;
    }

    dispatch(
      fetchStudentExamResults({
        studentId: Number(selectedStudentId),
        academicYearId,
        examinationTypeId: examTypeId,
      }),
    );
  };

  const handleDownloadReportCard = async () => {
    if (!selectedStudentId || !examTypeId) {
      toast.warning("Please select student and exam type");
      return;
    }

    try {
      const report = await dispatch(
        fetchReportCardDownload({
          studentId: Number(selectedStudentId),
          examinationTypeId: examTypeId,
        }),
      ).unwrap();
      generateStudentReportCardPdf(report);
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to download report card");
    }
  };

  const reportData = Array.isArray(examResults)
    ? examResults
    : Array.isArray(examResults?.subjects)
      ? examResults.subjects
      : [];

  const total = reportData.reduce(
    (sum, item) => sum + Number(item.obtainedMarks || 0),
    0,
  );
  const totalMarks = reportData.reduce(
    (sum, item) => sum + Number(item.totalMarks || 0),
    0,
  );

  const totalPercentage = totalMarks > 0
    ? ((total / totalMarks) * 100).toFixed(2)
    : "0.00";
  const totalPercentageValue = Number(totalPercentage);
  const overallGrade = examResults?.overallGrade || (
    totalPercentageValue >= 90
      ? "A+"
      : totalPercentageValue >= 80
        ? "A"
        : totalPercentageValue >= 70
          ? "B"
          : totalPercentageValue >= 60
            ? "C"
            : "F"
  );
  const overallStatus = examResults?.overallStatus || (
    reportData.length > 0 && reportData.every((item) => String(item.status).toUpperCase() === "PASS")
      ? "PASS"
      : "FAIL"
  );

  return (
    <div className="w-full px-4 sm:px-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Exam Reports</h2>
      <p className="text-sm text-gray-500 mb-4">Exams / Exam Reports</p>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Student */}
          <div>
            <label className="form-label">
              Student <span className="text-red-500">*</span>
            </label>
            <Select
              options={students.map((student) => ({
                value: student.id,
                label: student.fullName,
              }))}
              value={
                students
                  .map((student) => ({
                    value: student.id,
                    label: student.fullName,
                  }))
                  .find(
                    (option) => option.value === Number(selectedStudentId),
                  ) || null
              }
              onChange={(selected) =>
                setSelectedStudentId(selected?.value || "")
              }
              placeholder="Select Student"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                control: (base) => ({
                  ...base,
                  minHeight: "42px",
                  borderRadius: "8px",
                  borderColor: "#D1D5DB",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#6366F1",
                  },
                }),
              }}
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className="form-label">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="form-select w-full border rounded px-3 py-2"
            >
              <option value="">Select Academic Year</option>
              {academicYears?.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="form-label">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <select
              value={examTypeId}
              onChange={(e) => setExamTypeId(e.target.value)}
              className="form-select w-full border rounded px-3 py-2"
            >
              <option value="">Select Exam Type</option>
              {examinationTypes?.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.examType}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 justify-center h-10"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-4">Loading...</div>}

      {/* Error */}
      {error && <div className="text-red-500 py-2">{error}</div>}

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Obtained Marks</th>
              <th className="px-4 py-3 text-left">Percentage (%)</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {reportData.length > 0 ? (
              <>
                {reportData.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">{row.subjectName}</td>
                    <td className="px-4 py-3">{row.obtainedMarks}</td>
                    <td className="px-4 py-3">{row.percentage}%</td>
                    <td className="px-4 py-3">{row.grade}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded text-xs ${
                          String(row.status).toUpperCase() === "PASS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}

                <tr className="bg-gray-50 border-t-2">
                  <td className="px-4 py-3 font-bold">Total</td>
                  <td className="px-4 py-3 font-bold">{total}</td>
                  <td className="px-4 py-3 font-bold">{totalPercentage}%</td>
                  <td className="px-4 py-3 font-bold">
                    {overallGrade}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {overallStatus}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No exam reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Navigation Button Area */}
      <div className="flex justify-end p-4 mt-2">
        <button
          onClick={handleDownloadReportCard}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition duration-200 shadow-sm"
        >
          <Download size={18} />
          Download Report Card
        </button>
      </div>
    </div>
  );
}
