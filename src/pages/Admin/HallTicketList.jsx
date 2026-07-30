import { Download, MoreVertical, Trash2, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import jsPDF from "jspdf";

import { toast } from "sonner";

import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";

import {
    fetchAcademicYears,
    fetchClasses,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";

import useToastMessage from "../../utils/useToastMessage";

import {
    clearError,
    clearSuccess,
    deleteHallTicketAsync,
    fetchAdminHallTicketDetails,
    fetchHallTicketExaminationTypes,
    fetchStudentWiseHallTickets,
    publishHallTicketsAsync,
} from "../../features/Admin/HallTicket/hallTicketSlice";

// ============================================================
// DEFAULT IMAGES
// ============================================================

const defaultStudentImage = null;
const defaultSchoolLogo = null;

// ============================================================
// STATUS PILL
// ============================================================

function StatusPill({ value }) {
    const map = {
        Completed: "bg-emerald-50 text-emerald-600 ring-emerald-200",

        Pending: "bg-amber-50 text-amber-600 ring-amber-200",

        Generated: "bg-indigo-50 text-indigo-600 ring-indigo-200",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${map[value] || "bg-gray-50 text-gray-600 ring-gray-200"
                }`}
        >
            {value || "-"}
        </span>
    );
}

// ============================================================
// PUBLISH MODAL
// ============================================================

function PublishModal({ examLabel, classLabel, onClose, onPublish, loading }) {
    const [publishToPortal, setPublishToPortal] = useState(true);

    const [publishToWhatsapp, setPublishToWhatsapp] = useState(true);

    const [notes, setNotes] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between rounded-t-xl bg-indigo-600 px-5 py-3.5">
                    <h3 className="text-sm font-semibold text-white">
                        Publish Hall Tickets
                    </h3>

                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                        {examLabel || "-"} — {classLabel || "-"}
                    </p>

                    <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">
                            Publish Options
                        </p>

                        <label className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={publishToPortal}
                                onChange={() => setPublishToPortal((value) => !value)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                            />
                            Publish to student portal
                        </label>

                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={publishToWhatsapp}
                                onChange={() => setPublishToWhatsapp((value) => !value)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                            />
                            Publish to Whatsapp
                        </label>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-500">
                            Notes (Optional)
                        </label>

                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Ready to publish."
                            rows={3}
                            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            onPublish({
                                publishToPortal,
                                publishToWhatsapp,
                                notes,
                            })
                        }
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// HELPERS
// ============================================================

const getId = (item) => item?.hallTicketId || item?.id;

const getFileName = (student) => {
    const studentName = student?.studentName || student?.name || "student";

    const admissionNo =
        student?.admissionNo || student?.admissionNumber || "hall-ticket";

    const safeName = String(studentName)
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");

    const safeAdmission = String(admissionNo)
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");

    return `hall-ticket-${safeName}-${safeAdmission}.pdf`;
};

// ============================================================
// DATE FORMAT
// ============================================================

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-GB");
};

// ============================================================
// IMAGE -> DATA URL
// ============================================================

const getImageAsDataUrl = (image, fallback = null) => {
    if (!image?.contentType || !image?.data) {
        return fallback;
    }

    return `data:${image.contentType};base64,${image.data}`;
};

// ============================================================
// IMAGE FORMAT
// ============================================================

const getImageFormat = (dataUrl) => {
    if (!dataUrl) return "PNG";

    if (
        dataUrl.startsWith("data:image/jpeg") ||
        dataUrl.startsWith("data:image/jpg")
    ) {
        return "JPEG";
    }

    return "PNG";
};

// ============================================================
// ROUNDED RECTANGLE
// ============================================================

const drawRoundedRect = (doc, x, y, width, height, radius = 3, style = "S") => {
    doc.roundedRect(x, y, width, height, radius, radius, style);
};

// ============================================================
// EXAM SCHEDULE FROM DYNAMIC DATA
// ============================================================

const formatScheduleTime = (value) => {
    if (!value) return "-";
    if (typeof value === "string") return value.slice(0, 5);
    return `${String(value.hour ?? 0).padStart(2, "0")}:${String(
        value.minute ?? 0,
    ).padStart(2, "0")}`;
};

const getDynamicSchedule = (student) => {
    const schedule =
        student?.examSchedule ||
        student?.examinationSchedule ||
        student?.schedules ||
        student?.subjects ||
        [];

    if (!Array.isArray(schedule)) {
        return [];
    }

    return schedule
        .map((item) => ({
            subjectName:
                item?.subjectName ||
                item?.subject ||
                item?.name ||
                item?.subjectTitle ||
                "-",

            examDate: item?.examDate || item?.date || item?.examinationDate || null,
            startTime: formatScheduleTime(item?.startTime),
            endTime: formatScheduleTime(item?.endTime),
        }))
        .filter((item) => item.subjectName !== "-" || item.examDate);
};

// ============================================================
// ICON DRAWING
// ============================================================

const drawDetailIcon = (doc, x, y, type, GREEN, WHITE) => {
    // Green circle
    doc.setFillColor(...GREEN);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.4);

    doc.circle(x, y, 3.6, "FD");

    // White icon
    doc.setDrawColor(...WHITE);
    doc.setFillColor(...WHITE);

    // ----------------------------------------------------------
    // PERSON ICON
    // ----------------------------------------------------------

    if (type === "person") {
        doc.setLineWidth(0.45);

        // Head
        doc.circle(x, y - 1.15, 0.9, "S");

        // Shoulders
        doc.line(x - 1.8, y + 1.6, x - 1.1, y + 0.4);

        doc.line(x - 1.1, y + 0.4, x + 1.1, y + 0.4);

        doc.line(x + 1.1, y + 0.4, x + 1.8, y + 1.6);

        return;
    }

    // ----------------------------------------------------------
    // FATHER / PERSON ICON
    // ----------------------------------------------------------

    if (type === "father") {
        doc.setLineWidth(0.45);

        doc.circle(x, y - 1.15, 0.9, "S");

        doc.line(x - 1.8, y + 1.6, x - 1.1, y + 0.4);

        doc.line(x - 1.1, y + 0.4, x + 1.1, y + 0.4);

        doc.line(x + 1.1, y + 0.4, x + 1.8, y + 1.6);

        return;
    }

    // ----------------------------------------------------------
    // ROLL NUMBER / ID CARD ICON
    // ----------------------------------------------------------

    if (type === "roll") {
        doc.setLineWidth(0.45);

        doc.rect(x - 2.1, y - 1.7, 4.2, 3.4, "S");

        doc.circle(x - 0.9, y - 0.55, 0.45, "S");

        doc.line(x, y - 0.7, x + 1.2, y - 0.7);

        doc.line(x, y + 0.35, x + 1.2, y + 0.35);

        return;
    }

    // ----------------------------------------------------------
    // CLASS / GRADUATION CAP ICON
    // ----------------------------------------------------------

    if (type === "class") {
        doc.setLineWidth(0.5);

        // Cap diamond
        doc.line(x - 2.3, y - 0.5, x, y - 1.8);

        doc.line(x, y - 1.8, x + 2.3, y - 0.5);

        doc.line(x + 2.3, y - 0.5, x, y + 0.8);

        doc.line(x, y + 0.8, x - 2.3, y - 0.5);

        // Tassel
        doc.line(x + 1.6, y - 1, x + 1.6, y + 1.5);

        doc.circle(x + 1.6, y + 1.5, 0.35, "S");

        return;
    }

    // ----------------------------------------------------------
    // ADMISSION NUMBER / ID CARD ICON
    // ----------------------------------------------------------

    if (type === "admission") {
        doc.setLineWidth(0.45);

        doc.rect(x - 2.1, y - 2, 4.2, 4, "S");

        doc.circle(x, y - 0.8, 0.55, "S");

        doc.line(x - 1.2, y + 0.8, x + 1.2, y + 0.8);

        return;
    }
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
        createSuccess: success,

        createMessage: successMessage,

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

            // ======================================================
            // SCHOOL DATA
            // ======================================================

            const schoolName = ticketData.schoolName || "School Name";

            const schoolAddress = ticketData.schoolAddress || "Address here";

            const examType =
                ticketData.examType ||
                ticketData.examinationType ||
                ticketData.exam?.examType ||
                "Examination";

            const academicYear =
                ticketData.academicYear || ticketData.exam?.academicYear || "";

            // ======================================================
            // STUDENT DATA - ALL DYNAMIC
            // ======================================================

            const studentName = ticketData.studentName || ticketData.name || "-";

            const fatherName =
                ticketData.fatherName || ticketData.father || ticketData.parentName || "-";

            const rollNo = ticketData.rollNo || ticketData.rollNumber || "-";

            const admissionNo = ticketData.admissionNo || ticketData.admissionNumber || "-";

            const classSection =
                ticketData.classSection ||
                ticketData.classAndSection ||
                ticketData.className ||
                ticketData.classCode ||
                "-";

            // IMPORTANT:
            // Hall Ticket Number is intentionally NOT used
            // anywhere in the PDF.

            // ======================================================
            // INSTRUCTIONS
            // ======================================================

            const instructions = [
                "No Re-Examination"
            ];
            const scheduleRowCount = Math.max(
                Math.ceil(getDynamicSchedule(ticketData).length / 3),
                1,
            );
            const pageHeight = 100 + scheduleRowCount * 8 + instructions.length * 5 + 20;

            // ======================================================
            // LOAD IMAGES
            // ======================================================

            const schoolLogo = getImageAsDataUrl(
                ticketData.schoolLogo,
                defaultSchoolLogo,
            );

            const studentPhoto = getImageAsDataUrl(
                ticketData.studentPhoto,
                defaultStudentImage,
            );

            const principalSignature = getImageAsDataUrl(
                ticketData.principalSignature,
            );

            // ======================================================
            // PDF
            // ======================================================

            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [210, pageHeight],
            });

            const pageWidth = doc.internal.pageSize.getWidth();

            // ======================================================
            // COLORS
            // ======================================================

            const GREEN = [0, 91, 73];

            const LIGHT_GREEN = [237, 247, 243];

            const GOLD = [241, 190, 45];

            const TEXT = [55, 55, 55];

            const BORDER = [100, 100, 100];

            const LIGHT_BORDER = [180, 180, 180];

            const WHITE = [255, 255, 255];

            // ======================================================
            // PAGE MARGINS
            // ======================================================

            const marginX = 6;

            const contentWidth = pageWidth - marginX * 2;

            // ======================================================
            // OUTER BORDER
            // ======================================================

            doc.setDrawColor(...BORDER);

            doc.setLineWidth(0.55);

            drawRoundedRect(doc, marginX, 5, contentWidth, pageHeight - 10, 4, "S");

            // ======================================================
            // HEADER
            // ======================================================

            const headerTop = 7;

            // ======================================================
            // SCHOOL LOGO
            // ======================================================

            const logoX = marginX + 5;

            const logoY = headerTop + 2;

            const logoWidth = 25;

            const logoHeight = 22;

            if (schoolLogo) {
                try {
                    const logoProperties = doc.getImageProperties(schoolLogo);
                    const logoScale = Math.min(
                        logoWidth / logoProperties.width,
                        logoHeight / logoProperties.height,
                    );
                    const renderedLogoWidth = logoProperties.width * logoScale;
                    const renderedLogoHeight = logoProperties.height * logoScale;

                    doc.addImage(
                        schoolLogo,
                        getImageFormat(schoolLogo),
                        logoX + (logoWidth - renderedLogoWidth) / 2,
                        logoY + (logoHeight - renderedLogoHeight) / 2,
                        renderedLogoWidth,
                        renderedLogoHeight,
                    );
                } catch (error) {
                    console.error("School logo error:", error);
                }
            } else {
                doc.setDrawColor(...GREEN);

                doc.setLineWidth(0.5);

                doc.circle(logoX + 11, logoY + 11, 9);

                doc.setFont("helvetica", "bold");

                doc.setFontSize(6);

                doc.setTextColor(...GREEN);

                doc.text("SCHOOL", logoX + 11, logoY + 10, {
                    align: "center",
                });

                doc.text("LOGO", logoX + 11, logoY + 14, {
                    align: "center",
                });
            }

            // ======================================================
            // HALL TICKET BANNER
            // ======================================================

            const bannerWidth = 50;
            const bannerHeight = 10;

            const bannerX = pageWidth / 2 - bannerWidth / 2 + 8;
            const bannerY = headerTop;

            doc.setFillColor(...GREEN);

            doc.roundedRect(
                bannerX,
                bannerY,
                bannerWidth,
                bannerHeight,
                4,
                4,
                "F"
            );

            // Gold line
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.6);

            doc.line(
                bannerX + 5,
                bannerY + 2,
                bannerX + bannerWidth - 5,
                bannerY + 2
            );

            doc.line(
                bannerX + 5,
                bannerY + bannerHeight - 2,
                bannerX + bannerWidth - 5,
                bannerY + bannerHeight - 2
            );

            // White Title
            doc.setFont("times", "bold");
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);

            doc.text(
                "HALL TICKET",
                bannerX + bannerWidth / 2,
                bannerY + 6.2,
                { align: "center" }
            );


            // ======================================================
            // SCHOOL NAME
            // ======================================================

            const schoolNameStartX = logoX + logoWidth + 3;

            // Banner aur school name ke beech extra gap
            const schoolNameWidth = bannerX - schoolNameStartX - 28;

            doc.setFont("helvetica", "bold");

            let schoolFont = 15;
            doc.setFontSize(schoolFont);

            // Font auto reduce
            while (
                doc.getTextWidth(schoolName) > schoolNameWidth &&
                schoolFont > 10
            ) {
                schoolFont--;
                doc.setFontSize(schoolFont);
            }

            doc.setTextColor(30, 30, 30);

            // Single line me print hoga
            doc.text(
                schoolName,
                schoolNameStartX,
                headerTop + 13.5
            );

            // ======================================================
            // SCHOOL ADDRESS
            // ======================================================

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);

            const addressWidth = schoolNameWidth;

            const addressLines = doc.splitTextToSize(
                schoolAddress,
                addressWidth
            );

            doc.text(
                addressLines,
                schoolNameStartX,
                headerTop + 18.5
            );

            // ======================================================
            // EXAM NAME
            // ======================================================

            const examCenterX = bannerX + bannerWidth / 2;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...GREEN);

            doc.text(
                examType.toUpperCase(),
                examCenterX,
                bannerY + 15.5,   // thoda upar
                { align: "center" }
            );

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);

            doc.text(
                `Academic Session ${academicYear}`,
                examCenterX,
                bannerY + 20.5,
                { align: "center" }
            );

            // ======================================================
            // STUDENT PHOTO
            // ======================================================

            const photoWidth = 25;

            const photoHeight = 27;

            const photoX = marginX + contentWidth - photoWidth - 5;

            const photoY = headerTop + 1;

            if (studentPhoto) {
                doc.setFillColor(...LIGHT_GREEN);
                doc.setDrawColor(...LIGHT_BORDER);
                doc.setLineWidth(0.4);
                doc.roundedRect(photoX, photoY, photoWidth, photoHeight, 3, 3, "FD");

                try {
                    doc.addImage(
                        studentPhoto,
                        getImageFormat(studentPhoto),
                        photoX + 1,
                        photoY + 1,
                        photoWidth - 2,
                        photoHeight - 2,
                    );
                } catch (error) {
                    console.error("Student photo error:", error);
                }
            }

            // ======================================================
            // STUDENT INFORMATION BOX
            // ======================================================

            const infoTop = 35;

            const infoHeight = 28;

            doc.setDrawColor(...LIGHT_BORDER);

            doc.setLineWidth(0.45);

            drawRoundedRect(
                doc,
                marginX + 4,
                infoTop,
                contentWidth - 8,
                infoHeight,
                3,
                "S",
            );

            // ======================================================
            // VERTICAL SEPARATOR
            // ======================================================

            const infoMiddle = pageWidth / 2;

            doc.setDrawColor(...LIGHT_BORDER);

            doc.setLineWidth(0.5);

            doc.line(infoMiddle, infoTop + 3, infoMiddle, infoTop + infoHeight - 3);

            // ======================================================
            // STUDENT DETAIL FUNCTION
            // ======================================================

            const drawStudentDetail = (x, y, label, value, icon, valueX) => {
                drawDetailIcon(doc, x, y - 1.7, icon, GREEN, WHITE);

                doc.setFont("helvetica", "normal");

                doc.setFontSize(8.5);

                doc.setTextColor(...TEXT);

                // Label
                doc.text(label, x + 7, y);

                // Colon
                doc.text(":", x + 32, y);

                // Value
                doc.text(String(value || "-"), valueX, y);
            };

            // ======================================================
            // LEFT DETAILS
            // ======================================================

            const leftInfoX = marginX + 9;

            drawStudentDetail(
                leftInfoX,
                infoTop + 8,
                "Name",
                studentName,
                "person",
                leftInfoX + 39,
            );

            drawStudentDetail(
                leftInfoX,
                infoTop + 17,
                "Father Name",
                fatherName,
                "father",
                leftInfoX + 39,
            );

            drawStudentDetail(
                leftInfoX,
                infoTop + 25,
                "Roll No.",
                rollNo,
                "roll",
                leftInfoX + 39,
            );

            // ======================================================
            // RIGHT DETAILS
            // ======================================================

            const rightInfoX = infoMiddle + 8;

            drawStudentDetail(
                rightInfoX,
                infoTop + 8,
                "Class",
                classSection,
                "class",
                rightInfoX + 39,
            );

            // IMPORTANT:
            // Admission No. replaces Hall Ticket No.
            drawStudentDetail(
                rightInfoX,
                infoTop + 17,
                "Admission No.",
                admissionNo,
                "admission",
                rightInfoX + 39,
            );


            // ======================================================
            // EXAMINATION SCHEDULE HEADER
            // ======================================================

            const scheduleTop = infoTop + infoHeight + 3;

            const scheduleHeaderHeight = 8;

            doc.setFillColor(...GREEN);

            doc.setDrawColor(...GREEN);

            doc.roundedRect(
                marginX + 4,
                scheduleTop,
                contentWidth - 8,
                scheduleHeaderHeight,
                3,
                3,
                "F",
            );

            doc.setFillColor(...GREEN);

            doc.rect(marginX + 4, scheduleTop + 4, contentWidth - 8, 4, "F");

            doc.setFont("helvetica", "bold");

            doc.setFontSize(7);

            doc.setTextColor(...WHITE);

            doc.text("EXAMINATION SCHEDULE", pageWidth / 2, scheduleTop + 5.5, {
                align: "center",
            });

            // ======================================================
            // SCHEDULE TABLE
            // ======================================================

            const tableTop = scheduleTop + scheduleHeaderHeight;

            const tableLeft = marginX + 4;

            const tableWidth = contentWidth - 8;

            const tableRowHeight = 11;

            const headerHeight = tableRowHeight;

            const dynamicSchedule = getDynamicSchedule(ticketData);

            // If API does not return schedule,
            // show one row instead of hard-coded data.
            const scheduleRows =
                dynamicSchedule.length > 0
                    ? dynamicSchedule
                    : [
                        {
                            subjectName: "-",
                            examDate: null,
                            startTime: "-",
                            endTime: "-",
                        },
                    ];

            const scheduleColumns = [0, 1, 2].map((column) =>
                scheduleRows.filter((_, index) => index % 3 === column),
            );

            const numberOfRows = Math.max(
                ...scheduleColumns.map((column) => column.length),
                1,
            );

            const tableHeight = headerHeight + numberOfRows * tableRowHeight;

            // Three subject/date pairs.
            const columnWidths = [32, 28, 32, 28, 32, 28];

            // ======================================================
            // TABLE BORDER
            // ======================================================

            doc.setDrawColor(...LIGHT_BORDER);

            doc.setLineWidth(0.35);

            doc.rect(tableLeft, tableTop, tableWidth, tableHeight);

            // ======================================================
            // HEADER BACKGROUND
            // ======================================================

            doc.setFillColor(240, 244, 243);

            doc.rect(tableLeft, tableTop, tableWidth, headerHeight, "F");

            // ======================================================
            // VERTICAL LINES
            // ======================================================

            let currentX = tableLeft;

            columnWidths.forEach((width, index) => {
                currentX += width;

                if (index < columnWidths.length - 1) {
                    doc.line(currentX, tableTop, currentX, tableTop + tableHeight);
                }
            });

            // ======================================================
            // HORIZONTAL LINES
            // ======================================================

            for (let i = 1; i <= numberOfRows; i++) {
                doc.line(
                    tableLeft,
                    tableTop + i * tableRowHeight,
                    tableLeft + tableWidth,
                    tableTop + i * tableRowHeight,
                );
            }

            // ======================================================
            // TABLE HEADERS
            // ======================================================

            const headers = [
                "SUBJECT",
                "DATE",
                "SUBJECT",
                "DATE",
                "SUBJECT",
                "DATE",
            ];

            let headerX = tableLeft;

            doc.setFont("helvetica", "bold");

            doc.setFontSize(7);

            doc.setTextColor(...TEXT);

            headers.forEach((header, index) => {
                const width = columnWidths[index];

                doc.text(header, headerX + width / 2, tableTop + 5.2, {
                    align: "center",
                });

                headerX += width;
            });

            // ======================================================
            // SCHEDULE CELL
            // ======================================================

            const drawScheduleCell = (x, y, width, value) => {
                doc.setFont("helvetica", "normal");

                doc.setFontSize(7);

                doc.setTextColor(...TEXT);

                doc.text(String(value || "-").split("\n"), x + width / 2, y, {
                    align: "center",
                    lineHeightFactor: 1.25,
                });
            };

            // ======================================================
            // TABLE ROWS
            // ======================================================

            for (let row = 0; row < numberOfRows; row++) {
                const y = tableTop + headerHeight + row * tableRowHeight + 5.2;
                let x = tableLeft;

                scheduleColumns.forEach((column, columnIndex) => {
                    const exam = column[row];
                    const subjectWidth = columnWidths[columnIndex * 2];
                    const dateWidth = columnWidths[columnIndex * 2 + 1];

                    drawScheduleCell(x, y, subjectWidth, exam?.subjectName);
                    x += subjectWidth;

                    drawScheduleCell(
                        x,
                        y,
                        dateWidth,
                        exam
                            ? `${formatDate(exam.examDate)}\n${exam.startTime} - ${exam.endTime}`
                            : "-",
                    );
                    x += dateWidth;
                });
            }

            // ======================================================
            // BOTTOM SECTION
            // ======================================================

            const bottomTop = tableTop + tableHeight + 4;

            // ======================================================
            // IMPORTANT INSTRUCTIONS
            // ======================================================

            const instructionWidth = 105;

            const instructionHeight = 22;

            const instructionX = marginX + 4;

            const instructionY = bottomTop - 3;

            doc.setFillColor(255, 250, 230);

            doc.setDrawColor(226, 184, 52);

            doc.setLineWidth(0.45);

            drawRoundedRect(
                doc,
                instructionX,
                instructionY,
                instructionWidth,
                instructionHeight,
                3,
                "FD",
            );

            // ======================================================
            // INSTRUCTION TITLE
            // ======================================================

            doc.setFont("helvetica", "bold");

            doc.setFontSize(7);

            doc.setTextColor(...TEXT);

            doc.text(
                "IMPORTANT INSTRUCTIONS",
                instructionX + 4,
                instructionY + 5
            );

            // ======================================================
            // INSTRUCTION LIST
            // ======================================================

            doc.setFont("helvetica", "normal");

            doc.setFontSize(5.5);

            instructions.forEach((instruction, index) => {

                const bulletY = instructionY + 11 + index * 4;

                doc.setFillColor(...TEXT);

                doc.circle(instructionX + 8, bulletY - 1.5, 0.6, "F");

                const lines = doc.splitTextToSize(instruction, 85);

                doc.text(lines, instructionX + 11, bulletY);

            });

            // ======================================================
            // SIGNATURE AREA
            // ======================================================

            const signatureAreaX = instructionX + instructionWidth + 7;

            const signatureAreaWidth = contentWidth - 8 - instructionWidth - 7;

            const signatureTop = instructionY;

            doc.setDrawColor(...LIGHT_BORDER);

            doc.setLineWidth(0.4);

            doc.line(
                signatureAreaX,
                signatureTop,
                signatureAreaX,
                signatureTop + instructionHeight,
            );

            // ======================================================
            // TWO SIGNATURE COLUMNS
            // ======================================================

            const signatureColumnWidth = signatureAreaWidth / 2;

            const studentSignatureCenter = signatureAreaX + signatureColumnWidth / 2;

            const principalSignatureCenter =
                signatureAreaX + signatureColumnWidth + signatureColumnWidth / 2;

            // Divider
            doc.line(
                signatureAreaX + signatureColumnWidth,
                signatureTop,
                signatureAreaX + signatureColumnWidth,
                signatureTop + instructionHeight,
            );

            // ======================================================
            // SIGNATURE LINES
            // ======================================================

            const signatureLineY = signatureTop + 18;

            doc.setDrawColor(...TEXT);

            doc.setLineWidth(0.35);

            doc.line(
                studentSignatureCenter - 20,
                signatureLineY,
                studentSignatureCenter + 20,
                signatureLineY,
            );

            doc.line(
                principalSignatureCenter - 20,
                signatureLineY,
                principalSignatureCenter + 20,
                signatureLineY,
            );

            // ======================================================
            // PRINCIPAL SIGNATURE
            // ======================================================

            if (principalSignature) {
                try {
                    doc.addImage(
                        principalSignature,
                        getImageFormat(principalSignature),
                        principalSignatureCenter - 17,
                        signatureTop + 5,
                        34,
                        11,
                    );
                } catch (error) {
                    console.error("Principal signature error:", error);
                }
            }

            // ======================================================
            // SIGNATURE LABELS
            // ======================================================

            doc.setFont("helvetica", "normal");

            doc.setFontSize(7.5);

            doc.setTextColor(...TEXT);

            doc.text("Student Signature", studentSignatureCenter, signatureTop + 24, {
                align: "center",
            });

            doc.text(
                "Principal Signature",
                principalSignatureCenter,
                signatureTop + 24,
                {
                    align: "center",
                },
            );

            // ======================================================
            // FOOTER
            // ======================================================

            doc.setFont("helvetica", "normal");

            doc.setFontSize(7.5);

            doc.setTextColor(130, 130, 130);

            doc.text(String(schoolName), pageWidth / 2, pageHeight - 7, {
                align: "center",
            });

            // ======================================================
            // DOWNLOAD PDF
            // ======================================================

            doc.save(getFileName(ticketData));

            console.log("Hall ticket generated successfully.");
        } catch (error) {
            console.error("Error generating hall ticket:", error);
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
                examId: Number(examId),

                classId: Number(classId),

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
                            <button
                                onClick={() => setPublishOpen(true)}
                                disabled={!examId || !classId || loading}
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Publish
                            </button>

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
