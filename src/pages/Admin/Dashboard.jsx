import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardData,
  updateLeaveRequestStatus,
  fetchClasses,
  fetchClassPerformance,
  fetchAttendance,
  clearSuccess,
  clearError,
} from "../../features/Admin/Dashboard/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData, classPerformance, attendanceData, classes, loading, error, successMessage } = useSelector(
    (state) => state.dashboard
  );

  const [activeLeaveTab, setActiveLeaveTab] = useState("STUDENTS");
  const [attendanceTab, setAttendanceTab] = useState("STUDENTS");
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedAttendance, setExpandedAttendance] = useState(false);

  const profileName = useSelector((state) => state.auth.userName) || "Admin";

  useEffect(() => {
    const today = new Date();

    setSelectedDate(today);
  }, []);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      const defaultClassId = classes[0].id || classes[0].classCode;
      setSelectedClass(defaultClassId);
      dispatch(fetchClassPerformance(defaultClassId));
    }
  }, [classes, selectedClass, dispatch]);

  // Fetch class performance when selected class changes
  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchClassPerformance(selectedClass));
    }
  }, [selectedClass, dispatch]);

  // Fetch attendance data when tab changes
  useEffect(() => {
    const tabMap = {
      STUDENTS: "STUDENT",
      TEACHERS: "TEACHER",
      STAFF: "STAFF",
    };
    dispatch(fetchAttendance({ tab: tabMap[attendanceTab], breakdownType: "TODAY" }));
  }, [attendanceTab, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Attendance data mapping from Redux
  const attendanceDataMap = {
    STUDENTS: attendanceData?.STUDENT,
    TEACHERS: attendanceData?.TEACHER,
    STAFF: attendanceData?.STAFF,
  };

  const currentAttendance = attendanceDataMap[attendanceTab];

  const attendanceChartData = [
    { name: "Present", value: currentAttendance?.present || 0, color: "#10B981" },
    { name: "Absent", value: currentAttendance?.absent || 0, color: "#DC2626" },
    { name: "Half Day", value: currentAttendance?.halfDay || 0, color: "#F97316" },
    { name: "Late", value: currentAttendance?.late || 0, color: "#3B82F6" },
  ];

  // Class performance data from Redux
  const classPerformanceData = [
    {
      name: "Top Students",
      value: classPerformance?.topStudents || 45,
      color: "#818CF8",
    },
    {
      name: "Average Students",
      value: classPerformance?.averageStudents || 11,
      color: "#10B981",
    },
    {
      name: "Below Average Students",
      value: classPerformance?.belowAverageStudents || 2,
      color: "#EC4899",
    },
  ];

  // Fees data
  const feesChartData = [
    {
      value: dashboardData?.feesOverview?.totalFeesReceived || 0,
      color: "#818CF8",
    },
    {
      value: dashboardData?.feesOverview?.totalOutstanding || 0,
      color: "#D1D5DB",
    },
  ];

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();

  const isToday = (day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (day) => {
    if (!selectedDate || !day) return false;

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const monthYear = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";

    return Math.round(Number(num)).toLocaleString("en-IN");
  };

  const getClassLabel = (classId) => {
    if (!classId) return "Select Class";
    const classObj = classes.find((c) => c.id === classId || c.classCode === classId);
    return classObj?.classCode || classId;
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 dashboard-container">
      {/* Success Toast */}
      {successMessage && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <p className="text-xs sm:text-sm font-medium">{successMessage}</p>
          <button
            onClick={() => dispatch(clearSuccess())}
            className="font-bold text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="text-xs sm:text-sm font-medium">{error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="font-bold text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 p-4 sm:p-6 text-white dashboard-welcome">
        <h1 className="mb-1 text-lg sm:text-2xl font-bold">Welcome Back, {profileName}</h1>
        <p className="text-purple-100 text-xs sm:text-sm">Have a Good day at work</p>
      </div>

      {/* Stats Cards - 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stats-grid-4">
        {/* Total Students */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm stats-card">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Total Students</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-800">
                {dashboardData?.studentsOverview?.total || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Active: {dashboardData?.studentsOverview?.active || 0} Leaves:{" "}
                {dashboardData?.studentsOverview?.leaves || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm stats-card">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Total Teachers</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-800">
                {dashboardData?.teachersOverview?.total || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Active: {dashboardData?.teachersOverview?.active || 0} Leaves:{" "}
                {dashboardData?.teachersOverview?.leaves || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Staff */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm stats-card">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.488M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 10-20 0v2h2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Total Staff</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-800">
                {dashboardData?.staffOverview?.total || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Active: {dashboardData?.staffOverview?.active || 0} Leaves:{" "}
                {dashboardData?.staffOverview?.leaves || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Subjects */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm stats-card">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg bg-orange-100">
                <svg
                  className="h-5 sm:h-6 w-5 sm:w-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25c0 5.25 3.07 9.75 7.5 11.765m0-13c5.5 0 10 4.745 10 10.25 0 5.25-2.07 9.75-6.5 11.765"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Total Subjects</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-800">
                {dashboardData?.subjectsOverview?.totalSubjects || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Classes: {dashboardData?.subjectsOverview?.totalClasses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid - 3 columns on desktop, 1 on mobile */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 main-grid-3">
        {/* Attendance Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm card">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-800">Attendance</h3>
            <select className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2 sm:gap-4 border-b border-gray-200 pb-3 tabs-horizontal overflow-x-auto">
            {["STUDENTS", "TEACHERS", "STAFF"].map((tab) => (
              <button
                key={tab}
                onClick={() => setAttendanceTab(tab)}
                className={`text-xs font-medium pb-2 transition-colors dashboard-tab-button ${attendanceTab === tab
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="mb-4 flex justify-center">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie
                  data={attendanceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {attendanceChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-4 text-center">
            <p className="text-3xl sm:text-4xl font-bold text-gray-800">
              {currentAttendance?.percentage || 0}%
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {dashboardData?.performance?.statusLabel || "Good"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-4 rounded bg-gray-50 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs stats-grid-4-col">
              <div>
                <p className="mb-1 text-gray-600">Present</p>
                <p className="text-lg font-bold text-gray-800">
                  {currentAttendance?.present || 0}
                </p>
              </div>
              <div>
                <p className="mb-1 text-gray-600">Absent</p>
                <p className="text-lg font-bold text-gray-800">
                  {currentAttendance?.absent || 0}
                </p>
              </div>
              <div>
                <p className="mb-1 text-gray-600">Halfday</p>
                <p className="text-lg font-bold text-gray-800">
                  {currentAttendance?.halfDay || 0}
                </p>
              </div>
              <div>
                <p className="mb-1 text-gray-600">Late</p>
                <p className="text-lg font-bold text-gray-800">
                  {currentAttendance?.late || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 space-y-1 text-xs">
            {attendanceChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-600">● {item.name}</span>
              </div>
            ))}
          </div>

          <button className="mb-3 w-full rounded bg-purple-600 py-2 text-sm font-medium text-white transition hover:bg-purple-700 dashboard-full-width-btn">
            View All Student Attendance
          </button>

          {/* Expandable Details */}
          <button
            onClick={() => setExpandedAttendance(!expandedAttendance)}
            className="w-full text-xs font-medium text-purple-600 transition hover:text-purple-700"
          >
            {expandedAttendance ? "Hide" : "Show"} Details
          </button>
          {expandedAttendance && (
            <div className="mt-3 space-y-1 rounded bg-purple-50 p-2 text-xs expandable-content">
              <p>
                <span className="text-gray-600">Total:</span>{" "}
                <span className="font-bold">{currentAttendance?.total || 0}</span>
              </p>
              <p>
                <span className="text-gray-600">Attendance Rate:</span>{" "}
                <span className="font-bold">{currentAttendance?.percentage || 0}%</span>
              </p>
            </div>
          )}
        </div>

        {/* Class Wise Performance */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm card">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">
            Class Wise Performance
          </h3>

          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none dashboard-select"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id || cls.name} value={cls.id || cls.name}>
                {cls.classCode}
              </option>
            ))}
          </select>

          {/* Pie Chart */}
          <div className="mb-4 flex justify-center">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie
                  data={classPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {classPerformanceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-4 text-center">
            <p className="text-4xl font-bold text-gray-800">
              {classPerformance?.statusLabel || "Good"}
            </p>
            <p className="mt-1 text-sm text-gray-500">85%</p>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            {classPerformanceData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded p-2 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">● {item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-xs">
            <p className="text-gray-600">
              Total Students:{" "}
              <span className="font-bold text-gray-800">
                {classPerformanceData.reduce((sum, item) => sum + item.value, 0)}
              </span>
            </p>
          </div>
        </div>

        {/* Academic Calendar */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm card calendar-widget">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">
            Academic Calendar
          </h3>

          {/* Month Navigation */}
          <div className="mb-4 flex items-center justify-between gap-1 sm:gap-2 month-nav">
            <button
              onClick={handlePrevMonth}
              className="rounded p-1.5 transition hover:bg-gray-100"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button className="flex-1 rounded bg-gradient-to-r from-purple-600 to-purple-700 py-2 text-center text-sm font-medium text-white month-nav-text">
              {monthYear}
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded p-1.5 transition hover:bg-gray-100"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-4 grid grid-cols-7 gap-1 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 font-bold text-gray-600">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (!day) return;

                  const clickedDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  );

                  setSelectedDate(
                    isSelectedDate(day) ? null : clickedDate
                  );
                }}
                className={`rounded py-2 text-xs font-medium transition ${!day
                  ? ""
                  : isToday(day)
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                    : isSelectedDate(day)
                      ? "border-2 border-purple-600 bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-1 border-t border-gray-200 pt-4 text-xs">
            <p className="mb-2 font-semibold text-gray-700">Legend:</p>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-purple-600 legend-dot"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-purple-700 bg-yellow-100 legend-dot"></div>
              <span className="text-gray-600">Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Performer & Star Students - 2 columns on desktop, 1 on mobile */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 grid-2-col">
        {/* Best Performer */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Best Performer</h3>
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-lg font-bold">{dashboardData?.bestPerformer?.name || "N/A"}</p>
                <p className="mt-1 text-xs text-green-100">
                  {dashboardData?.bestPerformer?.subtitle || "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded transition hover:bg-white hover:bg-opacity-30">
                  <ChevronLeft size={14} className="text-white" />
                </button>
                <button className="rounded transition hover:bg-white hover:bg-opacity-30">
                  <ChevronRight size={14} className="text-white" />
                </button>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 text-sm performers-grid-2-col">
              <div>
                <p>Half Day</p>
                <p className="text-lg font-bold">{dashboardData?.attendance?.halfDay || 0}</p>
              </div>
              <div>
                <p>Present</p>
                <p className="text-lg font-bold">{dashboardData?.attendance?.present || 0}</p>
              </div>
              <div>
                <p>Present Late</p>
                <p className="text-lg font-bold">{dashboardData?.attendance?.late || 0}</p>
              </div>
              <div>
                <p>Absent</p>
                <p className="text-lg font-bold">{dashboardData?.attendance?.absent || 0}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-6xl performer-emoji">👩‍🏫</div>
            </div>
          </div>
        </div>

        {/* Star Students */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Star Students</h3>
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-lg font-bold">{dashboardData?.starStudent?.name || "N/A"}</p>
                <p className="mt-1 text-xs text-purple-100">
                  {dashboardData?.starStudent?.subtitle || "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded transition hover:bg-white hover:bg-opacity-30">
                  <ChevronLeft size={14} className="text-white" />
                </button>
                <button className="rounded transition hover:bg-white hover:bg-opacity-30">
                  <ChevronRight size={14} className="text-white" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-6xl performer-emoji">👨‍🎓👩‍🎓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request & Notice Board - 2 columns on desktop, 1 on mobile */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 grid-2-col">
        {/* Leave Request */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Leave Request</h3>

          {/* Tabs */}
          <div className="mb-4 flex gap-4 border-b border-gray-200 pb-3 tabs-horizontal">
            {["STUDENTS", "TEACHERS", "STAFF"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeaveTab(tab)}
                className={`text-xs font-medium pb-2 transition-colors tab-button ${activeLeaveTab === tab
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Leave Items */}
          <div className="space-y-3 leave-items">
            {dashboardData?.leaveRequests && dashboardData.leaveRequests.length > 0 ? (
              dashboardData.leaveRequests.map((leave) => (
                <div
                  key={leave.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:bg-gray-100 leave-item"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {leave.applicantName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {leave.applicantClassOrRole}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateLeaveRequestStatus({
                              id: leave.id,
                              tabContext: activeLeaveTab,
                              status: "APPROVED",
                            })
                          )
                        }
                        disabled={loading}
                        className="font-bold leading-none text-green-500 transition hover:text-green-700 disabled:opacity-50"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            updateLeaveRequestStatus({
                              id: leave.id,
                              tabContext: activeLeaveTab,
                              status: "REJECTED",
                            })
                          )
                        }
                        disabled={loading}
                        className="font-bold leading-none text-red-500 transition hover:text-red-700 disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-orange-500">• {leave.leaveType}</p>
                  <p className="mt-1 text-xs text-gray-600">Leave: {leave.leaveDuration}</p>
                  <p className="text-xs text-gray-500">Apply on: {leave.applyDate}</p>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-gray-500">No leave requests</p>
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Notice board</h3>
            <button
              onClick={() => navigate("/admin/notice-board-view")}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4 notice-items">
            {dashboardData?.notices && dashboardData.notices.length > 0 ? (
              dashboardData.notices.map((notice, idx) => (
                <div
                  key={idx}
                  className="rounded border-l-4 border-purple-500 pl-4 py-2 transition hover:bg-gray-50 notice-item"
                >
                  <div className="flex gap-3 notice-content">
                    <span className="flex-shrink-0 text-2xl notice-emoji">📋</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 notice-title">
                        {notice.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">{notice.description}</p>
                      <p className="mt-2 text-xs text-gray-400 notice-date">Date: {notice.noticeDate}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-gray-500">No notices</p>
            )}
          </div>
        </div>
      </div>

      {/* Fees & Upcoming Events - 3 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 grid-3-col">
        {/* Fees Collection */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-6 text-sm font-semibold text-gray-800">Fees Collection</h3>

          <div className="mb-6 flex justify-center">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie
                  data={feesChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  dataKey="value"
                >
                  {feesChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Cards */}
          <div className="space-y-3 fee-cards">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 transition hover:bg-green-100 fee-card">
              <p className="text-lg font-bold text-green-700 fee-amount">
                ₹ {formatNumber(dashboardData?.feesOverview?.totalFees || 0)}
              </p>
              <p className="mt-1 text-xs text-gray-600 fee-label">Total Fees</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition hover:bg-blue-100 fee-card">
              <p className="text-lg font-bold text-blue-700 fee-amount">
                ₹ {formatNumber(dashboardData?.feesOverview?.totalFeesReceived || 0)}
              </p>
              <p className="mt-1 text-xs text-gray-600 fee-label">Total Fees Received</p>
            </div>
            <div className="rounded-lg border border-pink-200 bg-pink-50 p-4 transition hover:bg-pink-100 fee-card">
              <p className="text-lg font-bold text-pink-700 fee-amount">
                ₹ {formatNumber(dashboardData?.feesOverview?.totalOutstanding || 0)}
              </p>
              <p className="mt-1 text-xs text-gray-600 fee-label">Total Outstanding</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events - spans 2 columns on desktop, 1 on mobile */}
        <div className="md:col-span-2 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm card upcoming-events-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Upcoming Events</h3>
            <button
              onClick={() => navigate("/admin/upcoming-events-view")}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto event-items-container">
            {dashboardData?.upcomingEvents && dashboardData.upcomingEvents.length > 0 ? (
              dashboardData.upcomingEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded border border-gray-100 p-3 transition hover:bg-gray-50 event-item"
                >
                  <span className="flex-shrink-0 text-2xl event-emoji">👨‍👩‍👧</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 event-name">
                      {event.eventName}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 event-date">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    {event.eventTime && (
                      <p className="text-xs text-gray-600">{event.eventTime}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
