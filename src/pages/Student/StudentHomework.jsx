import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Paperclip } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchStudentHomework,
  submitHomework,
  resetSubmitState,
  clearSuccess,
  clearError,
} from "../../features/student/homework/studentHomeworkSlice";

const StudentHomework = () => {
  const dispatch = useDispatch();
  const { homeworkList, loading, submitLoading, error, success } = useSelector(
    (state) => state.studentHomework
  );
  const { profileId } = useSelector((state) => state.auth);

  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [submittedHomework, setSubmittedHomework] = useState({});

  // Get studentId from Redux (logged-in student)
  const studentId = profileId;

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Show toast on success/error
  useToastMessage({
    success,
    error,
    successMessage: "Homework submitted successfully! ✅",
    clearSuccess,
    clearError,
    onSuccess: () => {
      setSubmittedHomework((prev) => ({
        ...prev,
        ...uploadedFiles,
      }));
      if (studentId) {
        dispatch(fetchStudentHomework(studentId));
      }
    },
  });

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentHomework(studentId));
    }
  }, [dispatch, studentId]);

  const handleFileChange = (e, homeworkId) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [homeworkId]: files,
      }));
    }
  };

  const handleSubmit = (homework) => {
    const files = uploadedFiles[homework.id];

    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const dto = {
      homeworkId: homework.id,
      remarks: "",
    };

    dispatch(
      submitHomework({
        studentId,
        dto,
        files,
      })
    );
  };

  const toggleAssignment = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  // Group homework by date
  const groupedHomework = (homeworkList || []).reduce((acc, item) => {
    const date = item.dueDate || "No Date";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  if (!studentId) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <p className="text-gray-600">Please login to view assignments</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">Assignment / Homework</h1>
      <p className="text-sm text-gray-500 mb-6">Home / Assignment</p>

      {/* MAIN CONTAINER */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {/* SECTION HEADER */}
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-md font-semibold text-gray-700">Assignment</h2>
        </div>

        <div className="p-4">
          {homeworkList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No assignments found</p>
          ) : (
            Object.entries(groupedHomework).map(([date, assignments]) => (
              <div key={date} className="mb-6">
                {/* DATE HEADER */}
                <p className="text-sm text-gray-600 mb-4">{formatDate(date)}</p>

                {/* ASSIGNMENTS ACCORDION */}
                <div className="space-y-2">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-md overflow-hidden">
                      {/* ACCORDION HEADER */}
                      <button
                        onClick={() => toggleAssignment(assignment.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${expandedAssignment === assignment.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {expandedAssignment === assignment.id ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                          <span className="font-medium">{assignment.subjectName} Assignment</span>
                        </div>
                      </button>

                      {/* ACCORDION CONTENT */}
                      {expandedAssignment === assignment.id && (
                        <div className="p-4 bg-white">
                          <div className="mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">{assignment.title}</h3>
                            <div className="text-sm text-gray-600 whitespace-pre-line">
                              {assignment.description}
                            </div>
                            {assignment.teacherName && (
                              <p className="text-sm text-gray-500 mt-2">
                                <span className="font-medium">Teacher:</span> {assignment.teacherName}
                              </p>
                            )}
                            {assignment.className && (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Class:</span> {assignment.className}
                              </p>
                            )}
                          </div>

                          {/* ATTACHMENTS */}
                          {assignment.studentAttachmentUrl && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                              <div className="space-y-1">
                                <a
                                  href={assignment.studentAttachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <Paperclip size={14} />
                                  <span className="underline">View Attachment</span>
                                </a>
                              </div>
                            </div>
                          )}

                          {/* NOTICE AND UPLOAD */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                            <p className="text-sm text-yellow-800">
                              <span className="font-medium">Notice:</span> Once completed your homework, upload here
                            </p>
                          </div>

                          <div className="border-t pt-4 mt-4">

                            {/* Already Submitted */}
                            {assignment.submitted ? (
                              <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 flex items-center gap-2">
                                <Paperclip size={16} className="text-green-600" />

                                <div>
                                  <p className="text-sm font-medium text-green-700">
                                    Homework already submitted
                                  </p>

                                  {assignment.submittedFileUrl && (
                                    <a
                                      href={assignment.submittedFileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 underline"
                                    >
                                      View Submitted File
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Upload Homework
                                </label>

                                <div className="flex flex-col md:flex-row md:items-center gap-3">

                                  {/* File Upload */}
                                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white w-full md:w-[320px]">

                                    <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors border-r border-gray-300">

                                      Choose File

                                      <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, assignment.id)}
                                      />
                                    </label>

                                    <div className="px-3 py-2 text-sm text-gray-500 w-full">
                                      {uploadedFiles[assignment.id]?.length > 0 ? (
                                        <ul className="space-y-1">
                                          {uploadedFiles[assignment.id].map((file, index) => (
                                            <li key={index} className="truncate">
                                              {file.name}
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        "No chosen files"
                                      )}
                                    </div>
                                  </div>

                                  {/* Submit Button */}
                                  <button
                                    onClick={() => handleSubmit(assignment)}
                                    disabled={submitLoading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {submitLoading ? "Submitting..." : "Submit"}

                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M5 12h14"></path>
                                      <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                  </button>
                                </div>

                                {/* Uploaded Success */}
                                {submittedHomework[assignment.id]?.length > 0 && (
                                  <div className="mt-3 text-green-600 text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Paperclip size={15} />
                                      <span className="font-medium">Uploaded Files:</span>
                                    </div>

                                    <ul className="ml-6 list-disc space-y-1">
                                      {submittedHomework[assignment.id].map((file, index) => (
                                        <li key={index} className="truncate">
                                          {file.name}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHomework;
