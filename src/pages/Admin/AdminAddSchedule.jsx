import { useEffect, useMemo, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getTeachers } from "../../features/Admin/Teacher/teacherServiceApi";
import {
  addTimetable,
  editTimetable,
  fetchClasses,
  fetchTimetableDetail,
  getSubjectsAsync,
} from "../../features/Admin/teacherTimetable/teacherTimetableSlice";
import { fetchClassTimingSchedulesAsync } from "../../features/Admin/ClassTimingSchedule/classTimingScheduleSlice";

const timeValue = (time) => {
  if (!time) return "";
  if (typeof time === "string") {
    const value = time.trim();
    const meridiem = value.match(/\b(AM|PM)\b/i)?.[1]?.toUpperCase();
    const timePart = value.match(/\d{1,2}:\d{2}/)?.[0];
    if (!timePart) return value.slice(0, 5);
    if (!meridiem) return timePart;
    let [hour, minute] = timePart.split(":").map(Number);
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }
  return `${String(time.hour ?? 0).padStart(2, "0")}:${String(time.minute ?? 0).padStart(2, "0")}`;
};

const formatTime = (time) => {
  const value = timeValue(time);
  if (!value) return "";
  const [hourText, minute = "00"] = value.split(":");
  const hour = Number(hourText);
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
};

const getTeacherId = (schedule) => {
  if (!schedule) return "";

  return (
    schedule.teacherId ??
    schedule.id ??
    schedule.teacherid ??
    ""
  );
};

const getTeacherName = (teacher) => {
  if (!teacher) return "";

  return (
    teacher.fullName ??
    teacher.name ??
    teacher.teacherName ??
    `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`.trim()
  );
};

