import React, { useState, useEffect } from "react";
import { SendHorizonalIcon } from "lucide-react";
import {
  getClassesThunk,
  getSubjectsThunk,
  takeAttendanceThunk,
} from "../../features/teacher/Attendance/attendanceSlice";
import { useDispatch, useSelector } from "react-redux";
import API from "../../services/api";
import { toast } from "sonner";

import Pagination from "../../components/common/Pagination";

const getTodayDate = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export default function TeacherStudentAttendance() {
  const [selected, setSelected] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [subjectId, setSubjectId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getTodayDate);

  const dispatch = useDispatch();
  const { profileId } = useSelector((state) => state.auth || {});
  const { classes, subjects, loading } = useSelector(
    (state) => state.attendance,
  );

  const [classRoomId, setClassRoomId] = useState("");

  // SELECT STUDENTS
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };


  useEffect(() => {
    if (!classRoomId) return;

    let cancelled = false;
    const loadStudents = async () => {
      try {
        const response = await API.get(
          `/attendance/take-attendance?classRoomId=${classRoomId}`,
        );
        const students = response.data.data || response.data || [];
        const normalizedStudents = (students || []).map((student) => ({
          studentId: student.studentId,
          studentName: student.studentName,
          admissionNumber: student.admissionNumber || student.admissionNo,
          status: student.status,
        }));

        if (!cancelled) setStudentsData(normalizedStudents);
      } catch {
        if (!cancelled) toast.error("Failed to fetch students");
      }
    };

    loadStudents();
    return () => {
      cancelled = true;
    };
  }, [classRoomId]);

  // INITIAL API CALLS
  useEffect(() => {
    dispatch(getClassesThunk());

    dispatch(getSubjectsThunk());
  }, [dispatch]);

  const validateForm = () => {
    if (!profileId) {
      toast.error("Teacher profile not found");

      return false;
    }

    if (!subjectId) {
      toast.error("Subject is required");

      return false;
    }

    if (!classRoomId) {
      toast.error("Class & Section is required");

      return false;
    }

    if (!attendanceDate) {
      toast.error("Attendance date is required");

      return false;
    }

    if (selected.length === 0) {
      toast.error("Please select at least one student");

      return false;
    }

    return true;
  };

  // SUBMIT ATTENDANCE
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      attendanceDate,
      teacherId: Number(profileId),
      subjectId: Number(subjectId),
      classRoomId: Number(classRoomId),
      students: (studentsData || []).map((student) => ({
        studentId: Number(student.studentId),
        present: selected.includes(student.studentId),
      })),
    };

    try {
      await dispatch(takeAttendanceThunk(payload)).unwrap();
      toast.success("Attendance submitted successfully!");
      setSelected([]);
      setStudentsData([]);
      setSubjectId("");
      setClassRoomId("");
      setAttendanceDate(getTodayDate());
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to submit attendance");
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStudents = studentsData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(studentsData.length / rowsPerPage);
  const allCurrentStudentsSelected = currentStudents.length > 0 && currentStudents.every((student) => selected.includes(student.studentId));

  const toggleAllCurrentStudents = () => {
    setSelected((currentSelection) => {
      if (allCurrentStudentsSelected) {
        return currentSelection.filter((studentId) => !currentStudents.some((student) => student.studentId === studentId));
      }
      return [...new Set([...currentSelection, ...currentStudents.map((student) => student.studentId)])];
    });
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <h1 className="text-[22px] font-bold">Student Attendance</h1>
      <p className="text-sm text-gray-500 mb-4">Teacher / Student Attendance</p>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-2">
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <label className="form-label">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(event) => {
                setSubjectId(event.target.value);
                setSelected([]);
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

          <div>
            <label className="form-label">
              Class & Section <span className="text-red-500">*</span>
            </label>
            <select
              value={classRoomId}
              onChange={(event) => {
                setClassRoomId(event.target.value);
                setSelected([]);
                setCurrentPage(1);
              }}
              className="form-select"
            >
              <option value="">Select Class & Section</option>
              {classes?.map((classItem) => (
                <option key={classItem.classRoomId || classItem.id} value={classItem.classRoomId || classItem.id}>
                  {classItem.classroomName || `${classItem.className || ""} ${classItem.sectionName || classItem.section || ""}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">
              Attendance Date <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-1">
              <input
                type="date"
                value={attendanceDate}
                onChange={(event) => {
                  setAttendanceDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-2">
                  <label className="flex items-center justify-center gap-1">
                    <input
                      type="checkbox"
                      checked={allCurrentStudentsSelected}
                      onChange={toggleAllCurrentStudents}
                      disabled={!currentStudents.length}
                      aria-label="Select all students on this page"
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                </th>
                <th className="p-2 text-left">S.No.</th>
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Admission Number</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <tr key={student.studentId} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(student.studentId)}
                        onChange={() => handleSelect(student.studentId)}
                        aria-label={`Select ${student.studentName || "student"}`}
                        className="h-4 w-4 accent-indigo-600"
                      />
                    </td>
                    <td className="p-2">{indexOfFirst + index + 1}</td>
                    <td className="p-2">{student.studentName || student.name || student.fullName}</td>
                    <td className="p-2">{student.admissionNumber || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 py-6 text-center text-gray-400">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-[7px] rounded-md text-[13px] transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? "Submitting..." : "Submit"}
            <SendHorizonalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
