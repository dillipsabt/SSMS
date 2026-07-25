import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Printer, X } from "lucide-react";
import { getSchoolDetailsAsync } from "../../features/Admin/TransferCertificate/transferCertificateSlice";

const TransferCertificatePreview = ({ initialData, onClose }) => {
  const printRef = useRef();
  const dispatch = useDispatch();
  const { schoolDetails } = useSelector((state) => state.transferCertificate);

  useEffect(() => {
    dispatch(getSchoolDetailsAsync());
  }, [dispatch]);

  const certificateData = initialData || {
    studentName: "",
    fatherName: "",
    admissionNo: "",
    classSection: "",
    dateOfBirth: "",
    dateOfLeaving: "",
    reasonForLeaving: "",
    dateOfIssue: "",
    schoolName: "",
  };

  // Check if schoolDetails is wrapped in an Axios data object or raw
  const details = schoolDetails?.data || schoolDetails;

  const displayData = {
    studentName: certificateData.studentName,
    fatherName: certificateData.fatherName,
    admissionNo: certificateData.admissionNo,
    class: certificateData.classSection,
    dob: certificateData.dateOfBirth,
    dateOfLeaving: certificateData.dateOfLeaving,
    reasonForLeaving: certificateData.reasonForLeaving,
    dateOfIssue: certificateData.dateOfIssue,
    schoolName: details?.schoolName || certificateData.schoolName || "",
    // FIXED: Using backend's exact property name 'schoolLogoUrl'
    logo: details?.schoolLogoUrl || null,
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=800,width=1000");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transfer Certificate</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background: white;
          }
          .certificate {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 2px solid #333;
            text-align: center;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 20px;
          }
          .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          .school-details {
            text-align: center;
          }
          .school-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .address {
            font-size: 12px;
            color: #333;
            margin-bottom: 3px;
          }
          .recognition {
            font-size: 11px;
            color: #555;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            margin: 30px 0 20px 0;
            letter-spacing: 1px;
          }
          .content {
            text-align: left;
            font-size: 14px;
            line-height: 2.2;
            margin: 30px 0;
          }
          .line-content {
            margin: 15px 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }
          .label {
            font-weight: normal;
            margin-right: 5px;
          }
          .value {
            border-bottom: 1px solid #333;
            padding: 0 10px;
            text-align: center;
            min-width: 100px;
          }
          .flex-1 {
            flex: 1;
          }
          .footer-container {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature-block {
            text-align: center;
          }
          .signature-line {
            border-bottom: 1px solid #333;
            width: 150px;
            margin: 0 auto 5px;
            height: 60px;
          }
          .signature-text {
            font-size: 12px;
            font-weight: bold;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .certificate {
              border: none;
              box-shadow: none;
              margin: 0;
              padding: 40px;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="header-container">
              ${
                displayData.logo
                  ? `<img src="${displayData.logo}" alt="School Logo" class="logo" />`
                  : ""
              }
              <div class="school-details">
                <div class="school-name">${displayData.schoolName}</div>
                <div class="address">${details?.address || "Near Botanical Gardens, Gachibowli, Hyderabad - 5000038"}</div>
                <div class="recognition">School ID: ${details?.instituteId || "1982765"}</div>
                <div class="recognition">Affiliation No: ${details?.affiliationNo || "270394789"}</div>
              </div>
            </div>
          </div>

          <div class="title">TRANSFER CERTIFICATE</div>

          <div class="content">
            <div class="line-content">
              <span class="label">This is to certify that</span>
              <div class="value flex-1">${displayData.studentName}</div>
            </div>

            <div class="line-content">
              <span class="label">Student's Name</span>
              <div class="value flex-1">${displayData.studentName}</div>
            </div>

            <div class="line-content">
              <span class="label">son/daughter of</span>
              <div class="value flex-1">${displayData.fatherName}</div>
            </div>

            <div class="line-content">
              <span class="label">with Admission Number</span>
              <div class="value" style="min-width: 150px;">${displayData.admissionNo}</div>
              <span class="label" style="margin-left: 10px;">Studied in Class & Section</span>
              <div class="value" style="min-width: 80px;">${displayData.class}</div>
            </div>

            <div class="line-content">
              <span class="label">born on</span>
              <div class="value" style="min-width: 150px;">${displayData.dob}</div>
              <span class="label" style="margin-left: 10px;">and is leaving the school on</span>
              <div class="value" style="min-width: 150px;">${displayData.dateOfLeaving}</div>
            </div>

            <div class="line-content">
              <span class="label">Reason for Leaving</span>
              <div class="value flex-1">${displayData.reasonForLeaving}</div>
            </div>

            <div class="footer-container">
              <div>
                <span class="label">Date of Issue</span>
                <div class="value" style="min-width: 120px; margin-top: 5px;">${displayData.dateOfIssue}</div>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-text">Principal Signature<br/>(School Seal)</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Transfer Certificate Preview
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-gray-700 p-2 rounded-md transition duration-150 ease-in-out"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Preview UI Panel */}
        <div ref={printRef} className="p-8 bg-gray-50 flex justify-center">
          <div className="w-full max-w-2xl border-2 border-gray-400 p-12 bg-white shadow-sm font-sans text-gray-900">
            {/* Header */}
            <div className="text-center mb-8 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                {displayData.logo && (
                  <img
                    src={displayData.logo}
                    alt="School Logo"
                    className="w-26 h-26 object-contain"
                  />
                )}
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase tracking-wide">
                    {displayData.schoolName}
                  </h2>
                  <p className="text-xs text-gray-600 max-w-md">
                    {details?.address ||
                      "123 Main Road, Hyderabad, Telangana, India"}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <p>
                  (Recognized by Directorate of Education) School ID No.{" "}
                  {details?.instituteId || "SIS2026"}
                </p>
                <p>
                  (Affiliated {details?.schoolType || "C.B.S.E"}) Affiliation
                  No. {details?.affiliationNo || "270394789"}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-8 tracking-widest border-b-2 border-double border-gray-800 pb-2">
              TRANSFER CERTIFICATE
            </h1>

            {/* Content */}
            <div className="text-sm space-y-5 leading-relaxed">
              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  This is to certify that
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.studentName}
                </div>
              </div>

              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  Student's Name
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.studentName}
                </div>
              </div>

              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  son/daughter of
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.fatherName}
                </div>
              </div>

              <div className="flex gap-2 items-baseline flex-wrap">
                <span className="whitespace-nowrap text-gray-600">
                  with Admission Number
                </span>
                <div className="w-40 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.admissionNo}
                </div>
                <span className="whitespace-nowrap text-gray-600">
                  Studied in Class & Section
                </span>
                <div className="w-24 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.class}
                </div>
              </div>

              <div className="flex gap-2 items-baseline flex-wrap">
                <span className="whitespace-nowrap text-gray-600">born on</span>
                <div className="w-40 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.dob}
                </div>
                <span className="whitespace-nowrap text-gray-600">
                  and is leaving the school on
                </span>
                <div className="w-40 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.dateOfLeaving}
                </div>
              </div>

              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  Reason for Leaving
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.reasonForLeaving}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-20 px-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Date of Issue</p>
                <div className="w-32 border-b border-gray-800 text-center text-sm font-semibold pb-1">
                  {displayData.dateOfIssue}
                </div>
              </div>

              <div className="text-center">
                <div className="w-40 h-14 border-b border-gray-400 mb-2"></div>
                <p className="text-xs font-bold text-gray-800">
                  Principal Signature
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  (School Seal)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCertificatePreview;
