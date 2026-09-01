import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

import {
  Sparkles,
  Award,
  Briefcase,
  Upload,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Cpu,
  Layers
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

import ScoreCard from '../components/ScoreCard';
import RecommendationCard from '../components/RecommendationCard';


const Dashboard = () => {

  const { currentAnalysis } = useAuth();

  const { addToast } = useToast();

  const [skillFilter, setSkillFilter] = useState('all');


  // ==========================================
  // LIVE BACKEND ANALYSIS
  // ==========================================

  const analysis = currentAnalysis;


  console.log(
    'Backend Analysis:',
    analysis
  );


  // ==========================================
  // BASIC SCORES
  // ==========================================

  const score =
    analysis?.overall_score ??
    analysis?.overallScore ??
    0;


  const atsScore =
    analysis?.ats_score ??
    analysis?.atsScore ??
    0;


  // ==========================================
  // SKILLS FROM BACKEND
  // ==========================================

  const skillsFound =
    analysis?.skills_found ||
    analysis?.skillsFound ||
    [];


  const matchingSkills =
    analysis?.matching_skills ||
    analysis?.matchedSkills ||
    [];


  const missingSkillsData =
    analysis?.missing_skills ||
    analysis?.missingSkills ||
    [];


  // ==========================================
  // FORMAT MATCHING SKILLS
  // ==========================================

  const matchedSkills = matchingSkills.map((skill) => {

    // Backend sends string
    if (typeof skill === 'string') {

      return {
        name: skill,
        occurrences: null
      };

    }


    // Backend sends object

    return {

      name:
        skill.name ||
        skill.skill ||
        skill.title ||
        'Unknown Skill',

      occurrences:
        skill.occurrences ||
        skill.count ||
        null

    };

  });


  // ==========================================
  // FORMAT MISSING SKILLS
  // ==========================================

  const missingSkills = missingSkillsData.map((skill) => {

    // Backend sends string

    if (typeof skill === 'string') {

      return {

        name: skill,

        priority: 'High',

        reason:
          'Recommended skill based on the job description'

      };

    }


    // Backend sends object

    return {

      name:
        skill.name ||
        skill.skill ||
        skill.title ||
        'Unknown Skill',

      priority:
        skill.priority ||
        'High',

      reason:
        skill.reason ||
        'Recommended skill based on the job description'

    };

  });


  // ==========================================
  // KEYWORD SCORE
  // ==========================================

  const totalSkills =
    matchedSkills.length +
    missingSkills.length;


  const keywordScore =
    totalSkills > 0

      ? Math.round(
          (matchedSkills.length /
            totalSkills) * 100
        )

      : 0;


  // ==========================================
  // DASHBOARD METRICS
  // ==========================================

  const metrics = {

    atsReadiness: {

      score: atsScore,

      label: 'ATS Compatibility',

      status:

        atsScore >= 80
          ? 'High'

          : atsScore >= 60
          ? 'Moderate'

          : 'Low',

      description:
        'Based on resume formatting and ATS compatibility.',

      color: 'indigo'

    },


    skillsMatch: {

      score: keywordScore,

      label: 'Skills Match',

      status:

        keywordScore >= 80
          ? 'Strong'

          : keywordScore >= 60
          ? 'Moderate'

          : 'Needs Improvement',

      description:
        `${matchedSkills.length} relevant skills matched with the job description.`,

      color: 'purple'

    },


    keywordOptimization: {

      score: keywordScore,

      label: 'Keyword Optimization',

      status:

        keywordScore >= 80
          ? 'Strong'

          : keywordScore >= 60
          ? 'Moderate'

          : 'Needs Improvement',

      description:
        `${missingSkills.length} important skills or keywords are missing.`,

      color: 'cyan'

    },


    resumeStructure: {

      score: atsScore,

      label: 'Resume Structure',

      status:

        atsScore >= 80
          ? 'Excellent'

          : atsScore >= 60
          ? 'Good'

          : 'Needs Improvement',

      description:
        'Evaluated using AI-powered resume analysis.',

      color: 'emerald'

    }

  };


  // ==========================================
  // RECOMMENDATIONS
  // ==========================================

  const recommendations =
    analysis?.recommendations ||
    [];


  // ==========================================
  // STRENGTHS
  // ==========================================

  const strengths =
    analysis?.strengths ||
    [];


  // ==========================================
  // AREAS TO IMPROVE
  // ==========================================

  const areasToImprove =
    analysis?.areas_to_improve ||
    analysis?.areasToImprove ||
    [];


  // ==========================================
  // CONFETTI
  // ==========================================

  useEffect(() => {

    if (score >= 75) {

      try {

        confetti({

          particleCount: 70,

          spread: 60,

          origin: {
            y: 0.6
          }

        });

      } catch (error) {

        console.log(
          'Confetti could not load'
        );

      }

    }

  }, [score]);


  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {

    window.print();

  };


  // ==========================================
  // SHARE
  // ==========================================

  const handleShare = () => {

    if (navigator.clipboard) {

      navigator.clipboard
        .writeText(
          window.location.href
        );

      addToast(
        'Report link copied to clipboard!',
        'success'
      );

    } else {

      addToast(
        'Sharing enabled for this report.',
        'info'
      );

    }

  };


  // ==========================================
  // SVG SCORE CIRCLE
  // ==========================================

  const radius = 56;

  const circumference =
    2 * Math.PI * radius;


  const strokeDashoffset =
    circumference -
    (score / 100) *
    circumference;


  // ==========================================
  // OVERALL STATUS
  // ==========================================

  const overallStatus =

    score >= 85

      ? 'Excellent Resume Profile!'

      : score >= 70

      ? 'Good Resume – Strong Potential!'

      : score >= 50

      ? 'Your Resume Needs Improvement'

      : 'Resume Requires Significant Improvement';


  // ==========================================
  // OVERALL SUMMARY
  // ==========================================

  const overallSummary =

    analysis?.summary ||

    analysis?.overall_summary ||

    `Your resume received an overall AI score of ${score}/100.
    The analysis found ${skillsFound.length} skills in your resume,
    matched ${matchedSkills.length} relevant skills with the job description,
    and identified ${missingSkills.length} important skill gaps.`;


  // ==========================================
  // RESUME NAME
  // ==========================================

  const resumeName =

    analysis?.resume_name ||

    analysis?.resumeName ||

    'Your Resume';


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="dashboard-page">

      <div className="container">


        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="dashboard-header-row">


          <div className="dashboard-title-area">


            <div
              className="badge badge-gradient"
              style={{
                width: 'fit-content',
                marginBottom: '0.4rem'
              }}
            >

              <Sparkles size={13} />

              <span>
                AI RESUME AUDIT COMPLETED
              </span>

            </div>


            <h1 className="dashboard-main-title">

              Your Resume Report

            </h1>


            <p className="dashboard-subtitle">

              Here's what our AI discovered about your resume.

            </p>


          </div>



          {/* ACTION BUTTONS */}

          <div className="dashboard-actions-group">


            <Link
              to="/job-match"
              className="btn btn-primary btn-sm"
            >

              <Briefcase size={16} />

              <span>
                Match to Job Description
              </span>

            </Link>


            <Link
              to="/upload"
              className="btn btn-secondary btn-sm"
            >

              <Upload size={16} />

              <span>
                Upload New
              </span>

            </Link>


            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
            >

              <Printer size={16} />

              <span>
                Print Report
              </span>

            </button>


            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
            >

              <Share2 size={16} />

            </button>


          </div>


        </div>



        {/* ========================================== */}
        {/* OVERALL SCORE */}
        {/* ========================================== */}

        <div className="overall-score-hero">


          {/* SCORE CIRCLE */}

          <div className="score-circle-wrapper">


            <svg
              className="score-svg-circle"
              viewBox="0 0 140 140"
            >


              <circle

                className="score-svg-bg"

                cx="70"

                cy="70"

                r={radius}

              />


              <circle

                className="score-svg-progress"

                cx="70"

                cy="70"

                r={radius}

                style={{

                  strokeDasharray:
                    circumference,

                  strokeDashoffset:
                    strokeDashoffset

                }}

              />


            </svg>


            <div className="score-circle-content">


              <span className="score-number-big">

                {score}

              </span>


              <span className="score-number-max">

                / 100

              </span>


            </div>


          </div>



          {/* SCORE INFORMATION */}

          <div className="overall-score-info">


            <div className="overall-score-badge">

              <Award size={15} />

              <span>

                Overall Score: {score}/100

              </span>

            </div>


            <h2 className="overall-score-heading">

              {overallStatus}

            </h2>


            <p className="overall-score-summary">

              {overallSummary}

            </p>


          </div>



          {/* QUICK STATS */}

          <div className="overall-quick-stats">


            <div className="quick-stat-row">

              <span>
                File Analyzed:
              </span>


              <span className="quick-stat-val">

                {resumeName}

              </span>

            </div>



            <div className="quick-stat-row">

              <span>
                Matched Skills:
              </span>


              <span
                className="quick-stat-val"
                style={{
                  color: '#34D399'
                }}
              >

                {matchedSkills.length} Verified

              </span>

            </div>



            <div className="quick-stat-row">

              <span>
                Missing Gaps:
              </span>


              <span
                className="quick-stat-val"
                style={{
                  color: '#F87171'
                }}
              >

                {missingSkills.length} High Priority

              </span>

            </div>



            <div className="quick-stat-row">

              <span>
                ATS Score:
              </span>


              <span
                className="quick-stat-val"
                style={{
                  color: '#38BDF8'
                }}
              >

                {atsScore}/100

              </span>

            </div>


          </div>


        </div>



        {/* ========================================== */}
        {/* METRICS */}
        {/* ========================================== */}

        <div className="metrics-grid">


          <ScoreCard
            {...metrics.atsReadiness}
          />


          <ScoreCard
            {...metrics.skillsMatch}
          />


          <ScoreCard
            {...metrics.keywordOptimization}
          />


          <ScoreCard
            {...metrics.resumeStructure}
          />


        </div>



        {/* ========================================== */}
        {/* SKILLS ANALYSIS */}
        {/* ========================================== */}

        <div className="dashboard-section">


          <div className="section-header-row">


            <div className="section-title-group">


              <div className="section-icon-box">

                <Cpu size={20} />

              </div>


              <div>


                <h3 className="section-heading-text">

                  Skills Analysis

                </h3>


                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}
                >

                  Detected {skillsFound.length} skills,
                  matched {matchedSkills.length} skills,
                  and found {missingSkills.length} skill gaps.

                </span>


              </div>


            </div>


          </div>



          <div className="skills-dual-grid">


            {/* MATCHED SKILLS */}

            <div className="skills-column">


              <div className="skills-column-title">


                <span>

                  <CheckCircle2 size={16} />

                  Matched Skills ({matchedSkills.length})

                </span>


              </div>


              <div className="skills-tags-wrap">


                {matchedSkills.length > 0 ? (

                  matchedSkills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="skill-tag matched"
                      >

                        <CheckCircle2 size={13} />

                        <span>
                          {skill.name}
                        </span>


                        {skill.occurrences && (

                          <span className="skill-count-badge">

                            {skill.occurrences}x

                          </span>

                        )}


                      </span>

                    )
                  )

                ) : (

                  <p>
                    No matching skills found.
                  </p>

                )}


              </div>


            </div>



            {/* MISSING SKILLS */}

            <div className="skills-column">


              <div className="skills-column-title">


                <span>

                  <AlertTriangle size={16} />

                  Missing Skills ({missingSkills.length})

                </span>


              </div>


              <div className="skills-tags-wrap">


                {missingSkills.length > 0 ? (

                  missingSkills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="skill-tag missing"
                        title={skill.reason}
                      >

                        <AlertTriangle size={13} />

                        <span>
                          {skill.name}
                        </span>


                        <span className="skill-count-badge">

                          {skill.priority}

                        </span>


                      </span>

                    )
                  )

                ) : (

                  <p>
                    No missing skills found. Great job!
                  </p>

                )}


              </div>


            </div>


          </div>


        </div>



        {/* ========================================== */}
        {/* RECOMMENDATIONS */}
        {/* ========================================== */}

        <div className="dashboard-section">


          <div className="section-header-row">


            <div className="section-title-group">


              <div className="section-icon-box">

                <Sparkles size={20} />

              </div>


              <div>


                <h3 className="section-heading-text">

                  AI Recommendations

                </h3>


                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}
                >

                  Personalized recommendations generated from your resume.

                </span>


              </div>


            </div>


          </div>



          <div className="recommendations-list">


            {recommendations.length > 0 ? (

              recommendations.map(
                (rec, index) => (

                  <RecommendationCard

                    key={rec.id || index}

                    recommendation={rec}

                    defaultOpen={index === 0}

                  />

                )
              )

            ) : (

              <div
                style={{
                  padding: '20px',
                  color: '#666'
                }}
              >

                No additional recommendations were returned by the AI.

              </div>

            )}


          </div>


        </div>



        {/* ========================================== */}
        {/* STRENGTHS AND IMPROVEMENTS */}
        {/* ========================================== */}

        <div className="dashboard-section">


          <div className="section-header-row">


            <div className="section-title-group">


              <div className="section-icon-box">

                <Layers size={20} />

              </div>


              <div>


                <h3 className="section-heading-text">

                  Resume Strengths & Areas to Improve

                </h3>


                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}
                >

                  AI-powered evaluation of your resume.

                </span>


              </div>


            </div>


          </div>



          <div className="strengths-dual-grid">


            {/* STRENGTHS */}

            <div
              className="strength-card-panel"
              style={{
                background: '#F0FDF4',
                borderColor: '#BBF7D0'
              }}
            >


              <div className="strength-card-header good">

                <CheckCircle2
                  size={20}
                  color="#10B981"
                />

                <span>
                  Strengths
                </span>

              </div>



              <div className="strength-items-list">


                {strengths.length > 0 ? (

                  strengths.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="strength-item-box"
                      >

                        <CheckCircle2
                          size={16}
                          className="strength-item-icon good"
                        />


                        <div>


                          <h4 className="strength-item-title">

                            {typeof item === 'string'
                              ? item
                              : item.title}

                          </h4>


                          {typeof item !== 'string' && (

                            <p className="strength-item-desc">

                              {item.description}

                            </p>

                          )}


                        </div>


                      </div>

                    )
                  )

                ) : (

                  <p>
                    No strengths information returned.
                  </p>

                )}


              </div>


            </div>



            {/* AREAS TO IMPROVE */}

            <div
              className="strength-card-panel"
              style={{
                background: '#FFFBEB',
                borderColor: '#FDE68A'
              }}
            >


              <div className="strength-card-header improve">

                <AlertTriangle
                  size={20}
                  color="#F59E0B"
                />

                <span>
                  Areas to Improve
                </span>

              </div>



              <div className="strength-items-list">


                {areasToImprove.length > 0 ? (

                  areasToImprove.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="strength-item-box"
                      >

                        <AlertTriangle
                          size={16}
                          className="strength-item-icon improve"
                        />


                        <div>


                          <h4 className="strength-item-title">

                            {typeof item === 'string'
                              ? item
                              : item.title}

                          </h4>


                          {typeof item !== 'string' && (

                            <p className="strength-item-desc">

                              {item.description}

                            </p>

                          )}


                        </div>


                      </div>

                    )
                  )

                ) : (

                  <p>
                    No improvement areas returned.
                  </p>

                )}


              </div>


            </div>


          </div>


        </div>


      </div>

    </div>

  );

};


export default Dashboard;