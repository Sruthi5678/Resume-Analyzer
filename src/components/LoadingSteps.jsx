import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';

const steps = [
  "Extracting resume information",
  "Identifying your skills",
  "Checking ATS compatibility",
  "Finding important keywords",
  "Generating AI recommendations"
];

const LoadingSteps = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Step progression timer
    const stepDuration = 800; // ms per step
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, stepDuration);

    // Progress bar smooth increase
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return Math.min(prev + 4, 100);
        } else {
          clearInterval(progressInterval);
          return 100;
        }
      });
    }, 150);

    // Completion timeout
    const completionTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, stepDuration * (steps.length + 0.5));

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className="analyzing-card">
      {/* Radar scanning visual */}
      <div className="scanner-visual-container">
        <div className="scanner-ring scanner-ring-1" />
        <div className="scanner-ring scanner-ring-2" />
        <div className="scanner-ring scanner-ring-3" />
        <div className="scanner-core-icon">
          <Sparkles size={32} />
        </div>
      </div>

      <h2 className="analyzing-title">Analyzing your resume...</h2>
      <p className="analyzing-desc">Our AI is carefully reviewing your resume structure, ATS keywords, and skills match.</p>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* 5-Step Checklist */}
      <div className="steps-checklist">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && progress === 100);
          const isActive = idx === currentStepIndex && progress < 100;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={idx}
              className={`step-checklist-item ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
            >
              <div
                className={`step-icon-state ${
                  isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                }`}
              >
                {isCompleted ? (
                  <Check size={13} strokeWidth={3} />
                ) : isActive ? (
                  <Loader2 size={12} className="spin-icon" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <button className="skip-analyzing-btn" onClick={onComplete}>
        Skip animation and view report &rarr;
      </button>
    </div>
  );
};

export default LoadingSteps;
