import React, { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getTeachersAsync,
} from "../../features/admin/teacher/teacherSlice";

import {
  fetchTeacherRequests,
  approveTeacherRequestAsync,
  rejectTeacherRequestAsync,
} from "../../features/admin/Raiserequest/RaiserequestSlice";
import Pagination from "../../components/common/Pagination";
import { toast } from "sonner";

const statusStyle = {
  APPROVED: "bg-green-100 text-green-600",
  PENDING: "bg-yellow-100 text-yellow-600",
  REJECTED: "bg-red-100 text-red-600",
};

const RaiseRequestList = () => {
  const dispatch = useDispatch();

  const { teachers } = useSelector((state) => state.teacher);

  const { requests, loading } = useSelector(
    (state) => state.raiserequest
  );

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const [showModal, setShowModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const [actionType, setActionType] = useState("");

  const [reason, setReason] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState("");

  // LOAD TEACHERS
  useEffect(() => {
    dispatch(getTeachersAsync());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // LOAD REQUESTS
  useEffect(() => {

    if (
      selectedTeacher !== "" &&
      selectedTeacher !== null &&
      selectedTeacher !== undefined
    ) {

      dispatch(
        fetchTeacherRequests(selectedTeacher)
      );
    }

  }, [dispatch, selectedTeacher]);

  const handleAction = (item, type) => {
    setSelectedRow(item);

    setActionType(type);

    setShowModal(true);

    setOpenMenu(null);
  };

  const handleSubmit = async () => {

    const payload = {
      reason: reason || "-",
    };

    let res;

    if (actionType === "approve") {

      res = await dispatch(
        approveTeacherRequestAsync({
          id: selectedRow.id,
          payload,
        })
      );

    } else {

      res = await dispatch(
        rejectTeacherRequestAsync({
          id: selectedRow.id,
          payload,
        })
      );
    }

    if (
      res?.meta?.requestStatus === "fulfilled"
    ) {

      toast.success(
        actionType === "approve"
          ? "Request approved successfully! ✅"
          : "Request rejected successfully! ✅"
      );

      dispatch(
        fetchTeacherRequests(selectedTeacher)
      );

    } else {

      const errorMessage = typeof res?.payload === "string" ? res?.payload : res?.payload?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage} ❌`);
    }

    setShowModal(false);

    setReason("");
  };

  const filteredRequests = requests?.filter((item) =>
    item?.requestedSubjectName
      ?.toLowerCase()
      ?.includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * rowsPerPage;

  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentRequests = filteredRequests?.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredRequests?.length / rowsPerPage
  );

  return (
    <div>
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Raise Request List
      </h2>

      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Teacher / Raise Request List
      </p>

      {/* CARD */}
      <div className="card p-3 sm:p-4">

        {/* TOP */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">

          <h3 className="text-sm font-medium text-gray-700">
            Request List
          </h3>

          <div className="flex flex-col sm:flex-row gap-2">

            {/* TEACHER DROPDOWN */}
            <select
              value={selectedTeacher}
              onChange={(e) => {
                const value = e.target.value;

                setSelectedTeacher(
                  value ? Number(value) : ""
                );
              }}
              className="border border-gray-300 text-xs sm:text-sm rounded px-3 py-2"
            >
              <option value="">
                Select Teacher
              </option>

              {teachers?.map((teacher) => (
                <option
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.fullName}
                </option>
              ))}
            </select>

            {/* SEARCH */}
            <div className="relative w-full sm:w-[220px]">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 text-xs sm:text-sm rounded px-3 py-2 pr-8"
              />

              <Search
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="block md:hidden space-y-3">

          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              Loading requests...
            </div>
          ) : currentRequests?.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm border rounded bg-white">
              No request data found
            </div>
          ) : (
            currentRequests?.map((item, index) => (
              <div
                key={item.id || index}
                className="border rounded p-3 bg-white shadow-sm relative"
              >
                <div className="flex justify-between items-center mb-2">

                  <h4 className="font-medium text-sm">
                    {item.requestedSubjectName}
                  </h4>

                  <MoreVertical
                    size={16}
                    onClick={() =>
                      setOpenMenu(
                        openMenu === index
                          ? null
                          : index
                      )
                    }
                  />
                </div>

                <div className="text-xs text-gray-600 space-y-1">

                  <p>
                    <b>Date:</b> {item.date}
                  </p>

                  <p>
                    <b>Class:</b>{" "}
                    {item.requestedClassName}
                  </p>

                  <p>
                    <b>Request:</b>{" "}
                    {item.date}
                  </p>

                  <p>
                    <b>Status:</b>{" "}

                    <span
                      className={`px-2 py-1 rounded text-[10px] ${statusStyle[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </p>

                  <p>
                    <b>Comment:</b>{" "}
                    {item.reason || "-"}
                  </p>
                </div>

                {/* ACTION MENU */}
                {openMenu === index && (
                  <div className="absolute right-2 top-8 bg-white border rounded shadow text-xs z-20 p-2 space-y-2">

                    <button
                      onClick={() =>
                        handleAction(
                          item,
                          "approve"
                        )
                      }
                      className="text-green-600"
                    >
                      ✔ Approve
                    </button>

                    <button
                      onClick={() =>
                        handleAction(
                          item,
                          "reject"
                        )
                      }
                      className="text-red-600"
                    >
                      ✖ Reject
                    </button>
                  </div>
                )}
              </div>
            )))}
        </div>

        {/* TABLE */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">

          <table className="w-full text-[12px]">

            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">
                  S No.
                </th>

                <th className="px-3 py-2 text-left">
                  Date
                </th>

                <th className="px-3 py-2 text-left">
                  Subject
                </th>

                <th className="px-3 py-2 text-left">
                  Class
                </th>

                <th className="px-3 py-2 text-left">
                  Request Date
                </th>

                <th className="px-3 py-2 text-left">
                  Status
                </th>

                <th className="px-3 py-2 text-left">
                  Comments
                </th>

                <th className="px-3 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-500"
                  >
                    Loading requests...
                  </td>
                </tr>
              ) : currentRequests?.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-400"
                  >
                    No request data found
                  </td>
                </tr>
              ) : (
                currentRequests?.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">
                      {indexOfFirst + index + 1}
                    </td>

                    <td className="px-3 py-2">
                      {item.date}
                    </td>

                    <td className="px-3 py-2">
                      {item.requestedSubjectName}
                    </td>

                    <td className="px-3 py-2">
                      {item.requestedClassName}
                    </td>

                    <td className="px-3 py-2">
                      {item.date}
                    </td>

                    <td className="px-3 py-2">

                      <span
                        className={`px-2 py-1 text-[10px] rounded ${statusStyle[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      {item.reason || "-"}
                    </td>

                    <td className="relative">

                      <MoreVertical
                        size={16}
                        className="cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          e.stopPropagation();
                          setMenuPos({
                            top: rect.bottom + 5,
                            left: rect.left - 80,
                          });
                          setOpenMenu(openMenu === index ? null : index);
                        }}
                      />

                      {openMenu === index && (
                        <div style={{
                          position: "fixed",
                          top: menuPos.top,
                          left: menuPos.left,
                          zIndex: 9999,
                        }} className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-50">

                          <button
                            onClick={() =>
                              handleAction(
                                item,
                                "approve"
                              )
                            }
                            className="block w-full text-left px-3 py-2 text-green-600 hover:bg-gray-100"
                          >
                            ✔ Approve
                          </button>

                          <button
                            onClick={() =>
                              handleAction(
                                item,
                                "reject"
                              )
                            }
                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                          >
                            ✖ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
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

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-[90%] sm:w-[400px] bg-white rounded-lg shadow-lg"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="bg-brand-600 text-white px-4 py-3">

              {actionType === "approve"
                ? "Approve Comments"
                : "Reject Comments"}
            </div>

            <div className="p-4">

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                className="form-textarea"
                placeholder="Write here"
              />

              <div className="flex justify-end gap-2 mt-3">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="border px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-brand-600 text-white px-3 py-1 rounded text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaiseRequestList;
