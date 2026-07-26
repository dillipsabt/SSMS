import React, { useEffect, useState } from "react";
import { Link } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import AttachmentModal from "../../components/Teacher/AttachmentModal";
import Pagination from "../../components/common/Pagination";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  fetchHomeworkAsync,
  createHomeworkAsync,
  fetchClassesAsync,
  fetchSubjectsAsync,
  fetchTeachersAsync,
} from "../../features/teacher/homework/teacherHomeworkSlice";

const TeacherAssignmentHomework = () => {
  const dispatch = useDispatch();

  const { homeworks, classes, classCode, subjects, teachers } = useSelector(
    (state) => state.teacherHomework,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
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
    dispatch(fetchTeachersAsync());
  }, [dispatch]);

  const validate = () => {
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
        teacherId: Number(selectedTeacherId),
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

      if (selectedTeacherId) {
        dispatch(fetchHomeworkAsync(selectedTeacherId));
      }

      setForm({
        title: "",
        Teacher: "",
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

  const totalPages = Math.ceil(filteredHomeworks.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

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
          <div className="flex flex-col">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Teacher <span className="text-red-500">*</span>
            </label>
            <Select
              options={teachers?.map((item) => ({
                value: item.id || item.teacherId,
                label: item.fullName || item.name,
              }))}
              value={teachers
                ?.map((item) => ({
                  value: item.id || item.teacherId,
                  label: item.fullName || item.name,
                }))
                .find((item) => item.value == selectedTeacherId)}
              onChange={(selected) =>
                setSelectedTeacherId(selected?.value || "")
              }
              placeholder="Select"
              classNamePrefix="react-select"
            />
          </div>

          {/* CLASS */}
          <div className="flex flex-col">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Class <span className="text-red-500">*</span>
            </label>
            <Select
              options={classes?.map((item) => ({
                value: item.id,
                label: item.classCode,
              }))}
              value={classes
                ?.map((item) => ({
                  value: item.id,
                  label: item.classCode,
                }))
                .find((item) => item.value == form.classId)}
              onChange={(selected) => {
                const item = classes.find(
                  (x) => x.id === selected?.value
                );

                setForm({
                  ...form,
                  classId: item?.id || "",
                  classCode: item?.classCode || "",
                });
              }}
              placeholder="Select"
              classNamePrefix="react-select"
            />
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
          <div className="flex flex-col">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <Select
              options={subjects?.map((item) => ({
                value: item.id || item.subjectId,
                label: item.subjectName,
              }))}
              value={subjects
                ?.map((item) => ({
                  value: item.id || item.subjectId,
                  label: item.subjectName,
                }))
                .find((item) => item.value == form.subject)}
              onChange={(selected) =>
                setForm({
                  ...form,
                  subject: selected?.value || "",
                })
              }
              placeholder="Select"
              classNamePrefix="react-select"
            />
          </div>

          {/* DUE DATE */}
          <div className="flex flex-col">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={form.dueDate ? new Date(form.dueDate) : null}
              onChange={(date) =>
                setForm({
                  ...form,
                  dueDate: date
                    ? date.toISOString().split("T")[0]
                    : "",
                })
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Date"
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              wrapperClassName="w-full sm:w-auto"
            />
          </div>

          {/* ASSIGN TO */}
          <div className="flex flex-col">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Assign To <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: "CLASS", label: "All Students" },
                { value: "GROUP", label: "Group" },
                { value: "INDIVIDUAL", label: "Individual" },
              ]}
              value={
                form.assignTo
                  ? {
                    value: form.assignTo,
                    label:
                      form.assignTo === "CLASS"
                        ? "All Students"
                        : form.assignTo,
                  }
                  : null
              }
              onChange={(selected) =>
                setForm({
                  ...form,
                  assignTo: selected?.value || "",
                })
              }
              placeholder="Select"
              classNamePrefix="react-select"
            />
          </div>

          {/* FILE */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Upload Attachment <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <label className="bg-indigo-100 text-indigo-600 px-4 py-2 text-sm cursor-pointer hover:bg-indigo-200 transition-colors">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] })
                  }
                />
              </label>
              <span className="px-3 text-gray-500 text-sm truncate flex-1">
                {form.file ? form.file.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col md:col-span-4">
            <label className="mb-1 block text-[13px] font-semibold text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Write here"
              className="border border-gray-300 px-3 py-2 rounded-md h-24 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

          <div className="flex flex-col gap-2 w-full">
            <Select
              className="w-full"
              options={teachers?.map((item) => ({
                value: item.id || item.teacherId,
                label: item.fullName || item.name,
              }))}
              value={teachers
                ?.map((item) => ({
                  value: item.id || item.teacherId,
                  label: item.fullName || item.name,
                }))
                .find((item) => item.value == selectedTeacherId)}
              onChange={(selected) =>
                setSelectedTeacherId(selected?.value || "")
              }
              placeholder="Select"
              classNamePrefix="react-select"
            />

            <DatePicker
              selected={filterDate ? new Date(filterDate) : null}
              onChange={(date) => {
                setFilterDate(
                  date ? date.toISOString().split("T")[0] : ""
                );
                setCurrentPage(1);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Date"
              className="border border-gray-300 px-3 py-1.5 rounded-md text-xs w-full"
              wrapperClassName="w-full sm:w-auto"
            />
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Reset
              </button>
            )}

            <Select
              className="w-full"
              options={[
                { value: "export", label: "Export" },
                { value: "csv", label: "CSV" },
                { value: "pdf", label: "PDF" },
              ]}
              placeholder="Export"
              classNamePrefix="react-select"
            />
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
                    No assignments found. Select a teacher to view assignments.
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
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded">
                {currentPage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                &gt;
              </button>
              <span>Next</span>
              <span className="ml-4">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 px-2 py-1 rounded text-gray-600"
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
