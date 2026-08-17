import { jsPDF } from "jspdf";
import { getAuthToken } from "./storage";

const COLORS = {
  navy: [17, 46, 81],
  teal: [0, 126, 122],
  gold: [213, 160, 52],
  ink: [31, 41, 55],
  muted: [100, 116, 139],
  line: [218, 226, 235],
  pale: [244, 248, 251],
  white: [255, 255, 255],
};

const text = (value, fallback = "-") =>
  value === null || value === undefined || value === "" ? fallback : String(value);

const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) =>
  `INR ${number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const imageDataUrl = (source) => {
  if (!source) return null;
  if (typeof source === "string") {
    if (source.startsWith("data:")) return source;
    const normalized = source.replace(/\s/g, "");
    return /^[A-Za-z0-9+/]+={0,2}$/.test(normalized) && normalized.length > 100
      ? `data:image/png;base64,${normalized}`
      : null;
  }

  if (typeof source !== "object") return null;

  const data = source.base64 || source.data || source.content || source.value;
  if (typeof data === "string") {
    const embedded = imageDataUrl(data);
    if (embedded) {
      return embedded.startsWith("data:")
        ? embedded
        : `data:${source.contentType || source.mimeType || "image/png"};base64,${embedded}`;
    }
  }

  if (Array.isArray(data)) {
    let binary = "";
    data.forEach((byte) => {
      binary += String.fromCharCode(Number(byte));
    });
    return `data:${source.contentType || source.mimeType || "image/png"};base64,${btoa(binary)}`;
  }

  return imageDataUrl(source.file || source.image || source.logo || source.signature);
};

const imageSource = (source) => {
  if (!source) return null;
  if (typeof source === "string") return source;
  return source.url || source.fileUrl || source.href || source.path || imageSource(source.file || source.image || source.logo || source.signature);
};

export const getReceiptImageSource = (source) => imageDataUrl(source) || imageSource(source);

const toDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const resolveImage = async (source) => {
  const embedded = imageDataUrl(source);
  if (embedded) return embedded;

  const url = imageSource(source);
  if (!url) return null;

  try {
    const token = getAuthToken();
    const response = await fetch(url, {
      headers: token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : undefined,
    });
    if (!response.ok) return null;
    return await toDataUrl(await response.blob());
  } catch {
    return null;
  }
};

const getSchoolValue = (school, keys, fallback = "-") =>
  keys.map((key) => school?.[key]).find((value) => value !== null && value !== undefined && value !== "") || fallback;

const getReceiptValue = (receipt, keys, fallback = "-") =>
  keys.map((key) => receipt?.[key]).find((value) => value !== null && value !== undefined && value !== "") || fallback;

const getEmbeddedImage = (school, keys) =>
  keys.map((key) => imageDataUrl(school?.[key])).find(Boolean) || null;

const formatPaymentMode = (value) =>
  text(value, "-")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const feeLabel = (value) =>
  text(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const amountInWords = (value) => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const belowThousand = (valueToConvert) => {
    if (valueToConvert < 20) return ones[valueToConvert];
    if (valueToConvert < 100) return `${tens[Math.floor(valueToConvert / 10)]}${valueToConvert % 10 ? ` ${ones[valueToConvert % 10]}` : ""}`;
    return `${ones[Math.floor(valueToConvert / 100)]} Hundred${valueToConvert % 100 ? ` ${belowThousand(valueToConvert % 100)}` : ""}`;
  };
  const integer = Math.floor(number(value));
  if (!integer) return "Zero Rupees Only";

  const parts = [];
  const crore = Math.floor(integer / 10000000);
  const lakh = Math.floor((integer % 10000000) / 100000);
  const thousand = Math.floor((integer % 100000) / 1000);
  const remainder = integer % 1000;
  if (crore) parts.push(`${belowThousand(crore)} Crore`);
  if (lakh) parts.push(`${belowThousand(lakh)} Lakh`);
  if (thousand) parts.push(`${belowThousand(thousand)} Thousand`);
  if (remainder) parts.push(belowThousand(remainder));
  return `${parts.join(" ")} Rupees Only`;
};

const addImageContain = (doc, source, x, y, width, height) => {
  if (!source) return;
  try {
    const properties = doc.getImageProperties(source);
    const scale = Math.min(width / properties.width, height / properties.height);
    const drawWidth = properties.width * scale;
    const drawHeight = properties.height * scale;
    const format = source.startsWith("data:image/jpeg") || source.startsWith("data:image/jpg") ? "JPEG" : "PNG";
    doc.addImage(source, format, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  } catch {
    return;
  }
};

const drawLabelValue = (doc, label, value, x, y, width) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(label.toUpperCase(), x, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.ink);
  doc.text(doc.splitTextToSize(text(value), width), x, y + 4.5);
};

const drawSectionTitle = (doc, title, x, y, width) => {
  doc.setFillColor(...COLORS.navy);
  doc.roundedRect(x, y, width, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.white);
  doc.text(title.toUpperCase(), x + 4, y + 4.6);
};

const prepareReceiptData = async (receipt, school) => {
  const logoKeys = ["schoolLogoBase64", "logoBase64", "schoolLogo", "logo", "schoolLogoUrl", "logoUrl"];
  const signatureKeys = ["principalSignatureBase64", "signatureBase64", "principalSignBase64", "principalSignature", "principalSign", "principalSignatureUrl", "signatureUrl"];
  const logoBase64 = getEmbeddedImage(school, logoKeys);
  const signatureBase64 = getEmbeddedImage(school, signatureKeys);

  return {
    receipt,
    school,
    logo: logoBase64 || await resolveImage(getSchoolValue(school, logoKeys, null)),
    signature: signatureBase64 || await resolveImage(getSchoolValue(school, signatureKeys, null)),
  };
};

const renderNormalReceipt = (doc, data) => {
  const { receipt, school, logo, signature } = data;
  const pageWidth = 210;
  const margin = 13;
  const width = pageWidth - margin * 2;
  const schoolName = getSchoolValue(school, ["schoolName", "name"], "School Name");
  const schoolAddress = getSchoolValue(school, ["address", "schoolAddress"], "Address");
  const phone = getSchoolValue(school, ["phoneNo", "phoneNumber", "principalPhoneNo"], "");
  const email = getSchoolValue(school, ["primaryEmail", "email"], "");
  const studentName = getReceiptValue(receipt, ["studentName", "name"]);
  const paymentMode = formatPaymentMode(getReceiptValue(receipt, ["paymentMode", "paymentMethod", "mode"]));
  const items = Array.isArray(receipt?.items) ? receipt.items : [];
  const subtotal = items.reduce((sum, item) => sum + number(item.amount), 0);
  const charges = number(receipt?.charges);
  const gst = number(receipt?.gstAmount ?? receipt?.gstAmountValue);
  const total = number(receipt?.netAmount ?? receipt?.totalAmount ?? subtotal + charges + gst);
  const receiptNumber = getReceiptValue(receipt, ["transactionId", "receiptNo", "receiptNumber"]);

  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, pageWidth, 8, "F");
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.45);
  doc.roundedRect(margin, 13, width, 270, 4, 4, "S");

  addImageContain(doc, logo, margin + 7, 20, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...COLORS.navy);
  doc.text(doc.splitTextToSize(schoolName, 112), margin + 40, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(doc.splitTextToSize(schoolAddress, 112), margin + 40, 34);
  const contact = [phone, email].filter(Boolean).join("  |  ");
  if (contact) doc.text(contact, margin + 40, 41);

  doc.setFillColor(...COLORS.teal);
  doc.roundedRect(pageWidth - margin - 45, 20, 38, 20, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.white);
  doc.text("OFFICIAL", pageWidth - margin - 26, 28, { align: "center" });
  doc.setFontSize(9);
  doc.text("RECEIPT", pageWidth - margin - 26, 34, { align: "center" });
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1.1);
  doc.line(margin + 7, 51, pageWidth - margin - 7, 51);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.navy);
  doc.text("PAYMENT RECEIPT", pageWidth / 2, 62, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.text("Original copy · Computer generated receipt", pageWidth / 2, 67, { align: "center" });

  drawSectionTitle(doc, "Transaction Details", margin + 7, 74, width - 14);
  doc.setFillColor(...COLORS.pale);
  doc.roundedRect(margin + 7, 81, width - 14, 22, 2, 2, "F");
  drawLabelValue(doc, "Receipt No.", receiptNumber, margin + 12, 88, 35);
  drawLabelValue(doc, "Transaction Date", getReceiptValue(receipt, ["transactionDate", "paymentDate"]), margin + 53, 88, 35);
  drawLabelValue(doc, "Payment Mode", paymentMode, margin + 98, 88, 35);
  drawLabelValue(doc, "Reference", getReceiptValue(receipt, ["referenceNo", "transactionReference"], receiptNumber), margin + 143, 88, 45);

  drawSectionTitle(doc, "Student Details", margin + 7, 110, width - 14);
  doc.setDrawColor(...COLORS.line);
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(margin + 7, 117, width - 14, 27, 2, 2, "FD");
  drawLabelValue(doc, "Student Name", studentName, margin + 12, 125, 62);
  drawLabelValue(doc, "Admission / Roll No.", getReceiptValue(receipt, ["rollNo", "admissionNo", "admissionNumber"]), margin + 83, 125, 45);
  drawLabelValue(doc, "Class", getReceiptValue(receipt, ["className", "class", "classSection"]), margin + 137, 125, 35);
  drawLabelValue(doc, "Father / Guardian", getReceiptValue(receipt, ["fatherName", "parentName"]), margin + 12, 137, 62);
  drawLabelValue(doc, "Address", getReceiptValue(receipt, ["address"], schoolAddress), margin + 83, 137, 89);

  const tableX = margin + 7;
  const tableY = 151;
  const tableWidth = width - 14;
  const numberWidth = 12;
  const amountWidth = 32;
  const feeWidth = tableWidth - numberWidth - amountWidth;
  drawSectionTitle(doc, "Fee Particulars", tableX, tableY, tableWidth);
  doc.setFillColor(...COLORS.teal);
  doc.rect(tableX, tableY + 7, tableWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.white);
  doc.text("NO.", tableX + 4, tableY + 12.2);
  doc.text("PARTICULARS", tableX + numberWidth + 4, tableY + 12.2);
  doc.text("AMOUNT", tableX + tableWidth - 4, tableY + 12.2, { align: "right" });

  let rowY = tableY + 15;
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 251, 253);
      doc.rect(tableX, rowY, tableWidth, 8, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.ink);
    doc.text(String(index + 1), tableX + 4, rowY + 5.2);
    doc.text(doc.splitTextToSize(`${feeLabel(item.feeType)}${item.billingType ? ` · ${feeLabel(item.billingType)}` : ""}`, feeWidth - 6), tableX + numberWidth + 4, rowY + 5.2);
    doc.text(money(item.amount), tableX + tableWidth - 4, rowY + 5.2, { align: "right" });
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(tableX, rowY + 8, tableX + tableWidth, rowY + 8);
    rowY += 8;
  });
  if (!items.length) rowY += 8;
  doc.setDrawColor(...COLORS.line);
  doc.rect(tableX, tableY + 7, tableWidth, rowY - tableY - 7, "S");

  const totalsY = Math.max(rowY + 7, 196);
  const totalsX = pageWidth - margin - 78;
  const totalsWidth = 71;
  doc.setDrawColor(...COLORS.line);
  doc.roundedRect(totalsX, totalsY, totalsWidth, 31, 2, 2, "S");
  const totalRow = (label, value, y, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 9 : 7.5);
    doc.setTextColor(...(bold ? COLORS.navy : COLORS.muted));
    doc.text(label, totalsX + 5, y);
    doc.text(money(value), totalsX + totalsWidth - 5, y, { align: "right" });
  };
  totalRow("Fee Amount", subtotal, totalsY + 7);
  totalRow("Additional Charges", charges, totalsY + 14);
  totalRow("GST / Tax", gst, totalsY + 21);
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(totalsX + 4, totalsY + 24, totalsX + totalsWidth - 4, totalsY + 24);
  totalRow("NET PAID", total, totalsY + 29, true);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Amount in words: ${amountInWords(total)}`, margin + 7, totalsY + 8);

  const footerY = 247;
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.3);
  doc.line(margin + 7, footerY, pageWidth - margin - 7, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.muted);
  doc.text("Thank you for your payment. Please retain this receipt for your records.", margin + 7, footerY + 7);
  doc.text(`Generated on ${new Date().toLocaleString("en-GB")}`, pageWidth - margin - 7, footerY + 7, { align: "right" });

  const principalName = getSchoolValue(school, ["principalName", "directorName"], "Principal / Director");
  if (signature) addImageContain(doc, signature, pageWidth - margin - 53, footerY + 9, 42, 15);
  doc.setDrawColor(...COLORS.ink);
  doc.line(pageWidth - margin - 53, footerY + 25, pageWidth - margin - 7, footerY + 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.ink);
  doc.text(principalName, pageWidth - margin - 30, footerY + 30, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.muted);
  doc.text("Authorized Signature", pageWidth - margin - 30, footerY + 34, { align: "center" });
};

