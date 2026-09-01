import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, BarChart3, FileUp, Briefcase, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="logo-icon-wrapper">
            <Sparkles size={20} />
          </div>
          <span>Resume<span className="gradient-text">IQ</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Upload Resume
              </NavLink>
              <NavLink
                to="/job-match"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Job Match
              </NavLink>
            </>
          ) : (
            <>
              <a href="/#features" className="nav-link">Features</a>
              <a href="/#how-it-works" className="nav-link">How It Works</a>
              <a href="/#preview" className="nav-link">Live Preview</a>
            </>
          )}
        </div>

        {/* Desktop Auth / User Actions */}
        <div className="desktop-auth-actions nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="user-menu-btn" title="View Profile">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4F46E5' }}>
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                )}
                <span className="user-name-label">{user?.name || 'User'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                <span>Get Started</span>
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer open">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <Link to="/upload" className="nav-link" onClick={closeMobileMenu}>
                Upload Resume
              </Link>
              <Link to="/job-match" className="nav-link" onClick={closeMobileMenu}>
                Job Match
              </Link>
              <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
                Profile ({user?.name})
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <a href="/#features" className="nav-link" onClick={closeMobileMenu}>
                Features
              </a>
              <a href="/#how-it-works" className="nav-link" onClick={closeMobileMenu}>
                How It Works
              </a>
              <a href="/#preview" className="nav-link" onClick={closeMobileMenu}>
                Live Preview
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={closeMobileMenu}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
