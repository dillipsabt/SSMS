import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paperclip, X } from "lucide-react";
import {
  getAllHomeworkAsync,
  getHomeworkSubmissionsAsync,
} from "../../features/Admin/Assignment-Homework/HomeworkSlice";
import Pagination from "../../components/common/Pagination";

// Derive status for a homework item from submissions list
const getStatus = (homeworkId, submissions) => {
  const submission = submissions.find((s) => s.homeworkId === homeworkId);
  if (!submission) return "";
  const r = submission.remarks || "";
  return r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
};

// Extract a human-readable filename from an S3 / path URL
const extractFilename = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const raw = pathname.split("/").pop();
    // strip leading UUID prefix (uuid_originalname)
    const parts = raw.split("_");
    return parts.length > 1 ? parts.slice(1).join("_") : raw;
  } catch {
    return url;
  }
};

// Format ISO date string "2026-05-07" → "07/05/2026"
const formatDate = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const statusColor = {
  Completed: "text-green-600",
  Missed: "text-red-500",
  Pending: "text-orange-500",
  Reject: "text-red-500",
};

export default function AssignmentHomework() {
  const dispatch = useDispatch();
  const { homeworkList, submissions, loading, error } = useSelector(
    (state) => state.homework
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dateFilter, setDate] = useState("");

  useEffect(() => {
    dispatch(getAllHomeworkAsync());
    dispatch(getHomeworkSubmissionsAsync());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const openModal = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const filtered = homeworkList.filter((item) => {
    const matchSearch =
      !search ||
      (item.teacherName || "").toLowerCase().includes(search.toLowerCase());
    const matchDate =
      !dateFilter || item.dueDate === dateFilter;
    return matchSearch && matchDate;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentAssignmentsHomework = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div>

      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Teacher Assignment / Homework
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Homework / Assignment List
      </p>

      {/* CARD */}
      <div className="card p-3 sm:p-4">

        {/* TOP BAR */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <h3 className="text-[13px] font-medium text-gray-700">
            Assignment List
          </h3>

          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Search Teacher Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 px-2 py-[5px] text-[12px] rounded w-[170px] focus:outline-none focus:border-brand-600"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 px-2 py-[5px] text-[12px] rounded focus:outline-none focus:border-brand-600"
            />
            <select className="border border-gray-300 px-2 py-[5px] text-[12px] rounded focus:outline-none">
              <option value="">Filter</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Missed</option>
            </select>
            <select className="border border-gray-300 px-2 py-[5px] text-[12px] rounded focus:outline-none">
              <option value="">Import</option>
              <option>Export CSV</option>
              <option>Export PDF</option>
            </select>
          </div>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <p className="text-[12px] text-gray-500 py-4 text-center">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-[12px] text-red-500 py-4 text-center">
            {typeof error === "string" ? error : "Failed to load homework."}
          </p>
        )}

        {/* TABLE */}
        {!loading && (
          <div className="border border-gray-300 rounded overflow-x-auto">
            <table className="min-w-[900px] w-full text-[12px]">
              <thead className="thead-row">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">S.No.</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Teacher Id</th>
                  <th className="px-3 py-2 text-left font-medium">Teacher Name</th>
                  <th className="px-3 py-2 text-left font-medium">Title</th>
                  <th className="px-3 py-2 text-left font-medium">Subject</th>
                  <th className="px-3 py-2 text-left font-medium">Class/Sec</th>
                  <th className="px-3 py-2 text-left font-medium">Due Date</th>
                  <th className="px-3 py-2 text-left font-medium">Assign To</th>
                  <th className="px-3 py-2 text-center font-medium">Description / Attachments</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {currentAssignmentsHomework.length === 0 && !loading && (
                  <tr>
                    <td colSpan={11} className="px-3 py-4 text-center text-gray-400">
                      No homework found.
                    </td>
                  </tr>
                )}
                {currentAssignmentsHomework.map((item, i) => {
                  const status = getStatus(item.id, submissions);
                  return (
                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2">{indexOfFirst + i + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatDate(item.dueDate)}
                      </td>
                      <td className="px-3 py-2">-</td>
                      <td className="px-3 py-2">{item.teacherName || "-"}</td>
                      <td className="px-3 py-2">{item.title || "-"}</td>
                      <td className="px-3 py-2">{item.subjectName || "-"}</td>
                      <td className="px-3 py-2">{item.className || "-"}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatDate(item.dueDate)}
                      </td>
                      <td className="px-3 py-2">-</td>
                      <td className="px-3 py-2 text-center">
                        {item.attachmentUrl ? (
                          <button
                            onClick={() => openModal(item)}
                            className="text-brand-600 hover:text-brand-700 transition"
                            title="View Attachments"
                          >
                            <Paperclip size={14} />
                          </button>
                        ) : (
                          item.description ? (
                            <button
                              onClick={() => openModal(item)}
                              className="text-gray-400 hover:text-gray-600 transition"
                              title="View Description"
                            >
                              <Paperclip size={14} />
                            </button>
                          ) : null
                        )}
                      </td>
                      <td className={`px-3 py-2 font-medium ${statusColor[status] ?? ""}`}>
                        {status}
                      </td>
                    </tr>
                  );
                })}
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

      {/* ── Details / Attachments Modal ── */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[500px] bg-white rounded-md shadow-lg overflow-hidden">

            {/* Modal Header */}
            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-medium">Attachments</span>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 text-[12px]">

              <div className="mb-3">
                <p className="text-gray-500 text-[11px] mb-0.5">Comment text</p>
                <p className="font-medium text-gray-800">
                  {selected.subjectName || "-"}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-gray-500 text-[11px] mb-0.5">Details</p>
                <p className="text-gray-700 whitespace-pre-line leading-5">
                  {selected.description || "-"}
                </p>
              </div>

              {/* File attachment */}
              <div className="border rounded overflow-hidden">
                <div className="bg-gray-100 px-3 py-2 text-[11px] font-medium text-gray-600">
                  File Attachment by Name
                </div>
                <div className="p-3 space-y-1.5">
                  {selected.attachmentUrl ? (
                    <a
                      href={selected.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline cursor-pointer block"
                    >
                      {extractFilename(selected.attachmentUrl)}
                    </a>
                  ) : (
                    <p className="text-gray-400">No attachment available.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setOpen(false)}
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