export default function AdminAddSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { classes, subjects, selectedSchedule } = useSelector((state) => state.timetable);
  const { schedules: classTimingSchedules } = useSelector((state) => state.classTimingSchedule);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    getTeachers()
      .then((response) => {
        const teacherData =
          response?.data?.data ??
          response?.data?.content ??
          response?.data ??
          [];

        setTeachers(Array.isArray(teacherData) ? teacherData : []);
      })
      .catch(() => {
        toast.error("Unable to load teachers");
        setTeachers([]);
      });
    dispatch(fetchClasses());
    dispatch(fetchClassTimingSchedulesAsync({ page: 0, size: 100 }));
    dispatch(getSubjectsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(fetchTimetableDetail(id));
  }, [dispatch, id]);

  const periodSlots = useMemo(
    () => (classTimingSchedules ?? []).filter((slot) => String(slot.slotType ?? "PERIOD").toUpperCase() === "PERIOD"),
    [classTimingSchedules],
  );

  useEffect(() => {
    if (id || !periodSlots.length || items.length) return undefined;
    const timer = setTimeout(() => {
      setItems(periodSlots.map((slot) => ({
        classTimingScheduleId: slot.id,
        fromTime: timeValue(slot.startTime),
        toTime: timeValue(slot.endTime),
        subjectId: "",
        classId: "",
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, [id, items.length, periodSlots]);

  useEffect(() => {
    if (!selectedSchedule || !id || !periodSlots.length) {
      return undefined;
    }

    const timer = setTimeout(() => {
      const selectedTeacherId = getTeacherId(selectedSchedule);

      setTeacherId(
        selectedTeacherId
          ? String(selectedTeacherId)
          : ""
      );

      setStartDate(selectedSchedule.startDate ?? "");

      setEndDate(
        selectedSchedule.endDate ??
        selectedSchedule.startDate ??
        ""
      );

      const scheduleItems = selectedSchedule.scheduleItems ?? [];

      setItems(
        periodSlots.map((slot) => {
          const existing = scheduleItems.find(
            (item) =>
              String(
                item.classTimingScheduleId ??
                item.timeSlotId ??
                item.timeSlot?.id ??
                item.classTimingSchedule?.id
              ) === String(slot.id)
          );

          return {
            id: existing?.id ?? existing?.teacherScheduleDetailId,

            classTimingScheduleId: slot.id,

            fromTime: timeValue(
              existing?.startTime ??
              existing?.timeSlot?.startTime ??
              existing?.classTimingSchedule?.startTime ??
              slot.startTime
            ),

            toTime: timeValue(
              existing?.endTime ??
              existing?.timeSlot?.endTime ??
              existing?.classTimingSchedule?.endTime ??
              slot.endTime
            ),

            subjectId:
              existing?.subjectId ??
              existing?.subject?.id ??
              "",

            classId:
              existing?.classId ??
              existing?.class?.id ??
              "",
          };
        })
      );
    }, 0);

    return () => clearTimeout(timer);
  }, [id, periodSlots, selectedSchedule]);

  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const updateTime = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      const next = { ...item, [field]: value };
      const matchingSchedule = periodSlots.find((slot) => (
        timeValue(slot.startTime) === next.fromTime && timeValue(slot.endTime) === next.toTime
      ));
      return { ...next, classTimingScheduleId: matchingSchedule?.id ?? "" };
    }));
  };

  const handleSubmit = async () => {
    const scheduleItems = items
      .filter((item) => item.subjectId && item.classId)
      .map((item) => ({
        ...(item.id ? { id: Number(item.id) } : {}),
        classTimingScheduleId: Number(item.classTimingScheduleId),
        subjectId: Number(item.subjectId),
        classId: Number(item.classId),
      }));

    if (!teacherId || !startDate || !endDate) {
      toast.error("Teacher, start date, and end date are required");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date must be on or after the start date");
      return;
    }
    if (!scheduleItems.length) {
      toast.error("Add at least one schedule item");
      return;
    }

    const payload = { teacherId: Number(teacherId), startDate, endDate, scheduleItems };
    try {
      if (id) {
        await dispatch(editTimetable({ id, payload })).unwrap();
        toast.success("Schedule updated successfully");
      } else {
        await dispatch(addTimetable(payload)).unwrap();
        toast.success("Schedule created successfully");
      }
      navigate("/teacher-timetable");
    } catch (error) {
      toast.error(error?.message ?? "Unable to save schedule");
    }
  };

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">{id ? "Edit Class Schedule" : "Add Class Schedule"}</h2>
      <p className="text-[12px] text-gray-500 mb-4">Teacher / Teachers Timetable</p>
      <div className="card">
        <div className="card-section">{id ? "Edit Class Schedule" : "Add Class Schedule"}</div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-[12px]">
            <div>
              <label className="form-label">
                Teacher Name <span className="text-red-500">*</span>
              </label>

              <select
                value={String(teacherId)}
                onChange={(event) => setTeacherId(event.target.value)}
                className="form-select"
              >
                <option value="">Select</option>

                {teachers.map((teacher) => {
                  const currentTeacherId =
                    teacher.id ??
                    teacher.teacherId ??
                    teacher.teacherID;

                  return (
                    <option
                      key={currentTeacherId}
                      value={String(currentTeacherId)}
                    >
                      {getTeacherName(teacher)}
                    </option>
                  );
                })}

                {/* Fallback for edit mode */}
                {id &&
                  teacherId &&
                  !teachers.some((teacher) => {
                    const currentTeacherId =
                      teacher.id ??
                      teacher.teacherId ??
                      teacher.teacherID;

                    return String(currentTeacherId) === String(teacherId);
                  }) && (
                    <option value={String(teacherId)}>
                      {selectedSchedule?.teacherName ??
                        selectedSchedule?.teacher?.fullName ??
                        selectedSchedule?.teacher?.name ??
                        "Selected teacher"}
                    </option>
                  )}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label">Start Date <span className="text-red-500">*</span></label>
                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">End Date <span className="text-red-500">*</span></label>
                <input type="date" min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} className="form-input" />
              </div>
            </div>
          </div>
          <div className="border border-gray-300 rounded overflow-x-auto">
            <table className="w-full min-w-[720px] text-[12px]">
              <thead className="thead-row"><tr><th className="px-3 py-2 text-left">From Time</th><th className="px-3 py-2 text-left">To Time</th><th className="px-3 py-2 text-left">Subject</th><th className="px-3 py-2 text-left">Class/Section</th></tr></thead>
              <tbody>
                {periodSlots.map((slot, index) => {
                  const item = items[index] ?? {};
                  return <tr key={slot.id} className="border-t border-gray-200">
                    <td className="px-3 py-2"><select value={item.fromTime ?? timeValue(slot.startTime)} onChange={(event) => updateTime(index, "fromTime", event.target.value)} className="table-input"><option value="">Select time</option>{periodSlots.map((timeSlot) => <option key={`from-${timeSlot.id}`} value={timeValue(timeSlot.startTime)}>{formatTime(timeSlot.startTime)}</option>)}</select></td>
                    <td className="px-3 py-2"><select value={item.toTime ?? timeValue(slot.endTime)} onChange={(event) => updateTime(index, "toTime", event.target.value)} className="table-input"><option value="">Select time</option>{periodSlots.map((timeSlot) => <option key={`to-${timeSlot.id}`} value={timeValue(timeSlot.endTime)}>{formatTime(timeSlot.endTime)}</option>)}</select></td>
                    <td className="px-3 py-2"><select value={item.subjectId ?? ""} onChange={(event) => updateItem(index, "subjectId", event.target.value)} className="table-input"><option value="">Select</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.subjectName ?? subject.name}</option>)}</select></td>
                    <td className="px-3 py-2"><select value={item.classId ?? ""} onChange={(event) => updateItem(index, "classId", event.target.value)} className="table-input"><option value="">Select</option>{classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.className ?? classItem.name}{classItem.section ? ` - ${classItem.section}` : ""}</option>)}</select></td>
                  </tr>;
                })}
                {!periodSlots.length && <tr><td colSpan="4" className="py-8 text-center text-gray-500">Loading class timings...</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3 mt-4"><button onClick={() => navigate("/teacher-timetable")} className="btn-secondary">Cancel</button><button onClick={handleSubmit} className="btn-primary"><FaRegSave size={14} />{id ? "Update" : "Save Schedule"}</button></div>
        </div>
      </div>
    </div>
  );
}
