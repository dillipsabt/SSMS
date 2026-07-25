import React from "react";
import { ArrowLeft, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AnswerSheetsResult = ({ data, onBack }) => {
  const displayData = data || {};

  // Extract data from API response
  const studentName = displayData?.studentName || "N/A";
  const rollNumber = displayData?.rollNumber || "N/A";
  const className = displayData?.className || "N/A";
  const overallPercentage = displayData?.overallPercentage || 0;
  const overallGrade = displayData?.overallGrade || "N/A";

  const dashboardData = displayData?.dashboardData || {};
  const averageConfidence = Math.round((displayData?.confidence || dashboardData?.averageConfidence || 0) * 100);
  const averagePredictedScore = dashboardData?.averagePredictedScore || 0;
  const totalStudentsAnalysed = dashboardData?.totalStudentsAnalysed || 1;
  const riskDistribution = dashboardData?.riskDistribution || {};
  const riskLevel = displayData?.overallRiskLevel || Object.keys(riskDistribution)[0] || "MODERATE";
  const performanceSummary = displayData?.performanceSummary || "";
  const recommendations = displayData?.recommendations || "";

  const examAnalysis = displayData?.examAnalysis || {};
  const handwritingScore = examAnalysis?.handwritingScore || 0;
  const handwritingQuality = examAnalysis?.handwritingQuality || "N/A";
  const handwritingNotes = examAnalysis?.handwritingNotes || "";
  const conceptualStrengths = examAnalysis?.conceptualStrengths || [];
  const conceptualGaps = examAnalysis?.conceptualGaps || [];
  const detailedAnalysis = examAnalysis?.detailedAnalysis || "";

  const attendanceChart = displayData?.attendanceChart || {};
  const subjectPerformanceChart = displayData?.subjectPerformanceChart || {};

  // Prepare attendance chart data
  const attendanceData = attendanceChart?.datasets?.[0]?.data || [];
  const attendanceLabels = attendanceChart?.labels || [];
  const attendanceColors = attendanceChart?.datasets?.[0]?.backgroundColor || ["#22c55e", "#ef4444"];
  
  const formattedAttendanceData = attendanceLabels.map((label, idx) => ({
    name: label,
    value: attendanceData[idx] || 0,
    color: attendanceColors[idx],
  }));

  // Prepare subject performance chart data
  const subjectLabels = subjectPerformanceChart?.labels || [];
  const subjectData = subjectPerformanceChart?.datasets?.[0]?.data || [];
  const subjectColors = subjectPerformanceChart?.datasets?.[0]?.backgroundColor || ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];
  
  const formattedSubjectData = subjectLabels.map((label, idx) => ({
    name: label,
    Scores: subjectData[idx] || 0,
  }));

  // Get initials for avatar
  const initials = studentName
    .split(" ")
    .map(n => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Format confidence level text
  const getConfidenceLevel = (confidence) => {
    if (confidence >= 85) return "High Precision";
    if (confidence >= 70) return "Good Precision";
    return "Low Precision";
  };

  // Format improvement level
  const getImprovementLevel = (gaps) => {
    if (!gaps || gaps.length === 0) return "Excellent";
    if (gaps.length === 1) return "High";
    return "Moderate";
  };

  // Risk level badge styling
  const getRiskColor = (riskKey) => {
    const colorMap = {
      LOW: "#10b981",
      MODERATE: "#f59e0b",
      HIGH: "#ef4444",
      CRITICAL: "#dc2626",
    };
    return colorMap[riskKey] || "#6b7280";
  };

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6">
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
            <div className="w-10 sm:w-14 h-10 sm:h-14 bg-blue-400 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">{studentName}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-1 mt-1 sm:mt-2">
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500 rounded-full text-[10px] sm:text-xs font-medium w-fit">
                  <span>📋</span> Class: {className}
                </span>
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500 rounded-full text-[10px] sm:text-xs font-medium w-fit">
                  <span>🎓</span> Roll No: {rollNumber}
                </span>
              </div>
            </div>
          </div>
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-blue-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-50 transition flex-shrink-0">
            + New Analysis
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {/* Total Marks */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Total Marks</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{overallPercentage}/100</p>
          <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2 mt-2 sm:mt-3">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Percentage */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Percentage</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{overallPercentage}%</p>
        </div>

        {/* Predicted Grade */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Predicted Grade</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{overallGrade}</p>
        </div>

        {/* Confidence */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Confidence</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{averageConfidence}%</p>
          <span className="inline-block text-[10px] sm:text-xs text-pink-600 font-medium mt-1 sm:mt-2">
            {getConfidenceLevel(averageConfidence)}
          </span>
        </div>

        {/* Risk Level */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Risk Level</p>
          <p className="inline-block text-sm sm:text-base font-bold" style={{ color: getRiskColor(riskLevel) }}>{riskLevel}</p>
        </div>

        {/* Improvement */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Improvement</p>
          <span className={`inline-block text-sm sm:text-base font-bold ${getImprovementLevel(conceptualGaps) === "Excellent" ? "text-green-600" : getImprovementLevel(conceptualGaps) === "High" ? "text-green-600" : "text-orange-600"}`}>
            {getImprovementLevel(conceptualGaps)}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Question Analysis & Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Conceptual Analysis Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">AI Assessment</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {/* Conceptual Strengths */}
              {conceptualStrengths.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Conceptual Strengths</h4>
                  <ul className="space-y-2">
                    {conceptualStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-green-600 text-lg flex-shrink-0">✓</span>
                        <span className="text-xs sm:text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conceptual Gaps */}
              {conceptualGaps.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Conceptual Gaps</h4>
                  <ul className="space-y-2">
                    {conceptualGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-red-600 text-lg flex-shrink-0">✗</span>
                        <span className="text-xs sm:text-sm text-gray-700">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Handwriting Assessment */}
              {handwritingScore > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Handwriting Assessment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-700">Handwriting Score</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{handwritingScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-700">Quality</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{handwritingQuality}</span>
                    </div>
                    {handwritingNotes && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-2 p-2 sm:p-3 bg-gray-50 rounded-lg">{handwritingNotes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Analysis Section */}
          {detailedAnalysis && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">Detailed Analysis</h3>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{detailedAnalysis}</p>
              </div>
            </div>
          )}

          {/* Performance Summary */}
          {performanceSummary && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">Performance Summary</h3>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{performanceSummary}</p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">Recommendations</h3>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{recommendations}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Charts */}
        <div className="space-y-4 sm:space-y-6">
          {/* Accuracy Distribution Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Accuracy Distribution</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col items-center">
                {/* Doughnut Chart - Uses real data from API */}
                <div className="relative w-28 sm:w-40 h-28 sm:h-40 mb-3 sm:mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Score", value: Math.round(overallPercentage) },
                          { name: "Remaining", value: Math.round(100 - overallPercentage) },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill={overallPercentage >= 70 ? "#22c55e" : overallPercentage >= 50 ? "#f59e0b" : "#ef4444"} />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{Math.round(overallPercentage)}%</p>
                      <p className="text-[10px] sm:text-xs text-gray-600">Overall</p>
                    </div>
                  </div>
                </div>

                {/* Risk Distribution Legend */}
                <div className="w-full space-y-1.5 sm:space-y-2">
                  {Object.entries(riskDistribution).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: getRiskColor(key) }}></div>
                        <span className="text-[10px] sm:text-xs text-gray-700">{key} Risk</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-2">
                <Info size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                  The AI evaluation is based on semantic understanding of the student's text responses compared to standardized rubrics.
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Chart */}
          {/* {formattedAttendanceData.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Attendance</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formattedAttendanceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {formattedAttendanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(
                            (attendanceData[0] / (attendanceData[0] + attendanceData[1])) * 100
                          )}%
                        </p>
                        <p className="text-xs text-gray-600">Present</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    {formattedAttendanceData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Subject Performance Chart */}
          {/* {formattedSubjectData.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Subject-wise Performance</h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formattedSubjectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#fff", 
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="Scores" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AnswerSheetsResult;
