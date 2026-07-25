import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import {
  LineChart, Line, CartesianGrid, XAxis, Tooltip,
  BarChart, Bar, YAxis, ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentPerformance,
  fetchAcademicYears,
  fetchStudents,
  fetchClasses,
  fetchExaminationTypes,
} from "../../features/Admin/StudentWiseOverallResults/StudentWiseOverallResultsSlice";

export default function StudentOverallResults() {
  const dispatch = useDispatch();
  const { performanceData, academicYears, students: studentList, classes, examinationTypes, loading } = useSelector(
    (state) => state.StudentWiseOverallResults
  );

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchStudents());
    dispatch(fetchClasses());
    dispatch(fetchExaminationTypes());
  }, [dispatch]);

  const handleSearch = () => {
    if (selectedStudent && selectedAcademicYear && selectedClass) {
      const params = {
        studentId: selectedStudent,
        academicYearId: selectedAcademicYear,
        classId: selectedClass,
      };
      if (selectedExamType) {
        params.examTypeId = selectedExamType;
      }
      dispatch(fetchStudentPerformance(params));
    }
  };

  const handleViewMarks = (data) => {
    setModalData(data);
    setOpen(true);
  };

  const overallData = performanceData?.examTypePerformance?.map((exam) => ({
    name: exam.examTypeName,
    value: exam.percentage || 0,
  })) || [];

  const subjectData = performanceData?.subjectPerformance?.map((subject) => ({
    name: subject.subjectName,
    value: subject.percentage || 0,
  })) || [];

  return (
    <div className="page-wrap p-4 sm:p-6">
      {/* HEADER */}
      <h2 className="text-base sm:text-[18px] font-semibold text-[#333333]">Student Wise Overall Results</h2>
      <p className="text-xs sm:text-[12px] text-gray-500 mb-4">Exam & Results / Results List</p>

      {/* MAIN CARD */}
      <div className="card p-3 sm:p-4">
        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-[13px] font-medium text-gray-700 mb-3">Student Wise Results</p>

          {/* FILTER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
            <div>
              <label className="text-[10px] sm:text-[11px] text-gray-600 mb-1 block font-medium">Academic Year *</label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="form-select w-full text-[12px]"
              >
                <option value="">Select</option>
                {academicYears?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year || year.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] sm:text-[11px] text-gray-600 mb-1 block font-medium">Student *</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="form-select w-full text-[12px]"
              >
                <option value="">Select</option>
                {studentList?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] sm:text-[11px] text-gray-600 mb-1 block font-medium">Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="form-select w-full text-[12px]"
              >
                <option value="">Select</option>
                {classes?.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.classCode || cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] sm:text-[11px] text-gray-600 mb-1 block font-medium">Exam Type</label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="form-select w-full text-[12px]"
              >
                <option value="">Select</option>
                {examinationTypes?.map((examType) => (
                  <option key={examType.id} value={examType.id}>
                    {examType.examType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button onClick={handleSearch} disabled={loading} className="btn-primary w-full">
                🔍 Search
              </button>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="border border-gray-200 rounded p-3 sm:p-4">
            <p className="text-[11px] sm:text-[12px] font-medium mb-2">Overall Performance</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={overallData}>
                <Line type="monotone" dataKey="value" stroke="#4f39f6" strokeWidth={2} dot={{ r: 4 }} />
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-gray-200 rounded p-3 sm:p-4">
            <p className="text-[11px] sm:text-[12px] font-medium mb-2">Subject wise Performance</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={subjectData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Bar dataKey="value" fill="#4f39f6" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-[11px] sm:text-[12px] min-w-full">
            <thead className="thead-row">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">S.No.</th>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Roll Number</th>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Student Name</th>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Results Date</th>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Class</th>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Exam Type</th>
                <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">View</th>
              </tr>
            </thead>
            <tbody>
              {performanceData ? (
                <tr className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2">1</td>
                  <td className="px-2 sm:px-3 py-2">{performanceData?.studentId || "-"}</td>
                  <td className="px-2 sm:px-3 py-2">{performanceData?.studentName || "-"}</td>
                  <td className="px-2 sm:px-3 py-2">{performanceData?.resultsDate || "-"}</td>
                  <td className="px-2 sm:px-3 py-2">{performanceData?.classCode || "-"}</td>
                  <td className="px-2 sm:px-3 py-2">{performanceData?.examTypePerformance?.[0]?.examTypeName || "-"}</td>
                  <td className="px-2 sm:px-3 py-2 text-center">
                    <button
                      title="View marks"
                      onClick={() => handleViewMarks(performanceData)}
                      className="text-brand-600 hover:text-brand-700 transition"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="7" className="px-2 sm:px-3 py-3 sm:py-4 text-center text-gray-500 text-[11px]">
                    {loading ? "Loading..." : "No data available. Please search to view results."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end gap-2 mt-3 sm:mt-4 text-[11px] sm:text-[12px]">
          <button className="btn-secondary px-3 py-1.5 sm:py-2 text-[11px]">Prev</button>
          <button className="btn-primary px-3 py-1.5 sm:py-2 text-[11px]">Next</button>
        </div>
      </div>

      {/* MODAL */}
      {open && modalData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[900px] bg-white rounded shadow-lg max-h-[90vh] flex flex-col">

            <div className="bg-gradient-to-r from-brand-600 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center rounded-t shrink-0">
              <span className="text-xs sm:text-sm font-medium">Student Marks</span>
              <button onClick={() => setOpen(false)} className="hover:text-gray-200 transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-gray-50 border rounded px-3 sm:px-4 py-2 sm:py-3 mb-3 sm:mb-4">
                <div><p className="text-gray-600 text-[10px] sm:text-[11px]">Roll Number</p><p className="font-semibold text-[11px] sm:text-[12px]">{modalData?.studentId || "-"}</p></div>
                <div><p className="text-gray-600 text-[10px] sm:text-[11px]">Student Name</p><p className="font-semibold text-[11px] sm:text-[12px]">{modalData?.studentName || "-"}</p></div>
                <div><p className="text-gray-600 text-[10px] sm:text-[11px]">Class</p><p className="font-semibold text-[11px] sm:text-[12px]">{modalData?.classCode || "-"}</p></div>
                <div><p className="text-gray-600 text-[10px] sm:text-[11px]">Exam Type</p><p className="font-semibold text-[11px] sm:text-[12px]">{modalData?.examTypePerformance?.[0]?.examTypeName || "-"}</p></div>
              </div>

              <div className="border border-gray-200 rounded overflow-x-auto">
                <table className="w-full text-[10px] sm:text-[12px] min-w-full">
                  <thead className="thead-row">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Subject</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Obtained Marks</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Percentage</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Grade</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-[11px] font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData?.subjectPerformance?.map((subject, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="px-2 sm:px-3 py-2">{subject.subjectName}</td>
                        <td className="px-2 sm:px-3 py-2">{subject.obtainedMarks}</td>
                        <td className="px-2 sm:px-3 py-2">{subject.percentage?.toFixed(2)}%</td>
                        <td className="px-2 sm:px-3 py-2">{subject.grade}</td>
                        <td className="px-2 sm:px-3 py-2">
                          <span className={`px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] rounded font-medium inline-block ${
                            subject.status?.toLowerCase() === "pass" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}>
                            {subject.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50 font-semibold">
                      <td className="px-2 sm:px-3 py-2">Total</td>
                      <td className="px-2 sm:px-3 py-2">
                        {modalData?.subjectPerformance?.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0)}
                      </td>
                      <td className="px-2 sm:px-3 py-2">
                        {(modalData?.subjectPerformance?.reduce((sum, s) => sum + (s.percentage || 0), 0) / (modalData?.subjectPerformance?.length || 1)).toFixed(2)}%
                      </td>
                      <td className="px-2 sm:px-3 py-2">
                        {modalData?.overallGrade || "-"}
                      </td>
                      <td className="px-2 sm:px-3 py-2">
                        <span className={`px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] rounded font-medium inline-block ${
                          modalData?.overallStatus?.toLowerCase() === "pass" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}>
                          {modalData?.overallStatus || "-"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 mt-3 sm:mt-4">
                <button onClick={() => setOpen(false)} className="btn-secondary px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
