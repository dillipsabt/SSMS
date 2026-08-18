import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Pagination from "../../components/common/Pagination";
import useToastMessage from "../../utils/useToastMessage";
import { isAdditionalExamSubject } from "../../utils/examSubjectUtils";
import {
  fetchAcademicYears,
  fetchClasses,
  fetchSubjects,
  fetchExaminationTypes,
  fetchStudentsByClass,
  createExamResult,
  clearSuccess,
  clearError,
} from "../../features/teacher/ExamResults/examResultsSlice";


const TeacherAddExamResults = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    academicYearId: "",
    classId: "",
    subjectId: "",
    examTypeId: "",
  });

  const [studentMarks, setStudentMarks] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const {
    academicYears,
    classes,
    subjects,
    examinationTypes,
    studentsByClass,
    loading,
    error,
    success,
  } = useSelector((state) => state.teacherExamResults);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchExaminationTypes());
  }, [dispatch]);

  useToastMessage({
    success,
    error,
    successMessage: "Exam result saved successfully!",
    clearSuccess,
    clearError,
  });

  const toArray = (value) =>
    Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];
  const academicYearOptions = toArray(academicYears);
  const classOptions = toArray(classes);
  const subjectOptions = toArray(subjects);
  const examinationTypeOptions = toArray(examinationTypes);
  const normalizeStudents = toArray(studentsByClass).map((student, index) => ({
    id: student.studentId || student.id,
    sNo: index + 1,
    admissionNumber: student.admissionNumber,
    studentName: student.studentName || student.name,
  }));

  const filteredStudents = normalizeStudents.filter((student) =>
    `${student.studentName} ${student.admissionNumber}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const selectedSubject = subjectOptions.find(
    (subject) => String(subject.id) === String(formData.subjectId),
  );
  const isAdditionalSubject = isAdditionalExamSubject(selectedSubject);

  const calculateGradeAndStatus = (percentage) => {
    const percent = parseFloat(percentage) || 0;
    let grade = "";
    let status = "";

    if (percent >= 90) {
      grade = "A+";
      status = "Pass";
    } else if (percent >= 80) {
      grade = "A";
      status = "Pass";
    } else if (percent >= 70) {
      grade = "B+";
      status = "Pass";
    } else if (percent >= 60) {
      grade = "B";
      status = "Pass";
    } else if (percent >= 50) {
      grade = "C";
      status = "Pass";
    } else if (percent >= 40) {
      grade = "D";
      status = "Pass";
    } else {
      grade = "F";
      status = "Fail";
    }

    return { grade, status };
  };


  const handleMarksChange = (studentId, field, value) => {
    const updatedMarks = {
      ...studentMarks[studentId],
      [field]: value,
    };

    if (isAdditionalSubject) {
      updatedMarks.percentage = "";
      updatedMarks.grade = "";
      updatedMarks.status = "";
    } else if (field === "obtainedMarks" || field === "totalMarks") {
      const obtainedMarks = Number(updatedMarks.obtainedMarks);
      const totalMarks = Number(updatedMarks.totalMarks);

      if (
        updatedMarks.obtainedMarks === "" ||
        updatedMarks.totalMarks === "" ||
        !Number.isFinite(obtainedMarks) ||
        !Number.isFinite(totalMarks) ||
        obtainedMarks < 0 ||
        totalMarks <= 0 ||
        obtainedMarks > totalMarks
      ) {
        updatedMarks.percentage = "";
        updatedMarks.grade = "";
        updatedMarks.status = "";
      } else {
        const percentage = (obtainedMarks / totalMarks) * 100;
        const { grade, status } = calculateGradeAndStatus(percentage);
        updatedMarks.percentage = Number(percentage.toFixed(2));
        updatedMarks.grade = grade;
        updatedMarks.status = status;
      }
    }

    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: updatedMarks,
    }));
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };


  const handleSubmitFinal = async () => {
    if (
      !formData.academicYearId ||
      !formData.classId ||
      !formData.subjectId ||
      !formData.examTypeId
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const examResultRequestDTOS = [];

    for (const student of filteredStudents) {
      if (studentMarks[student.id]) {
        const marks = studentMarks[student.id];
        const hasObtainedMarks = marks.obtainedMarks !== "" && marks.obtainedMarks !== undefined;
        const hasTotalMarks = marks.totalMarks !== "" && marks.totalMarks !== undefined;

        if (hasObtainedMarks || hasTotalMarks) {
          const obtainedMarks = Number(marks.obtainedMarks);
          const totalMarks = Number(marks.totalMarks);

          if (
            !hasObtainedMarks ||
            !hasTotalMarks ||
            !Number.isFinite(obtainedMarks) ||
            !Number.isFinite(totalMarks) ||
            obtainedMarks < 0 ||
            totalMarks <= 0 ||
            obtainedMarks > totalMarks
          ) {
            toast.error("Enter valid obtained and total marks for every student.");
            return;
          }

          examResultRequestDTOS.push({
            academicYearId: parseInt(
              formData.academicYearId
            ),

            classId: parseInt(formData.classId),

            subjectId: parseInt(formData.subjectId),

            examTypeId: parseInt(formData.examTypeId),

            studentId: parseInt(student.id),

            obtainedMarks,

            totalMarks,

            examDate: new Date()
              .toISOString()
              .split("T")[0],

            remarks: marks.remarks || "",
          });
        }
      }
    }

    if (examResultRequestDTOS.length === 0) {
      toast.error("Please enter student marks!");
      return;
    }

    const payload = {
      examResultRequestDTOS,
    };

    const resultAction = await dispatch(
      createExamResult(payload)
    );

    if (createExamResult.fulfilled.match(resultAction)) {
      toast.success(
        "All exam results submitted successfully!"
      );

      setFormData({
        academicYearId: "",
        classId: "",
        subjectId: "",
        examTypeId: "",
      });

      setStudentMarks({});

      setSearchQuery("");

      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-white px-3">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800">Add Exam Results</h1>
      <p className="text-sm text-gray-500 mb-6">Teacher / Add Exam Results</p>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-6">
          Exam Results
        </h2>

        {/* Form Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="form-label">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.academicYearId}
              onChange={(event) => setFormData({ ...formData, academicYearId: event.target.value })}
              className="form-select"
            >
              <option value="">Select Academic Year</option>
              {academicYearOptions.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year || year.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              Class / Section <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.classId}
              onChange={(event) => {
                const value = event.target.value;
                setFormData({ ...formData, classId: value });
                setStudentMarks({});
                setCurrentPage(1);
                if (value) dispatch(fetchStudentsByClass(value));
              }}
              className="form-select"
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.classCode || cls.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subjectId}
              onChange={(event) => {
                const subjectId = event.target.value;
                const subject = subjectOptions.find((item) => String(item.id) === String(subjectId));
                const additionalSubject = isAdditionalExamSubject(subject);
                setFormData((current) => ({ ...current, subjectId }));
                if (additionalSubject) {
                  setStudentMarks((current) =>
                    Object.fromEntries(
                      Object.entries(current).map(([studentId, marks]) => [
                        studentId,
                        { ...marks, percentage: "", grade: "", status: "" },
                      ]),
                    ),
                  );
                }
              }}
              className="form-select"
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName || subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.examTypeId}
              onChange={(event) => setFormData({ ...formData, examTypeId: event.target.value })}
              className="form-select"
            >
              <option value="">Select Exam Type</option>
              {examinationTypeOptions.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.examType || exam.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Upload Button */}
          {/* <div className="mb-6">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Upload size={16} />
              Bulk UploadSheet
            </button>
          </div> */}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Student / Roll Number"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Results Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[1180px] w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[64px]" />
              <col className="w-[132px]" />
              <col className="w-[172px]" />
              <col className="w-[124px]" />
              <col className="w-[132px]" />
              <col className="w-[132px]" />
              <col className="w-[140px]" />
              <col className="w-[140px]" />
              <col className="w-[180px]" />
            </colgroup>
            <thead className="bg-indigo-50 border-b border-indigo-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  S.No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Admission Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Total Marks
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Obtained Marks
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Percentage (%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold leading-tight text-gray-700">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 align-middle text-center text-gray-800">
                    {student.sNo}
                  </td>
                  <td className="px-4 py-3 align-left text-gray-800">
                    {student.admissionNumber}
                  </td>
                  <td className="px-4 py-3 align-middle text-gray-800">
                    {student.studentName}
                  </td>
                  <td className="px-4 py-3 align-left">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={studentMarks[student.id]?.totalMarks ?? ""}
                      onChange={(e) =>
                        handleMarksChange(
                          student.id,
                          "totalMarks",
                          e.target.value
                        )
                      }
                      className="table-input min-w-[96px] text-left"
                      placeholder=""
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={studentMarks[student.id]?.obtainedMarks ?? ""}
                      onChange={(e) =>
                        handleMarksChange(
                          student.id,
                          "obtainedMarks",
                          e.target.value
                        )
                      }
                      className="table-input min-w-[96px] text-left"
                      placeholder=""
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {isAdditionalSubject ? (
                      <span className="text-xs font-medium text-gray-400">N/A</span>
                    ) : (
                      <input
                        type="number"
                        value={studentMarks[student.id]?.percentage ?? ""}
                        readOnly
                        className="table-input min-w-[96px] text-left"
                        placeholder=""
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {isAdditionalSubject ? (
                      <span className="text-xs font-medium text-gray-400">N/A</span>
                    ) : (
                      <select
                        value={studentMarks[student.id]?.grade || ""}
                        onChange={(e) =>
                          handleMarksChange(student.id, "grade", e.target.value)
                        }
                        disabled={!!studentMarks[student.id]?.percentage}
                        className={`form-select min-w-[112px] text-xs ${studentMarks[student.id]?.percentage
                          ? "bg-gray-100 cursor-not-allowed opacity-60"
                          : ""
                          }`}
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {isAdditionalSubject ? (
                      <span className="text-xs font-medium text-gray-400">N/A</span>
                    ) : (
                      <select
                        value={studentMarks[student.id]?.status || ""}
                        onChange={(e) =>
                          handleMarksChange(student.id, "status", e.target.value)
                        }
                        disabled={!!studentMarks[student.id]?.percentage}
                        className={`form-select min-w-[112px] text-xs ${studentMarks[student.id]?.percentage
                          ? "bg-gray-100 cursor-not-allowed opacity-60"
                          : ""
                          }`}
                      >
                        <option value="">Select</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="text"
                      value={studentMarks[student.id]?.remarks || ""}
                      onChange={(e) =>
                        handleMarksChange(student.id, "remarks", e.target.value)
                      }
                      className="table-input min-w-[150px]"
                      placeholder=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4 mb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmitFinal}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
          >
            <span>Submit Final</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-blue-600 text-white p-4">
              <h2 className="text-lg font-semibold">Bulk Upload</h2>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Bulk Upload Sheet
              </label>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center mb-6 bg-blue-50">
                <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors mb-2">
                  Choose File
                </button>
                <p className="text-sm text-gray-500">No choose file</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Upload size={16} />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAddExamResults;