const renderCardSlip = (doc, data) => {
  const { receipt, school, logo, signature } = data;
  const width = 80;
  const schoolName = getSchoolValue(school, ["schoolName", "name"], "School Name");
  const schoolAddress = getSchoolValue(school, ["address", "schoolAddress"], "Address");
  const items = Array.isArray(receipt?.items) ? receipt.items : [];
  const subtotal = items.reduce((sum, item) => sum + number(item.amount), 0);
  const charges = number(receipt?.charges);
  const gst = number(receipt?.gstAmount ?? receipt?.gstAmountValue);
  const total = number(receipt?.netAmount ?? receipt?.totalAmount ?? subtotal + charges + gst);
  const height = Math.max(215, 190 + items.length * 13);
  const x = 4;
  const center = width / 2;
  const line = (y) => {
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.25);
    doc.line(x, y, width - x, y);
  };

  doc.setFillColor(...COLORS.white);
  doc.rect(0, 0, width, height, "F");
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.35);
  doc.roundedRect(3, 6, 74, 34, 3, 3, "S");
  addImageContain(doc, logo, 7, 11, 18, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.navy);
  doc.text(doc.splitTextToSize(schoolName, 47), 29, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(...COLORS.muted);
  doc.text(doc.splitTextToSize(schoolAddress, 47), 29, 27);
  doc.setFillColor(...COLORS.teal);
  doc.roundedRect(3, 44, 74, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text("CARD PAYMENT RECEIPT", center, 50, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("CUSTOMER COPY", center, 55, { align: "center" });

  const receiptNumber = getReceiptValue(receipt, ["transactionId", "receiptNo", "receiptNumber"]);
  const mode = formatPaymentMode(getReceiptValue(receipt, ["paymentMode", "paymentMethod", "mode"], "Card"));
  const details = [
    ["Receipt", receiptNumber],
    ["Date", getReceiptValue(receipt, ["transactionDate", "paymentDate"])],
    ["Student", getReceiptValue(receipt, ["studentName", "name"])],
    ["Admission", getReceiptValue(receipt, ["rollNo", "admissionNo", "admissionNumber"])],
    ["Class", getReceiptValue(receipt, ["className", "class", "classSection"])],
    ["Mode", mode],
  ];
  let y = 66;
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(...COLORS.muted);
    doc.text(label, x, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.ink);
    doc.text(doc.splitTextToSize(text(value), width - 28), width - x, y, { align: "right" });
    y += 7;
  });
  line(y - 3);
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(...COLORS.muted);
  doc.text("PARTICULAR", x, y);
  doc.text("AMOUNT", width - x, y, { align: "right" });
  y += 5;
  items.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...COLORS.ink);
    const itemLines = doc.splitTextToSize(feeLabel(item.feeType), 47);
    doc.text(itemLines, x, y);
    doc.text(money(item.amount), width - x, y, { align: "right" });
    y += Math.max(9, itemLines.length * 4 + 5);
  });
  line(y - 3);
  y += 5;
  const summary = [["Subtotal", subtotal], ["GST / Tax", gst], ["Charges", charges]];
  summary.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.muted);
    doc.text(label, x, y);
    doc.text(money(value), width - x, y, { align: "right" });
    y += 7;
  });
  doc.setFillColor(...COLORS.navy);
  doc.roundedRect(x, y - 2, width - x * 2, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text("TOTAL PAID", x + 4, y + 6);
  doc.text(money(total), width - x - 4, y + 6, { align: "right" });
  y += 21;
  if (signature) addImageContain(doc, signature, center - 14, y, 28, 10);
  doc.setDrawColor(...COLORS.ink);
  doc.line(center - 22, y + 12, center + 22, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(...COLORS.muted);
  doc.text("Authorized Signature", center, y + 17, { align: "center" });
  doc.text("Thank you for your payment", center, y + 28, { align: "center" });
  doc.text("Computer generated · No signature required", center, y + 34, { align: "center" });
};

const createDocument = async (receipt, school, variant) => {
  const data = await prepareReceiptData(receipt, school);
  const doc = variant === "card"
    ? new jsPDF({ orientation: "portrait", unit: "mm", format: [80, Math.max(215, 190 + (receipt?.items?.length || 0) * 13)] })
    : new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  if (variant === "card") renderCardSlip(doc, data);
  else renderNormalReceipt(doc, data);
  return doc;
};

const printDocument = (doc) => {
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
    }, 700);
  };
  document.body.appendChild(printFrame);
};

const fileName = (receipt, suffix) =>
  `${suffix}_${text(getReceiptValue(receipt, ["transactionId", "receiptNo", "receiptNumber"]), "receipt").replace(/[^a-z0-9_-]+/gi, "_")}.pdf`;

export const generatePaymentReceiptPdf = async (receipt, school) => {
  const doc = await createDocument(receipt, school, "normal");
  doc.save(fileName(receipt, "Payment_Receipt"));
};

export const printPaymentReceiptPdf = async (receipt, school) => {
  printDocument(await createDocument(receipt, school, "normal"));
};

export const generateCardPaymentSlipPdf = async (receipt, school) => {
  const doc = await createDocument(receipt, school, "card");
  doc.save(fileName(receipt, "Card_Payment_Slip"));
};

export const printCardPaymentSlipPdf = async (receipt, school) => {
  printDocument(await createDocument(receipt, school, "card"));
};
