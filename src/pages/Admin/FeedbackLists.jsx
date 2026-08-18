import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Mail, User, ChevronDown, X, Eye, Edit, Trash2 } from "lucide-react";
import PublishModal from "../../components/common/PublishModal";
import useToastMessage from "../../utils/useToastMessage";
import {
  fetchAllFeedbacks,
  updateFeedbackStatusAsync,
  fetchFeedbackById,
  clearSuccess,
  clearError,
} from "../../features/Admin/Feedback/feedbackSlice";

const FeedbackLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    feedbackList,
    loading,
    pagination,
    currentFeedback,
    success,
    error,
  } = useSelector((state) => state.feedback);

  const [viewingDetails, setViewingDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishOptions, setPublishOptions] = useState({ publishToStudent: true });
  const [publishNotes, setPublishNotes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
    };
    dispatch(fetchAllFeedbacks(params));
  }, [dispatch, currentPage, rowsPerPage]);

  useToastMessage({
    success,
    error,
    successMessage: "Feedback status updated successfully",
    clearSuccess,
    clearError,
    onSuccess: () => {
      dispatch(
        fetchAllFeedbacks({
          page: currentPage - 1,
          size: rowsPerPage,
        })
      );
    },
  });

  const feedbackListData =
    Array.isArray(feedbackList) ? feedbackList : [];

  const filteredFeedback = feedbackListData.filter((feedback) => {
    const createdName = feedback.createdName || "";
    const classCode = feedback.classCode || "";
    const status = feedback.status || "";

    const matchesSearch =
      searchTerm === "" ||
      createdName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });


  const handlePublish = () => {
    dispatch(
      updateFeedbackStatusAsync({
        feedbackId: selectedFeedbackId,
        data: { status: "PUBLISHED" },
      }),
    );
    setPublishOpen(false);
    setSelectedFeedbackId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Feedback Lists</h1>
          <p className="text-sm text-gray-600">Home / Feedback / Feedback Lists</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Feedback Lists</h2>
          <div className="flex gap-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Created Name, class"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              />
            </div>
            <div className="w-48">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              />
            </div>
            <div className="w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">S.No.</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Created Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Created Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Class</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Publish Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Published By</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredFeedback.length > 0 ? (
                  filteredFeedback.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFeedbackId(feedback.feedbackId);
                            } else {
                              setSelectedFeedbackId(null);
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-800">{feedback.feedbackId}</td>
                      <td className="px-4 py-3 text-gray-800">{feedback.createdDate}</td>
                      <td className="px-4 py-3 text-gray-800">{feedback.createdName}</td>
                      <td className="px-4 py-3 text-gray-800">{feedback.classCode}</td>
                      <td className="px-4 py-3 text-gray-800">{feedback.publishedDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {feedback.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{feedback.publishedBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              const result = await dispatch(
                                fetchFeedbackById(feedback.feedbackId)
                              );

                              setViewingDetails(
                                result.payload?.data || result.payload
                              );
                            }}>
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/Add-Feedback/${feedback.feedbackId}`)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-700 p-1" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No feedback found
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

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!selectedFeedbackId}
              onClick={() => setPublishOpen(true)}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {publishOpen && (
        <PublishModal
          title="Publish Feedback"
          options={publishOptions}
          optionDefinitions={[{ key: "publishToStudent", label: "Publish to student portal" }]}
          notes={publishNotes}
          onChange={(key, value) =>
            setPublishOptions((currentOptions) => ({ ...currentOptions, [key]: value }))
          }
          onNotesChange={setPublishNotes}
          onClose={() => setPublishOpen(false)}
          onSubmit={handlePublish}
          loading={loading}
        />
      )}

      {/* View Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                View Details
              </h2>

              <button
                onClick={() => setViewingDetails(null)}
                className="hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">

              {viewingDetails?.questions?.length > 0 ? (
                viewingDetails.questions.map((question, index) => (
                  <div key={question.questionId} className="mb-8">

                    {/* Question */}
                    <h3 className="text-xl font-medium text-gray-800 mb-4">
                      {index + 1}. {question.questionText}
                    </h3>

                    {/* Options */}
                    <div className="grid grid-cols-4 gap-6 ml-4">

                      {question.options?.[0] && (
                        <div className="text-gray-700">
                          A. {question.options[0].label}
                        </div>
                      )}

                      {question.options?.[1] && (
                        <div className="text-gray-700">
                          B. {question.options[1].label}
                        </div>
                      )}

                      {question.options?.[2] && (
                        <div className="text-gray-700">
                          C. {question.options[2].label}
                        </div>
                      )}

                      {question.options?.[3] && (
                        <div className="text-gray-700">
                          D. {question.options[3].label}
                        </div>
                      )}

                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No Questions Found
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewingDetails(null)}
                className="px-8 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div >
  );
};

export default FeedbackLists;
