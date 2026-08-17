import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, X, ChevronDown, ChevronRight } from "lucide-react";
import { getHomeworkSubmissionsAsync } from "../../features/Admin/Assignment-Homework/HomeworkSlice";
import Pagination from "../../components/common/Pagination";

// Format ISO timestamp → "dd/mm/yyyy"
const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Extract filename from a path like "homework/submissions/uuid_filename.pdf"
const extractFilename = (url) => {
  if (!url) return "-";

  const cleanUrl = url.split("?")[0];

  const raw = cleanUrl.split("/").pop();

  const parts = raw.split("_");

  return parts.length > 1
    ? parts.slice(1).join("_")
    : raw;
};

// Derive row-level status from a student's submissions
const getRowStatus = (subs) => {
  const statuses = (subs || []).map((s) => (s.status || "").toUpperCase());

  if (statuses.every((s) => s === "ACCEPTED")) return "Completed";
  if (statuses.some((s) => s === "REJECTED")) return "Rejected";
  if (statuses.some((s) => s === "PENDING")) return "Pending";

  return "Pending";
};

const mainStatusColor = {
  Pending: "text-orange-500",
  Completed: "text-green-600",
  Rejected: "text-red-500",
};

const subStatusColor = {
  Pending: "text-orange-500 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full inline-block min-w-[80px] text-center",
  Completed: "text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full inline-block min-w-[80px] text-center",
  Rejected: "text-red-500 bg-red-50 border border-red-200 px-2 py-1 rounded-full inline-block min-w-[80px] text-center",
};

