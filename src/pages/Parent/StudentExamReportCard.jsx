import React from "react";
// Import Recharts components for the bar chart
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import studentReportImg from "../../assets/student_report.png";
import studentReportLogo from "../../assets/school_logo_card.png";

// Mock data - Fixed by adding maxMarks to each subject
const defaultReportData = {
  studentName: "Alex Mercer",
  rollNumber: "2026-A12",
  gradeClass: "Class 10 - Section B",
  examTerm: "Mid Term Examination",
  academicYear: "2025 - 2026",
  // attendance: "95%",
  teacherRemarks:
    "Excellent performance across all technical subjects. Outstanding consistency!",
  subjects: [
    {
      name: "Telugu",
      maxMarks: 100,
      marksObtained: 92,
      percentage: 90,
      grade: "A+",
      status: "Pass",
    },
    {
      name: "Hindi",
      maxMarks: 100,
      marksObtained: 88,
      percentage: 80,
      grade: "A",
      status: "Pass",
    },
    {
      name: "English",
      maxMarks: 100,
      marksObtained: 80,
      percentage: 80,
      grade: "A",
      status: "Pass",
    },
    {
      name: "Maths",
      maxMarks: 100,
      marksObtained: 65,
      percentage: 60,
      grade: "C",
      status: "Pass",
    },
    {
      name: "Science",
      maxMarks: 100,
      marksObtained: 55,
      percentage: 50,
      grade: "C",
      status: "Pass",
    },
    {
      name: "Social",
      maxMarks: 100,
      marksObtained: 70,
      percentage: 70,
      grade: "B",
      status: "Pass",
    },
  ],
};

// Helper to determine overall letter grade based on aggregate percentage
const getOverallGrade = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  return "F";
};

export default function StudentExamReportCard({
  reportData = defaultReportData,
}) {
  const {
    studentName,
    rollNumber,
    gradeClass,
    examTerm,
    academicYear,
    subjects,
    teacherRemarks,
    // attendance,
  } = reportData;

  // Calculations
  const totalMaxMarks = subjects.reduce(
    (sum, sub) => sum + (sub.maxMarks || 100),
    0,
  );
  const totalObtainedMarks = subjects.reduce(
    (sum, sub) => sum + sub.marksObtained,
    0,
  );
  const percentage = ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1);
  const overallGrade = getOverallGrade(parseFloat(percentage));

  // Helper to determine status badge color
  const getPercentageColor = (pct) => {
    if (pct >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (pct >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="max-w-4xl mx-auto my-2 p-2 bg-white border border-gray-200 rounded-2xl shadow-xl font-sans">
      {/* 1. Header Section */}
      <div className="border-b pb-3">
        <div className="flex items-center justify-center gap-3">
          <img
            src={studentReportLogo}
            className="w-20 h-20 rounded-xl object-cover border border-gray-300 shadow-sm shrink-0"
            alt="School Logo"
          />

          <div className="text-center">
            <h1 className="text-xl font-bold">EDUPORTAL ACADEMY</h1>
            <p className="text-xs text-gray-500">
              Empowering Minds, Shaping Futures
            </p>
            <p className="text-[11px]">123 Academic Way, Education District</p>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span>ACADEMIC YEAR {academicYear}</span>
          <span className="font-semibold uppercase">{examTerm}</span>
        </div>
      </div>

      {/* 2. Student Meta Information */}
      <div className="flex gap-4 p-3 my-4 rounded-xl bg-gray-50 pb-3">
        <img
          src={studentReportImg}
          className="w-25 h-30 rounded-xl object-cover border border-gray-300 shadow-sm shrink-0"
          alt="Student"
        />
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
          <div>
            <p className="text-gray-500 text-xs">STUDENT FULL NAME</p>
            <p className="font-semibold">{studentName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">STUDENT ID / ROLL NO</p>
            <p className="font-semibold">{rollNumber}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">CLASS/SECTION</p>
            <p className="font-semibold">{gradeClass}</p>
          </div>
          {/* <div>
            <p className="text-gray-500 text-xs">ATTENDANCE</p>
            <p className="font-semibold">{attendance || "N/A"}</p>
          </div> */}
        </div>
      </div>

      {/* 4. Detailed Marks Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3.5 text-sm font-semibold text-gray-700"
              >
                Subject
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-sm font-semibold text-gray-700 text-center"
              >
                Obtained Marks
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-sm font-semibold text-gray-700 text-center"
              >
                Percentage
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-sm font-semibold text-gray-700 text-center"
              >
                Grade
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-sm font-semibold text-gray-700 hidden md:table-cell"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {subjects.map((subject, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {subject.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">
                  {subject.marksObtained}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                  {subject.percentage}%
                </td>
                <td className="px-6 py-4 text-sm text-center font-bold text-indigo-600">
                  {subject.grade}
                </td>
                <td className="px-6 py-4 text-sm hidden md:table-cell">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${subject.status === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {subject.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-gray-100">
              <td className="px-6 py-4 text-sm text-gray-900">Total</td>
              {/* Aligned under Obtained Marks */}
              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                {totalObtainedMarks} / {totalMaxMarks}
              </td>
              {/* Aligned under Percentage */}
              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                {percentage}%
              </td>
              {/* Aligned under Grade */}
              <td className="px-6 py-4 text-sm text-center text-indigo-600 font-extrabold">
                {overallGrade}
              </td>
              {/* Aligned under Status */}
              <td className="px-6 py-4 text-sm hidden md:table-cell">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${percentage >= 35 ? "bg-green-500" : "bg-red-500"}`}
                >
                  {percentage >= 35 ? "Pass" : "Fail"}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Recharts Analytics Section */}
      <div className="mb-8 p-4 border border-gray-100 rounded-xl bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 text-center">
          Subject Analytics
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={subjects}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar
              dataKey="marksObtained"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              name="Marks Obtained"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between shadow-sm">
          <span className="text-sm font-medium text-gray-500">Total Marks</span>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-gray-900">
              {totalObtainedMarks}
            </span>
            <span className="text-md font-semibold text-gray-400 ml-1">
              / {totalMaxMarks}
            </span>
          </div>
        </div>

        <div
          className={`p-4 border rounded-xl flex flex-col justify-between shadow-sm ${getPercentageColor(parseFloat(percentage))}`}
        >
          <span className="text-sm font-medium opacity-80">
            Aggregate Percentage
          </span>
          <div className="mt-2 text-3xl font-extrabold">{percentage}%</div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between shadow-sm">
          <span className="text-sm font-medium text-gray-500">
            Final Outcome
          </span>
          <div
            className={`mt-2 text-3xl font-bold ${percentage >= 35 ? "text-green-600" : "text-red-600"}`}
          >
            {percentage >= 35 ? "PASSED" : "FAILED"}
          </div>
        </div>
      </div>

      {/* 5. Remarks & Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
            Class Teacher's Remarks
          </h3>
          <blockquote className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border-l-4 border-indigo-500 italic">
            "{teacherRemarks || "No remarks provided."}"
          </blockquote>
        </div>

        {/* Signature Placeholder */}
        <div className="flex flex-col justify-end items-center md:items-end mt-4 md:mt-0">
          <div className="w-48 text-center">
            <div className="h-12 border-b-2 border-gray-300 border-dashed mb-1 flex items-end justify-center">
              <span className="font-serif text-gray-400 italic text-sm">
                Principal Signature
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Authorized Stamp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
