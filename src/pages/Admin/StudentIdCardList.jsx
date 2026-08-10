import { useEffect, useMemo, useState } from "react";
import { Download, Printer, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Pagination from "../../components/common/Pagination";
import { fetchClasses } from "../../features/Admin/ExamSchedule/examScheduleSlice";
import { getStudentIdCardDetails, getStudentIdCardList } from "../../features/Admin/student/studentAPI";
import { downloadStudentIdCardPdf, generateStudentIdCardsPrint } from "../../utils/generateStudentIdCardPdf";

const studentId = (student, index) => student?.id || student?.studentId || student?.profileId || index;
const rawField = (student, names) => names.map((name) => student?.[name]).find((item) => item !== null && item !== undefined && item !== "");
const field = (student, names) => rawField(student, names) || "-";
const responseData = (response) => response?.data?.data ?? response?.data;

export default function StudentIdCardList() {
  const dispatch = useDispatch();
  const { classes = [] } = useSelector((state) => state.examSchedule || {});
  const [classId, setClassId] = useState("");
  const [idCardStudents, setIdCardStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    if (!hasSearched) return [];
    const term = search.trim().toLowerCase();
    return idCardStudents.filter((student) => {
      const name = String(field(student, ["studentName", "fullName", "name"])).toLowerCase();
      const admission = String(field(student, ["admissionNo", "admissionNumber"])).toLowerCase();
      return !term || name.includes(term) || admission.includes(term);
    });
  }, [hasSearched, idCardStudents, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / rowsPerPage));
  const visibleStudents = filteredStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const handleSearch = async () => {
    if (!classId) {
      toast.error("Please select a class");
      return;
    }

    try {
      const students = responseData(await getStudentIdCardList(classId));
      setIdCardStudents(Array.isArray(students) ? students : []);
      setCurrentPage(1);
      setHasSearched(true);
    } catch {
      setIdCardStudents([]);
      setHasSearched(false);
    }
  };

  const handleDownload = async (student) => {
    const id = studentId(student);
    if (!id) return;

    try {
      setDownloadingId(id);
      await downloadStudentIdCardPdf(responseData(await getStudentIdCardDetails(id)));
    } catch {
      return;
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrintAll = async () => {
    if (!filteredStudents.length) return;

    try {
      setDownloadingId("all");
      const cards = await Promise.all(filteredStudents.map(async (student) => responseData(await getStudentIdCardDetails(studentId(student)))));
      await generateStudentIdCardsPrint(cards.filter(Boolean));
    } catch {
      return;
    } finally {
      setDownloadingId(null);
    }
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
              <select value={classId} onChange={(event) => { setClassId(event.target.value); setIdCardStudents([]); setHasSearched(false); }} className="form-select mt-2 w-full">
                <option value="">Select</option>
                {classes.map((item) => <option key={item.id || item.classId || item.className} value={item.id || item.classId || item.className}>{item.classCode || item.className || item.name}</option>)}
              </select>
            </label>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleSearch} className="btn-primary flex h-10 items-center justify-center gap-2 px-7"><Search size={16} />Search</button>
            </div>

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
              <thead className="thead-row">
                <tr>
                  <th className="px-4 py-3">S.No.</th>
                  <th className="px-4 py-3">Admission No.</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Roll No.</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student, index) => <tr key={studentId(student, index)} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-4 py-3">{field(student, ["admissionNo", "admissionNumber"])}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{field(student, ["fullName", "studentName", "name"])}</td>
                  <td className="px-4 py-3">{field(student, ["rollNo", "rollNumber"])}</td>
                  <td className="px-4 py-3">{field(student, ["classAndSection", "className", "class"])}</td>
                  <td className="px-4 py-3"><div className="flex justify-center gap-2">
                    <button onClick={() => handleDownload(student)} disabled={downloadingId === studentId(student)} className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50" title="Download Student ID Card" aria-label="Download Student ID Card"><Download size={18} /></button>
                  </div></td>
                </tr>)}
                {visibleStudents.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-sm text-gray-500">No students found for the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button onClick={handlePrintAll} disabled={!filteredStudents.length || downloadingId === "all"} className="btn-primary flex items-center gap-2 px-5 disabled:cursor-not-allowed disabled:opacity-50">
              <Printer size={16} />
              Print All
            </button>
            <Pagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} />
          </div>
        </div>
      </section>
    </div>
  );
}
