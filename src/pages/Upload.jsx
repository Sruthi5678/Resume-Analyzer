import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sampleResumes } from '../data/mockData';

// ==========================================
// BACKEND API URL
// ==========================================

const API_URL = 'https://resume-analyzer-jh1c.onrender.com';

const Upload = () => {
  const {
    user,
    uploadedFile,
    setUploadedFile,
    loadSampleResume,
    setCurrentAnalysis
  } = useAuth();

  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  // ==========================================
  // ANALYZE RESUME
  // ==========================================

  const handleStartAnalysis = async () => {
    if (!uploadedFile) {
      addToast(
        'Please select or upload a resume PDF first',
        'warning'
      );
      return;
    }

    if (!uploadedFile.rawFile) {
      addToast(
        'Please upload a real PDF file. Sample resumes cannot be analyzed.',
        'warning'
      );
      return;
    }

    if (!jobDescription.trim()) {
      addToast(
        'Please enter the job description',
        'warning'
      );
      return;
    }

    try {
      setIsAnalyzing(true);

      console.log('Sending resume to backend...');
      console.log('Backend URL:', `${API_URL}/analyze`);

      const formData = new FormData();

      // Must exactly match FastAPI parameter names
      formData.append('resume', uploadedFile.rawFile);

      formData.append(
        'job_description',
        jobDescription
      );

      const response = await fetch(
        `${API_URL}/analyze`,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log(
        'Backend response status:',
        response.status
      );

      // ==========================================
      // HANDLE BACKEND ERROR
      // ==========================================

      if (!response.ok) {
        let errorMessage = 'Failed to analyze resume';

        try {
          const errorData = await response.json();

          console.error(
            'Backend Error:',
            errorData
          );

          errorMessage =
            errorData.detail ||
            errorData.message ||
            errorMessage;

        } catch (error) {
          console.error(
            'Could not read backend error:',
            error
          );
        }

        throw new Error(errorMessage);
      }

      // ==========================================
      // GET ANALYSIS RESULT
      // ==========================================

      const result = await response.json();

      console.log(
        'AI Analysis Result:',
        result
      );

      // ==========================================
      // VALIDATE RESULT
      // ==========================================

      if (!result || typeof result !== 'object') {
        throw new Error(
          'Invalid analysis result received from backend'
        );
      }

      // ==========================================
      // SAVE TO CONTEXT
      // ==========================================

      if (setCurrentAnalysis) {
        setCurrentAnalysis(result);
      }

      // ==========================================
      // SAVE TO SESSION STORAGE
      // ==========================================

      sessionStorage.setItem(
        'resumeAnalysis',
        JSON.stringify(result)
      );

      sessionStorage.setItem(
        'jobDescription',
        jobDescription
      );

      sessionStorage.setItem(
        'resumeName',
        uploadedFile.name
      );

      console.log(
        'Analysis successfully saved!'
      );

      // ==========================================
      // GO TO ANALYZING PAGE
      // ==========================================

      navigate('/analyzing');

    } catch (error) {
      console.error(
        'Analysis error:',
        error
      );

      addToast(
        error.message ||
        'Something went wrong while analyzing the resume',
        'error'
      );

    } finally {
      setIsAnalyzing(false);
    }
  };


  // ==========================================
  // DRAG EVENTS
  // ==========================================

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };


  // ==========================================
  // PROCESS FILE
  // ==========================================

  const processFile = (file) => {
    if (!file) return;

    const isPDF =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPDF) {
      addToast(
        'Please upload a valid PDF file.',
        'error'
      );

      return;
    }

    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {
      addToast(
        'File size exceeds the 10MB limit.',
        'error'
      );

      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setUploadedFile({
      name: file.name,
      size: formattedSize,
      rawFile: file,
      isSample: false
    });

    addToast(
      `"${file.name}" uploaded successfully!`,
      'success'
    );
  };


  // ==========================================
  // HANDLE FILE DROP
  // ==========================================

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      processFile(
        e.dataTransfer.files[0]
      );
    }
  };


  // ==========================================
  // HANDLE FILE INPUT
  // ==========================================

  const handleFileInputChange = (e) => {
    if (
      e.target.files &&
      e.target.files.length > 0
    ) {
      processFile(
        e.target.files[0]
      );
    }
  };


  // ==========================================
  // REMOVE FILE
  // ==========================================

  const handleRemoveFile = () => {
    setUploadedFile(null);

    setJobDescription('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    addToast(
      'File removed',
      'info'
    );
  };


  // ==========================================
  // SAMPLE RESUME
  // ==========================================

  const handleSelectSample = (sampleId) => {
    const sample =
      loadSampleResume(sampleId);

    addToast(
      `Loaded sample resume: "${sample.role}"`,
      'info'
    );
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="upload-page">

      <div className="container">

        {/* HEADER */}

        <div className="upload-header">

          <div className="upload-welcome-badge">
            <Sparkles
              size={14}
              color="#4F46E5"
            />

            <span>
              AI RESUME AUDITOR
            </span>
          </div>


          <h1 className="upload-title">
            Hello, {user?.name || 'Candidate'} 👋
          </h1>


          <p className="upload-subtitle">
            Upload your resume and get AI-powered insights in seconds.
          </p>

        </div>


        {/* MAIN CARD */}

        <div className="upload-main-card">

          {!uploadedFile ? (

            <div>

              {/* DROPZONE */}

              <div
                className={`dropzone-container ${
                  isDragging ? 'is-dragging' : ''
                }`}

                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}

                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                />


                <div className="dropzone-icon-circle">
                  <UploadCloud size={36} />
                </div>


                <h3 className="dropzone-title">
                  Drag and drop your resume here
                </h3>


                <p className="dropzone-hint">
                  or{' '}

                  <span
                    style={{
                      color: 'var(--primary-600)',
                      fontWeight: 700,
                      textDecoration: 'underline'
                    }}
                  >
                    Browse PDF from your device
                  </span>
                </p>


                <div className="dropzone-specs">
                  <span>Supported format: PDF</span>
                  <span>•</span>
                  <span>Maximum size: 10MB</span>
                </div>

              </div>


              {/* SAMPLE RESUMES */}

              <div className="sample-resumes-box">

                <div className="sample-resumes-title">
                  <FileCode size={16} />

                  <span>
                    Or try with a sample resume:
                  </span>
                </div>


                <div className="sample-resumes-grid">

                  {sampleResumes.map((sample) => (

                    <button
                      key={sample.id}
                      type="button"
                      className="sample-resume-btn"

                      onClick={() =>
                        handleSelectSample(sample.id)
                      }
                    >

                      <span className="sample-resume-role">
                        {sample.role}
                      </span>


                      <span className="sample-resume-meta">
                        {sample.name} • {sample.size}
                      </span>

                    </button>

                  ))}

                </div>

              </div>

            </div>

          ) : (

            <div>

              {/* FILE PREVIEW */}

              <div className="file-preview-card">

                <div className="file-preview-info">

                  <div className="file-preview-icon">
                    <FileText size={24} />
                  </div>


                  <div>

                    <h4 className="file-name-text">
                      {uploadedFile.name}
                    </h4>


                    <div className="file-meta-row">

                      <span>
                        {uploadedFile.size}
                      </span>

                      <span>•</span>


                      <span className="file-badge-success">
                        <CheckCircle2 size={14} />

                        Ready for analysis
                      </span>

                    </div>

                  </div>

                </div>


                <button
                  type="button"
                  className="file-remove-btn"
                  onClick={handleRemoveFile}
                >
                  <Trash2 size={20} />
                </button>

              </div>


              {/* JOB DESCRIPTION */}

              <div
                style={{
                  marginTop: '24px'
                }}
              >

                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}
                >
                  Job Description
                </label>


                <textarea
                  value={jobDescription}

                  onChange={(e) =>
                    setJobDescription(e.target.value)
                  }

                  placeholder={`Paste the job description here...

Example:

We are looking for a Software Engineer with skills in React, Java, Spring Boot, SQL, REST APIs...`}

                  rows={8}

                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '15px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />


                <p
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    marginTop: '6px'
                  }}
                >
                  Paste the job description to compare your resume with the job requirements.
                </p>

              </div>


              {/* ACTION BUTTON */}

              <div className="upload-action-section">

                <button
                  type="button"
                  className="btn btn-primary analyze-main-btn"

                  onClick={handleStartAnalysis}

                  disabled={isAnalyzing}
                >

                  <Sparkles size={20} />


                  <span>
                    {isAnalyzing
                      ? 'Analyzing Resume...'
                      : 'Analyze Resume'}
                  </span>


                  {!isAnalyzing && (
                    <ArrowRight size={20} />
                  )}

                </button>


                <button
                  type="button"
                  className="btn btn-ghost btn-sm"

                  onClick={handleRemoveFile}

                  disabled={isAnalyzing}
                >
                  Choose a different file
                </button>

              </div>

            </div>

          )}


          {/* SECURITY */}

          <div className="security-callout">

            <ShieldCheck
              size={18}
              className="security-icon"
            />

            <span>
              Your resume is private and securely processed.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Upload;