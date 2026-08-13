import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from "recharts";
import studentReportImg from "../../assets/student_report.png";
import studentReportLogo from "../../assets/school_logo_card.png";

const GRADING_SYSTEM = [
  ["A1", "91 - 100", "Outstanding", "bg-[#48ab5c]"],
  ["A2", "81 - 90", "Excellent", "bg-[#4bad52]"],
  ["B1", "71 - 80", "Very Good", "bg-[#3170b3]"],
  ["B2", "61 - 70", "Good", "bg-[#4b7eac]"],
  ["C1", "51 - 60", "Satisfactory", "bg-[#ee9917]"],
  ["C2", "41 - 50", "Average", "bg-[#efa523]"],
  ["D", "33 - 40", "Below Average", "bg-[#da5737]"],
  ["E", "0 - 32", "Needs Improvement", "bg-[#d54b46]"],
];

const defaultReportData = {
  studentName: "Hurain",
  fatherName: "-",
  rollNumber: "1 A-002",
  gradeClass: "1 A",
  examTerm: "Annual Examination",
  academicYear: "2025-27",
  attendance: {
    month: "_",
    daysPresent: "_",
    daysAbsent: "_",
    total: "_",
  },
  teacherRemarks: "Strong performance in English, Science, Telugu. Excellent performance in Hindi.",
  subjects: [
    { name: "English", maxMarks: 100, marksObtained: 75, percentage: 75, grade: "B1", status: "PASS", remarks: "1st remarks" },
    { name: "Hindi", maxMarks: 100, marksObtained: 90, percentage: 90, grade: "A1", status: "PASS", remarks: "Good" },
    { name: "Science", maxMarks: 30, marksObtained: 18, percentage: 60, grade: "B2", status: "PASS", remarks: "test" },
    { name: "Telugu", maxMarks: 100, marksObtained: 65, percentage: 65, grade: "B2", status: "PASS", remarks: "improve" },
  ],
};

const getOverallGrade = (percentage) => {
  if (percentage >= 91) return "A1";
  if (percentage >= 81) return "A2";
  if (percentage >= 71) return "B1";
  if (percentage >= 61) return "B2";
  if (percentage >= 51) return "C1";
  if (percentage >= 41) return "C2";
  if (percentage >= 33) return "D";
  return "E";
};

