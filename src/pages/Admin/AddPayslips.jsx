import { useState } from "react";
import { CalendarDays, Eraser, PlusCircle, Save, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createPayslip } from "../../features/Admin/Payslip/payslipSlice";

const initialDetails = {
  staffId: "",
  staffName: "",
  department: "",
  designation: "",
  salaryMonth: "",
  paymentDate: "",
  daysPayable: "",
};

const initialDeductions = {
  providentFund: "",
  professionalTax: "",
  leaveDeductions: "",
};

const formatAmount = (value) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const getAmount = (value) => Number.parseFloat(value) || 0;

export default function AddPayslip() {
  const [details, setDetails] = useState(initialDetails);
  const [earnings, setEarnings] = useState([{ id: 1, label: "Salary", amount: "" }]);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [includeLeaveDeductions, setIncludeLeaveDeductions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [remarks, setRemarks] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.payslip || {});

  const totalEarnings = earnings.reduce(
    (total, earning) => total + getAmount(earning.amount),
    0,
  );
  const totalDeductions =
    getAmount(deductions.providentFund) +
    getAmount(deductions.professionalTax) +
    (includeLeaveDeductions ? getAmount(deductions.leaveDeductions) : 0);

  const updateDetail = (event) => {
    const { name, value } = event.target;
    setDetails((current) => ({ ...current, [name]: value }));
  };

  const updateDeduction = (event) => {
    const { name, value } = event.target;
    setDeductions((current) => ({ ...current, [name]: value }));
  };

  const updateEarning = (id, field, value) => {
    setEarnings((current) =>
      current.map((earning) =>
        earning.id === id ? { ...earning, [field]: value } : earning,
      ),
    );
  };

  const addEarning = () => {
    setEarnings((current) => [
      ...current,
      { id: Date.now(), label: "", amount: "" },
    ]);
  };

  const removeEarning = (id) => {
    setEarnings((current) => current.filter((earning) => earning.id !== id));
  };

  const clearForm = () => {
    setDetails(initialDetails);
    setEarnings([{ id: 1, label: "Salary", amount: "" }]);
    setDeductions(initialDeductions);
    setIncludeLeaveDeductions(false);
    setPaymentMethod("bank");
    setRemarks("");
  };

  const savePayslip = async () => {
    if (!details.staffId || !details.designation || !details.paymentDate || !details.salaryMonth || !details.daysPayable) {
      toast.error("Please fill all required payslip details.");
      return;
    }

    const userId = Number(details.staffId);
    const daysPayable = Number(details.daysPayable);
    if (!Number.isInteger(userId) || userId <= 0 || !Number.isFinite(daysPayable) || daysPayable < 0) {
      toast.error("Please enter valid employee ID and payable days.");
      return;
    }

    const payload = {
      userId,
      designation: details.designation,
      paymentDate: details.paymentDate,
      salaryMonthAndYear: details.salaryMonth,
      daysPayable,
      earnings: earnings
        .filter((earning) => earning.label && getAmount(earning.amount) > 0)
        .map((earning) => ({
          componentName: earning.label,
          componentType: "EARNING",
          amount: getAmount(earning.amount),
        })),
      deductions: [
        { componentName: "Provident Fund (PF)", amount: deductions.providentFund },
        { componentName: "Professional Tax", amount: deductions.professionalTax },
        ...(includeLeaveDeductions
          ? [{ componentName: "Leave Deductions", amount: deductions.leaveDeductions }]
          : []),
      ]
        .filter((deduction) => getAmount(deduction.amount) > 0)
        .map((deduction) => ({
          ...deduction,
          componentType: "DEDUCTION",
          amount: getAmount(deduction.amount),
        })),
      paymentMethod: paymentMethod === "bank" ? "BANK_TRANSFER" : "CHEQUE",
      remarks,
    };

    try {
      await dispatch(createPayslip(payload)).unwrap();
      toast.success("Payslip saved successfully.");
      clearForm();
    } catch (error) {
      toast.error(error?.message || "Unable to save payslip.");
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
          Add Payslips
        </h1>
        <p className="mt-1 text-sm text-gray-500">Home / Accounts / Add Payslips</p>
      </header>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-700">Add Payslips</h2>
        </div>

        <div className="space-y-5 p-3 sm:p-5">
          <FormCard title="Teacher / Staff Details">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
              <TextField
                label="Teacher / Staff ID"
                name="staffId"
                value={details.staffId}
                onChange={updateDetail}
              />
              <TextField
                label="Teacher / Staff Name"
                name="staffName"
                value={details.staffName}
                onChange={updateDetail}
              />
              <TextField
                label="Department"
                name="department"
                placeholder="Department"
                value={details.department}
                onChange={updateDetail}
              />
              <TextField
                label="Designation"
                name="designation"
                placeholder="Designation"
                value={details.designation}
                onChange={updateDetail}
              />
              <DateField
                label="Salary Month/Year"
                name="salaryMonth"
                type="month"
                value={details.salaryMonth}
                onChange={updateDetail}
              />
              <DateField
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={details.paymentDate}
                onChange={updateDetail}
              />
              <TextField
                label="Days Payable"
                name="daysPayable"
                type="number"
                min="0"
                value={details.daysPayable}
                onChange={updateDetail}
              />
            </div>
          </FormCard>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <FormCard title="Earnings" footerLabel="Total Earnings" footerValue={formatAmount(totalEarnings)}>
              <div className="space-y-3">
                {earnings.map((earning, index) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2rem] items-center gap-3"
                    key={earning.id}
                  >
                    {index === 0 ? (
                      <span className="text-sm font-medium text-gray-800">Salary</span>
                    ) : (
                      <input
                        aria-label="Earning name"
                        className="form-input"
                        placeholder="Earning name"
                        value={earning.label}
                        onChange={(event) =>
                          updateEarning(earning.id, "label", event.target.value)
                        }
                      />
                    )}
                    <input
                      aria-label={`${earning.label || "Earning"} amount`}
                      className="form-input"
                      inputMode="decimal"
                      min="0"
                      placeholder="0.00"
                      type="number"
                      value={earning.amount}
                      onChange={(event) =>
                        updateEarning(earning.id, "amount", event.target.value)
                      }
                    />
                    {index === 0 ? (
                      <span aria-hidden="true" />
                    ) : (
                      <button
                        aria-label="Remove earning"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-rose-600 transition hover:bg-rose-50"
                        onClick={() => removeEarning(earning.id)}
                        type="button"
                      >
                        <Trash2 size={19} />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    aria-label="Add earning"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-50"
                    onClick={addEarning}
                    type="button"
                  >
                    <PlusCircle size={25} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </FormCard>

            <FormCard
              title="Deductions"
              footerLabel="Total Deductions"
              footerValue={formatAmount(totalDeductions)}
            >
              <div className="space-y-4">
                <AmountField
                  label="Provident Fund (PF)"
                  name="providentFund"
                  value={deductions.providentFund}
                  onChange={updateDeduction}
                />
                <AmountField
                  label="Professional Tax"
                  name="professionalTax"
                  value={deductions.professionalTax}
                  onChange={updateDeduction}
                />
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 text-sm font-medium text-gray-800">
                    <input
                      checked={includeLeaveDeductions}
                      className="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
                      onChange={(event) => setIncludeLeaveDeductions(event.target.checked)}
                      type="checkbox"
                    />
                    Leave Deductions
                  </label>
                  <input
                    aria-label="Leave deductions amount"
                    className="form-input"
                    disabled={!includeLeaveDeductions}
                    inputMode="decimal"
                    min="0"
                    name="leaveDeductions"
                    placeholder="0.00"
                    type="number"
                    value={deductions.leaveDeductions}
                    onChange={updateDeduction}
                  />
                </div>
              </div>
            </FormCard>
          </div>

          <FormCard title="Payment Method">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <PaymentOption
                  checked={paymentMethod === "bank"}
                  label="Bank Transfer"
                  onChange={() => setPaymentMethod("bank")}
                  value="bank"
                />
                <PaymentOption
                  checked={paymentMethod === "cheque"}
                  label="Cheque Payment"
                  onChange={() => setPaymentMethod("cheque")}
                  value="cheque"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800" htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  className="form-textarea min-h-32"
                  id="remarks"
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                />
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-3 pt-1">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
              onClick={clearForm}
              type="button"
            >
              <Eraser size={17} />
              Clear
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              onClick={savePayslip}
              type="button"
            >
              <Save size={17} />
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function FormCard({ children, footerLabel, footerValue, title }) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
      {footerLabel && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-slate-50 px-4 py-4 text-sm font-semibold text-gray-800">
          <span>{footerLabel}</span>
          <span>{footerValue}</span>
        </div>
      )}
    </section>
  );
}

function TextField({ label, ...inputProps }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-800" htmlFor={inputProps.name}>
        {label}
      </label>
      <input className="form-input" id={inputProps.name} {...inputProps} />
    </div>
  );
}

function DateField({ label, name, type, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-800" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          className="form-input appearance-none pr-10"
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
        />
        <CalendarDays
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>
    </div>
  );
}

function AmountField({ label, name, onChange, value }) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
      <label className="text-sm font-medium text-gray-800" htmlFor={name}>
        {label}
      </label>
      <input
        className="form-input"
        id={name}
        inputMode="decimal"
        min="0"
        name={name}
        placeholder="0.00"
        type="number"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function PaymentOption({ checked, label, onChange, value }) {
  return (
    <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-md border border-gray-300 bg-slate-50 px-4 text-sm font-medium text-slate-800 transition hover:border-brand-600">
      <input
        checked={checked}
        className="h-5 w-5 border-gray-300 text-teal-700 focus:ring-teal-700"
        name="paymentMethod"
        onChange={onChange}
        type="radio"
        value={value}
      />
      {label}
    </label>
  );
}
