import React, { useState, useRef, useEffect } from "react";
import {
    Eye,
    MoreVertical,
    Calendar,
    ChevronDown,
    Activity,
    Pencil,
    Trash2,
    X,
    Check,
} from "lucide-react";

const REFUNDS = [
    {
        id: 1,
        refundId: "RFD000154",
        date: "01/04/2026",
        studentName: "Marcus Thorne",
        admissionNo: "ADM124",
        classSection: "10-A",
        roll: "14",
        fatherName: "Satyanarayana",
        photo: "https://i.pravatar.cc/100?img=12",
        refundType: "Partial Refund",
        method: "Online",
        refundAmt: 8000,
        approvedBy: "Principal",
        status: "Completed",
        reasonForRefund: "My children change the another school.",
        bankDetails: {
            accountHolderName: "M Thomas",
            accountNumber: "000098776654321",
            bankName: "ICICI Bank",
            ifscCode: "ICIC000198",
        },
        trackSteps: [
            { label: "Refund Requested", date: "03 Jul 2026", done: true },
            { label: "Approved by Principal", date: "05 Jul 2026", done: true },
            { label: "Amount Transferred", date: "", done: false },
        ],
        rejectComments: "",
    },
    {
        id: 2,
        refundId: "RFD000153",
        date: "14/03/2026",
        studentName: "Harika",
        admissionNo: "ADM521",
        classSection: "9-B",
        roll: "7",
        fatherName: "Raghunath",
        photo: "https://i.pravatar.cc/100?img=32",
        refundType: "Full",
        method: "Cash",
        refundAmt: 45000,
        approvedBy: "-",
        status: "Pending",
        reasonForRefund: "Duplicate fee payment made by mistake.",
        bankDetails: {
            accountHolderName: "Harika Reddy",
            accountNumber: "000112233445566",
            bankName: "HDFC Bank",
            ifscCode: "HDFC000221",
        },
        trackSteps: [
            { label: "Refund Requested", date: "10 Mar 2026", done: true },
            { label: "Approved by Principal", date: "", done: false },
            { label: "Amount Transferred", date: "", done: false },
        ],
        rejectComments: "",
    },
    {
        id: 3,
        refundId: "RFD000152",
        date: "01/03/2026",
        studentName: "Sowjanya Reddy",
        admissionNo: "ADM875",
        classSection: "8-B",
        roll: "22",
        fatherName: "Venkateswarlu",
        photo: "https://i.pravatar.cc/100?img=47",
        refundType: "Transport",
        method: "UPI",
        refundAmt: 2500,
        approvedBy: "-",
        status: "Rejected",
        reasonForRefund: "Transport route discontinued for the term.",
        bankDetails: {
            accountHolderName: "Sowjanya Reddy",
            accountNumber: "000998877665544",
            bankName: "SBI",
            ifscCode: "SBIN000456",
        },
        trackSteps: [
            { label: "Refund Requested", date: "01 Mar 2026", done: true },
            { label: "Rejected by Principal", date: "02 Mar 2026", done: true },
        ],
        rejectComments: "Not consider the refund fees.",
    },
];

