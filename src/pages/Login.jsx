import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email, password, rememberMe);
      addToast('Welcome back to ResumeIQ!', 'success');
      navigate('/upload');
    }, 400);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      demoLogin();
      addToast('Logged in as Demo User (Alex Morgan)', 'success');
      navigate('/upload');
    }, 300);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    addToast('Password reset link sent to ' + (email || 'your email'), 'info');
  };

  return (
    <div className="auth-page">
      {/* Left Brand Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-badge">
            <Sparkles size={14} color="#A5B4FC" />
            <span>AI-POWERED CAREER INTELLIGENCE</span>
          </div>

          <h1 className="auth-brand-title">
            Make your resume impossible to ignore.
          </h1>

          <p className="auth-brand-desc">
            Leverage state-of-the-art AI analysis to identify critical keyword gaps, maximize ATS compatibility, and unlock higher interview conversion rates.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-check">
                <CheckCircle2 size={16} />
              </div>
              <span>AI-powered resume analysis</span>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-check">
                <CheckCircle2 size={16} />
              </div>
              <span>ATS compatibility scoring</span>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-check">
                <CheckCircle2 size={16} />
              </div>
              <span>Personalized improvement suggestions</span>
            </div>
          </div>
        </div>

        {/* Decorative Floating Stat Card */}
        <div className="auth-floating-card">
          <div className="auth-floating-stat-num">+42%</div>
          <div className="auth-floating-stat-text">
            Average interview callback rate increase for candidates using ResumeIQ optimization.
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/" className="auth-back-btn">
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <div className="auth-header">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">
              Sign in to your account to continue optimizing your resume.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="form-input-wrapper">
                <Mail size={18} className="form-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
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
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row-between">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={handleForgotPassword} className="forgot-link">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            {/* Quick Demo Login */}
            <button
              type="button"
              className="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Zap size={16} color="#4F46E5" />
              <span>Quick 1-Click Demo Login</span>
            </button>
          </form>

          {/* Footer switch prompt */}
          <div className="auth-footer-prompt">
            Don't have an account?
            <Link to="/signup" className="auth-switch-link">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
