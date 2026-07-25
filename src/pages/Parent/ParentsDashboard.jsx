import React, { useEffect, useState } from "react";
import { ChevronRight, FileText, AlertCircle, CalendarDays, CalendarClock, } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import boy from "../../assets/boy.png";
import girl from "../../assets/girl.png";
import { fetchParentStudents, fetchParentDashboard, setSelectedStudent, clearSuccess, clearError } from "../../features/parent/Dashboard/parentDashboardSlice";

export default function ParentsDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const periodOptions = [
    { value: "This Month", label: "This Month" },
    { value: "Last Month", label: "Last Month" },
    { value: "This Year", label: "This Year" },
  ];

  const dashboardState = useSelector((state) => state.parentDashboard) || {};
  const {
    students = [],
    selectedStudentId = null,
    studentProfile = null,
    performance = null,
    upcomingEvents = [],
    attendance = null,
    dailyClasses = [],
    leaveStatus = [],
    feesReminder = null,
    assignments = [],
    examResults = [],
    noticeBoard = [],
    loading = false,
  } = dashboardState;

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchParentStudents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStudentId) {
      dispatch(fetchParentDashboard({ studentId: selectedStudentId }));
    }
  }, [selectedStudentId, dispatch]);

  const handleStudentChange = (e) => {
    const studentId = parseInt(e.target.value);
    dispatch(setSelectedStudent(studentId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const formatTime = (timeObj) => {
    if (!timeObj) return "";
    if (typeof timeObj === "string") return timeObj;
    const hour = String(timeObj.hour).padStart(2, "0");
    const minute = String(timeObj.minute).padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const defaultProfileImage =
    studentProfile?.gender?.toLowerCase() === "female"
      ? girl
      : boy;

  return (
    <div className="w-full px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Home / Dashboard</p>
        </div>
        <Select
          options={(students || []).map(student => ({
            value: student.id,
            label: student.fullName || student.name,
          }))}
          value={
            (students || [])
              .map(student => ({
                value: student.id,
                label: student.fullName || student.name,
              }))
              .find(s => s.value === selectedStudentId)
          }
          onChange={(selected) =>
            dispatch(setSelectedStudent(selected?.value))
          }
          placeholder="Select Student"
          className="w-full sm:w-64"
          classNamePrefix="react-select"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">

          {/* STUDENT CARD */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-start justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <img
                  src={studentProfile?.photoUrl || defaultProfileImage}
                  alt={studentProfile?.fullName || "Student"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultProfileImage;
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium opacity-90">{studentProfile?.studentCode || "N/A"}</p>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold break-words truncate sm:whitespace-normal">
                    {studentProfile?.fullName || "Student Name"}</h3>
                  <p className="text-sm">{studentProfile?.className || "Class"} - {studentProfile?.section || "Section"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Performance */}
          <div className="card overflow-hidden">

            {/* Header */}
            <div className="h-[50px] flex items-center justify-between px-4 border-b border-gray-300">
              <h3 className="text-[16px] font-semibold text-[#333333]">
                Statistics Performance
              </h3>

              <Select
                options={periodOptions}
                value={periodOptions.find(
                  (option) => option.value === selectedPeriod
                )}
                onChange={(selected) =>
                  setSelectedPeriod(selected?.value)
                }
                className="w-50"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            {/* Body */}
            <div className="p-2">

              <div className="h-44 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
                {performance?.monthlyScores &&
                  performance.monthlyScores.length > 0 ? (
                  <div className="text-center w-full">
                    <p className="w-30 text-gray-600 mb-4">
                      Monthly Performance
                    </p>

                    <div className="space-y-2">
                      {performance.monthlyScores.map((score, i) => (
                        <div
                          key={i}
                          className="text-sm text-gray-700"
                        >
                          {score.month} {score.year}:{" "}
                          {score.percentage}%
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No performance data available
                  </p>
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Average Score:{" "}
                  <span className="font-bold text-lg">
                    {performance?.averageScore || 0}%
                  </span>
                </p>
              </div>

            </div>

          </div>

          {/* ATTENDANCE & CLASSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ATTENDANCE */}
            <div className="card overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
                <h3 className="text-[16px] font-semibold text-[#333333]">
                  Attendance
                </h3>

                <span className="text-sm text-gray-600">
                  {attendance?.month && attendance?.year
                    ? new Date(
                      attendance.year,
                      attendance.month - 1
                    ).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })
                    : "This Month"}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">

                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray={`${(attendance?.absentDays || 0) * 3.14
                          } 314`}
                        opacity="0.7"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="8"
                        strokeDasharray={`${(attendance?.presentDays || 0) * 3.14
                          } 314`}
                        strokeDashoffset={`-${(attendance?.absentDays || 0) * 3.14
                          }`}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-gray-800">
                        {attendance?.attendancePercentage || 0}%
                      </p>

                      <p className="text-xs text-gray-600">
                        Attendance
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">
                      Present
                    </p>

                    <p className="text-xl font-bold text-gray-800">
                      {attendance?.presentDays || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Absent
                    </p>

                    <p className="text-xl font-bold text-gray-800">
                      {attendance?.absentDays || 0}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No. of total working days{" "}
                  {attendance?.totalWorkingDays || 0} Days
                </p>

              </div>
            </div>
            {/* DAILY CLASSES */}
            <div className="card overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
                <h3 className="text-[16px] font-semibold text-[#333333]">
                  Daily Classes
                </h3>

                <span className="text-sm text-gray-600">
                  {dailyClasses[0]?.classDate
                    ? formatDate(dailyClasses[0].classDate)
                    : new Date().toLocaleDateString("en-IN")}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="space-y-3">
                  {dailyClasses && dailyClasses.length > 0 ? (
                    dailyClasses.map((cls, i) => (
                      <div
                        key={i}
                        className="py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {cls.subjectName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {formatTime(cls.startTime)} -{" "}
                          {formatTime(cls.endTime)}
                        </p>

                        {cls.teacherName && (
                          <p className="text-xs text-gray-400 mt-1">
                            {cls.teacherName}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* HOMEWORK/ASSIGNMENT */}
          <div className="card overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Homework / Assignment</h3>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>

            <div className="space-y-3">
              {assignments && assignments.length > 0 ? (
                assignments.map((hw, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{hw.title}</p>
                      <p className="text-xs text-gray-500">{hw.subjectName} - Due: {formatDate(hw.dueDate)}</p>
                    </div>
                    {!hw.isSubmitted && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">{hw.attachmentCount || 0}+</span>}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No assignments available</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">

          {/* ACTION BUTTONS */}
          <div className="card">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition border-b border-gray-200">
              <FileText size={20} className="text-blue-600" />
              <span className="font-medium text-gray-800">Apply for Leave</span>
              <ChevronRight size={16} className="ml-auto text-gray-400" />
            </button>
            <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition">
              <AlertCircle size={20} className="text-orange-600" />
              <span className="font-medium text-gray-800">Raise a Request</span>
              <ChevronRight size={16} className="ml-auto text-gray-400" />
            </button>
          </div>

          {/* UPCOMING EVENTS */}
          <div className="card overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
              <h3 className="text-[16px] font-semibold text-[#333333]">
                Upcoming Events
              </h3>

              <button onClick={() => navigate("/parent/upcoming-events-view")} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View All
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">

              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event, i) => {
                  const plainText =
                    event.description?.replace(/<[^>]*>/g, "") || "";

                  return (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100 hover:shadow-sm transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CalendarDays
                          size={18}
                          strokeWidth={2.2}
                          className="text-[#5A42F3]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-800">
                          {event.title}
                        </p>

                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {plainText}
                        </p>

                        <p className="text-xs text-gray-600 mt-2">
                          {formatDate(event.eventDate)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No upcoming events
                </div>
              )}

            </div>
          </div>

          {/* NOTICE BOARD */}
          <div className="card overflow-hidden">

            <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
              <h3 className="text-[16px] font-semibold text-[#333333]">
                Notice Board
              </h3>

              <button onClick={() =>
                navigate("/parent/notice-board-view")
              } className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View All
              </button>
            </div>

            <div className="p-4 space-y-4">

              {noticeBoard?.length > 0 ? (
                noticeBoard.map((notice, i) => {
                  const plainText =
                    notice.description?.replace(/<[^>]*>/g, "") || "";

                  return (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100 hover:shadow-sm transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <CalendarClock
                          size={22}
                          strokeWidth={2.5}
                          className="text-[#B11CEA]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-800">
                          {notice.title}
                        </p>

                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {plainText}
                        </p>

                        <p className="text-xs text-gray-600 mt-2">
                          {formatDate(notice.publishDate)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No notices available
                </div>
              )}

            </div>
          </div>

          {/* LEAVE STATUS */}
          <div className="card overflow-hidden">

            <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
              <h3 className="text-[16px] font-semibold text-[#333333]">
                Leave Status
              </h3>

              <Select
                options={periodOptions}
                value={periodOptions.find(
                  option => option.value === selectedPeriod
                )}
                onChange={(selected) =>
                  setSelectedPeriod(selected?.value)
                }
                className="w-40"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            <div className="p-4 space-y-3">

              {leaveStatus?.length > 0 ? (
                leaveStatus.map((leave, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {leave.leaveType}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Leave Request
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${leave.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : leave.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No leave requests
                </div>
              )}

            </div>
          </div>

          {/* FEES REMINDER */}
          {feesReminder && (
            <div className="card overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
                <h3 className="text-[16px] font-semibold text-[#333333]">
                  Fees Reminder
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${feesReminder.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {feesReminder.paymentStatus}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">

                <div className="flex gap-4 items-start">

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={22} className="text-blue-600" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-gray-800 text-sm">
                      {feesReminder.feeType}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {feesReminder.month}
                    </p>

                    <p className="text-sm text-gray-600 mt-3">
                      Due Date:{" "}
                      <span className="font-medium">
                        {formatDate(feesReminder.dueDate)}
                      </span>
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-3">
                      ₹ {feesReminder.amount}
                    </p>

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXAM RESULTS */}
      <div className="mt-6 card overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">

          <h3 className="text-[16px] font-semibold text-[#333333]">
            Exam Results
          </h3>

          <button className="text-[13px] font-medium text-indigo-600 hover:text-indigo-700">
            View All
          </button>

        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">

          <div className="overflow-x-auto">

            <table className="min-w-[700px] w-full text-sm">

              <thead>
                <tr className="bg-indigo-50 border-b border-gray-200">

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    S.No.
                  </th>

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    Exam Type
                  </th>

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    Subject
                  </th>

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    Marks
                  </th>

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    Percentage (%)
                  </th>

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    Grade
                  </th>

                  <th className="text-left px-3 py-3 font-semibold text-gray-700">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {examResults?.length > 0 ? (
                  examResults.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      <td className="px-3 py-3">
                        {i + 1}
                      </td>

                      <td className="px-3 py-3">
                        {row.examName}
                      </td>

                      <td className="px-3 py-3">
                        {row.subjectName}
                      </td>

                      <td className="px-3 py-3">
                        {row.obtainedMarks}/{row.totalMarks}
                      </td>

                      <td className="px-3 py-3">
                        {row.percentage}%
                      </td>

                      <td className="px-3 py-3">
                        {row.grade}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "PASS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center text-gray-500"
                    >
                      No exam results available
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}
