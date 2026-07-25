import React from "react";
import { useSelector } from "react-redux";

const StudentAnalytics = () => {
  const { analysisData, loading } = useSelector((state) => state.answerSheets);

  const reports = analysisData ? [analysisData] : [];

  return (
    <div className="w-full p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Student Analytics History
        </h1>

        <p className="mt-2 text-gray-600">
          View past scanned reports and track improvement.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">Class</th>
                <th className="px-6 py-4 text-left font-semibold">Roll No.</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Date Scanned
                </th>
                <th className="px-6 py-4 text-left font-semibold">Score</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((report, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-medium text-gray-900">
                      {report.studentName}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {report.className}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {report.rollNumber}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {new Date().toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-md bg-green-100 px-3 py-1 text-green-700 font-medium">
                        {report.overallPercentage}%
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                        Compare
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Remove after debugging */}
        {/* <pre className="mt-4 rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(analysisData, null, 2)}
        </pre> */}
      </div>
    </div>
  );
};

export default StudentAnalytics;
