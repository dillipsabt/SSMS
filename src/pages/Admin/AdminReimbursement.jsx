import React, { useState, useEffect } from "react";
import { MoreVertical, Calendar, X } from "lucide-react";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import {
  getReimbursementsAsync,
  updateReimbursementStatusAsync,
} from "../../features/Admin/Reimbursements/reimbursementSlice";
import Pagination from "../../components/common/Pagination";

const statusColor = {
  Approved: "text-green-600",
  Pending: "text-yellow-500",
  Reject: "text-red-500",
};

const extractFilename = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const raw = pathname.split("/").pop();

    const parts = raw.split("_");

    return parts.length > 1 ? parts.slice(1).join("_") : raw;
  } catch {
    return url;
  }
};

export default function Reimbursement() {
  const dispatch = useDispatch();
  const { data: reduxData } = useSelector((state) => state.reimbursement);

  const [data, setData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [attachmentPopup, setAttachmentPopup] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getReimbursementsAsync());
  }, []);

  const openAttachmentModal = (item) => {
    setSelectedAttachment(item);
    setAttachmentPopup(true);
  };

  useEffect(() => {
    if (reduxData?.length) {
      const formatted = reduxData.map((item) => {
        const rawStatus = item.status
          ? item.status.trim().toLowerCase()
          : "pending";

        let normalizedStatus = "Pending";

        if (rawStatus === "approved") {
          normalizedStatus = "Approved";
        } else if (rawStatus === "reject" || rawStatus === "rejected") {
          normalizedStatus = "Reject";
        } else if (rawStatus === "pending") {
          normalizedStatus = "Pending";
        }

        return {
          id: item.id || item.reimbursementId,
          employeeCode: item.employeeCode || item.empId || "-",
          employeeName: item.employeeName || item.empName || "-",
          expenseName: item.expenseName,
          expenseType: item.expenseType,
          appliedDate: item.appliedDate,
          description: item.description,
          attachment: item.expenseBillPath || "file.pdf",
          status: normalizedStatus,
          comment: item.comment || "-",
        };
      });

      setData(formatted);
    }
  }, [reduxData]);

  /* ✅ APPROVE */
  const handleApprove = async (item) => {
    try {
      const res = await dispatch(
        updateReimbursementStatusAsync({
          id: item.id,
          payload: {
            expenseName: item.expenseName,
            expenseType: item.expenseType,
            description: item.description,
            appliedDate: item.appliedDate,
            employeeCode: item.employeeCode,
            employeeName: item.employeeName,
            status: "Approved",
            comment: "",
          },
        }),
      );

      if (res?.meta?.requestStatus === "fulfilled") {
        setData((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, status: "Approved" } : d)),
        );
        toast.success("Reimbursement approved successfully! ✅");
      } else {
        toast.error(res?.payload?.message || "Failed to approve reimbursement");
      }

      setOpenMenu(null);
    } catch (err) {
      const errorMessage = typeof err === "string" ? err : err?.message || "Failed to approve";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  const handleReject = (item) => {
    setSelected(item);
    setPopup(true);
    setOpenMenu(null);
  };

  const submitReject = async () => {
    if (!comment) return toast.error("Comment required");

    try {
      const res = await dispatch(
        updateReimbursementStatusAsync({
          id: selected.id,
          payload: {
            expenseName: selected.expenseName,
            expenseType: selected.expenseType,
            description: selected.description,
            appliedDate: selected.appliedDate,
            employeeCode: selected.employeeCode,
            employeeName: selected.employeeName,
            status: "Reject",
            comment,
          },
        }),
      );

      if (res?.meta?.requestStatus === "fulfilled") {
        setData((prev) =>
          prev.map((d) =>
            d.id === selected.id ? { ...d, status: "Reject", comment } : d,
          ),
        );
        toast.success("Reimbursement rejected successfully! ✅");
      } else {
        toast.error(res?.payload?.message || "Failed to reject reimbursement");
      }

      setPopup(false);
      setComment("");
    } catch (err) {
      const errorMessage = typeof err === "string" ? err : err?.message || "Failed to reject";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  const filteredData = data.filter((item) => {
    // STATUS FILTER
    const matchesStatus =
      statusFilter === "All" ? true : item.status === statusFilter;

    // DATE FILTER
    const matchesDate = selectedDate ? item.appliedDate === selectedDate : true;

    return matchesStatus && matchesDate;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div>
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Reimbursement
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Teacher / Reimbursement
      </p>

      {/* CARD */}
      <div className="card p-3 sm:p-4">
        {/* FILTERS */}
        {/* FILTERS */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-3 mb-5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          {/* DATE FILTER */}
          <div className="relative min-w-[220px]">
            <div className="flex items-center h-10 border border-gray-300 rounded-lg px-3 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <Calendar size={16} className="text-gray-400 mr-2" />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-gray-700"
              />
            </div>
          </div>

          {/* STATUS FILTER */}
          <div className="min-w-[180px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Reject">Rejected</option>
            </select>
          </div>

          {/* CLEAR BUTTON */}
          {(selectedDate || statusFilter !== "All") && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedDate("");
                  setStatusFilter("All");
                }}
                className="h-10 px-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* ✅ DESKTOP TABLE */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Emp Id</th>
                <th className="px-3 py-2 text-left">Emp Name</th>
                <th className="px-3 py-2 text-left">Expense</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">File</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No Reimbursements Found
                  </td>
                </tr>
              ) : (
                currentData.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{item.employeeCode}</td>
                    <td className="px-3 py-2">{item.employeeName}</td>
                    <td className="px-3 py-2">{item.expenseName}</td>
                    <td className="px-3 py-2">{item.expenseType}</td>
                    <td className="px-3 py-2">{item.appliedDate}</td>
                    <td className="px-3 py-2">{item.description}</td>

                    <td className="px-3 py-2">
                      {item.attachment ? (
                        <button
                          onClick={() => openAttachmentModal(item)}
                          className="text-brand-600 underline cursor-pointer"
                        >
                          View File
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td
                      className={`px-3 py-2 font-medium ${
                        item.status === "Approved"
                          ? "text-green-600"
                          : item.status === "Reject"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {item.status}
                    </td>

                    <td className="px-3 py-2 relative">
                      <MoreVertical
                        size={16}
                        className="cursor-pointer"
                        onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setMenuPos({ top: rect.bottom + 5, left: rect.left - 80 });
                        setOpenMenu(openMenu === i ? null : i);
                      }}
                      />

                      {openMenu === i && (
                        <div
                          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
                          className="w-28 bg-white border rounded shadow text-xs z-50"
                        >
                          <button
                            onClick={() => handleApprove(item)}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-green-600"
                          >
                            ✔ Approve
                          </button>

                          <button
                            onClick={() => handleReject(item)}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
                          >
                            ✖ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-3">
          {currentData.length === 0 ? (
            <p className="text-center text-gray-500">No Reimbursements Found</p>
          ) : (
            currentData.map((item, i) => (
              <div key={i} className="border rounded p-3 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{item.employeeName}</h3>
                    <p className="text-xs text-gray-500">{item.employeeCode}</p>
                  </div>

                  <div className="relative">
                    <MoreVertical
                      size={16}
                      onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setMenuPos({ top: rect.bottom + 5, left: rect.left - 80 });
                        setOpenMenu(openMenu === i ? null : i);
                      }}
                    />

                    {openMenu === i && (
                      <div
                          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
                          className="w-28 bg-white border rounded shadow text-xs z-50"
                        >
                        <button
                          onClick={() => handleApprove(item)}
                          className="block w-full text-left px-3 py-2 text-green-600"
                        >
                          ✔ Approve
                        </button>

                        <button
                          onClick={() => handleReject(item)}
                          className="block w-full text-left px-3 py-2 text-red-500"
                        >
                          ✖ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs space-y-1">
                  <p>
                    <b>Expense:</b> {item.expenseName}
                  </p>
                  <p>
                    <b>Type:</b> {item.expenseType}
                  </p>
                  <p>
                    <b>Date:</b> {item.appliedDate}
                  </p>
                  <p>
                    <b>Description:</b> {item.description}
                  </p>

                  <p className="text-brand-600 underline cursor-pointer">
                    {item.attachment ? (
                      <button
                        onClick={() => openAttachmentModal(item)}
                        className="text-brand-600 underline cursor-pointer text-xs"
                      >
                        View File
                      </button>
                    ) : (
                      "-"
                    )}
                  </p>

                  <span
                    className={`px-3 py-2 font-medium ${
                      item.status === "Approved"
                        ? "text-green-600"
                        : item.status === "Reject"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
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

      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[90%] sm:w-[380px] bg-white rounded shadow-lg">
            <div className="bg-brand-600 text-white px-4 py-2 text-sm flex justify-between">
              Reject Comments
              <span onClick={() => setPopup(false)}>✖</span>
            </div>

            <div className="p-4">
              <textarea
                rows="3"
                placeholder="Write here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPopup(false)}
                  className="border px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReject}
                  className="bg-brand-600 text-white px-4 py-1 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Attachment Modal ── */}
      {attachmentPopup && selectedAttachment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[500px] bg-white rounded-md shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-medium">Attachment Details</span>

              <button
                onClick={() => setAttachmentPopup(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 text-[12px]">
              <div className="mb-3">
                <p className="text-gray-500 text-[11px] mb-1">Expense Name</p>

                <p className="font-medium text-gray-800">
                  {selectedAttachment.expenseName || "-"}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-gray-500 text-[11px] mb-1">Description</p>

                <p className="text-gray-700 whitespace-pre-line leading-5">
                  {selectedAttachment.description || "-"}
                </p>
              </div>

              {/* File Attachment */}
              <div className="border rounded overflow-hidden">
                <div className="bg-gray-100 px-3 py-2 text-[11px] font-medium text-gray-600">
                  File Attachment
                </div>

                <div className="p-3">
                  {selectedAttachment.attachment ? (
                    <a
                      href={selectedAttachment.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline break-all"
                    >
                      {extractFilename(selectedAttachment.attachment)}
                    </a>
                  ) : (
                    <p className="text-gray-400">No attachment available.</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setAttachmentPopup(false)}
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
