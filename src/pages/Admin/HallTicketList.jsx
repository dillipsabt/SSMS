import { Download, MoreVertical, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";

import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";

import { fetchClasses } from "../../features/Admin/ExamSchedule/examScheduleSlice";

import useToastMessage from "../../utils/useToastMessage";

import {
  clearError,
  clearSuccess,
  deleteHallTicketAsync,
  fetchHallTicketExaminationTypes,
  fetchStudentWiseHallTickets,
  publishHallTicketsAsync,
} from "../../features/Admin/HallTicket/hallTicketSlice";

// ============================================================
// OPTIONAL DEFAULT IMAGES
// ============================================================
//
// If you have default images, import them here.
//
// Example:
//
// import defaultStudentImage from "../../assets/default-student.jpg";
// import defaultSchoolLogo from "../../assets/greenfield.png";
//
// Then replace null below.
//
// ============================================================

const defaultStudentImage = null;
const defaultSchoolLogo = null;

// ============================================================
// HARD-CODED EXAM SCHEDULE
// ONLY SUBJECT + DATE
// ============================================================

const HARDCODED_EXAM_SCHEDULE = [
  {
    subjectName: "Telugu",
    examDate: "2026-07-27",
  },
  {
    subjectName: "English",
    examDate: "2026-07-29",
  },
  {
    subjectName: "Maths",
    examDate: "2026-07-30",
  },
  {
    subjectName: "Social",
    examDate: "2026-08-02",
  },
  {
    subjectName: "Hindi",
    examDate: "2026-08-03",
  },
  {
    subjectName: "Sanskrit",
    examDate: "2026-08-05",
  },
  {
    subjectName: "Science",
    examDate: "2026-08-07",
  },
  {
    subjectName: "Computer",
    examDate: "2026-08-09",
  },
];

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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        map[value] || "bg-gray-50 text-gray-600 ring-gray-200"
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
            {examLabel} — {classLabel}
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

const getFileName = (item) =>
  `hall-ticket-${item?.hallTicketNo || getId(item)}.pdf`;

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
// IMAGE TO DATA URL
// ============================================================

const getImageAsDataUrl = async (url, fallback = null) => {
  if (!url) {
    if (fallback) {
      return getImageAsDataUrl(fallback);
    }

    return null;
  }

  if (String(url).startsWith("data:image")) {
    return url;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Image request failed: ${response.status}`);
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);

      reader.onerror = () => reject(new Error("Unable to read image"));

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image loading failed:", error);

    if (fallback) {
      return getImageAsDataUrl(fallback);
    }

    return null;
  }
};

// ============================================================
// IMAGE FORMAT
// ============================================================

const getImageFormat = (dataUrl) => {
  if (!dataUrl) {
    return "PNG";
  }

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
// MAIN COMPONENT
// ============================================================

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
  const [downloadingId, setDownloadingId] = useState(null);

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

  const { classes = [] } = useSelector((state) => state.examSchedule || {});

  // ==========================================================
  // FETCH LIST
  // ==========================================================

  const fetchList = useCallback(
    () =>
      dispatch(
        fetchStudentWiseHallTickets({
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
    [classId, currentPage, dispatch, examId, rowsPerPage, search, statusFilter],
  );

  // ==========================================================
  // INITIAL DATA
  // ==========================================================

  useEffect(() => {
    dispatch(fetchHallTicketExaminationTypes());
    dispatch(fetchClasses());

    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // ==========================================================
  // FETCH STUDENTS
  // ==========================================================

  useEffect(() => {
    fetchList();
  }, [fetchList]);

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
  // DOWNLOAD HALL TICKET
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

      // ======================================================
      // SCHOOL INFORMATION
      // ======================================================

      const schoolName = student.schoolName || "School Name";

      const schoolAddress = student.schoolAddress || "Address here";

      const examType =
        student.examType || student.examinationType || "Mid Term Exam";

      const academicYear = student.academicYear || "2026-27";

      const principalName = student.principalName || "Principal";

      // ======================================================
      // STUDENT INFORMATION
      // ======================================================

      const studentName = student.studentName || student.name || "Naresh Kumar";

      const fatherName =
        student.fatherName ||
        student.father ||
        student.parentName ||
        "Venkataiah Naidu";

      const rollNo = student.rollNo || student.rollNumber || "0001";

      const classSection =
        student.classSection ||
        student.classAndSection ||
        student.className ||
        "8-A";

      const hallTicketNo = student.hallTicketNo || "HT2026001";

      // ======================================================
      // LOAD IMAGES
      // ======================================================

      const schoolLogo = await getImageAsDataUrl(
        student.schoolLogo,
        defaultSchoolLogo,
      );

      const studentPhoto = await getImageAsDataUrl(
        student.studentPhoto || student.photo,
        defaultStudentImage,
      );

      const principalSignature = student.principalSignature
        ? await getImageAsDataUrl(student.principalSignature)
        : null;

      // ======================================================
      // PDF
      // ======================================================

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      const pageHeight = doc.internal.pageSize.getHeight();

      // ======================================================
      // COLORS
      // ======================================================

      const GREEN = [0, 91, 73];
      const DARK_GREEN = [0, 75, 60];

      const LIGHT_GREEN = [237, 247, 243];

      const GOLD = [241, 190, 45];

      const TEXT = [55, 55, 55];

      const BORDER = [100, 100, 100];

      const LIGHT_BORDER = [180, 180, 180];

      const WHITE = [255, 255, 255];

      // ======================================================
      // PAGE MARGIN
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
          doc.addImage(
            schoolLogo,
            getImageFormat(schoolLogo),
            logoX,
            logoY,
            logoWidth,
            logoHeight,
          );
        } catch (error) {
          console.error("School logo error:", error);
        }
      } else {
        // Placeholder logo
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
      // SCHOOL NAME
      // ======================================================

      doc.setFont("helvetica", "bold");

      doc.setFontSize(10);
      doc.setTextColor(...GREEN);

      doc.text(String(schoolName), logoX + 29, headerTop + 10);

      // ======================================================
      // ADDRESS
      // ======================================================

      doc.setFont("helvetica", "normal");

      doc.setFontSize(6.5);
      doc.setTextColor(...TEXT);

      const addressLines = doc.splitTextToSize(String(schoolAddress), 48);

      doc.text(addressLines.slice(0, 2), logoX + 29, headerTop + 15);

      // ======================================================
      // HALL TICKET BANNER
      // ======================================================

      const bannerWidth = 64;
      const bannerHeight = 13;

      const bannerX = pageWidth / 2 - bannerWidth / 2;

      const bannerY = headerTop + 1;

      doc.setFillColor(...GREEN);
      doc.setDrawColor(...GREEN);
      doc.setLineWidth(0.5);

      doc.roundedRect(bannerX, bannerY, bannerWidth, bannerHeight, 2, 2, "FD");

      // White decorative lines
      doc.setDrawColor(...WHITE);
      doc.setLineWidth(0.4);

      doc.line(
        bannerX + 4,
        bannerY + 2,
        bannerX + bannerWidth - 4,
        bannerY + 2,
      );

      doc.line(
        bannerX + 4,
        bannerY + bannerHeight - 2,
        bannerX + bannerWidth - 4,
        bannerY + bannerHeight - 2,
      );

      doc.setFont("helvetica", "bold");

      doc.setFontSize(12);
      doc.setTextColor(...WHITE);

      doc.text("HALL TICKET", pageWidth / 2, bannerY + 8.5, {
        align: "center",
      });

      // ======================================================
      // EXAM NAME
      // ======================================================

      doc.setFont("helvetica", "bold");

      doc.setFontSize(9);
      doc.setTextColor(...GREEN);

      doc.text(`${examType}  ${academicYear}`, pageWidth / 2, bannerY + 18, {
        align: "center",
      });

      // Decorative
      doc.setFontSize(6);

      doc.text("• • • ★ • • •", pageWidth / 2, bannerY + 23, {
        align: "center",
      });

      // ======================================================
      // STUDENT PHOTO
      // ======================================================

      const photoWidth = 25;
      const photoHeight = 27;

      const photoX = marginX + contentWidth - photoWidth - 5;

      const photoY = headerTop + 1;

      doc.setFillColor(...LIGHT_GREEN);

      doc.setDrawColor(...LIGHT_BORDER);

      doc.setLineWidth(0.4);

      doc.roundedRect(photoX, photoY, photoWidth, photoHeight, 3, 3, "FD");

      if (studentPhoto) {
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
      // STUDENT INFO BOX
      // ======================================================

      const infoTop = 35;
      const infoHeight = 29;

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
      // CENTER DIVIDER
      // ======================================================

      const infoMiddle = pageWidth / 2;

      doc.setDrawColor(...LIGHT_BORDER);

      doc.line(infoMiddle, infoTop + 3, infoMiddle, infoTop + infoHeight - 3);

      // ======================================================
      // ICON FUNCTION
      // ======================================================

      const drawIcon = (x, y, type) => {
        const radius = 3.5;

        // Green circle
        doc.setFillColor(...GREEN);
        doc.setDrawColor(...GREEN);
        doc.setLineWidth(0.25);

        doc.circle(x, y, radius, "FD");

        // White icon
        doc.setDrawColor(...WHITE);
        doc.setFillColor(...WHITE);
        doc.setLineWidth(0.55);

        // ==================================================
        // PERSON
        // ==================================================

        if (type === "person") {
          // Head
          doc.circle(x, y - 1.15, 0.9, "S");

          // Body
          doc.line(x - 1.65, y + 1.8, x - 1.1, y + 0.55);

          doc.line(x - 1.1, y + 0.55, x, y + 0.15);

          doc.line(x, y + 0.15, x + 1.1, y + 0.55);

          doc.line(x + 1.1, y + 0.55, x + 1.65, y + 1.8);
        }

        // ==================================================
        // FATHER
        // ==================================================
        else if (type === "father") {
          // Head
          doc.circle(x, y - 1.15, 0.85, "S");

          // Shoulders
          doc.line(x - 1.7, y + 1.8, x - 1.1, y + 0.6);

          doc.line(x - 1.1, y + 0.6, x, y + 0.15);

          doc.line(x, y + 0.15, x + 1.1, y + 0.6);

          doc.line(x + 1.1, y + 0.6, x + 1.7, y + 1.8);
        }

        // ==================================================
        // ROLL NO - ID CARD
        // ==================================================
        else if (type === "roll") {
          doc.roundedRect(x - 2.1, y - 1.8, 4.2, 3.6, 0.45, 0.45, "S");

          // Photo circle
          doc.circle(x - 0.85, y - 0.55, 0.55, "S");

          // Body
          doc.line(x - 1.4, y + 0.85, x - 0.3, y + 0.85);

          doc.line(x - 1.25, y + 0.55, x - 0.45, y + 0.55);

          // Text lines
          doc.line(x + 0.1, y - 0.65, x + 1.35, y - 0.65);

          doc.line(x + 0.1, y + 0.25, x + 1.35, y + 0.25);
        }

        // ==================================================
        // CLASS - GRADUATION CAP
        // ==================================================
        else if (type === "class") {
          // Diamond
          doc.line(x - 2.1, y - 0.6, x, y - 1.8);

          doc.line(x, y - 1.8, x + 2.1, y - 0.6);

          doc.line(x + 2.1, y - 0.6, x, y + 0.55);

          doc.line(x, y + 0.55, x - 2.1, y - 0.6);

          // Cap base
          doc.line(x - 1.15, y + 0.15, x + 1.15, y + 0.15);

          // Tassel
          doc.line(x + 1.65, y - 0.85, x + 1.65, y + 1.2);

          doc.circle(x + 1.65, y + 1.35, 0.25, "S");
        }

        // ==================================================
        // HALL TICKET
        // ==================================================
        else if (type === "ticket") {
          // Outer ticket
          doc.roundedRect(x - 2.1, y - 1.7, 4.2, 3.4, 0.45, 0.45, "S");

          // Separator
          doc.line(x - 0.65, y - 1.45, x - 0.65, y + 1.45);

          // Small circle
          doc.circle(x - 1.35, y, 0.4, "S");

          // Lines
          doc.line(x - 0.1, y - 0.8, x + 1.4, y - 0.8);

          doc.line(x - 0.1, y, x + 1.4, y);

          doc.line(x - 0.1, y + 0.8, x + 1.1, y + 0.8);
        }
      };

      // ======================================================
      // DETAIL FUNCTION
      // ======================================================

      const drawStudentDetail = (x, y, label, value, icon, valueX) => {
        drawIcon(x, y - 1.5, icon);

        doc.setFont("helvetica", "normal");

        doc.setFontSize(7);
        doc.setTextColor(...TEXT);

        doc.text(String(label), x + 7, y);

        doc.text(":", x + 32, y);

        doc.setFont("helvetica", "normal");

        doc.setFontSize(7);

        doc.text(String(value || "-"), valueX, y);
      };

      // ======================================================
      // LEFT INFORMATION
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
        infoTop + 26,
        "Roll No.",
        rollNo,
        "roll",
        leftInfoX + 39,
      );

      // ======================================================
      // RIGHT INFORMATION
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

      drawStudentDetail(
        rightInfoX,
        infoTop + 17,
        "Hall Ticket No.",
        hallTicketNo,
        "ticket",
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

      // Flatten lower corners
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
      // SUBJECT + DATE ONLY
      // ======================================================

      const tableTop = scheduleTop + scheduleHeaderHeight;

      const tableLeft = marginX + 4;

      const tableWidth = contentWidth - 8;

      const tableRowHeight = 8;

      const headerHeight = tableRowHeight;

      const schedule = Array.isArray(student.examSchedule)
        ? student.examSchedule
        : Array.isArray(student.examSchedules)
          ? student.examSchedules
          : Array.isArray(student.schedules)
            ? student.schedules
            : HARDCODED_EXAM_SCHEDULE;
      const numberOfRows = Math.max(1, Math.ceil(schedule.length / 2));

      const tableHeight = headerHeight + numberOfRows * tableRowHeight;

      // 4 columns
      const columnWidths = [48, 49, 48, 49];

      // ======================================================
      // TABLE BORDER
      // ======================================================

      doc.setDrawColor(...LIGHT_BORDER);

      doc.setLineWidth(0.35);

      doc.rect(tableLeft, tableTop, tableWidth, tableHeight);

      // ======================================================
      // TABLE HEADER
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
      // HEADERS
      // ======================================================

      const headers = ["SUBJECT", "DATE", "SUBJECT", "DATE"];

      let headerX = tableLeft;

      doc.setFont("helvetica", "bold");

      doc.setFontSize(6.2);
      doc.setTextColor(...TEXT);

      headers.forEach((header, index) => {
        const width = columnWidths[index];

        doc.text(header, headerX + width / 2, tableTop + 5.2, {
          align: "center",
        });

        headerX += width;
      });

      // ======================================================
      // SPLIT SCHEDULE
      // ======================================================

      const leftSchedule = schedule.filter((_, index) => index % 2 === 0);

      const rightSchedule = schedule.filter((_, index) => index % 2 === 1);

      // ======================================================
      // CELL FUNCTION
      // ======================================================

      const drawScheduleCell = (x, y, width, value) => {
        doc.setFont("helvetica", "normal");

        doc.setFontSize(6.3);
        doc.setTextColor(...TEXT);

        doc.text(String(value || "-"), x + width / 2, y, {
          align: "center",
        });
      };

      // ======================================================
      // TABLE ROWS
      // ======================================================

      for (let row = 0; row < numberOfRows; row++) {
        const y = tableTop + headerHeight + row * tableRowHeight + 5.2;

        const leftExam = leftSchedule[row];

        const rightExam = rightSchedule[row];

        let x = tableLeft;

        // Left Subject
        drawScheduleCell(
          x,
          y,
          columnWidths[0],
          leftExam?.subjectName || leftExam?.subject,
        );

        x += columnWidths[0];

        // Left Date
        drawScheduleCell(
          x,
          y,
          columnWidths[1],
          leftExam ? formatDate(leftExam.examDate || leftExam.date) : "-",
        );

        x += columnWidths[1];

        // Right Subject
        drawScheduleCell(
          x,
          y,
          columnWidths[2],
          rightExam?.subjectName || rightExam?.subject,
        );

        x += columnWidths[2];

        // Right Date
        drawScheduleCell(
          x,
          y,
          columnWidths[3],
          rightExam ? formatDate(rightExam.examDate || rightExam.date) : "-",
        );
      }

      // ======================================================
      // BOTTOM SECTION
      // ======================================================

      const bottomTop = tableTop + tableHeight + 4;

      // ======================================================
      // IMPORTANT INSTRUCTIONS
      // ======================================================

      const instructionWidth = 105;
      const instructionHeight = 29;

      const instructionX = marginX + 4;

      const instructionY = bottomTop;

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
      // CLIPBOARD ICON
      // ======================================================

      const clipboardX = instructionX + 7;

      const clipboardY = instructionY + 7;

      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.7);

      doc.roundedRect(clipboardX - 4, clipboardY - 5, 8, 11, 1, 1, "S");

      doc.line(clipboardX - 2, clipboardY - 7, clipboardX + 2, clipboardY - 7);

      doc.line(clipboardX - 2, clipboardY - 4, clipboardX + 2, clipboardY - 4);

      // ======================================================
      // INSTRUCTION TITLE
      // ======================================================

      doc.setFont("helvetica", "bold");

      doc.setFontSize(7);
      doc.setTextColor(...TEXT);

      doc.text("IMPORTANT INSTRUCTIONS", instructionX + 14, instructionY + 8);

      // ======================================================
      // INSTRUCTIONS
      // ======================================================

      const instructions = [
        "Bring the Hall Ticket to the examination hall.",
        "No electronic gadgets are allowed.",
        "Arrive atleast 30 minutes before the exam.",
        "No Re-Examination.",
      ];

      doc.setFont("helvetica", "normal");

      doc.setFontSize(5.5);

      instructions.forEach((instruction, index) => {
        const bulletY = instructionY + 14 + index * 4.4;

        doc.setFillColor(...TEXT);

        doc.circle(instructionX + 8, bulletY - 1.5, 0.65, "F");

        doc.text(instruction, instructionX + 11, bulletY);
      });

      // ======================================================
      // SIGNATURE AREA
      // ======================================================

      const signatureAreaX = instructionX + instructionWidth + 7;

      const signatureAreaWidth = contentWidth - 8 - instructionWidth - 7;

      const signatureTop = instructionY;

      // Left separator
      doc.setDrawColor(...LIGHT_BORDER);

      doc.setLineWidth(0.4);

      doc.line(
        signatureAreaX,
        signatureTop,
        signatureAreaX,
        signatureTop + instructionHeight,
      );

      // ======================================================
      // SIGNATURE COLUMNS
      // ======================================================

      const signatureColumnWidth = signatureAreaWidth / 2;

      const studentSignatureCenter = signatureAreaX + signatureColumnWidth / 2;

      const principalSignatureCenter =
        signatureAreaX + signatureColumnWidth + signatureColumnWidth / 2;

      // Center divider
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

      doc.setFontSize(6);
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

      doc.setFontSize(4.5);
      doc.setTextColor(130, 130, 130);

      doc.text(String(schoolName), pageWidth / 2, pageHeight - 7, {
        align: "center",
      });

      // ======================================================
      // SAVE PDF
      // ======================================================

      doc.save(getFileName(student));
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
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen w-full bg-gray-50 px-6 py-6 font-sans antialiased">
      <div className="mx-auto max-w-6xl">
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
            {/* Exam Type */}

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
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select</option>

                {examinationTypes.map((exam) => (
                  <option
                    key={exam.id || exam.examTypeId}
                    value={exam.id || exam.examTypeId}
                  >
                    {exam.examType || exam.examinationType}
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

                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select</option>

                {classes.map((classItem) => (
                  <option
                    key={classItem.id || classItem.classId}
                    value={classItem.id || classItem.classId}
                  >
                    {classItem.classCode || classItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}

            <div className="flex lg:justify-end">
              <button
                onClick={fetchList}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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

            {/* Search / Filter */}

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

                    <th className="py-2 font-medium">Hall Ticket No</th>

                    <th className="py-2 font-medium">Student</th>

                    <th className="py-2 font-medium">Admission No</th>

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
                        <td className="py-2.5">
                          <input
                            type="checkbox"
                            checked={checked.has(id)}
                            onChange={() => toggleRow(id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                          />
                        </td>

                        <td className="py-2.5">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>

                        <td className="py-2.5 font-medium text-gray-900">
                          {student.hallTicketNo || "-"}
                        </td>

                        <td className="py-2.5">
                          {student.studentName || student.name || "-"}
                        </td>

                        <td className="py-2.5">{student.admissionNo || "-"}</td>

                        <td className="py-2.5">{student.rollNo || "-"}</td>

                        <td className="py-2.5 text-gray-900">
                          {student.status || "-"}
                        </td>

                        <td className="py-2.5 text-gray-900">
                          {student.published || student.publishedTo || "-"}
                        </td>

                        <td className="py-2.5">
                          <StatusPill value={student.feeStatus} />
                        </td>

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
                              {/* DOWNLOAD */}

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

                              {/* DELETE */}

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

                  {/* EMPTY */}

                  {students.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
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
            examinationTypes.find(
              (exam) => String(exam.id || exam.examTypeId) === examId,
            )?.examType || ""
          }
          classLabel={
            classes.find(
              (classItem) =>
                String(classItem.id || classItem.classId) === classId,
            )?.classCode || ""
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
