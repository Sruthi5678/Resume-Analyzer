import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  Target,
  Brain,
  Search,
  UploadCloud,
  Cpu,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      iconName: 'BarChart3',
      title: 'Resume Score',
      badge: 'Comprehensive',
      description: 'Get an instant 360° numerical evaluation of your resume readability, impact, formatting, and structural strength.',
      highlightPoints: [
        'Objective scoring breakdown',
        'Section-by-section audit',
        'Actionable score benchmarks'
      ]
    },
    {
      iconName: 'Target',
      title: 'ATS Optimization',
      badge: 'Recruiter-Ready',
      description: 'Test your resume against top ATS parser algorithms (Workday, Greenhouse, Lever) to ensure you pass initial screening filters.',
      highlightPoints: [
        'Parser compatibility checks',
        'Format & typography safety',
        'Header & column readability'
      ]
    },
    {
      iconName: 'Brain',
      title: 'AI Insights & Rewrite',
      badge: 'Smart AI',
      description: 'Receive intelligent suggestions that transform weak, passive bullet points into high-impact, quantified achievement statements.',
      highlightPoints: [
        'Interactive before/after examples',
        'Action-oriented metric formulas',
        'Executive summary enhancement'
      ]
    },
    {
      iconName: 'Search',
      title: 'Skill & Keyword Analysis',
      badge: 'Keyword Scanner',
      description: 'Detect critical missing technical skills and industry keywords to optimize your resume for targeted job roles.',
      highlightPoints: [
        'Matched vs. missing skills list',
        'Cloud & DevOps gap detection',
        'Real-time job match scoring'
      ]
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Resume',
      desc: 'Simply drag and drop your PDF resume. Our system supports single-column and multi-column formats securely.',
      icon: <UploadCloud size={28} />
    },
    {
      number: '02',
      title: 'AI Analysis',
      desc: 'Advanced AI parses your experience, skills, and metrics, evaluating them against modern hiring standards.',
      icon: <Cpu size={28} />
    },
    {
      number: '03',
      title: 'Get Insights & Match',
      desc: 'Receive your detailed score report, fix keyword gaps, and match your resume against specific job descriptions.',
      icon: <FileCheck2 size={28} />
    }
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: 'var(--gradient-hero-bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Hero Copy */}
            <div>
              {/* Badge */}
              <div className="badge badge-gradient" style={{ marginBottom: '1.25rem' }}>
                <Sparkles size={14} color="#6366F1" />
                <span>AI-POWERED RESUME INTELLIGENCE</span>
              </div>

              {/* Main Heading */}
              <h1 style={{ fontSize: '3.4rem', fontWeight: 900, lineHeight: 1.12, letterSpacing: '-0.035em', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Know what your resume is <span className="gradient-text">really saying.</span>
              </h1>

              {/* Description */}
              <p style={{ fontSize: '1.18rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '540px' }}>
                Get AI-powered insights to improve your resume, increase ATS compatibility, identify missing skills, and stand out to recruiters.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link
                  to={isAuthenticated ? "/upload" : "/login"}
                  className="btn btn-primary btn-lg"
                >
                  <Sparkles size={18} />
                  <span>Analyze My Resume</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works" className="btn btn-secondary btn-lg">
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust Callouts */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="#10B981" />
                  <span>100% Secure & Private</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={16} color="#6366F1" />
                  <span>Instant 5-Second Scan</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={16} color="#F59E0B" />
                  <span>ATS Algorithm Calibrated</span>
                </div>
              </div>
            </div>

            {/* Right Hero Dashboard Preview Card */}
            <div id="preview" style={{ position: 'relative' }}>
              <div
                className="card card-glow"
                style={{
                  background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
                  color: '#FFFFFF',
                  padding: '2.25rem',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Header inside preview */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#F59E0B' }} />
                    <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, marginLeft: '0.5rem', color: '#E0E7FF' }}>
                      AI Resume Analysis
                    </span>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    Parsed Cleanly
                  </span>
                </div>

                {/* Score & Status Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #06B6D4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>78</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#E0E7FF' }}>/100</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                      Overall Score: 78
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#C7D2FE' }}>
                      Good – Your resume has strong potential.
                    </p>
                  </div>
                </div>

                {/* Progress bars inside preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#E0E7FF', marginBottom: '0.25rem' }}>
                      <span>ATS Readiness</span>
                      <span>82%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: '82%', height: '100%', background: '#38BDF8', borderRadius: '99px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#E0E7FF', marginBottom: '0.25rem' }}>
                      <span>Skills Match</span>
                      <span>86%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: '86%', height: '100%', background: '#A855F7', borderRadius: '99px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#E0E7FF', marginBottom: '0.25rem' }}>
                      <span>Keyword Coverage</span>
                      <span>69%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: '69%', height: '100%', background: '#F59E0B', borderRadius: '99px' }} />
                    </div>
                  </div>
                </div>

                {/* Micro Stats bottom row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>18</div>
                    <div style={{ fontSize: '0.7rem', color: '#C7D2FE', fontWeight: 600 }}>Matched Skills</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171' }}>04</div>
                    <div style={{ fontSize: '0.7rem', color: '#C7D2FE', fontWeight: 600 }}>Missing Skills</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>78%</div>
                    <div style={{ fontSize: '0.7rem', color: '#C7D2FE', fontWeight: 600 }}>ATS Score</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge badge-gradient" style={{ marginBottom: '0.75rem' }}>
              POWERFUL AI CAPABILITIES
            </div>
            <h2 className="section-title">
              Engineered to land more interviews.
            </h2>
            <p className="section-subtitle">
              Everything you need to beat automated applicant filters and capture hiring managers' attention.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding" style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
              SEAMLESS 3-STEP WORKFLOW
            </div>
            <h2 className="section-title">
              How ResumeIQ Works
            </h2>
            <p className="section-subtitle">
              Get comprehensive resume intelligence in less than 10 seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '2.25rem',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div className="logo-icon-wrapper" style={{ width: '3.25rem', height: '3.25rem', borderRadius: '14px' }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-200)', letterSpacing: '-0.04em' }}>
                    Step {step.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)', color: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge badge-gradient" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)', marginBottom: '1.25rem' }}>
            <Sparkles size={14} />
            <span>START YOUR CAREER ACCELERATION</span>
          </div>

          <h2 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', color: '#FFFFFF' }}>
            Ready to unlock your resume's potential?
          </h2>

          <p style={{ fontSize: '1.2rem', color: '#C7D2FE', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Join thousands of job seekers who improved their resume scores and landed interviews at top tech companies.
          </p>

          <Link
            to={isAuthenticated ? "/upload" : "/signup"}
            className="btn btn-primary btn-lg"
            style={{
              background: '#FFFFFF',
              color: '#312E81',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Sparkles size={18} color="#4F46E5" />
            <span style={{ fontWeight: 800 }}>Get Started Now</span>
            <ArrowRight size={18} color="#4F46E5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
