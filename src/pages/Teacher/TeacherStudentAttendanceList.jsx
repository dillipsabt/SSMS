import React from "react";
import Select from "react-select";
import { UserCheck2, UserX2, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudentAttendence,
  fetchClasses,
  fetchSubjects,
} from "../../features/teacher/StudentAttendence/studentAttendenceSlice";
import { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function StudentAttendanceSummary() {
  const { attendenceDetails, loading, error, classes, subjects } = useSelector(
    (state) => state.studentAttendence,
  );
  const dispatch = useDispatch();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const data = attendenceDetails?.attendanceDetails || [];

  const filteredData = data.filter(
    (item) =>
      item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rollNumber?.toString().includes(searchTerm),
  );
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedDate) {
      dispatch(
        fetchStudentAttendence({
          classRoomId: selectedClass,
          subjectId: selectedSubject,
          date: selectedDate?.toISOString().split("T")[0],
        }),
      );
    }
  }, [dispatch, selectedClass, selectedSubject, selectedDate]);

  const presentCount = attendenceDetails?.totalPresent || 0;
  const absentCount = attendenceDetails?.totalAbsent || 0;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className=" bg-white min-h-screen">
      {/* Title */}
      <h2 className="text-xl font-semibold">Student Attendance List</h2>
      <p className="text-sm text-gray-500 mb-4">
        Teacher / Student Attendance List
      </p>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        {/* Header */}
        <div className="border-b border-gray-200 pb-3 mb-4 font-medium text-sm">
          Student Attendance
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Present */}
          <div className="flex items-center justify-between bg-green-100 p-4 rounded-md">
            <div className="bg-green-200 p-2 rounded-md">
              <UserCheck2 className="text-green-700" />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{presentCount}</p>
              <p className="text-xs text-gray-600">Total Present</p>
            </div>
          </div>

          {/* Absent */}
          <div className="flex items-center justify-between bg-red-100 p-4 rounded-md">
            <div className="bg-red-200 p-2 rounded-md">
              <UserX2 className="text-red-700" />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{absentCount}</p>
              <p className="text-xs text-gray-600">Total Absent</p>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
          <div className="text-sm text-gray-600 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select
              options={classes?.map((item) => ({
                value: item.id,
                label: item.classCode || item.name,
              }))}
              value={classes
                ?.map((item) => ({
                  value: item.id,
                  label: item.classCode || item.name,
                }))
                .find((item) => item.value === selectedClass)}
              onChange={(selected) => setSelectedClass(selected?.value)}
              placeholder="Select Class"
              className="w-full text-sm"
            />

            <Select
              options={subjects?.map((item) => ({
                value: item.id,
                label: item.subjectName || item.name,
              }))}
              value={subjects
                ?.map((item) => ({
                  value: item.id,
                  label: item.subjectName || item.name,
                }))
                .find((item) => item.value === selectedSubject)}
              onChange={(selected) => setSelectedSubject(selected?.value)}
              placeholder="Select Subject"
              className="w-full text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select Date"
              popperPlacement="bottom-start"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
              wrapperClassName="w-full sm:w-auto"
            />
            <input
              type="text"
              placeholder="Search Name / Roll Number"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {/* <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              <option>Export</option>
              <option>PDF</option>
              <option>Excel</option>
            </select> */}
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-2 text-left">S.No.</th>
                <th className="p-2 text-left">Roll Number</th>
                {/* <th className="p-2 text-left">Serial Number</th> */}
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="p-2">{indexOfFirst + index + 1}</td>
                    <td className="p-2">{item.rollNumber}</td>
                    {/* <td className="p-2">{item.serialNumber}</td> */}
                    <td className="p-2">{item.studentName}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${item.status === "Present"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
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
                    colSpan="4"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No Data Found
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
