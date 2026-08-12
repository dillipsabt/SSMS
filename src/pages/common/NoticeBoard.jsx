import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "lucide-react";
import useToastMessage from "../../utils/useToastMessage";
import {
  getPortalNoticesAsync,
  clearError,
  clearSuccess,
} from "../../features/common/portal/portalNoticeBoardSlice";

const NoticeBoard = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role) || "ADMIN";
  const { todayNotices, earlierNotices, loading, error, success } = useSelector(
    (state) => state.portalNoticeBoard
  );

  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchTitle) params.title = searchTitle;
    if (selectedDate) params.noticeDate = selectedDate;
    console.log("Fetching notices with params:", role, params);

    dispatch(getPortalNoticesAsync({ role, ...params }));
  }, [dispatch, role, searchTitle, selectedDate]);

  useToastMessage({
    success,
    error,
    successMessage: "Notices loaded successfully",
    clearSuccess,
    clearError,
  });

  const handleSearch = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice Board</h1>
          <p className="text-sm text-gray-600">Home / Notice Board</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Title Section */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Notice Board</h2>
          </div>

          {/* Search and Filter Section */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-end flex-wrap">
                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Title
                  </label>
                  <input
                    type="text"
                    placeholder="Search Title"
                    value={searchTitle}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date Filter */}
                <div className="w-full lg:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    dd/mm/yyyy
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-gray-500">Loading notices...</p>
              </div>
            ) : (
              <>
                {/* Today Section */}
                {todayNotices.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Today</h3>
                    <div className="space-y-4">
                      {todayNotices.map((notice) => (
                        <div
                          key={notice.id}
                          className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-gray-50 rounded-r transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 flex-1">
                              <span className="flex-shrink-0 text-2xl">📋</span>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {notice.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">{notice.noticeDate}</p>
                                <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                                  {notice.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Earlier Section */}
                {earlierNotices.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Earlier</h3>
                    <div className="space-y-4">
                      {earlierNotices.map((notice) => (
                        <div
                          key={notice.id}
                          className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-gray-50 rounded-r transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 flex-1">
                              <span className="flex-shrink-0 text-2xl">📋</span>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {notice.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">{notice.noticeDate}</p>
                                <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                                  {notice.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {todayNotices.length === 0 && earlierNotices.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-500">No notices found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