const formatPercentage = (value) => Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const getOverallRemarks = (subjects, fallback) => {
  const gradingRemarks = [
    [91, "Outstanding"],
    [81, "Excellent"],
    [71, "Very Good"],
    [61, "Good"],
    [51, "Satisfactory"],
    [41, "Average"],
    [33, "Below Average"],
    [0, "Needs Improvement"],
  ];
  const remarksByGrade = new Map();
  subjects.forEach((subject) => {
    const percentage = Number(subject.percentage || 0);
    const remark = gradingRemarks.find(([minimum]) => percentage >= minimum)[1];
    const subjectNames = remarksByGrade.get(remark) || [];
    subjectNames.push(subject.name);
    remarksByGrade.set(remark, subjectNames);
  });
  const calculatedRemarks = Array.from(remarksByGrade, ([remark, subjectNames]) => `${remark} performance in ${subjectNames.join(", ")}`).join(". ");
  return subjects.length ? `${calculatedRemarks}.` : fallback || "Consistent performance across subjects.";
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
    teacherRemarks,
  } = reportData;
  const schoolName = reportData.schoolName || "EDUPORTAL ACADEMY";
  const schoolAddress = reportData.schoolAddress || reportData.address || "123 Academic Way, Education District";
  const schoolLogo = reportData.schoolLogo || studentReportLogo;
  const studentPhoto = reportData.studentPhoto || studentReportImg;
  const attendance = {
    month: "_",
    daysPresent: "_",
    daysAbsent: "_",
    total: "_",
    ...(reportData.attendance || {}),
  };
  const subjectRows = (reportData.subjects || []).map((subject) => {
    const marksObtained = subject.marksObtained ?? subject.obtainedMarks ?? 0;
    const maxMarks = subject.maxMarks ?? subject.totalMarks ?? 100;
    const percentage = subject.percentage ?? (maxMarks ? (marksObtained / maxMarks) * 100 : 0);
    return {
      name: subject.name ?? subject.subjectName ?? "-",
      marksObtained,
      maxMarks,
      percentage,
      grade: subject.grade ?? "-",
      status: subject.status ?? "-",
      remarks: subject.remarks ?? subject.remark ?? "-",
    };
  });

  const totalMaxMarks = subjectRows.reduce((sum, subject) => sum + Number(subject.maxMarks || 0), 0);
  const totalObtainedMarks = subjectRows.reduce((sum, subject) => sum + Number(subject.marksObtained || 0), 0);
  const percentageValue = totalMaxMarks ? (totalObtainedMarks / totalMaxMarks) * 100 : 0;
  const percentage = formatPercentage(percentageValue);
  const overallGrade = getOverallGrade(percentageValue);
  const passSubjects = subjectRows.filter((subject) => String(subject.status).toUpperCase() === "PASS").length;
  const failSubjects = subjectRows.filter((subject) => String(subject.status).toUpperCase() === "FAIL").length;
  const highest = subjectRows.length ? Math.max(...subjectRows.map((subject) => Number(subject.marksObtained || 0))) : 0;
  const lowest = subjectRows.length ? Math.min(...subjectRows.map((subject) => Number(subject.marksObtained || 0))) : 0;
  const average = subjectRows.length ? totalObtainedMarks / subjectRows.length : 0;
  const overallRemarks = getOverallRemarks(subjectRows, teacherRemarks);

  return (
    <div className="mx-auto my-2 max-w-5xl rounded-2xl border border-gray-200 bg-white p-3 font-sans shadow-xl">
      <header className="rounded-2xl border border-gray-200 px-4 pt-3">
        <div className="flex items-center justify-start gap-5">
          <img
            src={schoolLogo}
            className="h-24 w-24 shrink-0 rounded-xl border border-gray-300 object-cover"
            alt="School Logo"
          />
          <div className="text-left">
            <h1 className="text-2xl font-bold text-[#14233e]">{schoolName}</h1>
            <p className="text-xs text-gray-500">{schoolAddress}</p>
            <p className="text-xs font-medium text-[#be8f37]">EDUPORTAL · ACADEMIC RECORD</p>
          </div>
        </div>
        <div className="mt-2 border-t border-gray-200 pt-1 text-center">
          <h2 className="text-lg font-bold text-[#14233e]">REPORT CARD</h2>
          <p className="text-xs text-gray-500">
            ACADEMIC YEAR : {academicYear} <span className="px-2">·</span> {examTerm}
          </p>
        </div>
        <div className="mt-2 h-1 rounded-full bg-[#d99d19]" />
      </header>

      <section className="min-h-[150px] rounded-2xl border border-gray-200 bg-[#f7f9fc] p-3">
        <h3 className="border-b border-gray-300 pb-2 text-center text-sm font-bold text-[#14233e]">STUDENT INFORMATION</h3>
        <div className="flex gap-4 pt-3">
          <img
            src={studentPhoto}
            className="h-20 w-20 shrink-0 rounded-lg border border-gray-300 object-cover"
            alt="Student"
          />
          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
            <div>
              <p className="text-[10px] text-gray-500">STUDENT NAME</p>
              <p className="text-sm font-semibold text-[#14233e]">{studentName}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">FATHER NAME</p>
              <p className="text-sm font-semibold text-[#14233e]">{reportData.fatherName || "-"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">CLASS / SECTION</p>
              <p className="text-sm font-semibold text-[#14233e]">{gradeClass}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">ROLL NUMBER</p>
              <p className="text-sm font-semibold text-[#14233e]">{rollNumber}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-gray-200">
          <h3 className="bg-[#14233e] px-3 py-2 text-center text-sm font-bold text-white">SUBJECT-WISE PERFORMANCE</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed text-[11px]">
              <colgroup>
                <col className="w-[19%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[10%]" />
                <col className="w-[11%]" />
                <col className="w-[13%]" />
                <col className="w-[21%]" />
              </colgroup>
              <thead className="bg-[#275ca6] text-white">
                <tr>
                  {["Subject", "Obtained", "Maximum", "%", "Grade", "Status", "Remarks"].map((header) => (
                    <th key={header} className="border-r border-white/30 px-1 py-2 text-center font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjectRows.map((subject) => (
                  <tr key={subject.name} className="border-b border-gray-200 odd:bg-[#eef4fc]">
                    <td className="px-1 py-2 text-center font-semibold text-[#2a3444]">{subject.name}</td>
                    <td className="px-1 py-2 text-center">{subject.marksObtained}</td>
                    <td className="px-1 py-2 text-center">{subject.maxMarks}</td>
                    <td className="px-1 py-2 text-center">{formatPercentage(subject.percentage)}%</td>
                    <td className="px-1 py-2 text-center font-semibold">{subject.grade}</td>
                    <td className={`px-1 py-2 text-center font-semibold ${String(subject.status).toUpperCase() === "FAIL" ? "text-red-600" : "text-emerald-600"}`}>{subject.status}</td>
                    <td className="px-1 py-2 text-center">{subject.remarks}</td>
                  </tr>
                ))}
                <tr className="bg-[#edf8f3] font-bold text-[#14233e]">
                  <td className="px-1 py-2 text-center">TOTAL</td>
                  <td className="px-1 py-2 text-center">{totalObtainedMarks}</td>
                  <td className="px-1 py-2 text-center">{totalMaxMarks}</td>
                  <td className="px-1 py-2 text-center">{percentage}%</td>
                  <td className="px-1 py-2 text-center">{overallGrade}</td>
                  <td className="px-1 py-2 text-center">{failSubjects ? "FAIL" : "PASS"}</td>
                  <td className="px-1 py-2 text-center">Final outcome</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200">
          <h3 className="bg-[#d99d19] px-3 py-2 text-center text-sm font-bold text-white">GRADING SYSTEM</h3>
          <table className="w-full text-[11px]">
            <thead className="bg-[#1f3e6f] text-white">
              <tr>
                <th className="w-1/4 border-r border-white/30 px-1 py-2">Grade</th>
                <th className="w-[35%] border-r border-white/30 px-1 py-2">Marks Range</th>
                <th className="px-1 py-2">Performance</th>
              </tr>
            </thead>
            <tbody>
              {GRADING_SYSTEM.map(([grade, range, performance, badge]) => (
                <tr key={grade} className="border-b border-gray-200 odd:bg-[#f7f9fc]">
                  <th className="border-r border-gray-200 px-1 py-1.5 text-center font-semibold text-white"><span className={`inline-flex min-w-8 items-center justify-center rounded px-1 py-0.5 ${badge}`}>{grade}</span></th>
                  <td className="border-r border-gray-200 px-1 py-1.5 text-center text-[#2a3444]">{range}</td>
                  <td className="px-1 py-1.5 text-center text-[#2a3444]">{performance}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-2 py-2 text-center text-[10px] font-medium text-[#14233e]">Note. - * Subjects are additional (Skill Subjects) &amp; are not added in total.</p>
        </section>
      </div>

      <section className="mt-1">
        <div className="grid gap-3 lg:grid-cols-[0.85fr_1.65fr]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#f7f9fc]">
            <h3 className="bg-[#14233e] px-3 py-2 text-center text-sm font-bold text-white">PERFORMANCE SNAPSHOT</h3>
            <div className="p-3">
              <div className="flex items-center justify-center gap-3">
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(#238b69 ${percentageValue}%, #dce2eb ${percentageValue}% 100%)` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold text-[#14233e]">{formatPercentage(percentageValue)}%</div>
                </div>
                <div className="min-w-0 flex-1 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 whitespace-nowrap"><span className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full bg-[#238b69]" />Obtained</span><strong className="shrink-0">{totalObtainedMarks}</strong></div>
                  <div className="flex items-center justify-between gap-2 whitespace-nowrap"><span className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full bg-[#dce2eb]" />Remaining</span><strong className="shrink-0">{Math.max(0, totalMaxMarks - totalObtainedMarks)}</strong></div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs font-bold text-[#14233e]">MARKS PERCENTAGE</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <h4 className="bg-[#14233e] px-3 py-2 text-center text-sm font-bold text-white">SUBJECT PERFORMANCE</h4>
            <div className="p-3">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={subjectRows} margin={{ top: 18, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#e0e6ee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={(value) => String(value).slice(0, 7)} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Bar dataKey="percentage" fill="#238b69" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="percentage" position="top" formatter={(value) => `${Math.round(value)}%`} style={{ fill: "#14233e", fontSize: 11, fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[#eef4fc]">
          <h3 className="bg-[#14233e] px-3 py-2 text-center text-sm font-bold text-white">PERFORMANCE ANALYSIS</h3>
          <div className="grid grid-cols-4 gap-2 p-3 md:grid-cols-7">
            {[
              ["Overall %", `${percentage}%`],
              ["Subjects", subjectRows.length],
              ["Pass", passSubjects],
              ["Fail", failSubjects],
              ["Highest", highest],
              ["Lowest", lowest],
              ["Average", average.toFixed(1)],
            ].map(([label, value]) => (
              <div key={label} className="text-center">
                <p className="text-[10px] text-gray-500">{label}</p>
                <p className="mt-1 text-base font-bold text-[#14233e]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[#fbf7ed]">
          <h3 className="bg-[#14233e] px-3 py-2 text-center text-xs font-bold text-white">OVERALL REMARKS</h3>
          <div className="min-h-[66px] p-3 text-xs font-semibold text-[#2a3444]">{overallRemarks}</div>
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section className="h-[132px] overflow-hidden rounded-2xl border border-gray-200">
          <h3 className="bg-[#14233e] px-3 py-2 text-center text-sm font-bold text-white">ATTENDANCE</h3>
          <table className="w-full text-[10px]">
            <thead className="bg-[#eef4fc]">
              <tr>
                <th className="w-1/2 border-r border-gray-300 px-2 py-0.5 text-center">Particulars</th>
                <th className="px-2 py-0.5 text-center">{attendance.month}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Days Present", attendance.daysPresent],
                ["Days Absent", attendance.daysAbsent],
                ["Total", attendance.total],
              ].map(([label, value]) => (
                <tr key={label} className="border-t border-gray-200">
                  <th className="border-r border-gray-300 px-2 py-0.5 text-center font-semibold text-[#2a3444]">{label}</th>
                  <td className="px-2 py-0.5 text-center font-semibold text-[#2a3444]">{value === "_" ? "" : value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex min-h-[132px] flex-col items-center justify-end rounded-2xl border border-transparent px-3 pb-2">
          <div className="flex h-16 w-full items-end justify-center border-b-2 border-gray-300 border-dashed text-sm italic text-gray-400">Principal Signature</div>
          <p className="mt-2 text-xs font-bold tracking-wider text-[#14233e]">PRINCIPAL</p>
        </section>
      </div>
    </div>
  );
}
