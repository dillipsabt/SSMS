import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Eye, Trash2, X } from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import useToastMessage from '../../utils/useToastMessage';
import {
  fetchAllNotifications,
  fetchNotificationById,
  deleteNotificationAsync,
  clearSuccess,
  clearError,
} from '../../features/Admin/Notifications/notificationSlice';

const NotificationsList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewingModal, setViewingModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    notificationList,
    currentNotification,
    pagination,
    loading,
    error,
    success,
  } = useSelector((state) => state.notification);

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
    loadNotifications();
  }, [currentPage, rowsPerPage]);

  useToastMessage({
    success,
    error,
    successMessage: 'Notification deleted successfully! ✅',
    clearSuccess,
    clearError,
    onSuccess: () => {
      loadNotifications();
    },
  });

  const loadNotifications = () => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(audienceFilter && { audience: audienceFilter }),
      ...(dateFilter && { fromDate: dateFilter }),
    };
    dispatch(fetchAllNotifications(params));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    const params = {
      page: 0,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(audienceFilter && { audience: audienceFilter }),
      ...(dateFilter && { fromDate: dateFilter }),
    };
    dispatch(fetchAllNotifications(params));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    const params = {
      page: 0,
      size: rowsPerPage,
      ...(searchTerm && { keyword: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(audienceFilter && { audience: audienceFilter }),
      ...(dateFilter && { fromDate: dateFilter }),
    };

    if (searchTerm || statusFilter || audienceFilter || dateFilter) {
      toast.info('Applying filters...');
    }

    dispatch(fetchAllNotifications(params));
  };

  const handleViewNotification = (notificationId) => {
    dispatch(fetchNotificationById(notificationId));
    setViewingModal({ id: notificationId });
  };

  const handleDeleteClick = (notificationId) => {
    setSelectedId(notificationId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await dispatch(deleteNotificationAsync(selectedId));

      if (res?.meta?.requestStatus === 'fulfilled') {
        toast.success('Notification deleted successfully! ✅');
        loadNotifications();
      } else {
        toast.error(
          res?.payload?.message ||
          'Failed to delete notification'
        );
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteModal(false);
      setSelectedId(null);
    }
  };


  const notifications = notificationList;

  const statusStyles = {
    SENT: {
      bg: "bg-green-100 border border-green-300",
      text: "text-green-800",
    },
    DRAFT: {
      bg: "bg-indigo-100 border border-indigo-300",
      text: "text-indigo-800",
    },
  };

  const priorityStyles = {
    HIGH: {
      bg: "bg-yellow-100 border border-yellow-300",
      text: "text-yellow-800",
    },
    NORMAL: {
      bg: "bg-green-100 border border-green-300",
      text: "text-green-800",
    },
    URGENT: {
      bg: "bg-red-100 border border-red-300",
      text: "text-red-800",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Notification Lists</h2>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search Title, Keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="w-full lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="SENT">Sent</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="w-full lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select Audience</option>
                <option value="ALL">All</option>
                <option value="ALL_STUDENTS">All Students</option>
                <option value="STUDENT">Student</option>
                <option value="CLASS">Class</option>
                <option value="SECTION">Section</option>
                <option value="STUDENT_GROUP">Student Group</option>
                <option value="ALL_TEACHERS">All Teachers</option>
                <option value="TEACHER">Teacher</option>
                <option value="TEACHER_DEPARTMENT">Teacher Department</option>
                <option value="SUBJECT_TEACHERS">Subject Teachers</option>
                <option value="STUDENTS_AND_TEACHERS">Students & Teachers</option>
              </select>
            </div>

            <div className="w-full lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleApplyFilters} className="px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-12">S.No.</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Target Audience</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Delivery Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Scheduled Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications && notifications.length > 0 ? (
              notifications.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.targetAudience}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.deliveryType}</td>
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
                    {formatDateTime(item.expiryDateTime)}
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
                        onClick={() => handleViewNotification(item.id)}
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
                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-600">
                  {loading ? 'Loading...' : 'No notifications found'}
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
      {viewingModal && currentNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">View Notification</h3>
              <button
                onClick={() => setViewingModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <h4 className="font-semibold text-gray-900 mb-1">{currentNotification.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{formatDate(currentNotification.createdAt)}</p>

            <p className="text-sm text-gray-700 mb-6">{currentNotification.description}</p>

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
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default NotificationsList;
