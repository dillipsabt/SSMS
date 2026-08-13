import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Pencil, Trash2, MoreVertical, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import {
    createClassTimingScheduleAsync,
    deleteClassTimingScheduleAsync,
    fetchClassTimingSchedulesAsync,
    updateClassTimingScheduleAsync,
} from "../../features/Admin/ClassTimingSchedule/classTimingScheduleSlice";

const SLOT_TYPES = ["Period", "Interval", "Lunch Break"];

function formatTimeInput(value) {
    if (!value) return "";
    const [h, m] = value.split(":").map(Number);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timeToInput(value) {
    if (!value) return "";
    if (typeof value === "object") {
        return `${String(value.hour ?? 0).padStart(2, "0")}:${String(value.minute ?? 0).padStart(2, "0")}`;
    }
    const [time, period] = value.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function timeToPayload(value) {
    return `${value}:00`;
}

function closeTimePicker(event, timerRef) {
    const input = event.currentTarget;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => input.blur(), 1200);
}

function toSlotTypeLabel(value) {
    if (!value) return "";
    return value
        .toLowerCase()
        .split("_")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ");
}

function toSlotTypeValue(value) {
    return value.toUpperCase().replaceAll(" ", "_");
}

function formatCreatedDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
}

export default function ClassTimingSchedule() {
    const dispatch = useDispatch();
    const { schedules, pagination, mutationLoading } = useSelector((state) => state.classTimingSchedule);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slotType, setSlotType] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [filterSlotType, setFilterSlotType] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const startTimeCloseTimer = useRef(null);
    const endTimeCloseTimer = useRef(null);

    const listParams = useMemo(() => ({
        page: page - 1,
        size: pageSize,
        ...(filterSlotType && { slotType: toSlotTypeValue(filterSlotType) }),
        ...(filterDate && { createdDate: filterDate }),
    }), [page, pageSize, filterSlotType, filterDate]);

    useEffect(() => {
        dispatch(fetchClassTimingSchedulesAsync(listParams));
    }, [dispatch, listParams]);

    const resetForm = () => {
        setStartTime("");
        setEndTime("");
        setSlotType("");
        setEditingId(null);
    };

    const refreshList = () => dispatch(fetchClassTimingSchedulesAsync(listParams));

    const handleSave = async () => {
        if (!startTime || !endTime || !slotType) return;

        const data = {
            startTime: timeToPayload(startTime),
            endTime: timeToPayload(endTime),
            slotType: toSlotTypeValue(slotType),
        };

        try {
            if (editingId) {
                await dispatch(updateClassTimingScheduleAsync({ id: editingId, data })).unwrap();
                toast.success("Class timing updated successfully");
            } else {
                await dispatch(createClassTimingScheduleAsync(data)).unwrap();
                toast.success("Class timing created successfully");
            }
            resetForm();
            refreshList();
        } catch (error) {
            toast.error(error?.message || "Unable to save class timing");
        }
    };

    const handleEdit = (row) => {
        setStartTime(timeToInput(row.startTime));
        setEndTime(timeToInput(row.endTime));
        setSlotType(toSlotTypeLabel(row.slotType));
        setEditingId(row.id);
        setOpenMenuId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteClassTimingScheduleAsync(deleteId)).unwrap();
            toast.success("Class timing deleted successfully");
            if (editingId === deleteId) resetForm();
            setDeleteId(null);
            refreshList();
        } catch (error) {
            toast.error(error?.message || "Unable to delete class timing");
        }
    };

    const totalPages = Math.max(1, pagination.totalPages);
    const badgeStyles = {
        Period: "bg-blue-50 text-blue-700",
        Interval: "bg-amber-50 text-amber-700",
        "Lunch Break": "bg-emerald-50 text-emerald-700",
    };

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Class Timing Schedule</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Home <span className="mx-1 text-gray-300">/</span> Class Timing Schedule
                    </p>
                </div>

                <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-3 py-2">
                        <h2 className="text-sm font-semibold text-slate-800">
                            {editingId ? "Edit Class Timing" : "Add Class Timings"}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:flex-wrap">
                        <div className="flex flex-col gap-1.5 sm:w-48">
                            <label className="text-xs font-medium text-gray-600">Start Time</label>
                            <input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); closeTimePicker(e, startTimeCloseTimer); }} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:w-48">
                            <label className="text-xs font-medium text-gray-600">End Time</label>
                            <input type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); closeTimePicker(e, endTimeCloseTimer); }} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:w-56">
                            <label className="text-xs font-medium text-gray-600">Slot Type</label>
                            <select value={slotType} onChange={(e) => setSlotType(e.target.value)} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                                <option value="">Select</option>
                                {SLOT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2 sm:ml-auto">
                            <button type="button" onClick={resetForm} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={handleSave} disabled={!startTime || !endTime || !slotType || mutationLoading} className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 ">
                                <Save size={16} />
                                {editingId ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-gray-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-semibold text-gray-800">Class Timing Lists</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <select value={filterSlotType} onChange={(e) => { setFilterSlotType(e.target.value); setPage(1); }} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-48">
                                <option value="">Select Slot Type</option>
                                {SLOT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                            <div className="relative">
                                <input type="text" placeholder="dd/mm/yyyy" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }} className="w-40 rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                                <Calendar size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-6 border border-gray-100 ">
                        <table className="w-full text-left text-sm ">
                            <thead>
                                <tr className=" text-sm  text-gray-900 bg-blue-100">
                                    <th className="px-3 py-2">S.No.</th>
                                    <th className="px-3 py-2">Created Date</th>
                                    <th className="px-3 py-2">Start Time</th>
                                    <th className="px-3 py-2">End Time</th>
                                    <th className="px-3 py-2">Slot Type</th>
                                    <th className="px-3 py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No class timings found.</td></tr>}
                                {schedules.map((row, idx) => {
                                    const slotTypeLabel = toSlotTypeLabel(row.slotType);
                                    return <tr key={row.id} className="border-t border-gray-100 text-gray-700 hover:bg-gray-50">
                                        <td className="px-3 py-2">{(page - 1) * pageSize + idx + 1}</td>
                                        <td className="px-3 py-2">{formatCreatedDate(row.createdDate)}</td>
                                        <td className="px-3 py-2">{formatTimeInput(timeToInput(row.startTime))}</td>
                                        <td className="px-3 py-2">{formatTimeInput(timeToInput(row.endTime))}</td>
                                        <td className="px-3 py-2"><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[slotTypeLabel] || "bg-gray-100 text-gray-700"}`}>{slotTypeLabel}</span></td>
                                        <td className="relative px-3 py-2 text-right">
                                            <button onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)} className="rounded p-1 text-gray-500 hover:bg-gray-100" aria-label="Row actions"><MoreVertical size={18} /></button>
                                            {openMenuId === row.id && <div className="absolute right-5 top-10 z-10 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                                <button onClick={() => handleEdit(row)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><Pencil size={14} />Edit</button>
                                                <button onClick={() => { setDeleteId(row.id); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} />Delete</button>
                                            </div>}
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
                        <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600">Prev</button>
                        <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">Next</button>
                        <span className="text-sm text-gray-500">Page: {page} of {totalPages}</span>
                        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border border-gray-300 bg-white px-2 py-1.5 pr-7 text-sm text-gray-700 ">
                            {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <DeleteConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleConfirmDelete} />
        </div>
    );
}
