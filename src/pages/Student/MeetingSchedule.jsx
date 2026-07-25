import React from "react";
import {
  CalendarDays,
  Clock3,
} from "lucide-react";

const meetings = [
  {
    id: 1,
    title: "Quantaum Mechanics",
    subject: "Physics",
    teacher: "Rani",
    date: "30-06-2026",
    time: "09:00 AM",
  },
  {
    id: 2,
    title: "Prefix and Suffix",
    subject: "Hindi",
    teacher: "Satish",
    date: "30-06-2026",
    time: "10:00 AM",
  },
  {
    id: 3,
    title: "Padyabhagam",
    subject: "Telugu",
    teacher: "Lakshman",
    date: "30-06-2026",
    time: "11:00 AM",
  },
  {
    id: 4,
    title: "Matrix",
    subject: "Maths",
    teacher: "Rani",
    date: "30-06-2026",
    time: "12:00 PM",
  },
  {
    id: 5,
    title: "Active and passive",
    subject: "English",
    teacher: "Rani",
    date: "30-06-2026",
    time: "02:00 PM",
  },
  {
    id: 6,
    title: "Physical Features of India",
    subject: "Social",
    teacher: "Satish",
    date: "30-06-2026",
    time: "03:00 PM",
  },
];

export default function MeetingSchedule() {
  return (
    <div className="min-h-screen bg-white p-2">

      {/* Header */}

      <div className="mb-2">

        <h1 className="text-2xl font-semibold text-[#222]">
          Meeting Schedule
        </h1>

        <p className="text-sm text-[#777] mt-1">
          Home / LMS / Meeting Schedule
        </p>

      </div>

      {/* Card Container */}

      <div className="bg-white rounded-xl border border-[#E5E7EB]">

        <div className="border-b border-gray-300 px-6 py-4">

         <h2 className="text-sm font-semibold text-[#333]">
Meeting Schedule List
</h2>

        </div>

        <div className="p-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {meetings.map((meeting) => (
  <div
    key={meeting.id}
    className="
      bg-white
      border
      border-[#E5E7EB]
      rounded-md
      shadow-sm
      hover:shadow-md
      transition-all
      duration-300
      p-4
      w-full
    "
  >
    {/* Title */}

    <h3 className="text-[18px] font-bold text-[#333] leading-6">
      {meeting.title}
    </h3>

    {/* Subject */}

    <p className="text-sm text-[#6B7280] mt-1">
      {meeting.subject}
    </p>

    {/* Professor */}

    <p className="text-xs text-[#444] font-semibold mt-1">
      Professor {meeting.teacher}
    </p>

    {/* Date */}

    <div className="flex items-center justify-between mt-5">

      <div className="flex items-center gap-2">

        <CalendarDays
          size={15}
          strokeWidth={1.8}
          className="text-[#555]"
        />

        <span className="text-[14px] text-[#444]">
          Schedule Date
        </span>

      </div>

      <span className="text-[14px] text-[#444] font-normal">
        {meeting.date}
      </span>

    </div>

    {/* Time */}

    <div className="flex items-center justify-between mt-3">

      <div className="flex items-center gap-2">

        <Clock3
          size={15}
          strokeWidth={2}
          className="text-[#555]"
        />

        <span className="text-[14px] text-[#444]">
          Joining Time
        </span>

      </div>

      <span className="text-[14px] text-[#444]">
        {meeting.time}
      </span>

    </div>

    {/* Join Button */}

    <button
      className="
        w-full
        h-[42px]
        mt-6
        rounded
        bg-[#4F37F5]
        hover:bg-[#432EEA]
        text-white
        text-[16px]
        font-medium
        shadow
        transition-all
      "
    >
      Join
    </button>

  </div>
))}

          </div>

        </div>

      </div>

    </div>
  );
}