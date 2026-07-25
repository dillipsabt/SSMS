import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import {
  fetchStudentNotifications,
  fetchTeacherNotifications,
  markAsRead,
  setSelectedNotification,
} from "../../features/Notifications/notificationsSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [selectedNotif, setSelectedNotif] = useState(null);

  const { notificationsList, loading, error } = useSelector(
    (state) => state.userNotifications
  );

  useEffect(() => {
    if (role === "student-portal") {
      dispatch(fetchStudentNotifications());
    } else if (role === "teacher-portal") {
      dispatch(fetchTeacherNotifications());
    }
  }, [dispatch, role]);

  const handleNotificationClick = (notification) => {
    setSelectedNotif(notification);
    if (!notification.isRead) {
      dispatch(markAsRead(notification.id));
    }
  };

  const closeModal = () => {
    setSelectedNotif(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return diffInMins < 1 ? "Just now" : `${diffInMins}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const groupNotifications = () => {
    const today = [];
    const earlier = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    notificationsList.forEach((notif) => {
      const notifDate = new Date(notif.createdAt);
      notifDate.setHours(0, 0, 0, 0);

      if (notifDate.getTime() === now.getTime()) {
        today.push(notif);
      } else {
        earlier.push(notif);
      }
    });

    return { today, earlier };
  };

  const { today, earlier } = groupNotifications();

  if (loading && notificationsList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-600 text-sm">Home / Notifications</p>
        </div>

        {/* Today Section */}
        {today.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Today
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {today.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {notif.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">
                        {formatDate(notif.createdAt)}
                      </p>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earlier Section */}
        {earlier.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Earlier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earlier.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {notif.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">
                        {formatDate(notif.createdAt)}
                      </p>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notificationsList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedNotif.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(selectedNotif.createdAt)}
                </p>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedNotif.description}
              </p>

              {selectedNotif.category && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {selectedNotif.category}
                  </span>
                </div>
              )}

              {selectedNotif.priority && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Priority:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedNotif.priority === "HIGH"
                        ? "bg-red-100 text-red-700"
                        : selectedNotif.priority === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedNotif.priority}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={closeModal}
              className="w-full mt-6 bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
