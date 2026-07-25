import React, { useState, useMemo } from "react";
import { ArrowLeft, BarChart3, TrendingUp, Lightbulb } from "lucide-react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const AnalysisDashboard = ({ data, onBack, uploadedFile }) => {
  const [activeTab, setActiveTab] = useState("Performance");
  const analysisData = useSelector((state) => state.predictiveAnalysis.analysisData);
  const displayData = analysisData || data;

  const subjectColors = {
    "Telugu": "#4F46E5",
    "Hindi": "#8B5CF6",
    "English": "#8B5CF6",
    "Maths": "#8B5CF6",
    "Science": "#EC4899",
    "Social": "#F472B6",
  };

  const getSubjectColor = (subjectName) => {
    return subjectColors[subjectName] || "#A78BFA";
  };

  const subjectChartData = useMemo(() => {
    if (displayData?.subjectPerformanceChart?.datasets?.[0]) {
      const chart = displayData.subjectPerformanceChart;
      return (chart.labels || []).map((label, index) => ({
        name: label,
        score: chart.datasets[0].data[index] || 0,
        color: getSubjectColor(label),
      }));
    }
    return [];
  }, [displayData]);

  const attendanceChartData = useMemo(() => {
    if (displayData?.attendanceChart?.datasets?.[0]) {
      const chart = displayData.attendanceChart;
      return (chart.labels || []).map((label, index) => ({
        name: label,
        value: chart.datasets[0].data[index] || 0,
      }));
    }
    return [];
  }, [displayData]);

  const riskDistributionData = useMemo(() => {
    if (!displayData?.dashboardData?.riskDistribution) return [];
    const colors = {
      LOW: "#10B981",
      MODERATE: "#F59E0B",
      HIGH: "#EF4444",
      CRITICAL: "#991B1B",
    };
    return Object.entries(displayData.dashboardData.riskDistribution || {}).map(
      ([key, value]) => ({
        name: key,
        value: value,
        color: colors[key] || "#6B7280",
      })
    );
  }, [displayData]);

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      LOW: "bg-green-100 text-green-700",
      MODERATE: "bg-yellow-100 text-yellow-700",
      HIGH: "bg-orange-100 text-orange-700",
      CRITICAL: "bg-red-100 text-red-700",
    };
    return colors[riskLevel] || "bg-gray-100 text-gray-700";
  };

  const topAtRiskStudents = displayData?.dashboardData?.topAtRiskStudents || [];

  return (
    <div className="w-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 sm:mb-6 transition text-sm sm:text-base"
      >
        <ArrowLeft size={18} />
        Back to Upload
      </button>

      {/* Student Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 sm:w-14 h-10 sm:h-14 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
              {(displayData?.studentName || "").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold mb-1 truncate">{displayData?.studentName || "N/A"}</h2>
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-xs sm:text-sm">
                <span className="text-blue-100">Class: {displayData?.className || "N/A"}</span>
                <span className="text-blue-100">Roll No: {displayData?.rollNumber || "N/A"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-blue-600 rounded font-medium text-xs sm:text-sm hover:bg-gray-50 transition flex-shrink-0"
          >
            + New Analysis
          </button>
        </div>
      </div>

      {/* Stats Cards - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-4 sm:mb-6">
        {/* Academic Score */}
        <div className="bg-white rounded-lg p-3 sm:p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Academic Score</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{displayData?.overallPercentage || 0}%</p>
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white rounded-lg p-3 sm:p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 5h6m0 0h6m-6 0H3" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Risk Level</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{displayData?.overallRiskLevel || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="bg-white rounded-lg p-3 sm:p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Overall Performance</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{displayData?.overallGrade || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex gap-2 sm:gap-8 px-4 sm:px-6 pt-0 border-b border-gray-200 overflow-x-auto">
          {[
            { label: "Performance", icon: BarChart3 },
            { label: "Improvement Areas", icon: TrendingUp },
            { label: "AI Insights", icon: Lightbulb },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`py-3 sm:py-4 font-medium text-[11px] sm:text-xs transition-colors uppercase tracking-wide flex items-center gap-1 sm:gap-2 whitespace-nowrap ${activeTab === label
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <Icon size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden text-[10px]">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="p-3 sm:p-5">
          {/* PERFORMANCE TAB */}
          {activeTab === "Performance" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                {/* Subject Wise Performance Chart */}
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 sm:mb-5">Subject Wise Performance</h3>
                  {subjectChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={150} className="sm:h-[240px]">
                      <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#6B7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 11, fill: "#6B7280" }}
                          axisLine={false}
                          tickLine={false}
                          width={35}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "6px",
                            color: "#FFF",
                            fontSize: "12px",
                          }}
                          formatter={(value) => [`${value}%`, "Score"]}
                        />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {subjectChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[150px] sm:h-[240px] flex items-center justify-center text-gray-500 text-sm">
                      No data available
                    </div>
                  )}
                </div>

                {/* Overall Performance Pie Chart */}
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 sm:mb-5">Overall Performance</h3>
                  {displayData?.overallPercentage ? (
                    <div className="flex flex-col items-center h-[200px] sm:h-[240px] justify-center">
                      <div className="relative w-32 sm:w-44 h-32 sm:h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Score", value: displayData?.overallPercentage || 0, color: "#10B981" },
                                { name: "Remaining", value: 100 - (displayData?.overallPercentage || 0), color: "#F59E0B" },
                                { name: "Poor", value: 10, color: "#EF4444" },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={50}
                              dataKey="value"
                              startAngle={90}
                              endAngle={-270}
                            >
                              <Cell fill="#10B981" />
                              <Cell fill="#F59E0B" />
                              <Cell fill="#EF4444" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-lg sm:text-2xl font-bold text-gray-800">{displayData?.overallPercentage || 0}%</p>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Good</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-4 mt-3 sm:mt-5 justify-center flex-wrap">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full"></div>
                          <span className="text-[10px] sm:text-xs text-gray-700">Good</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-amber-400 rounded-full"></div>
                          <span className="text-[10px] sm:text-xs text-gray-700">Average</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full"></div>
                          <span className="text-[10px] sm:text-xs text-gray-700">Poor</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[150px] sm:h-[240px] flex items-center justify-center text-gray-500 text-sm">
                      No data available
                    </div>
                  )}
                </div>
              </div>

              {/* Student Details Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Student Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] sm:text-xs min-w-full">
                    <thead className="bg-indigo-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 text-left font-semibold text-indigo-600 uppercase tracking-wide text-[10px] sm:text-xs">SUBJECT</th>
                        <th className="px-3 sm:px-6 py-2 text-left font-semibold text-indigo-600 uppercase tracking-wide text-[10px] sm:text-xs">SCORE</th>
                        <th className="px-3 sm:px-6 py-2 text-left font-semibold text-indigo-600 uppercase tracking-wide text-[10px] sm:text-xs">GRADE</th>
                        <th className="px-3 sm:px-6 py-2 text-left font-semibold text-indigo-600 uppercase tracking-wide text-[10px] sm:text-xs">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectChartData.map((subject, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-3 sm:px-6 py-2 text-gray-800">{subject.name}</td>
                          <td className="px-3 sm:px-6 py-2 font-medium text-gray-800">{subject.score}/100</td>
                          <td className="px-3 sm:px-6 py-2 font-medium text-gray-800">
                            {subject.score >= 80 ? "A" : subject.score >= 60 ? "B" : "C"}
                          </td>
                          <td className="px-3 sm:px-6 py-2">
                            <span
                              className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium inline-block ${subject.score >= 80
                                  ? "bg-green-100 text-green-700"
                                  : subject.score >= 60
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                            >
                              {subject.score >= 80 ? "Excellent" : subject.score >= 60 ? "Good" : "Bad"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* IMPROVEMENT AREAS TAB */}
          {activeTab === "Improvement Areas" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Improvements Circular Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800 mb-6">Improvements</h3>
                  <div className="flex flex-col items-center h-80 justify-center">
                    <div className="relative w-44 h-44">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="100" r="85" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                        <circle
                          cx="100"
                          cy="100"
                          r="85"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="12"
                          strokeDasharray={`${(78 / 100) * 2 * Math.PI * 85} ${2 * Math.PI * 85}`}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-red-600">78</p>
                          <p className="text-xs font-semibold text-gray-700 mt-1">CRITICAL</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6 flex-wrap justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Low Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <span className="text-xs text-gray-600">Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                        <span className="text-xs text-gray-600">Critical Risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject Risk Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800 mb-6">Subject Risk Breakdown</h3>
                  <div className="space-y-4">
                    {subjectChartData.slice(0, 6).map((subject, index) => {
                      const riskPercentage = Math.min(subject.score * 1.2, 100);
                      const riskColor = riskPercentage > 80 ? "bg-red-600" : riskPercentage > 50 ? "bg-amber-500" : "bg-green-500";
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-16 flex-shrink-0">
                            <p className="text-xs font-medium text-gray-700">{subject.name}</p>
                          </div>
                          <div className="flex-grow bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${riskColor}`}
                              style={{ width: `${riskPercentage}%` }}
                            ></div>
                          </div>
                          <div className="w-14 text-right flex-shrink-0">
                            <p className="text-xs font-semibold text-gray-800">{Math.round(riskPercentage)}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI INSIGHTS TAB */}
          {activeTab === "AI Insights" && (
            <div className="space-y-6">
              {/* 3-Month Plan Tabs */}
              <div className="mb-6">
                <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto pb-4">
                  {["3Months Plan for Student", "3Months Plan for Parents", "3Months Plan for Teachers", "3Months Plan for Management"].map((tab) => (
                    <button
                      key={tab}
                      className="pb-0 font-medium text-xs transition-colors whitespace-nowrap text-blue-600 border-b-2 border-blue-600"
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Month Plans */}
                <div className="grid grid-cols-3 gap-5">
                  {/* 1st Month */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-800 mb-4 text-pink-600">1st Month</h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Review previous exam performance and identify weak subjects.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Focus on completing pending assignments and homework.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Practice core concepts for 30–45 minutes daily.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Improve attendance and classroom participation.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Take weekly quizzes to assess understanding.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Meet with teachers to discuss improvement goals.</span>
                      </li>
                    </ul>
                  </div>

                  {/* 2nd Month */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-800 mb-4 text-indigo-600">2nd Month</h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Strengthen subject specific weak areas through targeted practice.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Complete all assignments before deadlines.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Increase mock test participation.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Develop better time management and study habits.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Revise key topics using summaries and flashcards.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Track weekly progress against academic goals.</span>
                      </li>
                    </ul>
                  </div>

                  {/* 3rd Month */}
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-800 mb-4 text-emerald-600">3rd Month</h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Improved subject understanding and confidence.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Higher assignment completion rate.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Better attendance and classroom engagement.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Increased test scores and overall percentage.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>Reduced academic risk and stronger exam readiness.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Recommendations Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">AI Recommendations</h4>
                {displayData?.dashboardData?.topAtRiskStudents?.[0] ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="text-xs font-semibold text-gray-800 mb-2">Summary</h5>
                      <p className="text-xs text-gray-700">
                        {displayData?.dashboardData?.topAtRiskStudents?.[0]?.summary || "No summary available"}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="text-xs font-semibold text-gray-800 mb-2">Recommendations</h5>
                      <p className="text-xs text-gray-700">
                        {displayData?.dashboardData?.topAtRiskStudents?.[0]?.recommendations || "No recommendations available"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">No recommendations available</p>
                )}
              </div>

              {/* Top At-Risk Students Table */}
              {topAtRiskStudents.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="px-6 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">Top At-Risk Students</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-indigo-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">NAME</th>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">CODE</th>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">CLASS</th>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">ROLL NO</th>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">RISK LEVEL</th>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">SCORE</th>
                          <th className="px-6 py-2.5 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wide">CONFIDENCE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topAtRiskStudents.slice(0, 5).map((student, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-6 py-3 text-xs text-gray-800">{student.studentName}</td>
                            <td className="px-6 py-3 text-xs text-gray-800">{student.studentCode}</td>
                            <td className="px-6 py-3 text-xs text-gray-800">{student.className}</td>
                            <td className="px-6 py-3 text-xs text-gray-800">{student.rollNo}</td>
                            <td className="px-6 py-3 text-xs">
                              <span className={`px-2.5 py-1 rounded text-xs font-medium ${getRiskLevelColor(student.riskLevel)}`}>
                                {student.riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-xs font-semibold text-gray-800">{student.predictedScore}%</td>
                            <td className="px-6 py-3 text-xs text-gray-800">{student.confidence}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
