import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import girl from "../../assets/girl.png";
import bannerGirl from "../../assets/bannerGirl.png";
import Webcam from "react-webcam";
import securityIllustration from "../../assets/bannerGirl.png";
import {
  CalendarDays,
  CalendarClock,
  Link,
  MoreVertical,
  Check,
  X,
  ChevronDown,
  Camera,
  MapPin,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import {
  fetchTeacherDashboard,
  clearSuccess,
  clearError,
} from "../../features/teacher/Dashboard/teacherDashboardSlice";
import {
  punchInTeacher,
  punchOutTeacher,
  fetchTeacherAttendance,
} from "../../features/teacher/Attendance/teacherAttendanceSlice";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StatusBadge({ status }) {
  const map = {
    APPROVED: "bg-green-100 text-green-600",
    ACCEPTED: "bg-green-100 text-green-600",
    PASS: "bg-green-100 text-green-600",
    REJECTED: "bg-red-100 text-red-600",
    FAIL: "bg-red-100 text-red-600",
    PENDING: "bg-yellow-100 text-yellow-600",
    REVIEW: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

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

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedClassDate, setSelectedClassDate] = useState(new Date());
  const [attendanceFilter, setAttendanceFilter] = useState("This Month");
  const [leaveFilter, setLeaveFilter] = useState("Monthly");

  /* =========================
   Punch In States
========================= */

  const { profileId } = useSelector((state) => state.auth);
  const {
    todayAttendance,
    punchLoading,
  } = useSelector((state) => state.teacherAttendance) || {};
  const [currentTime, setCurrentTime] = useState(0);
  const hasCurrentTeacherAttendance =
    todayAttendance && String(todayAttendance.teacherId) === String(profileId);
  const hasPunchedIn = Boolean(hasCurrentTeacherAttendance && todayAttendance.punchIn);
  const hasPunchedOut = Boolean(hasCurrentTeacherAttendance && todayAttendance.punchOut);
  const isWorking = hasPunchedIn && !hasPunchedOut;

  const webcamRef = useRef(null);

  const [showPunchModal, setShowPunchModal] = useState(false);

  const [loadingLocation, setLoadingLocation] = useState(false);

  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [capturedImage, setCapturedImage] = useState(null);
  const [isFaceEnrolled, setIsFaceEnrolled] = useState(false);
  const [verificationStep, setVerificationStep] = useState("camera");

  /*
camera
enrollSuccess
capture
preview
verifying
identitySuccess
*/

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  const formattedClassDate = selectedClassDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    console.log("Selected Date:", selectedDate);
  }, [selectedDate]);

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

  const [openMenu, setOpenMenu] = React.useState(null);
  const dashboardState = useSelector((state) => state.teacherDashboard) || {};
  const {
    profile = null,
    attendance = null,
    upcomingEvents = [],
    leaveRequests = [],
    homeworkAssignments = [],
    studentMarks = [],
    todayClasses = [],
    loading = false,
  } = dashboardState;

  useEffect(() => {
    dispatch(fetchTeacherDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchTeacherAttendance({ teacherId: profileId }));
    }
  }, [dispatch, profileId]);

  useEffect(() => {
    if (!isWorking) return;

    setCurrentTime(Date.now());
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isWorking]);

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);

    setSelectedDate(clickedDate);

    dispatch(fetchTeacherEventsByDate(clickedDate.toISOString().split("T")[0]));
  };

  const handlePunchIn = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoadingLocation(false);

        setVerificationStep("camera");

        setShowPunchModal(true);
      },

      (error) => {
        setLoadingLocation(false);

        if (error.code === 1) {
          toast.error("Location permission denied. Please allow location access and try again.");
        } else if (error.code === 2) {
          toast.error("Location unavailable. Please try again.");
        } else if (error.code === 3) {
          toast.error("Location request timed out. Please try again.");
        } else {
          toast.error("Unable to retrieve location. Please try again.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Unable to capture image");
      return;
    }

    setCapturedImage(imageSrc);

    if (!isFaceEnrolled) {
      setVerificationStep("enrollSuccess");
    } else {
      setVerificationStep("preview");
    }
  };

  const verifyFace = () => {
    setVerificationStep("verifying");

    setTimeout(() => {
      setVerificationStep("identitySuccess");
    }, 2000);
  };

  const retakePhoto = () => {
    setCapturedImage(null);

    setVerificationStep("camera");
  };

  const saveAttendance = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      await dispatch(
        punchInTeacher({
          teacherId: Number(profileId),
          date: todayStr,
          latitude: location.latitude,
          longitude: location.longitude,
        })
      ).unwrap();

      setShowPunchModal(false);
      setCapturedImage(null);
      setVerificationStep("camera");
      toast.success("Punch-In recorded successfully");
      dispatch(fetchTeacherDashboard());
      dispatch(fetchTeacherAttendance({ teacherId: profileId }));
    } catch (err) {
      const msg =
        typeof err === "object"
          ? err.message || "Punch-In failed. Please try again."
          : String(err);
      toast.error(msg);
    }
  };

  const closePunchModal = () => {
    setShowPunchModal(false);

    setCapturedImage(null);

    setVerificationStep("camera");
  };

  const formatTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  };

  const formatWorkingHours = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const runningWorkingHours = isWorking
    ? formatWorkingHours(currentTime - new Date(todayAttendance.punchIn).getTime())
    : null;

  const finalWorkingHours = todayAttendance?.productionHours != null
    ? `${todayAttendance.productionHours} Hrs`
    : null;

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

  // ===============================
  // Punch-Out States
  // ===============================

  const [showPunchOutModal, setShowPunchOutModal] = useState(false);

  const [punchOutStep, setPunchOutStep] = useState("camera");

  /*
camera
preview
verifying
success
*/

  const [capturedPunchOutImage, setCapturedPunchOutImage] = useState(null);

  // ===============================
  // Punch-Out
  // ===============================

  const handlePunchOut = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");

      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,
        });

        setLoadingLocation(false);

        setPunchOutStep("camera");

        setShowPunchOutModal(true);
      },

      (error) => {
        setLoadingLocation(false);

        if (error.code === 1) {
          toast.error("Location permission denied. Please allow location access and try again.");
        } else if (error.code === 2) {
          toast.error("Location unavailable. Please try again.");
        } else if (error.code === 3) {
          toast.error("Location request timed out. Please try again.");
        } else {
          toast.error("Unable to retrieve location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =====================================
  // Capture Punch-Out Image
  // =====================================

  const capturePunchOut = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Unable to capture image.");

      return;
    }

    setCapturedPunchOutImage(imageSrc);

    setPunchOutStep("preview");
  };

  // =====================================
  // Retake Punch-Out Image
  // =====================================

  const retakePunchOut = () => {
    setCapturedPunchOutImage(null);

    setPunchOutStep("camera");
  };

  // =====================================
  // Verify Punch-Out Face
  // =====================================

  const verifyPunchOut = () => {
    setPunchOutStep("verifying");

    setTimeout(() => {
      setPunchOutStep("success");
    }, 2000);
  };

  // =====================================
  // Save Punch-Out Attendance
  // =====================================

  const savePunchOut = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      await dispatch(
        punchOutTeacher({
          teacherId: Number(profileId),
          date: todayStr,
          latitude: location.latitude,
          longitude: location.longitude,
        })
      ).unwrap();

      closePunchOutModal();
      setCapturedPunchOutImage(null);
      setPunchOutStep("camera");
      toast.success("Punch-Out recorded successfully");
      dispatch(fetchTeacherDashboard());
      dispatch(fetchTeacherAttendance({ teacherId: profileId }));
    } catch (err) {
      const msg =
        typeof err === "object"
          ? err.message || "Punch-Out failed. Please try again."
          : String(err);
      toast.error(msg);
    }
  };

  const closePunchOutModal = () => {
    // closePunchOutModal();
    setShowPunchOutModal(false);

    setCapturedPunchOutImage(null);

    setPunchOutStep("camera");
  };

  return (
    <div className="p-2 sm:p-4 lg:p-5 bg-white min-h-screen font-sans text-[13px] text-gray-800">
      {/* ── BANNER ── */}
      <div className="bg-gradient-to-r from-[#5A42F3] to-[#1F26C9] rounded-md px-4 sm:px-6 py-4 mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center min-h-[150px] relative overflow-hidden">
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
            <img
              src={profile?.profileUrl || girl}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            />
            <div className="mt-4 sm:mt-0 sm:ml-6 text-white">
              <h2 className="font-semibold text-[18px]">
                Employee Id - {profile?.teacherCode || "AD1256589"}
              </h2>
              <p className="mt-3 text-[15px]">
                Classes: {profile?.classesHandled || "9-A, 10-B, 10-A, 9-B"}
              </p>
              <p className="mt-2 text-[15px]">
                {profile?.subject || "Physics"}
              </p>
            </div>
          </div>

          {/* TODAY'S CLASS */}
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-[14px]">Today's Class</h3>
                <button
                  onClick={() =>
                    setSelectedClassDate((prev) => {
                      const d = new Date(prev);
                      d.setDate(d.getDate() - 1);
                      return d;
                    })
                  }
                  className="w-6 h-6 text-xs rounded-full border border-gray-300 text-sm"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setSelectedClassDate((prev) => {
                      const d = new Date(prev);
                      d.setDate(d.getDate() + 1);
                      return d;
                    })
                  }
                  className="w-6 h-6 text-xs rounded-full bg-indigo-600 text-white text-sm"
                >
                  ›
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-800 text-[14px]">
                <span>{formattedClassDate}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 p-4">
              {todayClasses && todayClasses.length > 0 ? (
                todayClasses.map((c, i) => (
                  <div key={i} className="bg-[#F5F6FA] rounded-md p-3">
                    <div
                      className={`rounded-md py-2 text-center text-white font-semibold text-[13px] ${i === 0 || i === 1 ? "bg-[#F3123C]" : "bg-[#5A42F3]"}`}
                    >
                      {c.startTime} - {c.endTime}
                    </div>
                    <p className="mt-4 font-semibold text-[15px] text-gray-800">
                      {c.className}
                    </p>
                    <p className="text-[13px] text-gray-500 mt-1">
                      {c.subjectName}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center text-gray-500 py-4">
                  No classes scheduled for today
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        {/* <div className="xl:col-span-4">
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-[16px] font-semibold text-[#333333]">Calendar</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between bg-[#EAF2FF] rounded-full px-5 h-[44px] mb-6">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-[18px] text-[#374151]">‹</button>
                <span className="text-[15px] font-semibold text-[#1F2937]">
                  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-[18px] text-[#374151]">›</button>
              </div>
              <div className="grid grid-cols-7 text-center text-[13px] font-normal text-[#9CA3AF] mb-3">
                {WEEK_DAYS.map((day) => <span key={day}>{day}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-y-3 text-center text-[13px]">
                {calendarDays.map((day, index) => (
  <div
    key={index}
    onClick={() => {
      if (!day) return;

      setSelectedDate(
        new Date(year, month, day)
      );
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
        </div> */}

        <div className="xl:col-span-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-[16px] font-semibold text-gray-800">
                Punch-In / Punch-Out
              </h3>
            </div>

            {/* Body */}
            <div className="px-4 py-4 flex flex-col items-center">
              <img
                src={securityIllustration}
                alt="Punch"
                className="w-64 h-auto object-contain mb-5"
              />

              <p className="text-[#18B53C] text-[16px] font-semibold text-center leading-7 mb-6">
                Punctuality is the virtue of the board.
              </p>

              {isWorking && (
                <div className="w-full mb-4 text-center text-sm text-gray-600 space-y-1">
                  <p>Punch In: {formatTime(todayAttendance.punchIn)}</p>
                  <p>Working Hours: {runningWorkingHours}</p>
                </div>
              )}

              {hasPunchedOut && (
                <div className="w-full mb-4 text-center text-sm text-gray-600 space-y-1">
                  <p>Punch In: {formatTime(todayAttendance.punchIn)}</p>
                  <p>Punch Out: {formatTime(todayAttendance.punchOut)}</p>
                  <p>Working Hours: {finalWorkingHours || "-"}</p>
                  <p>Status: {todayAttendance.status || "-"}</p>
                </div>
              )}

              {isWorking ? (
                <button
                  onClick={handlePunchOut}
                  disabled={punchLoading || loadingLocation}
                  className="w-full h-12 rounded-md bg-red-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingLocation ? "Getting Location..." : "Punch Out"}
                </button>
              ) : (
                <button
                  onClick={handlePunchIn}
                  disabled={punchLoading || loadingLocation}
                  className="w-full h-12 rounded-md bg-[#4F46E5] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingLocation ? "Getting Location..." : "Punch In"}
                </button>
              )}
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
                    {attendance?.percentage || 0}%
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
              onClick={() => navigate("/teacher/upcoming-events-view")}
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
                      <p className="font-medium text-[14px]">{event.title}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDate(event.publishDate)}
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
      </div>

      {/* HOMEWORK + NOTICE BOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        {/* Homework */}
        <div className="xl:col-span-8 overflow-x-auto bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-[15px]">Homework / Assignment</h3>
            <button className="text-indigo-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead>
                <tr className="bg-indigo-50 text-gray-700">
                  <th className="px-3 py-2 text-left">S.No.</th>
                  <th className="px-3 py-2 text-left">Submission Date</th>
                  <th className="px-3 py-2 text-left">Student Name</th>
                  <th className="px-3 py-2 text-center">
                    Submission Attachments
                  </th>
                  <th className="px-3 py-2 text-center">Status</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {homeworkAssignments && homeworkAssignments.length > 0 ? (
                  homeworkAssignments.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">
                        {formatDate(item.submittedAt)}
                      </td>
                      <td className="px-3 py-2">{item.studentName}</td>
                      <td className="px-3 py-2 text-center">
                        {item.submissionUrl && (
                          <a
                            href={item.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Attachment"
                          >
                            <Link
                              size={18}
                              strokeWidth={2}
                              className="mx-auto text-[#5A42F3] hover:text-[#4338CA]"
                            />
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={item.status?.toUpperCase()} />
                      </td>
                      <td className="px-3 py-2 text-center relative">
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === index ? null : index)
                          }
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                        {openMenu === index && (
                          <div className="absolute right-3 top-8 z-20 w-28 bg-white border border-gray-200 rounded shadow-md">
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => {
                                setOpenMenu(null);
                              }}
                            >
                              <Check size={16} className="text-green-500" />
                              Accept
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => {
                                setOpenMenu(null);
                              }}
                            >
                              <X size={16} className="text-red-500" />
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      No homework assignments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice Board */}
        <div className="xl:col-span-4 bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-[16px] text-[#333333]">
              Notice Board
            </h3>
            <button
              onClick={() => navigate("/teacher/notice-board-view")}
              className="text-[13px] font-medium text-[#5A42F3] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="p-4 space-y-5">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#F5EAFB] flex items-center justify-center">
                    <CalendarClock
                      size={22}
                      strokeWidth={2.5}
                      className="text-[#B11CEA]"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Sports Day Announcement</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Date: 10/10/24</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#F5EAFB] flex items-center justify-center">
                    <CalendarClock
                      size={22}
                      strokeWidth={2.5}
                      className="text-[#B11CEA]"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Summer Break Start Date</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Date: 10/10/24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STUDENT MARKS TABLE ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <span className="font-semibold text-[13px]">Student Marks</span>
          <span className="text-xs text-indigo-600 font-medium cursor-pointer">
            View All
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-xs">
            <thead>
              <tr className="bg-indigo-50 text-gray-700">
                {[
                  "Roll Number",
                  "Student Name",
                  "Obtained Marks / 100",
                  "Percentage (%)",
                  "Grade",
                  "Status",
                  "Remarks",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left font-semibold text-gray-800 text-sm"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentMarks && studentMarks.length > 0 ? (
                studentMarks.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="px-3 py-2.5">{item.rollNo || "-"}</td>
                    <td className="px-3 py-2.5">{item.studentName}</td>
                    <td className="px-3 py-2.5">{item.obtainedMarks}</td>
                    <td className="px-3 py-2.5">{item.percentage}%</td>
                    <td className="px-3 py-2.5">{item.grade}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={item.status?.toUpperCase()} />
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">
                      {item.remarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    No student marks available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===========================
    Punch-In Modal
=========================== */}

      {showPunchModal && verificationStep === "camera" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg overflow-hidden bg-white shadow-2xl">
            {/* Header */}

            <div className="bg-[#4F46E5] px-4 py-3 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">
                Punch-In Enroll
              </h2>

              <button
                onClick={closePunchModal}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}

            <div className="p-4">
              <h3 className="text-center text-[17px] font-semibold text-gray-800">
                Face Enrollment
              </h3>

              <p className="text-center text-xs text-gray-500 mt-1">
                Position your face within the frame
              </p>

              {/* Camera */}

              <div className="mt-4 border-[4px] border-[#4F46E5] rounded-md overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full"
                />
              </div>

              {/* Buttons */}

              <div className="mt-5 space-y-3">
                <button
                  onClick={capture}
                  className="w-full h-11 rounded bg-[#4F46E5] text-white font-medium flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  Capture
                </button>

                <button
                  onClick={closePunchModal}
                  className="w-full h-11 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPunchModal && verificationStep === "preview" && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[430px]">
            <div className="bg-[#4F46E5] px-4 py-3 text-white font-semibold">
              Enroll Verify
            </div>

            <div className="p-5">
              <h3 className="text-center font-semibold">Face Enrollment</h3>

              <p className="text-center text-xs text-gray-500 mb-4">
                Position your face within the frame
              </p>

              <div className="border-[4px] border-[#4F46E5] rounded overflow-hidden">
                <img src={capturedImage} alt="" className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={retakePhoto} className="h-11 border rounded">
                  Retake
                </button>

                <button
                  onClick={verifyFace}
                  className="h-11 bg-[#4F46E5] text-white rounded"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPunchModal && verificationStep === "verifying" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[420px] overflow-hidden">
            <div className="bg-[#4F46E5] text-white px-5 py-3">
              <h2 className="font-semibold text-lg">
                {/* Enroll Verify */}
                Punch-In Capture
              </h2>
            </div>

            <div className="p-5">
              <h3 className="text-center font-semibold">
                {/* Face Enrollment */}
                Punch-In Capture
              </h3>

              <p className="text-center text-xs text-gray-500 mb-4">
                Position your face within the frame
              </p>

              <div className="border-[4px] border-[#4F46E5] rounded overflow-hidden">
                <img src={capturedImage} alt="" className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={retakePhoto} className="h-11 border rounded">
                  Retake
                </button>

                <button
                  onClick={verifyFace}
                  className="h-11 rounded bg-[#4F46E5] text-white"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPunchModal && verificationStep === "enrollSuccess" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-[440px]">
            <div className="bg-[#4F46E5] px-5 py-4 flex justify-between items-center">
              <h2 className="text-white text-[28px] font-semibold">
                Punch-In Enroll
              </h2>

              <button onClick={closePunchModal}>
                <X className="text-white" />
              </button>
            </div>

            <div className="px-8 py-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow">
                <div className="w-14 h-14 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <Check className="text-green-600" size={30} />
                </div>
              </div>

              <h2 className="text-4xl font-bold mt-6">Enrollment Successful</h2>

              <p className="text-center text-gray-500 mt-4">
                Your face recognition is now active. You can use face
                recognition for punch-in.
              </p>

              <div className="w-full bg-[#F4F1FF] rounded-md mt-6 p-4">
                <p className="text-[#5A42F3] font-semibold">Quick Tip</p>

                <p className="text-sm text-[#5A42F3] mt-2">
                  Ensure good lighting and remove glasses or masks for the
                  fastest recognition during daily punch-ins.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsFaceEnrolled(true);

                  setCapturedImage(null);

                  setVerificationStep("camera");
                }}
                // onClick={() => {

                // setVerificationStep("identitySuccess");

                // }}

                className="mt-8 w-full h-12 bg-[#4F46E5] rounded text-white font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showPunchModal && verificationStep === "identitySuccess" && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[420px] overflow-hidden">
            <div className="bg-[#4F46E5] px-5 py-4 flex justify-between">
              <h2 className="text-white font-semibold text-2xl">Punch-In</h2>

              <button onClick={closePunchModal}>
                <X className="text-white" />
              </button>
            </div>

            <div className="py-8 px-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <Check className="text-green-600" size={30} />
                </div>
              </div>

              <h2 className="text-3xl font-bold mt-6">Identity Verified</h2>

              <p className="text-gray-500 mt-2">Punch-In Successful</p>

              <div className="bg-[#F4F1FF] rounded-md mt-6 w-44 py-4">
                <p className="text-center text-sm">Current Time</p>

                <p className="text-center text-[#4F46E5] text-3xl font-bold">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-center text-green-600 text-sm mt-1">
                  • Attendance Recorded
                </p>
              </div>

              <button
                onClick={saveAttendance}
                disabled={punchLoading}
                className="mt-8 w-full h-12 bg-[#4F46E5] rounded text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {punchLoading ? "Saving..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
        Punch-Out Camera
====================================== */}

      {showPunchOutModal && punchOutStep === "camera" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg overflow-hidden bg-white shadow-2xl">
            {/* Header */}

            <div className="bg-[#4F46E5] px-4 py-3 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">
                Punch-Out Capture
              </h2>

              <button
                onClick={() => {
                  closePunchOutModal();
                }}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}

            <div className="p-4">
              <h3 className="text-center text-[17px] font-semibold text-gray-800">
                Face Verification
              </h3>

              <p className="text-center text-xs text-gray-500 mt-1">
                Position your face within the frame
              </p>

              <div className="mt-4 border-[4px] border-[#4F46E5] rounded-md overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full"
                />
              </div>

              <div className="mt-5 space-y-3">
                <button
                  onClick={capturePunchOut}
                  className="w-full h-11 rounded bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  Capture
                </button>

                <button
                  onClick={() => {
                    // setShowPunchOutModal(false);
                    closePunchOutModal();
                  }}
                  className="w-full h-11 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
        Punch-Out Verify
====================================== */}

      {showPunchOutModal && punchOutStep === "preview" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg overflow-hidden bg-white shadow-2xl">
            {/* Header */}

            <div className="bg-[#4F46E5] px-4 py-3 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">
                Punch-Out Verify
              </h2>

              <button
                onClick={() => {
                  closePunchOutModal();

                  setPunchOutStep("camera");
                }}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}

            <div className="p-4">
              <h3 className="text-center text-[17px] font-semibold text-gray-800">
                Face Verification
              </h3>

              <p className="text-center text-xs text-gray-500 mt-1">
                Verify your captured face
              </p>

              <div className="mt-4 border-[4px] border-[#4F46E5] rounded-md overflow-hidden">
                <img
                  src={capturedPunchOutImage}
                  alt="Captured Punch-Out"
                  className="w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={retakePunchOut}
                  className="h-11 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Retake
                </button>

                <button
                  onClick={verifyPunchOut}
                  className="h-11 rounded bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
        Punch-Out Verifying
====================================== */}

      {showPunchOutModal && punchOutStep === "verifying" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg overflow-hidden bg-white shadow-2xl">
            <div className="bg-[#4F46E5] px-4 py-3">
              <h2 className="text-white font-semibold text-lg">
                Punch-Out Verify
              </h2>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="w-16 h-16 border-[6px] border-gray-200 border-t-[#4F46E5] rounded-full animate-spin"></div>

              <h3 className="mt-6 text-lg font-semibold">Verifying Face...</h3>

              <p className="text-gray-500 text-sm mt-2 text-center">
                Please wait while we verify your face.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
        Punch-Out Success
====================================== */}

      {showPunchOutModal && punchOutStep === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg overflow-hidden bg-white shadow-2xl">
            <div className="bg-[#4F46E5] px-4 py-3 flex justify-between items-center">
              <h2 className="text-white font-semibold text-lg">Punch-Out</h2>

              <button
                onClick={() => {
                  closePunchOutModal();
                }}
                className="text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              {/* Success Icon */}

              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-green-600 flex items-center justify-center">
                  <Check className="text-green-600" size={24} />
                </div>
              </div>

              <h2 className="text-3xl font-bold mt-6">Identity Verified</h2>

              <p className="text-gray-500 mt-2">Punch-Out Successful</p>

              {/* Time */}

              <div className="bg-[#F4F1FF] rounded-md mt-6 px-8 py-4">
                <p className="text-center text-sm">Current Time</p>

                <p className="text-center text-3xl font-bold text-[#4F46E5] mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-green-600 text-sm mt-2 text-center">
                  ● Attendance Recorded
                </p>
              </div>

              <button
                onClick={savePunchOut}
                disabled={punchLoading}
                className="w-full h-11 mt-8 rounded bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {punchLoading ? "Saving..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
