// =========================
// TeacherResultsList.jsx
// =========================

import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Pagination from "../../components/common/Pagination";
import Select from "react-select";
import useToastMessage from "../../utils/useToastMessage";

import {
  fetchTeacherExamResults,
  fetchStudentResults,
  fetchClasses,
  fetchSubjects,
  fetchAcademicYears,
  fetchExaminationTypes,
  clearSuccess,
  clearError,
} from "../../features/teacher/ExamResults/examResultsSlice";

const TeacherResultsList = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showStudentResultsModal, setShowStudentResultsModal] =
    useState(false);

  const [selectedExam, setSelectedExam] = useState(null);

  const [filters, setFilters] = useState({
    academicYearId: "",
    classId: "",
    subjectId: "",
    examinationTypeId: "",
  });

  const {
    teacherExamResults = [],
    studentResults = [],
    studentResultsDetails,
    classes = [],
    subjects = [],
    academicYears = [],
    examinationTypes = [],
    loading,
    error,
    success,
  } = useSelector((state) => state.teacherExamResults);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Show toast on success/error
  useToastMessage({
    success,
    error,
    successMessage: "Results fetched successfully! ✅",
    clearSuccess,
    clearError,
  });

  useEffect(() => {
    dispatch(fetchClasses());

    dispatch(fetchSubjects());

    dispatch(fetchAcademicYears());

    dispatch(fetchExaminationTypes());
  }, [dispatch]);

  const handleViewStudentResults = () => {
    if (
      filters.academicYearId &&
      filters.classId &&
      filters.subjectId &&
      filters.examinationTypeId
    ) {
      dispatch(
        fetchStudentResults({
          academicYearId: filters.academicYearId,
          classId: filters.classId,
          subjectId: filters.subjectId,
          examinationTypeId: filters.examinationTypeId,
        })
      )
        .unwrap()
        .then(() => {
          setShowStudentResultsModal(true);
        })
        .catch((err) => {
          toast.error(
            err?.message || "No student results found"
          );
        });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const filterParams = {};

    if (filters.academicYearId)
      filterParams.academicYearId = parseInt(
        filters.academicYearId
      );

    if (filters.classId)
      filterParams.classId = parseInt(filters.classId);

    if (filters.subjectId)
      filterParams.subjectId = parseInt(filters.subjectId);

    if (filters.examinationTypeId)
      filterParams.examinationTypeId = parseInt(
        filters.examinationTypeId
      );

    dispatch(fetchTeacherExamResults(filterParams));
  };

  const indexOfLast = currentPage * rowsPerPage;

  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentResults = teacherExamResults.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    teacherExamResults.length / rowsPerPage
  );

  return (
    <div className="min-h-screen bg-white px-3">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800">
        Results List
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Teacher / Results List
      </p>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-6">
          Results List
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Academic Year */}
          <div>
            <Select
              className="w-full"
              options={[
                { value: "", label: "Academic Year" },
                ...(academicYears?.map((year) => ({
                  value: year.id,
                  label: year.year,
                })) || []),
              ]}
              value={[
                { value: "", label: "Academic Year" },
                ...(academicYears?.map((year) => ({
                  value: year.id,
                  label: year.year,
                })) || []),
              ].find((item) => item.value == filters.academicYearId)}
              onChange={(selected) =>
                handleFilterChange(
                  "academicYearId",
                  selected?.value || ""
                )
              }
            />
          </div>

          {/* Class */}
          <div>
            <Select
              className="w-full"
              options={[
                { value: "", label: "Class" },
                ...(classes?.map((cls) => ({
                  value: cls.id,
                  label: cls.classCode || cls.className,
                })) || []),
              ]}
              value={[
                { value: "", label: "Class" },
                ...(classes?.map((cls) => ({
                  value: cls.id,
                  label: cls.classCode || cls.className,
                })) || []),
              ].find((item) => item.value == filters.classId)}
              onChange={(selected) =>
                handleFilterChange("classId", selected?.value || "")
              }
            />
          </div>

          {/* Subject */}
          <div>
            <Select
              className="w-full"
              options={[
                { value: "", label: "Subject" },
                ...(subjects?.map((subject) => ({
                  value: subject.id,
                  label: subject.subjectName || subject.name,
                })) || []),
              ]}
              value={[
                { value: "", label: "Subject" },
                ...(subjects?.map((subject) => ({
                  value: subject.id,
                  label: subject.subjectName || subject.name,
                })) || []),
              ].find((item) => item.value == filters.subjectId)}
              onChange={(selected) =>
                handleFilterChange("subjectId", selected?.value || "")
              }
            />
          </div>

          {/* Exam Type */}
          <div>
            <Select
              className="w-full"
              options={[
                { value: "", label: "Exam Type" },
                ...(examinationTypes?.map((exam) => ({
                  value: exam.id,
                  label: exam.examType || exam.name,
                })) || []),
              ]}
              value={[
                { value: "", label: "Exam Type" },
                ...(examinationTypes?.map((exam) => ({
                  value: exam.id,
                  label: exam.examType || exam.name,
                })) || []),
              ].find((item) => item.value == filters.examinationTypeId)}
              onChange={(selected) =>
                handleFilterChange(
                  "examinationTypeId",
                  selected?.value || ""
                )
              }
            />
          </div>

          {/* Apply Button */}
          <div>
            <button
              onClick={handleApplyFilters}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Loading exam results...
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && teacherExamResults.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      S. No.
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Academic Year
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Class
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Subject
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Exam Type
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Student Marks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentResults.map((result, index) => (
                    <tr
                      key={result.id || index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-800">
                        {indexOfFirst + index + 1}
                      </td>

                      <td className="px-4 py-3 text-gray-800">
                        {studentResultsDetails?.academicYear || "-"}
                      </td>

                      <td className="px-4 py-3 text-gray-800">
                        {result.className || result.classCode}
                      </td>

                      <td className="px-4 py-3 text-gray-800">
                        {result.subjectName}
                      </td>

                      <td className="px-4 py-3 text-gray-800">
                        {result.examType}
                      </td>

                      <td className="px-4 py-3 text-gray-800">
                        {studentResultsDetails?.examDate
                          ? new Date(
                            studentResultsDetails.examDate
                          ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={handleViewStudentResults}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
              />
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && teacherExamResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No exam results found
            </p>
          </div>
        )}
      </div>

      {/* Student Results Modal */}
      {showStudentResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-blue-600 text-white p-4 sticky top-0">
              <h2 className="text-lg font-semibold">
                Student Results
              </h2>

              <button
                onClick={() =>
                  setShowStudentResultsModal(false)
                }
                className="hover:bg-blue-700 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Exam Info Bar */}
              {studentResultsDetails && (
                <div className="flex gap-8 mb-4 pb-4 border-b border-gray-200 text-sm flex-wrap">
                  <div>
                    <span className="font-medium">
                      {typeof studentResultsDetails.academicYear === 'string' ? studentResultsDetails.academicYear : (studentResultsDetails.academicYear?.year || '-')}
                    </span>
                  </div>

                  <div>
                    <span className="font-medium">
                      Class{" "}
                      {typeof studentResultsDetails.classCode === 'string' ? studentResultsDetails.classCode : (studentResultsDetails.classCode?.classCode || '-')}
                    </span>
                  </div>

                  <div>
                    <span className="font-medium">
                      {typeof studentResultsDetails.subjectName === 'string' ? studentResultsDetails.subjectName : (studentResultsDetails.subjectName?.subjectName || '-')}
                    </span>
                  </div>

                  <div>
                    <span className="font-medium">
                      {typeof studentResultsDetails.examType === 'string' ? studentResultsDetails.examType : (studentResultsDetails.examType?.examType || '-')}
                    </span>
                  </div>

                  <div>
                    <span className="font-medium">
                      {studentResultsDetails.examDate
                        ? new Date(
                          studentResultsDetails.examDate
                        ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              )}

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        S.No.
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Roll Number
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Student Name
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Obtained Marks (100)
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Percentage (%)
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Grade
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {studentResults.map((student, index) => (
                      <tr
                        key={student.id || index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-800">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-gray-800">
                          {student.rollNo || "-"}
                        </td>

                        <td className="px-4 py-3 text-gray-800">
                          {student.studentName}
                        </td>

                        <td className="px-4 py-3 text-gray-800">
                          {student.obtainedMarks}
                        </td>

                        <td className="px-4 py-3 text-gray-800">
                          {student.percentage}
                        </td>

                        <td className="px-4 py-3 text-gray-800">
                          {student.grade}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${student.status === "PASS" ||
                              student.status === "Pass"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {student.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-800">
                          {student.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {studentResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No student results found
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() =>
                  setShowStudentResultsModal(false)
                }
                className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherResultsList;
