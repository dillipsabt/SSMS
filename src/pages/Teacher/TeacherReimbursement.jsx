import React from "react";
import { useState } from "react";
import Select from "react-select";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import { addReimbursementAsync } from "../../features/teacher/Reimbursements/reimbursementSlice";
import { useSelector } from "react-redux";
import { getReimbursementsAsync } from "../../features/teacher/Reimbursements/reimbursementSlice";
import { useEffect } from "react";
import Pagination from "../../components/common/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TeacherReimbursement() {
  const [openModal, setOpenModal] = useState(false);
  const reimbursementState = useSelector((state) => state.teacherReimbursement);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // const [errors, setErrors] = useState({});

  const list = reimbursementState?.list || [];

  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.expenseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expenseType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentData = filteredList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredList.length / rowsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReimbursementsAsync());
  }, [dispatch]);

  const [form, setForm] = useState({
    name: "",
    type: "",
    amount: "",
    date: "",
    desc: "",
    file: null,
  });

  const [fileName, setFileName] = useState("No file chosen");

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm({ ...form, [name]: value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setForm({ ...form, file });
    setFileName(file.name);
  };

  const validate = () => {
    if (!form.name) return toast.error("Expense Name Required");

    if (!form.type) return toast.error("Expense Type Required");

    if (!form.amount) return toast.error("Amount Required");

    if (!form.date) return toast.error("Expense Date Required");

    if (!form.desc) return toast.error("Description Required");

    if (!form.file) return toast.error("Upload Bill Required");

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
      const payload = {
        expenseName: form.name,

        expenseType: form.type.toLowerCase(),

        amount: Number(form.amount),

        appliedDate: form.date,

        expenseBillPath: form.file ? form.file.name : "",

        description: form.desc,

        status: "pending",
      };

      await dispatch(addReimbursementAsync(payload)).unwrap();

      dispatch(getReimbursementsAsync());

      toast.success("Reimbursement added successfully");

      setForm({
        name: "",
        type: "",
        amount: "",
        date: "",
        desc: "",
        file: null,
      });

      setFileName("No file chosen");

      setOpenModal(false);
    } catch (err) {
      console.error(err);

      toast.error("Failed");
    }
  };
  return (
    <div className="min-h-screen bg-white px-4 py-2">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-lg font-semibold">Reimbursement</h1>
          <p className="text-sm text-gray-600">Teacher / Reimbursement</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm"
        >
          + Add Reimbursement
        </button>
      </div>

      {/* Card */}
      <div className="border border-gray-200 rounded-lg">
        {/* Top Filter */}
        <div className="flex flex-wrap justify-between items-center gap-3 p-3 border-b border-gray-200">
          <p className="font-medium text-sm">
            Reimbursement
          </p>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="
        flex-1
        min-w-[180px]
        md:w-72
        border
        border-gray-200
        rounded-md
        px-3
        py-2
        outline-none
        text-sm
      "
            />

            <Select
              options={[
                { value: "", label: "All Status" },
                { value: "approved", label: "Approved" },
                { value: "reject", label: "Reject" },
                { value: "pending", label: "Pending" },
              ]}
              value={[
                { value: "", label: "All Status" },
                { value: "approved", label: "Approved" },
                { value: "reject", label: "Reject" },
                { value: "pending", label: "Pending" },
              ].find((item) => item.value === statusFilter)}
              onChange={(selected) =>
                setStatusFilter(selected?.value || "")
              }
              className="w-full sm:w-40 text-sm"
              classNamePrefix="react-select"
            />
            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Reset
              </button>
            )}

          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentData?.length > 0 ? (
            currentData.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white"
              >
                {/* Content */}
                <div
                  className={`p-3 text-sm space-y-1 ${item.status?.toLowerCase() === "approved"
                    ? "bg-green-50"
                    : item.status?.toLowerCase() === "reject"
                      ? "bg-red-50"
                      : "bg-blue-50"
                    }`}
                >
                  {" "}
                  <p>
                    <span className="font-medium">Expense Name</span> :{" "}
                    {item.expenseName}
                  </p>
                  <p>
                    <span className="font-medium">Expense Type</span> :{" "}
                    {item.expenseType}
                  </p>
                  <p>
                    <span className="font-medium">Applied Date</span> :{" "}
                    {item.appliedDate}
                  </p>
                  <p>
                    <span className="font-medium">Expense Bill</span>
                    <span className="text-blue-600 cursor-pointer">
                      {" "}
                      : {item.expenseBillPath}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Expense Description</span> :{" "}
                    {item.description}
                  </p>
                </div>

                {/* Status Footer */}
                <div className="text-center py-2 border-t border-gray-200 text-sm font-medium">
                  {item.status?.toLowerCase() === "approved" && (
                    <span className="text-green-600">Approved</span>
                  )}

                  {item.status?.toLowerCase() === "reject" && (
                    <span className="text-red-500">Reject</span>
                  )}

                  {item.status?.toLowerCase() === "pending" && (
                    <span className="text-orange-500">Pending</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No Data Found
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="px-3 py-2 border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
      {openModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="w-[95%] sm:w-[420px] bg-white rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-indigo-600 px-5 py-3 flex justify-between items-center">
              <h2 className="text-white text-sm font-semibold">
                Add Reimbursement
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition"
              >
                <span className="text-white text-lg mb-0.5 ml-0.9">×</span>
              </button>
            </div>

            {/* FORM */}
            <div className="p-5 space-y-4 text-sm text-black">
              {/* Expense Name */}
              <div>
                <label className="block mb-1 font-medium ">
                  Expense Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 outline-none"
                />
              </div>

              {/* Expense Type */}
              <div>
                <label className="block mb-1 font-medium ">
                  Expense Type <span className="text-red-500">*</span>
                </label>

                <Select
                  options={[
                    { value: "Personal", label: "Personal" },
                    { value: "Office", label: "Office" },
                  ]}
                  value={
                    form.type
                      ? { value: form.type, label: form.type }
                      : null
                  }
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      type: selected?.value || "",
                    })
                  }
                  placeholder="Select Type"
                  className="text-sm"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 outline-none"
                />
              </div>

              {/* Expense Date */}
              <div>
                <label className="block mb-1 font-medium ">
                  Expense Date <span className="text-red-500">*</span>
                </label>{" "}
                <DatePicker
                  selected={form.date ? new Date(form.date) : null}
                  onChange={(date) =>
                    setForm({
                      ...form,
                      date: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  wrapperClassName="w-full sm:w-auto"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-medium ">
                  Expense Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Write here"
                  rows={3}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 resize-none outline-none"
                />
              </div>

              {/* Upload Bills */}
              <div>
                <label className="block mb-1 font-medium ">
                  Upload Bills <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center border border-gray-200 rounded-md overflow-hidden">
                  <label className="bg-indigo-100 px-3 py-2 text-sm cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  <span className="px-3 text-gray-500 text-sm">{fileName}</span>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded-md shadow text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
