import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye, Trash2, X } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchAllAnnouncements,
  fetchAnnouncementById,
  deleteAnnouncementAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/Announcements/announcementsSlice";
 
const AnnouncementsList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewingModal, setViewingModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
 
  const {
    announcementList,
    currentAnnouncement,
    pagination,
    loading,
    error,
    success,
  } = useSelector((state) => state.announcements);
 
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
 
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
 
    return `${formattedDate} & ${formattedTime}`;
  };

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    loadAnnouncements();
  }, [currentPage, rowsPerPage]);

  useToastMessage({
    success,
    error,
    successMessage: "Announcement deleted successfully! ✅",
    clearSuccess,
    clearError,
    onSuccess: () => {
      loadAnnouncements();
    },
  });
 
  const loadAnnouncements = () => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(priorityFilter && { priority: priorityFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      //...(dateFilter && { createdDate: dateFilter }),
    };
    dispatch(fetchAllAnnouncements(params));
  };
 
  const handleSearch = () => {
    setCurrentPage(1);
    const params = {
      page: 0,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(priorityFilter && { priority: priorityFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      //...(dateFilter && { createdDate: dateFilter }),
    };
    dispatch(fetchAllAnnouncements(params));
  };
 
  const handleApplyFilters = () => {
    setCurrentPage(1);
    const params = {
      page: 0,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(priorityFilter && { priority: priorityFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      // ...(dateFilter && { createdDate: dateFilter }),
    };
 
    if (searchTerm || priorityFilter || statusFilter || fromDate || toDate) {
      toast.info("Applying filters...");
    }
 
    dispatch(fetchAllAnnouncements(params));
  };
 
  const handleViewAnnouncement = (announcementId) => {
    dispatch(fetchAnnouncementById(announcementId));
    setViewingModal({ id: announcementId });
  };
 
  const handleDeleteClick = (announcementId) => {
    setSelectedId(announcementId);
    setDeleteModal(true);
  };
 
  const confirmDelete = async () => {
    if (!selectedId) return;
 
    try {
      const res = await dispatch(deleteAnnouncementAsync(selectedId));
 
      if (res?.meta?.requestStatus === "fulfilled") {
        toast.success("Announcement deleted successfully! ✅");
        loadAnnouncements();
      } else {
        toast.error(res?.payload?.message || "Failed to delete announcement");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setDeleteModal(false);
      setSelectedId(null);
    }
  };
 
  const announcements = announcementList;
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase());
 
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
 
    const matchesStatus = !statusFilter || item.status === statusFilter;
 
    const createdDate = item.createdAt ? item.createdAt.split("T")[0] : "";
 
    const matchesDate =
      (!fromDate || createdDate >= fromDate) &&
      (!toDate || createdDate <= toDate);
 
    return matchesSearch && matchesPriority && matchesStatus && matchesDate;
  });
 
  const statusStyles = {
    PUBLISHED: {
      bg: "bg-green-100 border border-green-300",
      text: "text-green-800",
    },
    DRAFT: {
      bg: "bg-indigo-100 border border-indigo-300",
      text: "text-indigo-800",
    },
    SCHEDULED: {
      bg: "bg-blue-100 border border-blue-300",
      text: "text-blue-800",
    },
  };
 
  const priorityStyles = {
    HIGH: {
      bg: "bg-red-100 border border-red-300",
      text: "text-red-800",
    },
    MEDIUM: {
      bg: "bg-yellow-100 border border-yellow-300",
      text: "text-yellow-800",
    },
    LOW: {
      bg: "bg-green-100 border border-green-300",
      text: "text-green-800",
    },
  };
 
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };
 
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Announcement Lists</h2>
      </div>
 
      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search Title, Keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
 
            <div className="w-full lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
 
            <div className="w-full lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
 
            <div className="w-full lg:w-44">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
 
            <div className="w-full lg:w-44">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
 
          <div className="flex justify-end">
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setSearchTerm("");
                setPriorityFilter("");
                setStatusFilter("");
                setFromDate("");
                setToDate("");
              }}
              className="ml-2 px-6 py-2 bg-gray-500 text-white font-medium text-sm rounded-md hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
 
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-12">
                S.No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Target Audience
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Delivery Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Publish Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {announcements && announcements.length > 0 ? (
              filteredAnnouncements.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.targetAudience}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.deliveryType}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                        ${priorityStyles[item.priority]?.bg || "bg-gray-100"}
                        ${priorityStyles[item.priority]?.text || "text-gray-700"}
                      `}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateTime(item.publishDate)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                        ${statusStyles[item.status]?.bg || "bg-gray-100 border border-gray-300"}
                        ${statusStyles[item.status]?.text || "text-gray-700"}
                      `}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleViewAnnouncement(item.id)}
                        title="View"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        title="Delete"
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-4 text-center text-sm text-gray-600"
                >
                  {loading ? "Loading..." : "No announcements found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
 
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages || 1}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
 
      {/* View Modal */}
      {viewingModal && currentAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                View Announcement
              </h3>
              <button
                onClick={() => setViewingModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
 
            <h4 className="font-semibold text-gray-900 mb-1">
              {currentAnnouncement.title}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {formatDate(currentAnnouncement.createdAt)}
            </p>
 
            <p className="text-sm text-gray-700 mb-6">
              {currentAnnouncement.description}
            </p>
 
            <button
              onClick={() => setViewingModal(null)}
              className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
 
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
 
export default AnnouncementsList;
