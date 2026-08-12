import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock } from "lucide-react";
import useToastMessage from "../../utils/useToastMessage";
import {
  getPortalUpcomingEventsAsync,
  clearError,
  clearSuccess,
} from "../../features/common/portal/portalUpcomingEventSlice";

const UpcomingEvents = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role) || "ADMIN";
  const { todayEvents, earlierEvents, loading, error, success } = useSelector(
    (state) => state.portalUpcomingEvent
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
    if (selectedDate) params.eventDate = selectedDate;

    dispatch(getPortalUpcomingEventsAsync({ role, ...params }));
  }, [dispatch, role, searchTitle, selectedDate]);

  useToastMessage({
    success,
    error,
    successMessage: "Events loaded successfully",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
          <p className="text-sm text-gray-600">Home / Upcoming Events</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Title Section */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Events Lists</h2>
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
                <p className="text-sm text-gray-500">Loading events...</p>
              </div>
            ) : (
              <>
                {/* Today Section */}
                {todayEvents.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Today</h3>
                    <div className="space-y-4">
                      {todayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-r transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 flex-1">
                              <span className="flex-shrink-0 text-2xl">📅</span>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {event.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">{event.eventDate}</p>
                                <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                                <Clock size={14} />
                                <span>{event.eventTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Earlier Section */}
                {earlierEvents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Earlier</h3>
                    <div className="space-y-4">
                      {earlierEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-r transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 flex-1">
                              <span className="flex-shrink-0 text-2xl">📅</span>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {event.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">{event.eventDate}</p>
                                <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                                <Clock size={14} />
                                <span>{event.eventTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {todayEvents.length === 0 && earlierEvents.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-500">No events found</p>
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

export default UpcomingEvents;
