import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import AnswerSheetsUpload from "../../components/AnswerSheets/AnswerSheetsUpload";
import AnswerSheetsResult from "../../components/AnswerSheets/AnswerSheetsResult";
import { resetAnalysisData } from "../../features/Admin/AnswerSheets/answerSheetsSlice";

const AnswerSheets = () => {
  const [showResult, setShowResult] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const dispatch = useDispatch();
  const { loading, analysisData, error } = useSelector(
    (state) => state.answerSheets
  );

  useEffect(() => {
    if (analysisData && !loading) {
      setShowResult(true);
    }
  }, [analysisData, loading]);

  const handleAnalyzeClick = (fileData) => {
    setUploadedFile(fileData);
  };

  const handleBackToUpload = () => {
    setShowResult(false);
    setUploadedFile(null);
    dispatch(resetAnalysisData());
  };

  return (
    <div className="w-full bg-gray-100 p-4 sm:p-6">
      <Toaster position="top-right" richColors />
      {!showResult && (
        <AnswerSheetsUpload onAnalyze={handleAnalyzeClick} isLoading={loading} />
      )}

      {showResult && analysisData && (
        <AnswerSheetsResult
          data={analysisData}
          onBack={handleBackToUpload}
        />
      )}
    </div>
  );
};

export default AnswerSheets;
