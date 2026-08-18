import { jsPDF } from "jspdf";

const value = (input) => input === null || input === undefined || input === "" ? "-" : String(input);

const imageDataUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  const data = image.base64 || image.data;
  return data ? (data.startsWith?.("data:") ? data : `data:${image.contentType || "image/png"};base64,${data}`) : image.url || image.fileUrl || null;
};

const imageFormat = (source) => source?.startsWith("data:image/jpeg") || source?.startsWith("data:image/jpg") ? "JPEG" : "PNG";

const drawImageContain = (doc, source, x, y, width, height) => {
  if (!source) return false;
  try {
    const properties = doc.getImageProperties(source);
    const scale = Math.min(width / properties.width, height / properties.height);
    const imageWidth = properties.width * scale;
    const imageHeight = properties.height * scale;
    doc.addImage(source, imageFormat(source), x + (width - imageWidth) / 2, y + (height - imageHeight) / 2, imageWidth, imageHeight);
    return true;
  } catch {
    return false;
  }
};

const createCircularPhoto = (source) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => {
    const size = 512;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;

    context.clearRect(0, 0, size, size);
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.clip();
    context.drawImage(image, (size - imageWidth) / 2, (size - imageHeight) / 2, imageWidth, imageHeight);
    resolve(canvas.toDataURL("image/png"));
  };
  image.onerror = reject;
  image.src = source;
});

const drawImageCoverCircle = async (doc, source, centerX, centerY, radius) => {
  if (!source) return false;
  try {
    const circularPhoto = await createCircularPhoto(source);
    const diameter = radius * 2;
    doc.addImage(circularPhoto, "PNG", centerX - radius, centerY - radius, diameter, diameter);
    return true;
  } catch {
    return false;
  }
};

const mapStudent = (student = {}) => ({
  schoolName: student.schoolName,
  schoolAddress: student.schoolAddress,
  schoolLogo: imageDataUrl(student.schoolLogo || student.schoolLogoUrl),
  principalSignature: imageDataUrl(student.principalSignature || student.principalSignatureUrl),
  studentPhoto: imageDataUrl(student.studentPhoto || student.profilePhoto || student.profilePhotoUrl || student.photo || student.photoUrl),
  studentName: student.fullName || student.studentName || student.name,
  admissionNo: student.admissionNo || student.admissionNumber,
  rollNo: student.rollNo || student.rollNumber,
  className: student.classAndSection || student.className || student.class,
  section: student.section,
  academicYear: student.academicYear || student.academicSession,
  gender: student.gender,
  fatherName: student.fatherName || student.father || student.parentName,
  motherName: student.motherName || student.mother,
  address: student.address || student.currentAddress,
  parentPhoneNo: student.parentPhoneNo || student.guardianContact || student.phone,
  guardianContact: student.parentPhoneNo || student.guardianContact || student.phone,
  emergencyContact: student.emergencyContact,
  transportRoute: student.transportRoute,
  medicalNotes: student.medicalNotes,
  website: student.website,
  email: student.schoolEmail || student.email,
  phone: student.schoolPhone || student.phone,
  schoolEmergencyContact: student.schoolEmergencyContact || student.schoolEmergencyPhone || student.emergencyPhone || student.schoolPhone,
  qrCode: imageDataUrl(student.qrCode),
  barcode: student.barcode,
});

const drawDetailRow = (doc, label, content, x, y, width, valueColor = [34, 39, 51]) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.2);
  doc.setTextColor(75, 79, 91);
  doc.text(label, x, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(...valueColor);
  const lines = doc.splitTextToSize(value(content), width - 19).slice(0, 1);
  doc.text(lines[0], x + width, y, { align: "right" });
  doc.setDrawColor(224, 227, 234);
  doc.setLineWidth(0.2);
  doc.line(x, y + 3.5, x + width, y + 3.5);
};

