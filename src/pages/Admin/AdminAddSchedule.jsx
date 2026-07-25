import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";
import { toast } from "sonner";
import {
  addTimetable,
  editTimetable,
  fetchClasses,
  fetchTimeSlots,
  getSubjectsAsync,
} from "../../features/Admin/teacherTimetable/teacherTimetableSlice";
import { getTeachers } from "../../features/Admin/Teacher/teacherServiceApi";
import { getAdminTimetables } from "../../features/Admin/teacherTimetable/teacherTimetableAPI";

// Helper to format time from API response
// Handles both object format {hour, minute} and string format "HH:MM:SS"
const formatTime = (timeVal) => {
  if (!timeVal) return "";

  let hour = 0;
  let minute = 0;

  // Check if it's a string like "09:45:00"
  if (typeof timeVal === "string") {
    const parts = timeVal.split(":");
    hour = parseInt(parts[0], 10) || 0;
    minute = parseInt(parts[1], 10) || 0;
  }
  // Check if it's an object like {hour: 9, minute: 45}
  else if (typeof timeVal === "object") {
    hour = timeVal.hour || 0;
    minute = timeVal.minute || 0;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const minStr = minute.toString().padStart(2, "0");
  return `${hour12.toString().padStart(2, "0")}:${minStr}${period}`;
};

// Format time slot display
const formatTimeSlot = (slot) => {
  if (!slot) return "";
  return `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
};

export default function AdminAddSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes, timeSlots, subjects } = useSelector(
    (state) => state.timetable
  );
  const { id } = useParams();

  const query = new URLSearchParams(window.location.search);
  const teacherIdFromQuery = query.get("teacherId");
  const dateFromQuery = query.get("date");

  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  // Load teachers
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await getTeachers();
        setTeachers(res.data || []);
      } catch (e) {
        console.error("TEACHER LOAD ERROR", e);
      }
    };
    loadTeachers();
  }, []);

  // Load classes and time slots
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTimeSlots());
    dispatch(getSubjectsAsync());
  }, [dispatch]);

  // Initialize slots when timeSlots are loaded
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0 && slots.length === 0) {
      const periodSlots = timeSlots.filter((s) => s.slotType === "PERIOD");
      const initialSlots = periodSlots.map((slot) => ({
        id: 0,
        timeSlotId: slot.id,
        subjectId: 0,
        subjectName: "",
        classId: "",
        className: "",
        section: "",
        timeDisplay: formatTimeSlot(slot),
      }));
      setSlots(initialSlots);
    }
  }, [timeSlots, slots.length]);

  // Set teacher and date from query params
  useEffect(() => {
    if (teacherIdFromQuery) {
      setTeacherId(teacherIdFromQuery);
    }
    if (dateFromQuery) {
      setDate(dateFromQuery);
    }
  }, [teacherIdFromQuery, dateFromQuery]);

  // Edit mode - load existing timetable
  useEffect(() => {
    if (!teacherIdFromQuery || !dateFromQuery) return;

    const fetchData = async () => {
      try {
        const res = await getAdminTimetables(
          Number(teacherIdFromQuery),
          dateFromQuery
        );

        const data =
          res?.data?.teacherTimetableList?.[0];
        if (!data) return;

        setTeacherId(data.teacherId || teacherIdFromQuery);
        setDate(
          data.scheduledDate ||
          dateFromQuery
        );

        const apiSlots = data.slots || [];

        // Map API slots to our format
        if (timeSlots && timeSlots.length > 0) {
          const periodSlots = timeSlots.filter((s) => s.slotType === "PERIOD");
          const merged = periodSlots.map((slot) => {
            const found = apiSlots.find((s) => s.timeSlotId === slot.id);
            return {
              id: found?.id || 0,
              timeSlotId: slot.id,
              subjectId: found?.subjectId || 0,
              subjectName: found?.subjectName || "",
              classId: found?.classId || "",
              className: found?.className || "",
              section: found?.section || "",
              timeDisplay: formatTimeSlot(slot),
            };
          });
          setSlots(merged);
        }
      } catch (error) {
        console.error("EDIT LOAD ERROR", error);
        toast.error("Failed to load timetable");
      }
    };

    if (timeSlots && timeSlots.length > 0) {
      fetchData();
    }
  }, [teacherIdFromQuery, dateFromQuery, timeSlots, subjects]);

  const handleChange = (index, field, value) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async () => {
    if (!teacherId || !date) {
      toast.error("Teacher & Date required");
      return;
    }

    const filteredSlots = slots.filter(
      (s) => s.subjectName && s.className
    );

    const formattedSlots = filteredSlots.map((s) => ({
      id: s.id || 0,
      timeSlotId: s.timeSlotId,
      subjectId: Number(s.subjectId),
      subjectName: s.subjectName,
      classId: Number(s.classId),
      className: s.className,
    }));

    const payload = {
      teacherId: Number(teacherId),
      date,
      slots: formattedSlots,
    };

    try {
      if (id) {
        await dispatch(editTimetable({ id, payload })).unwrap();
        toast.success("Timetable updated successfully");
      } else {
        await dispatch(addTimetable(payload)).unwrap();
        toast.success("Timetable added successfully");
      }

      navigate("/teacher-timetable");
    } catch (e) {
      console.error("SAVE ERROR", e);
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  // Separate PERIOD slots and BREAK slots for display
  const allSlots = timeSlots || [];
  const periodSlots = allSlots.filter((s) => s.slotType === "PERIOD");
  const breakSlots = allSlots.filter((s) => s.slotType !== "PERIOD");

  // Build display order mixing periods and breaks by time
  const buildDisplayOrder = () => {
    const display = [];
    let periodIndex = 0;

    // Sort all slots by start time
    const sortedAll = [...allSlots].sort((a, b) => {
      const aTime = (a.startTime?.hour || 0) * 60 + (a.startTime?.minute || 0);
      const bTime = (b.startTime?.hour || 0) * 60 + (b.startTime?.minute || 0);
      return aTime - bTime;
    });

    sortedAll.forEach((slot) => {
      if (slot.slotType === "PERIOD") {
        display.push({
          type: "period",
          slot,
          periodIndex: periodIndex++,
        });
      } else {
        display.push({
          type: "break",
          slot,
          label: slot.slotType === "LUNCH" ? "Lunch Break" : "Interval",
        });
      }
    });

    return display;
  };

  const displayOrder = buildDisplayOrder();

  return (
    <div>
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Add Class Schedule
      </h2>
      <p className="text-[12px] text-gray-500 mb-4">
        Teacher / Teachers Timetable
      </p>

      {/* CARD */}
      <div className="card">
        <div className="card-section">Add Class Schedule</div>

        <div className="p-4">
          {/* TOP FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-[12px]">
            <div>
              <label className="block mb-1 text-gray-600">
                Teacher Name <span className="text-red-500">*</span>
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="form-select"
              >
                <option value="">Select</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || t.fullName || `Teacher ${t.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-600">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="border border-gray-300 rounded overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="thead-row">
                <tr>
                  <th className="px-3 py-2 text-left w-[170px] font-medium">
                    Timings
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Subject</th>
                  <th className="px-3 py-2 text-left font-medium">Class</th>
                  <th className="px-3 py-2 text-left font-medium">Section</th>
                </tr>
              </thead>

              <tbody>
                {displayOrder.map((item, idx) => {
                  if (item.type === "break") {
                    return (
                      <tr key={`break-${idx}`} className="border-t bg-gray-50">
                        <td className="px-3 py-2 text-gray-500 font-medium">
                          {formatTimeSlot(item.slot)}
                        </td>
                        <td
                          colSpan="3"
                          className="px-3 py-2 text-center text-red-500 font-semibold tracking-wide"
                        >
                          {item.label}
                        </td>
                      </tr>
                    );
                  }

                  const slotIndex = item.periodIndex;
                  const s = slots[slotIndex] || {
                    subjectName: "",
                    className: "",
                    section: "",
                  };

                  return (
                    <tr
                      key={`period-${idx}`}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-gray-700 font-medium whitespace-nowrap">
                        {formatTimeSlot(item.slot)}
                      </td>

                      {/* Subject dropdown */}
                      <td className="px-3 py-2">
                        <select
                          value={s.subjectId || ""}
                          onChange={(e) => {
                            const selected = subjects.find(
                              (sub) => sub.id === Number(e.target.value)
                            );

                            handleChange(
                              slotIndex,
                              "subjectId",
                              selected?.id || 0
                            );

                            handleChange(
                              slotIndex,
                              "subjectName",
                              selected?.subjectName || ""
                            );
                          }}
                          className="table-input"
                        >
                          <option value="">Select</option>

                          {Array.isArray(subjects) &&
                            subjects.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.subjectName}
                              </option>
                            ))}
                        </select>
                      </td>

                      {/* Class */}
                      <td className="px-3 py-2">
                        <select
                          value={s.classId || ""}
                          onChange={(e) => {
                            const selected = classes.find(
                              (c) => c.id === Number(e.target.value)
                            );
                            handleChange(slotIndex, "classId", selected?.id || "");
                            handleChange(
                              slotIndex,
                              "className",
                              selected?.className || ""
                            );
                            handleChange(
                              slotIndex,
                              "section",
                              selected?.section || ""
                            );
                          }}
                          className="table-input"
                        >
                          <option value="">Select</option>
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.className} {c.section && `- ${c.section}`}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Section */}
                      <td className="px-3 py-2">
                        <input
                          value={s.section}
                          onChange={(e) =>
                            handleChange(slotIndex, "section", e.target.value)
                          }
                          className="table-input"
                          placeholder="e.g. A"
                        />
                      </td>
                    </tr>
                  );
                })}

                {displayOrder.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 py-8 text-center text-gray-500">
                      Loading time slots...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded text-sm transition"
            >
              <FaRegSave size={14} />
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
