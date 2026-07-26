import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchFinancialDashboard,
    fetchRevenueBreakdown,
    fetchExpenseBreakdown,
    fetchFinancialTrend,
    clearError,
} from "../../features/Admin/FinancialOverview/financialOverviewSlice";

import RevenueIcon from "../../assets/revenue.png";
import ExpenseIcon from "../../assets/expenses.png";
import ProfitIcon from "../../assets/profit.png";
import OutstandingIcon from "../../assets/outstanding.png";

import {
    Wallet,
    BadgeIndianRupee,
    GraduationCap,
    BookOpen,
    Bus,
    NotebookPen,
    Receipt,
    Calendar,
    CalendarDays,
    HatGlasses,
    BadgePercent,
    HandCoins,
    FileText,
    ClipboardList,
    MonitorCheck,
    Banknote,
    Coins,
    TrendingUp,
    Hourglass,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

// ── Colour palettes kept exactly as designed ──────────────────────────────────
const REVENUE_COLORS = [
    "#6D7EF7",
    "#66D08C",
    "#FFA648",
    "#26C6F3",
    "#8D6AF9",
    "#F06292",
    "#4DB6AC",
    "#FFD54F",
];
const EXPENSE_COLORS = [
    "#A855F7",
    "#6675F6",
    "#63CF8A",
    "#FFA647",
    "#1BC3EA",
    "#F06292",
    "#4DB6AC",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => {
    if (n === null || n === undefined || isNaN(n)) return "0";
    return Math.round(Number(n)).toLocaleString("en-IN");
};

// Build a date range string for the last 30 days
const last30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const iso = (d) => d.toISOString().split("T")[0];
    return { startDate: iso(start), endDate: iso(end) };
};

// ── Sub-components (layout unchanged) ─────────────────────────────────────────
function TopCards({ dashboard, loading }) {
    const cards = [
        {
            title: "Total Revenue",
            amount: fmt(dashboard?.totalRevenue),
            bg: "bg-[#EEF5FF]",
            icon: RevenueIcon,
        },
        {
            title: "Total Expenses",
            amount: fmt(dashboard?.totalExpenses),
            bg: "bg-[#EEFFF0]",
            icon: ExpenseIcon,
        },
        {
            title: "Net Profit / Loss",
            amount: fmt(dashboard?.netProfit),
            bg: "bg-[#F1EAFF]",
            icon: ProfitIcon,
        },
        {
            title: "Total Outstanding School Fees",
            amount: fmt(dashboard?.totalOutstandingSchoolFees),
            bg: "bg-[#FFF1F5]",
            icon: OutstandingIcon,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-2 mb-4">
            {cards.map((item, index) => (
                <div
                    key={index}
                    className={`${item.bg} border border-[#E7EBF3] rounded-xl px-4 py-4 shadow-sm flex items-center gap-4`}
                >
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                        <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                    </div>

                    <div>
                        <p className="text-xs text-[#666] mb-2">{item.title}</p>
                        <h2 className="text-md font-semibold text-[#2D3748]">
                            {loading ? "..." : `₹ ${item.amount}`}
                        </h2>
                    </div>
                </div>
            ))}
        </div>
    );
}

const FeeItem = ({ item }) => {
    const Icon = item.icon;

    return (
        <div className="h-full border border-[#E7EBF3] rounded-lg p-3 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon size={18} className={item.color} />
            </div>

            <div>
                <p className="text-sm sm:text-[11px] text-gray-500">{item.title}</p>
                <h4 className="text-md sm:text-[16px] font-bold text-gray-800 mt-1">
                    {item.amount}
                </h4>
            </div>
        </div>
    );
};

const OtherFeeCard = ({ item }) => {
    const Icon = item.icon;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100
                    h-[265px]
                    flex flex-col items-center justify-center
                    text-center px-6">

            <div
                className={`w-16 h-16 rounded-full ${item.iconBg}
                    flex items-center justify-center mb-7`}
            >
                <Icon size={34} className={item.color} strokeWidth={2} />
            </div>

            <p className="text-sm text-[#444] font-normal">
                {item.title}
            </p>

            <h2 className="mt-3 text-md font-bold text-[#333]">
                {item.amount}
            </h2>
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FinancialOverview() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const {
        dashboard,
        revenueBreakdown,
        expenseBreakdown,
        trend,
        loadingDashboard,
        loadingRevenueBreakdown,
        loadingExpenseBreakdown,
        loadingTrend,
        error,
    } = useSelector((state) => state.financialOverview);

    // Fetch summary once on mount
    useEffect(() => {
        dispatch(fetchFinancialDashboard());
    }, [dispatch]);

    // Fetch date-scoped data on mount (last 30 days)
    useEffect(() => {
        const { startDate, endDate } = last30Days();
        dispatch(fetchRevenueBreakdown({ startDate, endDate }));
        dispatch(fetchExpenseBreakdown({ startDate, endDate }));
        dispatch(fetchFinancialTrend({ startDate, endDate }));
    }, [dispatch]);

    // Clear Redux error after it has been shown (the axios interceptor already
    // shows the toast, so we just clean up the state)
    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // ── Derived fee data from dashboard summary ────────────────────────────────
    const schoolFees = [
        {
            title: "Actual School Fee",
            amount: `₹ ${fmt(dashboard?.totalSchoolFees)}`,
            icon: GraduationCap,
            color: "text-purple-600",
        },
        {
            title: "Concession School Fee",
            amount: `₹ ${fmt(dashboard?.concessionSchoolFees)}`,
            icon: BadgePercent,
            color: "text-pink-600",
        },
        {
            title: "Admission Fee",
            amount: `₹ ${fmt(dashboard?.admissionFeesRevenue)}`,
            icon: GraduationCap,
            color: "text-green-600",
        },
        {
            title: "Special Fee",
            amount: `₹ ${fmt(dashboard?.specialFeesRevenue)}`,
            icon: HandCoins,
            color: "text-blue-600",
        },
        {
            title: "Registration Fee",
            amount: `₹ ${fmt(dashboard?.registrationFeesRevenue)}`,
            icon: FileText,
            color: "text-cyan-600",
        },
    ];

    const otherFees = [
        {
            title: "Books Fee",
            amount: `₹ ${fmt(dashboard?.booksFeesRevenue)}`,
            icon: BookOpen,
            color: "text-indigo-600",
            iconBg: "bg-indigo-100",
        },
        {
            title: "Lab Fee",
            amount: `₹ ${fmt(dashboard?.labFeesRevenue)}`,
            icon: MonitorCheck,
            color: "text-green-600",
            iconBg: "bg-green-100",
        },
        {
            title: "Transportation Fees",
            amount: `₹ ${fmt(dashboard?.transportFeesRevenue)}`,
            icon: Bus,
            color: "text-orange-500",
            iconBg: "bg-orange-100",
        },
    ];

    const examFees = [
        { class: "SA1", amount: `₹ ${fmt(dashboard?.sa1Revenue)}` },
        { class: "SA2", amount: `₹ ${fmt(dashboard?.sa2Revenue)}` },
        { class: "SA3", amount: `₹ ${fmt(dashboard?.sa3Revenue)}` },
        { class: "SA4", amount: `₹ ${fmt(dashboard?.sa4Revenue)}` },
    ];

    // ── Revenue breakdown pie data ─────────────────────────────────────────────
    const revenueBreakdownData = revenueBreakdown
        ? [
              { name: "School Fees", value: revenueBreakdown.schoolFeesPercentage ?? revenueBreakdown.schoolFees ?? 0 },
              { name: "Admission Fees", value: revenueBreakdown.admissionFeesPercentage ?? revenueBreakdown.admissionFees ?? 0 },
              { name: "Registration Fees", value: revenueBreakdown.registrationFeesPercentage ?? revenueBreakdown.registrationFees ?? 0 },
              { name: "Special Fees", value: revenueBreakdown.specialFeesPercentage ?? revenueBreakdown.specialFees ?? 0 },
              { name: "Books Fees", value: revenueBreakdown.booksFeesPercentage ?? revenueBreakdown.booksFees ?? 0 },
              { name: "Lab Fees", value: revenueBreakdown.labFeesPercentage ?? revenueBreakdown.labFees ?? 0 },
              { name: "Transportation Fees", value: revenueBreakdown.transportFeesPercentage ?? revenueBreakdown.transportFees ?? 0 },
          ].filter((d) => d.value > 0)
        : [];

    const revenueTotalLabel = revenueBreakdown
        ? fmt(revenueBreakdown.totalRevenue)
        : "—";

    // ── Expense breakdown pie data ─────────────────────────────────────────────
    const expenseBreakdownData = expenseBreakdown?.items
        ? expenseBreakdown.items.map((item) => ({
              name: item.category,
              value: item.percentage ?? item.amount ?? 0,
          })).filter((d) => d.value > 0)
        : [];

    const expenseTotalLabel = expenseBreakdown
        ? fmt(expenseBreakdown.totalExpense)
        : "—";

    // ── Trend chart data ───────────────────────────────────────────────────────
    const trendChartData = trend.map((item) => ({
        month: item.month,
        revenue: item.revenue,
        expenses: item.expense,
        profit: item.profitLoss,
    }));

    // ── Transactions pagination ────────────────────────────────────────────────
    const allTransactions = dashboard?.recentTransactions || [];
    const totalPages = Math.max(1, Math.ceil(allTransactions.length / rowsPerPage));
    const transactions = allTransactions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
    );

    return (
        <div className="min-h-screen bg-white p-3 lg:p-6 fees-theme-scope">
            <div className="max-w-[1450px] mx-auto">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h1 className="text-[22px] font-semibold text-[#222]">
                            Financial Overview
                        </h1>
                        <p className="text-[11px] text-[#777] mt-1">
                            Home / Financial Overview
                        </p>
                    </div>
                </div>

                <TopCards dashboard={dashboard} loading={loadingDashboard} />

                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 mb-4 lg:mb-6 items-stretch">
                        <div className="bg-white border border-[#E7EBF3] rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[360px]">
                            <div className="h-[30px] sm:h-[38px] flex items-center px-4 border-b border-[#E7EBF3] bg-white">
                                <h3 className="text-md font-semibold text-[#2D3748]">
                                    School Fee
                                </h3>
                            </div>

                            <div className="p-5 sm:p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr">
                                    {schoolFees.map((item, index) => (
                                        <div
                                            key={index}
                                            className={index === 4 ? "sm:col-span-2" : ""}
                                        >
                                            <FeeItem item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">

                            {/* Header */}
                            <div className="relative h-[118px] bg-gradient-to-r from-[#4B36F3] to-[#5B45F9] overflow-hidden">

                                <h2 className="text-white text-[22px] font-bold pl-8 pt-5">
                                    Other Fees
                                </h2>

                                {/* Rings */}
                                <div className="absolute -top-8 -right-6 w-40 h-40 rounded-full border-[12px] border-white/15"></div>

                                <div className="absolute top-2 right-3 w-28 h-28 rounded-full border-[10px] border-white/15"></div>

                                <div className="absolute top-10 right-11 w-16 h-16 rounded-full border-[8px] border-white/15"></div>

                            </div>

                            {/* Cards */}
                            <div className="px-5 pb-6">

                                <div
                                    className="
        -mt-9
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-5
        relative
        z-10
      "
                                >
                                    {otherFees.map((item, index) => (
                                        <OtherFeeCard key={index} item={item} />
                                    ))}
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[4fr_1.35fr] gap-6 mb-6 items-start">
                        <div className="bg-white border border-[#E7EBF3] rounded-md shadow-sm overflow-hidden h-full">
                            <div className="flex items-center justify-between px-4 h-[46px] border-b border-[#E7EBF3]">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Revenue vs. Expense Trend
                                </h3>

                                <button className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">
                                    <Calendar size={14} />
                                    Last 30 Days
                                </button>
                            </div>

                            <div className="h-[260px] lg:h-[300px] xl:h-[250px] px-4 pt-4 pb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={loadingTrend ? [] : trendChartData}
                                        barGap={5}
                                        barCategoryGap="25%"
                                    >
                                        <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1F2937",
                                                border: "none",
                                                borderRadius: 6,
                                                color: "#fff",
                                            }}
                                        />
                                        <Bar barSize={15} dataKey="revenue" fill="#5B6EF5" radius={[4, 4, 0, 0]} />
                                        <Bar barSize={15} dataKey="expenses" fill="#F6A13A" radius={[4, 4, 0, 0]} />
                                        <Bar barSize={15} dataKey="profit" fill="#62C86A" radius={[4, 4, 0, 0]} />
                                        <Legend verticalAlign="bottom" height={10} iconType="square" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E7EBF3] rounded-xl shadow-sm overflow-hidden">
                            <div className="h-[46px] px-4 flex items-center border-b border-[#E7EBF3]">
                                <h3 className="font-semibold text-sm text-gray-700">Exam Fees</h3>
                            </div>

                            <div className="divide-y">
                                {examFees.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-4 py-4 border-b border-[#E7EBF3] last:border-b-0"
                                    >
                                        <div>
                                            <p className="text-[11px] text-gray-500">{item.class}</p>
                                            <h4 className="font-semibold mt-1">{item.amount}</h4>
                                        </div>

                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <ClipboardList className="text-indigo-600" size={18} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Breakdown */}
                <div className="bg-white border border-[#E7EBF3] rounded-md shadow-sm overflow-hidden min-h-[280px]">
                    <div className="flex items-center justify-between px-3 h-[36px] border-b border-[#E7EBF3]">
                        <h3 className="text-[12px] font-semibold text-[#3B3B3B]">
                            Revenue Breakdown
                        </h3>

                        <button className="flex items-center gap-1 text-[10px] text-gray-500 border border-[#E7EBF3] rounded px-2 h-6">
                            <CalendarDays size={12} />
                            Last 30 Days
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-5 px-4 py-4">
                        <div className="relative w-full max-w-[170px] lg:max-w-[190px] aspect-square mx-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={loadingRevenueBreakdown || !revenueBreakdownData.length
                                            ? [{ name: "Loading", value: 1 }]
                                            : revenueBreakdownData}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={48}
                                        outerRadius={72}
                                        paddingAngle={0}
                                        stroke="none"
                                    >
                                        {(loadingRevenueBreakdown || !revenueBreakdownData.length
                                            ? [{ name: "Loading" }]
                                            : revenueBreakdownData
                                        ).map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={REVENUE_COLORS[index % REVENUE_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[11px] lg:text-[12px] text-gray-500">Total</span>
                                <h2 className="text-[26px] lg:text-[30px] font-bold">
                                    {loadingRevenueBreakdown ? "…" : revenueTotalLabel}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            {revenueBreakdownData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: REVENUE_COLORS[index % REVENUE_COLORS.length] }}
                                        ></span>
                                        <p className="text-[12px] text-[#4B5563]">{item.name}</p>
                                    </div>
                                    <span className="text-[12px] font-semibold text-[#303030]">
                                        {item.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden min-h-[235px]">
                    <div className="flex items-center justify-between px-3 h-[36px] border-b border-[#E7EBF3]">
                        <h3 className="text-[12px] font-semibold text-[#3B3B3B]">
                            Expenses Breakdown
                        </h3>

                        <button className="flex items-center gap-1 text-[10px] text-gray-500 border border-[#E7EBF3] rounded px-2 h-6">
                            <CalendarDays size={12} />
                            Last 30 Days
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] items-center gap-5 px-4 py-4">
                        <div className="relative w-full max-w-[190px] aspect-square mx-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={loadingExpenseBreakdown || !expenseBreakdownData.length
                                            ? [{ name: "Loading", value: 1 }]
                                            : expenseBreakdownData}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={48}
                                        outerRadius={72}
                                        paddingAngle={0}
                                        stroke="none"
                                    >
                                        {(loadingExpenseBreakdown || !expenseBreakdownData.length
                                            ? [{ name: "Loading" }]
                                            : expenseBreakdownData
                                        ).map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[11px] lg:text-[12px] text-gray-500">Total</span>
                                <h2 className="text-[26px] lg:text-[30px] font-bold">
                                    {loadingExpenseBreakdown ? "…" : expenseTotalLabel}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            {expenseBreakdownData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }}
                                        ></span>
                                        <p className="text-[12px] text-[#4B5563]">{item.name}</p>
                                    </div>
                                    <span className="text-[12px] font-semibold text-[#303030]">
                                        {item.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 h-[50px] border-b border-gray-200">
                    <h3 className="font-semibold text-[15px] text-gray-800">
                        Recent Transactions
                    </h3>

                    <button className="text-[#4F46E5] text-sm font-medium hover:underline">
                        View All History
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] lg:min-w-full xl:min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">S.No.</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Roll No.</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Student Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Transaction ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Class</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Fees Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingDashboard ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-4 text-center text-gray-500 text-sm">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-4 text-center text-gray-500 text-sm">
                                        No recent transactions
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition text-sm"
                                    >
                                        <td className="px-4 py-4 text-gray-700">
                                            {(currentPage - 1) * rowsPerPage + index + 1}
                                        </td>
                                        <td className="px-4 py-4 text-gray-700">{item.admissionNo || "—"}</td>
                                        <td className="px-4 py-4 font-medium text-gray-800">{item.studentName || "—"}</td>
                                        <td className="px-4 py-4 text-gray-700">{item.admissionNo || "—"}</td>
                                        <td className="px-4 py-4 text-gray-700">{item.className || "—"}</td>
                                        <td className="px-4 py-4 text-gray-700">{item.feeType || "—"}</td>
                                        <td className="px-4 py-4 text-gray-700">{item.date || "—"}</td>
                                        <td className="px-4 py-4 text-right font-semibold text-gray-800">
                                            ₹ {fmt(item.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end px-5 py-3 border-t border-gray-200 gap-2 text-sm">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                        >
                            Prev
                        </button>
                        <span className="text-gray-600">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
