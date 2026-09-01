import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Password strength calculation (0 to 3)
  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(password);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }
    if (!email) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms of Service';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      signup(fullName, email, password);
      addToast('Account created successfully! Welcome to ResumeIQ.', 'success');
      navigate('/upload');
    }, 400);
  };

  return (
    <div className="auth-page">
      {/* Left Brand Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-badge">
            <Sparkles size={14} color="#A5B4FC" />
            <span>JOIN THOUSANDS OF HIRED CANDIDATES</span>
          </div>

          <h1 className="auth-brand-title">
            Build a resume that gets you hired.
          </h1>

          <p className="auth-brand-desc">
            Stop guessing why your resume isn't getting replies. Unlock instant AI score reports, ATS keyword optimization, and custom tailoring.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-check">
                <CheckCircle2 size={16} />
              </div>
              <span>Instant AI-driven resume scoring</span>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-check">
                <CheckCircle2 size={16} />
              </div>
              <span>ATS scanner compatibility audit</span>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-check">
                <CheckCircle2 size={16} />
              </div>
              <span>Targeted job description keyword matching</span>
            </div>
          </div>
        </div>

        <div className="auth-floating-card">
          <div className="auth-floating-stat-num">92%</div>
          <div className="auth-floating-stat-text">
            Of users report passing initial automated recruiter screenings within 2 weeks of applying recommendations.
          </div>
        </div>
      </div>

      {/* Right Signup Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/" className="auth-back-btn">
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <div className="auth-header">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">
              Start optimizing your resume with AI in under 60 seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                Full Name
              </label>
              <div className="form-input-wrapper">
                <User size={18} className="form-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                />
              </div>
              {errors.fullName && <span className="form-error-msg">{errors.fullName}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="form-input-wrapper">
                <Mail size={18} className="form-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="alex.morgan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Password
              </label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="password-strength-bar">
                  <div className={`strength-segment ${strength >= 1 ? 'active-weak' : ''}`} />
                  <div className={`strength-segment ${strength >= 2 ? 'active-medium' : ''}`} />
                  <div className={`strength-segment ${strength >= 3 ? 'active-strong' : ''}`} />
                </div>
              )}
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="form-error-msg">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="checkbox-input"
                />
                <span style={{ fontSize: '0.85rem' }}>
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
              {errors.agreeTerms && <span className="form-error-msg">{errors.agreeTerms}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer switch prompt */}
          <div className="auth-footer-prompt">
            Already have an account?
            <Link to="/login" className="auth-switch-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
