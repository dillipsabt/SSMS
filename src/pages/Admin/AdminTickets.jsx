import React, { useState, useEffect } from "react";
import { MoreVertical, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
 
import {
  fetchTickets,
  editTicket,
  removeTicket,
} from "../../features/Admin/Tickets/ticketSlice";
import { getDepartmentsAsync } from "../../features/Admin/Leave/leaveSlice";
import Pagination from "../../components/common/Pagination";
 
const statusColor = {
  PENDING: "text-orange-500",
  IN_PROGRESS: "text-blue-500",
  RESOLVED: "text-green-600",
  CLOSED: "text-red-500",
};
 
export default function Tickets() {
  const dispatch = useDispatch();
 
  const {
    data = [],
    loading,
    updateLoading,
    deleteLoading,
  } = useSelector((state) => state.tickets);
  const { departments = [] } = useSelector((state) => state.leave);
 
  const [openMenu, setOpenMenu] = useState(null);
  const [popup, setPopup] = useState(false);
  const [type, setType] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
 
  /* ✅ FETCH API */
  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(getDepartmentsAsync());
  }, [dispatch]);
 
  /* ✅ CLOSE MENU OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };
 
    window.addEventListener("click", handleClickOutside);
 
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
 
  /* ✅ RESET PAGE ON SEARCH/FILTER */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, selectedDate, selectedDepartment]);
 
  /* ✅ OPEN POPUP */
  const openPopup = (item, actionType) => {
    setSelected(item);
    setType(actionType);
    setPopup(true);
    setOpenMenu(null);
  };
 
  /* ✅ UPDATE STATUS */
  const handleSubmit = async () => {
    if (!comment.trim()) {
      return toast.error("Comment required");
    }
 
    const payload = {
      id: selected.id,
      priority: selected.priority || "LOW",
      summary: comment,
      raiseToId: selected.raiseToId,
      issueTypeId: selected.issueTypeId,
      hod: selected.hod,
      createdUserId: selected.createdUserId,
      messageProcessorId: selected.messageProcessorId,
      status: type === "resolve" ? "RESOLVED" : "CLOSED",
      location: selected.location || "",
      ticketId: selected.ticketId || "",
    };
 
    try {
      await dispatch(
        editTicket({
          id: selected.id,
          payload,
        }),
      ).unwrap();
 
      toast.success(
        type === "resolve"
          ? "Ticket resolved successfully!"
          : "Ticket closed successfully!",
      );
 
      setPopup(false);
      setComment("");
      setSelected(null);
 
      dispatch(fetchTickets());
    } catch (error) {
      toast.error("Failed to update ticket. Please try again.");
    }
  };
 
  /* ✅ DELETE */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this ticket?")) {
      try {
        await dispatch(removeTicket(id)).unwrap();
 
        toast.success("Ticket deleted successfully!");
 
        dispatch(fetchTickets());
      } catch (error) {
        toast.error("Failed to delete ticket. Please try again.");
      }
    }
  };
 
  const filteredTickets = data.filter((item) => {
    // SEARCH
    const matchesSearch =
      item.ticketId?.toLowerCase().includes(search.toLowerCase()) ||
      item.raiseTo?.toLowerCase().includes(search.toLowerCase()) ||
      item.type?.toLowerCase().includes(search.toLowerCase());
 
    // STATUS
    const matchesStatus =
      statusFilter === "All" ? true : item.status === statusFilter;
 
    // DATE
    const matchesDate = selectedDate
      ? item.raisedOn?.split("T")[0] === selectedDate
      : true;
 
    // DEPARTMENT
    const matchesDepartment =
      !selectedDepartment || item.raiseTo === selectedDepartment;
 
    return matchesSearch && matchesStatus && matchesDate && matchesDepartment;
  });
 
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);
 
  return (
    <div>
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">Tickets</h2>
 
      <p className="text-xs sm:text-sm text-gray-500 mb-4">Teacher / Tickets</p>
 
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* NEW */}
        <div className="bg-white border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500">New Tickets</p>
 
          <h3 className="text-blue-600 font-semibold text-lg">
            {data
              .filter(
                (item) =>
                  item.status === "PENDING" || item.status === "IN_PROGRESS",
              )
              .length.toString()
              .padStart(2, "0")}
          </h3>
        </div>
 
        {/* RESOLVED */}
        <div className="bg-white border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500">Solved Tickets</p>
 
          <h3 className="text-green-600 font-semibold text-lg">
            {data
              .filter((item) => item.status === "RESOLVED")
              .length.toString()
              .padStart(2, "0")}
          </h3>
        </div>
 
        {/* PENDING */}
        <div className="bg-white border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500">Pending Tickets</p>
 
          <h3 className="text-yellow-500 font-semibold text-lg">
            {data
              .filter((item) => item.status === "PENDING")
              .length.toString()
              .padStart(2, "0")}
          </h3>
        </div>
 
        {/* CLOSED */}
        <div className="bg-white border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500">Closed Tickets</p>
 
          <h3 className="text-red-500 font-semibold text-lg">
            {data
              .filter((item) => item.status === "CLOSED")
              .length.toString()
              .padStart(2, "0")}
          </h3>
        </div>
      </div>
 
      {/* CARD */}
      <div className="card p-3 sm:p-4">
        {/* FILTER */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-3">
          {/* DATE */}
          <div className="flex items-center border border-gray-300 px-2 py-1 rounded text-xs text-gray-500">
            <Calendar size={14} className="mr-1" />
 
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="outline-none"
            />
          </div>
 
          {/* SEARCH */}
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-xs rounded"
          />
 
          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-xs rounded"
          >
            <option value="All">All</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
 
          {/* DEPARTMENT */}
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[180px] h-10 border border-gray-300 px-3 py-1 text-sm rounded"
          >
            <option value="">All Departments</option>
 
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSelectedDate("");
              setSearch("");
              setStatusFilter("All");
              setSelectedDepartment("");
              setCurrentPage(1);
            }}
            className="px-3 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50"
          >
            Reset
          </button>
        </div>
 
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Ticket Id</th>
                <th className="px-3 py-2 text-left">Raised To</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Summary</th>
                <th className="px-3 py-2 text-left">Priority</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Raised On</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Processor</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
 
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center p-4">
                    No Tickets Found
                  </td>
                </tr>
              ) : (
                currentTickets.map((item, i) => (
                  <tr
                    key={item.id || i}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">{indexOfFirst + i + 1}</td>
 
                    <td className="px-3 py-2">{item.ticketId || "-"}</td>
 
                    <td className="px-3 py-2">{item.raiseTo || "-"}</td>
 
                    <td className="px-3 py-2">{item.type || "-"}</td>
 
                    <td className="px-3 py-2">{item.summary || "-"}</td>
 
                    <td className="px-3 py-2">{item.priority || "-"}</td>
 
                    <td className="px-3 py-2">{item.location || "-"}</td>
 
                    <td className="px-3 py-2">
                      {item.raisedOn
                        ? new Date(item.raisedOn).toLocaleDateString()
                        : "-"}
                    </td>
 
                    <td
                      className={`px-3 py-2 ${statusColor[item.status] || ""}`}
                    >
                      {item.status || "-"}
                    </td>
 
                    <td className="px-3 py-2">
                      {item.messageProcessor || "-"}
                    </td>
 
                    <td className="px-3 py-2 relative">
                      <MoreVertical
                        size={16}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
 
                          setOpenMenu(openMenu === i ? null : i);
                        }}
                      />
 
                      {openMenu === i && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow text-xs z-50">
                          <button
                            onClick={() => openPopup(item, "resolve")}
                            className="block w-full px-3 py-2 text-green-600 hover:bg-gray-100"
                          >
                            ✔ Resolve
                          </button>
 
                          <button
                            onClick={() => openPopup(item, "reject")}
                            className="block w-full px-3 py-2 text-red-500 hover:bg-gray-100"
                          >
                            ✖ Close
                          </button>
 
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteLoading}
                            className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100"
                          >
                            🗑 Delete
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
 
        {/* MOBILE CARD UI */}
        <div className="lg:hidden space-y-3">
          {loading ? (
            <div className="text-center text-sm py-5">Loading...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center text-sm py-5">No Tickets Found</div>
          ) : (
            currentTickets.map((item, i) => (
              <div
                key={item.id || i}
                className="border rounded p-3 bg-white shadow-sm relative"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      {item.ticketId || "-"}
                    </h3>
 
                    <p className="text-xs text-gray-500">{item.type || "-"}</p>
                  </div>
 
                  <MoreVertical
                    size={16}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
 
                      setOpenMenu(openMenu === i ? null : i);
                    }}
                  />
                </div>
 
                {/* MOBILE MENU */}
                {openMenu === i && (
                  <div className="absolute right-3 top-10 w-28 bg-white border rounded shadow text-xs z-50">
                    <button
                      onClick={() => openPopup(item, "resolve")}
                      className="block w-full px-3 py-2 text-green-600 hover:bg-gray-100"
                    >
                      ✔ Resolve
                    </button>
 
                    <button
                      onClick={() => openPopup(item, "reject")}
                      className="block w-full px-3 py-2 text-red-500 hover:bg-gray-100"
                    >
                      ✖ Close
                    </button>
                  </div>
                )}
 
                <div className="text-xs mt-2 space-y-1">
                  <p>
                    <b>Raised To:</b> {item.raiseTo || "-"}
                  </p>
 
                  <p>
                    <b>Priority:</b> {item.priority || "-"}
                  </p>
 
                  <p>
                    <b>Location:</b> {item.location || "-"}
                  </p>
 
                  <p>
                    <b>Raised:</b>{" "}
                    {item.raisedOn
                      ? new Date(item.raisedOn).toLocaleDateString()
                      : "-"}
                  </p>
 
                  <p>
                    <b>Status:</b>{" "}
                    <span className={statusColor[item.status] || ""}>
                      {item.status || "-"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
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
 
      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[90%] sm:w-[380px] bg-white rounded shadow-lg">
            <div className="bg-brand-600 text-white px-4 py-2 text-sm flex justify-between">
              {type === "resolve" ? "Resolved Comments" : "Closed Comments"}
 
              <span onClick={() => setPopup(false)} className="cursor-pointer">
                ✖
              </span>
            </div>
 
            <div className="p-4">
              <textarea
                rows="3"
                placeholder="Write here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
              />
 
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPopup(false)}
                  className="border px-3 py-1 rounded"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
 
                <button
                  onClick={handleSubmit}
                  className="bg-brand-600 text-white px-4 py-1 rounded"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}