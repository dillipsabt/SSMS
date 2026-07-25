import React, { useEffect, useState } from "react";
import { Calendar, CalendarDays } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import Select from "react-select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function ParentsAttendance() {
  const [dateFilter] = useState("dd/mm/yyyy");
  const [statusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const statusOptions = [
    { value: "", label: "Status" },
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
  ];

  const attendanceLog = [
    { date: "15-05-2026", status: "Present", remarks: "" },
    { date: "14-05-2026", status: "Absent", remarks: "Suffering from fever" },
    { date: "13-05-2026", status: "Present", remarks: "" },
    { date: "12-05-2026", status: "Present", remarks: "" },
    { date: "11-05-2026", status: "Present", remarks: "" },
    { date: "10-05-2026", status: "Sunday", remarks: "" },
    { date: "09-05-2026", status: "Present", remarks: "" },
    { date: "08-05-2026", status: "Present", remarks: "" },
    { date: "05-05-2026", status: "Present", remarks: "" },
    { date: "06-05-2026", status: "Holiday", remarks: "Ugadhi" },
  ];

  const attendanceTrendData = [
    { month: "Jun", absent: 17, present: 28 },
    { month: "Jul", absent: 20, present: 7 },
    { month: "Aug", absent: 14, present: 13 },
    { month: "Sep", absent: 33, present: 8 },
    { month: "Oct", absent: 6, present: 17 },
    { month: "Nov", absent: 6, present: 5 },
    { month: "Dec", absent: 21, present: 23 },
    { month: "Jan", absent: 15, present: 6 },
    { month: "Feb", absent: 38, present: 23 },
    { month: "Mar", absent: 38, present: 21 },
    { month: "Apr", absent: 22, present: 37 },
    { month: "May", absent: 6, present: 17 },
  ];

  const attendanceSummary = [
    {
      label: "Total Days Present",
      value: "120",
      bg: "bg-[#DFF6E6]",
      iconBg: "bg-[#7BE495]",
      iconColor: "text-[#16A34A]",
    },
    {
      label: "Total Days Absent",
      value: "01",
      bg: "bg-[#FBE6EB]",
      iconBg: "bg-[#F8B4C4]",
      iconColor: "text-[#F43F5E]",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Sunday":
        return "bg-yellow-100 text-yellow-700";
      case "Holiday":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentAttendance = attendanceLog.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(attendanceLog.length / rowsPerPage);

  return (
    <div className="w-full px-4 sm:px-6 py-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Attendance</h2>
      <p className="text-sm text-gray-500 mb-6">Home / Attendance / Attendance</p>

      {/* ATTENDANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {attendanceSummary.map((item, index) => (
          <div
            key={index}
            className={`${item.bg} border border-gray-200 rounded-lg shadow-sm`}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 min-h-[96px]">

              {/* Left Content */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#333333]">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm sm:text-base text-[#4B5563]">
                  {item.label}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${item.iconBg}`}
              >
                <CalendarDays
                  size={28}
                  strokeWidth={2}
                  className={item.iconColor}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ATTENDANCE LOG */}
      <div className="card mb-6 overflow-hidden">

        {/* Header */}
        <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Attendance Log
          </h3>
        </div>

        {/* Filters */}
        <div className="p-4 flex flex-col sm:flex-row gap-3 justify-end border-b border-gray-200">

          <input
            type="date"
            className="w-full sm:w-44 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <Select
            options={statusOptions}
            placeholder="Status"
            className="w-full sm:w-44"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            menuPlacement="auto"
            styles={{
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
              }),
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  S.No.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {currentAttendance.length > 0 ? (
                currentAttendance.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {indexOfFirst + i + 1}
                    </td>

                    <td className="px-4 py-3">
                      {row.date}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {row.remarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-gray-500"
                  >
                    No attendance records found
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

      {/* ATTENDANCE TREND CHART */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Attendance Trend
          </h3>

          <input
            type="date"
            className="w-full sm:w-44 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Chart */}
        <div className="p-3 sm:p-6">
          <div className="h-[250px] sm:h-[320px] lg:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceTrendData}
                barCategoryGap="20%"
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis
                  width={25}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="square"
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "15px",
                  }}
                />

                <Bar
                  dataKey="absent"
                  fill="#ef476f"
                  name="Absent"
                  radius={[3, 3, 0, 0]}
                />

                <Bar
                  dataKey="present"
                  fill="#2ecc71"
                  name="Present"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
