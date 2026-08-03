import { useEffect, useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchClasses,
  fetchExaminationTypes,
  fetchExamResults,
  fetchStudentResultSummary,
  resetExamResultState,
} from "../../features/Admin/ExamResult/examResultSlice";
import StudentExamReportCard from "../Parent/StudentExamReportCard";

const getStudentId = (student) => student?.studentId || student?.id || student?.profileId;
const getStudentName = (student) => student?.studentName || student?.fullName || student?.name || "-";
const getHallTicket = (student) => student?.hallTicketNo || student?.hallTicketNumber || "-";
const getRollNumber = (student) => student?.rollNo || student?.rollNumber || "-";
const getStatus = (student) => String(student?.status || student?.passFail || "PASS").toUpperCase();

const StatusBadge = ({ value, tone = "green" }) => {
  const isPass = String(value).toUpperCase() === "PASS";
  const classes = tone === "fee"
    ? String(value).toLowerCase() === "completed"
      ? "bg-green-100 text-green-600"
      : "bg-amber-100 text-amber-600"
    : isPass
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  return <span className={`inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-xs font-medium ${classes}`}>{value || "-"}</span>;
};

export default function StudentWiseResultsList() {
  const dispatch = useDispatch();
  const { classes = [], examinationTypes = [], examResults = [], resultSummary, loading, error } = useSelector((state) => state.examResult || {});
  const [classId, setClassId] = useState("");
  const [examTypeId, setExamTypeId] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [reportStudent, setReportStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchExaminationTypes());
    return () => dispatch(resetExamResultState());
  }, [dispatch]);

  const rows = useMemo(() => examResults.filter((student) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || getStudentName(student).toLowerCase().includes(term) || getHallTicket(student).toLowerCase().includes(term) || getRollNumber(student).toLowerCase().includes(term);
    const matchesStatus = !status || getStatus(student) === status;
    return matchesSearch && matchesStatus;
  }), [examResults, search, status]);

  const handleSearch = async () => {
    if (!classId || !examTypeId || !date) {
      toast.error("Please select exam type, class, and date");
      return;
    }
    try {
      await dispatch(fetchExamResults({ classId, examinationTypeId: examTypeId, examDate: date })).unwrap();
      toast.success("Student results fetched successfully");
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to fetch student results");
    }
  };

  const openReportCard = async (student) => {
    setReportStudent({ student, loading: true });
    try {
      const data = await dispatch(fetchStudentResultSummary({
        classId: student.classId || classId,
        subjectId: student.subjectId,
        examinationTypeId: examTypeId,
        teacherId: student.teacherId,
      })).unwrap();
      setReportStudent({ student, data });
    } catch {
      setReportStudent({ student, data: null });
      toast.error("Unable to load report card");
    }
  };

  const reportData = reportStudent?.data;
  const subjects = (reportData?.dtoList || reportData?.subjects || (reportStudent ? [reportStudent.student] : [])).map((item) => ({
    name: item.subjectName || item.subject || "Subject",
    maxMarks: item.totalMarks || 100,
    marksObtained: item.obtainedMarks || 0,
    percentage: item.percentage || 0,
    grade: item.grade || "-",
    status: item.status || "Pass",
  }));

  return (
    <div className="page-wrap p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-800">Student Wise Exam Results</h1>
      <p className="mb-5 text-sm text-gray-500">Home / Exam Results / Student Wise Exam Results</p>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">Exam Result List</div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
            <label className="text-sm font-medium text-gray-700">Exam Type <span className="text-red-500">*</span><select value={examTypeId} onChange={(event) => setExamTypeId(event.target.value)} className="form-select mt-1 w-full"><option value="">Select Exam Type</option>{examinationTypes.map((exam) => <option key={exam.id} value={exam.id}>{exam.examType || exam.name}</option>)}</select></label>
            <label className="text-sm font-medium text-gray-700">Class Type <span className="text-red-500">*</span><select value={classId} onChange={(event) => setClassId(event.target.value)} className="form-select mt-1 w-full"><option value="">Select Class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.classCode || item.className || item.name}</option>)}</select></label>
            <label className="text-sm font-medium text-gray-700">Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="form-input mt-1 w-full" /></label>
            <button onClick={handleSearch} disabled={loading} className="btn-primary flex h-10 items-center justify-center gap-2 px-6"><Search size={16} />{loading ? "Loading..." : "Search"}</button>
          </div>
        </div>
      </div>

      <div className="card mt-4 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">Student Wise Results</div>
        <div className="p-4">
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-3">
            <div className="rounded-md bg-white px-3 py-2 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Exam Type</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{examinationTypes.find((item) => String(item.id) === String(examTypeId))?.examType || "-"}</p>
            </div>
            <div className="rounded-md bg-white px-3 py-2 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Class</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{classes.find((item) => String(item.id) === String(classId))?.classCode || "-"}</p>
            </div>
            <div className="rounded-md bg-white px-3 py-2 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Date</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{date || "-"}</p>
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Student Name / Hall Ticket No." className="form-input sm:w-72" />
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="form-select sm:w-36"><option value="">Status</option><option value="PASS">Pass</option><option value="FAIL">Fail</option></select>
          </div>

          {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error?.message || error}</div>}
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-indigo-50 text-gray-700"><tr><th className="px-3 py-3 text-left">S.No.</th><th className="px-3 py-3 text-left">Hall Ticket No.</th><th className="px-3 py-3 text-left">Student Name</th><th className="px-3 py-3 text-left">Roll No.</th><th className="px-3 py-3 text-left">Pass/Fail</th><th className="px-3 py-3 text-left">Fees Status</th><th className="px-3 py-3 text-left">Published</th><th className="px-3 py-3 text-left">Published Notes</th><th className="px-3 py-3 text-center">Download Report Card</th></tr></thead>
              <tbody>{rows.length ? rows.map((student, index) => <tr key={getStudentId(student) || index} className="border-t border-gray-200 hover:bg-gray-50"><td className="px-3 py-3">{index + 1}</td><td className="px-3 py-3">{getHallTicket(student)}</td><td className="px-3 py-3">{getStudentName(student)}</td><td className="px-3 py-3">{getRollNumber(student)}</td><td className="px-3 py-3"><StatusBadge value={getStatus(student)} /></td><td className="px-3 py-3"><StatusBadge value={student.feeStatus || student.feesStatus || "Pending"} tone="fee" /></td><td className="px-3 py-3">{student.published || "-"}</td><td className="px-3 py-3">{student.publishedNotes || student.notes || "-"}</td><td className="px-3 py-3 text-center"><button onClick={() => openReportCard(student)} className="text-indigo-600 hover:text-indigo-800" title="Download report card"><Download size={20} /></button></td></tr>) : <tr><td colSpan="9" className="py-10 text-center text-gray-500">{loading ? "Loading..." : "No student results found"}</td></tr>}</tbody>
            </table>
          </div>
        </div>
      </div>

      {reportStudent && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white"><div className="sticky top-0 z-10 flex items-center justify-between bg-indigo-600 px-5 py-3 text-white"><h2 className="font-semibold">Report Card</h2><button onClick={() => setReportStudent(null)}><X size={20} /></button></div>{reportStudent.loading ? <div className="py-16 text-center text-gray-500">Loading report card...</div> : <><div className="p-4"><StudentExamReportCard reportData={{ studentName: getStudentName(reportStudent.student), rollNumber: getRollNumber(reportStudent.student), gradeClass: classes.find((item) => String(item.id) === String(classId))?.classCode || "-", examTerm: examinationTypes.find((item) => String(item.id) === String(examTypeId))?.examType || "Examination", academicYear: "", subjects }} /></div><div className="flex justify-end gap-2 border-t p-4"><button onClick={() => window.print()} className="btn-primary">Print / Download Report Card</button></div></>}</div></div>}
    </div>
  );
}
