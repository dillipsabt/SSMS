import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchStudentExamResults,
  fetchAcademicYears,
  fetchExaminationTypes,
  clearSuccess,
  clearError,
} from "../../features/student/studentExams/studentExamSlice";

const StudentExamReports = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [examType, setExamType] = useState("");
  //const [showResults, setShowResults] = useState(false);
  const dispatch = useDispatch();

  const {
    examResults = [],
    academicYears = [],
    examinationTypes = [],
    loading = false,
    error = null,
    success = false,
  } = useSelector((state) => state.studentExam || {});

  const authData = useSelector((state) => state.auth);

  const studentId =
    authData?.user?.profileId ||
    authData?.profileId ||
    authData?.loginData?.profileId;

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Show toast on success/error
  useToastMessage({
    success,
    error,
    successMessage: "Exam reports fetched successfully! ✅",
    clearSuccess,
    clearError,
  });

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchExaminationTypes());
  }, [dispatch]);

  // const examResults = [
  //   {
  //     subject: "Telugu",
  //     obtainedMarks: 93,
  //     maxMarks: 100,
  //     percentage: 93,
  //     grade: "A+",
  //     status: "Pass",
  //   },
  //   {
  //     subject: "Hindi",
  //     obtainedMarks: 81,
  //     maxMarks: 100,
  //     percentage: 81,
  //     grade: "A",
  //     status: "Pass",
  //   },
  //   {
  //     subject: "English",
  //     obtainedMarks: 55,
  //     maxMarks: 100,
  //     percentage: 55,
  //     grade: "C",
  //     status: "Pass",
  //   },
  //   {
  //     subject: "Maths",
  //     obtainedMarks: 78,
  //     maxMarks: 100,
  //     percentage: 78,
  //     grade: "B+",
  //     status: "Pass",
  //   },
  //   {
  //     subject: "Science",
  //     obtainedMarks: 64,
  //     maxMarks: 100,
  //     percentage: 64,
  //     grade: "B",
  //     status: "Pass",
  //   },
  //   {
  //     subject: "Social",
  //     obtainedMarks: 25,
  //     maxMarks: 100,
  //     percentage: 25,
  //     grade: "D",
  //     status: "Fail",
  //   },
  // ];

  // Calculate totals
  const totalObtained = examResults.reduce(
    (sum, r) => sum + r.obtainedMarks,
    0,
  );
  const totalMax = examResults.reduce((sum, r) => sum + r.totalMarks, 0); //const totalPercentage = Math.round((totalObtained / totalMax) * 100);
  const totalPercentage =
    totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  // Calculate overall grade
  const getOverallGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  // Check if any subject failed
  const hasFailed = examResults.some((r) => r.status === "Fail");

  const handleSearch = () => {
    if (!academicYear || !examType) {
      return;
    }

    dispatch(
      fetchStudentExamResults({
        studentId,
        academicYearId: academicYear,
        examinationTypeId: examType,
      }),
    );

    //setShowResults(true);
  };
  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">Exam Reports</h1>
      <p className="text-sm text-gray-500 mb-6">Exams / Exam Reports</p>

      {/* MAIN CONTAINER */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {/* SECTION HEADER */}
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-md font-semibold text-gray-700">Exam Reports</h2>
        </div>

        <div className="p-4">
          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year<span className="text-red-500">*</span>
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Academic Year</option>

                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type<span className="text-red-500">*</span>
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Exam Type</option>

                {examinationTypes.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.examType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          {/* RESULTS TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-4 py-3 text-left font-medium">Subject</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Obtained Marks (100)
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Percentage (%)
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Grade</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : examResults && examResults.length > 0 ? (
                  <>
                    {examResults.map((result, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-800">
                          {result.subjectName}
                        </td>

                        <td className="px-4 py-3 text-center text-gray-600">
                          {result.obtainedMarks}
                        </td>

                        <td className="px-4 py-3 text-center text-gray-600">
                          {result.percentage}%
                        </td>

                        <td className="px-4 py-3 text-center text-gray-600">
                          {result.grade}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              result.status === "PASS"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* TOTAL ROW */}
                    <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                      <td className="px-4 py-3 text-gray-800">Total</td>

                      <td className="px-4 py-3 text-center text-gray-800">
                        {totalObtained}
                      </td>

                      <td className="px-4 py-3 text-center text-gray-800">
                        {totalPercentage}%
                      </td>

                      <td className="px-4 py-3 text-center text-gray-800">
                        {getOverallGrade(totalPercentage)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            hasFailed
                              ? "bg-red-100 text-red-500"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {hasFailed ? "FAIL" : "PASS"}
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500 font-medium"
                    >
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExamReports;
