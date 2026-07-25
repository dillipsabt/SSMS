import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import useToastMessage from "../../utils/useToastMessage";
import {
  createFeedbackAsync,
  updateFeedbackAsync,
  fetchFeedbackById,
  fetchClasses,
  clearSuccess,
  clearError,
} from "../../features/Admin/Feedback/feedbackSlice";

const AddFeedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const hasCleared = useRef(false);

  const {
    classes,
    loading,
    error,
    success,
    currentFeedback,
  } = useSelector((state) => state.feedback);

  const [selectedClass, setSelectedClass] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
    },
  ]);

  // MUST be first - clear stale messages immediately on mount
  useEffect(() => {
    if (!hasCleared.current) {
      dispatch(clearSuccess());
      dispatch(clearError());
      hasCleared.current = true;
    }
  }, [dispatch]);

  // FETCH CLASSES
  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  // FETCH FEEDBACK BY ID (EDIT MODE)
  useEffect(() => {
    if (id) {
      dispatch(fetchFeedbackById(id));
    }
  }, [dispatch, id]);

  // SET EDIT DATA
  useEffect(() => {
    if (id && currentFeedback) {

      setSelectedClass(
        currentFeedback.classId ||
        currentFeedback.classIds?.[0] ||
        ""
      );

      if (currentFeedback.questions?.length > 0) {

        setQuestions(
          currentFeedback.questions.map((q, index) => ({
            id: q.questionId || index + 1,
            question: q.questionText || "",

            options: [
              q.option1 ||
              q.options?.[0]?.label ||
              "",

              q.option2 ||
              q.options?.[1]?.label ||
              "",

              q.option3 ||
              q.options?.[2]?.label ||
              "",

              q.option4 ||
              q.options?.[3]?.label ||
              "",
            ],
          }))
        );
      }
    }
  }, [id, currentFeedback]);

  useToastMessage({
    success,
    error,
    successMessage: id ? 'Feedback updated successfully! ✅' : 'Feedback created successfully! ✅',
    clearSuccess,
    clearError,
    onSuccess: () => {
      navigate("/Feedback-Lists");
    },
  });

  // QUESTION CHANGE
  const handleQuestionChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, question: value } : q
      )
    );
  };

  // OPTION CHANGE
  const handleOptionChange = (id, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
            ...q,
            options: q.options.map((opt, i) =>
              i === index ? value : opt
            ),
          }
          : q
      )
    );
  };

  // ADD QUESTION
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: "",
        options: ["", "", "", ""],
      },
    ]);
  };

  // DELETE QUESTION
  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // SUBMIT
  const handleSubmit = () => {
    if (!selectedClass) {
      alert("Please select class");
      return;
    }

    const payload = {
      title: currentFeedback?.title || "",

      classIds: [Number(selectedClass)],

      questions: questions.map((q) => ({
        questionText: q.question,
        option1: q.options[0] || "",
        option2: q.options[1] || "",
        option3: q.options[2] || "",
        option4: q.options[3] || "",
      })),
    };

    if (id) {
      dispatch(
        updateFeedbackAsync({
          feedbackId: Number(id),
          data: payload,
        })
      );
    } else {
      dispatch(createFeedbackAsync(payload));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {id ? "Edit Feedback" : "Add Feedback"}
          </h1>

          <p className="text-sm text-gray-600">
            Home / Feedback / {id ? "Edit Feedback" : "Add Feedback"}
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">

          {/* CLASS */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.classCode}
                </option>
              ))}
            </select>
          </div>

          {/* QUESTIONS */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left">Question</th>
                  <th className="px-4 py-3 text-left">Option 1</th>
                  <th className="px-4 py-3 text-left">Option 2</th>
                  <th className="px-4 py-3 text-left">Option 3</th>
                  <th className="px-4 py-3 text-left">Option 4</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-b border-gray-200">

                    {/* QUESTION */}
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          handleQuestionChange(q.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </td>

                    {/* OPTIONS */}
                    {[0, 1, 2, 3].map((optIdx) => (
                      <td key={optIdx} className="px-4 py-4">
                        <input
                          type="text"
                          value={q.options[optIdx]}
                          onChange={(e) =>
                            handleOptionChange(
                              q.id,
                              optIdx,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                    ))}

                    {/* ACTION */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD QUESTION */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus size={18} />
              Add More Questions
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {typeof error === "string"
                ? error
                : JSON.stringify(error)}
            </div>
          )}

          {/* SAVE */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {loading
                ? "Saving..."
                : id
                  ? "Update Feedback"
                  : "Save Feedback"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddFeedback;
