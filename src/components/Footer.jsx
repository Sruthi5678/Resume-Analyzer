import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, MessageSquare, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-brand-logo">
              <div className="logo-icon-wrapper" style={{ width: '2rem', height: '2rem' }}>
                <Sparkles size={16} />
              </div>
              <span>Resume<span className="gradient-text">IQ</span></span>
            </Link>
            <p className="footer-tagline">
              "Know what your resume is really saying." AI-powered resume intelligence, ATS compatibility scoring, and instant recruiter insights.
            </p>
            <div className="badge badge-indigo" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
              <span>AI-Powered SaaS 2.0</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li><Link to="/upload" className="footer-link">Resume Analyzer</Link></li>
              <li><Link to="/job-match" className="footer-link">Job Description Match</Link></li>
              <li><a href="/#features" className="footer-link">ATS Compatibility</a></li>
              <li><a href="/#how-it-works" className="footer-link">How It Works</a></li>
              <li><Link to="/dashboard" className="footer-link">Report Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#sample-resumes" className="footer-link">Resume Templates</a></li>
              <li><a href="#ats-guide" className="footer-link">ATS Optimization Guide</a></li>
              <li><a href="#keywords" className="footer-link">Action Verbs Library</a></li>
              <li><a href="#benchmarks" className="footer-link">Industry Benchmarks</a></li>
              <li><a href="#faq" className="footer-link">Help & FAQs</a></li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#about" className="footer-link">About ResumeIQ</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms of Service</a></li>
              <li><a href="#security" className="footer-link">Security & Trust</a></li>
              <li><a href="#contact" className="footer-link">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ResumeIQ Inc. All rights reserved. Built with modern AI-driven intelligence.
          </div>
          <div className="footer-socials">
            {/* Social SVGs */}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
