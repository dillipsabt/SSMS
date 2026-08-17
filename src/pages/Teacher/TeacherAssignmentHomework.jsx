import React, { useEffect, useState } from "react";
import { Link } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import AttachmentModal from "../../components/Teacher/AttachmentModal";
import Pagination from "../../components/common/Pagination";


import {
  fetchHomeworkAsync,
  createHomeworkAsync,
  fetchClassesAsync,
  fetchSubjectsAsync,
} from "../../features/teacher/homework/teacherHomeworkSlice";

const TeacherAssignmentHomework = () => {
  const dispatch = useDispatch();

  const { homeworks, classes, subjects } = useSelector(
    (state) => state.teacherHomework,
  );
  const { profileId } = useSelector((state) => state.auth || {});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState("");

  const [form, setForm] = useState({
    title: "",
    classId: "",
    classCode: "",
    subject: "",
    dueDate: "",
    assignTo: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    dispatch(fetchClassesAsync());
    dispatch(fetchSubjectsAsync());

    if (profileId) {
      dispatch(fetchHomeworkAsync(profileId));
    }
  }, [dispatch, profileId]);

  const validate = () => {
    if (!profileId) return toast.error("Teacher profile not found");
    if (!form.title) return toast.error("Title Required");
    if (!form.classCode) return toast.error("Class Code Required");
    if (!form.subject) return toast.error("Subject Required");
    if (!form.dueDate) return toast.error("Due Date Required");
    if (!form.assignTo) return toast.error("Assign To Required");
    if (!form.description) return toast.error("Description Required");
    if (!form.file) return toast.error("Attachment Required");

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (form.file) {
      if (!allowedTypes.includes(form.file.type)) {
        return toast.error("Only JPG, PNG, PDF allowed");
      }

      if (form.file.size > 2 * 1024 * 1024) {
        return toast.error("File must be less than 2MB");
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    const isValid = validate();

    if (isValid !== true) return;

    try {
      const dto = {
        title: form.title,
        classId: form.classId ? Number(form.classId) : null,
        //classCode: form.classCode,
        subjectId: form.subject ? Number(form.subject) : null,
        dueDate: form.dueDate,
        description: form.description,
        teacherId: Number(profileId),
        assignmentType: form.assignTo,
        groupId: null,
        studentIds: [],
      };

      const formData = new FormData();

      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], {
          type: "application/json",
        }),
      );

      formData.append("attachment", form.file);

      await dispatch(createHomeworkAsync(formData)).unwrap();

      toast.success("Assignment Created Successfully");

      if (profileId) {
        dispatch(fetchHomeworkAsync(profileId));
      }

      setForm({
        title: "",
        classCode: "",
        // section: "",
        subject: "",
        dueDate: "",
        assignTo: "",
        description: "",
        file: null,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to create homework");
    }
  };

  // Pagination logic
  const filteredHomeworks =
    homeworks?.filter((item) => {
      if (!filterDate) return true;

      return item.dueDate?.split("T")[0] === filterDate;
    }) || [];

  const totalPages = Math.max(1, Math.ceil(filteredHomeworks.length / itemsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);

  const startIndex = (visiblePage - 1) * itemsPerPage;

  const paginatedHomeworks = filteredHomeworks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusStyle = (status) => {
    if (status === "Completed") return "text-green-600";
    if (status === "Reject") return "text-red-500";
    if (status === "Report") return "text-blue-600";
    return "text-yellow-600";
  };

  return (
    <div className="w-full">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Assignment / Homework
        </h1>
        <p className="text-sm text-gray-500">
          Teacher /{" "}
          <span className="text-gray-900 font-medium">Assignment</span>
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
          Assignment
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* TITLE */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

          </div>

          {/* CLASS */}
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

          {/* SECTION */}
          {/* <div className="flex flex-col">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div> */}

          {/* SUBJECT */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={form.subject}
              onChange={(event) =>
                setForm({
                  ...form,
                  subject: event.target.value,
                })
              }
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

          {/* DUE DATE */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm({
                  ...form,
                  dueDate: event.target.value,
                })
              }
              className="form-input"
            />
          </div>

          {/* ASSIGN TO */}
          <div className="flex flex-col w-full min-w-0">
            <label className="form-label">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              value={form.assignTo}
              onChange={(event) =>
                setForm({
                  ...form,
                  assignTo: event.target.value,
                })
              }
              className="form-select"
            >
              <option value="">Select Assign To</option>
              <option value="CLASS">All Students</option>
              <option value="GROUP">Group</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          {/* FILE */}
          <div className="flex flex-col md:col-span-2 w-full min-w-0">
            <label className="form-label">
              Upload Attachment <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-md h-9 overflow-hidden bg-white">
              <label className="bg-brand-100 text-brand-600 px-3 text-[12px] h-full flex items-center cursor-pointer shrink-0 hover:bg-brand-50 transition-colors">
                Choose
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] })
                  }
                />
              </label>
              <span className="px-2 text-[12px] text-gray-500 truncate min-w-0 flex-1">
                {form.file ? form.file.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col md:col-span-4 w-full min-w-0">
            <label className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Write here"
              className="form-textarea h-24 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end p-4 pt-0">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium rounded-md text-sm transition-colors flex items-center gap-1"
          >
            Submit <span>&#10148;</span>
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 flex flex-wrap justify-between items-center gap-2">
          <span>Assignment List</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <div className="relative min-w-0">
              <input
                type="date"
                value={filterDate}
                onChange={(event) => {
                  setFilterDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="form-input pr-14"
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterDate("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-100"
                >
                  Reset
                </button>
              )}
            </div>

            <select className="form-select min-w-0" defaultValue="">
              <option value="">Export</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50 text-gray-700">
              <tr>
                <th className="p-3 text-left font-medium">S.No.</th>
                {/* <th className="p-3 text-left font-medium">Date</th> */}
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Subject</th>
                <th className="p-3 text-left font-medium">Class/Section</th>
                <th className="p-3 text-left font-medium">Due Date</th>
                <th className="p-3 text-left font-medium">Assign To</th>
                <th className="p-3 text-center font-medium">
                  Description / Attachments
                </th>
                <th className="p-3 text-center font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedHomeworks?.length > 0 ? (
                paginatedHomeworks.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{startIndex + i + 1}</td>
                    {/* <td className="p-3">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td> */}
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.subjectName}</td>
                    <td className="p-3">{item.className}</td>
                    <td className="p-3">{item.dueDate}</td>
                    <td className="p-3">{item.assignmentType || "-"}</td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <Link
                          size={18}
                          className="text-indigo-600 cursor-pointer hover:text-indigo-800"
                          onClick={() => {
                            setSelectedAttachment(item);
                            setIsModalOpen(true);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-xs font-medium ${getStatusStyle(item.status)}`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredHomeworks?.length > 0 && (
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

      <AttachmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attachmentData={selectedAttachment}
      />
    </div>
  );
};

export default TeacherAssignmentHomework;
