import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronRight, Pencil, Search, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";
import {
  fetchTimetable,
  fetchTimetableDetail,
  publishTimetable,
  removeTimetable,
} from "../../features/Admin/teacherTimetable/teacherTimetableSlice";

const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const formatTime = (value) => {
  if (!value) return "-";
  if (typeof value === "string" && /AM|PM/i.test(value)) return value;
  const [hourText, minute = "00"] = typeof value === "string" ? value.split(":") : [value.hour, value.minute];
  const hour = Number(hourText);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};
const itemTime = (item) => {
  const timing = item.classTimingSchedule ?? item.timeSlot ?? {};
  return `${formatTime(item.startTime ?? timing.startTime)} - ${formatTime(item.endTime ?? timing.endTime)}`;
};

export default function TeachersTimetable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, selectedSchedule, pagination } = useSelector((state) => state.timetable);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRow, setOpenRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishToPortal, setPublishToPortal] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchTimetable({ page: currentPage - 1, size: rowsPerPage, search: search || undefined, status: status || undefined }));
    }, 250);
    return () => clearTimeout(timeout);
  }, [currentPage, dispatch, rowsPerPage, search, status]);

  const totalPages = pagination.totalPages || 1;
  const expandedItems = useMemo(() => (
    selectedSchedule?.id === openRow ? selectedSchedule.scheduleItems : data.find((item) => item.id === openRow)?.scheduleItems
  ), [data, openRow, selectedSchedule]);

  const toggleRow = (id) => {
    if (openRow === id) return setOpenRow(null);
    setOpenRow(id);
    dispatch(fetchTimetableDetail(id));
  };

  const refresh = () => dispatch(fetchTimetable({ page: currentPage - 1, size: rowsPerPage, search: search || undefined, status: status || undefined }));

  const confirmDelete = async () => {
    try {
      await dispatch(removeTimetable(deleteId)).unwrap();
      toast.success("Schedule deleted successfully");
      setDeleteId(null);
      refresh();
    } catch (error) {
      toast.error(error?.message ?? "Unable to delete schedule");
    }
  };

  const closePublish = () => {
    setPublishOpen(false);
    setNotes("");
    setPublishToPortal(true);
  };

  const confirmPublish = async () => {
    try {
      await dispatch(publishTimetable({ scheduleIds: selectedRows, publishToTeacherPortal: publishToPortal, notes })).unwrap();
      toast.success("Schedule published successfully");
      closePublish();
      setSelectedRows([]);
      refresh();
    } catch (error) {
      toast.error(error?.message ?? "Unable to publish schedule");
    }
  };

  const toggleSelected = (id) => {
    const schedule = data.find((item) => item.id === id);
    if (schedule?.status === "PUBLISHED") return;
    setSelectedRows((selected) => selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  const openPublish = () => {
    const draftRows = selectedRows.filter((id) => data.find((item) => item.id === id)?.status !== "PUBLISHED");
    if (!draftRows.length) return toast.error("Select at least one unpublished schedule");
    setSelectedRows(draftRows);
    setPublishOpen(true);
  };

  return <div>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <div><h2 className="text-[24px] font-bold text-[#333333]">Teachers Timetable</h2><p className="text-sm text-gray-500">Teacher / Teachers Timetable</p></div>
      <button onClick={() => navigate("/add-schedule")} className="btn-primary">+ Add Schedule</button>
    </div>
    <div className="card">
      <div className="card-section">Teachers Schedule List</div>
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-3">
          <select value={status} onChange={(event) => { setStatus(event.target.value); setCurrentPage(1); }} className="form-select sm:w-40"><option value="">All Statuses</option><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select>
          <div className="relative sm:w-64"><Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder="Search" className="form-input pl-9" /></div>
        </div>
        <div className="overflow-x-auto border border-gray-300 rounded">
          <table className="w-full min-w-[900px] text-[12px]"><thead className="thead-row"><tr><th className="px-3 py-3 w-10" /><th className="px-3 py-3 w-10" /><th className="px-3 py-3 text-left">S.No.</th><th className="px-3 py-3 text-left">Created Date</th><th className="px-3 py-3 text-left">Teacher Name</th><th className="px-3 py-3 text-left">Scheduled Date Range</th><th className="px-3 py-3 text-left">Status</th><th className="px-3 py-3 text-left">Action</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan="8" className="py-10 text-center text-gray-500">Loading schedules...</td></tr> : !data.length ? <tr><td colSpan="8" className="py-10 text-center text-gray-500">No schedules found</td></tr> : data.map((row, index) => <>
              <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50"><td className="px-3 py-3"><button onClick={() => toggleRow(row.id)} aria-label="View schedule">{openRow === row.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button></td><td className="px-3 py-3"><input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleSelected(row.id)} disabled={row.status === "PUBLISHED"} aria-label={`Select ${row.teacherName}`} className="accent-brand-600 disabled:cursor-not-allowed disabled:opacity-50" /></td><td className="px-3 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td><td className="px-3 py-3">{formatDate(row.createdDate)}</td><td className="px-3 py-3">{row.teacherName}</td><td className="px-3 py-3">{formatDate(row.startDate)}{row.endDate && row.endDate !== row.startDate ? ` - ${formatDate(row.endDate)}` : ""}</td><td className="px-3 py-3"><span className={row.status === "PUBLISHED" ? "rounded bg-green-100 px-2 py-1 text-green-600" : "rounded bg-amber-100 px-2 py-1 text-amber-700"}>{row.status}</span></td><td className="px-3 py-3"><div className="flex gap-3"><button onClick={() => navigate(`/add-schedule/${row.id}`)} title="Edit" className="text-brand-600"><Pencil size={16} /></button><button onClick={() => setDeleteId(row.id)} title="Delete" className="text-red-500"><Trash2 size={16} /></button></div></td></tr>
              {openRow === row.id && <tr key={`${row.id}-details`}><td colSpan="8" className="bg-gray-50 p-3"><div className="overflow-x-auto border rounded"><table className="w-full min-w-[650px] text-[12px]"><thead className="thead-row"><tr><th className="px-3 py-2 text-left">S.No.</th><th className="px-3 py-2 text-left">Subject</th><th className="px-3 py-2 text-left">Class</th><th className="px-3 py-2 text-left">Section</th><th className="px-3 py-2 text-left">Timing</th><th className="px-3 py-2 text-left">Slot Type</th></tr></thead><tbody>{(expandedItems ?? []).map((item, itemIndex) => <tr key={item.id ?? itemIndex} className="border-t"><td className="px-3 py-2">{itemIndex + 1}</td><td className="px-3 py-2">{item.subjectName ?? item.subject?.name ?? item.subject?.subjectName ?? "-"}</td><td className="px-3 py-2">{item.className ?? item.class?.className ?? "-"}</td><td className="px-3 py-2">{item.section ?? item.class?.section ?? "-"}</td><td className="px-3 py-2">{itemTime(item)}</td><td className="px-3 py-2">{item.slotType ?? item.classTimingSchedule?.slotType ?? item.timeSlot?.slotType ?? "-"}</td></tr>)}</tbody></table></div></td></tr>}
            </>)}</tbody></table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} />
        <div className="flex justify-end mt-4"><button onClick={openPublish} className="btn-primary">Publish</button></div>
      </div>
    </div>
    <DeleteConfirmModal isOpen={Boolean(deleteId)} title="Delete Schedule" message="Are you sure you want to delete this schedule?" onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
    {publishOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"><div className="flex items-center justify-between bg-brand-600 px-5 py-4 text-white"><h3 className="text-lg font-semibold">Publish Teacher Class</h3><button onClick={closePublish} aria-label="Close"><X /></button></div><div className="space-y-5 p-6"><div><p className="mb-3 font-semibold">Publish Options</p><label className="flex items-center gap-3"><input type="checkbox" checked={publishToPortal} onChange={(event) => setPublishToPortal(event.target.checked)} className="h-5 w-5 accent-brand-600" />Publish to Teacher portal</label></div><div><label className="mb-2 block font-semibold">Notes (Optional)</label><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ready to publish." className="form-textarea" /></div><div className="flex justify-end gap-3"><button onClick={closePublish} className="btn-secondary">Cancel</button><button onClick={confirmPublish} className="btn-primary">Publish</button></div></div></div></div>}
  </div>;
}
