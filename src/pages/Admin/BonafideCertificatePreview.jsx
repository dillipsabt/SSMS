import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Printer, X } from "lucide-react";
import { getSchoolDetailsAsync } from "../../features/Admin/TransferCertificate/transferCertificateSlice";

const BonafideCertificatePreview = ({ initialData, onClose }) => {
  const printRef = useRef();
  const dispatch = useDispatch();
  const { schoolDetails } = useSelector((state) => state.transferCertificate);

  useEffect(() => {
    dispatch(getSchoolDetailsAsync());
  }, [dispatch]);

  const certificateData = initialData || {
    studentName: "N Harish",
    fatherName: "N Venkatesh",
    admissionNo: "0918100",
    class: "10-A",
    year: "2009",
    schoolName: "Sri Chaitanya E-Techno School",
    dateOfIssue: "06-09-2009",
  };

  const details = schoolDetails?.data || schoolDetails;

  const displayData = {
    schoolName: details?.schoolName || certificateData.schoolName || "",
    logo: details?.schoolLogoUrl || null,
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=800,width=1000");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bonafide Certificate</title>
        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            background: white;
            display: flex;
            justify-content: center;
          }
          .certificate {
            width: 100%;
            max-width: 750px;
            padding: 30px;
            border: 2px solid #333;
            background: white;
          }
          .header-container {
            display: table;
            width: 100%;
            margin-bottom: 20px;
          }
          .logo-cell {
            display: table-cell;
            vertical-align: middle;
            width: 90px;
            padding-right: 15px;
          }
          .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          .school-details-cell {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
          }
          .school-name {
            font-size: 22px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .address {
            font-size: 12px;
            color: #333;
            margin-bottom: 4px;
          }
          .recognition {
            font-size: 11px;
            color: #555;
            margin-bottom: 2px;
          }
          .title {
            font-size: 26px;
            font-weight: bold;
            text-align: center;
            margin: 25px 0 10px 0;
            letter-spacing: 2px;
            border-bottom: 2px double #333;
            padding-bottom: 5px;
          }
          .subtitle {
            font-size: 12px;
            text-align: center;
            margin-bottom: 30px;
            color: #555;
            font-weight: bold;
          }
          .content {
            font-size: 14px;
            line-height: 2.5;
            margin: 20px 0;
          }
          .line-content {
            margin: 12px 0;
            width: 100%;
            clear: both;
          }
          .label {
            float: left;
            color: #333;
            padding-right: 5px;
          }
          .value {
            border-bottom: 1px dashed #333;
            font-weight: bold;
            text-align: center;
            padding: 0 5px;
          }
          .flex-fill {
            overflow: hidden;
            display: block;
          }
          .inline-block {
            display: inline-block;
          }
          .footer-container {
            margin-top: 50px;
            width: 100%;
            display: table;
          }
          .footer-left {
            display: table-cell;
            vertical-align: bottom;
            width: 50%;
            text-align: left;
          }
          .footer-right {
            display: table-cell;
            vertical-align: bottom;
            width: 50%;
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid #333;
            width: 160px;
            margin: 0 auto 5px auto;
          }
          .signature-text {
            font-size: 12px;
            font-weight: bold;
          }
          @media print {
            body { padding: 0; }
            .certificate { border: 2px solid #333; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header-container">
            ${
              displayData.logo
                ? `<div class="logo-cell"><img src="${displayData.logo}" id="logoImg" alt="School Logo" class="logo" /></div>`
                : ""
            }
            <div class="school-details-cell">
              <div class="school-name">${displayData.schoolName}</div>
              <div class="address">${details?.address || "123 Main Road, Hyderabad, Telangana, India"}</div>
              <div class="recognition">(Recognized by Directorate of Education) School ID: ${details?.instituteId || "SIS2026"}</div>
              <div class="recognition">(Affiliated ${details?.schoolType || "C.B.S.E"}) Affiliation No: ${details?.affiliationNo || "270394789"}</div>
            </div>
          </div>

          <div class="title">BONAFIDE CERTIFICATE</div>
          <div class="subtitle">ACADEMIC YEAR - ${certificateData.year ? `${certificateData.year} - ${parseInt(certificateData.year) + 1}` : "20__ - 20__"}</div>

          <div class="content">
            <div class="line-content">
              <span class="label">This is to certify that Mr./Ms</span>
              <span class="flex-fill value">${certificateData.studentName}</span>
            </div>
            
            <div class="line-content">
              <span class="label">S/o / D/o / Mr./Mrs</span>
              <span class="flex-fill value">${certificateData.fatherName}</span>
            </div>
            
            <div class="line-content">
              <span class="label">Registration/Admission number</span>
              <span class="value inline-block" style="width: 250px;">${certificateData.admissionNo}</span>
              <span class="label" style="margin-left: 10px;">is a student of class</span>
              <span class="value inline-block" style="width: 100px;">${certificateData.class}</span>
            </div>
            
            <div class="line-content">
              <span class="label">He/She is a Bonafide student of</span>
              <span class="flex-fill value">${displayData.schoolName}</span>
            </div>

            <div class="footer-container">
              <div class="footer-left">
                <span class="label">Date of Issue:</span>
                <span class="value inline-block" style="width: 120px;">${certificateData.dateOfIssue}</span>
              </div>
              <div class="footer-right">
                <div class="signature-line"></div>
                <div class="signature-text">Principal Signature<br/><span style="font-size:10px; font-weight:normal; color:#555;">(School Seal)</span></div>
              </div>
            </div>
          </div>
        </div>

        <script>
          const img = document.getElementById('logoImg');
          if (img && !img.complete) {
            img.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          } else {
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Bonafide Certificate Preview
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

        {/* Certificate Preview UI */}
        <div ref={printRef} className="p-8 bg-gray-50 flex justify-center">
          <div className="w-full max-w-2xl border-2 border-gray-400 p-12 bg-white shadow-sm font-sans text-gray-900">
            {/* Header Structure */}
            <div className="text-center mb-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                {displayData.logo && (
                  <img
                    src={displayData.logo}
                    alt="School Logo"
                    className="w-16 h-16 object-contain"
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

            <h1 className="text-2xl font-bold text-center mb-1 tracking-widest border-b-2 border-double border-gray-800 pb-1">
              BONAFIDE CERTIFICATE
            </h1>
            <p className="text-center text-xs text-gray-600 font-semibold mb-8">
              ACADEMIC YEAR -{" "}
              {certificateData.year
                ? `${certificateData.year} - ${parseInt(certificateData.year) + 1}`
                : "20__ - 20__"}
            </p>

            {/* Content Text fields */}
            <div className="text-sm space-y-5 leading-relaxed">
              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  This is to certify that Mr./Ms
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {certificateData.studentName}
                </div>
              </div>

              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  S/o / D/o / Mr./Mrs
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {certificateData.fatherName}
                </div>
              </div>

              <div className="flex gap-2 items-baseline flex-wrap">
                <span className="whitespace-nowrap text-gray-600">
                  Registration/Admission number
                </span>
                <div className="w-56 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {certificateData.admissionNo}
                </div>
                <span className="whitespace-nowrap text-gray-600">
                  is a student of class
                </span>
                <div className="w-24 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {certificateData.class}
                </div>
              </div>

              <div className="flex gap-2 items-baseline">
                <span className="whitespace-nowrap text-gray-600">
                  He/She is a Bonafide student of
                </span>
                <div className="flex-1 border-b border-dashed border-gray-800 text-center font-semibold px-2">
                  {displayData.schoolName}
                </div>
              </div>
            </div>

            {/* Footer Container */}
            <div className="flex justify-between items-end mt-20 px-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Date of Issue</p>
                <div className="w-32 border-b border-gray-800 text-center text-sm font-semibold pb-1">
                  {certificateData.dateOfIssue}
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

export default BonafideCertificatePreview;
