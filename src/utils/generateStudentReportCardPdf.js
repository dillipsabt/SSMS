import { jsPDF } from "jspdf";

const imageDataUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  const value = image.base64 || image.data;
  if (value) return value.startsWith("data:") ? value : `data:${image.contentType || "image/png"};base64,${value}`;
  return image.url || image.fileUrl || null;
};

const text = (value) => value === null || value === undefined || value === "" ? "-" : String(value);
const numeric = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const formattedNumber = (value) => {
  const number = numeric(value);
  return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
};
const percent = (value) => `${formattedNumber(value)}%`;
const getTeacherRemarks = (report) => {
  const directValues = [
    report.teacherRemarks,
    report.teacherRemark,
    report.teacher_remarks,
    report.classTeacherRemarks,
    report.classTeacherRemark,
    report.classTeacherComment,
    report.teacherComment,
    report.remarksText,
    report.remarkText,
    report.remarks,
    report.remark,
    report.comment,
    report.comments,
  ];
  const nestedValues = [report.teacher, report.classTeacher, report.teacherDetails, report.data]
    .filter(Boolean)
    .flatMap((value) => [value.teacherRemarks, value.teacherRemark, value.remarks, value.remark, value.comment, value.comments]);
  const directRemarks = [...directValues, ...nestedValues].find((value) => typeof value === "string" && value.trim());
  const subjectRemarks = (Array.isArray(report.subjects) ? report.subjects : [])
    .filter((subject) => typeof subject.remarks === "string" && subject.remarks.trim())
    .map((subject) => `${text(subject.subjectName)}: ${subject.remarks.trim()}`)
    .join("  |  ");
  return [directRemarks, subjectRemarks].filter(Boolean).join("  |  ") || "No remarks available.";
};

