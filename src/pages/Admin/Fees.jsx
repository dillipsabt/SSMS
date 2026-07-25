import React, { useState, useEffect } from "react";
import { Trash2, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import useToastMessage from "../../utils/useToastMessage";
import { getStudentsAsync } from "../../features/Admin/student/studentSlice";
import {
  fetchStudentFeesAsync,
  fetchPaymentHistoryAsync,
  createPaymentTransactionAsync,
  clearError,
  clearSuccess,
} from "../../features/Admin/FeesTransaction/feesTransactionSlice";

const FEE_TYPES = [
  { name: "School Fees", billingOptions: ["Yearly", "Quarterly"] },
  { name: "Transportation Fees", billingOptions: ["Yearly", "Quarterly"] },
  { name: "Books Fees", billingOptions: ["Yearly"] },
  { name: "Lab Fees", billingOptions: ["Yearly"] },
  { name: "Admission Fees", billingOptions: ["Yearly"] },
];

const PAYMENT_MODES = [
  "Select Mode",
  "Cash",
  "Online Transfer",
  "Cheque",
  "Demand Draft",
  "UPI",
];

const Fees = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.student);
  const { studentFees, paymentHistory, transaction, loading, error, success } =
    useSelector((state) => state.feesTransaction);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  const [admissionNo, setAdmissionNo] = useState("");
  const [studentDetails, setStudentDetails] = useState({
    admissionNo: "",
    studentName: "",
    class: "",
    fatherName: "",
    totalFees: 0,
    receivedFees: 0,
    pendingFees: 0,
  });

  const [transactionHistory, setTransactionHistory] = useState([]);

  const [paymentRows, setPaymentRows] = useState([
    {
      id: 1,
      feesType: "",
      billingSelection: "Yearly",
      installments: "",
      amount: 0,
    },
  ]);

  const [gstRate, setGstRate] = useState(5);
  const [paymentMode, setPaymentMode] = useState("Select Mode");

  // Clear stale messages and register Redux toast handler
  useToastMessage({
    success,
    error,
    successMessage: "Payment successful",
    clearSuccess,
    clearError,
  });

  // Fetch students on component mount
  useEffect(() => {
    dispatch(getStudentsAsync());
  }, [dispatch]);

  // Handle roll number change and fetch student data
  const handleRollNumberChange = async (e) => {
    const value = e.target.value;

    setAdmissionNo(value);

    if (!value.trim()) {
      setStudentDetails({
        admissionNo: "",
        studentName: "",
        class: "",
        fatherName: "",
        totalFees: 0,
        receivedFees: 0,
        pendingFees: 0,
      });

      setTransactionHistory([]);
      return;
    }

    try {
      // =========================================
      // FETCH STUDENT FEES
      // =========================================

      const feesAction = await dispatch(fetchStudentFeesAsync(value));

      if (fetchStudentFeesAsync.fulfilled.match(feesAction)) {
        const feesData = feesAction.payload;

        setStudentDetails({
          admissionNo: value,
          studentName: feesData.studentName || "",
          class: feesData.className || "",
          fatherName: feesData.fatherName || "",
          totalFees: feesData.totalFees || 0,
          receivedFees: feesData.receivedFees || 0,
          pendingFees: feesData.pendingFees || 0,
        });
      }

      // =========================================
      // FETCH PAYMENT HISTORY
      // =========================================

      const historyAction = await dispatch(
        fetchPaymentHistoryAsync({
          admissionNo: value,
          params: {},
        }),
      );

      if (fetchPaymentHistoryAsync.fulfilled.match(historyAction)) {
        const historyPayload = historyAction.payload;

        const historyArray = Array.isArray(historyPayload)
          ? historyPayload
          : historyPayload.content || [];

        const historyData = historyArray.map((item, idx) => ({
          id: idx + 1,
          transId: item.transactionId || "-",
          transDate: item.transactionDate || "-",
          feesType: item.feeType || "-",
          installments: item.installment || "-",
          paidAmount:
            item.paidAmount || item.totalAmount || item.netAmount || 0,
          dueAmount: item.remainingAmount || item.dueAmount || 0,
        }));

        setTransactionHistory(historyData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch student data");
    }
  };

  const totalAmount = paymentRows.reduce(
    (sum, row) => sum + (row.amount || 0),
    0,
  );
  const charges = 0;
  const gstAmount = (totalAmount * gstRate) / 100;
  const netAmount = totalAmount + charges + gstAmount;

  // Format numbers with two decimal places for display
  const formatCurrency = (value) => {
    return value.toFixed(2).replace(/\.?0+$/, "");
  };

  const handleFeeTypeChange = (id, value) => {
    setPaymentRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, feesType: value } : row)),
    );
  };

  const handleBillingChange = (id, value) => {
    setPaymentRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, billingSelection: value } : row,
      ),
    );
  };

  const handleInstallmentChange = (id, value) => {
    setPaymentRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, installments: value } : row,
      ),
    );
  };

  const handleAmountChange = (id, value) => {
    setPaymentRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, amount: parseFloat(value) || 0 } : row,
      ),
    );
  };

  const handleDeleteRow = (id) => {
    setPaymentRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    const newId = Math.max(...paymentRows.map((r) => r.id), 0) + 1;
    setPaymentRows((prev) => [
      ...prev,
      {
        id: newId,
        feesType: "",
        billingSelection: "Quarterly",
        installments: "",
        amount: 0,
      },
    ]);
  };

  const getSelectedFeeType = (feesTypeName) => {
    return FEE_TYPES.find((fee) => fee.name === feesTypeName);
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!admissionNo.trim()) {
      toast.error("Please enter admission number");
      return;
    }

    if (paymentMode === "Select Mode") {
      toast.error("Please select payment mode");
      return;
    }

    const invalidRow = paymentRows.find(
      (row) =>
        !row.feesType ||
        !row.billingSelection ||
        !row.amount ||
        row.amount <= 0,
    );

    if (invalidRow) {
      toast.error("Please fill all payment details");
      return;
    }

    const feeTypeMap = {
      "School Fees": "SCHOOL_FEES",
      "Transportation Fees": "TRANSPORTATION_FEES",
      "Books Fees": "BOOKS_FEES",
      "Lab Fees": "LAB_FEES",
      "Admission Fees": "ADMISSION_FEES",
    };

    const billingTypeMap = {
      Yearly: "YEARLY",
      Quarterly: "QUARTERLY",
      "One-Time": "ONE_TIME",
    };

    const paymentModeMap = {
      Cash: "CASH",
      "Online Transfer": "ONLINE_TRANSFER",
      Cheque: "CHEQUE",
      "Demand Draft": "DEMAND_DRAFT",
      UPI: "UPI",
    };

    const items = paymentRows.map((row) => {
      let installmentValue = null;

      // =====================================
      // INSTALLMENT VALUE
      // =====================================

      if (row.billingSelection === "Quarterly") {
        installmentValue = row.installments || null;
      }

      return {
        feeType:
          row.feesType === "Transportation Fees"
            ? "TRANSPORT_FEES"
            : feeTypeMap[row.feesType],

        billingType: billingTypeMap[row.billingSelection],

        installment: installmentValue || null,

        amount: Number(row.amount),
      };
    });

    const paymentPayload = {
      admissionNo: String(admissionNo),
      gstPercentage: Number(gstRate),
      paymentMode: paymentModeMap[paymentMode],
      items,
    };

    try {
      const resultAction = await dispatch(
        createPaymentTransactionAsync(paymentPayload),
      );

      if (createPaymentTransactionAsync.fulfilled.match(resultAction)) {
        // =====================================
        // REFRESH PAYMENT HISTORY
        // =====================================

        const historyAction = await dispatch(
          fetchPaymentHistoryAsync({
            admissionNo: admissionNo,
            params: {},
          }),
        );

        if (fetchPaymentHistoryAsync.fulfilled.match(historyAction)) {
          const historyPayload = historyAction.payload;

          const historyArray = Array.isArray(historyPayload)
            ? historyPayload
            : historyPayload.content || [];

          const historyData = historyArray.map((item, idx) => ({
            id: idx + 1,
            transId: item.transactionId || "-",
            transDate: item.transactionDate || "-",
            feesType: item.feeType || "-",
            installments: item.installment || "-",
            paidAmount:
              item.paidAmount || item.totalAmount || item.netAmount || 0,
            dueAmount: item.remainingAmount || item.dueAmount || 0,
          }));

          setTransactionHistory(historyData);
        }

        // =====================================
        // RESET FORM
        // =====================================

        setPaymentRows([
          {
            id: 1,
            feesType: "",
            billingSelection: "Yearly",
            installments: "",
            amount: 0,
          },
        ]);

        setPaymentMode("Select Mode");
        setGstRate(5);

        // refresh student fees summary
        const updatedFeesAction = await dispatch(
          fetchStudentFeesAsync(admissionNo),
        );

        if (fetchStudentFeesAsync.fulfilled.match(updatedFeesAction)) {
          const updatedFees = updatedFeesAction.payload;

          setStudentDetails({
            admissionNo: admissionNo,
            studentName: updatedFees.studentName || "",
            class: updatedFees.className || "",
            fatherName: updatedFees.fatherName || "",
            totalFees: updatedFees.totalFees || 0,
            receivedFees: updatedFees.receivedFees || 0,
            pendingFees: updatedFees.pendingFees || 0,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-wrap p-4 sm:p-6">
      {/* Header */}
      <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-1">
        Fees
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-6">
        Fees Management / Fees
      </p>

      <div className="card rounded-lg overflow-hidden">
        {/* Student Details Section */}
        <div className="card-section bg-blue-50 border-b border-blue-200 text-sm sm:text-base">
          <span className="text-blue-900 font-semibold">Student Details</span>
        </div>

        <div className="p-4 sm:p-6 border-b border-gray-200">
          {/* Roll Number Input */}
          <div className="mb-6 max-w-xs">
            <label className="form-label text-xs sm:text-sm">
              Admission Number *
            </label>
            <input
              type="text"
              value={admissionNo}
              onChange={handleRollNumberChange}
              placeholder="1029384"
              className="form-input text-sm"
            />
          </div>

          {/* Display student details */}
          {studentDetails.studentName && (
            <>
              {/* Student Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                  <p className="text-sm font-medium text-gray-600">
                    Student Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {studentDetails.studentName}
                  </p>
                </div>

                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                  <p className="text-sm font-medium text-gray-600">Class</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {studentDetails.class}
                  </p>
                </div>

                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                  <p className="text-sm font-medium text-gray-600">
                    Father Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {studentDetails.fatherName}
                  </p>
                </div>
              </div>

              {/* Fees Summary Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center justify-between border border-blue-200 rounded-lg px-4 py-3 bg-blue-50">
                  <p className="text-sm font-medium text-blue-700">
                    Total Fees
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {studentDetails.totalFees}
                  </p>
                </div>

                <div className="flex items-center justify-between border border-green-200 rounded-lg px-4 py-3 bg-green-50">
                  <p className="text-sm font-medium text-green-700">
                    Received Fees
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {studentDetails.receivedFees}
                  </p>
                </div>

                <div className="flex items-center justify-between border border-amber-200 rounded-lg px-4 py-3 bg-amber-50">
                  <p className="text-sm font-medium text-amber-700">
                    Pending Fees
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    {studentDetails.pendingFees}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Transaction History Table */}
        {transactionHistory.length > 0 && (
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
              Transaction History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-full">
                <thead className="thead-row">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      S.No.
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Trans ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Trans Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Fees Type
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Installments
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Paid Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Due Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactionHistory.map((row, idx) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {row.transId}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.transDate}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.feesType}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.installments}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {row.paidAmount}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {row.dueAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Section */}
        <div className="border-b border-gray-200">
          {/* Payment Header */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
              Payment
            </h3>
          </div>

          {/* Payment Content */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Payment Table */}
              <div className="lg:col-span-3">
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                  <table className="w-full text-xs min-w-full">
                    <thead className="thead-row">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Fees Type
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Billing Selection
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Installments
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentRows.map((row, index) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <select
                              value={row.feesType}
                              onChange={(e) =>
                                handleFeeTypeChange(row.id, e.target.value)
                              }
                              className="form-select text-xs w-30 pr-5"
                            >
                              <option value="">Select Fees</option>
                              {FEE_TYPES.map((fee) => (
                                <option key={fee.name} value={fee.name}>
                                  {fee.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {getSelectedFeeType(row.feesType) ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                {getSelectedFeeType(
                                  row.feesType,
                                )?.billingOptions.map((option) => (
                                  <label
                                    key={option}
                                    className="flex items-center gap-1 cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name={`billing-${row.id}`}
                                      value={option}
                                      checked={row.billingSelection === option}
                                      onChange={(e) =>
                                        handleBillingChange(
                                          row.id,
                                          e.target.value,
                                        )
                                      }
                                      className="w-3 h-3 accent-brand-600"
                                    />
                                    <span className="text-xs text-gray-700">
                                      {option}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500 italic">
                                Select Fees Type
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {row.billingSelection === "One-Time" ||
                            row.billingSelection === "Yearly" ? (
                              <span className="text-xs text-gray-500 italic">
                                N/A (Standard)
                              </span>
                            ) : (
                              <select
                                value={row.installments}
                                onChange={(e) =>
                                  handleInstallmentChange(
                                    row.id,
                                    e.target.value,
                                  )
                                }
                                className="form-select text-xs w-25"
                              >
                                <option value="">Select</option>
                                {row.billingSelection === "Quarterly" ? (
                                  <>
                                    <option value="Q1">Q1</option>
                                    <option value="Q2">Q2</option>
                                    <option value="Q3">Q3</option>
                                    <option value="Q4">Q4</option>
                                  </>
                                ) : null}
                              </select>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={row.amount}
                              onChange={(e) =>
                                handleAmountChange(row.id, e.target.value)
                              }
                              className="table-input"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3 flex items-center justify-end gap-2">
                            {index === paymentRows.length - 1 && (
                              <button
                                onClick={handleAddRow}
                                className="text-blue-500 hover:text-blue-700 transition inline-flex items-center justify-center p-1"
                                title="Add new row"
                              >
                                <PlusCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteRow(row.id)}
                              className="text-red-500 hover:text-red-700 transition inline-flex items-center justify-center p-1"
                              title="Delete row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary Panel */}
              <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200 h-fit shadow-sm space-y-4">
                <h4 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-300">
                  Financial Summary
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Amount</span>
                    <span className="font-bold text-gray-900">
                      {Math.round(totalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Charges</span>
                    <span className="font-semibold text-gray-700">
                      {charges.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-gray-700 block">Include GST</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        min="0"
                        max="100"
                        className="table-input w-12 text-xs py-1"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Net Amount</span>
                    <span className="font-bold text-lg text-gray-900">
                      {Math.round(netAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2 mt-4">
                    <span className="text-gray-700 block">Payment Mode</span>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="form-select text-xs w-28 py-1"
                    >
                      {PAYMENT_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={handlePaymentSubmit}
            disabled={loading}
            className="btn-primary hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fees;
