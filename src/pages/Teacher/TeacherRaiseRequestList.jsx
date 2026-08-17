import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import { fetchTeacherTimetableRequestsAsync } from "../../features/teacher/Timetable/teacherTimetableSlice";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

const getTiming = (item) => {
  if (item.timing) return item.timing;
  if (item.time) return item.time;
  if (item.startTime || item.endTime) {
    return `${item.startTime || "-"} - ${item.endTime || "-"}`;
  }
  return "-";
};

export default function TeacherRaiseRequestList() {
  const dispatch = useDispatch();
  const {
    requests,
    requestsTotalPages,
    loading,
  } = useSelector((state) => state.teacherTimetable);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(
      fetchTeacherTimetableRequestsAsync({
        page: currentPage - 1,
        size: rowsPerPage,
        search: search || undefined,
      }),
    );
  }, [currentPage, dispatch, rowsPerPage, search]);

  const filtered = useMemo(
    () =>
      (requests || []).filter((item) =>
        `${item.subjectName ?? item.subject?.subjectName ?? ""} ${item.className ?? item.class?.className ?? ""} ${item.status ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [requests, search],
  );

  const totalPages = Math.max(1, Number(requestsTotalPages) || 1);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Raise Request List</h1>
        <p className="text-sm text-gray-500">Teacher / Raise Request List</p>
      </div>

      <div className="card">
        <div className="card-section">Request List</div>
        <div className="p-3 sm:p-4">
          <div className="flex justify-end mb-3">
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="form-input pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto border rounded">
            <table className="w-full min-w-[800px] text-[12px]">
              <thead className="thead-row">
                <tr>
                  <th className="px-3 py-3 text-left">S.No.</th>
                  <th className="px-3 py-3 text-left">Subject</th>
                  <th className="px-3 py-3 text-left">Class</th>
                  <th className="px-3 py-3 text-left">Section</th>
                  <th className="px-3 py-3 text-left">Timing</th>
                  <th className="px-3 py-3 text-left">Request Date</th>
                  <th className="px-3 py-3 text-left">Comments</th>
                  <th className="px-3 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-10 text-center">
                      Loading requests...
                    </td>
                  </tr>
                ) : !filtered.length ? (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-gray-500">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={item.id ?? index} className="border-t">
                      <td className="px-3 py-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-3 py-3">
                        {item.subjectName ?? item.subject?.subjectName ?? "-"}
                      </td>
                      <td className="px-3 py-3">
                        {item.className ?? item.class?.className ?? "-"}
                      </td>
                      <td className="px-3 py-3">
                        {item.section ?? item.class?.section ?? "-"}
                      </td>
                      <td className="px-3 py-3">{getTiming(item)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {formatDate(item.requestDate ?? item.createdAt)}
                      </td>
                      <td className="px-3 py-3">{item.comments ?? item.reason ?? "-"}</td>
                      <td className="px-3 py-3">{item.status ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
