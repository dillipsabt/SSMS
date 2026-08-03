import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import RaiseRequest from "../../components/Teacher/RaiseRequest";
import { fetchTeacherTimetableAsync } from "../../features/teacher/Timetable/teacherTimetableSlice";

const getSchedules = (data) => {
  const schedules = data?.content ?? data?.items ?? (Array.isArray(data) ? data : [data]);
  return Array.isArray(schedules) ? schedules.filter(Boolean) : [];
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTiming = (item) => {
  if (item.timing) return item.timing;
  if (item.time) return item.time;
  if (item.startTime || item.endTime) {
    return `${item.startTime || "-"} - ${item.endTime || "-"}`;
  }
  if (item.timeSlot) {
    return `${item.timeSlot.startTime || "-"} - ${item.timeSlot.endTime || "-"}`;
  }
  return "-";
};

const getSubjectName = (item) =>
  item.subjectName ?? item.subject?.subjectName ?? item.subject?.name ?? "-";

const getClassName = (item) => item.className ?? item.class?.className ?? "-";

const getSection = (item) => item.section ?? item.class?.section ?? "-";

const getScheduleItems = (schedule) =>
  schedule.scheduleItems ?? schedule.teacherScheduleDetails ?? schedule.slots ?? [];

export default function TeacherTimetable() {
  const dispatch = useDispatch();
  const { timetable, loading } = useSelector((state) => state.teacherTimetable);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(() => new Set([0]));
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchTeacherTimetableAsync());
  }, [dispatch]);

  const schedules = useMemo(() => getSchedules(timetable), [timetable]);
  const filteredSchedules = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return schedules.filter((schedule) => {
      const items = getScheduleItems(schedule);
      const matchesSearch = !normalizedSearch || items.some((item) =>
        `${getSubjectName(item)} ${getClassName(item)} ${getSection(item)}`
          .toLowerCase()
          .includes(normalizedSearch)
      );
      const matchesDate =
        !dateFilter ||
        schedule.startDate === dateFilter ||
        schedule.endDate === dateFilter ||
        schedule.createdDate === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [dateFilter, schedules, search]);

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / rowsPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleSchedules = filteredSchedules.slice(
    (visiblePage - 1) * rowsPerPage,
    visiblePage * rowsPerPage
  );
  const allScheduleItems = schedules.flatMap((schedule) => getScheduleItems(schedule));
  const teacher = schedules[0];

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const toggleRow = (index) => {
    setExpandedRows((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Teachers Timetable
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Teacher / Teachers Timetable
        </p>
      </div>

      <div className="card">
        <div className="card-section">Teacher Class Timetable Lists</div>

        {teacher && (
          <div className="grid grid-cols-1 gap-3 border-b border-gray-200 px-4 py-4 sm:grid-cols-4 dark:border-gray-700">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Teacher Name</p>
              <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-100">
                {teacher.teacherName || "-"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Date Range</p>
              <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-100">
                {formatDate(teacher.startDate)} - {formatDate(teacher.endDate)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Created Date</p>
              <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-100">
                {formatDate(teacher.createdDate)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Status</p>
              <span className="mt-1 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {teacher.status || "-"}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 border-b border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-end dark:border-gray-700">
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            className="form-input w-full sm:w-36"
            aria-label="Filter by date"
          />
          <div className="relative w-full sm:w-56">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search subject"
              className="form-input w-full pl-9"
              aria-label="Search subject"
            />
          </div>
        </div>

        <div className="overflow-x-auto px-3 pb-3 sm:px-4 sm:pb-4">
          <table className="w-full min-w-[680px] text-[11px] text-gray-700 dark:text-gray-200">
            <thead className="thead-row">
              <tr>
                <th className="w-10 px-3 py-2 text-left"> </th>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Published Date</th>
                <th className="px-3 py-2 text-left">Scheduled Date Range</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500 dark:text-gray-400">
                    Loading timetable...
                  </td>
                </tr>
              ) : !visibleSchedules.length ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No published timetable found
                  </td>
                </tr>
              ) : (
                visibleSchedules.map((schedule, index) => {
                  const scheduleIndex = (visiblePage - 1) * rowsPerPage + index;
                  const isExpanded = expandedRows.has(scheduleIndex);
                  const items = getScheduleItems(schedule);

                  return (
                    <tr key={schedule.id ?? scheduleIndex} className="border-b border-gray-200 dark:border-gray-700">
                      <td colSpan="4" className="p-0">
                        <div className="grid grid-cols-[40px_70px_1fr_1fr] items-center bg-white dark:bg-gray-800">
                          <button
                            type="button"
                            onClick={() => toggleRow(scheduleIndex)}
                            className="flex h-9 items-center justify-center text-gray-700 dark:text-gray-200"
                            aria-label={isExpanded ? "Collapse timetable" : "Expand timetable"}
                          >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <span className="px-3 py-2">{scheduleIndex + 1}</span>
                          <span className="px-3 py-2">{formatDate(schedule.createdDate)}</span>
                          <span className="px-3 py-2">
                            {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                          </span>
                        </div>
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/40 sm:px-10">
                            <table className="w-full text-[11px]">
                              <thead className="bg-blue-50 text-gray-700 dark:bg-blue-900/30 dark:text-gray-200">
                                <tr>
                                  <th className="px-3 py-2 text-left">S.No.</th>
                                  <th className="px-3 py-2 text-left">Subject</th>
                                  <th className="px-3 py-2 text-left">Class</th>
                                  <th className="px-3 py-2 text-left">Section</th>
                                  <th className="px-3 py-2 text-left">Timing</th>
                                  <th className="px-3 py-2 text-left">Slot Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.length ? items.map((item, itemIndex) => (
                                  <tr key={item.id ?? itemIndex} className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="px-3 py-2">{itemIndex + 1}</td>
                                    <td className="px-3 py-2">{getSubjectName(item)}</td>
                                    <td className="px-3 py-2">{getClassName(item)}</td>
                                    <td className="px-3 py-2">{getSection(item)}</td>
                                    <td className="px-3 py-2">{formatTiming(item)}</td>
                                    <td className="px-3 py-2">{item.slotType || item.timeSlot?.slotType || "-"}</td>
                                  </tr>
                                )) : (
                                  <tr>
                                    <td colSpan="6" className="py-4 text-center text-gray-500 dark:text-gray-400">
                                      No timetable entries found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && filteredSchedules.length > 0 && (
            <Pagination
              currentPage={visiblePage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              setCurrentPage={setCurrentPage}
              setRowsPerPage={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>

      {/* <div className="flex justify-end">
        <button type="button" onClick={() => setOpenModal(true)} className="btn-primary">
          Raise Request
        </button>
      </div> */}

      <RaiseRequest
        open={openModal}
        onClose={() => setOpenModal(false)}
        scheduleItems={allScheduleItems}
      />
    </div>
  );
}
