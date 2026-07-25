import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Edit2, Trash2, Plus, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchAllUpcomingEvents,
  fetchUpcomingEventById,
  createUpcomingEventAsync,
  updateUpcomingEventAsync,
  deleteUpcomingEventAsync,
  publishUpcomingEventsAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/UpcomingEvents/upcomingEventsSlice";

const UpcomingEvents = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modal states
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  // Form data for edit/add
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventDescription: "",
  });

  // Publish options
  const [publishOptions, setPublishOptions] = useState({
    publishToStudent: true,
    publishToParent: true,
    publishToTeacher: false,
    publishToAdmin: true,
    emailSmsNotification: true,
  });
  const [publishNotes, setPublishNotes] = useState("");

  // Redux selectors
  const { upcomingEventsList, loading, error, success, pagination } = useSelector(
    (state) => state.upcomingEvents
  );

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  // Load events on component mount and when filters change
  useEffect(() => {
    loadEvents();
  }, [currentPage, rowsPerPage]);

  useToastMessage({
    success,
    error,
    successMessage: "Operation completed successfully!",
    clearSuccess,
    clearError,
    onSuccess: () => {
      setAddModal(false);
      setEditModal(null);
      setPublishModal(false);
      setDeleteModal(false);
      loadEvents();
    },
  });

  const loadEvents = () => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(fromDate && { startDate: fromDate }),
      ...(toDate && { endDate: toDate }),
    };
    dispatch(fetchAllUpcomingEvents(params));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadEvents();
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    dispatch(fetchAllUpcomingEvents({ page: 0, size: rowsPerPage }));
  };

  const handleAddClick = () => {
    setFormData({ eventName: "", eventDate: "", eventTime: "", eventDescription: "" });
    setAddModal(true);
  };

  const formatTimeForDisplay = (isoTime) => {
    // Convert ISO 8601 format (2026-06-09T06:30:00.000Z) to HH:MM
    if (!isoTime) return "";
    try {
      const [date, time] = isoTime.split("T");
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } catch (e) {
      return isoTime;
    }
  };

  const handleEditClick = (event) => {
    const eventTime = formatTimeForDisplay(event.eventTime);
    setFormData({
      eventName: event.eventName || "",
      eventDate: event.eventDate || "",
      eventTime: eventTime,
      eventDescription: event.eventDescription || "",
    });
    setEditModal(event.id);
  };

  const handleViewClick = (event) => {
    setViewModal(event);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    dispatch(deleteUpcomingEventAsync(selectedId));
    setDeleteModal(false);
    setSelectedId(null);
  };

  const formatDateForAPI = (dateString) => {
    // Input format: YYYY-MM-DD (from date input)
    // Output format: YYYY-MM-DD
    return dateString;
  };

  const formatTimeForAPI = (dateString, timeString) => {
    // Combine date and time into ISO 8601 format
    // dateString: YYYY-MM-DD, timeString: HH:MM
    if (!dateString || !timeString) return "";
    return `${dateString}T${timeString}:00.000Z`;
  };

  const handleSave = async () => {
    if (!formData.eventName || !formData.eventDate || !formData.eventTime) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      eventName: formData.eventName,
      eventDate: formatDateForAPI(formData.eventDate),
      eventTime: formatTimeForAPI(formData.eventDate, formData.eventTime),
      eventDescription: formData.eventDescription,
    };

    if (editModal) {
      dispatch(
        updateUpcomingEventAsync({
          id: editModal,
          data: payload,
        })
      );
    } else {
      dispatch(createUpcomingEventAsync(payload));
    }
  };

  const handlePublish = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one event to publish");
      return;
    }

    const publishData = {
      eventIds: Array.from(selectedIds),
      publishToStudent: publishOptions.publishToStudent,
      publishToParent: publishOptions.publishToParent,
      publishToTeacher: publishOptions.publishToTeacher,
      publishToAdmin: publishOptions.publishToAdmin,
      emailSmsNotification: publishOptions.emailSmsNotification,
      notes: publishNotes,
    };

    dispatch(publishUpcomingEventsAsync(publishData));
    setPublishModal(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(upcomingEventsList.map((event) => event.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const formatEventTimeForDisplay = (isoTime) => {
    // Convert ISO 8601 format (2026-06-09T06:30:00.000Z) to HH:MM
    if (!isoTime) return "N/A";
    try {
      const [date, time] = isoTime.split("T");
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } catch (e) {
      return isoTime;
    }
  };

  const filteredEvents = upcomingEventsList || [];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Masters / Upcoming Events</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Title */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-sm sm:text-lg font-bold text-gray-900">Upcoming Event Lists</h2>
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
                placeholder="Search by event name or event ID"
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
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="text"
                  placeholder="to"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium text-xs sm:text-sm"
              >
                Reset
              </button>
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
                    checked={selectedIds.size === filteredEvents.length && filteredEvents.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  S.No.
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Event ID
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Event Name
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Event Date
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-semibold text-gray-700">
                  Event Time
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
                  <td colSpan="8" className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event, idx) => (
                  <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.has(event.id)}
                        onChange={() => toggleSelect(event.id)}
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-900">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600">
                      {event.id || "N/A"}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-900">
                      {event.eventName || "N/A"}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600">
                      {event.eventDate || "N/A"}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600">
                      {formatEventTimeForDisplay(event.eventTime)}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-green-100 text-green-800">
                        {event.status || "Draft"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="flex justify-center gap-2 sm:gap-3">
                        <button
                          onClick={() => handleViewClick(event)}
                          title="View"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(event)}
                          title="Edit"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Edit2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id)}
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
                  <td colSpan="8" className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-600">
                    No events found
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
            className="px-4 py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            Publish
          </button>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages || 1}
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
                {viewModal.eventName}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                {viewModal.eventDate}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                {viewModal.eventDescription || "No description available"}
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
              <h3 className="text-sm sm:text-lg font-bold">Edit Upcoming Events</h3>
              <button
                onClick={() => setEditModal(null)}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Description
                </label>
                <textarea
                  value={formData.eventDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDescription: e.target.value })
                  }
                  rows="3"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => setEditModal(null)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-blue-700"
                >
                  Update
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
              <h3 className="text-sm sm:text-lg font-bold">Add Upcoming Events</h3>
              <button
                onClick={() => setAddModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Event Description
                </label>
                <textarea
                  placeholder="Write here"
                  value={formData.eventDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDescription: e.target.value })
                  }
                  rows="3"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => setAddModal(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-blue-700"
                >
                  Save
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
              <h3 className="text-sm sm:text-lg font-bold">Publish Upcoming Events</h3>
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
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UpcomingEvents;
