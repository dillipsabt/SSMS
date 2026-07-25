import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Clock3 } from "lucide-react";

import examBanner from "../../assets/exam-banner.png";

import { fetchParentExamTimetable } from "../../features/parent/ExamTimetable/parentExamtimetableSlice";

export default function ParentsExamTimetable() {
  const dispatch = useDispatch();

  const { timetableData, isLoading, error } = useSelector(
    (state) => state.parentExamtimetable,
  );

  const selectedStudentId = useSelector(
    (state) => state.parentDashboard.selectedStudentId,
  );

  useEffect(() => {
    if (selectedStudentId) {
      dispatch(fetchParentExamTimetable(selectedStudentId));
    }
  }, [dispatch, selectedStudentId]);

  // useEffect(() => {
  //   if (studentId) {
  //     dispatch(fetchParentExamTimetable(studentId));
  //   }
  // }, [dispatch, studentId]);

  // useEffect(() => {
  //   dispatch(fetchParentExamTimetable(41));
  // }, [dispatch]);

  // const exams = timetableData?.examDetails || [];
  const exams = Array.isArray(timetableData) ? timetableData : [];

  return (
    <div className="w-full px-4 sm:px-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Exam Timetable</h2>
      <p className="text-sm text-gray-500 mb-4">Home / Exams</p>

      {/* BANNER */}
      <div
        className="
          bg-gradient-to-r
          from-[#4F46E5]
          via-[#5B3DF5]
          to-[#7C3AED]
          rounded-lg
          px-2 sm:px-8
          mb-6
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-2
        "
      >
        <div>
          <h3 className="text-white text-2xl font-bold">Exam Timetable</h3>

          <p className="text-purple-100 mt-2">
            {/* Start Exams {timetableData?.startDate || "--"} */}
            Start Exams {exams.length > 0 ? exams[0]?.academicYear : "--"}
          </p>

          <p className="text-purple-100">
            {/* Academic Year {timetableData?.academicYear || "--"} */}
            Academic Year {exams[0]?.academicYear || "--"}
          </p>
        </div>

        <img
          src={examBanner}
          alt="Exam Banner"
          className="w-28 sm:w-36 lg:w-40 object-contain"
        />
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center py-10">
          Loading examination timetable...
        </div>
      )}

      {/* ERROR */}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {/* EXAM SCHEDULE */}
      {!isLoading && !error && (
        <div className="card overflow-hidden">
          <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
            <h3 className="text-[16px] font-semibold text-[#333333]">
              {timetableData?.examTypeName || "Exam Schedule"}
            </h3>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {exams.length > 0 ? (
              exams.map((exam, index) => (
                <div
                  key={index}
                  className="
                    bg-white
                    border border-gray-200
                    rounded-lg
                    p-4
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  <h4 className="font-semibold text-[16px] text-[#333333]">
                    {/* {exam.subjectName} */}
                    {exam.examinationType}
                  </h4>

                  <div className="space-y-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays size={18} className="text-gray-500" />
                      {/* {exam.examDate} */}
                      Academic Year: {exam.academicYear}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock3 size={18} className="text-gray-500" />
                      {/* {exam.startTime} - {exam.endTime} */}
                      Class: {exam.className}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No examination timetable available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
