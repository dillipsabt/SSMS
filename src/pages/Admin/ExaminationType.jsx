import { useEffect, useMemo, useState } from "react";
import { Edit3, Save, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { fetchBranchesAsync } from "../../features/Admin/Branch/branchSlice";
import {
  createExaminationTypeAsync,
  deleteExaminationTypeAsync,
  fetchExaminationTypes,
  updateExaminationTypeAsync,
} from "../../features/Admin/ExaminationType/examinationTypeSlice";

const emptyForm = { branchId: "", examType: "" };

export default function ExaminationType() {
  const dispatch = useDispatch();
  const { examinationTypes, loading } = useSelector((state) => state.examinationType);
  const { branches, loading: branchLoading } = useSelector((state) => state.branch);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchExaminationTypes());
    if (!branches.length && !branchLoading) dispatch(fetchBranchesAsync());
  }, [dispatch, branches.length, branchLoading]);

  const filteredItems = useMemo(() => examinationTypes.filter((item) =>
    item.examType?.toLowerCase().includes(search.toLowerCase()) ||
    item.branchName?.toLowerCase().includes(search.toLowerCase()),
  ), [examinationTypes, search]);

  const handleChange = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async () => {
    if (!form.branchId || !form.examType.trim()) {
      toast.error("Please select a branch and enter an examination type");
      return;
    }
    const action = editId
      ? updateExaminationTypeAsync({ id: editId, examType: form.examType.trim() })
      : createExaminationTypeAsync(form.examType.trim());
    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(editId ? "Examination type updated successfully" : "Examination type created successfully");
      setForm(emptyForm);
      setEditId(null);
      dispatch(fetchExaminationTypes());
    } else {
      toast.error(result.payload?.message || "Unable to save examination type");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ branchId: String(item.branchId || ""), examType: item.examType || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteExaminationTypeAsync(deleteId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Examination type deleted successfully");
      setDeleteId(null);
    } else {
      toast.error(result.payload?.message || "Unable to delete examination type");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-[#303038]">Examination Type</h1>
        <p className="mt-1 text-sm text-[#222]">Home / Examination Type</p>
      </div>

      <section className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 px-5 py-3 text-base font-semibold text-[#303038]">{editId ? "Edit Examination Type" : "Add Examination Type"}</h2>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#18181b]">Branch Name</label>
              <select name="branchId" value={form.branchId} onChange={handleChange} disabled={branchLoading} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#4f39f5] focus:ring-1 focus:ring-[#4f39f5] disabled:bg-gray-50">
                <option value="">{branchLoading ? "Loading branches..." : "Select Branch"}</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#18181b]">Examination Type</label>
              <input name="examType" value={form.examType} onChange={handleChange} placeholder="e.g. Mid Term" className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#4f39f5] focus:ring-1 focus:ring-[#4f39f5]" />
            </div>
            <button type="button" onClick={handleSubmit} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#4f39f5] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3f2be1] disabled:opacity-60"><Save size={17} />{editId ? "Update" : "Save"}</button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 px-5 py-3 text-base font-semibold text-[#303038]">Examination Type Lists</h2>
        <div className="p-5">
          <div className="mb-5 flex justify-end"><div className="relative w-full sm:w-72"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Examination Type" className="h-10 w-full rounded-md border border-gray-300 px-3 pr-10 text-sm outline-none focus:border-[#4f39f5]" /><Search size={17} className="pointer-events-none absolute right-3 top-3 text-gray-400" /></div></div>
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full text-sm"><thead className="bg-[#edf4ff]"><tr className="text-left text-[#333]">{["S.No.", "Branch Name", "Examination Type", "Action"].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
              <tbody>{loading ? <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">Loading examination types...</td></tr> : filteredItems.length ? filteredItems.map((item, index) => <tr key={item.id} className="border-t border-gray-200 text-[#333] hover:bg-gray-50"><td className="px-4 py-3">{index + 1}</td><td className="px-4 py-3">{item.branchName || branches.find((branch) => branch.id === item.branchId)?.name || "—"}</td><td className="px-4 py-3">{item.examType}</td><td className="px-4 py-3"><div className="flex gap-3"><button aria-label="Edit examination type" onClick={() => handleEdit(item)} className="text-[#4f39f5] hover:text-[#3f2be1]"><Edit3 size={17} /></button><button aria-label="Delete examination type" onClick={() => setDeleteId(item.id)} className="text-rose-500 hover:text-rose-600"><Trash2 size={17} /></button></div></td></tr>) : <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No examination types found</td></tr>}</tbody>
            </table>
          </div>
        </div>
      </section>
      <DeleteConfirmModal isOpen={Boolean(deleteId)} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Examination Type" message="Are you sure you want to delete this examination type?" />
    </div>
  );
}