export default function StudentAssignmentSubmission() {
  const dispatch = useDispatch();
  const { submissions, loading, error } = useSelector((state) => state.homework);

  const [openRow, setOpenRow] = useState(null);
  const [workModal, setWorkModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(getHomeworkSubmissionsAsync());
  }, [dispatch]);

  // Group submissions by studentCode
  const grouped = submissions.reduce((acc, sub) => {
    const key = sub.studentCode;

    if (!acc[key]) {
      acc[key] = {
        studentCode: sub.studentCode,
        studentName: sub.studentName,
        teacherCode: sub.teacherCode,
        teacherName: sub.teacherName,
        className: sub.className,
        submissions: [],
      };
    }

    acc[key].submissions.push(sub);

    return acc;
  }, {});

  const rows = Object.values(grouped);

  const toggleRow = (idx) => {
    setOpenRow(openRow === idx ? null : idx);
  };

  const filtered = rows.filter((row) => {
    const matchSearch =
      !search ||
      row.studentName.toLowerCase().includes(search.toLowerCase()) ||
      String(row.studentCode).includes(search);

    const matchStatus =
      !statusFilter || getRowStatus(row.submissions) === statusFilter;

    const matchDate =
      !dateFilter ||
      row.submissions.some((s) => s.submittedAt?.startsWith(dateFilter));

    return matchSearch && matchStatus && matchDate;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentAssignments = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div>

      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Student Assignment Submission
      </h2>

      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Homework / Student Assignment Submission
      </p>

      {/* CARD */}
      <div className="card p-3 sm:p-4">

        <h3 className="text-[13px] font-medium text-gray-700 mb-3">
          Assignment Submission List
        </h3>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-end gap-2 mb-3">

          <input
            placeholder="Search Name / Student ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input w-[200px] text-xs"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-input w-auto text-xs"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select w-auto text-xs"
          >
            <option value="">Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>

        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-[12px] text-gray-500 py-4 text-center">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-[12px] text-red-500 py-4 text-center">
            {typeof error === "string"
              ? error
              : "Failed to load submissions."}
          </p>
        )}

        {/* TABLE */}
        {!loading && (
          <div className="border border-gray-300 rounded overflow-x-auto">

            <table className="min-w-[800px] w-full text-[12px]">

              <thead className="thead-row">
                <tr>

                  <th className="px-3 py-2 w-8"></th>

                  <th className="px-3 py-2 w-8">
                    <input
                      type="checkbox"
                      className="accent-brand-600"
                    />
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    S.No.
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Student ID
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Student Name
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Teacher ID
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Teacher Name
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Class
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Submission Date
                  </th>

                  <th className="px-3 py-2 text-left font-medium">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {currentAssignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-8 text-gray-400"
                    >
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  currentAssignments.map((row, i) => {

                    const rowStatus = getRowStatus(row.submissions);

                    // Use the most recent submittedAt for the row date
                    const latestDate = (row.submissions || [])
                      .map((s) => s.submittedAt)
                      .sort()
                      .reverse()[0];

                    return (
                      <>
                        {/* MAIN ROW */}
                        <tr
                          key={row.studentCode}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >

                          <td className="px-3 py-2 cursor-pointer text-gray-500">

                            <button
                              onClick={() => toggleRow(i)}
                              className="hover:text-brand-600 transition"
                              aria-label="Expand row"
                            >
                              {openRow === i ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>

                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              className="accent-brand-600"
                              aria-label="Select row"
                            />
                          </td>

                          <td className="px-3 py-2">
                            {indexOfFirst + i + 1}
                          </td>

                          <td className="px-3 py-2">
                            {row.studentCode}
                          </td>

                          <td className="px-3 py-2">
                            {row.studentName}
                          </td>

                          <td className="px-3 py-2">
                            {row.teacherCode}
                          </td>

                          <td className="px-3 py-2">
                            {row.teacherName}
                          </td>

                          <td className="px-3 py-2">
                            {row.className}
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatDate(latestDate)}
                          </td>

                          <td
                            className={`px-3 py-2 font-medium ${
                              mainStatusColor[rowStatus] ?? ""
                            }`}
                          >
                            {rowStatus}
                          </td>

                        </tr>

                        {/* EXPANDED SUB-TABLE */}
                        {openRow === i && (
                          <tr key={`sub-${row.studentCode}`}>

                            <td
                              colSpan="10"
                              className="bg-[#f7f9fc] px-8 py-3"
                            >

                              <table className="w-full text-[12px] border rounded overflow-hidden">

                                <thead className="thead-row">
                                  <tr>

                                    <th className="px-3 py-2 text-left font-medium">
                                      S.No.
                                    </th>

                                    <th className="px-3 py-2 text-left font-medium">
                                      Homework Title
                                    </th>

                                    <th className="px-3 py-2 text-left font-medium">
                                      Reject Comments
                                    </th>

                                    <th className="px-3 py-2 text-center font-medium">
                                      Work Submission
                                    </th>

                                    <th className="px-3 py-2 text-left font-medium">
                                      Status
                                    </th>

                                  </tr>
                                </thead>

                                <tbody>

                                  {(row.submissions || []).map((sub, si) => {

                                    let subStatus = "Pending";

                                    if (sub.status === "ACCEPTED") {
                                      subStatus = "Completed";
                                    } else if (sub.status === "REJECTED") {
                                      subStatus = "Rejected";
                                    } else if (sub.status === "PENDING") {
                                      subStatus = "Pending";
                                    }

                                    return (
                                      <tr
                                        key={sub.id}
                                        className="border-t bg-white hover:bg-gray-50"
                                      >

                                        <td className="px-3 py-2">
                                          {si + 1}
                                        </td>

                                        <td className="px-3 py-2">
                                          {sub.homeworkTitle || "-"}
                                        </td>

                                        <td className="px-3 py-2 text-gray-500">
                                          {sub.remarks || "-"}
                                        </td>

                                        <td className="px-3 py-2 text-center">

                                          <button
                                            onClick={() =>
                                              setWorkModal({
                                                studentName: row.studentName,
                                                studentCode: row.studentCode,
                                                teacherName: row.teacherName,
                                                teacherCode: row.teacherCode,
                                                className: row.className,
                                                subject: sub.homeworkTitle,
                                                submissionUrl: sub.submissionUrl,
                                              })
                                            }
                                            className="text-brand-600 hover:text-brand-700 transition"
                                            title="View Work Submission"
                                          >
                                            <Eye size={15} />
                                          </button>

                                        </td>

                                        <td className="px-3 py-2">

                                          <span
                                            className={`font-medium ${
                                              subStatusColor[subStatus] ?? ""
                                            }`}
                                          >
                                            {subStatus}
                                          </span>

                                        </td>

                                      </tr>
                                    );
                                  })}

                                </tbody>

                              </table>

                            </td>

                          </tr>
                        )}

                      </>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />

      </div>

      {/* ── Work Submission Attachments Modal ── */}
      {workModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-[420px] bg-white rounded-md shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center">

              <span className="text-sm font-medium">
                Work Submission Attachments
              </span>

              <button
                onClick={() => setWorkModal(null)}
                className="hover:text-gray-200 transition"
              >
                <X size={16} />
              </button>

            </div>

            {/* Body */}
            <div className="p-4 text-[12px]">

              {/* Info row */}
              <div className="flex gap-6 mb-4 text-[12px]">

                <div>
                  <p className="text-gray-500 text-[11px]">
                    Student Name
                  </p>

                  <p className="font-medium mt-0.5">
                    {workModal.studentName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-[11px]">
                    Homework Title
                  </p>

                  <p className="font-medium mt-0.5">
                    {workModal.subject}
                  </p>
                </div>

              </div>

              {/* File list */}
              <div className="border rounded overflow-hidden">

                <div className="bg-gray-100 px-3 py-2 text-[11px] font-medium text-gray-600">
                  File Attachment by Name
                </div>

                <div className="p-3 space-y-1.5">

                  {workModal.submissionUrl ? (
                    <a
                      href={workModal.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline cursor-pointer block"
                    >
                      {extractFilename(workModal.submissionUrl)}
                    </a>
                  ) : (
                    <p className="text-gray-400">
                      No attachment available.
                    </p>
                  )}

                </div>

              </div>

              <div className="flex justify-end mt-4">

                <button
                  onClick={() => setWorkModal(null)}
                  className="border border-red-400 text-red-500 px-4 py-1 rounded text-[12px] hover:bg-red-50 transition"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
