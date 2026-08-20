import { jsPDF } from "jspdf";
import { getCalculatedExamSubjects, isAdditionalExamSubject } from "./examSubjectUtils";

const imageDataUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  const value = image.base64 || image.data;
  if (value) return value.startsWith("data:") ? value : `data:${image.contentType || "image/png"};base64,${value}`;
  return image.url || image.fileUrl || null;
};

const text = (value) => value === null || value === undefined || value === "" ? "-" : String(value);

const getAddressLines = (doc, value, width) => {
  const address = String(value || "").trim();
  if (!address) return [];

  return address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => doc.splitTextToSize(line, width));
};

const numeric = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const formattedNumber = (value) => {
  const number = numeric(value);
  return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
};
const percent = (value) => `${formattedNumber(value)}%`;

export const REPORT_CARD_TEMPLATES = [
  { id: "classic", label: "Classic Navy" },
  { id: "emerald", label: "Emerald Modern" },
  { id: "royal", label: "Royal Purple" },
  { id: "sunset", label: "Sunset Gold" },
  { id: "ocean", label: "Ocean Blue" },
  { id: "rose", label: "Rose Professional" },
];

const REPORT_CARD_THEMES = {
  classic: { layout: "classic", navy: [18, 52, 92], blue: [31, 62, 111], emerald: [35, 139, 105], gold: [218, 157, 25], line: [211, 220, 229], section: [247, 250, 252], paleBlue: [238, 245, 251], paleGreen: [233, 243, 251], paleGold: [255, 250, 232] },
  emerald: { layout: "full", navy: [17, 70, 61], blue: [21, 119, 101], emerald: [27, 153, 116], gold: [211, 161, 64], line: [207, 231, 224], section: [245, 251, 249], paleBlue: [232, 246, 241], paleGreen: [226, 247, 238], paleGold: [252, 248, 233] },
  royal: { layout: "split", navy: [49, 34, 102], blue: [91, 65, 190], emerald: [52, 163, 145], gold: [218, 171, 76], line: [224, 216, 247], section: [249, 247, 255], paleBlue: [240, 235, 255], paleGreen: [235, 249, 245], paleGold: [255, 249, 235] },
  sunset: { layout: "banner", navy: [101, 48, 28], blue: [192, 78, 43], emerald: [43, 145, 111], gold: [218, 133, 48], line: [241, 218, 201], section: [255, 249, 245], paleBlue: [255, 240, 230], paleGreen: [237, 249, 243], paleGold: [255, 244, 218] },
  ocean: { layout: "minimal", navy: [17, 61, 92], blue: [24, 121, 174], emerald: [33, 157, 166], gold: [219, 169, 68], line: [208, 228, 240], section: [244, 250, 253], paleBlue: [230, 244, 252], paleGreen: [231, 249, 247], paleGold: [255, 249, 233] },
  rose: { layout: "soft", navy: [91, 34, 57], blue: [174, 58, 98], emerald: [44, 147, 119], gold: [206, 145, 62], line: [239, 215, 225], section: [255, 248, 251], paleBlue: [252, 236, 244], paleGreen: [235, 249, 243], paleGold: [255, 247, 231] },
};

const addImageContain = (doc, source, x, y, width, height) => {
  if (!source) return;
  try {
    const properties = doc.getImageProperties(source);
    const scale = Math.min(width / properties.width, height / properties.height);
    const drawWidth = properties.width * scale;
    const drawHeight = properties.height * scale;
    doc.addImage(source, undefined, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  } catch {
    return;
  }
};

const field = (doc, label, value, x, y, width = 42) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(101, 112, 128);
  doc.text(label.toUpperCase(), x, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 35, 62);
  doc.text(doc.splitTextToSize(text(value), width), x, y + 5);
};

const roundedCard = (doc, x, y, width, height, fill = [248, 250, 253], stroke = [224, 230, 238]) => {
  doc.setFillColor(...fill);
  doc.setDrawColor(...stroke);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, width, height, 3, 3, "FD");
};

const drawPieChart = (doc, cx, cy, radius, obtained, total, colors) => {
  const ratio = total > 0 ? Math.max(0, Math.min(1, obtained / total)) : 0;
  const obtainedEnd = -Math.PI / 2 + Math.PI * 2 * ratio;
  const step = Math.PI / 45;
  const drawSector = (start, end, color) => {
    doc.setFillColor(...color);
    for (let angle = start; angle < end; angle += step) {
      const next = Math.min(angle + step, end);
      doc.triangle(cx, cy, cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), cx + radius * Math.cos(next), cy + radius * Math.sin(next), "F");
    }
  };
  if (ratio > 0) drawSector(-Math.PI / 2, obtainedEnd, colors.obtained);
  if (ratio < 1) drawSector(obtainedEnd, -Math.PI / 2 + Math.PI * 2, colors.remaining);
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, radius * 0.56, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...colors.navy);
  doc.text(percent(Number((ratio * 100).toFixed(2))), cx, cy + 2, { align: "center" });
};

