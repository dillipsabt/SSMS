import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronRight, Pencil, Trash2, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchTimetable,
  removeTimetable,
  publishTimetable,
} from "../../features/Admin/teacherTimetable/teacherTimetableSlice";
import { getTeachers } from "../../features/Admin/Teacher/teacherServiceApi";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import Pagination from "../../components/common/Pagination";

const formatTime = (time) => {
  if (!time) return "";

  const [hourStr, minuteStr] = time.split(":");

  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour.toString().padStart(2, "0")}:${minute}${ampm}`;
};

const getTimeRange = (slot) => {
  if (!slot?.timeSlot) return "-";

  return `${formatTime(slot.timeSlot.startTime)} - ${formatTime(
    slot.timeSlot.endTime
  )}`;
};

const TeachersTimetable = () => {
  const [openRow, setOpenRow] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentTeacherId, setCurrentTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] =
    useState([]);

  const navigate = useNavigate();
  const { teacherId } = useParams();
  const dispatch = useDispatch();
  const { data = [], loading } = useSelector((state) => state.timetable);

  /* ✅ SET TEACHER */
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await getTeachers();
        const teacherList = res.data || [];

        setTeachers(teacherList);

        if (teacherId) {
          setCurrentTeacherId(Number(teacherId));
        }
      } catch (err) {
        console.error("TEACHER FETCH ERROR ❌", err);
      }
    };

    loadTeachers();
  }, [teacherId]);


  /* ✅ FETCH TIMETABLE */
 useEffect(() => {
  dispatch(fetchTimetable());
}, [dispatch]);

  /* ✅ DELETE */
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {

    const res = await dispatch(
      removeTimetable(selectedId)
    );

    if (
      res?.meta?.requestStatus === "fulfilled"
    ) {

      toast.success(
        "Timetable deleted successfully"
      );

      // optional refresh
      dispatch(
        fetchTimetable({
          teacherId: currentTeacherId,
          date: fromDate,
        })
      );

    } else {

      toast.error(
        res?.payload?.message ||
        "Failed to delete timetable"
      );
    }

    setDeleteModal(false);

    setSelectedId(null);
  };

  const handlePublish = async () => {
    if (selectedRows.length === 0) {
      toast.error(
        "Please select timetable"
      );
      return;
    }

    const res = await dispatch(
      publishTimetable(selectedRows)
    );

    if (
      res?.meta?.requestStatus ===
      "fulfilled"
    ) {
      toast.success(
        "Timetable published successfully"
      );

      dispatch(
        fetchTimetable({
          teacherId: currentTeacherId,
          date: fromDate,
        })
      );

      setSelectedRows([]);
    } else {
      toast.error(
        "Failed to publish timetable"
      );
    }
  };

  /* ✅ EDIT */
  const handleEdit = (row) => {

    navigate(
      `/add-schedule/${row.id}?teacherId=${row.teacherId}&date=${row.scheduleDate}`
    );
  };

  /* ✅ FILTERED DATA */
  const filteredData = data.filter((row) => {
  const matchSearch =
    !search ||
    String(row.teacher || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchTeacher =
    !currentTeacherId ||
    row.teacherId === Number(currentTeacherId);

  const matchDate =
    !fromDate ||
    row.scheduleDate === fromDate;

  return (
    matchSearch &&
    matchTeacher &&
    matchDate
  );
});

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentTimetables = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="p-3 sm:p-6 bg-[#f4f6f9] min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#2c3e50]">
            Teachers Timetable
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Teacher / Teachers Timetable
          </p>
        </div>
        <button
          onClick={() => navigate("/add-schedule")}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm px-4 py-1.5 rounded transition"
        >
          + Add Schedule
        </button>
      </div>

      {/* CARD */}
      <div className="card p-3 sm:p-4">

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Teachers Schedule List
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div >
              <select
                value={currentTeacherId || ""}
                onChange={(e) =>
                  setCurrentTeacherId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                className="border border-gray-300 px-2 py-1 text-[12px]"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || t.fullName}
                  </option>
                ))}
              </select>
            </div>
            {/* Date range filter */}
            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 text-[12px] text-gray-500 bg-white">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="outline-none text-[12px] text-gray-700 w-[110px] bg-transparent"
              />
              {/* <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="outline-none text-[12px] text-gray-700 w-[110px] bg-transparent"
              /> */}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-[160px]">
              <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 text-[12px] px-2 py-1 rounded w-full pr-6 focus:outline-none focus:border-brand-600"
              />
              <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 w-8"></th>
                <th className="px-3 py-2 w-8"></th>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Created Date</th>
                <th className="px-3 py-2 text-left">Teacher Name</th>
                <th className="px-3 py-2 text-left">Scheduled Date</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    No Timetable Found
                  </td>
                </tr>
              ) : (
                currentTimetables.map((row, i) => (
                  <React.Fragment key={row.id ?? i}>
                    {/* MAIN ROW */}
                    <tr className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2 cursor-pointer text-gray-500">
                        {openRow === i ? (
                          <ChevronDown
                            size={14}
                            onClick={() => setOpenRow(null)}
                            className="hover:text-brand-600"
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            onClick={() => setOpenRow(i)}
                            className="hover:text-brand-600"
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="accent-brand-600"
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows([
                                ...selectedRows,
                                row.id,
                              ]);
                            } else {
                              setSelectedRows(
                                selectedRows.filter(
                                  (id) => id !== row.id
                                )
                              );
                            }
                          }}
                          aria-label="Select row"
                        />
                      </td>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">{row.teacher}</td>
                      <td className="px-3 py-2">{row.scheduleDate}</td>
                      <td className="px-3 py-2">
                        {row.status && (
                          <span className="text-green-600 font-medium">
                            {row.status}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(row.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED SUB-TABLE */}
                    {openRow === i && (
                      <tr>
                        <td colSpan="8" className="bg-[#f7f9fc] px-6 py-3">
                          <table className="w-full border text-[12px] rounded overflow-hidden">
                            <thead className="thead-row">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium">S.No.</th>
                                <th className="px-3 py-2 text-left font-medium">Subject</th>
                                <th className="px-3 py-2 text-left font-medium">Class</th>
                                <th className="px-3 py-2 text-left font-medium">Timing</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(row.slots || []).map((item, idx) => (
                                <tr key={idx} className="border-t bg-white hover:bg-gray-50">
                                  <td className="px-3 py-2">{idx + 1}</td>
                                  <td className="px-3 py-2">{item.subjectName}</td>
                                  <td className="px-3 py-2">
                                    {item.className}
                                    {item.section ? ` - ${item.section}` : ""}
                                  </td>
                                  <td className="px-3 py-2">
                                    {getTimeRange(item)}
                                  </td>
                                </tr>
                              ))}
                              {(!row.slots || row.slots.length === 0) && (
                                <tr>
                                  <td colSpan="4" className="text-center py-3 text-gray-400">
                                    No slots found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      {/* PUBLISH BUTTON */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handlePublish}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-6 py-2 rounded transition"
        >
          Publish
        </button>
      </div>
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Timetable"
        message="Are you sure you want to delete this timetable?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default TeachersTimetable;
