import React from "react";
import { CalendarCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeavesByTeacherId,
  applyLeave,
} from "../../features/teacher/leaves/teacherLeaveSlice";
import Pagination from "../../components/common/Pagination";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TeacherLeave() {
  const dispatch = useDispatch();
  const { teacherLeaves, loading, error } = useSelector(
    (state) => state.teacherLeaves,
  );
  //const userId = useSelector((state) => state.auth.user?.userId);
  const userId = 1;
  useEffect(() => {
    if (userId) {
      dispatch(fetchLeavesByTeacherId(userId));
    }
  }, [dispatch, userId]);

  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromFilterDate, setFromFilterDate] = useState("");
  const [toFilterDate, setToFilterDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [form, setForm] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.type) return toast.error("Leave type is required");
    if (!form.fromDate) return toast.error("From date is required");
    if (!form.toDate) return toast.error("To date is required");

    if (new Date(form.toDate) < new Date(form.fromDate)) {
      return toast.error("To date cannot be before from date");
    }

    if (!form.reason) return toast.error("Reason is required");

    try {
      const res = await dispatch(
        applyLeave({
          userId,
          leaveType: form.type,
          fromDate: form.fromDate,
          toDate: form.toDate,
          reason: form.reason,
        }),
      );

      if (res?.meta?.requestStatus === "fulfilled") {
        toast.success("Leave applied successfully ✅");
        setOpenModal(false);
        dispatch(fetchLeavesByTeacherId(userId));
      } else {
        toast.error(res?.payload?.message || "Failed to apply leave");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to apply leave");
    }

    setForm({
      type: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });
  };
  const filteredLeaves = (teacherLeaves || []).filter((leave) => {
    const leaveDate = new Date(leave.fromDate);

    let dateMatch = true;

    if (fromDate && toDate) {
      dateMatch =
        leaveDate >= new Date(fromDate) && leaveDate <= new Date(toDate);
    } else if (fromDate) {
      dateMatch = leaveDate >= new Date(fromDate);
    } else if (toDate) {
      dateMatch = leaveDate <= new Date(toDate);
    }

    return dateMatch;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredLeaves.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-white px-6 py-4">
      {/* Header */}
      <h1 className="text-lg font-semibold text-gray-800">Leave</h1>
      <p className="text-sm text-gray-400 mb-4">Teacher / Leave</p>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg ">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 p-3">
          <p className="text-md font-semibold text-gray-700">Leave</p>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-lg shadow-md"
          >
            <CalendarCheck size={18} />
            Apply Leave
          </button>
        </div>


        {/* Filters */}
        <div className="flex justify-end mb-3 px-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-auto flex items-center border border-gray-300 rounded px-2 py-1">
              <DatePicker
                selected={fromDate ? new Date(fromDate) : null}
                onChange={(date) => {
                  setFromDate(date ? date.toISOString().split("T")[0] : "");
                  setCurrentPage(1);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="From Date"
                className="w-full sm:w-[140px] text-sm outline-none"
                wrapperClassName="w-full sm:w-auto"
              />
            </div>

            <span className="hidden sm:block text-sm">To</span>

            <div className="w-full sm:w-auto flex items-center border border-gray-300 rounded px-2 py-1">
              <DatePicker
                selected={toDate ? new Date(toDate) : null}
                onChange={(date) => {
                  setToDate(date ? date.toISOString().split("T")[0] : "");
                  setCurrentPage(1);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="To Date"
                className="w-full sm:w-[140px] text-sm outline-none"
                wrapperClassName="w-full sm:w-auto"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs bg-gray-100 rounded"
              >
                Reset
              </button>
            )}
          </div>

          {/* <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
            <option>Export</option>
            <option>PDF</option>
            <option>Excel</option>
          </select> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-3">
          <table className="w-full rounded-md overflow-hidden border border-gray-200">
            <thead className="bg-blue-100 text-sm text-gray-600 ">
              <tr className="border-b border-gray-200">
                <th className="p-2 text-left">S.No.</th>
                <th className="p-2 text-left">Apply Date</th>
                <th className="p-2 text-left">Leave Type</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Leave Duration</th>
                <th className="p-2 text-left">Reason for Leave</th>
                <th className="p-2 text-left">Reject Comments</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {currentLeaves.length > 0 ? (
                currentLeaves.map((row, i) => (
                  <tr className="border-b border-gray-200 " key={row.id}>
                    <td className="px-3 py-2">{indexOfFirst + i + 1}</td>
                    <td className="px-3 py-2">{row.fromDate}</td>
                    <td className="px-3 py-2">-</td>
                    <td className="px-3 py-2">
                      {row.fromDate} - {row.toDate}
                    </td>
                    <td className="px-3 py-2">-</td>
                    <td className="px-3 py-2">{row.reason}</td>
                    <td className="px-3 py-2">{row.rejectionReason || "-"}</td>
                    <td>
                      <span
                        className={
                          row.status === "APPROVED"
                            ? "text-green-600"
                            : row.status === "REJECTED"
                              ? "text-red-500"
                              : "text-orange-500"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No leaves found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="w-[420px] bg-white rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center">
              <h2 className="text-white font-semibold text-base">
                Apply Leave
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition"
              >
                <span className="text-white text-lg mb-0.5">×</span>
              </button>
            </div>

            {/* FORM */}
            <div className="p-4 space-y-3 text-sm">
              {/* Leave Type */}
              <div>
                <label className="block mb-1">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <Select
                  options={[
                    { value: "Medical", label: "Medical" },
                    { value: "Casual", label: "Casual" },
                  ]}
                  value={
                    form.type
                      ? { value: form.type, label: form.type }
                      : null
                  }
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      type: selected?.value || "",
                    })
                  }
                  placeholder="Select Leave Type"
                />
              </div>

              {/* From Date */}
              <div>
                <label className="block mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={form.fromDate ? new Date(form.fromDate) : null}
                  onChange={(date) =>
                    setForm({
                      ...form,
                      fromDate: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="From Date"
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                  wrapperClassName="w-full sm:w-auto"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <DatePicker
                    selected={form.toDate ? new Date(form.toDate) : null}
                    onChange={(date) =>
                      setForm({
                        ...form,
                        toDate: date ? date.toISOString().split("T")[0] : "",
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText="To Date"
                    className="w-full border border-gray-200 rounded-md px-3 py-2"
                    wrapperClassName="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block mb-1">Reason For Leave</label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Write here"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 h-20 resize-none"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-1.5 border border-red-500 text-red-500 rounded-md"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-md shadow"
                >
                  Submit Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
