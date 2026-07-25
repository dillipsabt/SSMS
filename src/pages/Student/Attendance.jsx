import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchStudentViewAttendenceReport,
  clearSuccess,
  clearError,
} from "../../features/student/studentAttendenceReport/studenceAttendenceReportSlice";

const Attendance = () => {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const dispatch = useDispatch();

  const { studentViewAttendenceReport = {}, loading = false, error = null, success = false } = useSelector(
    (state) => state.studentAttendenceReport || {},
  );

  const authData = useSelector((state) => state.auth);

  const studentCode = authData?.userCode;

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Show toast on success/error
  useToastMessage({
    success,
    error,
    successMessage: "Attendance data fetched successfully! ✅",
    clearSuccess,
    clearError,
  });

  useEffect(() => {
    if (studentCode && selectedYear) {
      dispatch(
        fetchStudentViewAttendenceReport({
          studentCode,
          year: selectedYear,
        }),
      );
    }
  }, [dispatch, studentCode, selectedYear]);
  const attendanceData = {};

  studentViewAttendenceReport?.monthlyReports?.forEach((monthReport) => {
    const raw = monthReport.month?.slice(0, 3) || "";
    const monthKey = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    attendanceData[monthKey] = {};

    Object.entries(monthReport.attendance || {}).forEach(([day, status]) => {
      if (status === true || status === "P") {
        attendanceData[monthKey][day] = "P";
      } else if (status === false || status === "A") {
        attendanceData[monthKey][day] = "A";
      } else {
        attendanceData[monthKey][day] = "H";
      }
    });
  });


  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Calculate totals
  const totalPresent = studentViewAttendenceReport?.totalPresent || 0;
  const totalAbsent = studentViewAttendenceReport?.totalAbsent || 0;

  const getStatusStyle = (status) => {
    switch (status) {
      case "P":
        return "text-green-600 font-medium";
      case "A":
        return "text-red-500 font-medium";
      case "H":
        return "text-gray-400 font-medium";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">
        Student Attendance List
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Teacher / Student Attendance List
      </p>

      {/* MAIN CONTAINER */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {/* SECTION HEADER */}
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-md font-semibold text-gray-700">
            Student Attendance
          </h2>
        </div>

        <div className="p-4">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-md">
            {/* Present Card */}
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {totalPresent}
                </h2>
                <p className="text-sm text-gray-600">Total Days Present</p>
              </div>
              <div className="bg-green-500 p-2 rounded-md text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
              </div>
            </div>

            {/* Absent Card */}
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {totalAbsent < 10 ? `0${totalAbsent}` : totalAbsent}
                </h2>
                <p className="text-sm text-gray-600">Total Days Absent</p>
              </div>
              <div className="bg-red-500 p-2 rounded-md text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="17" y1="8" x2="23" y2="14"></line>
                  <line x1="23" y1="8" x2="17" y2="14"></line>
                </svg>
              </div>
            </div>
          </div>

          {/* YEAR SELECTOR AND LEGEND */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = currentYear - 2 + i;

                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-green-600 font-medium">P</span>
                <span className="text-gray-600">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-medium">A</span>
                <span className="text-gray-600">Absent</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 font-medium">H</span>
                <span className="text-gray-600">Holiday</span>
              </div>
            </div>
          </div>

          {/* ATTENDANCE CALENDAR TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Month
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border border-gray-200 px-1 py-2 text-center font-medium text-gray-700 min-w-[28px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((month) => (
                  <tr key={month} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-2 py-2 font-medium text-gray-700 sticky left-0 bg-white z-10">
                      {month}
                    </td>
                    {days.map((day) => {
                      const status = attendanceData[month]?.[String(day)];
                      return (
                        <td
                          key={day}
                          className="border border-gray-200 px-1 py-2 text-center"
                        >
                          <span className={getStatusStyle(status)}>
                            {status || "-"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
