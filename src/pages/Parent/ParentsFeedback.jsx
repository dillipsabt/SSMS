import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  getParentFeedback,
  submitFeedback,
} from "../../features/parent/Feedback/parentfeedbackSlice";

export default function ParentsFeedback() {
  const dispatch = useDispatch();

  const selectedStudentId = useSelector(
    (state) => state.parentDashboard?.selectedStudentId
  );

  const studentId =
    selectedStudentId ||
    localStorage.getItem("selectedStudentId");

  const parentFeedbackState = useSelector(
    (state) => state.parentFeedback
  );

  const {
    loading,
    feedbackList = [],
  } = parentFeedbackState;

  const [selectedFormId, setSelectedFormId] = useState("");
  const [feedbackAnswers, setFeedbackAnswers] = useState({});

  useEffect(() => {
    if (studentId) {
      dispatch(getParentFeedback(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (feedbackList?.length > 0) {
      setSelectedFormId((prev) =>
        prev || String(feedbackList[0].formId)
      );
    }
  }, [feedbackList]);

  const selectedForm =
    feedbackList?.find(
      (form) => form.formId === Number(selectedFormId)
    ) || feedbackList?.[0];

  const handleChange = (questionId, optionValue) => {
    setFeedbackAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedForm) {
      toast.error("Please select a feedback form");
      return;
    }

    const totalQuestions =
      selectedForm?.questions?.length || 0;

    if (
      Object.keys(feedbackAnswers).length !== totalQuestions
    ) {
      toast.warning("Please answer all questions");
      return;
    }

    const payload = {
      feedbackFormId: selectedForm.formId,
      studentId: Number(studentId),
      answers: Object.entries(feedbackAnswers).map(
        ([questionId, selectedOption]) => ({
          questionId: Number(questionId),
          selectedOption,
        })
      ),
    };

    try {
      await dispatch(submitFeedback(payload)).unwrap();

      toast.success("Feedback submitted successfully!");

      setFeedbackAnswers({});
    } catch (error) {
      console.error("Submit Error:", error);

      const errorMessage =
        error?.message ||
        error?.error ||
        "Failed to submit feedback";

      if (
        errorMessage
          .toLowerCase()
          .includes("feedback already submitted")
      ) {
        toast.warning("Feedback already submitted");
        return;
      }

      toast.error(errorMessage);
    }
  };
  return (
    <div >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Feedback
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Home / Feedback
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Feedback Form
          </h3>

          <select
            value={selectedFormId || feedbackList?.[0]?.formId || ""}
            onChange={(e) => {
              setSelectedFormId(e.target.value);
              setFeedbackAnswers({});
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 min-w-[200px]"
          >
            {feedbackList?.map((form) => (
              <option
                key={form.formId}
                value={form.formId}
              >
                {form.title || `Form ${form.formId}`}
              </option>
            ))}
          </select>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {selectedForm?.questions?.map((question) => (
            <div key={question.questionId}>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                {question.questionText}
              </label>

              <div className="flex gap-6 flex-wrap">
                {question.options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      value={option.value}
                      checked={
                        feedbackAnswers[
                        question.questionId
                        ] === option.value
                      }
                      onChange={() =>
                        handleChange(
                          question.questionId,
                          option.value
                        )
                      }
                      className="accent-blue-600 w-4 h-4"
                    />

                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      {selectedForm && (
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="btn-primary bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  )
};