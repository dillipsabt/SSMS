import { Pencil, Trash2, Link } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  raiseTicketThunk,
  getTicketsThunk,
  getDepartmentsThunk,
  getIssueTypesThunk,
  updateTicketThunk,
  deleteTicketThunk,
} from "../../features/teacher/RaiseaTicket/raiseaticketSlice.js";
import Pagination from "../../components/common/Pagination";
import Select from "react-select";


const Status = {
  RESOLVED: "bg-green-100 text-green-700",
  PENDING: "bg-orange-100 text-orange-600",
  REJECTED: "bg-red-100 text-red-600",
};

const statusLabel = {
  RESOLVED: "Resolved",
  PENDING: "Pending",
  REJECTED: "Reject",
};

const TeacherRaiseTicket = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTicketsThunk());

    dispatch(getDepartmentsThunk());
    dispatch(getIssueTypesThunk());
  }, [dispatch]);

  const raiseTicketState = useSelector((state) => state.raiseTicket) || {};

  const { loading, success, error, list, departments, issueTypes } =
    raiseTicketState;

  const [form, setForm] = useState({
    ticketId: "",
    raisedTo: "",
    type: "",
    priority: "",
    location: "Hyderabad",
    description: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "attachment" ? files?.[0] || null : value,
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const validate = () => {
    if (!form.raisedTo) return toast.error("Raise To Required");

    if (!form.type) return toast.error("Type Required");

    if (!form.priority) return toast.error("Priority Required");

    if (!form.description) return toast.error("Description Required");

    if (!form.attachment) return toast.error("Attachment Required");

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (form.attachment) {
      if (!allowedTypes.includes(form.attachment.type)) {
        return toast.error("Only JPG, PNG, PDF allowed");
      }

      if (form.attachment.size > 2 * 1024 * 1024) {
        return toast.error("File must be less than 2MB");
      }
    }

    return true;
  };

  const resetForm = () => {
    setForm({
      raisedTo: "",
      type: "",
      priority: "",
      location: "Hyderabad",
      description: "",
      attachment: null,
    });

    setIsEditMode(false);
    setEditingIndex(null);
  };

  const handleSubmit = async () => {
    const isValid = validate();

    if (isValid !== true) return;

    const payload = {
      priority: form.priority.toUpperCase(),

      summary: form.description,

      raiseToId: Number(form.raisedTo),

      issueTypeId: Number(form.type),

      hod: 1,

      createdUserId: 1,

      messageProcessorId: 1,

      status: "PENDING",

      location: form.location,
    };

    // API CALL
    let resultAction;

    if (isEditMode) {
      resultAction = await dispatch(
        updateTicketThunk({
          id: form.ticketId,
          ...payload,
        })
      );
    } else {
      resultAction = await dispatch(raiseTicketThunk(payload));
    }

    // SUCCESS
    if (
      raiseTicketThunk.fulfilled.match(resultAction) ||
      updateTicketThunk.fulfilled.match(resultAction)
    ) {
      dispatch(getTicketsThunk());

      toast.success(
        isEditMode
          ? "Ticket Updated Successfully"
          : "Ticket Raised Successfully",
      );

      // RESET FORM
      resetForm();
    } else {
      toast.error(resultAction.payload || "Failed to raise ticket");
    }
  };

  const handleEdit = (ticket, index) => {
    setIsEditMode(true);
    setEditingIndex(index);

    setForm({
      ticketId: ticket.id,
      raisedTo: ticket.raiseToId || ticket.departmentId || "",
      type: ticket.issueTypeId || "",
      priority: ticket.priority || "",
      location: ticket.location || "Hyderabad",
      description: ticket.summary || "",
      attachment: null,
    });
  };
  const filteredTickets = (list || []).filter((t) => {
    const query = searchText.toLowerCase();
    if (!query) return true;
    return (
      t.ticketId?.toLowerCase().includes(query) ||
      t.raiseTo?.toLowerCase().includes(query) ||
      t.type?.toLowerCase().includes(query) ||
      t.summary?.toLowerCase().includes(query) ||
      t.priority?.toLowerCase().includes(query) ||
      t.status?.toLowerCase().includes(query) ||
      t.messageProcessor?.toLowerCase().includes(query)
    );
  });
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);
  const handleDelete = async () => {
    const ticket = filteredTickets[editingIndex];

    if (!ticket) return;

    const resultAction = await dispatch(deleteTicketThunk(ticket.id));

    if (deleteTicketThunk.fulfilled.match(resultAction)) {
      toast.success("Ticket Deleted Successfully");

      dispatch(getTicketsThunk());

      setIsDeleteOpen(false);

      setEditingIndex(null);
    } else {
      toast.error("Failed to delete ticket");
    }
  };
  return (
    <div className="w-full min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-[22px] font-bold">Tickets</h1>
        <p className="text-[13px]">
          Teacher / <span className="font-medium">Tickets</span>
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-2">
        <div className="border-b border-gray-300 px-2 py-2 text-sm font-semibold">
          Raise a Ticket
        </div>

        {/* ROW 1 */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-2">
          <div>
            <label
              htmlFor="title"
              className="block text-[12px] font-semibold mb-1"
            >
              Raise To <span className="text-red-500">*</span>
            </label>
            <Select
              options={departments?.map((d) => ({
                value: d.id || d.departmentId,
                label: d.departmentName || d.name,
              }))}
              value={departments
                ?.map((d) => ({
                  value: d.id || d.departmentId,
                  label: d.departmentName || d.name,
                }))
                .find((d) => d.value == form.raisedTo)}
              onChange={(selected) =>
                setForm({
                  ...form,
                  raisedTo: selected?.value || "",
                })
              }
              placeholder="Select"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-[12px] font-semibold mb-1"
            >
              Type <span className="text-red-500">*</span>
            </label>
            <Select
              options={issueTypes
                ?.filter((it) => Number(it.departmentId) === Number(form.raisedTo))
                .map((it) => ({
                  value: it.id,
                  label: it.name,
                }))}
              value={issueTypes
                ?.filter((it) => Number(it.departmentId) === Number(form.raisedTo))
                .map((it) => ({
                  value: it.id,
                  label: it.name,
                }))
                .find((it) => it.value == form.type)}
              onChange={(selected) =>
                setForm({
                  ...form,
                  type: selected?.value || "",
                })
              }
              placeholder="Select"
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-[12px] font-semibold mb-1"
            >
              Priority <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: "LOW", label: "LOW" },
                { value: "MEDIUM", label: "MEDIUM" },
                { value: "HIGH", label: "HIGH" },
                { value: "CRITICAL", label: "CRITICAL" },
              ]}
              value={
                form.priority
                  ? { value: form.priority, label: form.priority }
                  : null
              }
              onChange={(selected) =>
                setForm({
                  ...form,
                  priority: selected?.value || "",
                })
              }
              placeholder="Select"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-[12px] font-semibold mb-1"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              value={form.location}
              readOnly
              className="w-full border border-gray-300 bg-white px-3 py-[6px] rounded-md text-[13px] text-gray-700"
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="w-full p-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label
              htmlFor="attachment"
              className="block text-[12px] font-semibold mb-1"
            >
              Attachment <span className="text-red-500">*</span>
            </label>
            <div className="w-full border border-gray-300 rounded-md flex items-center overflow-hidden">
              <label htmlFor="attachment" className="cursor-pointer shrink-0">
                <span className="inline-block bg-indigo-400 text-white px-4 py-[6px] text-[13px] font-medium cursor-pointer">
                  Choose File
                </span>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <span className="text-[12px] text-gray-500 px-3">
                {form.attachment ? form.attachment.name : "No file chosen"}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="flex w-full block text-[12px] font-semibold mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <input
              name="description"
              placeholder="Enter description..."
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-[6px] rounded-md text-[13px] text-gray-700"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-2 p-2">
          {isEditMode && (
            <button
              onClick={resetForm}
              className="border border-gray-300 px-4 py-[6px] rounded-md text-[13px] text-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white font-medium px-5 py-[6px] rounded-md text-[13px]"
          >
            {loading ? "Submitting..." : "Raise a Ticket"}
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-gray-300 rounded-lg mb-2">
        <div className="flex items-center justify-between px-2 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-[15px] text-gray-900">
            My Tickets
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* <input
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 px-3 py-[5px] text-[12px] rounded-md text-gray-600 w-[200px] "
                // placeholder="dd/mm/yyyy - dd/mm/yyyy"
              /> */}
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 px-3 py-[5px] text-[12px] rounded-md text-gray-600 w-[160px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-indigo-50">
                {[
                  "S.No.",
                  "Ticket ID",
                  "Ticket Raised To",
                  "Category",
                  "Summary",
                  "Priority",
                  "Raised On",
                  "Current Status",
                  "Comments",
                  "Message Processor",
                  "Attachments",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-[12px] text-gray-800 text-center whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTickets.map((t, i) => (
                <tr
                  //   key={t.id}
                  key={`${t.ticketId}-${i}`}
                  className="text-center border-b border-gray-200"
                >
                  <td className="px-3 py-2.5 text-gray-700">
                    {indexOfFirst + i + 1}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700">{t.ticketId}</td>
                  <td className="px-3 py-2.5 text-gray-700">{t.raiseTo}</td>
                  <td className="px-3 py-2.5 text-gray-700">{t.type}</td>
                  <td className="px-3 py-2.5 text-gray-700 text-left max-w-50">
                    {t.summary}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700">{t.priority}</td>
                  <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">
                    {formatDate(t.raisedOn)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-3 py-0.5 rounded text-[11px] font-medium ${Status[t.status] || ""}`}
                    >
                      {statusLabel[t.status] || t.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">
                    {t.comments || "-"}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700">
                    {t.messageProcessor}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center">
                      {t.attachmentUrl || t.fileUrl ? (
                        <a
                          href={t.attachmentUrl || t.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Link className="w-4 h-4 text-indigo-600 cursor-pointer" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center items-center gap-2">
                      <Pencil
                        className="w-4 h-4 text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors"
                        onClick={() => handleEdit(t, i)}
                      />
                      <div className="w-px h-4 bg-gray-300" />
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => {
                          setEditingIndex(i);
                          setIsDeleteOpen(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-6 text-center text-gray-400"
                  >
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* {pagination} */}
      <div className="px-3 py-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4 text-[14px] text-gray-800 font-medium text-center">
              Are you sure you want to delete this ticket?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setEditingIndex(null);
                }}
                className="border border-gray-300 px-5 py-[6px] rounded-md text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-[6px] rounded-md text-[13px] font-medium hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRaiseTicket;