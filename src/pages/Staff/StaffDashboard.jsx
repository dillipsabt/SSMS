import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import girl from "../../assets/girl.png";
import boy from "../../assets/boy.png";
import bannerGirl from "../../assets/bannerGirl.png";
import { CalendarDays, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  getStaffDashboardAsync,
  getStaffAttendanceChartAsync,
} from "../../features/staff/Dashboard/staffDashboardSlice";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Custom dropdown — avoids native <select> overflow issues on mobile
function CustomDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 h-8 px-3 text-[12px] sm:text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 whitespace-nowrap"
      >
        {value}
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-md shadow-lg min-w-[110px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-[12px] sm:text-[13px] hover:bg-gray-50 ${value === opt ? "text-indigo-600 font-semibold" : "text-gray-700"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [attendanceFilter, setAttendanceFilter] = useState("This Month");
  const [leaveFilter, setLeaveFilter] = useState("Monthly");
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  const today = new Date();
  const isToday = (day) =>
    day &&
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const isSelectedDate = (day) => {
    if (!day) return false;

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const staffId = localStorage.getItem("profileId");
  const { dashboardData, attendanceChartData } = useSelector(
    (state) => state.staffDashboard,
  );
  const profile = dashboardData?.welcomeCard;

  const attendance =
    attendanceChartData ?? dashboardData?.attendanceChart ?? {};

  const leaveRequests = dashboardData?.leaveStatus || [];

  const upcomingEvents = dashboardData?.upcomingEvents || [];

  const notices = dashboardData?.noticeBoard || [];

  useEffect(() => {
    if (staffId) {
      dispatch(getStaffDashboardAsync(staffId));
      dispatch(getStaffAttendanceChartAsync(staffId));
    }
  }, [dispatch, staffId]);

  const attendanceData = attendance
    ? [
        { name: "Present", value: attendance.present || 0, color: "#18C267" },
        { name: "Absent", value: attendance.absent || 0, color: "#F5143D" },
        { name: "Half Day", value: attendance.halfDay || 0, color: "#2F80ED" },
        { name: "Late", value: attendance.late || 0, color: "#F9A941" },
      ]
    : [
        { name: "Present", value: 0, color: "#18C267" },
        { name: "Absent", value: 0, color: "#F5143D" },
        { name: "Half Day", value: 0, color: "#2F80ED" },
        { name: "Late", value: 0, color: "#F9A941" },
      ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const defaultProfileImage =
    profile?.gender?.toLowerCase() === "female" ? girl : boy;

  return (
    <div className="p-2 sm:p-4 lg:p-5 bg-white min-h-screen font-sans text-[13px] text-gray-800">
      {/* ── BANNER ── */}
      <div className="dashboard-welcome bg-gradient-to-r from-[#5A42F3] to-[#1F26C9] rounded-md px-4 sm:px-6 py-4 mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center min-h-[150px] relative overflow-hidden">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-[22px] font-bold text-white">
            Good Morning, {profile?.fullName || "Ms. Hamsa Nandhini"}
          </h1>
          <p className="text-[13px] text-white/90 mt-2">
            Have a Good day at work
          </p>
          <p className="mt-4 mb-4 max-w-full lg:max-w-[700px] text-[13px] text-white">
            Notice: There is a staff meeting at 9AM today. Don't forget to
            Attend!!!
          </p>
        </div>
        <div className="mt-4 lg:mt-0 lg:absolute lg:top-3 lg:right-5 self-center p-1">
          <img
            src={bannerGirl}
            alt="Banner Illustration"
            className="w-[120px] sm:w-[140px] lg:w-[150px] h-auto object-contain"
          />
        </div>
      </div>

      {/* ───────── PROFILE + TODAY CLASS + CALENDAR ───────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* PROFILE */}
          <div className="bg-[#050B7C] rounded-md px-6 py-5 h-[135px] flex items-center">
            {/* <img
              src={profileImage}
              alt={profile?.fullName || "Staff"}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              onError={(e) => {
                e.target.src = boy;
              }}
            /> */}
            <div className="mt-4 sm:mt-0 sm:ml-6 text-white">
              <h2 className="font-semibold text-[18px]">
                Employee Id - {profile?.staffId || "-"}
              </h2>
              <p className="mt-3 text-[15px]">
                Designation: {profile?.designation}
              </p>
              {profile?.departmentName || "-"}
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="xl:col-span-4">
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-[16px] font-semibold text-[#333333]">
                Calendar
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between bg-[#EAF2FF] rounded-full px-5 h-[44px] mb-6">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="text-[18px] text-[#374151]"
                >
                  ‹
                </button>
                <span className="text-[15px] font-semibold text-[#1F2937]">
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="text-[18px] text-[#374151]"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-[13px] font-normal text-[#9CA3AF] mb-3">
                {WEEK_DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-3 text-center text-[13px]">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    // onClick={() => {
                    //   if (!day) return;

                    //   setSelectedDate(
                    //     new Date(year, month, day)
                    //   );
                    // }}
                    onClick={() => {
                      if (!day) return;

                      setSelectedDate(new Date(year, month, day));
                    }}
                    className={`
  w-8 h-8 sm:w-9 sm:h-9
  flex items-center justify-center
  mx-auto rounded-full
  cursor-pointer transition-all
 
  ${
    isSelectedDate(day)
      ? "bg-indigo-600 text-white font-bold"
      : isToday(day)
        ? "border-2 border-indigo-600 text-indigo-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
  }
`}
                  >
                    {day || ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATTENDANCE + LEAVE + EVENTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden h-auto xl:min-h-[490px]">
          <div className="flex items-center justify-between gap-2 min-h-[50px] px-3 sm:px-4 py-2 border-b border-gray-200">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Attendance
            </h3>
            {/* FIXED: Custom dropdown replaces native <select> */}
            <CustomDropdown
              options={["This Month"]}
              value={attendanceFilter}
              onChange={setAttendanceFilter}
            />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 justify-start text-[13px] text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-full bg-[#5B6EF5]" />
                Half Day
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-full bg-[#19C15F]" />
                Present
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-full bg-[#F4A63A]" />
                Late
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-full bg-[#F3123C]" />
                Absent
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-[240px] h-[240px] mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      dataKey="value"
                      innerRadius={72}
                      outerRadius={104}
                      stroke="none"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[17px] font-medium text-gray-700">
                    Attendance
                  </p>
                  <p className="text-[44px] font-bold leading-none text-[#1F2937]">
                    {attendance?.presentPercentage || 0}%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-5 mb-6 text-[15px]">
              <CalendarDays
                size={18}
                strokeWidth={2.2}
                className="text-[#5A42F3]"
              />
              <span className="text-gray-600">No. of total working days</span>
              <span className="font-semibold text-[#1F2937]">
                {attendance?.totalWorkingDays || 0} Days
              </span>
            </div>
            <div className="grid grid-cols-4 border border-gray-200 rounded-md overflow-hidden mt-4">
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-[14px] text-gray-600">Present</p>
                <p className="text-[18px] font-bold text-[#18C267] mt-2">
                  {attendance?.present || 0}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-[14px] text-gray-600">Absent</p>
                <p className="text-[18px] font-bold text-[#F5143D] mt-2">
                  {attendance?.absent || 0}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-[14px] text-gray-600">Halfday</p>
                <p className="text-[18px] font-bold text-[#5B6EF5] mt-2">
                  {attendance?.halfDay || 0}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-[14px] text-gray-600">Late</p>
                <p className="text-[18px] font-bold text-[#F9A941] mt-2">
                  {attendance?.late || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Status */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden h-auto xl:min-h-[490px]">
          <div className="flex items-center justify-between gap-2 min-h-[50px] px-3 sm:px-4 py-2 border-b border-gray-200">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Leave Status
            </h3>
            {/* FIXED: Custom dropdown replaces native <select> */}
            <CustomDropdown
              options={["Monthly"]}
              value={leaveFilter}
              onChange={setLeaveFilter}
            />
          </div>
          <div className="p-3">
            {leaveRequests && leaveRequests.length > 0 ? (
              leaveRequests.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-gray-200"
                >
                  <div>
                    <p className="font-medium">
                      {item.reason || "Leave Request"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Date: {formatDate(item.fromDate)}
                    </p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 text-xs rounded text-sm ${item.status === "Approved" ? "bg-green-100 text-green-600" : item.status === "Rejected" ? "bg-red-100 text-red-500" : "bg-yellow-100 text-yellow-600"}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-3">
                No leave requests
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-gray-200 rounded-md h-auto xl:min-h-[490px] overflow-hidden">
          <div className="flex items-center justify-between h-[50px] px-4 border-b border-gray-200">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              Upcoming Events
            </h3>
            <button
              onClick={() => navigate("/staff/upcoming-events-view")}
              className="text-[13px] font-medium text-[#5A42F3] hover:text-[#4a32d3]"
            >
              View All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className="rounded-sm p-3 relative border-sky-500 border border-gray-300"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                      <CalendarDays
                        size={18}
                        strokeWidth={2}
                        className="text-[#5A42F3]"
                      />
                    </div>
                    <div>
                      {/* <p className="font-medium text-[14px]">{event.title}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDate(event.publishDate)}</p> */}
                      <p className="font-medium text-[14px]">
                        {event.eventName}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDate(event.eventDate)}
                      </p>
                      <hr className="border-gray-300 border my-2" />
                      <p
                        className="text-xs text-gray-500"
                        dangerouslySetInnerHTML={{
                          __html: event.description || "No Description",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No upcoming events
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="h-[50px] px-4 border-b border-gray-200 flex items-center">
            <h3 className="text-[16px] font-semibold">Notice Board</h3>
          </div>

          <div className="p-4 space-y-3">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice.id} className="border-b border-gray-200 pb-3">
                  <p className="font-medium">{notice.title}</p>

                  <p className="text-sm text-gray-600 mt-1">
                    {notice.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(notice.noticeDate)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No notices available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
