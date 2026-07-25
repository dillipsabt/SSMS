import React, { useState, useEffect } from "react";
import Pagination from "../../components/common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "sonner";
import useToastMessage from "../../utils/useToastMessage";
import {
  getStudentsByParentThunk,
  getStudentLeavesThunk,
  applyLeaveThunk,
  clearSuccess,
  clearError,
} from "../../features/Parent/leave/leaveSlice";

export default function ParentsLeave() {
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const parentId = localStorage.getItem("profileId");

  const [selectedStudentId, setSelectedStudentId] = useState("");

  const dispatch = useDispatch();

  const {
    students = [],
    leaves = [],
    loading,
    error,
    success,
  } = useSelector((state) => state.parentLeave);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Show toast on success/error
  // useToastMessage({
  //   success,
  //   error,
  //   successMessage: "Leave applied successfully! ✅",
  //   clearSuccess,
  //   clearError,
  //   onSuccess: () => {
  //     setLeaveForm({
  //       leaveType: "",
  //       fromDate: "",
  //       toDate: "",
  //       reason: "",
  //     });
  //     if (selectedStudentId) {
  //       dispatch(getStudentLeavesThunk(selectedStudentId));
  //     }
  //   },
  // });

  useEffect(() => {
    if (success) {
      toast.success("Leave applied successfully! ✅");

      if (selectedStudentId) {
        dispatch(getStudentLeavesThunk(selectedStudentId));
      }

      dispatch(clearSuccess());
    }
  }, [success, dispatch, selectedStudentId]);

  const [errors, setErrors] = useState({
    student: "",
    leaveType: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const leaveHistory = leaves || [];


  useEffect(() => {
    if (parentId) {
      dispatch(getStudentsByParentThunk(parentId));
    }
  }, [dispatch, parentId]);

  useEffect(() => {
    if (selectedStudentId) {
      dispatch(
        getStudentLeavesThunk(selectedStudentId)
      );
    }
  }, [dispatch, selectedStudentId]);


  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECT":
      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLeaves = leaveHistory.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(leaveHistory.length / rowsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm({ ...leaveForm, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    // Student Validation
    if (!selectedStudentId) {
      newErrors.student = "Please select a student";
    }

    // Leave Type Validation
    if (!leaveForm.leaveType) {
      newErrors.leaveType = "Please select leave type";
    }

    // Reason Validation
    if (!leaveForm.reason.trim()) {
      newErrors.reason = "Reason is required";
    } else if (leaveForm.reason.trim().length < 5) {
      newErrors.reason = "Reason should be at least 5 characters";
    }

    // From Date Validation
    if (!leaveForm.fromDate) {
      newErrors.fromDate = "Please select from date";
    }

    // To Date Validation
    if (!leaveForm.toDate) {
      newErrors.toDate = "Please select to date";
    }

    // Date Comparison
    if (
      leaveForm.fromDate &&
      leaveForm.toDate &&
      new Date(leaveForm.toDate) < new Date(leaveForm.fromDate)
    ) {
      newErrors.toDate = "To Date cannot be earlier than From Date";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleApplyLeave = async () => {
    // Student Validation
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }

    // Leave Type Validation
    if (!leaveForm.leaveType) {
      toast.error("Please select leave type");
      return;
    }

    // Reason Validation
    if (!leaveForm.reason.trim()) {
      toast.error("Please enter reason for leave");
      return;
    }

    if (leaveForm.reason.trim().length < 5) {
      toast.error("Reason should contain at least 5 characters");
      return;
    }

    // From Date Validation
    if (!leaveForm.fromDate) {
      toast.error("Please select from date");
      return;
    }

    // To Date Validation
    if (!leaveForm.toDate) {
      toast.error("Please select to date");
      return;
    }

    // Date Comparison Validation
    if (
      new Date(leaveForm.toDate) <
      new Date(leaveForm.fromDate)
    ) {
      toast.error("To Date cannot be earlier than From Date");
      return;
    }

    const payload = {
      studentId: Number(selectedStudentId),
      fromDate: leaveForm.fromDate,
      toDate: leaveForm.toDate,
      leaveType: leaveForm.leaveType,
      reason: leaveForm.reason,
    };

    // Dispatch without try/catch - let Redux/useToastMessage handle errors
    dispatch(applyLeaveThunk(payload));

    // Reset form immediately
    setLeaveForm({
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    setSelectedStudentId("");
  };

  const getDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);

    return (
      Math.floor(
        (end - start) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const selectStyles = {
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
  };

  return (
    <div className="w-full px-2 sm:px-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Leave</h2>
      <p className="text-sm text-gray-500 mb-2">Home / Attendance / Leave</p>

      {/* APPLY LEAVE SECTION */}
      <div className="card overflow-hidden mb-4">

        {/* Header */}
        <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Apply Leave
          </h3>
        </div>

        <div className="p-4 sm:p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
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
                      (option) =>
                        option.value === Number(selectedStudentId)
                    ) || null
                }
                onChange={(selected) =>
                  setSelectedStudentId(selected?.value || "")
                }
                placeholder="Select Student"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={selectStyles}
              />
            </div>
            <div>
              <label className="form-label">Leave Type <span className="text-red-500">*</span></label>
              <Select
                options={[
                  {
                    value: "Medical Leave",
                    label: "Medical Leave",
                  },
                  {
                    value: "Casual Leave",
                    label: "Casual Leave",
                  },
                  {
                    value: "Special Leave",
                    label: "Special Leave",
                  },
                  {
                    value: "Emergency Leave",
                    label: "Emergency Leave",
                  },
                ]}
                value={
                  leaveForm.leaveType
                    ? {
                      value: leaveForm.leaveType,
                      label: leaveForm.leaveType,
                    }
                    : null
                }
                onChange={(selected) =>
                  setLeaveForm({
                    ...leaveForm,
                    leaveType: selected?.value || "",
                  })
                }
                placeholder="Select Leave Type"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={selectStyles}
              />
            </div>
            <div>
              <label className="form-label">Reason for Leave <span className="text-red-500">*</span></label>
              <input type="text" name="reason" value={leaveForm.reason} onChange={handleInputChange} placeholder="Enter reason" className="form-input" />
            </div>
            <div>
              <label className="form-label">From Date <span className="text-red-500">*</span></label>
              <input type="date" name="fromDate" value={leaveForm.fromDate} onChange={handleInputChange} className="
w-full
border
border-gray-300
rounded-lg
px-3
py-2
text-sm
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-indigo-500
" />
            </div>
            <div>
              <label className="form-label">To Date <span className="text-red-500">*</span></label>
              <input type="date" name="toDate" value={leaveForm.toDate} onChange={handleInputChange} className="
w-full
border
border-gray-300
rounded-lg
px-3
py-2
text-sm
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-indigo-500
" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleApplyLeave}
              className="
    w-full sm:w-auto
    bg-indigo-600 hover:bg-indigo-700
    text-white
    px-6 py-2.5
    rounded-lg
    font-medium transition
  "
            >
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* LEAVE HISTORY */}
      <div className="card overflow-hidden">

        <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Leave History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">S.No.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Apply Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Leave Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Leave Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Leave Duration</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reason for Leave</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reject Comments</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaves.length > 0 ? (
                currentLeaves.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirst + i + 1}
                    </td>

                    <td className="px-4 py-3">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-3">
                      {row.leaveType}
                    </td>

                    <td className="px-4 py-3">
                      {row.fromDate} - {row.toDate}
                    </td>

                    <td className="px-4 py-3">
                      {getDuration(row.fromDate, row.toDate)} Day(s)
                    </td>

                    <td className="px-4 py-3">
                      {row.reason}
                    </td>

                    <td className="px-4 py-3">
                      {row.rejectComments || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`
    inline-flex items-center px-3 py-1 rounded-full
    text-xs font-semibold
    ${getStatusColor(row.status)}
  `}
                      >
                        {row.status?.charAt(0).toUpperCase() +
                          row.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No leave records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