const drawLegend = (doc, x, y, color, label, value) => {
  doc.setFillColor(...color);
  doc.circle(x + 1, y - 1, 1, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(75, 85, 99);
  doc.text(label, x + 4, y);
  doc.setFont("helvetica", "bold");
  doc.text(text(value), x + 29, y, { align: "right" });
};

const drawPerformanceBars = (doc, x, y, width, height, subjects, colors) => {
  const chartSubjects = subjects.slice(0, 8);
  const plotX = x + 10;
  const plotY = y + 4;
  const plotWidth = width - 14;
  const plotHeight = height - 11;
  [0, 25, 50, 75, 100].forEach((tick) => {
    const lineY = plotY + plotHeight - (tick / 100) * plotHeight;
    doc.setDrawColor(...colors.line);
    doc.setLineWidth(0.15);
    doc.line(plotX, lineY, plotX + plotWidth, lineY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(...colors.muted);
    doc.text(String(tick), plotX - 2, lineY + 1.2, { align: "right" });
  });
  const barSlot = chartSubjects.length ? plotWidth / chartSubjects.length : plotWidth;
  chartSubjects.forEach((subject, index) => {
    const obtained = numeric(subject.obtainedMarks);
    const total = numeric(subject.totalMarks) || 100;
    const value = Math.max(0, Math.min(100, numeric(subject.percentage) || (obtained / total) * 100));
    const barHeight = (value / 100) * plotHeight;
    const barWidth = Math.min(7, barSlot * 0.6);
    const barX = plotX + index * barSlot + (barSlot - barWidth) / 2;
    const barY = plotY + plotHeight - barHeight;
    doc.setFillColor(...(String(subject.status || "").toUpperCase() === "FAIL" ? colors.red : colors.emerald));
    doc.roundedRect(barX, barY, barWidth, Math.max(barHeight, 0.5), 0.5, 0.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.2);
    doc.setTextColor(...colors.navy);
    doc.text(percent(Math.round(value)), barX + barWidth / 2, Math.max(plotY + 2, barY - 1.2), { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(...colors.muted);
    doc.text(text(subject.subjectName).slice(0, 7), barX + barWidth / 2, plotY + plotHeight + 4, { align: "center" });
  });
};

const DEFAULT_ATTENDANCE = {
  month: "_",
  daysPresent: "_",
  daysAbsent: "_",
  total: "_",
};

const GRADING_SYSTEM = [
  ["A1", "91 - 100", "Outstanding", [72, 171, 92]],
  ["A2", "81 - 90", "Excellent", [75, 173, 82]],
  ["B1", "71 - 80", "Very Good", [49, 112, 179]],
  ["B2", "61 - 70", "Good", [75, 126, 172]],
  ["C1", "51 - 60", "Satisfactory", [238, 153, 23]],
  ["C2", "41 - 50", "Average", [239, 165, 35]],
  ["D", "33 - 40", "Below Average", [218, 87, 55]],
  ["E", "0 - 32", "Needs Improvement", [213, 75, 70]],
];

const getAttendance = (report) => {
  const attendance = report?.attendance || report?.attendanceSummary || {};
  const daysPresent = attendance.daysPresent ?? attendance.present ?? report?.daysPresent ?? DEFAULT_ATTENDANCE.daysPresent;
  const daysAbsent = attendance.daysAbsent ?? attendance.absent ?? report?.daysAbsent ?? DEFAULT_ATTENDANCE.daysAbsent;
  return {
    month: attendance.month || attendance.period || report?.attendanceMonth || DEFAULT_ATTENDANCE.month,
    daysPresent,
    daysAbsent,
    total: attendance.total ?? report?.attendanceTotal ?? (daysPresent === "_" && daysAbsent === "_" ? DEFAULT_ATTENDANCE.total : numeric(daysPresent) + numeric(daysAbsent)),
  };
};

const getOverallRemarks = (report) => {
  const subjects = Array.isArray(report) ? report : Array.isArray(report.subjects) ? report.subjects : [];
  const gradingRemarks = [
    [91, "Outstanding"],
    [81, "Excellent"],
    [71, "Very Good"],
    [61, "Good"],
    [51, "Satisfactory"],
    [41, "Average"],
    [33, "Below Average"],
    [0, "Needs Improvement"],
  ];
  const getSubjectPercentage = (subject) => {
    const subjectPercentage = numeric(subject.percentage);
    if (subjectPercentage) return subjectPercentage;
    const totalMarks = numeric(subject.totalMarks);
    return totalMarks ? (numeric(subject.obtainedMarks) / totalMarks) * 100 : 0;
  };
  const remarksByGrade = new Map();
  subjects.forEach((subject) => {
    const percentageValue = getSubjectPercentage(subject);
    const remark = gradingRemarks.find(([minimum]) => percentageValue >= minimum)[1];
    const subjectNames = remarksByGrade.get(remark) || [];
    subjectNames.push(text(subject.subjectName));
    remarksByGrade.set(remark, subjectNames);
  });
  const calculatedRemarks = Array.from(remarksByGrade, ([remark, subjectNames]) => `${remark} performance in ${subjectNames.join(", ")}`).join(". ");
  return subjects.length
    ? `${calculatedRemarks}.`
    : (Array.isArray(report) ? "" : report.overallRemarks || report.remarks || report.teacherRemarks) || "Consistent performance across subjects.";
};

const drawTwoColumnTable = (doc, x, y, width, title, rows, colors, note, options = {}) => {
  const {
    headerHeight = 9,
    columnHeaderHeight = 0,
    columnHeaders = null,
    rowHeight = 7,
    rowFontSize = 8,
    rowTextOffset = 4.7,
    noteFontSize = 7,
    noteLineHeight = 4,
    columnHeaderFill = colors.section,
    columnHeaderTextColor = colors.navy,
    titleFill = colors.navy,
  } = options;
  doc.setFontSize(noteFontSize);
  const noteLines = note ? doc.splitTextToSize(note, width - 10) : [];
  const noteHeight = noteLines.length ? noteLines.length * noteLineHeight + 8 : 0;
  const rowsY = y + headerHeight + (columnHeaders ? columnHeaderHeight : 0);
  const height = headerHeight + (columnHeaders ? columnHeaderHeight : 0) + rows.length * rowHeight + noteHeight;
  const columnWidth = width / 2;

  doc.setLineWidth(0.3);
  doc.setDrawColor(...titleFill);
  doc.setFillColor(...titleFill);
  doc.roundedRect(x, y, width, headerHeight, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(title, x + width / 2, y + headerHeight / 2 + 2, { align: "center" });

  if (columnHeaders) {
    doc.setFillColor(...columnHeaderFill);
    doc.rect(x, y + headerHeight, width, columnHeaderHeight, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(rowFontSize);
    doc.setTextColor(...columnHeaderTextColor);
    doc.text(text(columnHeaders[0]), x + columnWidth / 2, y + headerHeight + columnHeaderHeight / 2 + 1.5, { align: "center" });
    doc.text(text(columnHeaders[1]), x + columnWidth + columnWidth / 2, y + headerHeight + columnHeaderHeight / 2 + 1.5, { align: "center" });
    doc.line(x + columnWidth, y + headerHeight, x + columnWidth, y + headerHeight + columnHeaderHeight);
  }

  rows.forEach(([label, value], index) => {
    const rowY = rowsY + index * rowHeight;
    doc.setFillColor(...(index % 2 ? [255, 255, 255] : colors.section));
    doc.rect(x, rowY, width, rowHeight, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(rowFontSize);
    doc.setTextColor(...colors.navy);
    doc.text(text(label), x + columnWidth / 2, rowY + rowTextOffset, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(value === "_" ? "" : text(value), x + columnWidth + columnWidth / 2, rowY + rowTextOffset, { align: "center" });
    doc.line(x + columnWidth, rowY, x + columnWidth, rowY + rowHeight);
  });

  if (noteLines.length) {
    const noteY = rowsY + rows.length * rowHeight;
    doc.setFillColor(255, 255, 255);
    doc.rect(x, noteY, width, noteHeight, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(noteFontSize);
    doc.setTextColor(...colors.navy);
    doc.text(noteLines, x + width / 2, noteY + 6, { align: "center", lineHeightFactor: 1.25 });
  }

  return height;
};

const drawGradingTable = (doc, x, y, width, colors) => {
  const titleHeight = 8;
  const columnHeaderHeight = 7;
  const rowHeight = 6;
  const columns = [width * 0.24, width * 0.35, width * 0.41];
  const tableHeight = titleHeight + columnHeaderHeight + GRADING_SYSTEM.length * rowHeight;

  roundedCard(doc, x, y, width, tableHeight, [255, 255, 255], colors.line);
  doc.setFillColor(...colors.gold);
  doc.setDrawColor(...colors.gold);
  doc.roundedRect(x, y, width, titleHeight, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("GRADING SYSTEM", x + width / 2, y + 4.8, { align: "center" });

  doc.setFillColor(...colors.blue);
  doc.rect(x, y + titleHeight, width, columnHeaderHeight, "FD");
  doc.setFontSize(6);
  doc.text("Grade", x + columns[0] / 2, y + titleHeight + 4, { align: "center" });
  doc.text("Marks Range", x + columns[0] + columns[1] / 2, y + titleHeight + 4, { align: "center" });
  doc.text("Performance", x + columns[0] + columns[1] + columns[2] / 2, y + titleHeight + 4, { align: "center" });

  GRADING_SYSTEM.forEach(([grade, range, performance, badgeColor], index) => {
    const rowY = y + titleHeight + columnHeaderHeight + index * rowHeight;
    doc.setFillColor(...(index % 2 ? [255, 255, 255] : colors.section));
    doc.setDrawColor(...colors.line);
    doc.rect(x, rowY, width, rowHeight, "FD");
    doc.setFillColor(...badgeColor);
    doc.roundedRect(x + columns[0] / 2 - 4.5, rowY + 1, 9, 3.5, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(grade, x + columns[0] / 2, rowY + 3.5, { align: "center" });
    doc.setTextColor(...colors.ink);
    doc.setFont("helvetica", "normal");
    doc.text(range, x + columns[0] + columns[1] / 2, rowY + 3.5, { align: "center" });
    doc.text(performance, x + columns[0] + columns[1] + columns[2] / 2, rowY + 3.5, { align: "center" });
    doc.line(x + columns[0], rowY, x + columns[0], rowY + rowHeight);
    doc.line(x + columns[0] + columns[1], rowY, x + columns[0] + columns[1], rowY + rowHeight);
  });

  doc.setDrawColor(...colors.line);
  doc.line(x + columns[0], y + titleHeight, x + columns[0], y + tableHeight);
  doc.line(x + columns[0] + columns[1], y + titleHeight, x + columns[0] + columns[1], y + tableHeight);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.5);
  doc.setTextColor(...colors.navy);
  doc.text("Note. - * Subjects are additional (Skill Subjects) & are not added in total.", x + width / 2, y + tableHeight + 5, { align: "center" });
  return tableHeight + 8;
};

const renderStudentReportCard = (doc, report, template = "classic") => {
  const pageWidth = doc.internal.pageSize.getWidth();

  const margin = 13;
  const width = pageWidth - margin * 2;
  const colors = {
    ...(REPORT_CARD_THEMES[template] || REPORT_CARD_THEMES.classic),
    ink: [42, 52, 68],
    muted: [101, 112, 128],
    red: [185, 67, 67],
  };
  const subjects = Array.isArray(report.subjects) ? report.subjects : [];
  const calculatedSubjects = getCalculatedExamSubjects(subjects);
  const totalObtainedMarks = calculatedSubjects.reduce((sum, subject) => sum + numeric(subject.obtainedMarks), 0);
  const totalMarks = calculatedSubjects.reduce((sum, subject) => sum + numeric(subject.totalMarks), 0);
  const totalPercentage = totalMarks ? (totalObtainedMarks / totalMarks) * 100 : 0;
  const calculatedResult = calculatedSubjects.length
    ? calculatedSubjects.every((subject) => String(subject.status || "").toUpperCase() === "PASS") ? "PASS" : "FAIL"
    : "N/A";
  const calculatedOverallGrade = calculatedSubjects.length
    ? totalPercentage >= 91 ? "A1" : totalPercentage >= 81 ? "A2" : totalPercentage >= 71 ? "B1" : totalPercentage >= 61 ? "B2" : totalPercentage >= 51 ? "C1" : totalPercentage >= 41 ? "C2" : totalPercentage >= 33 ? "D" : "E"
    : "N/A";
  const logo = imageDataUrl(report.schoolLogo);
  const schoolAddress = report.schoolAddress || report.address || report.school?.address || report.schoolDetails?.address;
  const studentPhoto = imageDataUrl(report.studentPhoto);
  const principalSignature = imageDataUrl(report.principalSignature);
  const highest = calculatedSubjects.length ? Math.max(...calculatedSubjects.map((item) => numeric(item.obtainedMarks))) : 0;
  const lowest = calculatedSubjects.length ? Math.min(...calculatedSubjects.map((item) => numeric(item.obtainedMarks))) : 0;
  const average = calculatedSubjects.length ? totalObtainedMarks / calculatedSubjects.length : 0;
  const passSubjects = calculatedSubjects.filter((item) => String(item.status || "").toUpperCase() === "PASS").length;
  const failSubjects = calculatedSubjects.filter((item) => String(item.status || "").toUpperCase() === "FAIL").length;
  let y = 10;

  const templateHeaderLayout = colors.layout;
  const headerLayout = "classic";
  const isDarkHeader = templateHeaderLayout === "full" || templateHeaderLayout === "banner";
  const headerFill = isDarkHeader
    ? colors.navy
    : templateHeaderLayout === "split"
      ? colors.paleBlue
      : templateHeaderLayout === "soft"
        ? colors.paleGold
        : [255, 255, 255];
  const headerTextColor = isDarkHeader ? [255, 255, 255] : colors.navy;
  const headerMutedColor = isDarkHeader ? [245, 248, 252] : colors.muted;
  let renderedHeaderHeight = 29;
  if (headerLayout === "classic") {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const addressLines = getAddressLines(doc, schoolAddress, width - 18);
    const addressStartY = y + 17;
    const addressLineHeight = 7.2;
    const addressHeight = Math.max(0, Math.min(addressLines.length, 3) - 1) * addressLineHeight;
    const dividerY = addressLines.length ? addressStartY + addressHeight + 3 : y + 20;
    const reportTitleY = dividerY + 4;
    const academicYearY = reportTitleY + 5;
    const bottomLineY = academicYearY + 3;
    renderedHeaderHeight = Math.max(36, bottomLineY - y + 1);

    roundedCard(doc, margin, y, width, renderedHeaderHeight, headerFill, isDarkHeader ? colors.navy : colors.line);
    addImageContain(doc, logo, margin + 6, y + 3, 27, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...headerTextColor);
    doc.text(text(report.schoolName || "EDUPORTAL ACADEMY"), pageWidth / 2, y + 10, { align: "center" });
    if (addressLines.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...headerMutedColor);
      doc.text(addressLines.slice(0, 3), pageWidth / 2, addressStartY, {
        align: "center",
        lineHeightFactor: addressLineHeight / 7,
      });
    }
    doc.setDrawColor(...(isDarkHeader ? [220, 230, 240] : colors.line));
    doc.setLineWidth(0.25);
    doc.line(margin + 34, dividerY, pageWidth - margin - 5, dividerY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...headerTextColor);
    doc.text("REPORT CARD", pageWidth / 2, reportTitleY, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...headerMutedColor);
    doc.text(
      `ACADEMIC YEAR : ${text(report.academicYear)}   ·   ${text(report.examType || report.examinationType).toUpperCase()}`,
      pageWidth / 2,
      academicYearY,
      { align: "center" },
    );
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(0.8);
    doc.line(margin + 2, bottomLineY, pageWidth - margin - 2, bottomLineY);
  } else if (headerLayout === "full" || headerLayout === "banner") {
    doc.setFillColor(...colors.navy);
    doc.setDrawColor(...colors.navy);
    doc.roundedRect(margin, y, width, 31, 4, 4, "F");
    addImageContain(doc, logo, margin + 8, y + 4, 28, 22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(headerLayout === "banner" ? 20 : 17);
    doc.setTextColor(255, 255, 255);
    doc.text(text(report.schoolName || "EDUPORTAL ACADEMY"), margin + 42, y + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(doc.splitTextToSize(String(schoolAddress || ""), 105)[0], margin + 42, y + 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...colors.gold);
    doc.text("REPORT CARD  ·  ACADEMIC RECORD", margin + 42, y + 24);
  } else if (headerLayout === "split") {
    roundedCard(doc, margin, y, width, 31, colors.paleBlue, colors.line);
    doc.setFillColor(...colors.navy);
    doc.roundedRect(margin, y, 62, 31, 4, 4, "F");
    addImageContain(doc, logo, margin + 17, y + 5, 28, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...colors.navy);
    doc.text(text(report.schoolName || "EDUPORTAL ACADEMY"), margin + 70, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...colors.muted);
    doc.text(doc.splitTextToSize(String(schoolAddress || ""), 100)[0], margin + 70, y + 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...colors.blue);
    doc.text("ACADEMIC RECORD", margin + 70, y + 24);
  } else if (headerLayout === "minimal") {
    roundedCard(doc, margin, y, width, 31, [255, 255, 255], colors.line);
    addImageContain(doc, logo, margin + 8, y + 5, 24, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...colors.navy);
    doc.text(text(report.schoolName || "EDUPORTAL ACADEMY"), margin + 38, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...colors.muted);
    doc.text(doc.splitTextToSize(String(schoolAddress || ""), 105)[0], margin + 38, y + 17);
    doc.setDrawColor(...colors.blue);
    doc.setLineWidth(1.2);
    doc.line(margin + 38, y + 22, pageWidth - margin - 8, y + 22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("REPORT CARD", margin + 38, y + 27);
  } else {
    roundedCard(doc, margin, y, width, 31, colors.paleGold, colors.line);
    addImageContain(doc, logo, pageWidth / 2 - 13, y + 3, 26, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...colors.navy);
    doc.text(text(report.schoolName || "EDUPORTAL ACADEMY"), pageWidth / 2, y + 25, { align: "center" });
  }
  y += renderedHeaderHeight + 2;

  if (headerLayout !== "classic") {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.navy);
    doc.text("REPORT CARD", pageWidth / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      `ACADEMIC YEAR  ${text(report.academicYear)}   ·   ${text(report.examType || report.examinationType).toUpperCase()}`,
      pageWidth / 2,
      y + 6,
      { align: "center" },
    );
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 11, pageWidth - margin, y + 11);
    y += 14;
  }

  roundedCard(doc, margin, y, width, 38, colors.section);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...colors.navy);
  doc.text("STUDENT INFORMATION", pageWidth / 2, y + 8, { align: "center" });
  doc.setDrawColor(...colors.line);
  doc.line(margin + 6, y + 11, pageWidth - margin - 6, y + 11);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin + 82, y + 13, margin + 82, y + 34);
  doc.line(margin + 132, y + 13, margin + 132, y + 34);
  doc.setLineDashPattern([], 0);
  addImageContain(doc, studentPhoto, margin + 6, y + 13, 20, 22);
  const x1 = margin + 38;
  const x2 = margin + 88;
  const x3 = margin + 139;
  field(doc, "Student Name", report.studentName, x1, y + 17, 43);
  field(doc, "Father Name", report.fatherName || report.father, x2, y + 17, 43);
  field(doc, "Class / Section", report.className, x3, y + 17, 35);
  field(doc, "Roll Number", report.rollNo || report.rollNumber, x1, y + 25, 43);
  y += 42;

  const attendance = getAttendance(report);
  const tableGap = 3;
  const performanceWidth = 120;
  const gradingX = margin + performanceWidth + tableGap;
  const gradingWidth = width - performanceWidth - tableGap;
  const tableY = y;
  const subjectTitleHeight = 8;
  const subjectColumnHeaderHeight = 7;
  const subjectRowHeight = Math.max(5.8, Math.min(9.6, 48 / Math.max(subjects.length + 1, 1)));
  const subjectColumns = [23, 17, 17, 13, 13, 15, 22];
  const subjectHeaders = ["Subject", "Obtained", "Maximum", "%", "Grade", "Status", "Remarks"];

  roundedCard(doc, margin, tableY, performanceWidth, subjectTitleHeight, colors.navy, colors.navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("SUBJECT-WISE PERFORMANCE", margin + performanceWidth / 2, tableY + 4.8, { align: "center" });
  doc.setFillColor(...colors.blue);
  doc.setDrawColor(...colors.line);
  doc.rect(margin, tableY + subjectTitleHeight, performanceWidth, subjectColumnHeaderHeight, "FD");
  let x = margin;
  doc.setFontSize(6.2);
  subjectHeaders.forEach((header, index) => {
    doc.text(header, x + subjectColumns[index] / 2, tableY + subjectTitleHeight + 4, { align: "center" });
    x += subjectColumns[index];
    if (index < subjectHeaders.length - 1) {
      doc.line(x, tableY + subjectTitleHeight, x, tableY + subjectTitleHeight + subjectColumnHeaderHeight);
    }
  });

  let subjectY = tableY + subjectTitleHeight + subjectColumnHeaderHeight;
  subjects.forEach((subject, index) => {
    doc.setFillColor(...(index % 2 ? [255, 255, 255] : colors.paleBlue));
    doc.setDrawColor(...colors.line);
    doc.rect(margin, subjectY, performanceWidth, subjectRowHeight, "FD");
    x = margin;
    const additionalSubject = isAdditionalExamSubject(subject);
    const values = [subject.subjectName, subject.obtainedMarks, subject.totalMarks, additionalSubject ? "N/A" : percent(subject.percentage), additionalSubject ? "N/A" : subject.grade, additionalSubject ? "N/A" : subject.status, subject.remarks];
    values.forEach((value, valueIndex) => {
      doc.setFont("helvetica", valueIndex === 0 ? "bold" : "normal");
      doc.setFontSize(6.2);
      doc.setTextColor(...(valueIndex === 5 ? (String(value).toUpperCase() === "FAIL" ? colors.red : colors.emerald) : colors.ink));
      const content = doc.splitTextToSize(text(value), subjectColumns[valueIndex] - 2.5);
      doc.text(content[0], x + subjectColumns[valueIndex] / 2, subjectY + subjectRowHeight / 2 + 1.8, { align: "center" });
      x += subjectColumns[valueIndex];
      if (valueIndex < values.length - 1) {
        doc.line(x, subjectY, x, subjectY + subjectRowHeight);
      }
    });
    subjectY += subjectRowHeight;
  });

  doc.setFillColor(...colors.paleGreen);
  doc.setDrawColor(...colors.line);
  doc.rect(margin, subjectY, performanceWidth, subjectRowHeight, "FD");
  x = margin;
  const totalValues = ["TOTAL", calculatedSubjects.length ? totalObtainedMarks : "N/A", calculatedSubjects.length ? totalMarks : "N/A", calculatedSubjects.length ? percent(totalPercentage) : "N/A", calculatedOverallGrade, calculatedResult, "Final outcome"];
  totalValues.forEach((value, index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(...colors.navy);
    doc.text(text(value), x + (index === 0 ? subjectColumns[index] / 2 : subjectColumns[index] / 2), subjectY + subjectRowHeight / 2 + 1.8, { align: "center" });
    x += subjectColumns[index];
    if (index < totalValues.length - 1) {
      doc.line(x, subjectY, x, subjectY + subjectRowHeight);
    }
  });

  const gradingHeight = drawGradingTable(doc, gradingX, tableY, gradingWidth, colors);
  const subjectHeight = subjectTitleHeight + subjectColumnHeaderHeight + (subjects.length + 1) * subjectRowHeight;
  const tablesHeight = Math.max(gradingHeight, subjectHeight);
  y = tableY + tablesHeight + 4;

  const snapshotHeaderHeight = 8;
  const snapshotHeight = 36;
  const pieWidth = 64;
  const snapshotCardHeight = snapshotHeaderHeight + snapshotHeight;
  const snapshotContentY = y + snapshotHeaderHeight;
  roundedCard(doc, margin, y, pieWidth, snapshotCardHeight, colors.section);
  doc.setFillColor(...colors.navy);
  doc.roundedRect(margin, y, pieWidth, snapshotHeaderHeight, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PERFORMANCE SNAPSHOT", margin + pieWidth / 2, y + 4.8, { align: "center" });
  drawPieChart(doc, margin + 16, snapshotContentY + snapshotHeight / 2, 10, totalObtainedMarks, totalMarks, { obtained: calculatedResult === "FAIL" ? colors.red : colors.emerald, remaining: [220, 226, 235], navy: colors.navy });
  drawLegend(doc, margin + 34, snapshotContentY + 15, calculatedResult === "FAIL" ? colors.red : colors.emerald, "Obtained", calculatedSubjects.length ? totalObtainedMarks : "N/A");
  drawLegend(doc, margin + 34, snapshotContentY + 23, [220, 226, 235], "Remaining", calculatedSubjects.length ? Math.max(0, totalMarks - totalObtainedMarks) : "N/A");
  doc.setFontSize(6);
  doc.setTextColor(...colors.navy);
  doc.text("MARKS PERCENTAGE", margin + 4, snapshotContentY + snapshotHeight - 5);

  const graphX = margin + pieWidth + 5;
  const graphWidth = width - pieWidth - 5;
  roundedCard(doc, graphX, y, graphWidth, snapshotCardHeight, [255, 255, 255]);
  doc.setFillColor(...colors.navy);
  doc.roundedRect(graphX, y, graphWidth, snapshotHeaderHeight, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("SUBJECT PERFORMANCE", graphX + graphWidth / 2, y + 4.8, { align: "center" });
  drawPerformanceBars(doc, graphX + 2, snapshotContentY + 1, graphWidth - 4, snapshotHeight - 3, calculatedSubjects, colors);
  y += snapshotCardHeight + 5;

  const analysisHeaderHeight = 8;
  const analysisWidth = 120;
  const remarksX = margin + 125;
  const remarksWidth = width - 125;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  const overallRemarks = doc.splitTextToSize(
    getOverallRemarks({ ...report, subjects: calculatedSubjects }),
    remarksWidth - 8,
  );
  const remarksLineHeight = 3.4;
  const analysisHeight = Math.max(
    17,
    overallRemarks.length * remarksLineHeight + 8,
  );
  const analysisCardHeight = analysisHeaderHeight + analysisHeight;
  roundedCard(doc, margin, y, analysisWidth, analysisCardHeight, colors.paleBlue);
  doc.setFillColor(...colors.navy);
  doc.roundedRect(margin, y, analysisWidth, analysisHeaderHeight, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PERFORMANCE ANALYSIS", margin + analysisWidth / 2, y + 4.8, { align: "center" });
  const analysisMetrics = [["Overall %", calculatedSubjects.length ? percent(totalPercentage) : "N/A"], ["Subjects", subjects.length], ["Pass", passSubjects], ["Fail", failSubjects], ["Highest", calculatedSubjects.length ? highest : "N/A"], ["Lowest", calculatedSubjects.length ? lowest : "N/A"], ["Average", calculatedSubjects.length ? average.toFixed(1) : "N/A"]];
  analysisMetrics.forEach(([label, value], index) => {
    const cellWidth = analysisWidth / analysisMetrics.length;
    const metricX = margin + index * cellWidth + 2;
    doc.setFont("helvetica", "bold");
      doc.setFontSize(5.2);
    doc.setTextColor(...colors.muted);
    doc.text(label, metricX, y + analysisHeaderHeight + 6);
    doc.setFontSize(8);
    doc.setTextColor(...colors.navy);
    doc.text(text(value), metricX, y + analysisHeaderHeight + 12);
  });

  roundedCard(doc, remarksX, y, remarksWidth, analysisCardHeight, colors.paleGold);
  doc.setFillColor(...colors.navy);
  doc.roundedRect(remarksX, y, remarksWidth, analysisHeaderHeight, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("OVERALL REMARKS", remarksX + remarksWidth / 2, y + 4.8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...colors.ink);
  doc.text(overallRemarks, remarksX + 4, y + analysisHeaderHeight + 6, {
    lineHeightFactor: 1.2,
  });
  y += analysisCardHeight + 5;

  const attendanceWidth = width / 2;
  const attendanceY = y - 3;
  const attendanceHeight = drawTwoColumnTable(
    doc,
    margin,
    attendanceY,
    attendanceWidth,
    "ATTENDANCE",
    [
      ["Days Present", text(attendance.daysPresent)],
      ["Days Absent", text(attendance.daysAbsent)],
      ["Total", text(attendance.total)],
    ],
    colors,
    null,
    {
      headerHeight: 5,
      columnHeaderHeight: 4,
      columnHeaders: ["Particulars", attendance.month],
      rowHeight: 4,
      rowFontSize: 5,
      rowTextOffset: 2.8,
      columnHeaderFill: [255, 255, 255],
      columnHeaderTextColor: colors.navy,
    },
  );

  const signatureX = margin + attendanceWidth + 12;
  const signatureWidth = width - attendanceWidth - 12;
  const signatureY = y + 1;
  doc.setDrawColor(...colors.line);
  doc.line(signatureX, signatureY + 17, signatureX + signatureWidth, signatureY + 17);
  addImageContain(doc, principalSignature, signatureX, signatureY + 1, signatureWidth, 15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...colors.navy);
  doc.text("PRINCIPAL", signatureX + signatureWidth / 2, signatureY + 22, { align: "center" });
  y += Math.max(attendanceHeight, 23);


};

export const generateStudentReportCardPdf = (report, template = "classic") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  renderStudentReportCard(doc, report, template);
  const filename = `ReportCard_${text(report.rollNo || report.rollNumber || report.studentName).replaceAll(" ", "_")}_${text(report.examType || report.examinationType).replaceAll(" ", "_")}.pdf`;
  doc.save(filename);
};

export const generateStudentReportCardsPdf = (reports, template = "classic") => {
  if (!reports.length) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  reports.forEach((report, index) => {
    if (index > 0) doc.addPage();
    renderStudentReportCard(doc, report, template);
  });

  const pdfUrl = URL.createObjectURL(doc.output("blob"));
  const printFrame = document.createElement("iframe");
  printFrame.style.position = "fixed";
  printFrame.style.left = "-10000px";
  printFrame.style.top = "0";
  printFrame.style.width = "100%";
  printFrame.style.height = "100%";
  printFrame.style.border = "0";
  printFrame.src = pdfUrl;
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    URL.revokeObjectURL(pdfUrl);
    printFrame.remove();
  };
  printFrame.onload = () => {
    window.setTimeout(() => {
      const printWindow = printFrame.contentWindow;
      if (!printWindow) {
        cleanup();
        return;
      }
      printWindow.addEventListener("afterprint", cleanup, { once: true });
      printWindow.focus();
      printWindow.print();
      window.setTimeout(cleanup, 60000);
    }, 1000);
  };
  document.body.appendChild(printFrame);
};
