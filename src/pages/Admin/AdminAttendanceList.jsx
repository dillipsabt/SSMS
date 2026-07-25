import React, { useState } from "react";
import { Search, Download, Users, UserX, Calendar } from "lucide-react";
import Pagination from "../../components/common/Pagination";

const AdminAttendanceList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const summaryData = {
    totalPresent: 227,
    totalAbsent: 10,
    halfDay: 5,
  };

  const attendanceData = [
    {
      id: 1,
      empId: "101",
      empName: "Naresh",
      date: "01/04/2026",
      department: "Teacher",
      mode: "Finger Print",
      punchIn: "08:00 AM",
      punchOut: "05:00 PM",
      late: "00 mins",
      productionHours: "08:00 Hrs",
      status: "Present",
    },
    {
      id: 2,
      empId: "102",
      empName: "Harika",
      date: "02/04/2026",
      department: "IT",
      mode: "Finger Print",
      punchIn: "08:10 AM",
      punchOut: "05:15 PM",
      late: "10 mins",
      productionHours: "08:05 Hrs",
      status: "Present",
    },
    {
      id: 3,
      empId: "103",
      empName: "Sowjanya Reddy",
      date: "03/04/2026",
      department: "HR",
      mode: "Finger Print",
      punchIn: "00:00 AM",
      punchOut: "00:00 PM",
      late: "00 mins",
      productionHours: "00:00 Hrs",
      status: "Absent",
    },
    {
      id: 4,
      empId: "104",
      empName: "Yashoda",
      date: "04/04/2026",
      department: "Teacher",
      mode: "Finger Print",
      punchIn: "02:00 PM",
      punchOut: "05:00 PM",
      late: "00 mins",
      productionHours: "04:00 Hrs",
      status: "Half Day",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-50";
      case "Absent":
        return "text-red-600 bg-red-50";
      case "Half Day":
        return "text-orange-600 bg-orange-50";
      case "Late":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getProductionHoursColor = (hours) => {
    if (hours === "00:00 Hrs") return "text-red-600";
    if (hours.startsWith("04:")) return "text-orange-600";
    if (hours.startsWith("08:")) return "text-green-600";
    return "text-gray-600";
  };

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.empName.toLowerCase().includes(search.toLowerCase()) ||
                         item.empId.includes(search);
    const matchesStatus = statusFilter === "All" ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">Attendance</h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Teacher / Attendance
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Present */}
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Present</p>
              <p className="text-3xl font-bold text-green-700 mt-2">
                {summaryData.totalPresent}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <Users size={24} className="text-green-700" />
            </div>
          </div>
        </div>

        {/* Total Absent */}
        <div className="card p-4 bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Absent</p>
              <p className="text-3xl font-bold text-red-700 mt-2">
                {summaryData.totalAbsent}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
              <UserX size={24} className="text-red-700" />
            </div>
          </div>
        </div>

        {/* Half Day */}
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Half Day</p>
              <p className="text-3xl font-bold text-purple-700 mt-2">
                {summaryData.halfDay}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h3 className="text-sm font-medium text-gray-700">Attendance List</h3>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Date Range */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full sm:w-[140px] h-10 border border-gray-300 rounded-md px-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full sm:w-[140px] h-10 border border-gray-300 rounded-md px-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-[240px]">
              <input
                type="text"
                placeholder="Search Emp name / Emp Id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md px-3 pr-10 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-[130px] h-10 border border-gray-300 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Late">Late</option>
            </select>

            {/* Export Button */}
            <button className="w-full sm:w-auto flex items-center gap-2 btn-secondary">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Emp ID</th>
                <th className="px-3 py-2 text-left">Emp Name</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Department</th>
                <th className="px-3 py-2 text-left">Mode</th>
                <th className="px-3 py-2 text-left">Punch In</th>
                <th className="px-3 py-2 text-left">Punch Out</th>
                <th className="px-3 py-2 text-left">Late</th>
                <th className="px-3 py-2 text-left">Production Hours</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{indexOfFirst + i + 1}</td>
                  <td className="px-3 py-2">{item.empId}</td>
                  <td className="px-3 py-2">{item.empName}</td>
                  <td className="px-3 py-2">{item.date}</td>
                  <td className="px-3 py-2">{item.department}</td>
                  <td className="px-3 py-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.mode}
                    </span>
                  </td>
                  <td className="px-3 py-2">{item.punchIn}</td>
                  <td className="px-3 py-2">{item.punchOut}</td>
                  <td className="px-3 py-2">{item.late}</td>
                  <td className={`px-3 py-2 font-semibold ${getProductionHoursColor(item.productionHours)}`}>
                    {item.productionHours}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {currentData.map((item, i) => (
            <div key={item.id} className="border rounded p-3 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{item.empName}</p>
                  <p className="text-xs text-gray-500">{item.empId}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-gray-600">
                <p><b>Date:</b> {item.date}</p>
                <p><b>Department:</b> {item.department}</p>
                <p><b>Punch In:</b> {item.punchIn}</p>
                <p><b>Punch Out:</b> {item.punchOut}</p>
                <p><b>Late:</b> {item.late}</p>
                <p><b>Hours:</b> <span className={`font-semibold ${getProductionHoursColor(item.productionHours)}`}>{item.productionHours}</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminAttendanceList;
