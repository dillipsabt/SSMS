import React, { useEffect, useState } from "react";
import { Edit, Trash2, Calendar, Link as LinkIcon, Eye, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  fetchStudentWiseFeesAsync,
  createStudentWiseFeesAsync,
  updateStudentWiseFeesAsync,
  deleteStudentWiseFeesAsync,
  fetchStudentByRollNumberAsync,
  clearError,
  clearSuccess,
} from "../../features/Admin/StudentWiseFees/studentWiseFeesSlice";

const StudentWiseFeesConfig = () => {
  const dispatch = useDispatch();
  const {
    studentWiseFees,
    studentData,
    loading,
    error,
    success,
  } = useSelector((state) => state.studentWiseFees);

  const [formData, setFormData] = useState({
    rollNumber: "",
    studentName: "",
    class: "",
    schoolFees: "",
    concessionFees: "",
    concessionFeesDoc: null,
    concessionFeesDocName: "",
  });

  const [dateRange, setDateRange] = useState({
    startDate: "01/09/2025",
    endDate: "30/10/2025",
  });

  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [docModal, setDocModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchStudentWiseFeesAsync({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        search: searchQuery,
        page: 0,
        size: 10,
      })
    );
  }, [dispatch, dateRange, searchQuery]);

  useEffect(() => {
    if (studentData && !editingId) {

      setFormData((prev) => ({
        ...prev,
        studentName: studentData.studentName || "",
        class: studentData.className || "",
        schoolFees: studentData.totalFees
          ? studentData.totalFees.toString()
          : "",
      }));
    }
  }, [studentData, editingId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error && formData.rollNumber === "") {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, formData.rollNumber]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "rollNumber" && value.trim()) {
      dispatch(fetchStudentByRollNumberAsync(value.trim()));
    } else if (name === "rollNumber" && !value.trim()) {
      setFormData((prev) => ({
        ...prev,
        studentName: "",
        class: "",
        schoolFees: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        concessionFeesDoc: file,
        concessionFeesDocName: file.name,
      }));
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.rollNumber || !formData.concessionFees) {
      toast.error("Please fill all required fields");
      return;
    }

    const saveData = {
      rollNo: formData.rollNumber,
      concessionFees: parseFloat(formData.concessionFees),
    };

    if (formData.concessionFeesDoc) {
      saveData.document = formData.concessionFeesDoc;
    }

    try {
      if (editingId !== null) {
        await dispatch(
          updateStudentWiseFeesAsync({
            id: editingId,
            data: saveData,
          })
        ).unwrap();

        toast.success("Student fees updated successfully");
        setEditingId(null);
      } else {
        await dispatch(createStudentWiseFeesAsync(saveData)).unwrap();

        toast.success("Student fees created successfully");
      }

      // Reset Form
      setFormData({
        rollNumber: "",
        studentName: "",
        class: "",
        schoolFees: "",
        concessionFees: "",
        concessionFeesDoc: null,
        concessionFeesDocName: "",
      });

      // Refresh Table
      dispatch(
        fetchStudentWiseFeesAsync({
          page: 0,
          size: 10,
        })
      );

    } catch (err) {

      toast.error(
        err?.message ||
        err?.response?.data?.message ||
        "Failed to save student fees"
      );
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      rollNumber: row.rollNo,
      studentName: row.studentName,
      class: row.className,
      schoolFees: row.schoolFees.toString(),
      concessionFees: row.concessionFees.toString(),
      concessionFeesDoc: null,
      concessionFeesDocName: "",
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteStudentWiseFeesAsync(id));
    setDeleteConfirmId(null);
  };

  const handleViewDocument = (documentPath) => {

    if (!documentPath) {
      toast.error("No document available");
      return;
    }

    setSelectedDocument(documentPath);

    setDocModal(true);
  };

  return (
    <div className="page-wrap fees-theme-scope">
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Student Wise Fees Configure
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Fees Management / Student Wisefees Configure
      </p>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded">
          Operation completed successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
          {typeof error === "string" ? error : "An error occurred. Please try again."}
        </div>
      )}

      {/* Form Card */}
      <div className="card mb-6">
        <div className="card-section">Add Student Fees Configure</div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="form-label">Roll Number *</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleFormChange}
                placeholder="0/1"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Student Name *</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleFormChange}
                placeholder="Hemarth Kumar"
                className="form-input"
                readOnly
              />
            </div>

            <div>
              <label className="form-label">Class *</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleFormChange}
                placeholder="9-A"
                className="form-input"
                readOnly
              />
            </div>

            <div>
              <label className="form-label">School Fees *</label>
              <input
                type="number"
                name="schoolFees"
                value={formData.schoolFees}
                onChange={handleFormChange}
                placeholder="17000"
                className="form-input"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label">Concession Fees *</label>
              <input
                type="number"
                name="concessionFees"
                value={formData.concessionFees}
                onChange={handleFormChange}
                placeholder="2000"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Concession Fees Doc Upload *</label>
              <div className="flex items-center border border-gray-300 rounded h-9 bg-white overflow-hidden">
                <label
                  htmlFor="fileInput"
                  className="bg-blue-100 text-blue-600 px-3 h-full flex items-center cursor-pointer text-xs font-medium hover:bg-blue-50 transition"
                >
                  Choose File
                </label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-3 text-xs text-gray-500 truncate flex-1 min-w-0">
                  {formData.concessionFeesDocName || "test.pdf"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="btn-primary"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="text"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            />
            <span className="text-gray-400">-</span>
            <input
              type="text"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            />
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input text-xs w-full sm:w-auto sm:max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  S.No.
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Created Date
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Roll No.
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Student Name
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Class
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  School Fees
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Concession Fees
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Concession Fees Doc
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-3 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : studentWiseFees && studentWiseFees.length > 0 ? (
                studentWiseFees.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">
                      {row.createdDate
                        ? new Date(row.createdDate).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                    <td className="px-3 py-2">{row.rollNo}</td>
                    <td className="px-3 py-2">{row.studentName}</td>
                    <td className="px-3 py-2">{row.className}</td>
                    <td className="px-3 py-2">{row.schoolFees}</td>
                    <td className="px-3 py-2">{row.concessionFees}</td>
                    <td className="px-3 py-2">

                      {row.concessionDocument ? (

                        <button
                          onClick={() =>
                            handleViewDocument(row.concessionDocument)
                          }
                          className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 hover:scale-110 transition-all"
                          title="View Document"
                        >
                          <Eye size={16} />
                        </button>

                      ) : (

                        <span className="text-gray-400">No File</span>

                      )}

                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(row.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-3 py-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-11/12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this record?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEW MODAL */}
      {docModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">

            {/* HEADER */}
            <div className="bg-brand-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg shrink-0">

              <span className="text-sm font-semibold">
                View Concession Fees Document
              </span>

              <button
                onClick={() => setDocModal(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={18} />
              </button>

            </div>

            {/* BODY */}
            <div className="overflow-y-auto flex-1 p-5 bg-gray-100">

              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-inner">

                {selectedDocument ? (

                  <iframe
                    src={selectedDocument}
                    title="Concession Document"
                    className="w-full h-[650px] rounded-lg bg-white border"
                  />

                ) : (

                  <div className="bg-gray-600 rounded h-[300px] flex items-center justify-center text-white text-sm">
                    No Document Available
                  </div>

                )}

              </div>

              <div className="flex justify-end mt-5">

                <button
                  onClick={() => setDocModal(false)}
                  className="border border-red-500 text-red-500 px-6 py-2 rounded text-sm hover:bg-red-50 transition font-semibold"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default StudentWiseFeesConfig;
