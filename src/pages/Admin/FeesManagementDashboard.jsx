import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Search, Bell, Mail, User, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary, fetchDashboardTrends } from "../../features/Admin/FeesDashboard/feesDashboardSlice";
import { fetchAcademicYears } from "../../features/Admin/ExamSchedule/examScheduleSlice";

const FeesManagementDashboard = () => {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState("yearly");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const { summary, trends, loading, error } = useSelector(
    (state) => state.feesDashboard
  );
  const { academicYears } = useSelector((state) => state.examSchedule);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAcademicYear) {
      const billingType = viewType === "yearly" ? "YEARLY" : "QUARTERLY";
      dispatch(
        fetchDashboardTrends({
          academicYearId: selectedAcademicYear,
          billingType,
        })
      );
    }
  }, [selectedAcademicYear, viewType, dispatch]);

  useEffect(() => {
    if (academicYears && academicYears.length > 0) {
      setSelectedAcademicYear(academicYears[0]?.id || "");
    }
  }, [academicYears]);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "0";
    }

    return Math.round(Number(amount)).toLocaleString("en-IN");
  };


  return (
    <div className="min-h-screen bg-gray-100 fees-theme-scope">

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">Fees Management Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600">Home / Analytics Dashboard / Fees Management Dashboard</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-green-500 rounded-full p-2 sm:p-3 flex-shrink-0">
                <div className="text-white text-lg sm:text-xl">₹</div>
              </div>
              <div className="min-w-0">
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                  ₹ {loading ? "Loading..." : formatCurrency(summary?.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Amount Receiving */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-green-500 rounded-full p-2 sm:p-3 flex-shrink-0">
                <div className="text-white text-lg sm:text-xl">💵</div>
              </div>
              <div className="min-w-0">
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Total Amount Receiving</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                  ₹ {loading ? "Loading..." : formatCurrency(summary?.totalReceived)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Outstanding */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-yellow-500 rounded-full p-2 sm:p-3 flex-shrink-0">
                <div className="text-white text-lg sm:text-xl">💰</div>
              </div>
              <div className="min-w-0">
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Total Outstanding</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                  ₹ {loading ? "Loading..." : formatCurrency(summary?.totalOutstanding)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Achievement & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Target Achievement */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Target Achievement</h2>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="relative w-full h-[150px] sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { value: summary?.collectionPercentage || 0 },
                        { value: 100 - (summary?.collectionPercentage || 0) },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl sm:text-3xl font-bold text-gray-800">
                    {(summary?.collectionPercentage || 0).toFixed(2)}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Collected</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Fees Received</p>
                <p className="text-sm sm:text-xl font-bold text-gray-800">
                  {loading ? "Loading..." : formatCurrency(summary?.totalReceived)}
                </p>
              </div>
            </div>
          </div>

          {/* Fees Collection Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-2">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800">Fees Collection Trends</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <select
                  className="w-full sm:w-auto px-2 sm:px-3 py-1.5 border border-gray-300 rounded text-xs sm:text-sm bg-white"
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                >
                  <option value="">Select Academic Year</option>
                  {academicYears?.map((year) => (
                    <option key={year?.id} value={year?.id}>
                      {year?.year}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full sm:w-auto px-2 sm:px-3 py-1.5 border border-gray-300 rounded text-xs sm:text-sm bg-white"
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                >
                  <option value="yearly">Yearly Wise</option>
                  <option value="quarterly">Quarterly Wise</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">Comparative analysis across monthly & quarters</p>
            {loading ? (
              <div className="flex items-center justify-center h-[200px] sm:h-[350px] text-gray-500 text-sm">
                Loading chart data...
              </div>
            ) : trends && trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} className="sm:h-[350px]">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                  <Legend />
                  <Bar dataKey="received" fill="#10b981" name="Total Received" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="outstanding" fill="#f87171" name="Total outstanding" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] sm:h-[350px] text-gray-500 text-sm">
                Select an Academic Year to view trends
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-800">Recent Transactions</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">View All History</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] sm:text-sm min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">S.No.</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">Roll No.</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">Student Name</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">Class</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">Fees Type</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-[10px] sm:text-sm">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-600 text-xs">
                      Loading transactions...
                    </td>
                  </tr>
                ) : summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                  summary.recentTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">{transaction.rollNo}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">{transaction.studentName}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">{transaction.className}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">{transaction.feeType}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">{transaction.date}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800">₹ {formatCurrency(transaction.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-600 text-xs">
                      No recent transactions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesManagementDashboard;
