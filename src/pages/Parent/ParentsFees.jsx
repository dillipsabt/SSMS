import React, { useEffect } from "react";
import { Download, HandCoins, Wallet, BadgeIndianRupee, } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import feesBanner from "../../assets/fees-banner.png";
import { fetchParentFeesLedger } from "../../features/parent/Fees/parentFeesSlice";

export default function ParentsFees() {
  const dispatch = useDispatch();
  const { totalFees, paidFees, pendingFees, transactions, loading } = useSelector(
    (state) => state.parentFees
  );

  useEffect(() => {
    dispatch(fetchParentFeesLedger());
  }, [dispatch]);

  const feesSummary = [
    {
      label: "Pending Fees",
      amount: `₹ ${pendingFees?.toLocaleString() || 0}`,
      bg: "bg-[#FBE9EC]",
      iconBg: "bg-[#FAD0D7]",
      iconColor: "text-[#F43F5E]",
      icon: HandCoins,
    },
    {
      label: "Paid Fees",
      amount: `₹ ${paidFees?.toLocaleString() || 0}`,
      bg: "bg-[#DFF6E6]",
      iconBg: "bg-[#BDF2CB]",
      iconColor: "text-[#16A34A]",
      icon: Wallet,
    },
    {
      label: "Total Fees",
      amount: `₹ ${totalFees?.toLocaleString() || 0}`,
      bg: "bg-[#E7EEF8]",
      iconBg: "bg-[#D3E2F7]",
      iconColor: "text-[#4F46E5]",
      icon: BadgeIndianRupee,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="w-full px-4 sm:px-2">
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Fees</h2>
      <p className="text-sm text-gray-500 mb-4">Home / Fees</p>

      {/* FEE LEDGER BANNER */}
      <div className="bg-gradient-to-r from-[#7C5CFA] via-[#9C4DFF] to-[#C026D3]
rounded-lg px-5 sm:px-8 sm:py-8 mb-6
flex flex-col sm:flex-row items-center justify-between gap-6">

        <div>
          <h3 className="text-white text-2xl font-bold">
            Fee Ledger
          </h3>

          <p className="text-sm text-purple-100 mt-2">
            Full historical record of institutional transactions and student billing
          </p>
        </div>

        <img
          src={feesBanner}
          alt="Fees Banner"
          className="w-24 sm:w-32 lg:w-36 object-contain"
        />
      </div>

      {/* FEES SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {feesSummary.map((item, i) => (

          <div
            key={i}
            className={`${item.bg}
    border border-gray-200
    rounded-lg
    shadow-sm
    overflow-hidden`}
          >
            <div className="p-4 sm:p-5 flex items-center justify-between">

              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#333333]">
                  {item.amount}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {item.label}
                </p>
              </div>

              <div
                className={`${item.iconBg}
      w-12 h-12 sm:w-14 sm:h-14
      rounded-lg
      flex items-center justify-center`}
              >
                <item.icon
                  size={28}
                  className={item.iconColor}
                />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* FEES LIST */}
      <div className="card overflow-hidden">
        <div className="h-[50px]
flex items-center
px-4
border-b border-gray-200">

          <h3 className="text-[16px]
  font-semibold
  text-[#333333]">

            Fees List

          </h3>

        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">S.No.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Transaction ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fees Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fees Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fees Amount(₹)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {(transactions || []).map((row, index) => (
                <tr key={row.transactionId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-800">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-800">{row.transactionId}</td>
                  <td className="px-4 py-3 text-gray-800">{formatDate(row.feeDate)}</td>
                  <td className="px-4 py-3 text-gray-800">{row.feeType}</td>
                  <td className="px-4 py-3 text-gray-800">{row.feeAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : row.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                      }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.status === "Paid" && (
                      <button
                        className="
    text-indigo-600
    hover:text-indigo-800
    transition
  "
                      >
                        <Download
                          size={16}
                          strokeWidth={2.5}
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {/* TOTAL */}
              {transactions.length > 0 && (
                <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                  <td colSpan="4" className="px-4 py-3 text-gray-800">Total</td>
                  <td className="px-4 py-3 text-gray-800">{paidFees?.toLocaleString()}</td>
                  <td colSpan="2"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
