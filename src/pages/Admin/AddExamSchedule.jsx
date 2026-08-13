import { useEffect, useMemo, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  clearExamDetails,
  createExamSchedule,
  fetchAcademicYears,
  fetchClasses,
  fetchExamSchedule,
  fetchExaminationTypes,
  fetchSubjects,
  updateExamScheduleAsync,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";

const emptyRow = () => ({
  subjectId: "",
  examDate: "",
  startTime: "",
  endTime: "",
  maxMarks: "",
  passMarks: "",
});

const getId = (item) => item?.id ?? item?.subjectId ?? "";

const getName = (item) => item?.subjectName || item?.name || item?.title || "-";

const toTimeString = (value) => {
  const [hour = 0, minute = 0, second = 0] = String(value || "00:00")
    .split(":")
    .map(Number);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0",
  )}:${String(second).padStart(2, "0")}`;
};

const fromTimeObject = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 5);
  return `${String(value.hour ?? 0).padStart(2, "0")}:${String(
    value.minute ?? 0,
  ).padStart(2, "0")}`;
};

export default function AddExamSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const {
    academicYears = [],
    examinationTypes = [],
    classes = [],
    subjects = [],
    examDetails,
    loading,
  } = useSelector((state) => state.examSchedule || {});

  const [form, setForm] = useState({
    academicYearId: "",
    examinationTypeId: "",
    classRoomId: "",
  });
  const [rows, setRows] = useState([emptyRow()]);

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchExaminationTypes());
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    if (id) dispatch(fetchExamSchedule(id));
    return () => dispatch(clearExamDetails());
  }, [dispatch, id]);

  useEffect(() => {
    if (!examDetails || String(examDetails.id) !== String(id)) return;
    // Hydrate the controlled form after the detail request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      academicYearId: String(examDetails.academicYearId ?? ""),
      examinationTypeId: String(examDetails.examinationTypeId ?? ""),
      classRoomId: String(examDetails.classId ?? examDetails.classRoomId ?? ""),
    });
    setRows(
      (examDetails.schedules || []).map((schedule) => ({
        subjectId: String(schedule.subjectId ?? ""),
        examDate: schedule.examDate || "",
        startTime: fromTimeObject(schedule.startTime),
        endTime: fromTimeObject(schedule.endTime),
        maxMarks: String(schedule.maxMarks ?? ""),
        passMarks: String(schedule.passMarks ?? ""),
      })),
    );
  }, [examDetails, id]);

  const subjectOptions = useMemo(() => subjects || [], [subjects]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateRow = (index, field, value) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const validate = () => {
    if (!form.academicYearId || !form.examinationTypeId || !form.classRoomId) {
      return "Please complete the exam information";
    }
    if (!rows.length) return "Add at least one subject schedule";

    const subjectIds = rows.map((row) => row.subjectId);
    if (subjectIds.some((subjectId) => !subjectId)) return "Subject is required";
    if (new Set(subjectIds).size !== subjectIds.length) {
      return "Duplicate subjects are not allowed";
    }

    for (const row of rows) {
      if (!row.examDate || !row.startTime || !row.endTime) {
        return "Date, start time, and end time are required";
      }
      if (row.startTime >= row.endTime) return "Start time must be before end time";
      if (row.maxMarks === "" || row.passMarks === "") {
        return "Max marks and pass marks are required";
      }
      if (Number(row.passMarks) > Number(row.maxMarks)) {
        return "Pass marks cannot exceed max marks";
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      academicYearId: Number(form.academicYearId),
      examinationTypeId: Number(form.examinationTypeId),
      classRoomId: Number(form.classRoomId),
      schedules: rows.map((row) => ({
        subjectId: Number(row.subjectId),
        examDate: row.examDate,
        startTime: toTimeString(row.startTime),
        endTime: toTimeString(row.endTime),
        maxMarks: Number(row.maxMarks),
        passMarks: Number(row.passMarks),
      })),
    };

    try {
      if (isEditing) {
        await dispatch(updateExamScheduleAsync({ id, data: payload })).unwrap();
      } else {
        await dispatch(createExamSchedule(payload)).unwrap();
      }
      toast.success(isEditing ? "Exam schedule updated successfully" : "Exam schedule created successfully");
      navigate("/exam-schedule-list");
    } catch (error) {
      toast.error(error?.message || "Unable to save exam schedule");
    }
  };

  return (
    <div className="page-wrap p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg sm:text-[24px] font-bold text-gray-800">
          {isEditing ? "Edit Exam Schedule" : "Add Exam Schedule"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Exam &amp; Results / {isEditing ? "Edit" : "Add"} Exam Schedule
        </p>
      </div>

      <div className="space-y-5">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-violet-600">
            <h3 className="text-white text-sm sm:text-[16px] font-semibold">Exam Information</h3>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
            {[
              ["academicYearId", "Academic Year", academicYears, (item) => item.year || item.academicYear, (item) => item.id || item.academicYearId],
              ["examinationTypeId", "Examination Type", examinationTypes, (item) => item.examType || item.examinationType, (item) => item.id || item.examTypeId],
              ["classRoomId", "Class", classes, (item) => item.classCode || item.name || item.className, (item) => item.id || item.classId],
            ].map(([name, label, options, labelOf, valueOf]) => (
              <label key={name} className="block text-xs sm:text-[13px] font-semibold text-gray-700">
                {label}<span className="text-red-500 ml-1">*</span>
                <select name={name} value={form[name]} onChange={updateForm} className="mt-2 w-full h-[44px] border border-gray-300 rounded-xl px-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition">
                  <option value="">Select {label}</option>
                  {options.map((item) => <option key={valueOf(item)} value={valueOf(item)}>{labelOf(item)}</option>)}
                </select>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between gap-3">
            <h3 className="text-gray-800 text-sm sm:text-[16px] font-semibold">Exam Schedule</h3>
            <button type="button" onClick={() => setRows((current) => [...current, emptyRow()])} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
              <Plus size={15} /> Add Subject
            </button>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-3 rounded-xl border border-gray-200 p-3">
                {[
                  ["subjectId", "Subject", "select"],
                  ["examDate", "Exam Date", "date"],
                  ["startTime", "Start Time", "time"],
                  ["endTime", "End Time", "time"],
                  ["maxMarks", "Max Marks", "number"],
                  ["passMarks", "Pass Marks", "number"],
                ].map(([field, label, type]) => (
                  <label key={field} className="text-xs font-semibold text-gray-700">
                    {label}<span className="text-red-500 ml-1">*</span>
                    {type === "select" ? (
                      <select value={row[field]} onChange={(event) => updateRow(index, field, event.target.value)} className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-2 text-sm font-normal focus:border-indigo-500 focus:outline-none">
                        <option value="">Select Subject</option>
                        {subjectOptions.map((subject) => <option key={getId(subject)} value={getId(subject)}>{getName(subject)}</option>)}
                      </select>
                    ) : (
                      <input type={type} min={type === "number" ? 0 : undefined} value={row[field]} onChange={(event) => updateRow(index, field, event.target.value)} className="mt-1 w-full h-10 rounded-lg border border-gray-300 px-2 text-sm font-normal focus:border-indigo-500 focus:outline-none" />
                    )}
                  </label>
                ))}
                <div className="flex items-end">
                  <button type="button" aria-label="Remove subject" disabled={rows.length === 1} onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} className="h-10 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40">
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/exam-schedule-list")} className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-50">
                <FaRegSave size={15} /> {loading ? "Saving..." : isEditing ? "Update Schedule" : "Save Schedule"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
