import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchAcademicYears,
  fetchClasses,
} from "../../features/Admin/ExamSchedule/examScheduleSlice";
import { fetchBranchesAsync } from "../../features/Admin/Branch/branchSlice";
import {
  clearError,
  clearSuccess,
  fetchHallTicketExaminationTypes,
  generateHallTicketsAsync,
} from "../../features/Admin/HallTicket/hallTicketSlice";

export default function GenerateHallTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    academicYearId: "",
    schoolId: "",
    examId: "",
    classId: "",
    generateDate: "",
  });

  const { academicYears = [], classes = [] } = useSelector(
    (state) => state.examSchedule || {},
  );
  const { examinationTypes = [], loading, success, successMessage, error } = useSelector(
    (state) => state.hallTicket || {},
  );
  const { branches = [] } = useSelector((state) => state.branch || {});
  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchHallTicketExaminationTypes());
    dispatch(fetchBranchesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useToastMessage({
    createSuccess: success,
    createMessage: successMessage,
    error,
    clearSuccess,
    clearError,
    onSuccess: () => navigate("/hall-ticket-list"),
  });

  const inputClass =
    "w-full h-9 rounded border border-gray-300 px-3 text-[13px] focus:outline-none focus:border-gray-400";
  const labelClass = "block text-[12px] font-medium text-gray-700 mb-1";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleGenerate = () => {
    const { academicYearId, schoolId, examId, classId, generateDate } = formData;
    if (!academicYearId || !schoolId || !examId || !classId || !generateDate) {
      return;
    }

    dispatch(
      generateHallTicketsAsync({
        academicYearId: Number(academicYearId),
        schoolId: Number(schoolId),
        examId: Number(examId),
        classId: Number(classId),
        generateDate,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-white p-2">
      <h1 className="text-2xl font-bold text-gray-800">Generate HallTicket</h1>
      <p className="text-[11px] text-gray-500 mt-1 mb-3">
        Home / Hall Ticket / Generate Hall Ticket
      </p>

      <div className="rounded border border-gray-300 shadow-sm bg-white">
        <div className="bg-[#fafafa] border-b border-gray-200 px-3 py-2">
          <h2 className="text-[13px] font-semibold text-gray-700">
            Add Hall Ticket
          </h2>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Academic Year</label>
              <select name="academicYearId" value={formData.academicYearId} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                {academicYears.map((year) => (
                  <option key={year.id || year.academicYearId} value={year.id || year.academicYearId}>
                    {year.year || year.academicYear}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>School Branch</label>
              <select name="schoolId" value={formData.schoolId} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                {branches.map((branch) => (
                  <option key={branch.id || branch.schoolId} value={branch.id || branch.schoolId}>
                    {branch.name || branch.schoolName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Examination Type</label>
              <select name="examId" value={formData.examId} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                {examinationTypes.map((exam) => (
                  <option key={exam.id || exam.examTypeId} value={exam.id || exam.examTypeId}>
                    {exam.examType || exam.examinationType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Class/Section</label>
              <select name="classId" value={formData.classId} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                {classes.map((classItem) => (
                  <option key={classItem.id || classItem.classId} value={classItem.id || classItem.classId}>
                    {classItem.classCode || classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Generate Date</label>
              <div className="relative">
                <input type="date" name="generateDate" value={formData.generateDate} onChange={handleChange} className={`${inputClass} pr-10`} />
                <CalendarDays size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="flex justify-end mt-5">
            <button onClick={handleGenerate} type="button" disabled={loading} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all duration-200 text-white text-[13px] font-medium px-5 py-2 rounded shadow-sm disabled:opacity-50">
              {loading ? "Generating..." : "Generate Hall Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
