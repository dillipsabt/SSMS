import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Plus, X, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import useToastMessage from "../../utils/useToastMessage";
import {
  getNoticeBoardListAsync,
  getNoticeBoardByIdAsync,
  createNoticeBoardAsync,
  updateNoticeBoardAsync,
  deleteNoticeBoardAsync,
  publishNoticeBoardAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/NoticeBoard/noticeBoardSlice";
import { useNavigate } from "react-router-dom";

const NoticeBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    noticeList,
    pagination,
    loading,
    error,
    success,
  } = useSelector((state) => state.noticeBoard);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Modal states
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedNotices, setSelectedNotices] = useState([]);

  // Form data for edit/add
  const [formData, setFormData] = useState({
    title: "",
    noticeDate: "",
    description: "",
  });

  // Publish options
  const [publishOptions, setPublishOptions] = useState({
    publishToStudent: true,
    publishToParent: true,
    publishToTeacher: false,
    publishToAdmin: false,
    emailSmsNotification: true,
  });
  const [publishNotes, setPublishNotes] = useState("");

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    fetchNotices();
  }, [currentPage, rowsPerPage, searchTerm, statusFilter, dateRange]);

  useToastMessage({
    success,
    error,
    successMessage: editModal ? "Notice updated successfully! ✅" : addModal ? "Notice created successfully! ✅" : publishModal ? "Notice published successfully! ✅" : "Operation successful! ✅",
    clearSuccess,
    clearError,
    onSuccess: () => {
      setAddModal(false);
      setEditModal(null);
      setPublishModal(false);
      fetchNotices();
    },
  });

  const fetchNotices = () => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
    };

    if (statusFilter) {
      params.status = statusFilter;
    }

    if (dateRange.from) {
      params.startDate = dateRange.from;
    }

    if (dateRange.to) {
      params.endDate = dateRange.to;
    }

    dispatch(getNoticeBoardListAsync(params));
  };

  const handleAddClick = () => {
    setFormData({ title: "", noticeDate: "", description: "" });
    setAddModal(true);
  };

  const handleEditClick = async (notice) => {
    await dispatch(getNoticeBoardByIdAsync(notice.id));
    setEditModal(notice.id);
  };

  const handleViewClick = (notice) => {
    setViewModal(notice);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    dispatch(deleteNoticeBoardAsync(selectedId));
    setDeleteModal(false);
    setSelectedId(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.noticeDate) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editModal) {
      await dispatch(
        updateNoticeBoardAsync({
          id: editModal,
          data: {
            title: formData.title,
            noticeDate: formData.noticeDate,
            description: formData.description,
          },
        })
      );
    } else {
      await dispatch(
        createNoticeBoardAsync({
          title: formData.title,
          noticeDate: formData.noticeDate,
          description: formData.description,
        })
      );
    }
  };

  const handlePublish = async () => {
    if (selectedNotices.length === 0) {
      toast.error("Please select at least one notice to publish");
      return;
    }

    const publishData = {
      noticeIds: selectedNotices,
      publishToStudent: publishOptions.publishToStudent,
      publishToParent: publishOptions.publishToParent,
      publishToTeacher: publishOptions.publishToTeacher,
      publishToAdmin: publishOptions.publishToAdmin,
      emailSmsNotification: publishOptions.emailSmsNotification,
      notes: publishNotes,
    };

    await dispatch(publishNoticeBoardAsync(publishData));
    toast.success("Notice published successfully!");
    setPublishModal(false);
    setSelectedNotices([]);
    fetchNotices();
  };

  const handleSelectNotice = (id) => {
    setSelectedNotices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotices.length === (noticeList || []).length) {
      setSelectedNotices([]);
    } else {
      setSelectedNotices((noticeList || []).map((notice) => notice.id));
    }
  };

  const currentNotices = noticeList;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Masters / Notice Board</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Notice
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Title */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-sm sm:text-lg font-bold text-gray-900">Notice Board Lists</h2>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by title or notice ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Date Range
              </label>
              <div className="flex items-center gap-1 sm:gap-2">
                <input
                  type="text"
                  placeholder="from"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="text"
                  placeholder="to"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
                <Calendar size={16} className="text-gray-400 flex-shrink-0" />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] sm:text-xs min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700 w-8 sm:w-12">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedNotices.length === noticeList.length && noticeList.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  S.No.
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Notice ID
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Title Name
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Notice Date
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-center font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : currentNotices.length > 0 ? (
                currentNotices.map((notice, idx) => (
                  <tr key={notice.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedNotices.includes(notice.id)}
                        onChange={() => handleSelectNotice(notice.id)}
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-900">
                      {(pagination.page) * pagination.size + idx + 1}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600">
                      {notice.id}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-900">
                      {notice.title}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600">
                      {notice.noticeDate}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          notice.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="flex justify-center gap-2 sm:gap-3">
                        <button
                          onClick={() => handleViewClick(notice)}
                          title="View"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(notice)}
                          title="Edit"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Edit2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(notice.id)}
                          title="Delete"
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-600">
                    No notices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <button
            onClick={() => setPublishModal(true)}
            disabled={selectedNotices.length === 0}
            className="px-4 py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Publish ({selectedNotices.length})
          </button>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h3 className="text-sm sm:text-lg font-bold">View Details</h3>
              <button
                onClick={() => setViewModal(null)}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {viewModal.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                {viewModal.date}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                Lorem ipsum dolor instct consturct Lorem ipsum dolor instct consturct.
              </p>

              <button
                onClick={() => setViewModal(null)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 font-medium text-xs sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-sm sm:text-lg font-bold">Edit Notice Board</h3>
              <button
                onClick={() => {
                  setEditModal(null);
                  setFormData({ title: "", noticeDate: "", description: "" });
                }}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Title Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Notice Date
                </label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={formData.noticeDate}
                  onChange={(e) => setFormData({ ...formData, noticeDate: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => {
                    setEditModal(null);
                    setFormData({ title: "", noticeDate: "", description: "" });
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-sm sm:text-lg font-bold">Add Notice Board</h3>
              <button
                onClick={() => {
                  setAddModal(false);
                  setFormData({ title: "", noticeDate: "", description: "" });
                }}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Title Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.noticeDate}
                  onChange={(e) => setFormData({ ...formData, noticeDate: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Write here"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => {
                    setAddModal(false);
                    setFormData({ title: "", noticeDate: "", description: "" });
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {publishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
              <h3 className="text-sm sm:text-lg font-bold">Publish Notice Board</h3>
              <button
                onClick={() => setPublishModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Publish Options</h4>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishOptions.publishToStudent}
                      onChange={(e) =>
                        setPublishOptions({
                          ...publishOptions,
                          publishToStudent: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Publish to student portal</span>
                  </label>

                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishOptions.publishToParent}
                      onChange={(e) =>
                        setPublishOptions({
                          ...publishOptions,
                          publishToParent: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Publish to Parent portal</span>
                  </label>

                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishOptions.publishToTeacher}
                      onChange={(e) =>
                        setPublishOptions({
                          ...publishOptions,
                          publishToTeacher: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Publish to Teacher portal</span>
                  </label>

                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishOptions.publishToAdmin}
                      onChange={(e) =>
                        setPublishOptions({
                          ...publishOptions,
                          publishToAdmin: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Publish to Admin portal</span>
                  </label>

                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishOptions.emailSmsNotification}
                      onChange={(e) =>
                        setPublishOptions({
                          ...publishOptions,
                          emailSmsNotification: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Send Email / SMS Notification</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={publishNotes}
                  onChange={(e) => setPublishNotes(e.target.value)}
                  rows="2"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  onClick={() => setPublishModal(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Publishing..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Notice"
        message="Are you sure you want to delete this notice?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default NoticeBoard;
