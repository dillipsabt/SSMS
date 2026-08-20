import { useEffect, useMemo, useState } from "react";
import { FileText, MoreVertical, Pencil, Save, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import {
  createTextbookAsync,
  deleteTextbookAsync,
  fetchTextbookByIdAsync,
  fetchTextbooksAsync,
  updateTextbookAsync,
} from "../../features/Admin/Textbooks/textbookSlice";
import { fetchClassesAsync } from "../../features/Admin/Class/classSlice";
import { fetchSubjects } from "../../features/Admin/ExamResult/examResultSlice";
import {
  BOARD_CLASS_LABELS,
  BOARD_OPTIONS,
  getClassKey,
} from "../../features/Admin/academicOptions";

const states = ["Telangana", "Karnataka"];
const boards = BOARD_OPTIONS;
const toStateEnum = (state) => state?.toUpperCase();
const toStateLabel = (state) => state ? `${state.charAt(0)}${state.slice(1).toLowerCase()}` : "";

const emptyForm = {
  state: "",
  board: "",
  classId: "",
  subjectId: "",
  textbookUrl: "",
  bookName: "",
  publisher: "",
  edition: "",
  description: "",
};

const getClassLabel = (classItem) => classItem?.className || classItem?.classCode || classItem?.name || classItem?.class || "";
const getClassId = (classItem) => classItem?.id ?? classItem?.classId ?? "";
const getSubjectLabel = (subject) => subject?.subjectName || subject?.name || subject?.subject || "";
const getId = (item) => item?.id ?? item?.classId ?? item?.subjectId ?? "";

const Textbooks = () => {
  const dispatch = useDispatch();
  const { textbooks, pagination, loading, createLoading, updateLoading } = useSelector((state) => state.textbooks);
  const { classes } = useSelector((state) => state.class);
  const { subjects } = useSelector((state) => state.examResult);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [deleteBook, setDeleteBook] = useState(null);
  const [filters, setFilters] = useState({ state: "", board: "", classId: "", subjectId: "", date: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const listParams = useMemo(() => ({
    ...(filters.state && { state: toStateEnum(filters.state) }),
    ...(filters.board && { board: filters.board }),
    ...(filters.classId && { classId: Number(filters.classId) }),
    ...(filters.subjectId && { subjectId: Number(filters.subjectId) }),
    ...(filters.date && { createdDate: filters.date }),
    page: currentPage - 1,
    size: rowsPerPage,
  }), [filters, currentPage, rowsPerPage]);

  useEffect(() => {
    dispatch(fetchTextbooksAsync(listParams));
  }, [dispatch, listParams]);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClassesAsync(formData.board ? { board: formData.board } : {}));
  }, [dispatch, formData.board]);

  const filteredClasses = useMemo(() => {
    const excludedClassNames = new Set(["lkg", "ukg"]);
    const allowedClassKeys = formData.board
      ? new Set(BOARD_CLASS_LABELS[formData.board].map(getClassKey))
      : null;
    const uniqueClasses = new Map();

    classes.forEach((item) => {
      const className = String(item.className || item.classCode?.split(/\\s+/)[0] || getClassLabel(item)).trim();
      const classKey = getClassKey(className);
      const normalizedClassKey = classKey === "nur" ? "nursery" : classKey;
      const itemBoard = String(item.board || item.boardName || "").toUpperCase();
      if (
        getClassId(item) !== ""
        && className
        && (!formData.board || itemBoard === formData.board)
        && !excludedClassNames.has(classKey)
        && (!allowedClassKeys || allowedClassKeys.has(normalizedClassKey))
        && !uniqueClasses.has(normalizedClassKey)
      ) {
        uniqueClasses.set(normalizedClassKey, item);
      }
    });

    return Array.from(uniqueClasses.values());
  }, [classes, formData.board]);

  const totalPages = Math.max(1, pagination.totalPages);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "board" ? { classId: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.state || !formData.board || !formData.classId || !formData.subjectId || !formData.textbookUrl) {
      toast.error("Please complete all required fields");
      return;
    }

    const classId = Number(formData.classId);
    if (!Number.isInteger(classId) || classId <= 0) {
      toast.error("Please select a valid class");
      return;
    }

    const payload = {
      state: toStateEnum(formData.state),
      board: formData.board,
      classId,
      subjectId: Number(formData.subjectId),
      textbookUrl: formData.textbookUrl,
    };

    const action = editingId
      ? updateTextbookAsync({ id: editingId, data: payload })
      : createTextbookAsync(payload);
    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(editingId ? "Textbook updated successfully" : "Textbook saved successfully");
      setFormData(emptyForm);
      setEditingId(null);
      dispatch(fetchTextbooksAsync(listParams));
    }
  };

  const handleEdit = async (book) => {
    setOpenMenuId(null);
    const result = await dispatch(fetchTextbookByIdAsync(book.id));
    if (result.meta.requestStatus !== "fulfilled") return;

    const textbook = result.payload;
    setEditingId(textbook.id);
    setFormData({
      ...emptyForm,
      state: toStateLabel(textbook.state),
      board: textbook.board || "",
      classId: String(textbook.classId ?? textbook.class?.id ?? ""),
      subjectId: String(textbook.subjectId ?? textbook.subject?.id ?? ""),
      textbookUrl: textbook.textbookUrl || "",
    });
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteTextbookAsync(deleteBook.id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Textbook deleted successfully");
      setDeleteBook(null);
      dispatch(fetchTextbooksAsync(listParams));
    }
  };

  const fieldClass = "h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-700 outline-none focus:border-brand-600";

  return (
    <div className="mx-auto max-w-[1500px] text-[#252525]">
      <h1 className="text-[28px] font-bold leading-tight sm:text-[30px]">Textbooks</h1>
      <p className="mt-2 text-[15px]">Home / Textbooks</p>

      <section className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-300 px-4 py-3 text-[16px] font-semibold">{editingId ? "Edit Textbook" : "Add Textbook"}</h2>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-7">
            <label className="text-[15px] font-medium">State
              <select name="state" value={formData.state} onChange={updateForm} className={`mt-1 ${fieldClass}`}>
                <option value="">Select State</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>
            <label className="text-[15px] font-medium">Board
              <select name="board" value={formData.board} onChange={updateForm} className={`mt-1 ${fieldClass}`}>
                <option value="">Select Board</option>
                {boards.map((board) => <option key={board} value={board}>{board}</option>)}
              </select>
            </label>
            <label className="text-[15px] font-medium">Class
              <select name="classId" value={formData.classId} onChange={updateForm} className={`mt-1 ${fieldClass}`}>
                <option value="">Select Class</option>
                {filteredClasses.map((item) => <option key={getClassId(item)} value={getClassId(item)}>{getClassLabel(item)}</option>)}
              </select>
            </label>
            <label className="text-[15px] font-medium">Subject
              <select name="subjectId" value={formData.subjectId} onChange={updateForm} className={`mt-1 ${fieldClass}`}>
                <option value="">Select Subject</option>
                {subjects.map((item) => <option key={getId(item)} value={getId(item)}>{getSubjectLabel(item)}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-[320px]">
              <label className="text-[15px] font-medium">Textbook Url</label>
              <input name="textbookUrl" value={formData.textbookUrl} onChange={updateForm} placeholder="Enter Url" className={`mt-1 ${fieldClass}`} />
            </div>
            <button type="submit" disabled={createLoading || updateLoading} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-5 text-[15px] font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-50">
              <Save size={18} /> {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-300 px-4 py-3 text-[16px] font-semibold">Textbooks List</h2>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <select value={filters.state} onChange={(event) => { setFilters((current) => ({ ...current, state: event.target.value })); setCurrentPage(1); }} className={fieldClass}>
            <option value="">Select State</option>
            {states.map((state) => <option key={state}>{state}</option>)}
          </select>
          <select value={filters.board} onChange={(event) => { setFilters((current) => ({ ...current, board: event.target.value })); setCurrentPage(1); }} className={fieldClass}>
            <option value="">Select Board</option>
            {boards.map((board) => <option key={board}>{board}</option>)}
          </select>
          <select value={filters.classId} onChange={(event) => { setFilters((current) => ({ ...current, classId: event.target.value })); setCurrentPage(1); }} className={fieldClass}>
            <option value="">Select Class</option>
            {filteredClasses.map((item) => <option key={getClassId(item)} value={getClassId(item)}>{getClassLabel(item)}</option>)}
          </select>
          <select value={filters.subjectId} onChange={(event) => { setFilters((current) => ({ ...current, subjectId: event.target.value })); setCurrentPage(1); }} className={fieldClass}>
            <option value="">Select Subject</option>
            {subjects.map((item) => <option key={getId(item)} value={getId(item)}>{getSubjectLabel(item)}</option>)}
          </select>
          <input type="date" value={filters.date} onChange={(event) => { setFilters((current) => ({ ...current, date: event.target.value })); setCurrentPage(1); }} className={fieldClass} />
        </div>
        <div className="overflow-x-auto px-3 pb-3">
          <table className="min-w-[900px] w-full text-[14px]">
            <thead className="bg-[#edf4ff] text-left">
              <tr>
                <th className="px-4 py-3">S.No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Board</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3 text-center">Textbook</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ?
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">Loading textbooks...</td>
                </tr>
                : textbooks.length ? textbooks.map((book, index) =>
                  <tr key={book.id} className="border-b border-gray-300">
                    <td className="px-4 py-3">{(pagination.page * rowsPerPage) + index + 1}</td>
                    <td className="px-4 py-3">{book.createdDate || "-"}</td>
                    <td className="px-4 py-3">{book.state}</td>
                    <td className="px-4 py-3">{book.board}</td>
                    <td className="px-4 py-3">{book.className || book.class?.className || "-"}</td>
                    <td className="px-4 py-3">{book.subjectName || book.subject?.subjectName || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => window.open(book.pdfUrl || book.textbookUrl, "_blank", "noopener,noreferrer")} disabled={!(book.pdfUrl || book.textbookUrl)} className="text-red-600 disabled:opacity-30" aria-label="Open textbook">
                        <FileText size={22} />
                      </button>
                    </td>
                    <td className="relative px-4 py-3 text-center">
                      <button type="button" onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setMenuPos({ top: rect.bottom + 5, left: rect.left - 80 });
                        setOpenMenuId(openMenuId === book.id ? null : book.id);
                      }} aria-label="Textbook actions">
                        <MoreVertical size={21} />
                      </button>
                      {openMenuId === book.id && (
                        <div style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }} className="w-28 rounded bg-white py-1 text-left shadow-lg">
                          <button type="button" onClick={() => handleEdit(book)} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50">
                            <Pencil size={15} className="text-brand-600" />
                            Edit
                          </button>
                          <button type="button" onClick={() => { setDeleteBook(book); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-gray-50">
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No textbooks found
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage} />
        </div>
      </section>
      <DeleteConfirmModal
        isOpen={Boolean(deleteBook)}
        onClose={() => setDeleteBook(null)}
        onConfirm={confirmDelete}
        title="Delete Textbook"
        message="Are you sure you want to delete this textbook?" />
    </div>
  );
};

export default Textbooks;
