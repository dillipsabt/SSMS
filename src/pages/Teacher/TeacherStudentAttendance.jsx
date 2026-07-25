import React, { useState, useEffect } from "react";
import { SendHorizonalIcon, Check } from "lucide-react";
import {
  getClassesThunk,
  getSubjectsThunk,
  takeAttendanceThunk,
  resetAttendanceState,
} from "../../features/teacher/Attendance/attendanceSlice";
import { useDispatch, useSelector } from "react-redux";
import API from "../../services/api";
import { toast } from "sonner";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../../components/common/Pagination";

export default function TeacherStudentAttendance() {
  const [selected, setSelected] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [subjectId, setSubjectId] = useState("");
  // const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { classes, subjects, loading, success, error } = useSelector(
    (state) => state.attendance,
  );

  const [classRoomId, setClassRoomId] = useState("");

  // SELECT STUDENTS
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // FETCH TEACHERS
  const fetchTeachers = async () => {
    try {
      const response = await API.get("/teachers");

      setTeachers(response.data.data || response.data);
    } catch (error) {
      toast.error("Failed to fetch teachers");
    }
  };

  const fetchStudents = async () => {
    try {
      if (!classRoomId) {
        setStudentsData([]);

        return;
      }

      const response = await API.get(
        `/attendance/take-attendance?classRoomId=${classRoomId}`,
      );

      const students = response.data.data || response.data || [];

      const normalizedStudents = (students || []).map((student) => ({
        studentId: student.studentId,

        studentName: student.studentName,

        rollNumber: student.rollNumber,

        status: student.status,
      }));

      setStudentsData(normalizedStudents);
    } catch (error) {

      toast.error("Failed to fetch students");
    }
  };
  useEffect(() => {
    if (classRoomId) {
      fetchStudents();

      setSelected([]);
    }
  }, [classRoomId]);

  useEffect(() => {
    if (success) {
      toast.success("Attendance submitted successfully!");

      dispatch(resetAttendanceState());

      // OPTIONAL RESET FORM
      setSelected([]);
      setSelectedTeacher("");
      setSubjectId("");
      setClassRoomId("");
      setAttendanceDate(null);
    }

    if (error) {
      toast.error(error);

      dispatch(resetAttendanceState());
    }
  }, [success, error, dispatch]);

  // INITIAL API CALLS
  useEffect(() => {
    fetchTeachers();

    // fetchSections();

    dispatch(getClassesThunk());

    dispatch(getSubjectsThunk());
  }, [dispatch]);

  const validateForm = () => {
    if (!selectedTeacher) {
      toast.error("Teacher is required");

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
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      attendanceDate,
      teacherId: Number(selectedTeacher),
      subjectId: Number(subjectId),
      classRoomId: Number(classRoomId),

      students: (studentsData || []).map((student) => ({
        studentId: Number(student.studentId),
        present: selected.includes(student.studentId),
      })),
    };
    dispatch(takeAttendanceThunk(payload));
  };

  return (
    // <div className="p-6 min-h-screen">
    <div className="w-full min-h-screen bg-white">
      {/* // <div className="mb-2"> */}
      {/* Title */}
      <h1 className="text-[22px] font-bold">Student Attendance</h1>
      <p className="text-sm text-gray-500 mb-4">Teacher / Student Attendance</p>
      {/* </div> */}

      {/* Card */}
      {/* <div className="bg-white border border-gray-200 rounded-lg p-4"> */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-2">
        {/* Form */}
        {/* <div className="grid grid-cols-3 gap-4 mb-4"> */}
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">
              Teacher Name <span className="text-red-500">*</span>
            </label>
            {/* <Select
  value={selectedTeacher}
  onChange={(e) =>
    setSelectedTeacher(
      e.target.value
    )
  }
  // className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
  className="
w-full
border
border-gray-300
bg-white
px-3
py-[7px]
rounded-md
text-[13px]
text-gray-700
outline-none
focus:ring-2
focus:ring-indigo-200
"
>
  <option value="">
    Select Teacher
  </option>
 
  {teachers?.map((teacher, index) => (
 
    <option
      key={
        teacher.id ||
        teacher.teacherId ||
        index
      }
      value={
        teacher.id ||
        teacher.teacherId
      }
    >
      {
        teacher.name ||
        teacher.teacherName ||
        teacher.fullName
      }
    </option>
 
  ))}
</Select> */}
            <Select
              options={teachers?.map((teacher) => ({
                value: teacher.id || teacher.teacherId,

                label: teacher.name || teacher.teacherName || teacher.fullName,
              }))}
              value={teachers
                ?.map((teacher) => ({
                  value: teacher.id || teacher.teacherId,

                  label:
                    teacher.name || teacher.teacherName || teacher.fullName,
                }))
                .find((teacher) => teacher.value === selectedTeacher)}
              onChange={(selected) => setSelectedTeacher(selected?.value)}
              placeholder="Select Teacher"
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Subject <span className="text-red-500">*</span>
            </label>
            <Select
              options={subjects?.map((subject) => ({
                value: subject.id,

                label: subject.subjectName || subject.name,
              }))}
              value={subjects
                ?.map((subject) => ({
                  value: subject.id,

                  label: subject.subjectName || subject.name,
                }))
                .find((subject) => subject.value === subjectId)}
              onChange={(selected) => setSubjectId(selected?.value)}
              placeholder="Select Subject"
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Class & Section <span className="text-red-500">*</span>
            </label>
            <Select
              options={classes?.map((c) => ({
                value: c.classRoomId || c.id,

                label:
                  c.classroomName ||
                  `${c.className || ""}
         ${c.sectionName || c.section || ""}`,
              }))}
              value={classes
                ?.map((c) => ({
                  value: c.classRoomId || c.id,

                  label:
                    c.classroomName ||
                    `${c.className || ""}
         ${c.sectionName || c.section || ""}`,
                }))
                .find((c) => c.value === classRoomId)}
              onChange={(selected) => setClassRoomId(selected?.value)}
              placeholder="Select Class & Section"
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Attendance Date <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-1">
              <DatePicker
                selected={attendanceDate}
                onChange={(date) => setAttendanceDate(date)}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select Date"
                className="
                          w-full
                          border
                          border-gray-300
                          rounded-md
                          px-3
                          py-[9px]
                          text-[13px]
                          outline-none
                          focus:ring-2
                          focus:ring-indigo-200
                        "
                wrapperClassName="w-full"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-2">Select</th>
                <th className="p-2 text-left">S.No.</th>
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Roll Number</th>
              </tr>
            </thead>

            <tbody>
              {(() => {
                const indexOfLast = currentPage * rowsPerPage;
                const indexOfFirst = indexOfLast - rowsPerPage;
                const currentStudents = studentsData.slice(
                  indexOfFirst,
                  indexOfLast,
                );
                return currentStudents.map((s, index) => (
                  <tr
                    key={s.studentId}
                    className="
border-b
border-gray-200
hover:bg-gray-50
transition-colors
"
                  >
                    <td className="p-2 text-center">
                      <div
                        onClick={() => handleSelect(s.studentId)}
                        className={`w-4 h-4 mx-auto flex items-center justify-center rounded-xs border cursor-pointer transition
                                                      ${
                                                        selected.includes(
                                                          s.studentId,
                                                        )
                                                          ? "bg-indigo-600 border-indigo-600"
                                                          : "border-gray-400 bg-white"
                                                      }`}
                      >
                        {selected.includes(s.studentId || s.id) && (
                          <Check className="text-white w-4 h-4" />
                        )}
                      </div>
                    </td>
                    <td className="p-2">{indexOfFirst + index + 1}</td>
                    <td className="p-2">
                      {s.studentName || s.name || s.fullName}
                    </td>
                    <td className="p-2">
                      {s.rollNumber || s.roll || s.rollNo || s.admissionNo}
                    </td>
                  </tr>
                ));
              })()}

              {(() => {
                const indexOfLast = currentPage * rowsPerPage;
                const indexOfFirst = indexOfLast - rowsPerPage;
                const currentStudents = studentsData.slice(
                  indexOfFirst,
                  indexOfLast,
                );
                return currentStudents.length === 0 && studentsData.length > 0
                  ? true
                  : false;
              })() && (
                <tr>
                  <td
                    colSpan="4"
                    className="
px-3
py-6
text-center
text-gray-400
"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(() => {
          const indexOfLast = currentPage * rowsPerPage;
          const indexOfFirst = indexOfLast - rowsPerPage;
          const totalPages = Math.ceil(studentsData.length / rowsPerPage);
          return (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                setCurrentPage={setCurrentPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          );
        })()}

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
bg-indigo-600
hover:bg-indigo-700
text-white
font-medium
px-5
py-[7px]
rounded-md
text-[13px]
transition-colors
disabled:opacity-50
flex
items-center
gap-2
"
          >
            {loading ? "Submitting..." : "Submit"}
            <SendHorizonalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
