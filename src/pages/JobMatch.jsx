import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { sampleJobDescriptions } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const JobMatch = () => {
  const { currentAnalysis } = useAuth();
  const { addToast } = useToast();

  const [selectedPresetId, setSelectedPresetId] = useState(sampleJobDescriptions[0].id);
  const [jobText, setJobText] = useState(sampleJobDescriptions[0].description);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [copiedBullet, setCopiedBullet] = useState(null);

  // Match analysis result state
  const [matchResult, setMatchResult] = useState({
    matchScore: 74,
    matchedKeywords: ['React', 'JavaScript', 'REST APIs', 'SQL', 'Git'],
    missingKeywords: ['AWS', 'Docker', 'Kubernetes', 'Microservices'],
    suggestions: [
      'Add cloud experience emphasizing AWS (S3, EC2, Lambda) in your backend section.',
      'Include Docker or containerization projects to meet the modern DevOps requirement.',
      'Highlight RESTful API development experience with specific latency metrics.'
    ],
    tailoredBullets: [
      'Engineered and containerized 6+ RESTful microservices using Node.js & Docker, reducing deployment cycle times by 35%.',
      'Configured automated CI/CD pipelines deploying React single-page applications to AWS S3 & CloudFront with 99.9% uptime.'
    ]
  });

  const handleSelectPreset = (job) => {
    setSelectedPresetId(job.id);
    setJobText(job.description);
    addToast(`Loaded preset: "${job.title}"`, 'info');
  };

  const handleAnalyzeMatch = () => {
    if (!jobText.trim()) {
      addToast('Please paste a job description first', 'warning');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      // Intelligent mock keyword extraction based on pasted text
      const lower = jobText.toLowerCase();
      
      const potentialMatched = ['React', 'JavaScript', 'REST APIs', 'SQL', 'Git', 'HTML5', 'TypeScript', 'Node.js', 'Python']
        .filter(k => lower.includes(k.toLowerCase()) || ['React', 'JavaScript', 'Git', 'SQL'].includes(k));
      
      const potentialMissing = ['AWS', 'Docker', 'Kubernetes', 'Microservices', 'GraphQL', 'Terraform', 'CI/CD']
        .filter(k => lower.includes(k.toLowerCase()) || ['AWS', 'Docker', 'Kubernetes'].includes(k));

      // Calculate score based on proportion
      const calculatedScore = Math.min(Math.max(Math.round((potentialMatched.length / (potentialMatched.length + potentialMissing.length + 1)) * 100 + 35), 62), 92);

      setMatchResult({
        matchScore: calculatedScore,
        matchedKeywords: potentialMatched.length > 0 ? potentialMatched : ['React', 'JavaScript', 'REST APIs', 'SQL', 'Git'],
        missingKeywords: potentialMissing.length > 0 ? potentialMissing : ['AWS', 'Docker', 'Kubernetes', 'Microservices'],
        suggestions: [
          'Add cloud experience emphasizing AWS in your backend section.',
          'Include Docker or containerization projects to meet the requirement.',
          'Highlight API development experience with specific latency metrics.'
        ],
        tailoredBullets: [
          'Engineered and containerized 6+ RESTful microservices using Node.js & Docker, reducing deployment cycle times by 35%.',
          'Configured automated CI/CD pipelines deploying React applications to AWS with 99.9% uptime.'
        ]
      });

      setIsAnalyzing(false);
      setHasAnalyzed(true);
      addToast(`Job match analyzed! Match Score: ${calculatedScore}%`, 'success');
    }, 600);
  };

  const handleCopyBullet = (text, idx) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBullet(idx);
      addToast('Tailored resume bullet copied to clipboard!', 'success');
      setTimeout(() => setCopiedBullet(null), 2500);
    }
  };

  return (
    <div className="jobmatch-page">
      <div className="container">
        {/* Header */}
        <div className="jobmatch-header">
          <div className="badge badge-gradient" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#4F46E5" />
            <span>TARGETED ATS MATCHING</span>
          </div>
          <h1 className="jobmatch-title">Match Your Resume to a Job</h1>
          <p className="jobmatch-subtitle">
            Paste a job description and discover how well your resume matches.
          </p>
        </div>

        {/* Dual Grid Layout */}
        <div className="jobmatch-grid">
          
          {/* Left Column: Job Description Input */}
          <div className="jobmatch-input-card">
            <div className="jobmatch-input-header">
              <span className="jobmatch-input-label">
                <FileText size={18} color="#4F46E5" />
                <span>Job Description</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Targeting: {currentAnalysis?.resumeName || 'Your Resume'}
              </span>
            </div>

            {/* Presets Row */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '0.4rem' }}>
                Try sample job templates:
              </span>
              <div className="preset-selector-row">
                {sampleJobDescriptions.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={`preset-chip ${selectedPresetId === job.id ? 'active' : ''}`}
                    onClick={() => handleSelectPreset(job)}
                  >
                    {job.title.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="job-textarea"
              placeholder="Paste the job description here..."
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                setSelectedPresetId(null);
              }}
              rows={12}
            />

            {/* Submit Button */}
            <button
              type="button"
              className="btn btn-primary match-submit-btn"
              onClick={handleAnalyzeMatch}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>Matching Keywords with AI...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Analyze Job Match</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Match Analysis Results */}
          <div className="jobmatch-results-panel">
            {hasAnalyzed ? (
              <>
                {/* Score Hero Card */}
                <div className="match-score-card">
                  <div className="match-score-badge-circle">
                    <span className="match-score-big-pct">{matchResult.matchScore}%</span>
                    <span className="match-score-label">Match</span>
                  </div>

                  <div className="match-score-details">
                    <h3 className="match-score-status-title">
                      Job Match Score: {matchResult.matchScore}%
                    </h3>
                    <p className="match-score-summary-text">
                      {matchResult.matchScore >= 75
                        ? "Strong alignment! Your resume covers the primary requirements with minor keyword gaps."
                        : "Moderate match. Incorporating the missing keywords below will significantly increase your interview odds."}
                    </p>
                  </div>
                </div>

                {/* Matched vs Missing Keywords */}
                <div className="keywords-breakdown-card">
                  {/* Matched */}
                  <div className="keywords-section-block">
                    <div className="keywords-header-title matched">
                      <CheckCircle2 size={16} />
                      <span>Matched Keywords ({matchResult.matchedKeywords.length})</span>
                    </div>
                    <div className="keywords-pill-wrap">
                      {matchResult.matchedKeywords.map((kw, idx) => (
                        <span key={idx} className="keyword-pill matched">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="keywords-section-block">
                    <div className="keywords-header-title missing">
                      <AlertTriangle size={16} />
                      <span>Missing Keywords ({matchResult.missingKeywords.length})</span>
                    </div>
                    <div className="keywords-pill-wrap">
                      {matchResult.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="keyword-pill missing">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions Card */}
                <div className="match-suggestions-card">
                  <h3 className="match-suggestions-title">
                    <Lightbulb size={18} color="#F59E0B" />
                    <span>Tailoring Suggestions</span>
                  </h3>

                  <div className="suggestions-checklist">
                    {matchResult.suggestions.map((sug, idx) => (
                      <div key={idx} className="suggestion-item-row">
                        <ArrowRight size={15} className="suggestion-icon-bullet" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Tailored Bullets */}
                <div className="match-suggestions-card" style={{ background: '#F8FAFC' }}>
                  <h3 className="match-suggestions-title" style={{ fontSize: '0.95rem' }}>
                    <Sparkles size={16} color="#4F46E5" />
                    <span>Suggested Resume Bullets for This Job</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {matchResult.tailoredBullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#FFFFFF',
                          padding: '0.85rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <p style={{ fontStyle: 'italic', color: 'var(--text-main)', margin: 0 }}>
                          "{bullet}"
                        </p>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.25rem 0.5rem', flexShrink: 0 }}
                          onClick={() => handleCopyBullet(bullet, idx)}
                          title="Copy bullet"
                        >
                          {copiedBullet === idx ? (
                            <Check size={15} color="#10B981" />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="match-empty-placeholder">
                <Briefcase size={48} color="#94A3B8" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Analysis Yet</h3>
                <p style={{ maxWidth: '320px', fontSize: '0.9rem' }}>
                  Paste a job description on the left and click "Analyze Job Match" to see real-time compatibility.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobMatch;
