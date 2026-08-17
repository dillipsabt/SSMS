import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, X, Search, Calendar } from "lucide-react";
import logo from "../../assets/defaultLogo.png";
import Pagination from "../../components/common/Pagination";
import { fetchReceiptsAsync, fetchReceiptByTransactionIdAsync, clearSelectedReceipt } from "../../features/Admin/FeesTransaction/feesTransactionSlice";
import { getSchoolDetailsAsync } from "../../features/Admin/SchoolDetails/schoolDetailsSlice";
import {
  generateCardPaymentSlipPdf,
  generatePaymentReceiptPdf,
  printCardPaymentSlipPdf,
  printPaymentReceiptPdf,
  getReceiptImageSource,
} from "../../utils/generatePaymentReceiptPdf";

export default function FeesList() {
  const dispatch = useDispatch();
  const { receipts, pagination, loading, selectedReceipt } = useSelector(
    (state) => state.feesTransaction
  );
  const { schoolDetails } = useSelector((state) => state.schoolDetails);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getSchoolDetailsAsync());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
    };

    if (fromDate) {
      params.startDate = fromDate;
    }

    if (toDate) {
      params.endDate = toDate;
    }

    dispatch(fetchReceiptsAsync(params));
  }, [dispatch, currentPage, rowsPerPage, fromDate, toDate]);

  const receipt = selectedReceipt;
  const schoolLogo = getReceiptImageSource(
    schoolDetails?.schoolLogoBase64 || schoolDetails?.logoBase64 || schoolDetails?.logo || schoolDetails?.schoolLogo || schoolDetails?.schoolLogoUrl || schoolDetails?.logoUrl,
  );
  const principalSignature = getReceiptImageSource(
    schoolDetails?.principalSignatureBase64 || schoolDetails?.signatureBase64 || schoolDetails?.principalSignBase64 || schoolDetails?.principalSignature || schoolDetails?.principalSign || schoolDetails?.principalSignatureUrl || schoolDetails?.signatureUrl,
  );

  const subTotal = receipt
    ? (receipt.items || []).reduce(
      (s, f) => s + Number(f.amount || 0),
      0
    )
    : 0;

  const netAmount = Number(receipt?.netAmount || 0);

  const totalPages = pagination.totalPages || 0;

  const runReceiptAction = async (action) => {
    if (!receipt) return;
    await action(receipt, schoolDetails);
  };

  return (
    <div className="p-4 sm:p-6 fees-theme-scope">

      {/* HEADER */}
      <h2 className="text-base sm:text-[18px] font-semibold text-[#333333]">Fees List</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">Fees Management / Fees List</p>

      <div className="card p-3 sm:p-4">
        <h3 className="text-xs sm:text-[13px] font-medium text-gray-700 mb-3">Fees List</h3>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 h-[32px] px-2 text-[11px] sm:text-[12px] rounded focus:outline-none focus:border-brand-600"
            />
            <span className="text-gray-400 text-[11px] hidden sm:inline">-</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 h-[32px] px-2 text-[11px] sm:text-[12px] rounded focus:outline-none focus:border-brand-600"
            />
            <Calendar size={15} className="text-gray-500" />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center gap-1 bg-brand-600 text-white px-3 sm:px-4 h-[32px] rounded text-[11px] sm:text-[12px] hover:bg-brand-700 transition"
          >
            <Search size={12} />
            Search
          </button>
        </div>

        {/* ── Table ── */}
        <div className="border border-gray-300 rounded overflow-x-auto">
          <table className="min-w-[700px] w-full text-[11px] sm:text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left font-medium">S.No.</th>
                <th className="px-3 py-2 text-left font-medium">Trans ID</th>
                <th className="px-3 py-2 text-left font-medium">Trans Date</th>
                <th className="px-3 py-2 text-left font-medium">Roll Number</th>
                <th className="px-3 py-2 text-left font-medium">Student Name</th>
                <th className="px-3 py-2 text-left font-medium">Class</th>
                <th className="px-3 py-2 text-left font-medium">Full Amount</th>
                <th className="px-3 py-2 text-center font-medium">Receipt Download</th>
              </tr>
            </thead>
            <tbody>
              {(receipts || []).length > 0 ? (
                (receipts || []).map((row, i) => (
                  <tr key={row.transactionId} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-3 py-2">{pagination.page * rowsPerPage + i + 1}</td>
                    <td className="px-3 py-2 text-brand-600 font-medium">{row.transactionId}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.transactionDate}</td>
                    <td className="px-3 py-2">{row.rollNo}</td>
                    <td className="px-3 py-2">{row.studentName}</td>
                    <td className="px-3 py-2">{row.className}</td>
                    <td className="px-3 py-2">
                      {Number(row.paidAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => dispatch(fetchReceiptByTransactionIdAsync(row.transactionId))}
                        className="text-brand-600 hover:text-brand-700 transition"
                        title="View / Download Receipt"
                      >
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-3 py-8 text-center text-gray-500">
                    {loading ? "Loading..." : "No fees records found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end gap-2 mt-3 text-[12px]">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-brand-600 text-white px-3 py-1 rounded hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <span className="text-gray-500">Page: {currentPage} of {totalPages}</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded w-[60px]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* ── Payment Receipt Modal ── */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[680px] bg-white rounded shadow-lg max-h-[90vh] overflow-y-auto">

            {/* Close button (non-print) */}
            <div className="flex justify-end p-2 print:hidden">
              <button
                onClick={() => dispatch(clearSelectedReceipt())}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Receipt Content ── */}
            <div className="px-8 pb-8" id="receipt-content">

              {/* Receipt Header: Logo + School Name */}
              <div className="flex items-center justify-between mb-1 border-b-2 border-gray-200 pb-3">
                <div className="flex-shrink-0">
                  <img
                    src={schoolLogo || logo}
                    alt="School Logo"
                    className="w-16 h-16 object-contain border border-gray-200 rounded"
                  />
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
                    {schoolDetails?.schoolName || "School Name"}
                  </h1>
                </div>
                <div className="w-16" />
              </div>

              {/* Receipt Title */}
              <div className="text-center mb-4">
                <h2 className="text-[14px] font-semibold text-gray-700 uppercase tracking-widest">
                  Payment Receipt
                </h2>
              </div>

              {/* Student Info */}
              <div className="border border-gray-200 rounded mb-4 text-[12px]">
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="px-4 py-2 border-r border-gray-200">
                    <span className="text-gray-500">Student Name</span>
                    <span className="ml-2 font-medium text-gray-800">{receipt.studentName}</span>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-gray-500">Transaction Date</span>
                    <span className="ml-2 font-medium text-gray-800">{receipt.transactionDate}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="px-4 py-2 border-r border-gray-200">
                    <span className="text-gray-500">Roll Number</span>
                    <span className="ml-2 font-medium text-gray-800">{receipt.rollNo}</span>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="ml-2 font-medium text-gray-800">{receipt.transactionId}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 border-r border-gray-200">
                    <span className="text-gray-500">Class</span>
                    <span className="ml-2 font-medium text-gray-800">{receipt.className}</span>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-gray-500">Address</span>
                    <span className="ml-2 font-medium text-gray-800">{receipt.address || schoolDetails?.address || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Fees Table */}
              <table className="w-full text-[12px] border border-gray-200 mb-4">
                <thead className="bg-[#eef2f7]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium border-b border-gray-200 w-[60px]">S.No.</th>
                    <th className="px-4 py-2 text-left font-medium border-b border-gray-200">Fees Type</th>
                    <th className="px-4 py-2 text-right font-medium border-b border-gray-200 w-[120px]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(receipt.items || []).map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-2 text-gray-600">{i + 1}</td>
                      <td className="px-4 py-2 text-gray-800">{item.feeType}</td>
                      <td className="px-4 py-2 text-right text-gray-800">
                        {Number(item.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-[240px] text-[12px] border border-gray-200 rounded">
                  <div className="flex justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-gray-600">Bill Amt</span>
                    <span className="font-medium">
                      {Number(subTotal || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-gray-600">Charges</span>
                    <span className="font-medium">{Number(receipt.charges || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between px-4 py-2 border-b border-gray-100">
                    <span className="text-gray-600">Include CGST</span>
                    <span className="font-medium">
                      {Number(receipt.gstAmount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-2 bg-gray-50">
                    <span className="text-gray-700 font-semibold">Net Amt</span>
                    <span className="font-bold text-gray-800">
                      {Number(netAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end text-[11px] text-gray-500 border-t border-gray-200 pt-3">
                <div>
                  <p className="font-medium text-gray-700">Principal</p>
                  {principalSignature ? (
                    <img
                      src={principalSignature}
                      alt="Principal signature"
                      className="mt-1 h-10 w-28 object-contain object-left"
                    />
                  ) : (
                    <p>{schoolDetails?.principalName || "-"}</p>
                  )}
                </div>
                <p>{new Date().toLocaleDateString("en-GB")} {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>

            {/* ── Modal Action Buttons ── */}
            <div className="grid grid-cols-2 gap-2 px-4 pb-5 print:hidden sm:grid-cols-3 lg:grid-cols-5">
              <button
                onClick={() => runReceiptAction(printPaymentReceiptPdf)}
                className="w-full min-h-11 rounded-lg bg-sky-600 px-2 py-2 text-[11px] font-semibold leading-tight text-white transition hover:bg-sky-700"
              >
                Print Normal Receipt
              </button>
              <button
                onClick={() => runReceiptAction(generatePaymentReceiptPdf)}
                className="w-full min-h-11 rounded-lg bg-teal-600 px-2 py-2 text-[11px] font-semibold leading-tight text-white transition hover:bg-teal-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => runReceiptAction(printCardPaymentSlipPdf)}
                className="w-full min-h-11 rounded-lg bg-indigo-600 px-2 py-2 text-[11px] font-semibold leading-tight text-white transition hover:bg-indigo-700"
              >
                Print Card Slip
              </button>
              <button
                onClick={() => runReceiptAction(generateCardPaymentSlipPdf)}
                className="w-full min-h-11 rounded-lg bg-violet-600 px-2 py-2 text-[11px] font-semibold leading-tight text-white transition hover:bg-violet-700"
              >
                Download Card PDF
              </button>
              <button
                onClick={() => dispatch(clearSelectedReceipt())}
                className="w-full min-h-11 rounded-lg bg-red-700 px-2 py-2 text-[11px] font-semibold leading-tight text-white transition hover:bg-red-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
