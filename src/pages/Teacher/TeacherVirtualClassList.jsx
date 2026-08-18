import React, { useState } from "react";
import {
  Search,
  Eye,
  Video,
  Share2,
  MoreVertical,
  X,
  CheckSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublishModal from "../../components/common/PublishModal";

const classes = [
  {
    id: 1,
    topic: "Advanced Quantum Mechanics",
    subject: "Physics",
    createdDate: "02/01/2026",
    teacher: "Rama Krishna",
    role: "Admin",
    classSection: "10-A",
    scheduleDate: "02/01/2026",
    time: "09:00 AM",
    duration: "90 Mins",
    status: "Live",
    unit: "Unit 1: Calculus",
    chapter: "Chapter 3: Integration",
    description: "Physics class start with new topics.",
    endTime: "10:00AM",
    meetingUrl: "https://meeting.usj/123xyz",
  },
  {
    id: 2,
    topic: "Multivariate Calculus II",
    subject: "Maths",
    createdDate: "02/01/2026",
    teacher: "Rani",
    role: "Teacher",
    classSection: "9-B",
    scheduleDate: "02/01/2026",
    time: "10:00 AM",
    duration: "90 Mins",
    status: "Completed",
    unit: "Unit 2: Algebra",
    chapter: "Chapter 1: Limits",
    description: "Multivariate calculus session.",
    endTime: "11:00AM",
    meetingUrl: "https://meeting.usj/456abc",
  },
  {
    id: 3,
    topic: "World History: Renaissance",
    subject: "Social",
    createdDate: "02/01/2026",
    teacher: "Naresh",
    role: "Teacher",
    classSection: "6-A",
    scheduleDate: "02/01/2026",
    time: "11:00 AM",
    duration: "90 Mins",
    status: "Upcoming",
    unit: "Unit 3: History",
    chapter: "Chapter 2: Medieval",
    description: "World history renaissance era.",
    endTime: "12:00PM",
    meetingUrl: "https://meeting.usj/789def",
  },
  {
    id: 4,
    topic: "Advanced Quantum Mechanics",
    subject: "Physics",
    createdDate: "02/01/2026",
    teacher: "Veera",
    role: "Teacher",
    classSection: "8-A",
    scheduleDate: "02/01/2026",
    time: "12:00 PM",
    duration: "90 Mins",
    status: "Live",
    unit: "Unit 1: Calculus",
    chapter: "Chapter 3: Integration",
    description: "Advanced quantum mechanics session.",
    endTime: "01:00PM",
    meetingUrl: "https://meeting.usj/321ghi",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Live":
      return { bg: "bg-green-100", text: "text-green-600" };
    case "Completed":
      return { bg: "bg-purple-100", text: "text-purple-600" };
    case "Upcoming":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
};

export default function TeacherVirtualClassList() {
  const [showDetails, setShowDetails] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [publishToStudent, setPublishToStudent] = useState(true);
  const [publishNote, setPublishNote] = useState("Ready to publish.");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const totalPages = Math.max(1, Math.ceil(classes.length / rowsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const startIndex = (visiblePage - 1) * rowsPerPage;
  const paginatedClasses = classes.slice(startIndex, startIndex + rowsPerPage);

  const handleOpenDetails = (item) => {
    setSelectedClass(item);
    setShowDetails(true);
    setOpenMenu(null);
  };

  const handleOpenPublish = (item) => {
    setSelectedClass(item);
    setShowPublish(true);
    setOpenMenu(null);
  };

  return (
    <div className="p-3 sm:p-6 min-h-screen bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Virtual Class List
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        Home / LMS / Virtual Class List
      </p>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 text-sm sm:text-base">
          Virtual Class List
        </div>

        {/* Filters */}
        <div className="p-3 sm:p-4 flex flex-wrap gap-2 justify-end">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Teacher Name"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded text-xs sm:text-sm w-40 sm:w-auto"
            />
          </div>
          <input
            type="date"
            className="pl-3 pr-8 py-2 border border-gray-200 rounded text-xs sm:text-sm"
          />
          <select className="pl-3 pr-8 py-2 border border-gray-200 rounded text-xs sm:text-sm">
            <option>Select Subject</option>
            <option>Physics</option>
            <option>Maths</option>
            <option>Social</option>
          </select>
          <select className="pl-3 pr-8 py-2 border border-gray-200 rounded text-xs sm:text-sm">
            <option>Select Status</option>
            <option>Live</option>
            <option>Completed</option>
            <option>Upcoming</option>
          </select>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto px-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-gray-600 text-left">
                <th className="p-3 font-semibold">S.No.</th>
                <th className="p-3 font-semibold">Topic Name</th>
                <th className="p-3 font-semibold">Created Date</th>
                <th className="p-3 font-semibold">Admin / Teacher Name</th>
                <th className="p-3 font-semibold">Class</th>
                <th className="p-3 font-semibold">Schedule Date</th>
                <th className="p-3 font-semibold">Time & Duration</th>
                <th className="p-3 font-semibold">View Details</th>
                <th className="p-3 font-semibold">Join Class</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Recorded Session</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClasses.map((item, index) => {
                const statusStyle = getStatusStyle(item.status);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-gray-600">{startIndex + index + 1}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-800">
                        {item.topic}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.subject}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{item.createdDate}</td>
                    <td className="p-3">
                      <div className="text-gray-800">{item.teacher}</div>
                      <div className="text-xs text-gray-500">{item.role}</div>
                    </td>
                    <td className="p-3 text-gray-600">{item.classSection}</td>
                    <td className="p-3 text-gray-600">{item.scheduleDate}</td>
                    <td className="p-3">
                      <div className="text-gray-800">{item.time}</div>
                      <div className="text-xs text-gray-500">
                        {item.duration}
                      </div>
                    </td>
                    <td className="p-3">
                      <Eye
                        size={20}
                        className="text-indigo-500 cursor-pointer hover:text-indigo-700"
                        onClick={() => handleOpenDetails(item)}
                      />
                    </td>
                    <td className="p-3">
                      <button
                        className={`px-4 py-1.5 rounded text-white text-xs font-medium ${
                          item.status === "Completed"
                            ? "bg-indigo-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                        disabled={item.status === "Completed"}
                      >
                        Join
                      </button>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.status === "Completed" && (
                        <Video
                          size={20}
                          className="text-indigo-500 cursor-pointer hover:text-indigo-700"
                          onClick={() => navigate(`/recorded-classes`)}
                        />
                      )}
                    </td>
                    <td className="p-3 relative">
                      {item.status === "Completed" ? (
                        <Share2
                          size={18}
                          className="text-indigo-500 cursor-pointer hover:text-indigo-700"
                          onClick={() => handleOpenPublish(item)}
                        />
                      ) : (
                        <>
                          <MoreVertical
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                            onClick={() =>
                              setOpenMenu(openMenu === item.id ? null : item.id)
                            }
                          />
                          {openMenu === item.id && (
                            <div className="absolute right-6 top-8 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[100px]">
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                onClick={() => {
                                  alert(`Cancelled class ${item.id}`);
                                  setOpenMenu(null);
                                }}
                              >
                                <span className="text-red-400">⊗</span> Cancel
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden px-3 pb-3 space-y-3">
          {paginatedClasses.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {item.topic}
                    </div>
                    <div className="text-xs text-gray-500">{item.subject}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Teacher:</span> {item.teacher}
                  </div>
                  <div>
                    <span className="font-medium">Class:</span>{" "}
                    {item.classSection}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {item.scheduleDate}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {item.time}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>{" "}
                    {item.duration}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <Eye
                    size={18}
                    className="text-indigo-500 cursor-pointer"
                    onClick={() => handleOpenDetails(item)}
                  />
                  {item.status === "Completed" && (
                    <>
                      <Video
                        size={18}
                        className="text-indigo-500 cursor-pointer"
                        onClick={() => navigate(`/recorded-classes`)}
                      />
                      <Share2
                        size={18}
                        className="text-indigo-500 cursor-pointer"
                        onClick={() => handleOpenPublish(item)}
                      />
                    </>
                  )}
                  {item.status !== "Completed" && (
                    <button className="ml-auto px-4 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 sm:gap-3 p-3 sm:p-4 flex-wrap">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))}
            disabled={visiblePage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(totalPages, visiblePage + 1))}
            disabled={visiblePage === totalPages}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
          <span className="text-sm text-gray-600">
            Page: {visiblePage} of {totalPages}
          </span>
          <select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="form-select w-auto"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetails && selectedClass && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setShowDetails(false)}
        >
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-indigo-600 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-t-lg flex justify-between items-center">
              <h2 className="font-semibold text-base sm:text-lg">
                View Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Class Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                  Class Details
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Title / Topic Name
                    </p>
                    <p className="text-gray-600">{selectedClass.topic}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Subject</p>
                    <p className="text-gray-600">{selectedClass.subject}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Unit / Module
                    </p>
                    <p className="text-gray-600">{selectedClass.unit}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Chapter</p>
                    <p className="text-gray-600">{selectedClass.chapter}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Class / section
                    </p>
                    <p className="text-gray-600">
                      {selectedClass.classSection}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Teacher Name
                    </p>
                    <p className="text-gray-600">{selectedClass.teacher}</p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="font-semibold text-gray-700 mb-1">
                      Description
                    </p>
                    <p className="text-gray-600">{selectedClass.description}</p>
                  </div>
                </div>
              </div>

              {/* Schedule & Timing */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                  Schedule & Timing
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Date</p>
                    <p className="text-gray-600">12/09/2026</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Start Time
                    </p>
                    <p className="text-gray-600">{selectedClass.time}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">End Time</p>
                    <p className="text-gray-600">{selectedClass.endTime}</p>
                  </div>
                </div>
              </div>

              {/* Virtual Room Link */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                  Virtual Room Link
                </div>
                <div className="p-4 text-sm">
                  <p className="font-semibold text-gray-700 mb-1">
                    Meeting URL
                  </p>
                  <a
                    href={selectedClass.meetingUrl}
                    className="text-indigo-600 hover:underline break-all"
                  >
                    {selectedClass.meetingUrl}
                  </a>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-5 py-2 border border-red-400 text-red-500 rounded hover:bg-red-50 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPublish && selectedClass && (
        <PublishModal
          title="Publish Virtual Class"
          subtitle={`${selectedClass.topic} · ${selectedClass.subject}`}
          options={{ publishToStudent }}
          optionDefinitions={[{ key: "publishToStudent", label: "Publish to student portal" }]}
          notes={publishNote}
          onChange={(_, value) => setPublishToStudent(value)}
          onNotesChange={setPublishNote}
          onClose={() => setShowPublish(false)}
          onSubmit={() => setShowPublish(false)}
          submitLabel="Publish"
        />
      )}
    </div>
  );
}
