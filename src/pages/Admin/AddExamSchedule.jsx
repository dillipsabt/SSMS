// AddExamSchedule.jsx

import React, { useEffect, useRef, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { UploadCloud, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  fetchAcademicYears,
  fetchExaminationTypes,
  fetchClasses,
  createExamSchedule,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";

export default function AddExamSchedule() {

  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const {
    academicYears = [],
    examinationTypes = [],
    classes = [],
    loading,
  } = useSelector((state) => state.examSchedule || {});

  const [form, setForm] = useState({
    academicYearId: "",
    classId: "",
    examinationTypeId: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchExaminationTypes());
    dispatch(fetchClasses());
  }, [dispatch]);

  // FORM CHANGE
  const handleFormChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FILE CHANGE
  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };

  // SAVE
  const handleSave = async () => {

    try {

      // VALIDATION
      if (
        !form.academicYearId ||
        !form.classId ||
        !form.examinationTypeId
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      if (!file) {
        toast.error("Please upload exam timetable");
        return;
      }

      const formData = new FormData();

      formData.append("timetableFile", file);

      const params = {
        academicYearId: Number(form.academicYearId),
        examinationTypeId: Number(form.examinationTypeId),
        classId: Number(form.classId),
      };

      const response = await dispatch(
        createExamSchedule({
          params,
          formData,
        })
      );

      // ERROR HANDLE
      if (response?.error) {

        const errorMessage =
          response.payload?.message ||
          response.payload ||
          "Failed to add exam schedule";

        toast.error(errorMessage);

        return;
      }

      toast.success("Exam Schedule Added Successfully");

      // RESET
      setForm({
        academicYearId: "",
        classId: "",
        examinationTypeId: "",
      });

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {

      toast.error(
        error?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="page-wrap p-4 sm:p-6">

      {/* HEADER */}
      <div className="mb-5">

        <h2 className="text-lg sm:text-[24px] font-bold text-gray-800">
          Add Exam Schedule
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Exam & Results / Add Exam Schedule
        </p>

      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* TOP BAR */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-violet-600">

          <h3 className="text-white text-sm sm:text-[16px] font-semibold">
            Create Exam Schedule
          </h3>

        </div>

        <div className="p-4 sm:p-6">

          {/* FORM GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">

            {/* ACADEMIC YEAR */}
            <div>

              <label className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-2">
                Academic Year
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="academicYearId"
                value={form.academicYearId}
                onChange={handleFormChange}
                className="w-full h-[44px] border border-gray-300 rounded-xl px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="">
                  Select Academic Year
                </option>

                {academicYears.map((item) => (
                  <option
                    key={item.id || item.academicYearId}
                    value={item.id || item.academicYearId}
                  >
                    {item.year || item.academicYear}
                  </option>
                ))}
              </select>

            </div>

            {/* CLASS */}
            <div>

              <label className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-2">
                Class / Section
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="classId"
                value={form.classId}
                onChange={handleFormChange}
                className="w-full h-[44px] border border-gray-300 rounded-xl px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="">
                  Select Class
                </option>

                {classes.map((item) => (
                  <option
                    key={item.id || item.classId}
                    value={item.id || item.classId}
                  >
                    {item.classCode ||
                      item.name ||
                      "N/A"}
                  </option>
                ))}
              </select>

            </div>

            {/* EXAM TYPE */}
            <div>

              <label className="block text-xs sm:text-[13px] font-semibold text-gray-700 mb-2">
                Exam Type
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="examinationTypeId"
                value={form.examinationTypeId}
                onChange={handleFormChange}
                className="w-full h-[44px] border border-gray-300 rounded-xl px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="">
                  Select Exam Type
                </option>

                {examinationTypes.map((item) => (
                  <option
                    key={item.id || item.examTypeId}
                    value={item.id || item.examTypeId}
                  >
                    {item.examType ||
                      item.examinationType}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* FILE UPLOAD */}
          <div className="mt-6 sm:mt-8">

            <label className="block text-sm sm:text-[14px] font-semibold text-gray-700 mb-3">
              Upload Exam Timetable
            </label>

            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-4 sm:p-6 bg-indigo-50/40">

              <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">

                {/* BUTTON */}
                <label className="inline-flex items-center gap-2 bg-white border border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-600 px-5 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all w-fit shadow-sm">

                  <UploadCloud size={18} />

                  Choose File

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* FILE NAME */}
                <div className="flex items-center gap-2 text-sm text-gray-600 break-all">

                  <FileText size={18} className="text-indigo-500" />

                  {file
                    ? file.name
                    : "No file selected"}

                </div>

              </div>

              <p className="text-xs text-gray-500 mt-3">
                Supported formats:
                PDF, DOC, DOCX, JPG, PNG
              </p>

            </div>

          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end mt-8">

            <button
              onClick={handleSave}
              disabled={loading}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl
                text-sm font-semibold text-white transition-all shadow-md
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] hover:shadow-lg"
                }
              `}
            >

              <FaRegSave size={15} />

              {loading ? "Saving..." : "Save Schedule"}

            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
