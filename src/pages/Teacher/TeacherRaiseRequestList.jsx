import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import { fetchTeacherRaiseRequests } from "../../features/teacher/RaiseRequests/teacherRaiseRequestsSlice";

const TeacherRaiseRequestList = () => {
  const dispatch = useDispatch();
  const { raiseRequests, loading, error } = useSelector(
    (state) => state.teacherRaiseRequests
  );
  const teacherId = localStorage.getItem("profileId");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherRaiseRequests(teacherId));
    }
  }, [dispatch, teacherId]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = (raiseRequests || []).slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil((raiseRequests || []).length / rowsPerPage);

  return (
    <div className="w-full">
      {/* PAGE HEADER */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-2xl font-bold text-gray-800">
          Raise Request List
        </h1>
        <p className="text-sm text-gray-800">Teacher / Raise Request List</p>
      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {/* CARD HEADER */}
        <div className="border-b border-gray-300 px-2 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Request List</h2>
        </div>

        {/* TABLE CONTAINER */}
        <div className="p-2 overflow-x-auto">
          <div className="border-gray-300 flex justify-end p-2 items-center">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 px-2 py-1 text-sm rounded"
            />
          </div>

          {/* TABLE */}
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-indigo-50 text-gray-600">
              <tr>
                <th className="p-2">S.No.</th>
                <th className="p-2">Date</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Class</th>
                <th className="p-2">Request Date</th>
                <th className="p-2">Request Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Comments</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="p-2">{indexOfFirst + index + 1}</td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.requestedSubjectName}</td>
                  <td className="p-2">{item.requestedClassName}</td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.requestedSlotTime}</td>

                  {/* STATUS */}
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-2">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 p-6">
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
    </div>
  );
};

export default TeacherRaiseRequestList;