const STATUS_STYLES = {
    Completed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-amber-50 text-amber-600",
    Rejected: "bg-rose-50 text-rose-600",
};

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
                }`}
        >
            {status}
        </span>
    );
}

/* ---------- Shared modal shell ---------- */
function ModalShell({ title, onClose, children, maxWidth = "max-w-lg" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className={`w-full ${maxWidth} overflow-hidden rounded-xl bg-white shadow-xl`}>
                <div className="flex items-center justify-between bg-indigo-600 px-6 py-4">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-0.5 text-white/90 hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
}

/* ---------- View Refund Details modal ---------- */
function ViewRefundDetailsModal({ refund, onClose }) {
    return (
        <ModalShell title="View Refund Details" onClose={onClose}>
            <div className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={refund.photo}
                            alt={refund.studentName}
                            className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{refund.studentName}</p>
                            <p className="text-sm text-gray-500">
                                Class {refund.classSection} • Roll: #{refund.roll}
                            </p>
                            <p className="text-sm text-gray-500">
                                Father Name: <span className="font-medium text-gray-700">{refund.fatherName}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Refund Amount
                        </p>
                        <p className="text-lg font-semibold text-emerald-600">
                            ₹{refund.refundAmt.toLocaleString("en-IN")}.00
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-100 p-4">
                <p className="mb-1 text-sm font-semibold text-gray-700">Reason for Refund</p>
                <p className="text-sm text-gray-500">{refund.reasonForRefund}</p>
            </div>

            <div className="mt-4 rounded-lg border border-gray-100 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-700">Bank Details</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Account Holder Name</p>
                        <p className="text-sm text-gray-700">{refund.bankDetails.accountHolderName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Account Number</p>
                        <p className="text-sm text-gray-700">{refund.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Bank Name</p>
                        <p className="text-sm text-gray-700">{refund.bankDetails.bankName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">IFSC Code</p>
                        <p className="text-sm text-gray-700">{refund.bankDetails.ifscCode}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-rose-300 px-5 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
                >
                    Cancel
                </button>
            </div>
        </ModalShell>
    );
}

/* ---------- Track Details modal ---------- */
function TrackDetailsModal({ refund, onClose }) {
    const steps = refund.trackSteps || [];
    return (
        <ModalShell title="Track Details" onClose={onClose} maxWidth="max-w-md">
            <div>
                {steps.map((step, idx) => (
                    <div key={step.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${step.done
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {step.done ? <Check size={16} /> : idx + 1}
                            </div>
                            {idx < steps.length - 1 && (
                                <div
                                    className={`w-px flex-1 ${step.done ? "bg-indigo-600" : "bg-gray-200"
                                        }`}
                                    style={{ minHeight: "2.5rem" }}
                                />
                            )}
                        </div>
                        <div className={idx < steps.length - 1 ? "pb-8" : ""}>
                            <p className="font-medium text-gray-800">{step.label}</p>
                            {step.date && <p className="text-sm text-gray-400">{step.date}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-rose-300 px-5 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
                >
                    Cancel
                </button>
            </div>
        </ModalShell>
    );
}

/* ---------- Reject Comments modal ---------- */
function RejectCommentsModal({ refund, onClose }) {
    return (
        <ModalShell title="View Reject Comments" onClose={onClose} maxWidth="max-w-md">
            <p className="mb-1 text-sm font-semibold text-gray-700">Comments</p>
            <p className="text-sm text-gray-500">
                {refund.rejectComments || "No comments have been added yet."}
            </p>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-rose-300 px-5 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
                >
                    Cancel
                </button>
            </div>
        </ModalShell>
    );
}

/* ---------- Action menu ---------- */
function ActionMenu({ onTrack, onView, onEdit, onDelete }) {
    const items = [
        { label: "Track", icon: Activity, color: "text-emerald-500", onClick: onTrack },
        { label: "View", icon: Eye, color: "text-sky-500", onClick: onView },
        { label: "Edit", icon: Pencil, color: "text-indigo-500", onClick: onEdit },
        { label: "Delete", icon: Trash2, color: "text-rose-500", onClick: onDelete },
    ];

    return (
        <div className="absolute right-8 top-2 z-20 w-32 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
            {items.map(({ label, icon: Icon, color, onClick }) => (
                <button
                    key={label}
                    onClick={onClick}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                    <Icon size={15} className={color} />
                    {label}
                </button>
            ))}
        </div>
    );
}

export default function FeesRefundList() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState("01/09/2025 - 30/10/2025");
    const [classFilter, setClassFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [activeModal, setActiveModal] = useState(null); // "view" | "track" | "reject"
    const [activeRefund, setActiveRefund] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = REFUNDS.filter((r) =>
        r.studentName.toLowerCase().includes(search.toLowerCase())
    );

    const total = filtered.reduce((sum, r) => sum + r.refundAmt, 0);

    function openModal(type, refund) {
        setActiveRefund(refund);
        setActiveModal(type);
        setOpenMenuId(null);
    }

    function closeModal() {
        setActiveModal(null);
        setActiveRefund(null);
    }

    return (
        <div className="min-h-screen fees-theme-scope">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-black">Fees Refund List</h1>
                <p className="mt-1 text-xs text-gray-400">
                    Fees Management / <span className="text-slate-500">Fees Refund List</span>
                </p>
            </div>

            {/* Card */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-700">Fees Refund List</h2>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-end gap-2 px-4 py-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Student Name"
                        className="w-56 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <div className="relative">
                        <input
                            type="text"
                            value={dateRange}
                            readOnly
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-56 rounded-lg border border-gray-200 py-2 pl-3 pr-9 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <Calendar
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="w-40 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">Select Class</option>
                            <option value="10-A">10-A</option>
                            <option value="9-B">9-B</option>
                            <option value="8-B">8-B</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-40 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">Select Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto px-4 pb-2 pt-2 ">
                    <table className="w-full min-w-[900px] text-center text-sm  shadow rounded-3xl">
                        <thead>
                            <tr className="text-black">
                                <th className="px-2 py-3 font-medium">S.No.</th>
                                <th className="px-2 py-3 font-medium">Refund ID</th>
                                <th className="px-2 py-3 font-medium">Date</th>
                                <th className="px-2 py-3 font-medium">Student Name</th>
                                <th className="px-2 py-3 font-medium">Admission No</th>
                                <th className="px-2 py-3 font-medium">Class/Section</th>
                                <th className="px-2 py-3 font-medium">Refund Type</th>
                                <th className="px-2 py-3 font-medium">Method</th>
                                <th className="px-2 py-3 font-medium">Refund Amt</th>
                                <th className="px-2 py-3 font-medium">Reject</th>
                                <th className="px-2 py-3 font-medium">Approved By</th>
                                <th className="px-2 py-3 font-medium">Status</th>
                                <th className="px-2 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, idx) => (
                                <tr key={r.id} className="border-t border-gray-200 text-gray-800 text-xs">
                                    <td className="px-2 py-4">{idx + 1}</td>
                                    <td className="px-2 py-4">{r.refundId}</td>
                                    <td className="px-2 py-4">{r.date}</td>
                                    <td className="px-2 py-4">{r.studentName}</td>
                                    <td className="px-2 py-4">{r.admissionNo}</td>
                                    <td className="px-2 py-4">{r.classSection}</td>
                                    <td className="px-2 py-4">{r.refundType}</td>
                                    <td className="px-2 py-4">{r.method}</td>
                                    <td className="px-2 py-4">₹{r.refundAmt.toLocaleString("en-IN")}</td>
                                    <td className="px-2 py-4">
                                        <button
                                            onClick={() => openModal("reject", r)}
                                            className="mx-auto flex items-center justify-center rounded p-1 hover:bg-gray-100"
                                            title="View reject comments"
                                        >
                                            <Eye size={16} className="text-indigo-500" />
                                        </button>
                                    </td>
                                    <td className="px-2 py-4">{r.approvedBy}</td>
                                    <td className="px-2 py-4">
                                        <StatusBadge status={r.status} />
                                    </td>
                                    <td className="relative px-2 py-4">
                                        <button
                                            onClick={() =>
                                                setOpenMenuId(openMenuId === r.id ? null : r.id)
                                            }
                                            className="rounded p-1 text-gray-400 hover:bg-gray-100"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        {openMenuId === r.id && (
                                            <div ref={menuRef}>
                                                <ActionMenu
                                                    onTrack={() => openModal("track", r)}
                                                    onView={() => openModal("view", r)}
                                                    onEdit={() => setOpenMenuId(null)}
                                                    onDelete={() => setOpenMenuId(null)}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-gray-100">
                                <td colSpan={8} className="px-2 py-4 text-right font-semibold text-gray-700">
                                    Total
                                </td>
                                <td className="px-2 py-4 font-semibold text-gray-700">
                                    ₹{total.toLocaleString("en-IN")}
                                </td>
                                <td colSpan={4} />
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    >
                        Next
                    </button>
                    <span className="text-sm text-gray-500">Page: {page} of 1</span>
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === "view" && activeRefund && (
                <ViewRefundDetailsModal refund={activeRefund} onClose={closeModal} />
            )}
            {activeModal === "track" && activeRefund && (
                <TrackDetailsModal refund={activeRefund} onClose={closeModal} />
            )}
            {activeModal === "reject" && activeRefund && (
                <RejectCommentsModal refund={activeRefund} onClose={closeModal} />
            )}
        </div>
    );
}
