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

const mapStudent = (student = {}) => ({
  schoolName: student.schoolName,
  schoolAddress: student.schoolAddress,
  schoolLogo: imageDataUrl(student.schoolLogo || student.schoolLogoUrl),
  principalSignature: imageDataUrl(student.principalSignature || student.principalSignatureUrl),
  studentPhoto: imageDataUrl(student.profilePhoto || student.profilePhotoUrl || student.photo || student.photoUrl),
  studentName: student.fullName || student.studentName || student.name,
  admissionNo: student.admissionNo || student.admissionNumber,
  rollNo: student.rollNo || student.rollNumber,
  className: student.className || student.class,
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

const drawLabelValue = (doc, label, content, x, y, width) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(92, 102, 122);
  doc.text(label.toUpperCase(), x, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(29, 38, 59);
  doc.text(doc.splitTextToSize(value(content), width), x, y + 4);
};

const drawFront = (doc, card, x, y, width, height) => {
  const navy = [28, 49, 92];
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(213, 222, 239);
  doc.roundedRect(x, y, width, height, 5, 5, "FD");
  doc.setFillColor(...navy);
  doc.roundedRect(x, y, width, 34, 5, 5, "F");
  doc.rect(x, y + 28, width, 6, "F");
  if (!drawImageContain(doc, card.schoolLogo, x + 8, y + 6, 18, 18)) {
    doc.setFillColor(255, 255, 255);
    doc.circle(x + 17, y + 15, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...navy);
    doc.text("S", x + 17, y + 17.5, { align: "center" });
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(value(card.schoolName), x + 30, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.6);
  doc.text(doc.splitTextToSize(value(card.schoolAddress), 76), x + 30, y + 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("STUDENT IDENTITY CARD", x + 30, y + 29);

  doc.setFillColor(242, 246, 255);
  doc.setDrawColor(194, 207, 235);
  doc.roundedRect(x + 10, y + 42, 32, 39, 4, 4, "FD");
  if (!drawImageContain(doc, card.studentPhoto, x + 12, y + 44, 28, 35)) {
    doc.setFillColor(203, 213, 235);
    doc.circle(x + 26, y + 57, 8, "F");
    doc.setFillColor(154, 169, 202);
    doc.ellipse(x + 26, y + 72, 11, 6, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...navy);
  doc.text(value(card.studentName), x + 49, y + 50);
  doc.setFontSize(7);
  doc.setTextColor(...navy);
  doc.text(`ADMISSION NO. ${value(card.admissionNo)}`, x + 49, y + 56);
  drawLabelValue(doc, "Class / Section", [card.className, card.section].filter(Boolean).join(" - "), x + 49, y + 65, 35);
  drawLabelValue(doc, "Academic Year", card.academicYear, x + 91, y + 65, 33);
  drawLabelValue(doc, "Roll Number", card.rollNo, x + 49, y + 78, 35);
  drawLabelValue(doc, "Blood Group", card.bloodGroup, x + 91, y + 78, 33);
  drawLabelValue(doc, "Date of Birth", card.dateOfBirth, x + 10, y + 94, 36);
  drawLabelValue(doc, "Gender", card.gender, x + 50, y + 94, 26);
  drawLabelValue(doc, "Father's Name", card.fatherName, x + 81, y + 94, 43);
  drawLabelValue(doc, "School Emergency", card.schoolEmergencyContact, x + 10, y + 108, 60);

  doc.setDrawColor(213, 222, 239);
  doc.line(x + 10, y + 119, x + width - 10, y + 119);
  if (card.principalSignature) drawImageContain(doc, card.principalSignature, x + width - 43, y + 120, 28, 10);
  doc.setDrawColor(105, 121, 153);
  doc.line(x + width - 46, y + 131, x + width - 12, y + 131);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(92, 102, 122);
  doc.text("AUTHORIZED SIGNATURE", x + width - 29, y + 136, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("This card remains the property of the school.", x + 10, y + 133);
};

export const buildStudentIdCardPdf = (student) => {
  const cardWidth = 130;
  const cardHeight = 140;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [cardWidth, cardHeight] });
  const card = mapStudent(student);
  drawFront(doc, card, 0, 0, cardWidth, cardHeight);
  return doc;
};

export const generateStudentIdCardsPrint = (students) => {
  if (!students?.length) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cardX = 40;
  const cardPositions = [5, 150];

  students.forEach((student, index) => {
    if (index > 0 && index % 2 === 0) doc.addPage();
    const card = mapStudent(student);
    drawFront(doc, card, cardX, cardPositions[index % 2], 130, 140);
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

export const downloadStudentIdCardPdf = (student) => {
  const card = mapStudent(student);
  buildStudentIdCardPdf(student).save(`student-id-card-${value(card.admissionNo).replace(/[^a-z0-9-_]/gi, "-")}.pdf`);
};
