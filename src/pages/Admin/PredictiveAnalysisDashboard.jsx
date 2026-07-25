import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import DocumentUpload from "../../components/PredictiveAnalysis/DocumentUpload";
import AnalysisDashboard from "../../components/PredictiveAnalysis/AnalysisDashboard";
import { resetAnalysisData } from "../../features/Admin/PredictiveAnalysis/predictiveAnalysisSlice";

const PredictiveAnalysisDashboard = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const dispatch = useDispatch();
  const { loading, analysisData, error } = useSelector(
    (state) => state.predictiveAnalysis
  );

  useEffect(() => {
    if (analysisData && !loading) {
      setShowDashboard(true);
    }
  }, [analysisData, loading]);

  const handleAnalyzeClick = (fileData) => {
    setUploadedFile(fileData);
  };

  const handleBackToUpload = () => {
    setShowDashboard(false);
    setUploadedFile(null);
    dispatch(resetAnalysisData());
  };

  return (
    <div className="w-full bg-gray-100 p-4 sm:p-6">
      <Toaster position="top-right" richColors />
      {!showDashboard && (
        <DocumentUpload onAnalyze={handleAnalyzeClick} isLoading={loading} />
      )}

      {showDashboard && analysisData && (
        <AnalysisDashboard
          data={analysisData}
          onBack={handleBackToUpload}
          uploadedFile={uploadedFile}
        />
      )}
    </div>
  );
};

export default PredictiveAnalysisDashboard;
