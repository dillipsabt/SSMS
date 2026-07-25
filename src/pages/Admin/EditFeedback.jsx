import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Bell, Mail, User, Plus, Trash2 } from "lucide-react";
import { fetchFeedbackById, updateFeedbackAsync, fetchClasses, clearSuccess } from "../../features/Admin/Feedback/feedbackSlice";

const EditFeedback = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentFeedback, classes, loading, error, success } = useSelector((state) => state.feedback);

  const [adminName, setAdminName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: ["", "", "", ""],
    },
  ]);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClasses());
    if (id) {
      dispatch(fetchFeedbackById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentFeedback) {
      setAdminName(currentFeedback.adminName || "");
      setSelectedClass(currentFeedback.class || "");
      if (currentFeedback.questions && currentFeedback.questions.length > 0) {
        setQuestions(
          currentFeedback.questions.map((q, idx) => ({
            id: idx + 1,
            question: q.question || "",
            options: q.options || ["", "", "", ""],
          }))
        );
      }
    }
  }, [currentFeedback]);

  useEffect(() => {
    if (success) {
      alert("Feedback updated successfully!");
      dispatch(clearSuccess());
      navigate("/admin/feedback-lists");
    }
  }, [success, dispatch, navigate]);

  const handleQuestionChange = (id, newQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: newQuestion } : q))
    );
  };

  const handleOptionChange = (id, optionIndex, newValue) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? newValue : opt
              ),
            }
          : q
      )
    );
  };

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        question: "",
        options: ["", "", "", ""],
      },
    ]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdate = async () => {
    if (!id) {
      alert("Feedback ID not found!");
      return;
    }

    if (!adminName.trim()) {
      alert("Please enter Admin/Principal Name");
      return;
    }

    if (!selectedClass) {
      alert("Please select a Class");
      return;
    }

    const feedbackData = {
      adminName,
      class: selectedClass,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options.filter((opt) => opt.trim() !== ""),
      })),
    };

    dispatch(updateFeedbackAsync({ feedbackId: id, data: feedbackData }));
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Edit Feedback</h1>
          <p className="text-sm text-gray-600">Home / Feedback / Edit Feedback</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Feedback</h2>

          {/* Admin Name and Class */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin / Principal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              >
                <option value="">Select Class</option>
                <option value="All">All</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800 w-1/3">Question</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Option 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Option 2</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Option 3</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Option 4</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={q.id} className="border-b border-gray-200">
                    <td className="px-4 py-4">
                      <select
                        value={q.question}
                        onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 text-sm"
                      >
                        <option>{q.question}</option>
                        <option>How clean is the school campus?</option>
                        <option>Do you feel safe in school?</option>
                        <option>Transportation Fees</option>
                      </select>
                    </td>
                    {[0, 1, 2, 3].map((optIdx) => (
                      <td key={optIdx} className="px-4 py-4">
                        <input
                          type="text"
                          value={q.options[optIdx]}
                          onChange={(e) =>
                            handleOptionChange(q.id, optIdx, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center">
                      {questions.length > 1 ? (
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddQuestion()}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add More Questions Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus size={18} />
              Add More Questions
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Update Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFeedback;
