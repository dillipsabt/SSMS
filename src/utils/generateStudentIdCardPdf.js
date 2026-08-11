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
  bloodGroup: student.bloodGroup,
  dateOfBirth: student.dob || student.dateOfBirth,
  gender: student.gender,
  fatherName: student.fatherName || student.father || student.parentName,
  motherName: student.motherName || student.mother,
  address: student.address || student.currentAddress,
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

const drawCardField = (doc, label, content, x, y, width) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(3.7);
  doc.setTextColor(245, 241, 255);
  doc.text(label, x, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.8);
  doc.setTextColor(255, 255, 255);
  const lines = doc.splitTextToSize(value(content), width).slice(0, 2);
  doc.text(lines, x, y + 2.7, { lineHeightFactor: 1.05 });
};

const drawFront = async (doc, card, x, y, width, height) => {
  const purple = [82, 55, 230];
  const panel = [151, 111, 241];
  const safe = 3;
  const center = x + width / 2;

  doc.setFillColor(...purple);
  doc.setDrawColor(...purple);
  doc.setLineWidth(0.35);
  doc.roundedRect(x, y, width, height, 1.2, 1.2, "FD");
  doc.setFillColor(...panel);
  doc.roundedRect(x + safe, y + 27, width - safe * 2, height - 30, 3.2, 3.2, "F");
  const logoX = x + 7;
  const logoY = y + 3.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.circle(logoX + 4, logoY + 4, 4.5, "FD");
  drawImageContain(doc, card.schoolLogo, logoX + 0.8, logoY + 0.8, 6.4, 6.4);
  const headerLeft = x + 17;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.4);
  doc.setTextColor(255, 255, 255);
  doc.text(doc.splitTextToSize(value(card.schoolName), 32).slice(0, 2), headerLeft, y + 5.8, { lineHeightFactor: 1.05 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(3.8);
  doc.text(doc.splitTextToSize(value(card.schoolAddress), 32).slice(0, 2), headerLeft, y + 12.4, { lineHeightFactor: 1.05 });

  const photoY = y + 18;
  doc.setFillColor(191, 246, 244);
  doc.circle(center, photoY + 11, 11.8, "F");
  if (!(await drawImageCoverCircle(doc, card.studentPhoto, center, photoY + 11, 11.8))) {
    doc.setFillColor(222, 229, 239);
    doc.circle(center, photoY + 8.5, 4.3, "F");
    doc.setFillColor(164, 176, 204);
    doc.ellipse(center, photoY + 19, 6.5, 3.6, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(255, 255, 255);
  doc.text(doc.splitTextToSize(value(card.studentName), width - 8).slice(0, 2), center, y + 48, { align: "center", lineHeightFactor: 1.05 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4.1);
  doc.text(value(card.academicYear), center, y + 53, { align: "center" });

  const left = x + 8;
  const right = center + 2;
  drawCardField(doc, "Roll Number", card.rollNo, left, y + 59, 17);
  drawCardField(doc, "Father's Name", card.fatherName, right, y + 59, 17);
  drawCardField(doc, "Class / Section", [card.className, card.section].filter(Boolean).join(" - "), left, y + 65, 17);
  drawCardField(doc, "Gender", card.gender, right, y + 65, 17);
  drawCardField(doc, "Date of Birth", card.dateOfBirth, left, y + 71, 17);
  drawCardField(doc, "Blood Group", card.bloodGroup, right, y + 71, 17);

  doc.setDrawColor(220, 201, 255);
  doc.setLineWidth(0.25);
  doc.line(x + 8, y + 77, x + width - 8, y + 77);
  if (card.principalSignature) drawImageContain(doc, card.principalSignature, x + width - 28, y + 78, 21, 5.2);
  doc.setDrawColor(247, 235, 255);
  doc.line(x + width - 28, y + 84.5, x + width - 6, y + 84.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(3.2);
  doc.setTextColor(255, 255, 255);
  doc.text("Principal Signature", x + width - 17, y + 87, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(3);
  doc.text("Property of the school", x + 8, y + 87);
};

export const buildStudentIdCardPdf = async (student) => {
  const cardWidth = 54;
  const cardHeight = 91;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [cardWidth, cardHeight] });
  const card = mapStudent(student);
  await drawFront(doc, card, 0, 0, cardWidth, cardHeight);
  return doc;
};

export const generateStudentIdCardsPrint = async (students) => {
  if (!students?.length) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cardX = (210 - 54) / 2;
  const cardPositions = [52, 153];

  for (const [index, student] of students.entries()) {
    if (index > 0 && index % 2 === 0) doc.addPage();
    const card = mapStudent(student);
    await drawFront(doc, card, cardX, cardPositions[index % 2], 54, 91);
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
