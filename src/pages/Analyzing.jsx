import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSteps from '../components/LoadingSteps';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Analyzing = () => {
  const navigate = useNavigate();
  const { completeAnalysis } = useAuth();
  const { addToast } = useToast();

  const handleAnalysisComplete = () => {
    console.log('===== ANALYSIS COMPLETE STARTED =====');

    try {
      // Get the real AI analysis result saved by Upload.jsx
      const analysisData = sessionStorage.getItem('resumeAnalysis');

      console.log('Raw sessionStorage data:', analysisData);

      // Check whether analysis data exists
      if (!analysisData) {
        console.error('❌ No analysis data found in sessionStorage');

        addToast(
          'Analysis data not found. Please upload your resume again.',
          'error'
        );

        navigate('/upload');
        return;
      }

      // Convert JSON string to JavaScript object
      const analysisResult = JSON.parse(analysisData);

      console.log('✅ Parsed AI Analysis Result:', analysisResult);

      // Save REAL backend result into AuthContext
      console.log('Calling completeAnalysis...');

      completeAnalysis(analysisResult);

      console.log('✅ completeAnalysis finished successfully');

      // Optional: remove temporary session data
      sessionStorage.removeItem('resumeAnalysis');

      // Show success message
      addToast(
        'Resume analysis complete! Report ready.',
        'success'
      );

      // Navigate to Dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ ANALYZING ERROR:', error);

      addToast(
        'Something went wrong while loading your analysis.',
        'error'
      );

      navigate('/upload');
    }
  };

  return (
    <div className="analyzing-page">
      <LoadingSteps
        onComplete={handleAnalysisComplete}
      />
    </div>
  );
};

export default Analyzing;