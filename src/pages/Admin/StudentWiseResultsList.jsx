import { useEffect, useMemo, useState } from "react";
import { Download, Printer, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchClasses,
  fetchExaminationTypes,
  fetchReportCards,
  fetchReportCardDownload,
  resetExamResultState,
} from "../../features/Admin/ExamResult/examResultSlice";
import { fetchTeachers } from "../../features/Admin/Notifications/notificationSlice";
import {
  generateStudentReportCardPdf,
  generateStudentReportCardsPdf,
} from "../../utils/generateStudentReportCardPdf";

const getStudentId = (student) => student?.studentId || student?.id || student?.profileId;
const getStudentName = (student) => student?.studentName || student?.fullName || student?.name || "-";
const getRollNumber = (student) => student?.rollNo || student?.rollNumber || "-";
const getAdmissionNumber = (student) => student?.admissionNo || student?.admissionNumber || "-";
const getPercentage = (student) => student?.percentage == null ? "-" : Number(student.percentage).toFixed(2);
const getStatus = (student) => String(student?.status || student?.passFail || "PASS").toUpperCase();
const getRowKey = (student, index) => String(getStudentId(student) || getAdmissionNumber(student) || index);

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
  const { classes = [], examinationTypes = [], examResults = [], loading, error } = useSelector((state) => state.examResult || {});
  const { teachers = [] } = useSelector((state) => state.notification || {});
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [examTypeId, setExamTypeId] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishToPortal, setPublishToPortal] = useState(true);
  const [publishToWhatsapp, setPublishToWhatsapp] = useState(true);
  const [publishNotes, setPublishNotes] = useState("Ready to publish.");
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchExaminationTypes());
    dispatch(fetchTeachers());
    return () => dispatch(resetExamResultState());
  }, [dispatch]);

  const rows = useMemo(() => examResults.filter((student) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || getStudentName(student).toLowerCase().includes(term) || getRollNumber(student).toLowerCase().includes(term);
    const matchesStatus = !status || getStatus(student) === status;
    return matchesSearch && matchesStatus;
  }), [examResults, search, status]);

  const handleSearch = async () => {
    if (!classId || !examTypeId) {
      toast.error("Please select exam type and class");
      return;
    }
    try {
      await dispatch(fetchReportCards({
        classId,
        examinationTypeId: examTypeId,
        ...(teacherId ? { teacherId } : {}),
      })).unwrap();
      toast.success("Student results fetched successfully");
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to fetch student results");
    }
  };

  const downloadReportCard = async (student) => {
    try {
      const report = await dispatch(fetchReportCardDownload({
        studentId: getStudentId(student),
        examinationTypeId: student.examinationTypeId || examTypeId,
      })).unwrap();
      generateStudentReportCardPdf(report);
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to download report card");
    }
  };

  const handlePrintAll = async () => {
    if (!rows.length) {
      toast.error("No student results available to print");
      return;
    }

    try {
      const reports = await Promise.all(rows.map((student) =>
        dispatch(fetchReportCardDownload({
          studentId: getStudentId(student),
          examinationTypeId: student.examinationTypeId || examTypeId,
        })).unwrap()
      ));
      generateStudentReportCardsPdf(reports);
    } catch (requestError) {
      toast.error(requestError?.message || "Unable to prepare report cards for printing");
    }
  };

  const toggleStudentSelection = (student, index) => {
    const rowKey = getRowKey(student, index);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const toggleAllVisibleStudents = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      const allSelected = rows.length > 0 && rows.every((student, index) => next.has(getRowKey(student, index)));
      rows.forEach((student, index) => {
        const rowKey = getRowKey(student, index);
        if (allSelected) next.delete(rowKey);
        else next.add(rowKey);
      });
      return next;
    });
  };

  const handlePublish = () => {
    if (!selectedIds.size) {
      toast.error("Select at least one student to publish");
      return;
    }
    if (!publishToPortal && !publishToWhatsapp) {
      toast.error("Select at least one publish option");
      return;
    }
    toast.success(`${selectedIds.size} student result${selectedIds.size === 1 ? "" : "s"} ready to publish`);
    setPublishOpen(false);
  };

  return (
    <div className="page-wrap p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-800">Student Wise Exam Results</h1>
      <p className="mb-5 text-sm text-gray-500">Home / Exam Results / Student Wise Exam Results</p>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">Exam Result List</div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-end">
            <label className="text-sm font-medium text-gray-700">Exam Type <span className="text-red-500">*</span>
              <select
                value={examTypeId}
                onChange={(event) =>
                  setExamTypeId(event.target.value)}
                className="form-select mt-1 w-full">
                <option value="">Select Exam Type</option>
                {examinationTypes.map((exam) =>
                  <option key={exam.id} value={exam.id}>{exam.examType || exam.name}</option>
                )}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">Class Type <span className="text-red-500">*</span><select value={classId} onChange={(event) => setClassId(event.target.value)} className="form-select mt-1 w-full"><option value="">Select Class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.classCode || item.className || item.name}</option>)}</select></label>
            {/* <label className="text-sm font-medium text-gray-700">Teacher<select value={teacherId} onChange={(event) => setTeacherId(event.target.value)} className="form-select mt-1 w-full"><option value="">All Teachers</option>{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.fullName || teacher.name || teacher.firstName || "Teacher"}</option>)}</select></label> */}
            {/* <label className="text-sm font-medium text-gray-700">Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="form-input mt-1 w-full" /></label> */}
            <div>
              <button onClick={handleSearch} disabled={loading} className="btn-primary flex h-10 items-center justify-center gap-2 px-6"><Search size={16} />{loading ? "Loading..." : "Search"}</button>
            </div>

          </div>
        </div>
      </div>

      <div className="card mt-4 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">Student Wise Results</div>
        <div className="p-4">
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-3">
            <div className="rounded-md bg-white px-3 py-2 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Exam Type</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{examinationTypes.find((item) => String(item.id) === String(examTypeId))?.examType || "-"}</p>
            </div>
            <div className="rounded-md bg-white px-3 py-2 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Class</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{classes.find((item) => String(item.id) === String(classId))?.classCode || "-"}</p>
            </div>
            {/* <div className="rounded-md bg-white px-3 py-2 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Date</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{date || "-"}</p>
            </div> */}
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Student Name / Hall Ticket No." className="form-input sm:w-72" />
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="form-select sm:w-36">
              <option value="">Status</option>
              <option value="PASS">Pass</option>
              <option value="FAIL">Fail</option>
            </select>
          </div>

          {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error?.message || error}</div>}
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full min-w-[1600px] text-xs">
              <thead className="bg-indigo-50 text-gray-700">
                <tr>
                  <th className="w-10 border-r border-indigo-100 px-3 py-3 text-center align-middle"><input type="checkbox" checked={rows.length > 0 && rows.every((student, index) => selectedIds.has(getRowKey(student, index)))} onChange={toggleAllVisibleStudents} aria-label="Select all students" /></th>
                  <th className="border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">S.No.</th>
                  <th className="min-w-[120px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Student Name</th>
                  <th className="min-w-[90px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Roll No.</th>
                  <th className="min-w-[105px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Admission No.</th>
                  <th className="min-w-[65px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Class</th>
                  <th className="min-w-[90px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Exam Type</th>
                  <th className="min-w-[105px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Academic Year</th>
                  <th className="min-w-[80px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Obtained</th>
                  <th className="min-w-[85px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Total Marks</th>
                  <th className="min-w-[85px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Percentage</th>
                  <th className="min-w-[65px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Grade</th>
                  <th className="min-w-[80px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Grade Point</th>
                  <th className="min-w-[75px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Result</th>
                  <th className="min-w-[90px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Fees Status</th>
                  <th className="min-w-[80px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Published</th>
                  <th className="min-w-[130px] border-r border-indigo-100 px-3 py-2.5 text-left align-middle text-xs font-semibold leading-4 whitespace-nowrap">Published Notes</th>
                  <th className="min-w-[80px] px-3 py-2.5 text-center align-middle text-xs font-semibold leading-4 whitespace-nowrap">Download</th>
                </tr>
              </thead>
              <tbody>
                {rows.length ? rows.map((student, index) =>
                  <tr key={getRowKey(student, index)} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-3 py-2.5 align-middle"><input type="checkbox" checked={selectedIds.has(getRowKey(student, index))} onChange={() => toggleStudentSelection(student, index)} aria-label={`Select ${getStudentName(student)}`} /></td>
                    <td className="px-3 py-2.5 align-middle">{index + 1}</td>
                    <td className="px-3 py-2.5 align-middle">{getStudentName(student)}</td>
                    <td className="px-3 py-2.5 align-middle">{getRollNumber(student)}</td>
                    <td className="px-3 py-2.5 align-middle">{getAdmissionNumber(student)}</td>
                    <td className="px-3 py-2.5 align-middle">{student.className || "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{student.examinationType || "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{student.academicYear || "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{student.totalObtainedMarks ?? "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{student.totalMarks ?? "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{getPercentage(student)}%</td>
                    <td className="px-3 py-2.5 align-middle">{student.grade || "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{student.gradePoint ?? "-"}</td>
                    <td className="px-3 py-2.5 align-middle"><StatusBadge value={getStatus(student)} /></td>
                    <td className="px-3 py-2.5 align-middle"><StatusBadge value={student.feeStatus || student.feesStatus || "Pending"} tone="fee" /></td>
                    <td className="px-3 py-2.5 align-middle">{student.published || "-"}</td>
                    <td className="px-3 py-2.5 align-middle">{student.publishedNotes || student.notes || "-"}</td>
                    <td className="px-3 py-2.5 text-center align-middle"><button onClick={() => downloadReportCard(student)} disabled={loading} className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50" title="Download report card"><Download size={20} /></button></td>
                  </tr>
                ) :
                  <tr>
                    <td colSpan="19" className="py-10 text-center text-gray-500">
                      {loading ? "Loading..." : "No student results found"}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setPublishOpen(true)} disabled={!selectedIds.size} className="btn-primary flex items-center justify-center gap-2 px-4 disabled:opacity-50">Publish{selectedIds.size ? ` (${selectedIds.size})` : ""}</button>
            <button onClick={handlePrintAll} disabled={!rows.length || loading} className="flex items-center justify-center gap-2 rounded bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"><Printer size={16} />Print All</button>
          </div>
        </div>
      </div>

      {publishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-indigo-600 px-6 py-4 text-white">
              <h2 className="text-xl font-semibold">Publish</h2>
              <button onClick={() => setPublishOpen(false)} className="rounded p-1 hover:bg-indigo-500" aria-label="Close publish dialog"><X size={22} /></button>
            </div>
            <div className="space-y-5 px-6 py-5">
              <p className="text-lg font-semibold text-gray-800">{examinationTypes.find((item) => String(item.id) === String(examTypeId))?.examType || "Exam Results"}</p>
              <div>
                <p className="mb-3 text-sm text-gray-500">{selectedIds.size} student result{selectedIds.size === 1 ? "" : "s"} selected</p>
                <h3 className="mb-3 text-base font-semibold text-gray-800">Publish Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-gray-700"><input type="checkbox" checked={publishToPortal} onChange={(event) => setPublishToPortal(event.target.checked)} className="h-4 w-4 accent-indigo-600" />Publish to Parents portal</label>
                  <label className="flex items-center gap-3 text-sm text-gray-700"><input type="checkbox" checked={publishToWhatsapp} onChange={(event) => setPublishToWhatsapp(event.target.checked)} className="h-4 w-4 accent-indigo-600" />Publish to Whatsapp</label>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-gray-800">Notes (Optional)</label>
                <textarea value={publishNotes} onChange={(event) => setPublishNotes(event.target.value)} rows={4} className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end px-6 pb-6"><button onClick={handlePublish} className="btn-primary px-6">Publish</button></div>
          </div>
        </div>
      )}

    </div>
  );
}
