import { Download, MoreVertical, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";
import { fetchClasses } from "../../features/Admin/ExamSchedule/examScheduleSlice";
import useToastMessage from "../../utils/useToastMessage";
import {
    clearError,
    clearSuccess,
    deleteHallTicketAsync,
    downloadHallTicketAsync,
    fetchHallTicketExaminationTypes,
    fetchStudentWiseHallTickets,
    publishHallTicketsAsync,
} from "../../features/Admin/HallTicket/hallTicketSlice";

function StatusPill({ value }) {
    const map = {
        Completed: "bg-emerald-50 text-emerald-600 ring-emerald-200",
        Pending: "bg-amber-50 text-amber-600 ring-amber-200",
        Generated: "bg-indigo-50 text-indigo-600 ring-indigo-200",
    };
    return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${map[value] || "bg-gray-50 text-gray-600 ring-gray-200"}`}>{value || "-"}</span>;
}

function PublishModal({ examLabel, classLabel, onClose, onPublish, loading }) {
    const [publishToPortal, setPublishToPortal] = useState(true);
    const [publishToWhatsapp, setPublishToWhatsapp] = useState(true);
    const [notes, setNotes] = useState("");

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
        <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-xl bg-indigo-600 px-5 py-3.5">
                <h3 className="text-sm font-semibold text-white">Publish Hall Tickets</h3>
                <button onClick={onClose} className="text-white/80 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 px-5 py-5">
                <p className="text-sm font-medium text-gray-700">{examLabel} — {classLabel}</p>
                <div>
                    <p className="mb-2 text-xs font-medium text-gray-500">Publish Options</p>
                    <label className="mb-2 flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={publishToPortal} onChange={() => setPublishToPortal((value) => !value)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />Publish to student portal</label>
                    <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={publishToWhatsapp} onChange={() => setPublishToWhatsapp((value) => !value)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />Publish to Whatsapp</label>
                </div>
                <div><label className="mb-1.5 block text-xs font-medium text-gray-500">Notes (Optional)</label><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ready to publish." rows={3} className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">Cancel</button>
                <button onClick={() => onPublish({ publishToPortal, publishToWhatsapp, notes })} disabled={loading} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? "Publishing..." : "Publish"}</button>
            </div>
        </div>
    </div>;
}

const getId = (item) => item.hallTicketId || item.id;
const getFileName = (item) => `hall-ticket-${item.hallTicketNo || getId(item)}.pdf`;

export default function HallTicketList() {
    const dispatch = useDispatch();
    const [examId, setExamId] = useState("");
    const [classId, setClassId] = useState("");
    const [checked, setChecked] = useState(new Set());
    const [publishOpen, setPublishOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Status");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteId, setDeleteId] = useState(null);

    const { examinationTypes = [], students = [], generatedDate, pagination, loading, success, successMessage, error } = useSelector((state) => state.hallTicket || {});
    const { classes = [] } = useSelector((state) => state.examSchedule || {});

    const fetchList = useCallback(() => dispatch(fetchStudentWiseHallTickets({
        ...(examId && { examId }),
        ...(classId && { classId }),
        ...(search && { search }),
        ...(statusFilter !== "Status" && { status: statusFilter }),
        page: currentPage - 1,
        size: rowsPerPage,
    })), [classId, currentPage, dispatch, examId, rowsPerPage, search, statusFilter]);

    useEffect(() => {
        dispatch(fetchHallTicketExaminationTypes());
        dispatch(fetchClasses());
        dispatch(clearSuccess());
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => { fetchList(); }, [fetchList]);

    useToastMessage({
        createSuccess: success,
        createMessage: successMessage,
        error,
        clearSuccess,
        clearError,
        onSuccess: fetchList,
    });

    const toggleRow = (id) => setChecked((current) => {
        const next = new Set(current);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const toggleAll = () => setChecked((current) => current.size === students.length ? new Set() : new Set(students.map(getId)));

    const handleDownload = async (student) => {
        setOpenMenuId(null);
        const blob = await dispatch(downloadHallTicketAsync(getId(student))).unwrap();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = getFileName(student);
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePublish = (options) => {
        dispatch(publishHallTicketsAsync({ examId: Number(examId), classId: Number(classId), ...options }));
        setPublishOpen(false);
    };

    return <div className="min-h-screen w-full bg-gray-50 px-6 py-6 font-sans antialiased">
        <div className="mx-auto max-w-6xl">
            <div className="mb-4"><h1 className="text-xl font-semibold text-gray-800">Hall Ticket List</h1><p className="text-xs text-gray-400">Home / Hall Ticket / Hall Ticket List</p></div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-[15px] font-semibold text-gray-700">Hall Ticket List</h2>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-500">Exam Type<span className="text-rose-500">*</span></label>
                        <select value={examId} onChange={(event) => { setExamId(event.target.value); setCurrentPage(1); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                            <option value="">Select</option>
                            {examinationTypes.map((exam) =>
                                <option key={exam.id || exam.examTypeId} value={exam.id || exam.examTypeId}>{exam.examType || exam.examinationType}</option>)}
                        </select>
                    </div>
                    <div><label className="mb-1.5 block text-xs font-medium text-gray-500">Class Type<span className="text-rose-500">*</span></label><select value={classId} onChange={(event) => { setClassId(event.target.value); setCurrentPage(1); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"><option value="">Select</option>{classes.map((classItem) => <option key={classItem.id || classItem.classId} value={classItem.id || classItem.classId}>{classItem.classCode || classItem.name}</option>)}</select></div>
                    <div className="flex lg:justify-end"><button onClick={fetchList} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">Search</button></div>
                </div>
                <hr className="mb-5 border-gray-100" />
                <div><div className="border-b border-gray-200"><h3 className="mb-3 text-[15px] font-semibold text-gray-700">Student Wise List</h3></div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 pt-2"><span className="text-sm text-gray-500">Date <span className="ml-1 text-gray-700">{generatedDate ? new Date(generatedDate).toLocaleDateString("en-GB") : "-"}</span></span><div className="flex items-center gap-2"><input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder="Search Admission No./student Name" className="w-72 max-w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" /><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-500 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"><option>Status</option><option>Generated</option><option>Pending</option></select></div></div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm rounded-2xl shadow-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-900 bg-indigo-50">
                                    <th className="w-10 py-2">
                                        <input type="checkbox" checked={checked.size === students.length && students.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />
                                    </th>
                                    <th className="py-2 font-medium">S.No.</th>
                                    <th className="py-2 font-medium">Hall Ticket No</th>
                                    <th className="py-2 font-medium">Student</th>
                                    <th className="py-2 font-medium">Admission No</th>
                                    <th className="py-2 font-medium">Roll No</th>
                                    <th className="py-2 font-medium">Status</th>
                                    <th className="py-2 font-medium">Published</th>
                                    <th className="py-2 font-medium">Fees Status</th>
                                    <th className="py-2 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student, index) => {
                                    const id = getId(student);
                                    return (
                                    <tr key={id} className="text-gray-900">
                                        <td className="py-2.5">
                                            <input type="checkbox" checked={checked.has(id)} onChange={() => toggleRow(id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />
                                        </td>
                                        <td className="py-2.5">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                        <td className="py-2.5 font-medium text-gray-900">{student.hallTicketNo || "-"}</td>
                                        <td className="py-2.5">{student.studentName || student.name || "-"}</td>
                                        <td className="py-2.5">{student.admissionNo || "-"}</td>
                                        <td className="py-2.5">{student.rollNo || "-"}</td>
                                        <td className="py-2.5 text-gray-900">{student.status || "-"}</td>
                                        <td className="py-2.5 text-gray-900">{student.published || student.publishedTo || ""}</td>
                                        <td className="py-2.5"><StatusPill value={student.feeStatus} /></td>
                                        <td className="relative py-2.5 text-right">
                                            <button onClick={() => setOpenMenuId(openMenuId === id ? null : id)} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>{openMenuId === id &&
                                                <div className="absolute right-2 top-9 z-10 w-48 rounded-lg border border-gray-100 bg-white py-1 text-left shadow-lg">
                                                    <button onClick={() => handleDownload(student)} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                                                        <Download className="h-3.5 w-3.5" />Download Hall Ticket</button>
                                                    <button onClick={() => { setDeleteId(id); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50">
                                                        <Trash2 className="h-3.5 w-3.5" /> Delete</button>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    );
                                })}{students.length === 0 && <tr>
                                    <td colSpan={10} className="py-6 text-center text-sm text-gray-400">
                                        {loading ? "Loading..." : "No students found."}</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <button onClick={() =>
                            setPublishOpen(true)}
                            disabled={!examId || !classId || loading}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                            Publish
                        </button>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination?.totalPages || 1}
                            rowsPerPage={rowsPerPage}
                            setCurrentPage={setCurrentPage}
                            setRowsPerPage={setRowsPerPage} /></div>
                </div>
            </div>
        </div>
        {publishOpen &&
            <PublishModal
                examLabel={examinationTypes.find((exam) => String(exam.id || exam.examTypeId) === examId)?.examType || ""}
                classLabel={classes.find((classItem) => String(classItem.id || classItem.classId) === classId)?.classCode || ""} onClose={() => setPublishOpen(false)}
                onPublish={handlePublish}
                loading={loading} />
        }
        <DeleteConfirmModal
            isOpen={Boolean(deleteId)}
            title="Delete Hall Ticket"
            message="Are you sure you want to delete this hall ticket?"
            onClose={() => setDeleteId(null)}
            onConfirm={() => {
                dispatch(deleteHallTicketAsync(deleteId));
                setDeleteId(null);
            }}
        />
    </div>;
}
