import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Bell, UserCheck, Award } from "lucide-react";
import AvatarImg from "../../assets/avatar.png";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiCalendar } from "react-icons/fi";
import {
  getStudentDashboardAsync,
  getStudentAttendanceChartAsync,
  clearSuccess,
  clearError,
} from "../../features/student/dashboard/studentDashboardSlice";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData, attendanceChartData, loading, error } = useSelector(
    (state) => state.studentDashboard,
  );

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    const studentId = localStorage.getItem("profileId");
    if (studentId) {
      dispatch(getStudentDashboardAsync(studentId));
      dispatch(getStudentAttendanceChartAsync(studentId));
    }
  }, [dispatch]);

  const welcomeCard = dashboardData?.welcomeCard || {};
  const stats = dashboardData?.stats || {};
  const todayClasses = dashboardData?.todayClasses || [];
  const examResults = dashboardData?.examResults || [];
  const leaveStatus = dashboardData?.leaveStatus || [];
  const noticeBoard = dashboardData?.noticeBoard || [];
  const upcomingEvents = dashboardData?.upcomingEvents || [];

  const attendanceData = attendanceChartData
    ? [
      { name: "Half Day", value: attendanceChartData.halfDay },
      { name: "Present", value: attendanceChartData.present },
      { name: "Late", value: attendanceChartData.late },
      { name: "Absent", value: attendanceChartData.absent },
    ]
    : [];

  const COLORS = [
    "#6C7AE0",
    "#63C28D",
    "#F5A64A",
    "#EF4444",
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const WEEK_DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const today = new Date();

  const isToday = (day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelectedDate = (day) => {
    if (!day || !selectedDate) return false;

    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === month &&
      selectedDate?.getFullYear() === year
    );
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const clickedDate = new Date(
      year,
      month,
      day
    );

    setSelectedDate(clickedDate);
  };

  return (
    <div className="p-2 md:p-6 bg-white min-h-screen space-y-4">
      {/* TOP GRID: Welcome Card + Mini Stat Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT BIG CARD */}
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* TEXT */}
          <div className="space-y-4 w-full sm:max-w-[70%]">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Welcome, {welcomeCard.name || "Student"}!
              </h2>
              <p className="text-sm opacity-90">
                Welcome back! We're here to support your learning journey. Dive
                into your classes and keep progressing.
              </p>
            </div>

            <div className="text-sm space-y-1 bg-white/10 p-3 rounded-lg backdrop-blur-xs">
              <p>
                <strong>Class:</strong> {welcomeCard.className || "N/A"}
              </p>
              <p>
                <strong>Section:</strong> {welcomeCard.section || "N/A"}
              </p>
              <p>
                <strong>Roll No:</strong> {welcomeCard.rollNo || "N/A"}
              </p>
            </div>
          </div>

          {/* IMAGE */}
          <img
            src={
              welcomeCard?.photoUrl &&
                welcomeCard.photoUrl !== "null" &&
                welcomeCard.photoUrl !== "undefined"
                ? welcomeCard.photoUrl
                : AvatarImg
            }
            alt="student"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white"
            onError={(e) => {
              e.target.src = AvatarImg;
            }}
          />
        </div>

        {/* RIGHT SMALL CARDS */}
        <div className="grid grid-cols-2 gap-4">
          {/* Events */}
          <div className="bg-green-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-green-200/40 rounded-lg text-green-600">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {stats.eventsCount || 0}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Events</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-purple-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-200/40 rounded-lg text-purple-600">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {stats.notificationsCount || 0}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Alerts</p>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-blue-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-200/40 rounded-lg text-blue-600">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {stats.attendancePercentage || 0}%
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Attendance</p>
            </div>
          </div>

          {/* Grade */}
          <div className="bg-red-100 rounded-xl p-4 flex items-center gap-2">
            <div className="p-2 bg-red-200/40 rounded-lg text-red-600">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {stats.overallGrade || "N/A"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND GRID: Attendance Chart & Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Attendance chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-300 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 px-4 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">
              Attendance Breakdown
            </h2>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full w-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>01/09/2025 - 30/09/2025</option>
            </select>
          </div>

          <div className="h-[280px] sm:h-[320px] w-full flex items-center justify-center p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  innerRadius={window.innerWidth < 640 ? 50 : 65}
                  outerRadius={window.innerWidth < 640 ? 80 : 100}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "13px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Today's Classes */}
        <div className="bg-white rounded-xl shadow border border-gray-300 flex flex-col">
          <div className="h-[50px] px-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Today's Schedule
            </h3>
          </div>
          <div className="p-4 h-[270px] overflow-y-auto">
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <p className="font-medium text-gray-800">
                    {classItem.subjectName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {classItem.startTime} - {classItem.endTime}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-[15px]">
                No classes scheduled
              </div>
            )}
          </div>
        </div>
      </div>

      {/* THIRD SECTION: Exam Results (Horizontal Scrollable Table) */}
      <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-gray-800">Exam Results</h2>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Admission No</th>
                <th className="px-6 py-3.5">Exam Type</th>
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Percentage</th>
                <th className="px-6 py-3.5">Marks</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {examResults.length > 0 ? (
                examResults.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-gray-900">
                      {item.admissionNo}
                    </td>
                    <td className="px-6 py-3.5">{item.examType}</td>
                    <td className="px-6 py-3.5">{item.subject}</td>
                    <td className="px-6 py-3.5 font-semibold text-indigo-600">
                      {item.grade}
                    </td>
                    <td className="px-6 py-3.5">{item.percentage}</td>
                    <td className="px-6 py-3.5">{item.marks}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Pass"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No exam results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOURTH GRID: Calendar & Leaves */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Calendar Container */}
        <div className="xl:col-span-8 bg-white shadow border border-gray-300 rounded-md overflow-hidden">
          <div className="h-[50px] px-4 border-b border-gray-200 flex items-center">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Academic Calendar
            </h3>
          </div>
          <div className="flex justify-between items-center px-4 py-2 bg-indigo-50 text-indigo-900 rounded-lg mb-4">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    year,
                    month - 1,
                    1
                  )
                )
              }
            >
              {"<"}
            </button>
            <p className="font-semibold">
              {currentDate.toLocaleString(
                "default",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    year,
                    month + 1,
                    1
                  )
                )
              }
            >
              {">"}
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center gap-y-2 text-sm font-medium">

            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
      w-8 h-8 sm:w-9 sm:h-9
      flex items-center justify-center
      mx-auto rounded-full
      cursor-pointer
      transition-all

      ${isToday(day)
                    ? "bg-indigo-600 text-white"
                    : ""
                  }

      ${isSelectedDate(day)
                    ? "border-2 border-indigo-600 bg-indigo-100"
                    : ""
                  }

      hover:bg-indigo-100
    `}
              >
                {day || ""}
              </div>
            ))}

            {/* <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
  Selected Date:
  <span className="font-semibold ml-2">
    {selectedDate.toLocaleDateString()}
  </span>
</div> */}
          </div>
        </div>

        {/* Right: Leave Request Module */}
        <div className="xl:col-span-4 bg-white shadow border border-gray-300 rounded-md overflow-hidden">
          <div className="h-[50px] px-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Leave Status
            </h3>
          </div>
          <div className="p-4 h-[280px] overflow-y-auto">
            {leaveStatus.length > 0 ? (
              leaveStatus.map((leave, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {leave.leaveType}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {leave.fromDate} to {leave.toDate}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-600 rounded-md font-medium">
                    {leave.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No recent leave logs
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FIFTH GRID: Notices & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Notice Board */}
        <div className="lg:col-span-2 bg-white shadow border border-gray-300 rounded-md overflow-hidden">
          <div className="h-[50px] px-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Notice Board
            </h3>

            <button
              onClick={() =>
                navigate("/student/notice-board-view")
              }
              className="text-[13px] font-medium text-[#5A42F3]"
            >
              View All
            </button>
          </div>
          <div className="p-4 h-[320px] overflow-y-auto">
            {noticeBoard.length > 0 ? (
              noticeBoard.map((notice, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-purple-50 rounded-lg text-purple-600 shrink-0">
                    <FiCalendar size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">
                      {notice.title}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                      {notice.description}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">
                      Published: {notice.publishDate}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-12">
                Notice board is clear
              </div>
            )}
          </div>
        </div>

        {/* Right: Upcoming Events */}
        <div className="bg-white border shadow border-gray-300 rounded-md overflow-hidden">
          <div className="h-[50px] px-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gray-800">
              Upcoming Events
            </h2>
            <button
              onClick={() => navigate("/student/upcoming-events-view")}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold tracking-wide"
            >
              View All
            </button>
          </div>

          <div className="p-4 h-[320px] overflow-y-auto">
            {(upcomingEvents || []).length > 0 ? (
              (upcomingEvents || []).map((event, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-blue-50 rounded-lg text-blue-600 shrink-0">
                    <FiCalendar size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {event.description}
                    </p>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                      {event.eventDate} @ {event.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-12">
                No upcoming events planned
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