const addImageContain = (doc, source, x, y, width, height) => {
  if (!source) return;
  try {
    const properties = doc.getImageProperties(source);
    const scale = Math.min(width / properties.width, height / properties.height);
    const drawWidth = properties.width * scale;
    const drawHeight = properties.height * scale;
    doc.addImage(source, undefined, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  } catch {}
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

const drawPie = (doc, cx, cy, radius, obtained, total, colors) => {
  const ratio = total > 0 ? Math.max(0, Math.min(1, obtained / total)) : 0;
  const obtainedEnd = -Math.PI / 2 + Math.PI * 2 * ratio;
  const step = Math.PI / 45;
  const sector = (start, end, color) => {
    doc.setFillColor(...color);
    for (let angle = start; angle < end; angle += step) {
      const next = Math.min(angle + step, end);
      doc.triangle(
        cx,
        cy,
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle),
        cx + radius * Math.cos(next),
        cy + radius * Math.sin(next),
        "F"
      );
    }
  };
  if (ratio > 0) sector(-Math.PI / 2, obtainedEnd, colors.obtained);
  if (ratio < 1) sector(obtainedEnd, -Math.PI / 2 + Math.PI * 2, colors.remaining);
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, radius * 0.56, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.navy);
  doc.text(percent(Math.round(ratio * 100)), cx, cy + 2, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(101, 112, 128);
  doc.text("OVERALL", cx, cy + 7, { align: "center" });
};

const drawLegend = (doc, x, y, color, label, value) => {
  doc.setFillColor(...color);
  doc.circle(x + 1.5, y - 1.5, 1.5, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text(label, x + 5, y);
  doc.setFont("helvetica", "bold");
  doc.text(text(value), x + 30, y);
};

const renderStudentReportCard = (doc, report) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 13;
  const width = pageWidth - margin * 2;
  const colors = {
    navy: [20, 35, 62],
    blue: [39, 92, 166],
    emerald: [35, 139, 105],
    gold: [190, 143, 55],
    ink: [42, 52, 68],
    muted: [101, 112, 128],
    line: [224, 230, 238],
    section: [247, 249, 252],
    paleBlue: [238, 244, 252],
    paleGreen: [237, 248, 243],
    paleGold: [251, 247, 237],
    red: [185, 67, 67],
  };
  const subjects = Array.isArray(report.subjects) ? report.subjects : [];
  const logo = imageDataUrl(report.schoolLogo);
  const studentPhoto = imageDataUrl(report.studentPhoto);
  const principalSignature = imageDataUrl(report.principalSignature);
  const result = String(report.result || "").toUpperCase();
  const resultColor = result === "FAIL" ? colors.red : colors.emerald;
  const highest = subjects.length ? Math.max(...subjects.map((item) => numeric(item.obtainedMarks))) : 0;
  const lowest = subjects.length ? Math.min(...subjects.map((item) => numeric(item.obtainedMarks))) : 0;
  const average = subjects.length ? subjects.reduce((sum, item) => sum + numeric(item.obtainedMarks), 0) / subjects.length : 0;
  const passSubjects = subjects.filter((item) => String(item.status || "").toUpperCase() === "PASS").length;
  const failSubjects = subjects.filter((item) => String(item.status || "").toUpperCase() === "FAIL").length;
  let y = 10;

  doc.setFillColor(...colors.navy);
  doc.roundedRect(margin, y, width, 2.5, 1.2, 1.2, "F");
  y += 7;
  roundedCard(doc, margin, y, width, 24, [255, 255, 255]);
  addImageContain(doc, logo, pageWidth / 2 - 44, y + 5, 22, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...colors.navy);
  doc.text(text(report.schoolName || "EDUPORTAL ACADEMY"), pageWidth / 2 - 15, y + 12, { align: "left" });
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.gold);
  doc.text("EDUPORTAL · ACADEMIC RECORD", pageWidth / 2 - 15, y + 17, { align: "left" });
  y += 32;

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
  y += 20;

  roundedCard(doc, margin, y, width, 32, colors.section);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...colors.blue);
  doc.text("STUDENT INFORMATION", pageWidth / 2, y + 8, { align: "center" });
  doc.setDrawColor(...colors.line);
  doc.line(margin + 6, y + 11, pageWidth - margin - 6, y + 11);
  addImageContain(doc, studentPhoto, margin + 6, y + 13, 25, 16);
  const x1 = margin + 38;
  const x2 = margin + 88;
  const x3 = margin + 139;
  field(doc, "Student Name", report.studentName, x1, y + 17, 43);
  field(doc, "Father Name", report.fatherName || report.father, x2, y + 17, 43);
  field(doc, "Class / Section", report.className, x3, y + 17, 35);
  field(doc, "Roll Number", report.rollNo || report.rollNumber, x1, y + 25, 43);
  field(doc, "Admission Number", report.admissionNumber || report.admissionNo, x2, y + 25, 43);
  y += 38;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.navy);
  doc.text("ACADEMIC PERFORMANCE", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...colors.muted);
  doc.text("Subject-wise assessment and outcome", pageWidth - margin, y, { align: "right" });
  y += 4;
  const columns = [35, 22, 22, 21, 18, 19, 48];
  const headers = ["Subject", "Obtained", "Maximum", "%", "Grade", "Status", "Remarks"];
  roundedCard(doc, margin, y, width, 8, colors.navy, colors.navy);
  let x = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  headers.forEach((header, index) => { doc.text(header, x + (columns[index] / 2), y + 5.5, { align: "center" }); x += columns[index]; });
  y += 8;
  subjects.forEach((subject, index) => {
    const rowHeight = 6;
    doc.setFillColor(...(index % 2 ? [255, 255, 255] : colors.paleBlue));
    doc.setDrawColor(...colors.line);
    doc.rect(margin, y, width, rowHeight, "FD");
    x = margin;
    const values = [subject.subjectName, subject.obtainedMarks, subject.totalMarks, percent(subject.percentage), subject.grade, subject.status, subject.remarks];
    values.forEach((value, valueIndex) => {
      doc.setFont("helvetica", valueIndex === 0 ? "bold" : "normal");
      doc.setFontSize(7);
      doc.setTextColor(...(valueIndex === 5 ? (String(value).toUpperCase() === "FAIL" ? colors.red : colors.emerald) : colors.ink));
      const content = doc.splitTextToSize(text(value), columns[valueIndex] - 3);
      doc.text(content[0], x + (valueIndex === 0 ? 3 : columns[valueIndex] / 2), y + 4.2, { align: valueIndex === 0 ? "left" : "center" });
      x += columns[valueIndex];
    });
    y += rowHeight;
  });
  roundedCard(doc, margin, y, width, 8, colors.paleGreen);
  x = margin;
  const totalValues = ["TOTAL", report.totalObtainedMarks, report.totalMarks, percent(report.percentage), report.overallGrade, report.result, "Final outcome"];
  totalValues.forEach((value, index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...colors.navy);
    doc.text(text(value), x + (index === 0 ? 3 : columns[index] / 2), y + 5.5, { align: index === 0 ? "left" : "center" });
    x += columns[index];
  });
  y += 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.navy);
  doc.text("PERFORMANCE SNAPSHOT", margin, y);
  y += 5;
  const chartWidth = 62;
  const chartHeight = 30;
  roundedCard(doc, margin, y, chartWidth, chartHeight, colors.section);
  drawPie(doc, margin + 24, y + 15, 10, numeric(report.totalObtainedMarks), numeric(report.totalMarks), { obtained: result === "FAIL" ? colors.red : colors.emerald, remaining: [220, 226, 235], navy: colors.navy });
  drawLegend(doc, margin + 42, y + 11, result === "FAIL" ? colors.red : colors.emerald, "Obtained", report.totalObtainedMarks);
  drawLegend(doc, margin + 42, y + 20, [220, 226, 235], "Remaining", Math.max(0, numeric(report.totalMarks) - numeric(report.totalObtainedMarks)));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...colors.navy);
  doc.text("MARKS DISTRIBUTION", margin + 6, y + 28);

  const summaryX = margin + chartWidth + 5;
  const summaryWidth = width - chartWidth - 5;
  roundedCard(doc, summaryX, y, summaryWidth, chartHeight, [255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.navy);
  doc.text("EXAM RESULTS ANALYSIS", summaryX + 4, y + 5);

  const plotX = summaryX + 9;
  const plotY = y + 8;
  const plotWidth = summaryWidth - 14;
  const plotHeight = 15;
  [0, 25, 50, 75, 100].forEach((tick) => {
    const lineY = plotY + plotHeight - (tick / 100) * plotHeight;
    doc.setDrawColor(...colors.line);
    doc.setLineWidth(0.15);
    doc.line(plotX, lineY, plotX + plotWidth, lineY);
    if (tick === 0 || tick === 50 || tick === 100) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4.5);
      doc.setTextColor(...colors.muted);
      doc.text(String(tick), plotX - 2, lineY + 1.5, { align: "right" });
    }
  });

  const chartSubjects = subjects.slice(0, 8);
  const barSlot = chartSubjects.length ? plotWidth / chartSubjects.length : plotWidth;
  chartSubjects.forEach((subject, index) => {
    const obtained = numeric(subject.obtainedMarks);
    const total = numeric(subject.totalMarks) || 100;
    const value = Math.max(0, Math.min(100, numeric(subject.percentage) || (obtained / total) * 100));
    const barHeight = (value / 100) * plotHeight;
    const barWidth = Math.min(8, barSlot * 0.58);
    const barX = plotX + index * barSlot + (barSlot - barWidth) / 2;
    const barY = plotY + plotHeight - barHeight;
    const failed = String(subject.status || "").toUpperCase() === "FAIL";
    doc.setFillColor(...(failed ? colors.red : colors.emerald));
    doc.roundedRect(barX, barY, barWidth, Math.max(barHeight, 0.6), 0.8, 0.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.8);
    doc.setTextColor(...colors.ink);
    doc.text(String(Math.round(value)), barX + barWidth / 2, barY - 1.2, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.2);
    const label = text(subject.subjectName).slice(0, 9);
    doc.text(label, barX + barWidth / 2, plotY + plotHeight + 4, { align: "center" });
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4.5);
  doc.setTextColor(...colors.muted);
  doc.text(text(report.academicYear), summaryX + summaryWidth / 2, y + chartHeight - 0.5, { align: "center" });
  y += chartHeight + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...colors.navy);
  doc.text("PERFORMANCE ANALYSIS", margin, y);
  doc.text("TEACHER REMARKS", margin + 126, y);
  y += 4;
  const analysisWidth = 120;
  roundedCard(doc, margin, y, analysisWidth, 17, colors.paleBlue);
  const metrics = [["Overall", percent(report.percentage)], ["Subjects", subjects.length], ["Pass", passSubjects], ["Fail", failSubjects], ["Highest", highest], ["Lowest", lowest], ["Average", average.toFixed(1)]];
  metrics.forEach(([label, value], index) => {
    const cellWidth = analysisWidth / metrics.length;
    const mx = margin + index * cellWidth + 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...colors.muted);
    doc.text(label, mx, y + 6);
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.navy);
    doc.text(text(value), mx, y + 12);
    if (index === 0) {
      doc.setFillColor(...colors.line);
      doc.roundedRect(mx, y + 14, cellWidth - 4, 1.5, 0.6, 0.6, "F");
      doc.setFillColor(...resultColor);
      doc.roundedRect(mx, y + 14, (cellWidth - 4) * Math.min(1, numeric(report.percentage) / 100), 1.5, 0.6, 0.6, "F");
    }
  });
  const remarksX = margin + 125;
  const remarksWidth = width - 125;
  roundedCard(doc, remarksX, y, remarksWidth, 17, colors.paleGold);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...colors.ink);
  doc.text(doc.splitTextToSize(getTeacherRemarks(report), remarksWidth - 8), remarksX + 4, y + 9);
  y += 22;

  const signatureY = Math.min(pageHeight - 38, y + 3);
  doc.setDrawColor(...colors.line);
  doc.line(pageWidth - margin - 62, signatureY + 14, pageWidth - margin - 5, signatureY + 14);
  addImageContain(doc, principalSignature, pageWidth - margin - 62, signatureY - 1, 57, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...colors.navy);
  doc.text("PRINCIPAL", pageWidth - margin - 33.5, signatureY + 19, { align: "center" });


};

export const generateStudentReportCardPdf = (report) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  renderStudentReportCard(doc, report);
  const filename = `ReportCard_${text(report.rollNo || report.rollNumber || report.studentName).replaceAll(" ", "_")}_${text(report.examType || report.examinationType).replaceAll(" ", "_")}.pdf`;
  doc.save(filename);
};

export const generateStudentReportCardsPdf = (reports) => {
  if (!reports.length) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  reports.forEach((report, index) => {
    if (index > 0) doc.addPage();
    renderStudentReportCard(doc, report);
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
