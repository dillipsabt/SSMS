// ================================
// ResultsList.jsx
// ================================

import React, { useEffect, useMemo, useState } from "react";
import { Eye, X, Search } from "lucide-react";
import { FaUserGraduate } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  fetchClasses,
  fetchExaminationTypes,
  fetchExamResults,
  fetchStudentResultSummary,
  fetchSubjects,
  resetExamResultState,
} from "../../features/Admin/ExamResult/examResultSlice";

export default function ResultsList() {
  const dispatch = useDispatch();

  const {
    classes,
    examinationTypes,
    examResults,
    resultSummary,
    subjects,
    loading,
    error,
  } = useSelector((state) => state.examResult);

  // =========================
  // FILTER STATES
  // =========================

  const [classSection, setClassSection] = useState("");
  const [examType, setExamType] = useState("");
  const [date, setDate] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("");

  const [studentModal, setStudentModal] = useState(null);

  // =========================
  // INITIAL API CALLS
  // =========================

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchExaminationTypes());
    dispatch(fetchSubjects());

    return () => {
      dispatch(resetExamResultState());
    };
  }, [dispatch]);

  // =======================================
  // HANDLE SEARCH UPDATE
  // =======================================

  const handleSearch = async () => {
    if (!classSection || !examType || !date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await dispatch(
        fetchExamResults({
          classId: classSection,
          examinationTypeId: examType,
          examDate: date,
        })
      ).unwrap();

      toast.success("Results fetched successfully");
    } catch (err) {
      toast.error(
        err?.message ||
        "No exam results found"
      );
    }
  };

  // =======================================
  // HANDLE VIEW STUDENTS UPDATE
  // =======================================

  const handleViewStudents = async (item) => {
    setStudentModal(item);

    try {
      // Dynamic Teacher Id
      const teacherId =
        item.teacherId ||
        item.teacher?.id ||
        item.teacherDetails?.id ||
        null;

      // Agar teacherId hi nahi mila
      if (!teacherId) {
        toast.error("Teacher Id not found");
        return;
      }

      await dispatch(
        fetchStudentResultSummary({
          classId: item.classId,
          subjectId: item.subjectId,
          examinationTypeId: examType,
          teacherId: teacherId,
        })
      ).unwrap();
    } catch (err) {

      toast.error(
        err?.message ||
        err?.error ||
        "Failed to fetch result details"
      );
    }
  };

  // =========================
  // TABLE DATA
  // =========================

  const tableData = examResults || [];
  // =======================================
  // FILTERED DATA UPDATE
  // =======================================

  const filtered = useMemo(() => {
    return tableData.filter((item) => {
      const matchSubject =
        !subjectFilter ||
        item.subjectName === subjectFilter;

      return matchSubject;
    });
  }, [tableData, subjectFilter]);

  // =========================
  // SUBJECTS
  // =========================

  const SUBJECTS =
    subjects?.length > 0
      ? subjects
      : [
        ...new Set(
          tableData.map(
            (item) => item.subjectName
          )
        ),
      ];

  // =======================================
  // STATS UPDATE
  // =======================================

  const stats = {
    total: resultSummary?.dtoList?.length
      ? resultSummary.dtoList.length
      : 0,

    pass:
      resultSummary?.dtoList?.filter(
        (s) => s.status === "PASS"
      ).length || 0,

    fail:
      resultSummary?.dtoList?.filter(
        (s) => s.status === "FAIL"
      ).length || 0,
  };

  return (
    <>
      <div className="page-wrap p-4 sm:p-6">
        {/* HEADER */}

        <h2 className="text-base sm:text-[18px] font-semibold text-[#333333]">
          Teacher Wise Results List
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Exam & Results / Teacher Wise Results List
        </p>

        <div className="card p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-700">
            Results List
          </h3>

          {/* TOP FILTERS */}

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 sm:gap-4 mb-5">

            {/* CLASS */}

            <div className="flex flex-col flex-1 min-w-[140px] sm:min-w-[160px]">
              <label className="text-xs sm:text-[12px] font-medium text-gray-700 mb-1.5">
                Class / Section{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                value={classSection}
                onChange={(e) =>
                  setClassSection(e.target.value)
                }
                className="h-9 border border-gray-300 rounded px-3 text-[12px] focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer bg-white"
              >
                <option value="">Select</option>

                {classes?.map((cls) => (
                  <option
                    key={cls.id}
                    value={cls.id}
                  >
                    {cls.className}
                    {cls.section
                      ? ` - ${cls.section}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* EXAM TYPE */}

            <div className="flex flex-col flex-1 min-w-[140px] sm:min-w-[160px]">
              <label className="text-xs sm:text-[12px] font-medium text-gray-700 mb-1.5">
                Exam Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                value={examType}
                onChange={(e) =>
                  setExamType(e.target.value)
                }
                className="h-9 border border-gray-300 rounded px-3 text-[12px] focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer bg-white"
              >
                <option value="">Select</option>

                {examinationTypes?.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.examType}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}

            <div className="flex flex-col flex-1 min-w-[140px] sm:min-w-[160px]">
              <label className="text-xs sm:text-[12px] font-medium text-gray-700 mb-1.5">
                Date{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="h-9 border border-gray-300 rounded px-3 text-[12px] focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 bg-white"
              />
            </div>

            {/* SEARCH */}

            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 bg-brand-600 text-white px-6 h-9 rounded text-[12px] font-medium hover:bg-brand-700 transition shrink-0"
            >
              <Search size={14} />

              {loading
                ? "Loading..."
                : "Search"}
            </button>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">

            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 sm:px-4 py-2 sm:py-3">
              <div>
                <p className="text-lg sm:text-[28px] font-bold text-green-700">
                  {stats.total}
                </p>

                <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5">
                  Total Students
                </p>
              </div>

              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <FaUserGraduate
                  className="text-white"
                  size={18}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded px-3 sm:px-4 py-2 sm:py-3">
              <div>
                <p className="text-lg sm:text-[28px] font-bold text-purple-700">
                  {stats.pass}
                </p>

                <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5">
                  Pass
                </p>
              </div>

              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                <FaUserGraduate
                  className="text-white"
                  size={18}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded px-3 sm:px-4 py-2 sm:py-3">
              <div>
                <p className="text-lg sm:text-[28px] font-bold text-pink-700">
                  {String(stats.fail).padStart(
                    2,
                    "0"
                  )}
                </p>

                <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5">
                  Fail
                </p>
              </div>

              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
                <FaUserGraduate
                  className="text-white"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* FILTERS */}

          <div className="flex flex-wrap justify-end gap-2 mb-4">

            <select
              value={subjectFilter}
              onChange={(e) =>
                setSubjectFilter(e.target.value)
              }
              className="border border-gray-300 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-600 cursor-pointer"
            >
              <option value="">
                Subject
              </option>

              {SUBJECTS.map((s) => (
                <option
                  key={s.subjectId || s.id || s}
                  value={s.subjectName || s.name || s}
                >
                  {s.subjectName || s.name || s}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-3 border border-red-200 bg-red-50 text-red-600 px-3 py-2 rounded text-[12px] font-medium">
              {typeof error === "string"
                ? error
                : error?.message}
            </div>
          )}

          {/* TABLE */}

          <div className="border border-brand-600 rounded overflow-x-auto">
            <table className="w-full text-[11px] sm:text-[12px] min-w-full">

              <thead className="bg-brand-600 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">
                    S.No.
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Teacher ID
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Teacher Name
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Date
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Class
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Subject
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Exam Type
                  </th>

                  <th className="px-3 py-2 text-left font-semibold">
                    Student Marks
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered?.length > 0 ? (
                  filtered.map((item, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        {i + 1}
                      </td>

                      <td className="px-3 py-2">
                        {item.teacherId || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {item.teacherName || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {item.examDate || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {item.classCode || item.className || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {item.subjectName || "-"}
                      </td>

                      <td className="px-3 py-2">
                        {item.examType || "-"}
                      </td>

                      <td className="px-3 py-2">
                        <button
                          onClick={() =>
                            handleViewStudents(item)
                          }
                          className="text-brand-600 hover:text-brand-700 hover:scale-110 transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-4 text-gray-500"
                    >
                      No Results Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="flex items-center justify-end gap-2 mt-4 text-[12px]">
            <button className="border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition font-medium">
              Prev
            </button>

            <button className="bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700 transition font-medium">
              Next
            </button>

            <span className="text-gray-600">
              Page: 1 of 1
            </span>

            <select className="border border-gray-300 px-2 py-1.5 rounded w-[60px] cursor-pointer">
              <option>10</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Student Results Modal ── */}

      {studentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[780px] bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col">

            {/* Modal Header */}

            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg shrink-0">
              <span className="text-sm font-medium">
                Student Results
              </span>

              <button
                onClick={() => setStudentModal(null)}
                className="hover:text-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">

              {/* Info row - Compact header */}

              <div className="flex gap-8 mb-3 text-[12px] px-1">
                <div>
                  <p className="text-gray-500 text-xs">
                    Teacher Name
                  </p>
                  <p className="text-gray-800 font-medium">
                    {studentModal?.teacherName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">
                    Exam Type
                  </p>
                  <p className="text-gray-800 font-medium">
                    {studentModal?.examType || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">
                    Class
                  </p>
                  <p className="text-gray-800 font-medium">
                    {studentModal?.classCode || studentModal?.className || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">
                    Subject
                  </p>
                  <p className="text-gray-800 font-medium">
                    {studentModal?.subjectName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">
                    Exam Date
                  </p>
                  <p className="text-gray-800 font-medium">
                    {studentModal?.examDate || "-"}
                  </p>
                </div>
              </div>

              {/* Table */}

              <div className="border border-gray-300 rounded overflow-x-auto">
                <table className="w-full text-[12px]">

                  <thead className="bg-brand-600 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">
                        S.No.
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Roll Number
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Student Name
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Obtained Marks (/100)
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Percentage (%)
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Grade
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Status
                      </th>

                      <th className="px-3 py-2 text-left font-semibold">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {resultSummary?.dtoList?.length > 0 ? (
                      resultSummary.dtoList.map((s, index) => (
                        <tr
                          key={s.id || index}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2">
                            {index + 1}
                          </td>

                          <td className="px-3 py-2">
                            {s.rollNo || "-"}
                          </td>

                          <td className="px-3 py-2">
                            {s.studentName || "-"}
                          </td>

                          <td className="px-3 py-2">
                            {s.obtainedMarks}/{s.totalMarks}
                          </td>

                          <td className="px-3 py-2">
                            {s.percentage}%
                          </td>

                          <td className="px-3 py-2">
                            {s.grade || "-"}
                          </td>

                          <td className="px-3 py-2">
                            <span
                              className={
                                s.status === "PASS"
                                  ? "text-green-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {s.status}
                            </span>
                          </td>

                          <td className="px-3 py-2">
                            {s.remarks || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-3 text-red-500 font-medium text-[12px]"
                        >
                          {error?.message ||
                            error?.error ||
                            "No student result found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}

              <div className="flex items-center gap-2 mt-4 text-[12px]">

                <button
                  onClick={() => setStudentModal(null)}
                  className="border border-red-500 text-red-500 px-4 py-1.5 rounded hover:bg-red-50 transition text-xs font-medium"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2 ml-auto">

                  <button className="border border-gray-300 px-3 py-1.5 rounded text-gray-700 hover:bg-gray-50 transition text-xs">
                    Prev
                  </button>

                  <button className="bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700 transition text-xs font-medium">
                    Next
                  </button>

                  <span className="text-gray-600 text-xs">
                    Page: 1 of 1
                  </span>

                  <select className="border border-gray-300 px-2 py-1.5 rounded cursor-pointer text-gray-700 text-xs">
                    <option>10</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
