import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Printer, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import { fetchAcademicYears, fetchClasses } from "../../features/Admin/ExamSchedule/examScheduleSlice";
import { getStudentsAsync } from "../../features/Admin/student/studentSlice";
import { buildStudentIdCardPdf, downloadStudentIdCardPdf, generateStudentIdCardsPrint } from "../../utils/generateStudentIdCardPdf";

const studentId = (student, index) => student?.id || student?.studentId || student?.profileId || index;
const rawField = (student, names) => names.map((name) => student?.[name]).find((item) => item !== null && item !== undefined && item !== "");
const field = (student, names) => rawField(student, names) || "-";
const normalizeClassValue = (value) => String(value ?? "").toLowerCase().replace(/[\s-]+/g, "");
const classKey = (item) => {
  const className = rawField(item, ["classCode", "className", "class", "name"]);
  const section = rawField(item, ["section", "sectionName"]);
  const normalizedClass = normalizeClassValue(className);
  const normalizedSection = normalizeClassValue(section);
  return normalizedSection && !normalizedClass.endsWith(normalizedSection)
    ? `${normalizedClass}${normalizedSection}`
    : normalizedClass;
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${String(status).toLowerCase() === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
    {status}
  </span>
);

const PreviewModal = ({ student, onClose }) => {
  const previewUrl = useMemo(() => student ? URL.createObjectURL(buildStudentIdCardPdf(student).output("blob")) : null, [student]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (!student || !previewUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label="Student ID card preview">
      <div className="flex h-[min(92vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Student ID Card Preview</h2>
            <p className="text-xs text-gray-500">{field(student, ["fullName", "studentName", "name"])}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Close preview"><X size={20} /></button>
        </div>
        <iframe src={previewUrl} title="Student ID card PDF preview" className="min-h-0 flex-1 bg-gray-100" />
      </div>
    </div>
  );
};

export default function StudentIdCardList() {
  const dispatch = useDispatch();
  const { students = [] } = useSelector((state) => state.student || {});
  const { academicYears = [], classes = [] } = useSelector((state) => state.examSchedule || {});
  const [classId, setClassId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [previewStudent, setPreviewStudent] = useState(null);

  useEffect(() => {
    dispatch(getStudentsAsync());
    dispatch(fetchClasses());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    if (!hasSearched) return [];
    const term = search.trim().toLowerCase();
    const selectedClass = classes.find((item) => String(item.id || item.classId || item.className) === String(classId));
    const selectedClassKey = classKey(selectedClass) || normalizeClassValue(classId);
    const selectedYear = academicYears.find((item) => String(item.id || item.academicYearId || item.year) === String(academicYearId));
    return students.filter((student) => {
      const classMatches = !classId || classKey(student) === selectedClassKey;
      const studentYearId = rawField(student, ["academicYearId", "academicSessionId"]);
      const studentYearName = rawField(student, ["academicYear", "academicSession"]);
      const yearMatches = !academicYearId || !studentYearId && !studentYearName || String(studentYearId) === String(academicYearId) || String(studentYearName) === String(academicYearId) || String(studentYearName) === String(selectedYear?.year || selectedYear?.academicYear || selectedYear?.name);
      const name = String(field(student, ["fullName", "studentName", "name"])).toLowerCase();
      const admission = String(field(student, ["admissionNo", "admissionNumber"])).toLowerCase();
      return classMatches && yearMatches && (!term || name.includes(term) || admission.includes(term));
    });
  }, [academicYearId, academicYears, classes, classId, hasSearched, search, students]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / rowsPerPage));
  const visibleStudents = filteredStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const handleSearch = () => {
    setCurrentPage(1);
    setHasSearched(Boolean(classId));
  };

  const handlePrintAll = () => {
    generateStudentIdCardsPrint(filteredStudents);
  };

  return (
    <div className="page-wrap p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Student ID Card</h1>
        <p className="mt-1 text-sm text-gray-500">Student / Student ID Card</p>
      </div>

      <section className="card overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-4 text-base font-semibold text-gray-700">Student ID Card</div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="text-sm font-medium text-gray-700">Class <span className="text-red-500">*</span>
              <select value={classId} onChange={(event) => { setClassId(event.target.value); setHasSearched(false); }} className="form-select mt-2 w-full">
                <option value="">Select</option>
                {classes.map((item) => <option key={item.id || item.classId || item.className} value={item.id || item.classId || item.className}>{item.classCode || item.className || item.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">Academic Year <span className="text-red-500">*</span>
              <select value={academicYearId} onChange={(event) => { setAcademicYearId(event.target.value); setHasSearched(false); }} className="form-select mt-2 w-full">
                <option value="">Select</option>
                {academicYears.map((item) => <option key={item.id || item.academicYearId || item.year} value={item.id || item.academicYearId || item.year}>{item.year || item.academicYear || item.name}</option>)}
              </select>
            </label>
            <button onClick={handleSearch} className="btn-primary flex h-10 items-center justify-center gap-2 px-7"><Search size={16} />Search</button>
          </div>
        </div>
      </section>

      <section className="card mt-5 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-4 text-base font-semibold text-gray-700">Student ID Card List</div>
        <div className="p-4 sm:p-6">
          <div className="mb-5 flex justify-end">
            <div className="relative w-full sm:w-80">
              <input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder="Search Student name" className="form-input w-full pl-9" />
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="thead-row"><tr>
                <th className="px-4 py-3">S.No.</th><th className="px-4 py-3">Admission No.</th><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">Roll No.</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Section</th><th className="px-4 py-3">Academic Year</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-center">Action</th>
              </tr></thead>
              <tbody>
                {visibleStudents.map((student, index) => <tr key={studentId(student, index)} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-4 py-3">{field(student, ["admissionNo", "admissionNumber"])}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{field(student, ["fullName", "studentName", "name"])}</td>
                  <td className="px-4 py-3">{field(student, ["rollNo", "rollNumber"])}</td>
                  <td className="px-4 py-3">{field(student, ["className", "class"])}</td>
                  <td className="px-4 py-3">{field(student, ["section"])}</td>
                  <td className="px-4 py-3">{field(student, ["academicYear", "academicSession"])}</td>
                  <td className="px-4 py-3"><StatusBadge status={field(student, ["status"])} /></td>
                  <td className="px-4 py-3"><div className="flex justify-center gap-2">
                    <button onClick={() => setPreviewStudent(student)} className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50" title="Preview Student ID Card" aria-label="Preview Student ID Card"><Eye size={18} /></button>
                    <button onClick={() => downloadStudentIdCardPdf(student)} className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50" title="Download Student ID Card" aria-label="Download Student ID Card"><Download size={18} /></button>
                  </div></td>
                </tr>)}
                {visibleStudents.length === 0 && <tr><td colSpan="9" className="px-4 py-10 text-center text-sm text-gray-500">No students found for the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button onClick={handlePrintAll} disabled={!filteredStudents.length} className="btn-primary flex items-center gap-2 px-5 disabled:cursor-not-allowed disabled:opacity-50">
              <Printer size={16} />
              Print All
            </button>
            <Pagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} />
          </div>
        </div>
      </section>
      <PreviewModal student={previewStudent} onClose={() => setPreviewStudent(null)} />
    </div>
  );
}
