import React from "react";
import { useSelector } from "react-redux";
import hallticket_image from "../../assets/hallticket_image.jpg";

// ---------------------------------------------------------------------------
// Hall Ticket — standalone printable component
// Pass a `student` object to customize; sensible defaults match the sample.
// ---------------------------------------------------------------------------

const defaultStudent = {
  name: "Rani",
  hallTicketNo: "HT2026001",
  classSection: "10-A",
  dob: "14 May 2008",
  photoUrl: hallticket_image,
};

const formatExamDate = (value) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

const defaultSchedule = [
  { date: "12-06-2026", time: "09:00 AM - 12:00 PM", subject: "Telugu" },
  { date: "13-06-2026", time: "09:00 AM - 12:00 PM", subject: "Hindi" },
  { date: "14-06-2026", time: "09:00 AM - 12:00 PM", subject: "English" },
  { date: "17-06-2026", time: "09:00 AM - 12:00 PM", subject: "Maths" },
  { date: "19-06-2026", time: "09:00 AM - 12:00 PM", subject: "Science" },
  { date: "20-06-2026", time: "09:00 AM - 12:00 PM", subject: "Social" },
];

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
      <path d="M12 2 1 7l11 5 9-4.09V17h2V7L12 2zM5 13.18v4.18C5 19.5 8.13 21 12 21s7-1.5 7-3.64v-4.18L12 17l-7-3.82z" />
    </svg>
  );
}

function SignatureSquiggle() {
  return (
    <svg viewBox="0 0 90 40" className="ml-auto h-9 w-24 text-gray-600">
      <path
        d="M4 30 Q 14 8, 22 24 T 38 20 Q 44 10, 50 24 T 66 18 Q 72 8, 78 22 T 86 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhotoPlaceholder() {
  return (
    <svg viewBox="0 0 80 96" className="h-full w-full">
      <rect width="80" height="96" fill="#f3f4f6" />
      <circle cx="40" cy="36" r="16" fill="#d1d5db" />
      <path d="M8 90c4-20 20-28 32-28s28 8 32 28" fill="#d1d5db" />
    </svg>
  );
}

export default function HallTicket({
  school = {
    name: "ST. XAVIER'S INTERNATIONAL ACADEMY",
    address: "Main Campus, Education Square, Sector 45-B",
    examTitle: "HALL TICKET - QUARTERLY EXAMINATION 2026-27",
  },
  student = defaultStudent,
  schedule = defaultSchedule,
  printableRef,
}) {
  const details = useSelector((state) => state.hallTicket?.hallTicketDetails);
  const resolvedSchool = details
    ? {
        name: details.schoolName || school.name,
        address: details.schoolAddress || school.address,
        examTitle:
          [details.examType, details.academicYear].filter(Boolean).join(" - ") ||
          school.examTitle,
      }
    : school;
  const resolvedStudent = details
    ? {
        name: details.studentName || defaultStudent.name,
        hallTicketNo: details.hallTicketNo || defaultStudent.hallTicketNo,
        classSection: details.classSection || defaultStudent.classSection,
        dob: details.dateOfBirth || defaultStudent.dob,
        fatherName: details.fatherName || "-",
        rollNo: details.rollNo || "-",
        photoUrl: details.studentPhoto || defaultStudent.photoUrl,
      }
    : student;
  const resolvedSchedule = details
    ? (details.schedules || details.examSchedule || details.examSchedules || details.schedule || []).map((row, index) => ({
        number: index + 1,
        date: formatExamDate(row.examDate || row.date),
        time:
          [row.startTime, row.endTime].filter(Boolean).join(" - ") ||
          row.time ||
          "-",
        subject: row.subjectName || row.subject || "-",
      }))
    : schedule.map((row, index) => ({ ...row, number: index + 1 }));

  return (
    <div className="min-h-screen w-full bg-gray-100 py-8 font-sans antialiased">
      <div ref={printableRef} data-pdf-capture="true" className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 border-t-8 border-t-indigo-950 bg-white text-slate-900 shadow-xl">
        <div className="grid grid-cols-[185px_1fr_130px] items-center gap-6 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex h-28 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 p-2">
            {details?.schoolLogo ? (
              <img crossOrigin="anonymous" src={details.schoolLogo} alt={resolvedSchool.name} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-indigo-950"><CapIcon /></div>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{resolvedSchool.name}</h1>
            <p className="mt-1 text-sm leading-5 text-slate-500">{resolvedSchool.address}</p>
            <p className="mt-2 text-xl font-bold text-indigo-950">{resolvedSchool.examTitle}</p>
          </div>
          <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl border border-slate-300 bg-slate-100 p-1">
            {resolvedStudent.photoUrl ? <img crossOrigin="anonymous" src={resolvedStudent.photoUrl} alt={resolvedStudent.name} className="h-full w-full object-cover" /> : <PhotoPlaceholder />}
          </div>
        </div>

        <div className="border-b border-indigo-900 bg-indigo-950 py-3 text-center text-xl font-bold tracking-wide text-white">Hall Ticket</div>

        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-base">
          <div className="space-y-3 border-r border-slate-200 p-5">
            <p><span>Name</span><span className="mx-5">:</span>{resolvedStudent.name}</p>
            <p><span>Father Name</span><span className="mx-5">:</span>{resolvedStudent.fatherName || "-"}</p>
            <p><span>Roll No.</span><span className="mx-5">:</span>{resolvedStudent.rollNo || "-"}</p>
          </div>
          <div className="space-y-3 p-5">
            <p><span>Class</span><span className="mx-5">:</span>{resolvedStudent.classSection}</p>
            <p><span>Hall Ticket</span><span className="mx-5">:</span>{resolvedStudent.hallTicketNo}</p>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-white px-5 pb-2 pt-5 text-xs font-bold uppercase tracking-widest text-indigo-950">Examination Schedule</div>
        <div className="grid grid-cols-3">
          {resolvedSchedule.map((row, index) => (
            <div key={`${row.number}-${row.date}-${row.subject}`} className={`border-b border-slate-200 bg-white px-4 py-4 text-base ${index % 3 !== 2 ? "border-r border-slate-200" : ""}`}>
              {row.subject} <span className="mx-1">-</span> {row.date}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_240px] gap-8 bg-white p-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-950">Notes:</p>
            <div className="min-h-20 rounded-lg border border-slate-200 bg-slate-50 p-3 text-base text-slate-700">{details?.notes || "-"}</div>
          </div>
          <div className="flex flex-col items-center justify-end pb-1 text-center">
            {details?.principalSignature ? <img crossOrigin="anonymous" src={details.principalSignature} alt="Principal signature" className="mb-2 h-16 max-w-48 object-contain" /> : <SignatureSquiggle />}
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-950">Principal Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
