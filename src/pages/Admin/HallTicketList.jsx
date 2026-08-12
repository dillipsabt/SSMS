import { Download, MoreVertical, Trash2, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";

import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";

import {
    fetchAcademicYears,
    fetchClasses,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";

import useToastMessage from "../../utils/useToastMessage";
import {
    generateHallTicketPdf,
    generateHallTicketsPdf,
    HALL_TICKET_TEMPLATES,
} from "../../utils/generateHallTicketPdf";

import {
    clearError,
    clearSuccess,
    deleteHallTicketAsync,
    fetchAdminHallTicketDetails,
    fetchHallTicketExaminationTypes,
    fetchStudentWiseHallTickets,
    publishHallTicketsAsync,
} from "../../features/Admin/HallTicket/hallTicketSlice";

const PublishModal = ({ examLabel, classLabel, onClose, onPublish, loading }) => {
    const [publishToPortal, setPublishToPortal] = useState(true);
    const [publishToWhatsapp, setPublishToWhatsapp] = useState(false);
    const [notes, setNotes] = useState("");

    const close = () => {
        setNotes("");
        setPublishToPortal(true);
        setPublishToWhatsapp(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="border-b border-gray-100 px-5 py-4">
                    <h3 className="text-lg font-semibold text-gray-800">Publish Hall Tickets</h3>
                    <p className="mt-1 text-sm text-gray-500">{examLabel}{classLabel ? ` - ${classLabel}` : ""}</p>
                </div>

                <div className="space-y-4 px-5 py-5">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={publishToPortal} onChange={(event) => setPublishToPortal(event.target.checked)} />
                        Publish to student portal
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={publishToWhatsapp} onChange={(event) => setPublishToWhatsapp(event.target.checked)} />
                        Publish to WhatsApp
                    </label>
                    <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Add notes"
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                    <button onClick={close} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">Cancel</button>
                    <button
                        onClick={() => onPublish({ publishToPortal, publishToWhatsapp, notes })}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const getId = (item) => item?.hallTicketId || item?.id;

const StatusPill = ({ value }) => {
    const normalized = String(value || "-").toUpperCase();
    const paid = normalized === "PAID" || normalized === "SUCCESS";
    const className = paid
        ? "bg-green-100 text-green-700"
        : normalized === "-"
            ? "bg-gray-100 text-gray-500"
            : "bg-red-100 text-red-700";

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
            {value || "-"}
        </span>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function HallTicketList() {
    const dispatch = useDispatch();

    const [academicYearId, setAcademicYearId] = useState("");

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

    const [downloadingId, setDownloadingId] = useState(null);

    const [hasSearched, setHasSearched] = useState(false);

    const [hallTicketTemplate, setHallTicketTemplate] = useState("classic");

    // ==========================================================
    // REDUX
    // ==========================================================

    const {
        examinationTypes = [],
        students = [],
        generatedDate,
        pagination,
        loading,
        success,
        successMessage,
        error,
    } = useSelector((state) => state.hallTicket || {});

    const { academicYears = [], classes = [] } = useSelector(
        (state) => state.examSchedule || {},
    );

    // ==========================================================
    // FETCH LIST
    // ==========================================================

    const fetchList = useCallback(
        () =>
            dispatch(
                fetchStudentWiseHallTickets({
                    ...(academicYearId && {
                        academicYearId,
                    }),

                    ...(examId && {
                        examId,
                    }),

                    ...(classId && {
                        classId,
                    }),

                    ...(search && {
                        search,
                    }),

                    ...(statusFilter !== "Status" && {
                        status: statusFilter,
                    }),

                    page: currentPage - 1,

                    size: rowsPerPage,
                }),
            ),

        [
            academicYearId,
            classId,
            currentPage,
            dispatch,
            examId,
            rowsPerPage,
            search,
            statusFilter,
        ],
    );

    // ==========================================================
    // INITIAL DATA
    // ==========================================================

    useEffect(() => {
        dispatch(fetchAcademicYears());

        dispatch(fetchClasses());

        dispatch(clearSuccess());

        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (academicYearId && classId) {
            dispatch(
                fetchHallTicketExaminationTypes({ academicYearId, classId }),
            );
        }
    }, [academicYearId, classId, dispatch]);

    // ==========================================================
    // SEARCH VALIDATION
    // ==========================================================

    const handleSearch = () => {
        if (!academicYearId) {
            toast.error("Academic Year is required");
            return;
        }

        if (!classId) {
            toast.error("Class Type is required");
            return;
        }

        if (!examId) {
            toast.error("Exam Type is required");
            return;
        }

        setCurrentPage(1);
        setHasSearched(true);
    };

    // ==========================================================
    // FETCH STUDENTS
    // ==========================================================

    useEffect(() => {
        if (hasSearched) {
            fetchList();
        }
    }, [fetchList, hasSearched]);

    // ==========================================================
    // TOAST
    // ==========================================================

    useToastMessage({
        success,
        successMessage,
        error,
        clearSuccess,
        clearError,
        onSuccess: fetchList,
    });

    // ==========================================================
    // TOGGLE ROW
    // ==========================================================

    const toggleRow = (id) =>
        setChecked((current) => {
            const next = new Set(current);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });

    // ==========================================================
    // TOGGLE ALL
    // ==========================================================

    const toggleAll = () =>
        setChecked((current) =>
            current.size === students.length
                ? new Set()
                : new Set(students.map(getId)),
        );

    // ==========================================================
    // DOWNLOAD / GENERATE HALL TICKET PDF
    // ==========================================================

    const handleDownload = async (student) => {
        const studentId = getId(student);

        setOpenMenuId(null);

        if (!studentId) {
            console.error("Hall Ticket ID missing:", student);

            return;
        }

        try {
            setDownloadingId(studentId);

            const hallTicketNo =
                student.hallTicketNo || student.hallTicketNumber || student.ticketNo;

            if (!hallTicketNo) {
                throw new Error("Hall ticket number missing");
            }

            const ticketData = await dispatch(
                fetchAdminHallTicketDetails(hallTicketNo),
            ).unwrap();

            generateHallTicketPdf(ticketData, hallTicketTemplate);
        } catch (error) {
            console.error("Error generating hall ticket:", error);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleHallTicketTemplateChange = (event) => {
        const template = event.target.value;
        setHallTicketTemplate(template);
    };

    const handlePrintAll = async () => {
        if (!students.length) {
            toast.error("No hall tickets available to print");
            return;
        }

        try {
            setDownloadingId("all");
            const tickets = await Promise.all(
                students.map(async (student) => {
                    const hallTicketNo = student.hallTicketNo || student.hallTicketNumber || student.ticketNo;
                    if (!hallTicketNo) return null;
                    return dispatch(fetchAdminHallTicketDetails(hallTicketNo)).unwrap();
                }),
            );
            const validTickets = tickets.filter(Boolean);
            if (!validTickets.length) {
                toast.error("Hall ticket numbers are missing");
                return;
            }
            generateHallTicketsPdf(validTickets, hallTicketTemplate);
        } catch (error) {
            toast.error(error?.message || "Unable to generate hall tickets");
        } finally {
            setDownloadingId(null);
        }
    };

    // ==========================================================
    // PUBLISH
    // ==========================================================

    const handlePublish = (options) => {
        dispatch(
            publishHallTicketsAsync({
                academicYearId: Number(academicYearId),

                classId: Number(classId),

                examId: Number(examId),

                ...options,
            }),
        );

        setPublishOpen(false);
    };

    // ==========================================================
    // RETURN
    // ==========================================================

    return (
        <div className="min-h-screen w-full bg-gray-50 px-6 py-6 font-sans antialiased">
            <div className="w-full">
                {/* ==================================================
            PAGE TITLE
        ================================================== */}

                <div className="mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Hall Ticket List
                    </h1>

                    <p className="text-xs text-gray-400">
                        Home / Hall Ticket / Hall Ticket List
                    </p>
                </div>

                {/* ==================================================
            MAIN CARD
        ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="mb-4 text-[15px] font-semibold text-gray-700">
                        Hall Ticket List
                    </h2>

                    {/* ==================================================
              FILTERS
          ================================================== */}

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">
                                Academic Year
                                <span className="text-rose-500">*</span>
                            </label>

                            <select
                                value={academicYearId}
                                onChange={(event) => {
                                    setAcademicYearId(event.target.value);
                                    setExamId("");
                                    setCurrentPage(1);
                                    setHasSearched(false);
                                }}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Select</option>

                                {academicYears.map((year) => (
                                    <option
                                        key={year.id || year.academicYearId}
                                        value={year.id || year.academicYearId}
                                    >
                                        {year.year || year.academicYear}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Class */}

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">
                                Class Type
                                <span className="text-rose-500">*</span>
                            </label>

                            <select
                                value={classId}
                                onChange={(event) => {
                                    setClassId(event.target.value);
                                    setExamId("");
                                    setCurrentPage(1);
                                    setHasSearched(false);
                                }}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Select</option>

                                {classes.map((classItem) => (
                                    <option
                                        key={classItem.id || classItem.classId}
                                        value={classItem.id || classItem.classId}
                                    >
                                        {classItem.classCode ||
                                            classItem.name ||
                                            classItem.className ||
                                            "-"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Exam */}

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">
                                Exam Type
                                <span className="text-rose-500">*</span>
                            </label>

                            <select
                                value={examId}
                                onChange={(event) => {
                                    setExamId(event.target.value);
                                    setCurrentPage(1);
                                    setHasSearched(false);
                                }}
                                disabled={!academicYearId || !classId || loading}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Select</option>

                                {examinationTypes.map((exam) => (
                                    <option key={exam.examId} value={exam.examId}>
                                        {exam.examinationType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}

                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                onClick={handleSearch}
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <hr className="mb-5 border-gray-100" />

                    {/* ==================================================
              STUDENT LIST
          ================================================== */}

                    <div>
                        <div className="border-b border-gray-200">
                            <h3 className="mb-3 text-[15px] font-semibold text-gray-700">
                                Student Wise List
                            </h3>
                        </div>

                        {/* Search */}

                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-sm text-gray-500">
                                Date{" "}
                                <span className="ml-1 text-gray-700">
                                    {generatedDate
                                        ? new Date(generatedDate).toLocaleDateString("en-GB")
                                        : "-"}
                                </span>
                            </span>

                            <div className="flex items-center gap-2">
                                <input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);

                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search Admission No./student Name"
                                    className="w-72 max-w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(event) => {
                                        setStatusFilter(event.target.value);

                                        setCurrentPage(1);
                                    }}
                                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-500 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option>Status</option>
                                    <option>Generated</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>

                        {/* =================================================
                TABLE
            ================================================== */}

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] rounded-2xl text-left text-sm shadow-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-indigo-50 text-xs text-gray-900">
                                        <th className="w-10 py-2">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    checked.size === students.length &&
                                                    students.length > 0
                                                }
                                                onChange={toggleAll}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                                            />
                                        </th>

                                        <th className="py-2 font-medium">S.No.</th>

                                        <th className="py-2 font-medium">Admission No</th>

                                        <th className="py-2 font-medium">Student</th>

                                        <th className="py-2 font-medium">Roll No</th>

                                        <th className="py-2 font-medium">Status</th>

                                        <th className="py-2 font-medium">Published</th>

                                        <th className="py-2 font-medium">Fees Status</th>

                                        <th className="py-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-50">
                                    {students.map((student, index) => {
                                        const id = getId(student);

                                        const isDownloading = downloadingId === id;

                                        return (
                                            <tr key={id} className="text-gray-900">
                                                {/* Checkbox */}

                                                <td className="py-2.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked.has(id)}
                                                        onChange={() => toggleRow(id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                                                    />
                                                </td>

                                                {/* S.No */}

                                                <td className="py-2.5">
                                                    {(currentPage - 1) * rowsPerPage + index + 1}
                                                </td>

                                                {/* Admission No */}

                                                <td className="py-2.5 font-medium text-gray-900">
                                                    {student.admissionNo ||
                                                        student.admissionNumber ||
                                                        "-"}
                                                </td>

                                                {/* Student */}

                                                <td className="py-2.5">
                                                    {student.studentName || student.name || "-"}
                                                </td>

                                                {/* Roll */}

                                                <td className="py-2.5">
                                                    {student.rollNo || student.rollNumber || "-"}
                                                </td>

                                                {/* Status */}

                                                <td className="py-2.5">{student.status || "-"}</td>

                                                {/* Published */}

                                                <td className="py-2.5">
                                                    {student.published || student.publishedTo || "-"}
                                                </td>

                                                {/* Fees */}

                                                <td className="py-2.5">
                                                    <StatusPill value={student.feeStatus} />
                                                </td>

                                                {/* Action */}

                                                <td className="relative py-2.5 text-right">
                                                    <button
                                                        onClick={() =>
                                                            setOpenMenuId(openMenuId === id ? null : id)
                                                        }
                                                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>

                                                    {openMenuId === id && (
                                                        <div className="absolute right-2 top-9 z-10 w-52 rounded-lg border border-gray-100 bg-white py-1 text-left shadow-lg">
                                                            {/* Download */}

                                                            <button
                                                                onClick={() => handleDownload(student)}
                                                                disabled={isDownloading}
                                                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {isDownloading ? (
                                                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                                                                ) : (
                                                                    <Download className="h-3.5 w-3.5" />
                                                                )}

                                                                {isDownloading
                                                                    ? "Generating..."
                                                                    : "Download Hall Ticket"}
                                                            </button>

                                                            {/* Delete */}

                                                            <button
                                                                onClick={() => {
                                                                    setDeleteId(id);

                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Empty */}

                                    {students.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="py-6 text-center text-sm text-gray-400"
                                            >
                                                {loading ? "Loading..." : "No students found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* =================================================
                PAGINATION
            ================================================== */}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">Template
                                    <select value={hallTicketTemplate} onChange={handleHallTicketTemplateChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                                        {HALL_TICKET_TEMPLATES.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}
                                    </select>
                                </label>
                                <button
                                    onClick={handlePrintAll}
                                    disabled={!students.length || downloadingId === "all"}
                                    className="rounded-lg border border-indigo-600 px-5 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                                >
                                    {downloadingId === "all" ? "Preparing..." : "Print All"}
                                </button>
                                <button
                                    onClick={() => setPublishOpen(true)}
                                    disabled={!examId || !classId || loading}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Publish
                                </button>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagination?.totalPages || 1}
                                rowsPerPage={rowsPerPage}
                                setCurrentPage={setCurrentPage}
                                setRowsPerPage={setRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ======================================================
          PUBLISH MODAL
      ====================================================== */}

            {publishOpen && (
                <PublishModal
                    examLabel={
                        examinationTypes.find((exam) => String(exam.examId) === examId)
                            ?.examinationType ||
                        ""
                    }
                    classLabel={
                        classes.find(
                            (classItem) =>
                                String(classItem.id || classItem.classId) === classId,
                        )?.classCode ||
                        classes.find(
                            (classItem) =>
                                String(classItem.id || classItem.classId) === classId,
                        )?.name ||
                        ""
                    }
                    onClose={() => setPublishOpen(false)}
                    onPublish={handlePublish}
                    loading={loading}
                />
            )}

            {/* ======================================================
          DELETE MODAL
      ====================================================== */}

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
        </div>
    );
}
