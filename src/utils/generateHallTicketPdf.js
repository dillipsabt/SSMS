import { jsPDF } from "jspdf";

const imageDataUrl = (image) => image?.contentType && image?.data
  ? `data:${image.contentType};base64,${image.data}`
  : null;

const imageFormat = (dataUrl) => dataUrl?.startsWith("data:image/jpeg") || dataUrl?.startsWith("data:image/jpg") ? "JPEG" : "PNG";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-GB");
};

const formatScheduleTime = (value) => {
  if (!value) return "-";
  if (typeof value === "string") return value.slice(0, 5);
  return `${String(value.hour ?? 0).padStart(2, "0")}:${String(value.minute ?? 0).padStart(2, "0")}`;
};

const getDynamicSchedule = (ticket) => {
  const schedule = ticket?.examSchedule || ticket?.examinationSchedule || ticket?.schedules || ticket?.subjects || [];
  if (!Array.isArray(schedule)) return [];
  return schedule.map((item) => ({
    subjectName: item?.subjectName || item?.subject || item?.name || item?.subjectTitle || "-",
    examDate: item?.examDate || item?.date || item?.examinationDate || null,
    startTime: formatScheduleTime(item?.startTime),
    endTime: formatScheduleTime(item?.endTime),
  })).filter((item) => item.subjectName !== "-" || item.examDate);
};

const roundedRect = (doc, x, y, width, height, radius = 3, style = "S") => {
  doc.roundedRect(x, y, width, height, radius, radius, style);
};

const drawDetailIcon = (doc, x, y, type, green, white) => {
  doc.setFillColor(...green);
  doc.setDrawColor(...green);
  doc.setLineWidth(0.4);
  doc.circle(x, y, 3.6, "FD");
  doc.setDrawColor(...white);
  doc.setFillColor(...white);
  doc.setLineWidth(0.45);
  if (type === "person" || type === "father") {
    doc.circle(x, y - 1.15, 0.9, "S");
    doc.line(x - 1.8, y + 1.6, x - 1.1, y + 0.4);
    doc.line(x - 1.1, y + 0.4, x + 1.1, y + 0.4);
    doc.line(x + 1.1, y + 0.4, x + 1.8, y + 1.6);
  } else if (type === "roll") {
    doc.rect(x - 2.1, y - 1.7, 4.2, 3.4, "S");
    doc.circle(x - 0.9, y - 0.55, 0.45, "S");
    doc.line(x, y - 0.7, x + 1.2, y - 0.7);
    doc.line(x, y + 0.35, x + 1.2, y + 0.35);
  } else if (type === "class") {
    doc.line(x - 2.3, y - 0.5, x, y - 1.8);
    doc.line(x, y - 1.8, x + 2.3, y - 0.5);
    doc.line(x + 2.3, y - 0.5, x, y + 0.8);
    doc.line(x, y + 0.8, x - 2.3, y - 0.5);
    doc.line(x + 1.6, y - 1, x + 1.6, y + 1.5);
    doc.circle(x + 1.6, y + 1.5, 0.35, "S");
  } else {
    doc.rect(x - 2.1, y - 2, 4.2, 4, "S");
    doc.circle(x, y - 0.8, 0.55, "S");
    doc.line(x - 1.2, y + 0.8, x + 1.2, y + 0.8);
  }
};

const getTicketPageHeight = (ticketData) => {
  const scheduleRows = getDynamicSchedule(ticketData);
  const scheduleColumns = [0, 1, 2].map((column) => scheduleRows.filter((_, index) => index % 3 === column));
  const numberOfRows = Math.max(...scheduleColumns.map((column) => column.length), 1);
  return 100 + numberOfRows * 8 + 5 + 20;
};

