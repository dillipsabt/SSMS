import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Bell, Mail, User, ChevronDown, X } from "lucide-react";
import {
  fetchAllFeedbackSubmissions,
  fetchFeedbackSubmissionById,
  fetchClasses,
} from "../../features/Admin/Feedback/feedbackSlice";

const StudentFeedbackSubmission = () => {
  const dispatch = useDispatch();
  const {
    feedbackList,
    classes,
    loading,
    pagination,
    submissionDetails,
  } = useSelector((state) => state.feedback);

  const [selectedClass, setSelectedClass] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [viewingDetails, setViewingDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchClasses());
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
    };
    dispatch(fetchAllFeedbackSubmissions(params));
  }, [dispatch, currentPage, rowsPerPage]);

  const feedbackData = Array.isArray(feedbackList)
    ? feedbackList
    : [];

  useEffect(() => {
    if (submissionDetails) {
      setViewingDetails(submissionDetails);
    }
  }, [submissionDetails]);

  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesClass = selectedClass === "" || feedback.class === selectedClass;
    return matchesClass;
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Student Feedback Submission</h1>
          <p className="text-sm text-gray-600">Home / Feedback / Student Feedback Submission</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Feedback Submission List</h2>
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.classCode}>
                    {cls.classCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
              🔍 Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">S.No.</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Student ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Student Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Submission Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Parent Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredFeedback.length > 0 ? (
                  filteredFeedback.map((feedback, index) => (
                    <tr key={feedback.submissionId}>
                      <td className="px-4 py-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>

                      <td className="px-4 py-3">
                        {feedback.submissionId}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            dispatch(
                              fetchFeedbackSubmissionById(
                                feedback.submissionId
                              )
                            )
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {feedback.studentName}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        {new Date(
                          feedback.submittedAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        {feedback.parentName}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            dispatch(
                              fetchFeedbackSubmissionById(
                                feedback.submissionId
                              )
                            )
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No feedback submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">Page: {currentPage} of {pagination.totalPages || 1}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages || 1, currentPage + 1))}
                disabled={currentPage === (pagination.totalPages || 1)}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">View Details</h2>
              <button onClick={() => setViewingDetails(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium">{viewingDetails.studentName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Parent Name</p>
                  <p className="font-medium">{viewingDetails.parentName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Submission ID</p>
                  <p className="font-medium">{viewingDetails.submissionId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Submitted At</p>
                  <p className="font-medium">
                    {new Date(viewingDetails.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Feedback Answers
                </h3>

                {viewingDetails.answers?.length > 0 ? (
                  viewingDetails.answers.map((answer, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border rounded-lg bg-gray-50"
                    >
                      <p className="font-medium text-gray-800">
                        Q{index + 1}. {answer.question}
                      </p>

                      <p className="mt-2 text-blue-600 font-semibold">
                        Answer: {answer.selectedValue}
                      </p>

                      <p className="text-sm text-gray-500">
                        Option No: {answer.selectedOption}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No answers available
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setViewingDetails(null)}
                className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setViewingDetails(null)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeedbackSubmission;
