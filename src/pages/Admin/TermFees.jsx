import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, MoreVertical, PlusCircle, Save, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchClassesAsync } from "../../features/Admin/FeesConfig/feesConfigSlice";
import { fetchAcademicYears } from "../../features/Admin/AcademicYear/academicYearSlice";

const DEFAULT_CLASS_OPTIONS = ["8-A", "9-A", "10-A"];
const DEFAULT_ACADEMIC_YEAR = "2026-27";

const createQuarter = (id, name, amount, dueDate) => ({
  id,
  name,
  amount,
  dueDate,
});

const createInitialForm = () => ({
  academicYear: DEFAULT_ACADEMIC_YEAR,
  classSection: "8-A",
  feesCategory: "School Fees",
  quarters: [
    createQuarter(1, "Quarterly 1", "8000", "2026-06-30"),
    createQuarter(2, "Quarterly 2", "7000", "2026-09-30"),
    createQuarter(3, "Quarterly 3", "5500", "2027-01-30"),
  ],
});

const initialFeeLists = [
  {
    id: 1,
    createdDate: "02/01/2026",
    classSection: "8-A",
    feesCategory: "School Fees",
    quarters: [
      createQuarter(1, "Quarterly 1", "8000", "2026-06-30"),
      createQuarter(2, "Quarterly 2", "7000", "2026-09-30"),
      createQuarter(3, "Quarterly 3", "5500", "2027-01-30"),
    ],
  },
  {
    id: 2,
    createdDate: "02/01/2026",
    classSection: "9-A",
    feesCategory: "School Fees",
    quarters: [
      createQuarter(1, "Quarterly 1", "9000", "2026-06-30"),
      createQuarter(2, "Quarterly 2", "9000", "2026-09-30"),
      createQuarter(3, "Quarterly 3", "5000", "2027-01-30"),
    ],
  },
  {
    id: 3,
    createdDate: "02/01/2026",
    classSection: "10-A",
    feesCategory: "School Fees",
    quarters: [
      createQuarter(1, "Quarterly 1", "10000", "2026-06-30"),
      createQuarter(2, "Quarterly 2", "10000", "2026-09-30"),
      createQuarter(3, "Quarterly 3", "5000", "2027-01-30"),
    ],
  },
];

