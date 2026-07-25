// ===============================================
// FILE: src/components/Teacher/RaiseRequest.jsx
// ===============================================

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSubjectsAsync,
  fetchClassesAsync,
  fetchTimeSlotsAsync,
  createTeacherTimetableRequestAsync,
  fetchTeacherTimetableAsync,
} from "../../features/teacher/timetable/teacherTimetableSlice";
import { toast } from "sonner";

const RaiseRequest = ({ open, onClose, teacherId }) => {
  const dispatch = useDispatch();

  const { subjects, classes, timeSlots, loading } = useSelector(
    (state) => state.teacherTimetable
  );

  const [formData, setFormData] = useState({
    subjectId: "",
    classId: "",
    date: "",
    time: "",
    comments: "",
  });

  // =========================
  // FETCH SUBJECTS & CLASSES
  // =========================
  useEffect(() => {
    if (open) {
      dispatch(fetchSubjectsAsync());
      dispatch(fetchClassesAsync());
      dispatch(fetchTimeSlotsAsync());
    }
  }, [dispatch, open]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    // formData.time already contains the slot ID from dropdown
    const slotId = Number(formData.time || 0);

    const payload = {
      teacherId: Number(teacherId),
      date: formData.date,
      slotId: slotId,
      requestedSlotId: slotId,
      newSubjectId: Number(formData.subjectId || 0),
      newClassId: Number(formData.classId || 0),
      reason: formData.comments,
    };

    const result = await dispatch(
      createTeacherTimetableRequestAsync(payload)
    );

    // SUCCESS
    if (createTeacherTimetableRequestAsync.fulfilled.match(result)) {
      toast.success(
        result.payload?.message || "Request submitted successfully"
      );

      dispatch(fetchTeacherTimetableAsync(Number(teacherId)));

      onClose();

      setFormData({
        subjectId: "",
        classId: "",
        date: "",
        time: "",
        comments: "",
      });
    }

    // ERROR
    if (createTeacherTimetableRequestAsync.rejected.match(result)) {
      toast.error(
        result.payload?.message ||
        result.payload ||
        result.error?.message ||
        "Something went wrong"
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] sm:w-[380px] rounded-lg shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Raise Request</h2>
          <X onClick={onClose} className="cursor-pointer w-5 h-5" />
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 text-sm">
          {/* SUBJECT */}
          <div>
            <label className="block text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Subject</option>
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name || subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          {/* CLASS */}
          <div>
            <label className="block text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Class</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name || cls.classCode}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* TIME */}
          <div>
            <label className="block text-gray-700 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">--:--</option>
              {timeSlots?.map((slot, index) => {
                const slotValue = slot.id || slot.slotId || slot.timeSlotId;
                return (
                  <option key={slotValue || index} value={slotValue}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                );
              })}
            </select>
          </div>

          {/* COMMENTS */}
          <div>
            <label className="block text-gray-700 mb-1">
              Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Write here"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded text-sm hover:bg-indigo-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseRequest;
