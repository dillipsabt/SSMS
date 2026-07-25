import React, { useState } from "react";

import { FiSave } from "react-icons/fi";
import { MdOutlineClear } from "react-icons/md";

export default function AddVirtualClass() {
  const [formData, setFormData] = useState({
    topic: "",
    subject: "",
    unit: "",
    chapter: "",
    section: "",
    teacher: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    meetingUrl: "",
  });

  const inputClass =
    "w-full h-9 border border-gray-300 rounded px-3 text-sm outline-none focus:ring-0 focus:border-gray-400";

  const labelClass = "block text-[12px] font-medium text-gray-700 mb-1";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = () => {
    setFormData({
      topic: "",
      subject: "",
      unit: "",
      chapter: "",
      section: "",
      teacher: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      meetingUrl: "",
    });
  };

  const createMeeting = () => {
    setFormData({
      ...formData,
      meetingUrl:
        "https://meet.google.com/" +
        Math.random().toString(36).substring(2, 12),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-white p-2">
      {/* Page Title & Breadcrumbs (Placed outside the form for clean UI layout) */}
      <h1 className="text-2xl font-bold text-[#2d2d2d]">Add Virtual Class</h1>
      <p className="text-xs text-gray-500 mb-3">
        Home / Learning Management System / Add Virtual Class
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded shadow-sm"
      >
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-4 py-2">
          <h2 className="text-sm font-semibold text-gray-700">
            Create Live Class
          </h2>
        </div>

        {/* Class Details */}
        <div className="m-4 border border-gray-300 rounded-md">
          <div className="bg-[#fafafa] border-b border-gray-200 px-3 py-2 text-[13px] font-semibold text-gray-700">
            Class Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div>
              <label className={labelClass}>Title / Topic Name</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter Topic Name"
              />
            </div>

            <div>
              <label className={labelClass}>Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Unit / Module</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={inputClass}
                placeholder="Unit 1"
              />
            </div>

            <div>
              <label className={labelClass}>Chapter</label>
              <input
                type="text"
                name="chapter"
                value={formData.chapter}
                onChange={handleChange}
                className={inputClass}
                placeholder="Chapter"
              />
            </div>

            <div>
              <label className={labelClass}>Class / Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Class 1 - A">Class 1 - A</option>
                <option value="Class 2 - A">Class 2 - A</option>
                <option value="Class 3 - A">Class 3 - A</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Teacher Name</label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="John">John</option>
                <option value="David">David</option>
                <option value="Rama Krishna">Rama Krishna</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className={labelClass}>Description</label>
              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} h-24 resize-none py-2`}
                placeholder="Enter Description"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className="m-4 border border-gray-300 rounded-md">
          <div className="bg-[#fafafa] border-b border-gray-200 px-3 py-2 text-[13px] font-semibold text-gray-700">
            Schedule & Timing
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Virtual Room Link */}
        <div className="m-4 border border-gray-300 rounded-md">
          <div className="bg-[#fafafa] border-b border-gray-200 px-3 py-2 text-[13px] font-semibold text-gray-700">
            Virtual Room Link
          </div>

          <div className="grid md:grid-cols-3 gap-3 p-3 items-end">
            <div>
              <label className={labelClass}>Meeting URL</label>
              <input
                type="text"
                name="meetingUrl"
                value={formData.meetingUrl}
                onChange={handleChange}
                className={inputClass}
                placeholder="Meeting URL"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={createMeeting}
                className="h-9 w-full rounded bg-[#4f46e5] text-white text-sm hover:bg-[#4338ca]"
              >
                Create a Meeting Link
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 p-3">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 h-8 rounded text-sm"
          >
            <MdOutlineClear />
            Clear
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-3 h-8 rounded text-sm"
          >
            <FiSave />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
