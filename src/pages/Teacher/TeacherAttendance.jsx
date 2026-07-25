import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCheck2, UserX2, Calendar } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  fetchTeacherAttendanceHistory,
} from "../../features/teacher/Attendance/teacherAttendanceSlice";

export default function TeacherAttendance() {
  const dispatch = useDispatch();
  const { profileId } = useSelector((state) => state.auth);
  const { history, totalPresent, totalAbsent, totalHalfDay, loading } =
    useSelector((state) => state.teacherAttendance) || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchTeacherAttendanceHistory(profileId));
    }
  }, [dispatch, profileId]);

  const attendanceList = Array.isArray(history) ? history : [];

  const filtered = selectedDate
    ? attendanceList.filter((row) => {
      if (!row.date) return false;
      const rowDate = new Date(row.date).toDateString();
      return rowDate === selectedDate.toDateString();
    })
    : attendanceList;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentAttendance = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";

    const date = new Date(timeStr);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours || 12;

    return `${hours}.${minutes} ${ampm}`;
  };

  const formatLateTime = (minutes) => {
    if (minutes == null || minutes === 0) return "-";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} Hour${hours > 1 ? "s" : ""} ${mins} Minute${mins > 1 ? "s" : ""}`;
    }

    if (hours > 0) {
      return `${hours} Hour${hours > 1 ? "s" : ""}`;
    }

    return `${mins} Minute${mins > 1 ? "s" : ""}`;
  };

  return (
    <div className="min-h-screen bg-white px-3 ">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800">Attendance</h1>
      <p className="text-sm text-gray-500 mb-4">Teacher / Attendance</p>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 ">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Attendance</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Present */}
          <div className="bg-green-100 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">{totalPresent ?? 0}</p>
              <p className="text-sm text-gray-600">Total Present</p>
            </div>
            <div className="bg-green-300 p-2 rounded-md text-green-600">
              <UserCheck2 size={18} />
            </div>
          </div>

          {/* Absent */}
          <div className="bg-pink-100 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">{totalAbsent ?? 0}</p>
              <p className="text-sm text-gray-600">Total Absent</p>
            </div>
            <div className="bg-pink-300 p-2 rounded-md text-red-600">
              <UserX2 size={18} />
            </div>
          </div>

          {/* Half Day */}
          <div className="bg-purple-100 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">{totalHalfDay ?? 0}</p>
              <p className="text-sm text-gray-600">Half Day</p>
            </div>
            <div className="bg-violet-300 p-2 rounded-md text-violet-900">
              <Calendar size={18} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCurrentPage(1);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Date"
            className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <Select
            className="w-full sm:w-auto"
            options={[
              { value: "Export", label: "Export" },
              { value: "PDF", label: "PDF" },
              { value: "Excel", label: "Excel" },
            ]}
            value={{ value: "Export", label: "Export" }}
            onChange={() => { }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-50 text-sm text-gray-600">
              <tr>
                <th className="p-2 text-left">S.No.</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Punch In</th>
                <th className="p-2 text-left">Punch Out</th>
                <th className="p-2 text-left">Late</th>
                <th className="p-2 text-left">Production Hours</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : currentAttendance.length > 0 ? (
                currentAttendance.map((row, i) => (
                  <tr key={row.id || i} className="border-t border-gray-200 text-left">
                    <td className="p-2">{indexOfFirst + i + 1}</td>
                    <td className="p-2">{formatDate(row.attendanceDate)}</td>
                    <td className="p-2">
                      {formatTime(row.punchIn)}
                    </td>

                    <td className="p-2">
                      {formatTime(row.punchOut)}
                    </td>
                    <td className="p-2">
                      {formatLateTime(row.lateMinutes)}
                    </td>
                    <td
                      className={`p-2 ${row.status === "Present"
                        ? "text-green-600"
                        : row.status === "Absent"
                          ? "text-red-500"
                          : "text-orange-500"
                        }`}
                    >
                      {row.productionHours != null ? `${row.productionHours} Hrs` : "-"}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${row.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : row.status === "Absent"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                          }`}
                      >
                        {row.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
}
