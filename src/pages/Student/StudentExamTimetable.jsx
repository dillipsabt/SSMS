import React from "react";
import { Calendar, Clock } from "lucide-react";
import student from "../../assets/student.png";

const StudentExamTimetable = () => {
  const examInfo = {
    title: "Exam Timetable",
    startDate: "04 Apr, 2026",
    academicYear: "2026-27",
  };

  const midTermExams = [
    {
      subject: "Telugu",
      date: "26 Apr, 2026",
      time: "10:00 AM - 12:00 PM",
    },
    {
      subject: "Hindi",
      date: "27 Apr, 2026",
      time: "10:00 AM - 12:00 PM",
    },
    {
      subject: "English",
      date: "28 Apr, 2026",
      time: "10:00 AM - 12:00 PM",
    },
    {
      subject: "Maths",
      date: "30 Apr, 2026",
      time: "10:00 AM - 12:00 PM",
    },
    {
      subject: "Science",
      date: "01 Apr, 2026",
      time: "10:00 AM - 12:00 PM",
    },
    {
      subject: "Social",
      date: "02 May, 2026",
      time: "10:00 AM - 12:00 PM",
    },
  ];

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">Exam Timetable</h1>
      <p className="text-sm text-gray-500 mb-6">Home / Exams</p>

      {/* MAIN CONTAINER */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {/* BANNER */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-t-md p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">{examInfo.title}</h2>
            <p className="text-indigo-100 text-sm">
              Start Exams: {examInfo.startDate}
            </p>
            <p className="text-indigo-100 text-sm">
              Academic Year: {examInfo.academicYear}
            </p>
          </div>
          
          {/* Decorative Image */}
          <div className="absolute right-4 bottom-0 hidden sm:block">
            <img
              src={student}
              alt="Student"
              className="h-32 object-contain"
            />
          </div>
        </div>

        <div className="p-6">
          {/* SECTION TITLE */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mid Term Exams</h3>

          {/* EXAM CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {midTermExams.map((exam, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-gray-800 text-lg mb-3">{exam.subject}</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{exam.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>{exam.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExamTimetable;
