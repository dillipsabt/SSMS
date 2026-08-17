import React, { useEffect, useState } from "react";
import { Search, Link2, MoreVertical, Check, X } from "lucide-react";

import { toast } from "sonner";
import { Toaster } from "sonner";

import { useDispatch, useSelector } from "react-redux";


import {
  fetchClassesAsync,
  fetchSubjectsAsync,
  fetchHomeworkSubmissionsAsync,
  acceptHomeworkAsync,
  rejectHomeworkAsync,
} from "../../features/teacher/homework/teacherHomeworkSlice";

const getStatusStyle = (status) => {
  if (status === "APPROVED") {
    return "bg-green-100 text-green-600";
  }
  if (status === "REJECTED") {
    return "bg-red-100 text-red-500";
  }
  return "bg-yellow-100 text-yellow-600";
};

export default function TeacherAssignmentSubmission() {
  const dispatch = useDispatch();

  const { classes, subjects, submissions } = useSelector(
    (state) => state.teacherHomework,
  );
  const { profileId } = useSelector((state) => state.auth || {});

  const [openActionId, setOpenActionId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectItem, setRejectItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    subject: "",
    classId: "",
    classCode: "",
    date: "",
    assignTo: "",
  });

  const [errors, setErrors] = useState({
    subject: "",
    classId: "",
    classCode: "",
    date: "",
    assignTo: "",
  });


  useEffect(() => {
    dispatch(fetchClassesAsync());
    dispatch(fetchSubjectsAsync());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      subject: "",
      classId: "",
      classCode: "",
      date: "",
      assignTo: "",
    };

    if (!form.subject) {
      newErrors.subject = "Subject is required";
      setErrors(newErrors);
      toast.error("Subject is required");
      return false;
    }

    if (!form.classCode) {
      newErrors.classCode = "Class Code is required";
      setErrors(newErrors);
      toast.error("Class Code is required");
      return false;
    }

    if (!form.date) {
      newErrors.date = "Date is required";
      setErrors(newErrors);
      toast.error("Date is required");
      return false;
    }

    if (!form.assignTo) {
      newErrors.assignTo = "Assign To is required";
      setErrors(newErrors);
      toast.error("Assign To is required");
      return false;
    }

    setErrors({
      subject: "",
      classId: "",
      classCode: "",
      date: "",
      assignTo: "",
    });

    return true;
  };

  // SEARCH
  const handleSearch = async () => {
    const isValid = validate();

    if (!isValid) return;

    if (!profileId) {
      toast.error("Teacher profile not found");
      return;
    }

    try {
      await dispatch(
        fetchHomeworkSubmissionsAsync({
          teacherId: Number(profileId),
          classId: form.classId ? Number(form.classId) : null,
          classCode: form.classCode,
        }),
      ).unwrap();

      toast.success("Data Loaded successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to fetch submissions");
    }
  };

  // APPROVE
  // APPROVE
  const handleApprove = async (item) => {
    try {
      await dispatch(acceptHomeworkAsync(item.id)).unwrap();

      toast.success("Homework accepted successfully");
      setOpenActionId(null);
      handleSearch();
    } catch (error) {
      toast.error(error?.message || "Failed to approve submission");
    }
  };

  // REJECT
  const handleReject = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await dispatch(
        rejectHomeworkAsync({
          submissionId: rejectItem.id,
          comments: comment,
        }),
      ).unwrap();

      toast.error("Request Rejected");
      setOpenRejectModal(false);
      setComment("");
      handleSearch();
    } catch (error) {
      toast.error(error?.message || "Failed to reject submission");
    }
  };

  // Pagination logic
  const filteredSubmissions =
    submissions?.filter(
      (item) =>
        item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.homeworkTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / itemsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);

  const startIndex = (visiblePage - 1) * itemsPerPage;

  const paginatedSubmissions = filteredSubmissions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="w-full">
      <Toaster position="top-right" richColors />

      <h2 className="text-2xl font-bold text-gray-800">
        Assignment Submission
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Teacher /{" "}
        <span className="text-gray-900 font-medium">Assignment Submission</span>
      </p>

      {/* Top Filter Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
          Assignment Submission
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Subject */}
          <div className="flex flex-col w-full min-w-0">
            <div className="flex flex-col w-full min-w-0">
              <label className="form-label">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Subject</option>
                {subjects?.map((item) => (
                  <option key={item.id || item.subjectId} value={item.id || item.subjectId}>
                    {item.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={form.classId}
              onChange={(event) => {
                const item = classes?.find(
                  (classItem) => String(classItem.id) === event.target.value,
                );

                setForm({
                  ...form,
                  classId: item?.id || "",
                  classCode: item?.classCode || "",
                });
              }}
              className="form-select"
            >
              <option value="">Select Class</option>
              {classes?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.classCode}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Assign To */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              name="assignTo"
              value={form.assignTo}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Assign To</option>
              <option value="CLASS">All Students</option>
              <option value="GROUP">Group</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex gap-2 items-center text-sm transition-colors"
            >
              <Search size={16} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg text-sm font-medium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="leading-5">Assignment Submission List</span>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Student Name"
              className="form-input w-full sm:w-56 bg-transparent text-white placeholder-white border-white"
            />
            <select className="form-select w-full sm:w-32 text-black" defaultValue="">
              <option value="">Export</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">
                  S.No.
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Submission Date
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Student Name
                </th>
                <th className="p-3 text-center font-medium text-gray-700">
                  Submission Attachments
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Description
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Reject Comments
                </th>
                <th className="p-3 text-center font-medium text-gray-700">
                  Status
                </th>
                <th className="p-3 text-center font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedSubmissions?.length > 0 ? (
                paginatedSubmissions.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{startIndex + index + 1}</td>
                    <td className="p-3">
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3">{item.studentName || "-"}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center">
                        <Link2
                          className="text-indigo-600 w-5 h-5 cursor-pointer hover:text-indigo-800"
                          onClick={() => {
                            setSelectedStudent(item);
                            setOpenModal(true);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3">{item.remarks || "-"}</td>
                    <td className="p-3">{item.rejectComments || "-"}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          item.status,
                        )}`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="relative flex justify-center">
                        <MoreVertical
                          className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setOpenActionId(
                              openActionId === item.id ? null : item.id,
                            )
                          }
                        />

                        {openActionId === item.id && (
                          <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div
                              onClick={() => handleApprove(item)}
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Approve</span>
                            </div>
                            <div
                              onClick={() => {
                                setRejectItem(item);
                                setOpenActionId(null);
                                setOpenRejectModal(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                            >
                              <X className="w-4 h-4 text-red-500" />
                              <span>Reject</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No Data Found. Use the filters above to search for
                    submissions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSubmissions.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Prev</span>
              <button
                onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))}
                disabled={visiblePage === 1}
                className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded">
                {visiblePage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, visiblePage + 1))
                }
                disabled={visiblePage === totalPages}
                className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                &gt;
              </button>
              <span>Next</span>
              <span className="ml-4">
                Page {visiblePage} of {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select w-auto"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Attachment Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[500px] max-w-[95vw] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 text-white px-5 py-3 flex justify-between items-center">
              <h2 className="text-sm font-semibold">Submission Attachments</h2>
              <button
                onClick={() => setOpenModal(false)}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-5 text-sm">
              <div className="flex gap-6 mb-4">
                <div>
                  <span className="font-medium text-gray-600">
                    Student Name:
                  </span>{" "}
                  <span className="font-semibold">
                    {selectedStudent?.studentName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Subject:</span>{" "}
                  <span className="font-semibold">
                    {selectedStudent?.subjectName || "-"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Homework:</span>{" "}
                  <span className="font-semibold">
                    {selectedStudent?.homeworkTitle}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 font-medium text-gray-700 bg-gray-50 border-b border-gray-200">
                  File Attachments Name
                </div>
                <div>
                  {selectedStudent?.submissionUrl ? (
                    <a
                      href={selectedStudent.submissionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-3 text-indigo-600 hover:text-indigo-800 hover:underline hover:bg-gray-50"
                    >
                      {selectedStudent.submissionUrl?.split("/")?.pop()}
                    </a>
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No Attachment</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={() => setOpenModal(false)}
                  className="border border-red-400 text-red-500 px-5 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {openRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[400px] max-w-[95vw] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 text-white px-5 py-3 flex justify-between items-center">
              <h2 className="text-sm font-semibold">Reject Comments</h2>
              <button
                onClick={() => setOpenRejectModal(false)}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-5 text-sm">
              <label className="block mb-2 font-medium text-gray-700">
                Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write here"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 h-28 resize-none outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex justify-end mt-5">
                <button
                  onClick={handleReject}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
