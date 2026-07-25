import React from "react";
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
}) {
  return (
    <div className="min-h-screen w-full bg-gray-100 py-8 font-sans antialiased">
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm  ">
        {/* School header */}
        <div className="flex justify-center border-b border-gray-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gray-900">
              <CapIcon />
            </div>

            <div className="text-left">
              <p className="text-lg font-bold tracking-tight text-gray-900">
                {school.name}
              </p>

              <p className="text-xs text-gray-500">{school.address}</p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {school.examTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Candidate details */}
        <div className="flex gap-5 border-b border-gray-800 py-5">
          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
                Candidate Name
              </p>
              <p className="text-base font-bold text-gray-900">
                {student.name.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
                Class / Section
              </p>
              <p className="text-base font-semibold text-gray-800">
                {student.classSection}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
                Hall Ticket
              </p>
              <p className="text-base font-semibold text-gray-800">
                {student.hallTicketNo}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
                Date of Birth
              </p>
              <p className="text-base font-semibold text-gray-800">
                {student.dob}
              </p>
            </div>
          </div>
        </div>

        {/* Examination schedule */}
        <div className="pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-800">
            Examination Schedule
          </p>
          <table className="w-full border-collapse overflow-hidden rounded-md">
            <thead>
              <tr className="bg-gray-200 text-black ">
                <th className="px-5 py-2.5 text-left text-black text-[11px] font-semibold uppercase tracking-wide ">
                  Date
                </th>
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide ">
                  Time
                </th>
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide ">
                  Subject Title
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr
                  key={row.date}
                  className={i % 2 === 0 ? "bg-white" : "bg-blue-50/60"}
                >
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {row.date}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {row.time}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {row.subject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-8 border-t border-dashed border-gray-300 pt-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-8 text-xs font-bold uppercase tracking-wide text-gray-800">
                Candidate Declaration
              </p>
              <div className="w-48 border-t border-gray-400 pt-1">
                <p className="text-[11px] italic text-gray-400">
                  Sign above in the presence of Invigilator
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-800">
                Authorized Controller
              </p>
              <SignatureSquiggle />
              <p className="text-[11px] font-medium text-gray-500">
                Office of Examinations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