const amountValue = (amount) => Number.parseFloat(amount) || 0;
const formatAmount = (amount) => amountValue(amount).toLocaleString("en-IN");
const formatDate = (date) => {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

export default function TermFees() {
  const dispatch = useDispatch();
  const { classes = [] } = useSelector((state) => state.feesConfig || {});
  const { academicYears = [] } = useSelector((state) => state.academicYear || {});
  const [form, setForm] = useState(createInitialForm);
  const [feeLists, setFeeLists] = useState(initialFeeLists);
  const [editId, setEditId] = useState(null);
  const [filterClass, setFilterClass] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    dispatch(fetchClassesAsync());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  const classOptions = useMemo(() => {
    const apiClasses = classes
      .map((item) => item.classCode || item.className || item.name)
      .filter(Boolean);
    return [...new Set([...DEFAULT_CLASS_OPTIONS, ...apiClasses])];
  }, [classes]);

  const academicYearOptions = useMemo(() => {
    const apiYears = academicYears.map((item) => item.year).filter(Boolean);
    return [...new Set([DEFAULT_ACADEMIC_YEAR, ...apiYears])];
  }, [academicYears]);

  const totalFees = form.quarters.reduce(
    (total, quarter) => total + amountValue(quarter.amount),
    0,
  );

  const filteredLists = useMemo(
    () =>
      feeLists.filter((item) => {
        const matchesClass = !filterClass || item.classSection === filterClass;
        const matchesDate = !filterDate || item.createdDate === formatDate(filterDate);
        return matchesClass && matchesDate;
      }),
    [feeLists, filterClass, filterDate],
  );

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateQuarter = (id, field, value) => {
    setForm((current) => ({
      ...current,
      quarters: current.quarters.map((quarter) =>
        quarter.id === id ? { ...quarter, [field]: value } : quarter,
      ),
    }));
  };

  const addQuarter = () => {
    setForm((current) => ({
      ...current,
      quarters: [
        ...current.quarters,
        createQuarter(Date.now(), `Quarterly ${current.quarters.length + 1}`, "", ""),
      ],
    }));
  };

  const removeQuarter = (id) => {
    if (form.quarters.length === 1) return;
    setForm((current) => ({
      ...current,
      quarters: current.quarters.filter((quarter) => quarter.id !== id),
    }));
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.academicYear || !form.classSection || !form.feesCategory) {
      toast.error("Please select academic year, class and fees category");
      return;
    }

    const nextItem = {
      id: editId || Date.now(),
      createdDate: editId
        ? feeLists.find((item) => item.id === editId)?.createdDate || formatDate(new Date().toISOString().slice(0, 10))
        : formatDate(new Date().toISOString().slice(0, 10)),
      classSection: form.classSection,
      feesCategory: form.feesCategory,
      quarters: form.quarters.map((quarter, index) => ({ ...quarter, id: index + 1 })),
    };

    setFeeLists((current) =>
      editId
        ? current.map((item) => (item.id === editId ? nextItem : item))
        : [nextItem, ...current],
    );
    toast.success(editId ? "Term fees updated successfully" : "Term fees saved successfully");
    resetForm();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      academicYear: DEFAULT_ACADEMIC_YEAR,
      classSection: item.classSection,
      feesCategory: item.feesCategory,
      quarters: item.quarters.map((quarter) => ({ ...quarter })),
    });
    setOpenMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setFeeLists((current) => current.filter((item) => item.id !== id));
    setOpenMenu(null);
    toast.success("Term fees deleted successfully");
  };

  return (
    <main className="page-wrap p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#303038]">Term Fees</h1>
        <p className="mt-1 text-sm text-[#222]">Home / Term Fees</p>
      </div>

      <section className="card mb-5 overflow-hidden">
        <h2 className="card-section px-4 py-3 text-base">{editId ? "Edit Term Fees" : "Add Term Fees"}</h2>
        <div className="p-4 sm:p-5">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SelectField label="Academic Year" name="academicYear" value={form.academicYear} onChange={updateForm}>
              {academicYearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
            </SelectField>
            <SelectField label="Class/Section" name="classSection" value={form.classSection} onChange={updateForm}>
              {classOptions.map((className) => <option key={className} value={className}>{className}</option>)}
            </SelectField>
            <SelectField label="Fees Category" name="feesCategory" value={form.feesCategory} onChange={updateForm}>
              <option value="School Fees">School Fees</option>
              <option value="Transportation Fees">Transportation Fees</option>
              <option value="Books Fees">Books Fees</option>
            </SelectField>
          </div>

          <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-[#edf4ff] text-[#222]">
                <tr>
                  <th className="w-24 px-4 py-3 text-left font-semibold">S.No.</th>
                  <th className="px-4 py-3 text-left font-semibold">Quarterly Name</th>
                  <th className="w-64 px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Fees Paid Last Date</th>
                  <th className="w-24 px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {form.quarters.map((quarter, index) => (
                  <tr className="border-t border-gray-200" key={quarter.id}>
                    <td className="px-4 py-2.5 text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2.5">
                      <select
                        aria-label={`Quarterly name ${index + 1}`}
                        className="form-select h-8"
                        value={quarter.name}
                        onChange={(event) => updateQuarter(quarter.id, "name", event.target.value)}
                      >
                        {[...Array(Math.max(3, form.quarters.length))].map((_, quarterIndex) => {
                          const option = `Quarterly ${quarterIndex + 1}`;
                          return <option key={option} value={option}>{option}</option>;
                        })}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        aria-label={`Quarterly amount ${index + 1}`}
                        className="form-input h-8"
                        min="0"
                        type="number"
                        value={quarter.amount}
                        onChange={(event) => updateQuarter(quarter.id, "amount", event.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="relative">
                        <input
                          aria-label={`Quarterly due date ${index + 1}`}
                          className="form-input h-8 pr-9"
                          type="date"
                          value={quarter.dueDate}
                          onChange={(event) => updateQuarter(quarter.id, "dueDate", event.target.value)}
                        />
                        <CalendarDays className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {index === form.quarters.length - 1 ? (
                        <button aria-label="Add quarterly fee" className="text-brand-600 hover:text-brand-700" onClick={addQuarter} type="button">
                          <PlusCircle size={22} />
                        </button>
                      ) : (
                        <button aria-label={`Remove quarterly fee ${index + 1}`} className="text-rose-600 hover:text-rose-700" onClick={() => removeQuarter(quarter.id)} type="button">
                          <Trash2 size={19} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-base font-medium text-gray-800">Total Fees: {formatAmount(totalFees)}</p>
            <button className="btn-primary h-10 px-5" onClick={handleSave} type="button">
              <Save size={17} />
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </section>

      <section className="card overflow-hidden">
        <h2 className="card-section px-4 py-3 text-base">Quarterly Fees Lists</h2>
        <div className="p-4 sm:p-5">
          <div className="mb-5 flex flex-col justify-end gap-3 sm:flex-row">
            <select aria-label="Filter by class" className="form-select h-10 w-full sm:w-72" value={filterClass} onChange={(event) => setFilterClass(event.target.value)}>
              <option value="">Select Class</option>
              {classOptions.map((className) => <option key={className} value={className}>{className}</option>)}
            </select>
            <div className="relative w-full sm:w-56">
              <input aria-label="Filter by created date" className="form-input h-10 pr-9" type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} />
              <CalendarDays className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full min-w-[1180px] text-sm">
              <thead className="bg-[#edf4ff] text-[#222]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">S.No.</th>
                  <th className="px-4 py-3 text-left font-semibold">Created Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Class/Section</th>
                  <th className="px-4 py-3 text-left font-semibold">Fees Category</th>
                  {form.quarters.map((quarter) => (
                    <th className="px-4 py-3 text-center font-semibold" key={quarter.id}>
                      {quarter.name || "Quarterly"}
                      <span className="mt-1 block text-xs font-normal">(Before {formatDate(quarter.dueDate)})</span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold">Annual Fees</th>
                  <th className="px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLists.length ? filteredLists.map((item, index) => {
                  const annualFees = item.quarters.reduce((total, quarter) => total + amountValue(quarter.amount), 0);
                  return (
                    <tr className="border-t border-gray-200 text-gray-700 hover:bg-gray-50" key={item.id}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{item.createdDate}</td>
                      <td className="px-4 py-3">{item.classSection}</td>
                      <td className="px-4 py-3">{item.feesCategory}</td>
                      {form.quarters.map((quarter) => {
                        const itemQuarter = item.quarters.find((fee) => fee.name === quarter.name) || item.quarters[quarter.id - 1];
                        return <td className="px-4 py-3 text-center" key={quarter.id}>{formatAmount(itemQuarter?.amount)}</td>;
                      })}
                      <td className="px-4 py-3">{formatAmount(annualFees)}</td>
                      <td className="relative px-4 py-3 text-center">
                        <button aria-label={`Actions for ${item.classSection}`} className="text-gray-800" onClick={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            setMenuPos({ top: rect.bottom + 5, left: rect.left - 80 });
                            setOpenMenu(openMenu === item.id ? null : item.id);
                          }} type="button">
                          <MoreVertical size={20} />
                        </button>
                        {openMenu === item.id && (
                          <div style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }} className="w-28 rounded-md border border-gray-200 bg-white py-1 text-left shadow-lg">
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => handleEdit(item)} type="button"><Edit3 size={15} className="text-brand-600" />Edit</button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => handleDelete(item.id)} type="button"><Trash2 size={15} className="text-rose-600" />Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td className="px-4 py-10 text-center text-gray-500" colSpan={7 + form.quarters.length}>No quarterly fees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-sm text-gray-700">
            <button className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50" type="button">Prev</button>
            <button className="rounded-md bg-brand-600 px-4 py-2 text-white" type="button">Next</button>
            <span>Page: 1 of 1</span>
            <select aria-label="Rows per page" className="form-select h-9 w-20" defaultValue="10">
              <option value="10">10</option>
              <option value="25">25</option>
            </select>
          </div>
        </div>
      </section>
    </main>
  );
}

function SelectField({ children, label, name, onChange, value }) {
  return (
    <label className="block text-sm font-medium text-gray-800">
      {label}
      <select className="form-select mt-1.5 h-9" name={name} onChange={onChange} value={value}>
        {children}
      </select>
    </label>
  );
}
