import { useState, useMemo } from "react";
import { Save, Pencil, Trash2, MoreVertical, Calendar } from "lucide-react";

const SLOT_TYPES = ["Period", "Interval", "Lunch Break"];

const initialData = [
    { id: 1, createdDate: "02/01/2026", startTime: "09:00 AM", endTime: "10:00 AM", slotType: "Period" },
    { id: 2, createdDate: "02/01/2026", startTime: "10:00 AM", endTime: "11:00 AM", slotType: "Period" },
    { id: 3, createdDate: "02/01/2026", startTime: "11:00 AM", endTime: "11:15 AM", slotType: "Interval" },
    { id: 4, createdDate: "02/01/2026", startTime: "12:00 PM", endTime: "12:45 PM", slotType: "Period" },
    { id: 5, createdDate: "02/01/2026", startTime: "12:45 PM", endTime: "01:30 PM", slotType: "Lunch Break" },
    { id: 6, createdDate: "02/01/2026", startTime: "01:30 PM", endTime: "02:30 PM", slotType: "Period" },
    { id: 7, createdDate: "02/01/2026", startTime: "02:30 PM", endTime: "03:30 PM", slotType: "Period" },
    { id: 8, createdDate: "02/01/2026", startTime: "03:30 PM", endTime: "04:30 PM", slotType: "Period" },
];

function formatTimeInput(value) {
    // value comes from <input type="time"> as "HH:MM" (24h)
    if (!value) return "";
    const [h, m] = value.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function todayFormatted() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function ClassTimingSchedule() {
    const [rows, setRows] = useState(initialData);
    const [nextId, setNextId] = useState(initialData.length + 1);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slotType, setSlotType] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const [filterSlotType, setFilterSlotType] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const resetForm = () => {
        setStartTime("");
        setEndTime("");
        setSlotType("");
        setEditingId(null);
    };

    const handleSave = () => {
        if (!startTime || !endTime || !slotType) return;

        const formattedStart = formatTimeInput(startTime);
        const formattedEnd = formatTimeInput(endTime);

        if (editingId) {
            setRows((prev) =>
                prev.map((r) =>
                    r.id === editingId
                        ? { ...r, startTime: formattedStart, endTime: formattedEnd, slotType }
                        : r
                )
            );
        } else {
            setRows((prev) => [
                ...prev,
                {
                    id: nextId,
                    createdDate: todayFormatted(),
                    startTime: formattedStart,
                    endTime: formattedEnd,
                    slotType,
                },
            ]);
            setNextId((n) => n + 1);
        }
        resetForm();
    };

    const handleEdit = (row) => {
        // Convert "hh:mm AM/PM" back to 24h "HH:MM" for the time input
        const to24h = (t) => {
            const [time, period] = t.split(" ");
            let [h, m] = time.split(":").map(Number);
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };
        setStartTime(to24h(row.startTime));
        setEndTime(to24h(row.endTime));
        setSlotType(row.slotType);
        setEditingId(row.id);
        setOpenMenuId(null);
    };

    const handleDelete = (id) => {
        setRows((prev) => prev.filter((r) => r.id !== id));
        setOpenMenuId(null);
        if (editingId === id) resetForm();
    };

    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            const matchesSlot = filterSlotType ? r.slotType === filterSlotType : true;
            const matchesDate = filterDate ? r.createdDate === filterDate : true;
            return matchesSlot && matchesDate;
        });
    }, [rows, filterSlotType, filterDate]);

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

    const badgeStyles = {
        Period: "bg-blue-50 text-blue-700",
        Interval: "bg-amber-50 text-amber-700",
        "Lunch Break": "bg-emerald-50 text-emerald-700",
    };

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Class Timing Schedule</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Home <span className="mx-1 text-gray-300">/</span> Class Timing Schedule
                    </p>
                </div>

                {/* Add Class Timings */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-3 py-2">
                        <h2 className="text-sm font-semibold text-slate-800">
                            {editingId ? "Edit Class Timing" : "Add Class Timings"}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:flex-wrap">
                        <div className="flex flex-col gap-1.5 sm:w-48">
                            <label className="text-xs font-medium text-gray-600">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:w-48">
                            <label className="text-xs font-medium text-gray-600">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:w-56">
                            <label className="text-xs font-medium text-gray-600">Slot Type</label>
                            <select
                                value={slotType}
                                onChange={(e) => setSlotType(e.target.value)}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Select</option>
                                {SLOT_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 sm:ml-auto">
                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={!startTime || !endTime || !slotType}
                                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 "
                            >
                                <Save size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Class Timing Lists */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-gray-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-semibold text-gray-800">Class Timing Lists</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <select
                                value={filterSlotType}
                                onChange={(e) => {
                                    setFilterSlotType(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-48"
                            >
                                <option value="">Select Slot Type</option>
                                {SLOT_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="dd/mm/yyyy"
                                    value={filterDate}
                                    onChange={(e) => {
                                        setFilterDate(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-40 rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                                <Calendar
                                    size={16}
                                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
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
                                {pagedRows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                            No class timings found.
                                        </td>
                                    </tr>
                                )}
                                {pagedRows.map((row, idx) => (
                                    <tr
                                        key={row.id}
                                        className="border-t border-gray-100 text-gray-700 hover:bg-gray-50"
                                    >
                                        <td className="px-3 py-2">{(page - 1) * pageSize + idx + 1}</td>
                                        <td className="px-3 py-2">{row.createdDate}</td>
                                        <td className="px-3 py-2">{row.startTime}</td>
                                        <td className="px-3 py-2">{row.endTime}</td>
                                        <td className="px-3 py-2">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[row.slotType] || "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {row.slotType}
                                            </span>
                                        </td>
                                        <td className="relative px-3 py-2 text-right">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                                                className="rounded p-1 text-gray-500 hover:bg-gray-100"
                                                aria-label="Row actions"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {openMenuId === row.id && (
                                                <div className="absolute right-5 top-10 z-10 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                                    <button
                                                        onClick={() => handleEdit(row)}
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Pencil size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row.id)}
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white"
                        >
                            Next
                        </button>
                        <span className="text-sm text-gray-500">
                            Page: {page} of {totalPages}
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 pr-7 text-sm text-gray-700 "
                        >
                            {[5, 10, 20, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

