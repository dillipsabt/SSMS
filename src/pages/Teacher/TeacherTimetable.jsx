import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  CheckSquare,
  BookOpen,
  Clock,
} from "lucide-react";

import RaiseRequest from "../../components/Teacher/RaiseRequest";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchTeacherTimetableAsync,
} from "../../features/teacher/timetable/teacherTimetableSlice";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TeacherTimetable = () => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [searchText, setSearchText] =
    useState("");

  const [teacherId] = useState(
    localStorage.getItem("profileId") || ""
  );

  const {
    timetable,
    loading,
  } = useSelector(
    (state) => state.teacherTimetable
  );


  // =========================
  // FETCH TIMETABLE
  // =========================
  useEffect(() => {
    if (!teacherId || !selectedDate) return;

    dispatch(
      fetchTeacherTimetableAsync({
        teacherId,
        date: selectedDate,
      })
    );
  }, [
    dispatch,
    teacherId,
    selectedDate,
  ]);

  // =========================
  // HELPER: Get day name from date
  // =========================
  const getDayFromDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(
      `${dateStr}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );
  };

  // =========================
  // HELPER: Format time to 12-hour format
  // =========================
  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "-") return "-";

    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr;
    }

    const parts = timeStr.split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // =========================
  // FILTER DATA
  // =========================
  const filteredSchedule = useMemo(() => {
    if (!timetable?.slots?.length) return [];

    let data = timetable.slots.map((slot) => ({
      id: slot.id,
      date: timetable.date,

      day: getDayFromDate(
        timetable.date
      ),

      className:
        slot.className || "-",

      subjectName:
        slot.subjectName || "-",

      requestedSlotTime: `${formatTime(
        slot.timeSlot?.startTime
      )} - ${formatTime(
        slot.timeSlot?.endTime
      )}`,
    }));

    if (searchText.trim()) {
      data = data.filter((item) =>
        `${item.className}
       ${item.subjectName}
       ${item.requestedSlotTime}`
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
      );
    }

    return data;
  }, [timetable, searchText]);

  const selectedDay =
    selectedDate
      ? getDayFromDate(selectedDate)
      : "";

  return (
    <div className="w-full">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Teachers Timetable
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Teacher / Teachers Timetable
          </p>
        </div>

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded"
        >
          Raise Request
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white border-gray-100 rounded-md shadow-sm">

        {/* HEADER */}
        <div className="border-b border-gray-300 px-2 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Teachers Schedule List
          </h2>

          {loading && (
            <span className="text-xs text-indigo-600 font-medium">
              Loading...
            </span>
          )}
        </div>

        <div className="p-2 mb-4">

          {/* FILTER BAR */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">

            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-gray-800">
                Date:{" "}

                <span className="font-medium">
                  {selectedDate
                    ? `${selectedDate} (${selectedDay})`
                    : "No Date Selected"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">

              <DatePicker
                selected={selectedDate ? new Date(selectedDate) : null}
                onChange={(date) =>
                  setSelectedDate(
                    date.toISOString().split("T")[0]
                  )
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Date"
                className="border border-gray-300 px-2 py-1 text-sm rounded w-full"
                wrapperClassName="w-full sm:w-auto"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
                placeholder="Search"
                className="border border-gray-300 px-2 py-1 text-sm rounded"
              />
            </div>
          </div>

          {/* GRID */}
          <div className="p-4 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 bg-white border border-gray-200 rounded-md">

            {days.map((day, index) => {

              const dayWiseData =
                filteredSchedule.filter(
                  (item) =>
                    item.day === day ||
                    item.dayName === day
                );

              return (
                <div key={index}>

                  {/* DAY TITLE */}
                  <div className="text-[13px] font-semibold text-gray-800 mb-2 leading-4">
                    {day}
                  </div>

                  {/* SLOTS */}
                  <div className="flex flex-col gap-2">

                    {day === "Sunday" ? (
                      <div className="bg-red-50 border-l-4 border-l-red-400 border border-red-100 rounded-md shadow-sm px-3 py-3 min-h-[84px] w-full flex flex-col justify-center">
                        <div className="flex items-center justify-center h-full">
                          <span className="text-sm font-medium text-red-500">
                            Holiday
                          </span>
                        </div>
                      </div>
                    ) : dayWiseData.length > 0 ? (
                      dayWiseData.map((item, i) => (
                        <div
                          key={i}
                          className="bg-white border-l-4 border-l-green-500 border border-gray-200 rounded-md shadow-sm px-3 py-2.5 min-h-[84px] w-full flex flex-col justify-center space-y-1"
                        >
                          {/* CLASS ROW */}
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-500">Class</span>
                            <span className="text-xs font-medium text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                              {item.className || "-"}
                            </span>
                          </div>

                          {/* SUBJECT ROW */}
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-500">Subject</span>
                            <span className="text-xs font-medium text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                              {item.subjectName || "-"}
                            </span>
                          </div>

                          {/* TIME ROW */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-600">
                              {
                                item.requestedSlotTime || "-"
                              }
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-md px-3 py-6 text-center text-xs text-gray-400">
                        No Schedule For Selected Date
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* MODAL */}
      <RaiseRequest
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        teacherId={teacherId}
      />
    </div>
  );
};

export default TeacherTimetable;