const renderHallTicket = (doc, ticketData, pageHeightOverride) => {
  const schoolName = ticketData.schoolName || "School Name";
  const schoolAddress = ticketData.schoolAddress || "Address here";
  const examType = ticketData.examType || ticketData.examinationType || ticketData.exam?.examType || "Examination";
  const academicYear = ticketData.academicYear || ticketData.exam?.academicYear || "";
  const studentName = ticketData.studentName || ticketData.name || "-";
  const fatherName = ticketData.fatherName || ticketData.father || ticketData.parentName || "-";
  const rollNo = ticketData.rollNo || ticketData.rollNumber || "-";
  const admissionNo = ticketData.admissionNo || ticketData.admissionNumber || "-";
  const classSection = ticketData.classSection || ticketData.classAndSection || ticketData.className || ticketData.classCode || "-";
  const dynamicSchedule = getDynamicSchedule(ticketData);
  const scheduleRows = dynamicSchedule.length ? dynamicSchedule : [{ subjectName: "-", examDate: null, startTime: "-", endTime: "-" }];
  const scheduleColumns = [0, 1, 2].map((column) => scheduleRows.filter((_, index) => index % 3 === column));
  const numberOfRows = Math.max(...scheduleColumns.map((column) => column.length), 1);
  const pageHeight = pageHeightOverride || getTicketPageHeight(ticketData);
  const pageWidth = 210;
  const GREEN = [0, 91, 73];
  const LIGHT_GREEN = [237, 247, 243];
  const TEXT = [55, 55, 55];
  const BORDER = [100, 100, 100];
  const LIGHT_BORDER = [180, 180, 180];
  const WHITE = [255, 255, 255];
  const marginX = 6;
  const contentWidth = pageWidth - marginX * 2;
  const schoolLogo = imageDataUrl(ticketData.schoolLogo);
  const studentPhoto = imageDataUrl(ticketData.studentPhoto);
  const principalSignature = imageDataUrl(ticketData.principalSignature);

  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.55);
  roundedRect(doc, marginX, 5, contentWidth, pageHeight - 10, 4);

  const headerTop = 7;
  const logoX = marginX + 5;
  const logoY = headerTop + 2;
  const logoWidth = 25;
  const logoHeight = 22;
  if (schoolLogo) {
    try {
      const properties = doc.getImageProperties(schoolLogo);
      const scale = Math.min(logoWidth / properties.width, logoHeight / properties.height);
      doc.addImage(schoolLogo, imageFormat(schoolLogo), logoX + (logoWidth - properties.width * scale) / 2, logoY + (logoHeight - properties.height * scale) / 2, properties.width * scale, properties.height * scale);
    } catch { }
  }

  const bannerWidth = 50;
  const bannerHeight = 10;
  const bannerX = pageWidth / 2 - bannerWidth / 2 + 8;
  const bannerY = headerTop;
  doc.setFillColor(...GREEN);
  doc.roundedRect(bannerX, bannerY, bannerWidth, bannerHeight, 4, 4, "F");
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.line(bannerX + 5, bannerY + 2, bannerX + bannerWidth - 5, bannerY + 2);
  doc.line(bannerX + 5, bannerY + bannerHeight - 2, bannerX + bannerWidth - 5, bannerY + bannerHeight - 2);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.text("HALL TICKET", bannerX + bannerWidth / 2, bannerY + 6.2, { align: "center" });

  const schoolNameStartX = logoX + logoWidth + 3;
  const schoolNameWidth = bannerX - schoolNameStartX - 28;
  doc.setFont("helvetica", "bold");
  let schoolFont = 15;
  doc.setFontSize(schoolFont);
  while (doc.getTextWidth(schoolName) > schoolNameWidth && schoolFont > 10) { schoolFont -= 1; doc.setFontSize(schoolFont); }
  doc.setTextColor(30, 30, 30);
  doc.text(schoolName, schoolNameStartX, headerTop + 13.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(doc.splitTextToSize(schoolAddress, schoolNameWidth), schoolNameStartX, headerTop + 18.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...GREEN);
  doc.text(examType.toUpperCase(), bannerX + bannerWidth / 2, bannerY + 15.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Academic Session ${academicYear}`, bannerX + bannerWidth / 2, bannerY + 20.5, { align: "center" });

  const photoWidth = 25;
  const photoHeight = 27;
  const photoX = marginX + contentWidth - photoWidth - 5;
  const photoY = headerTop + 1;
  if (studentPhoto) {
    doc.setFillColor(...LIGHT_GREEN);
    doc.setDrawColor(...LIGHT_BORDER);
    roundedRect(doc, photoX, photoY, photoWidth, photoHeight, 3, "FD");
    try { doc.addImage(studentPhoto, imageFormat(studentPhoto), photoX + 1, photoY + 1, photoWidth - 2, photoHeight - 2); } catch { }
  }

  const infoTop = 35;
  const infoHeight = 28;
  doc.setDrawColor(...LIGHT_BORDER);
  doc.setLineWidth(0.45);
  roundedRect(doc, marginX + 4, infoTop, contentWidth - 8, infoHeight, 3);
  doc.line(pageWidth / 2, infoTop + 3, pageWidth / 2, infoTop + infoHeight - 3);
  const drawDetail = (x, y, label, value, icon, valueX) => {
    drawDetailIcon(doc, x, y - 1.7, icon, GREEN, WHITE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT);
    doc.text(label, x + 7, y);
    doc.text(":", x + 32, y);
    doc.text(String(value || "-"), valueX, y);
  };
  const leftInfoX = marginX + 9;
  drawDetail(leftInfoX, infoTop + 8, "Name", studentName, "person", leftInfoX + 39);
  drawDetail(leftInfoX, infoTop + 17, "Father Name", fatherName, "father", leftInfoX + 39);
  drawDetail(leftInfoX, infoTop + 25, "Roll No.", rollNo, "roll", leftInfoX + 39);
  const rightInfoX = pageWidth / 2 + 8;
  drawDetail(rightInfoX, infoTop + 8, "Class", classSection, "class", rightInfoX + 39);
  drawDetail(rightInfoX, infoTop + 17, "Admission No.", admissionNo, "admission", rightInfoX + 39);

  const scheduleTop = infoTop + infoHeight + 3;
  const scheduleHeaderHeight = 8;
  const tableLeft = marginX + 4;
  const tableWidth = contentWidth - 8;
  const tableTop = scheduleTop + scheduleHeaderHeight;
  const tableRowHeight = 11;
  const tableHeight = tableRowHeight + numberOfRows * tableRowHeight;
  const columnWidths = [32, 28, 32, 28, 32, 28];
  doc.setFillColor(...GREEN);
  doc.setDrawColor(...GREEN);
  doc.roundedRect(tableLeft, scheduleTop, tableWidth, scheduleHeaderHeight, 3, 3, "F");
  doc.rect(tableLeft, scheduleTop + 4, tableWidth, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  doc.text("EXAMINATION SCHEDULE", pageWidth / 2, scheduleTop + 5.5, { align: "center" });
  doc.setDrawColor(...LIGHT_BORDER);
  doc.setLineWidth(0.35);
  doc.rect(tableLeft, tableTop, tableWidth, tableHeight);
  doc.setFillColor(240, 244, 243);
  doc.rect(tableLeft, tableTop, tableWidth, tableRowHeight, "F");
  let currentX = tableLeft;
  columnWidths.forEach((width, index) => { currentX += width; if (index < columnWidths.length - 1) doc.line(currentX, tableTop, currentX, tableTop + tableHeight); });
  for (let row = 1; row <= numberOfRows; row += 1) doc.line(tableLeft, tableTop + row * tableRowHeight, tableLeft + tableWidth, tableTop + row * tableRowHeight);
  const headers = ["SUBJECT", "DATE", "SUBJECT", "DATE", "SUBJECT", "DATE"];
  let headerX = tableLeft;
  doc.setTextColor(...TEXT);
  headers.forEach((header, index) => { doc.text(header, headerX + columnWidths[index] / 2, tableTop + 5.2, { align: "center" }); headerX += columnWidths[index]; });
  const drawCell = (x, y, width, value) => { doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(...TEXT); doc.text(String(value || "-").split("\n"), x + width / 2, y, { align: "center", lineHeightFactor: 1.25 }); };
  for (let row = 0; row < numberOfRows; row += 1) {
    const y = tableTop + tableRowHeight + row * tableRowHeight + 5.2;
    let x = tableLeft;
    scheduleColumns.forEach((column, columnIndex) => {
      const exam = column[row];
      const subjectWidth = columnWidths[columnIndex * 2];
      const dateWidth = columnWidths[columnIndex * 2 + 1];
      drawCell(x, y, subjectWidth, exam?.subjectName); x += subjectWidth;
      drawCell(x, y, dateWidth, exam ? `${formatDate(exam.examDate)}\n${exam.startTime} - ${exam.endTime}` : "-"); x += dateWidth;
    });
  }

  const bottomTop = tableTop + tableHeight + 4;
  const instructionWidth = 105;
  const instructionHeight = 22;
  const instructionX = marginX + 4;
  const instructionY = bottomTop - 3;
  doc.setFillColor(255, 250, 230);
  doc.setDrawColor(226, 184, 52);
  roundedRect(doc, instructionX, instructionY, instructionWidth, instructionHeight, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...TEXT);
  doc.text("IMPORTANT INSTRUCTIONS", instructionX + 4, instructionY + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setFillColor(...TEXT);
  doc.circle(instructionX + 8, instructionY + 9.5, 0.6, "F");
  doc.text("No Re-Examination", instructionX + 11, instructionY + 11);

  const signatureAreaX = instructionX + instructionWidth + 7;
  const signatureAreaWidth = contentWidth - 8 - instructionWidth - 7;
  const signatureTop = instructionY;
  doc.setDrawColor(...LIGHT_BORDER);
  doc.line(signatureAreaX, signatureTop, signatureAreaX, signatureTop + instructionHeight);
  const signatureColumnWidth = signatureAreaWidth / 2;
  const studentSignatureCenter = signatureAreaX + signatureColumnWidth / 2;
  const principalSignatureCenter = signatureAreaX + signatureColumnWidth + signatureColumnWidth / 2;
  doc.line(signatureAreaX + signatureColumnWidth, signatureTop, signatureAreaX + signatureColumnWidth, signatureTop + instructionHeight);
  const signatureLineY = signatureTop + 18;
  doc.setDrawColor(...TEXT);
  doc.line(studentSignatureCenter - 20, signatureLineY, studentSignatureCenter + 20, signatureLineY);
  doc.line(principalSignatureCenter - 20, signatureLineY, principalSignatureCenter + 20, signatureLineY);
  if (principalSignature) {
    try { doc.addImage(principalSignature, imageFormat(principalSignature), principalSignatureCenter - 17, signatureTop + 5, 34, 11); } catch { }
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT);
  doc.text("Student Signature", studentSignatureCenter, signatureTop + 24, { align: "center" });
  doc.text("Principal Signature", principalSignatureCenter, signatureTop + 24, { align: "center" });
  doc.setTextColor(130, 130, 130);
  doc.text(String(schoolName), pageWidth / 2, pageHeight - 7, { align: "center" });
};

export const generateHallTicketPdf = (ticketData) => {
  const pageHeight = getTicketPageHeight(ticketData);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, pageHeight] });
  renderHallTicket(doc, ticketData, pageHeight);
  doc.save(`hall-ticket-${ticketData.hallTicketNo || "download"}.pdf`);
};

export const generateHallTicketsPdf = (tickets) => {
  if (!tickets.length) return;
  const baseHeight = Math.max(...tickets.map(getTicketPageHeight));
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const topMargin = 5;
  const bottomMargin = 10;
  const gap = 50;

  const availableHeight = 297 - topMargin - bottomMargin - gap;
  const yScale = Math.min(0.60, availableHeight / (baseHeight * 2));
  const xScale = 0.95;
  const cardWidth = 210 * xScale;
  const startX = ((210 - cardWidth) / 2) / xScale;

  tickets.forEach((ticket, index) => {
    if (index > 0 && index % 2 === 0) {
      doc.addPage();
    }

    const position = index % 2;

    const startY =
      (topMargin + position * (baseHeight * yScale + gap)) / yScale;

    doc.saveGraphicsState();
    doc.setCurrentTransformationMatrix(
      `${xScale} 0 0 ${yScale} ${startX} ${startY}`
    );

    renderHallTicket(doc, ticket, baseHeight);

    doc.restoreGraphicsState();
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
