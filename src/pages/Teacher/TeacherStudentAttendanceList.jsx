import React from "react";
import { UserCheck2, UserX2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudentAttendence,
  fetchClasses,
  fetchSubjects,
} from "../../features/teacher/StudentAttendence/studentAttendenceSlice";
import { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";

const getTodayDate = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const getAdmissionNumber = (item) => item?.admissionNumber || item?.admissionNo || item?.rollNumber || "-";

export default function StudentAttendanceSummary() {
  const { attendenceDetails, classes, subjects } = useSelector(
    (state) => state.studentAttendence,
  );
  const dispatch = useDispatch();
  const { profileId } = useSelector((state) => state.auth || {});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const data = attendenceDetails?.attendanceDetails || [];

  const filteredData = data.filter(
    (item) =>
      item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAdmissionNumber(item).toString().toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (profileId && selectedClass && selectedSubject && selectedDate) {
      dispatch(
        fetchStudentAttendence({
          teacherId: Number(profileId),
          classRoomId: selectedClass,
          subjectId: selectedSubject,
          date: selectedDate,
        }),
      );
    }
  }, [dispatch, profileId, selectedClass, selectedSubject, selectedDate]);

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
        <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
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
        <div className="mb-4 grid grid-cols-1 items-end gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,auto)]">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:col-span-2">
            <select
              value={selectedClass}
              onChange={(event) => {
                setSelectedClass(event.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="">Select Class</option>
              {classes?.map((classItem) => (
                <option key={classItem.classRoomId || classItem.id} value={classItem.classRoomId || classItem.id}>
                  {classItem.classroomName || classItem.classCode || classItem.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(event) => {
                setSelectedSubject(event.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="">Select Subject</option>
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName || subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:col-span-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setCurrentPage(1);
              }}
              className="form-input w-full sm:w-[150px]"
            />
            <input
              type="text"
              placeholder="Search Name / Admission Number"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
                <th className="p-2 text-left">Admission Number</th>
                {/* <th className="p-2 text-left">Serial Number</th> */}
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id || item.studentId || `${item.admissionNumber}-${index}`} className="border-t border-gray-200">
                    <td className="p-2">{indexOfFirst + index + 1}</td>
                    <td className="p-2">{getAdmissionNumber(item)}</td>
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
