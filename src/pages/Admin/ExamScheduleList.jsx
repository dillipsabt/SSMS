import { useEffect, useMemo, useState } from "react";
import { Edit, Eye, Search, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";
import PublishModal from "../../components/common/PublishModal";
import {
  deleteExamScheduleAsync,
  fetchExamSchedules,
  publishExamSchedulesAsync,
  updateExamStatusAsync,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";

const getExamId = (exam) => exam?.id ?? exam?.examId;

const formatTime = (time) => {
  if (!time) return "-";
  if (typeof time === "string") return time;
  return `${String(time.hour ?? 0).padStart(2, "0")}:${String(time.minute ?? 0).padStart(2, "0")}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

function ScheduleDetails({ exam, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
          <h3 className="text-sm font-semibold">Exam Schedule Details</h3>
          <button type="button" onClick={onClose} aria-label="Close details"><X size={18} /></button>
        </div>
        <div className="overflow-auto p-4">
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg bg-blue-50 p-4 text-xs sm:grid-cols-3">
            <div><p className="text-gray-500">Academic Year</p><p className="font-semibold text-gray-800">{exam.academicYear || "-"}</p></div>
            <div><p className="text-gray-500">Examination Type</p><p className="font-semibold text-gray-800">{exam.examinationType || "-"}</p></div>
            <div><p className="text-gray-500">Class</p><p className="font-semibold text-gray-800">{exam.className || "-"}</p></div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[700px] text-xs text-gray-700">
              <thead className="bg-gray-50"><tr>{["Subject", "Exam Date", "Start Time", "End Time", "Max Marks", "Pass Marks"].map((heading) => <th key={heading} className="px-3 py-2 text-left font-semibold">{heading}</th>)}</tr></thead>
              <tbody>
                {(exam.schedules || []).map((schedule, index) => (
                  <tr key={schedule.id || `${schedule.subjectId}-${index}`} className="border-t border-gray-100">
                    <td className="px-3 py-2">{schedule.subjectName || schedule.subject || "-"}</td>
                    <td className="px-3 py-2">{formatDate(schedule.examDate)}</td>
                    <td className="px-3 py-2">{formatTime(schedule.startTime)}</td>
                    <td className="px-3 py-2">{formatTime(schedule.endTime)}</td>
                    <td className="px-3 py-2">{schedule.maxMarks ?? "-"}</td>
                    <td className="px-3 py-2">{schedule.passMarks ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamScheduleList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examSchedules = [], loading } = useSelector((state) => state.examSchedule || {});
  const [selected, setSelected] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewExam, setViewExam] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishOptions, setPublishOptions] = useState({ publishToStudentPortal: true, publishToParentPortal: true, sendNotification: true });
  const [publishNotes, setPublishNotes] = useState("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    dispatch(fetchExamSchedules());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (Array.isArray(examSchedules) ? examSchedules : []).filter((exam) => {
      const matchesSearch = !normalizedSearch || [exam.academicYear, exam.examinationType, exam.className].some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
      const matchesDate = !dateFilter || String(exam.createdDate || "").startsWith(dateFilter);
      return matchesSearch && matchesDate && (!classFilter || exam.className === classFilter) && (!typeFilter || exam.examinationType === typeFilter);
    });
  }, [classFilter, dateFilter, examSchedules, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const current = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const selectableCurrent = current.filter((exam) => exam.examStatus !== "PUBLISHED");
  const hasPublishedSelection = examSchedules.some(
    (exam) => selected.has(getExamId(exam)) && exam.examStatus === "PUBLISHED",
  );
  const classes = [...new Set((examSchedules || []).map((exam) => exam.className).filter(Boolean))];
  const types = [...new Set((examSchedules || []).map((exam) => exam.examinationType).filter(Boolean))];

  const toggleSelect = (id) => setSelected((currentSelected) => {
    const next = new Set(currentSelected);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const toggleAll = (checked) => setSelected(checked ? new Set(selectableCurrent.map(getExamId)) : new Set());

  const handleDelete = async () => {
    try {
      await dispatch(deleteExamScheduleAsync(deleteId)).unwrap();
      toast.success("Exam schedule deleted successfully");
      setDeleteId(null);
      dispatch(fetchExamSchedules());
    } catch (error) {
      toast.error(error?.message || "Unable to delete exam schedule");
    }
  };

  const handlePublish = async () => {
    if (!selected.size) {
      toast.error("Please select at least one exam");
      return;
    }
    if (hasPublishedSelection) {
      toast.error("Published exam schedules cannot be published again");
      return;
    }
    try {
      await dispatch(publishExamSchedulesAsync({ examIds: [...selected], examStatus: "PUBLISHED", ...publishOptions, notes: publishNotes })).unwrap();
      toast.success("Exam schedules published successfully");
      setPublishOpen(false);
      setPublishNotes("");
      setSelected(new Set());
      dispatch(fetchExamSchedules());
    } catch (error) {
      toast.error(error?.message || "Unable to publish exam schedules");
    }
  };

  const handleStatus = async (exam) => {
    if (exam.examStatus === "PUBLISHED") return;
    const nextStatus = "PUBLISHED";
    try {
      await dispatch(updateExamStatusAsync({ examIds: [getExamId(exam)], examStatus: nextStatus })).unwrap();
      toast.success("Exam status updated successfully");
      if (nextStatus === "PUBLISHED") {
        setSelected((currentSelected) => {
          const next = new Set(currentSelected);
          next.delete(getExamId(exam));
          return next;
        });
      }
      dispatch(fetchExamSchedules());
    } catch (error) {
      toast.error(error?.message || "Unable to update exam status");
    }
  };

  const handleClosePublish = () => {
    setPublishOpen(false);
    setPublishNotes("");
  };

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">Exam Schedule List</h2>
      <p className="mb-4 text-[11px] text-gray-500 sm:text-[12px]">Exam &amp; Results / Exam Schedule List</p>
      <div className="card p-3 sm:p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-gray-700">Exam Schedule List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[250px]">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-[150px]"
            />
            <select
              value={classFilter}
              onChange={(event) => {
                setClassFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-[130px]"
            >
              <option value="">Class</option>
              {classes.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-[150px]"
            >
              <option value="">Exam Types</option>
              {types.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded border border-gray-300">
          <table className="w-full min-w-[900px] text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectableCurrent.length > 0 && selectableCurrent.every((exam) => selected.has(getExamId(exam)))}
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                </th>
                <th className="px-3 py-2 text-left">S No.</th>
                <th className="px-3 py-2 text-left">Academic Year</th>
                <th className="px-3 py-2 text-left">Examination Type</th>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">Subjects</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Created Date</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-3 py-6 text-center text-gray-500">Loading...</td>
                </tr>
              ) : current.length ? (
                current.map((exam, index) => {
                  const examId = getExamId(exam);
                  const published = exam.examStatus === "PUBLISHED";

                  return (
                    <tr key={examId} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={!published && selected.has(examId)} disabled={published} onChange={() => toggleSelect(examId)} />
                      </td>
                      <td className="px-3 py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td className="px-3 py-2">{exam.academicYear || "-"}</td>
                      <td className="px-3 py-2">{exam.examinationType || "-"}</td>
                      <td className="px-3 py-2">{exam.className || "-"}</td>
                      <td className="px-3 py-2">{exam.schedules?.length || 0}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleStatus(exam)}
                          disabled={published}
                          className={`rounded px-2 py-1 text-xs ${published ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {exam.examStatus || "DRAFT"}
                        </button>
                      </td>
                      <td className="px-3 py-2">{formatDate(exam.createdDate)}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button type="button" title="View schedule" onClick={() => setViewExam(exam)} className="text-brand-600 hover:text-brand-800"><Eye size={16} /></button>
                          <button type="button" title="Edit schedule" onClick={() => navigate(`/add-exam/${examId}`)} className="text-indigo-600 hover:text-indigo-800"><Edit size={16} /></button>
                          <button type="button" title="Delete schedule" onClick={() => setDeleteId(examId)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-3 py-6 text-center text-gray-500">No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} />
      </div>
      <div className="mt-3 flex justify-end"><button type="button" onClick={() => setPublishOpen(true)} disabled={!selected.size || hasPublishedSelection || loading} className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">Publish Selected</button></div>
      {viewExam && <ScheduleDetails exam={viewExam} onClose={() => setViewExam(null)} />}
      {publishOpen && (
        <PublishModal
          title="Publish Exam Schedules"
          options={publishOptions}
          optionDefinitions={[
            { key: "publishToStudentPortal", label: "Publish to Student Portal" },
            { key: "publishToParentPortal", label: "Publish to Parent Portal" },
            { key: "sendNotification", label: "Send Notification" },
          ]}
          notes={publishNotes}
          onChange={(key, value) =>
            setPublishOptions((currentOptions) => ({ ...currentOptions, [key]: value }))
          }
          onNotesChange={setPublishNotes}
          onClose={handleClosePublish}
          onSubmit={handlePublish}
          loading={loading}
          submitLabel="Publish"
        />
      )}
      <DeleteConfirmModal isOpen={Boolean(deleteId)} title="Delete Exam Schedule" message="Are you sure you want to delete this exam schedule?" onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
