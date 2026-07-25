import React, { useState, useEffect } from "react";
import { MoreVertical, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import useToastMessage from "../../utils/useToastMessage";
import {
  getLeavesAsync,
  updateLeaveStatusAsync,
  getDepartmentsAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/Leave/leaveSlice";
import Pagination from "../../components/common/Pagination";

const statusColor = {
  APPROVED: "text-green-600",
  REJECTED: "text-red-500",
  PENDING: "text-orange-500",
};

export default function Leave() {
  const dispatch = useDispatch();

  const { leaves, departments, success, error } = useSelector((state) => state.leave);

  const statusSummary = {
    APPROVED: leaves.filter((item) => item.status === "APPROVED").length,

    PENDING: leaves.filter((item) => item.status === "PENDING").length,

    REJECTED: leaves.filter((item) => item.status === "REJECTED").length,

    onLeave: leaves.filter((item) => item.status === "APPROVED").length,
  };

  const [openMenu, setOpenMenu] = useState(null);
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLeavesAsync());
    dispatch(getDepartmentsAsync());
  }, [dispatch]);

  useToastMessage({
    success,
    error,
    successMessage: selected?.status === "REJECTED" ? "Leave rejected successfully! ✅" : "Leave approved successfully! ✅",
    clearSuccess,
    clearError,
    onSuccess: () => {
      dispatch(getLeavesAsync());
    },
  });

  const data = (leaves || []).filter((item) => {
    // Department Filter
    const departmentMatch =
      !selectedDepartment || item.roleType === selectedDepartment;

    // Date Filter
    const leaveDate = new Date(item.fromDate);

    let dateMatch = true;

    if (fromDate && toDate) {
      dateMatch =
        leaveDate >= new Date(fromDate) && leaveDate <= new Date(toDate);
    } else if (fromDate) {
      dateMatch = leaveDate >= new Date(fromDate);
    } else if (toDate) {
      dateMatch = leaveDate <= new Date(toDate);
    }

    return departmentMatch && dateMatch;
  });
  const roleMap = {
    ADM: "ROLE_ADMIN",
    TCH: "ROLE_TEACHER",
    LIB: "ROLE_LIBRARIAN",
    CLN: "ROLE_CLEANING",
    TECH: "ROLE_TECHNICAL",
  };
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLeaves = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleApprove = async (item) => {
    dispatch(
      updateLeaveStatusAsync({
        id: item.id,
        status: "APPROVED",
        comment: "-",
      }),
    );
    setOpenMenu(null);
  };

  const handleReject = (item) => {
    setSelected(item);
    setPopup(true);
    setOpenMenu(null);
  };

  const submitReject = async () => {
    dispatch(
      updateLeaveStatusAsync({
        id: selected.id,
        status: "REJECTED",
        comment,
      }),
    );
    setPopup(false);
    setComment("");
  };

  return (
    <div>
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">Leave</h2>

      <p className="text-xs sm:text-sm text-gray-500 mb-4">Teacher / Leave</p>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">
            {statusSummary?.APPROVED || 0}
          </h3>

          <p className="text-xs text-gray-600">Approved</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold">
            {statusSummary?.PENDING || 0}
          </h3>

          <p className="text-xs text-gray-600">Pending</p>
        </div>

        <div className="bg-pink-100 p-4 rounded">
          <h3 className="text-lg font-semibold">
            {statusSummary?.onLeave || 0}
          </h3>

          <p className="text-xs text-gray-600">On Leave Now</p>
        </div>
      </div>

      {/* CARD */}
      <div className="card p-3 sm:p-4">
        {/* FILTER */}
        <div className="flex flex-col lg:flex-row lg:justify-end lg:items-center gap-3 mb-4">
          {/* Department Filter */}
          <div className="min-w-[220px]">
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="
        w-full h-10
        px-3
        text-sm
        bg-white
        border border-gray-300
        rounded-lg
        shadow-sm
        outline-none
        transition-all
        focus:ring-2
        focus:ring-brand-100
        focus:border-brand-500
      "
            >
              <option value="">All Departments</option>

              {departments?.map((dept) => (
                <option key={dept.id} value={roleMap[dept.deptCode]}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center h-10 px-3 bg-white border border-gray-300 rounded-lg shadow-sm">
              <Calendar size={16} className="mr-2 text-gray-400" />

              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-sm outline-none bg-transparent"
              />
            </div>

            <span className="hidden sm:block text-sm text-gray-500 font-medium">
              To
            </span>

            <div className="flex items-center h-10 px-3 bg-white border border-gray-300 rounded-lg shadow-sm">
              <Calendar size={16} className="mr-2 text-gray-400" />

              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-sm outline-none bg-transparent"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setCurrentPage(1);
                }}
                className="
          h-10
          px-4
          text-sm
          font-medium
          text-red-600
          bg-red-50
          border border-red-200
          rounded-lg
          hover:bg-red-100
          transition
        "
              >
                Clear
              </button>
            )}
          </div>

          {/* Export */}
          <div className="min-w-[140px]">
            <select
              className="
        w-full h-10
        px-3
        text-sm
        bg-white
        border border-gray-300
        rounded-lg
        shadow-sm
        outline-none
        transition-all
        focus:ring-2
        focus:ring-brand-100
        focus:border-brand-500
      "
            >
              <option>Export</option>
              <option>Excel</option>
              <option>PDF</option>
              <option>CSV</option>
            </select>
          </div>
        </div>

        {/* MOBILE */}
        <div className="block lg:hidden space-y-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="border rounded p-3 bg-white shadow-sm relative"
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">{item.name}</h4>

                <MoreVertical
                  size={16}
                  onClick={() => setOpenMenu(openMenu === i ? null : i)}
                />
              </div>

              <div className="text-xs text-gray-600 space-y-1 mt-2">
                <p>
                  <b>ID:</b> {item.empId}
                </p>

                <p>
                  <b>Dept:</b> {item.dept}
                </p>

                <p>
                  <b>Leave:</b> {item.type}
                </p>

                <p>
                  <b>Date:</b> {item.date}
                </p>

                <p>
                  <b>Duration:</b> {item.duration}
                </p>

                <p>
                  <b>Reason:</b> {item.reason}
                </p>

                <p>
                  <b>Comment:</b> {item.comment}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span className={`font-medium ${statusColor[item.status]}`}>
                    {item.status?.charAt(0) +
                      item.status?.slice(1).toLowerCase()}
                  </span>
                </p>
              </div>

              {openMenu === i && (
                <div className="absolute right-2 top-8 bg-white border rounded shadow text-xs z-20">
                  <button
                    onClick={() => handleApprove(item)}
                    className="block px-3 py-2 text-green-600"
                  >
                    ✔ Approve
                  </button>

                  <button
                    onClick={() => handleReject(item)}
                    className="block px-3 py-2 text-red-500"
                  >
                    ✖ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-x-auto">
          <table className="min-w-[1100px] w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Emp Id</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Department</th>
                <th className="px-3 py-2 text-left">Applied Date</th>
                <th className="px-3 py-2 text-left">Leave Type</th>
                <th className="px-3 py-2 text-left">Leave Date</th>
                <th className="px-3 py-2 text-left">Duration</th>
                <th className="px-3 py-2 text-left">Reason</th>
                <th className="px-3 py-2 text-left">Comments</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentLeaves.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{indexOfFirst + i + 1}</td>

                  <td className="px-3 py-2">{item.userCode}</td>

                  <td className="px-3 py-2">{item.userName}</td>

                  <td className="px-3 py-2">
                    {item.roleType?.replace("ROLE_", "")}
                  </td>

                  <td className="px-3 py-2">{item.fromDate}</td>

                  <td className="px-3 py-2">Leave</td>

                  <td className="px-3 py-2">
                    {item.fromDate} - {item.toDate}
                  </td>

                  <td className="px-3 py-2">1</td>

                  <td className="px-3 py-2">{item.reason}</td>

                  <td className="px-3 py-2">{item.rejectionReason || "-"}</td>

                  <td
                    className={`px-3 py-2 font-medium ${
                      statusColor[item.status]
                    }`}
                  >
                    {item.status?.charAt(0) +
                      item.status?.slice(1).toLowerCase()}
                  </td>

                  <td className="px-3 py-2 relative">
                    <MoreVertical
                      size={16}
                      onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    />

                    {openMenu === i && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow text-xs z-50">
                        <button
                          onClick={() => handleApprove(item)}
                          className="block px-3 py-2 text-green-600"
                        >
                          ✔ Approve
                        </button>

                        <button
                          onClick={() => handleReject(item)}
                          className="block px-3 py-2 text-red-500"
                        >
                          ✖ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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

      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-[90%] sm:w-[380px] bg-white rounded shadow">
            <div className="bg-brand-600 text-white px-4 py-2 text-sm">
              Reject Comments
            </div>

            <div className="p-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPopup(false)}
                  className="border px-3 py-1 text-sm rounded"
                >
                  Cancel
                </button>

                <button onClick={submitReject} className="btn-primary">
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