const drawFront = async (doc, card, x, y, width, height) => {
  const background = [247, 250, 255];
  const border = [193, 201, 217];
  const center = x + width / 2;
  const photoCenterX = card.qrCode ? x + 15 : center;

  doc.setFillColor(...background);
  doc.setDrawColor(...border);
  doc.setLineWidth(0.35);
  doc.roundedRect(x, y, width, height, 1.6, 1.6, "FD");

  drawImageContain(doc, card.schoolLogo, x + 9, y + 3.5, 8.5, 8.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  doc.setTextColor(45, 47, 54);
  doc.text(doc.splitTextToSize(value(card.schoolName), 30).slice(0, 2), x + 20, y + 8.1, { lineHeightFactor: 1.05 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(3.8);
  doc.setTextColor(75, 79, 91);
  doc.text("STUDENT IDENTITY CARD", center, y + 15.7, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.8);
  doc.text(value(card.academicYear), center, y + 18.3, { align: "center" });

  const photoCenterY = y + 34;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.circle(photoCenterX, photoCenterY, 11.5, "FD");
  if (!(await drawImageCoverCircle(doc, card.studentPhoto, photoCenterX, photoCenterY, 10.6))) {
    doc.setFillColor(222, 229, 239);
    doc.circle(photoCenterX, photoCenterY - 2.5, 4, "F");
    doc.setFillColor(164, 176, 204);
    doc.ellipse(photoCenterX, photoCenterY + 6, 6.5, 3.7, "F");
  }

  if (card.qrCode) {
    drawImageContain(doc, card.qrCode, x + 32, y + 20, 18, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(2.7);
    doc.setTextColor(75, 79, 91);
    doc.text("SCAN TO VERIFY", x + 41, y + 40, { align: "center" });
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(12, 14, 20);
  doc.text(doc.splitTextToSize(value(card.studentName), 25).slice(0, 1), photoCenterX, y + 48.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4.5);
  doc.setTextColor(75, 79, 91);
  doc.text("Student", photoCenterX, y + 52.1, { align: "center" });

  const detailsX = x + 7.5;
  const detailsWidth = width - 15;
  drawDetailRow(doc, "Roll Number", card.rollNo || card.admissionNo, detailsX, y + 55.5, detailsWidth);
  drawDetailRow(doc, "Father Name", card.fatherName, detailsX, y + 61.5, detailsWidth);
  drawDetailRow(doc, "Class/Sec", [card.className, card.section].filter(Boolean).join("-"), detailsX, y + 67.5, detailsWidth);
  drawDetailRow(doc, "Parent Phone", card.parentPhoneNo, detailsX, y + 73.5, detailsWidth, [184, 35, 38]);

  doc.setDrawColor(193, 201, 217);
  doc.setLineWidth(0.25);
  doc.line(x + 5, y + 77.2, x + width - 5, y + 77.2);

  const emergencyContact = card.emergencyContact || card.guardianContact;
  if (emergencyContact) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(2.8);
    doc.setTextColor(75, 79, 91);
    doc.text("Emergency Contact", x + 7, y + 81.2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.4);
    doc.text(value(emergencyContact), x + 7, y + 84.3);
  }

  if (card.principalSignature) drawImageContain(doc, card.principalSignature, x + width - 24, y + 78.3, 17, 3.8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(3.2);
  doc.setTextColor(75, 79, 91);
  doc.text("PRINCIPAL", x + width - 15.5, y + 84.3, { align: "center" });
};

export const buildStudentIdCardPdf = async (student) => {
  const cardWidth = 54;
  const cardHeight = 85.6;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [cardWidth, cardHeight] });
  const card = mapStudent(student);
  await drawFront(doc, card, 0, 0, cardWidth, cardHeight);
  return doc;
};

export const generateStudentIdCardsPrint = async (students) => {
  if (!students?.length) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cardWidth = 54;
  const cardHeight = 85.6;
  const cardX = (210 - cardWidth) / 2;
  const cardY = (297 - cardHeight) / 2;

  for (const [index, student] of students.entries()) {
    if (index > 0) doc.addPage();
    const card = mapStudent(student);
    await drawFront(doc, card, cardX, cardY, cardWidth, cardHeight);
  }

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

export const downloadStudentIdCardPdf = async (student) => {
  const card = mapStudent(student);
  const pdf = await buildStudentIdCardPdf(student);
  pdf.save(`student-id-card-${value(card.admissionNo).replace(/[^a-z0-9-_]/gi, "-")}.pdf`);
};
