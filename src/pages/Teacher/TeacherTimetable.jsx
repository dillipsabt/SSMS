import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import RaiseRequest from "../../components/Teacher/RaiseRequest";
import { fetchTeacherTimetableAsync } from "../../features/teacher/Timetable/teacherTimetableSlice";

const getSchedules = (data) => data?.content ?? data?.items ?? (Array.isArray(data) ? data : [data]).filter(Boolean);
const time = (value) => {
  if (!value) return "-";
  if (typeof value === "string" && /AM|PM/i.test(value)) return value;
  const [hourText, minute = "00"] = typeof value === "string" ? value.split(":") : [value.hour, value.minute];
  const hour = Number(hourText);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};
const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export default function TeacherTimetable() {
  const dispatch = useDispatch();
  const { timetable, loading } = useSelector((state) => state.teacherTimetable);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => { dispatch(fetchTeacherTimetableAsync()); }, [dispatch]);

  const scheduleItems = useMemo(() => getSchedules(timetable).flatMap((schedule) => (
    (schedule.scheduleItems ?? schedule.teacherScheduleDetails ?? schedule.slots ?? []).map((item) => ({
      ...item,
      scheduleId: schedule.id ?? schedule.teacherScheduleId,
      startDate: schedule.startDate ?? schedule.scheduledDate,
      endDate: schedule.endDate ?? schedule.startDate ?? schedule.scheduledDate,
    }))
  )), [timetable]);
  const filteredItems = scheduleItems.filter((item) => `${item.subjectName ?? item.subject?.name ?? ""} ${item.className ?? item.class?.className ?? ""} ${item.section ?? item.class?.section ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"><div><h1 className="text-2xl font-bold text-gray-800">Teachers Timetable</h1><p className="text-sm text-gray-500">Teacher / Teachers Timetable</p></div><button onClick={() => setOpenModal(true)} className="btn-primary">Raise Request</button></div>
    <div className="card"><div className="card-section">Teachers Schedule List</div><div className="p-3 sm:p-4"><div className="flex justify-end mb-3"><div className="relative w-full sm:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="form-input pl-9" /></div></div><div className="overflow-x-auto border rounded"><table className="w-full min-w-[720px] text-[12px]"><thead className="thead-row"><tr><th className="px-3 py-3 text-left">Date Range</th><th className="px-3 py-3 text-left">Subject</th><th className="px-3 py-3 text-left">Class</th><th className="px-3 py-3 text-left">Section</th><th className="px-3 py-3 text-left">Timing</th><th className="px-3 py-3 text-left">Slot Type</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="py-10 text-center text-gray-500">Loading timetable...</td></tr> : !filteredItems.length ? <tr><td colSpan="6" className="py-10 text-center text-gray-500">No published timetable found</td></tr> : filteredItems.map((item, index) => <tr key={item.id ?? index} className="border-t"><td className="px-3 py-3">{date(item.startDate)}{item.endDate && item.endDate !== item.startDate ? ` - ${date(item.endDate)}` : ""}</td><td className="px-3 py-3">{item.subjectName ?? item.subject?.subjectName ?? item.subject?.name ?? "-"}</td><td className="px-3 py-3">{item.className ?? item.class?.className ?? "-"}</td><td className="px-3 py-3">{item.section ?? item.class?.section ?? "-"}</td><td className="px-3 py-3">{time(item.startTime ?? item.timeSlot?.startTime)} - {time(item.endTime ?? item.timeSlot?.endTime)}</td><td className="px-3 py-3">{item.slotType ?? item.timeSlot?.slotType ?? "-"}</td></tr>)}</tbody></table></div></div></div>
    <RaiseRequest open={openModal} onClose={() => setOpenModal(false)} scheduleItems={scheduleItems} />
  </div>;
}
