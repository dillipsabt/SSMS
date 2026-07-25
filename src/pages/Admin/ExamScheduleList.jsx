// ExamScheduleList.jsx

import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  fetchExamSchedules,
  updateExamStatus,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";
import Pagination from "../../components/common/Pagination";

export default function ExamScheduleList() {

  const dispatch = useDispatch();

  const { examSchedules, loading } = useSelector(
    (state) => state.examSchedule
  );

  const safeExamSchedules = Array.isArray(examSchedules)
    ? examSchedules
    : [];

  useEffect(() => {
    dispatch(fetchExamSchedules());
  }, [dispatch]);

  const [selected, setSelected] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewModal, setViewModal] = useState(null);

  const [publishModal, setPublishModal] = useState(false);

  const [publishOptions, setPublishOptions] = useState({
    student: true,
    parent: true,
    smsEmail: true,
  });

  const [publishNotes, setPublishNotes] = useState(
    "Exam Schedule verified. Ready to publish."
  );

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // GET REAL ID
  const getExamId = (item) =>
    item.id || item.examId || item.examScheduleId;

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });

  const toggleAll = (e) =>
    setSelected(
      e.target.checked
        ? new Set(
          currentExamSchedules.map((d) => getExamId(d))
        )
        : new Set()
    );

  // PUBLISH API
  const handlePublishSubmit = async () => {

    if (selected.size === 0) {
      toast.error("Please select at least one exam");
      return;
    }

    const payload = {
      examIds: [...selected],
      examStatus: "PUBLISHED",
    };

    try {

      await dispatch(updateExamStatus(payload)).unwrap();

      toast.success("Exam schedule published successfully! ✅");

      dispatch(fetchExamSchedules());

      setPublishModal(false);

      setSelected(new Set());

    } catch (error) {

      const errorMessage = typeof error === "string" ? error : error?.message || "Failed to publish exam";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  const filtered = safeExamSchedules.filter((item) => {

    const matchSearch =
      !search ||
      item.className
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.examinationType
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchClass =
      !classFilter || item.className === classFilter;

    const matchType =
      !typeFilter ||
      item.examinationType === typeFilter;

    return matchSearch && matchClass && matchType;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentExamSchedules = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="page-wrap p-4 sm:p-6">

      {/* Header */}
      <h2 className="text-base sm:text-[18px] font-semibold text-[#333333]">
        Exam Schedule List
      </h2>

      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Exam & Results / Exam Schedule List
      </p>

      <div className="card p-3 sm:p-4">

        <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-700">
          Exam Schedule List
        </h3>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2 sm:gap-3 mb-4">

          <input
            placeholder="Search Class / Exam Type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto h-9 border border-gray-200 rounded-lg px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 bg-white"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-600"
          />

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-600 cursor-pointer"
          >
            <option value="">Class</option>

            {[...new Set(safeExamSchedules.map((c) => c.className))].map(
              (c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              )
            )}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-brand-600 cursor-pointer"
          >
            <option value="">Exam Type</option>

            {[
              ...new Set(
                safeExamSchedules.map(
                  (t) => t.examinationType
                )
              ),
            ].map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">

          <table className="w-full text-[12px] sm:text-[13px] text-gray-700 min-w-full">

            <thead className="bg-gradient-to-r from-brand-600 to-brand-500 text-white">
              <tr>

                <th className="px-2 sm:px-3 py-2 text-center w-8 sm:w-10 font-semibold text-[11px] sm:text-[12px]">
                  {/* SELECT ALL CHECKBOX */}
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      currentExamSchedules.length > 0 &&
                      currentExamSchedules.every((item) =>
                        selected.has(getExamId(item))
                      )
                    }
                    className="accent-brand-600 cursor-pointer w-4 h-4"
                  />
                </th>

                <th className="px-2 sm:px-3 py-2 text-left font-semibold text-[11px] sm:text-[12px]">
                  S.No.
                </th>

                <th className="px-2 sm:px-3 py-2 text-left font-semibold text-[11px] sm:text-[12px]">
                  Academic Year
                </th>

                <th className="px-2 sm:px-3 py-2 text-left font-semibold text-[11px] sm:text-[12px]">
                  Class
                </th>

                <th className="px-2 sm:px-3 py-2 text-left font-semibold text-[11px] sm:text-[12px]">
                  Exam Type
                </th>

                <th className="px-2 sm:px-3 py-2 text-left font-semibold text-[11px] sm:text-[12px]">
                  Status
                </th>

                <th className="px-2 sm:px-3 py-2 text-left font-semibold text-[11px] sm:text-[12px]">
                  View
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentExamSchedules.length > 0 ? (

                currentExamSchedules.map((item, i) => {

                  const examId = getExamId(item);

                  return (
                    <tr
                      key={examId}
                      className="border-t border-gray-100 hover:bg-brand-50 transition-all duration-200"
                    >

                      <td className="px-2 sm:px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selected.has(examId)}
                          onChange={() =>
                            toggleSelect(examId)
                          }
                          className="accent-brand-600 cursor-pointer"
                        />
                      </td>

                      <td className="px-2 sm:px-3 py-2 font-medium text-gray-700 text-[11px] sm:text-[12px]">
                        {indexOfFirst + i + 1}
                      </td>

                      <td className="px-2 sm:px-3 py-2 text-[11px] sm:text-[12px]">
                        {item.academicYear}
                      </td>

                      <td className="px-2 sm:px-3 py-2 text-[11px] sm:text-[12px]">
                        {item.className}
                      </td>

                      <td className="px-2 sm:px-3 py-2 text-[11px] sm:text-[12px]">
                        {item.examinationType}
                      </td>

                      <td className="px-2 sm:px-3 py-2">
                        <span
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold inline-block
                              ${item.examStatus === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {item.examStatus || "Published"}
                        </span>
                      </td>

                      <td className="px-2 sm:px-3 py-2">
                        <button
                          onClick={() => setViewModal(item)}
                          className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 hover:scale-110 transition-all shrink-0"
                          title="View Schedule"
                        >
                          <Eye size={16} />
                        </button>
                      </td>

                    </tr>
                  );
                })

              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5 text-gray-500"
                  >
                    No Data Found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      {/* Publish Button */}
      <div className="flex justify-end mt-4">

        <button
          onClick={() => setPublishModal(true)}
          className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 shadow-md hover:shadow-lg transition-all"
        >
          Publish
        </button>

      </div>

      {/* VIEW MODAL */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[85vh] flex flex-col">

            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg shrink-0">

              <span className="text-sm font-semibold">
                View Exam Schedule
              </span>

              <button
                onClick={() => setViewModal(null)}
                className="hover:text-gray-200 transition"
              >
                <X size={18} />
              </button>

            </div>

            <div className="overflow-y-auto flex-1 p-5">

              <div className="flex flex-wrap gap-8 bg-blue-50 px-4 py-3 rounded mb-4 text-[12px]">

                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">
                    Academic Year
                  </p>

                  <p className="text-gray-900 font-semibold">
                    {viewModal.academicYear}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">
                    Class
                  </p>

                  <p className="text-gray-900 font-semibold">
                    {viewModal.className}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">
                    Exam Type
                  </p>

                  <p className="text-gray-900 font-semibold">
                    {viewModal.examinationType}
                  </p>
                </div>

              </div>

              <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 shadow-inner">

                {viewModal?.timetableFilePath ? (

                  <iframe
                    src={viewModal.timetableFilePath}
                    title="Exam Schedule PDF"
                    className="w-full h-[500px] rounded-lg bg-white border"
                  />

                ) : (

                  <div className="bg-gray-600 rounded h-[200px] flex items-center justify-center text-white text-sm">
                    No PDF Available
                  </div>

                )}

              </div>

              <div className="flex justify-end mt-5">

                <button
                  onClick={() => setViewModal(null)}
                  className="border border-red-500 text-red-500 px-6 py-2 rounded text-sm hover:bg-red-50 transition font-semibold"
                >
                  Cancel
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* PUBLISH MODAL */}
      {publishModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-[460px] bg-white rounded-lg shadow-lg">

            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">

              <span className="text-sm font-medium">
                Publish Exam Schedule
              </span>

              <button
                onClick={() => setPublishModal(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={16} />
              </button>

            </div>

            <div className="p-5">

              <p className="text-[12px] font-bold text-gray-800 mb-3">
                Publish Options
              </p>

              {[
                {
                  key: "student",
                  label: "Publish to student portal",
                },
                {
                  key: "parent",
                  label: "Publish to Parent portal",
                },
                {
                  key: "smsEmail",
                  label: "Send Email / SMS Notification",
                },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-[12px] text-gray-700 mb-2.5 cursor-pointer select-none"
                >

                  <input
                    type="checkbox"
                    checked={publishOptions[key]}
                    onChange={(e) =>
                      setPublishOptions((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="accent-brand-600 cursor-pointer"
                  />

                  {label}

                </label>
              ))}

              <p className="text-[12px] font-bold text-gray-800 mt-4 mb-1">
                Notes (Optional)
              </p>

              <textarea
                rows={3}
                value={publishNotes}
                onChange={(e) =>
                  setPublishNotes(e.target.value)
                }
                className="w-full border border-gray-300 rounded px-2 py-2 text-[12px] focus:outline-none focus:border-brand-600 resize-none"
              />

              <div className="flex justify-end mt-4">

                <button
                  onClick={handlePublishSubmit}
                  className="bg-brand-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-brand-700 transition"
                >
                  Submit
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
