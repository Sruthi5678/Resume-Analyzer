import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  BarChart3,
  Award,
  FileText,
  Clock,
  LogOut,
  Edit3,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import EditProfileModal from '../components/EditProfileModal';
import { mockUserProfile } from '../data/mockData';

const Profile = () => {
  const { user, logout, setCurrentAnalysis } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profile = user || mockUserProfile;
  const stats = profile.stats || {
    resumesAnalyzed: 3,
    avgScore: 78,
    bestScore: 86
  };
  const history = profile.history && profile.history.length > 0 ? profile.history : mockUserProfile.history;

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const handleViewHistoricalReport = (item) => {
    // Load historical item as current analysis
    addToast(`Viewing report for "${item.filename}"`, 'info');
    navigate('/dashboard');
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-user-info-wrap">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="profile-avatar-large"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {profile.name ? profile.name[0] : 'U'}
              </div>
            )}

            <div className="profile-details-column">
              <h1 className="profile-full-name">{profile.name}</h1>
              <div className="profile-email-badge">
                <Mail size={15} />
                <span>{profile.email}</span>
              </div>
              <div className="profile-meta-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Briefcase size={14} color="#6366F1" />
                  {profile.role || 'Software Engineer'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} color="#6366F1" />
                  {profile.location || 'San Francisco, CA'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} color="#6366F1" />
                  Member since {profile.joinedDate || 'January 2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-action-buttons">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Statistics 3-Card Grid */}
        <div className="profile-stats-grid">
          {/* Card 1: Resumes Analyzed */}
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper indigo">
              <FileText size={24} />
            </div>
            <div className="profile-stat-info">
              <span className="profile-stat-number">{stats.resumesAnalyzed || 3}</span>
              <span className="profile-stat-title">Resumes Analyzed</span>
            </div>
          </div>

          {/* Card 2: Average Resume Score */}
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper purple">
              <BarChart3 size={24} />
            </div>
            <div className="profile-stat-info">
              <span className="profile-stat-number">{stats.avgScore || 78}</span>
              <span className="profile-stat-title">Average Resume Score</span>
            </div>
          </div>

          {/* Card 3: Best Score */}
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper emerald">
              <Award size={24} />
            </div>
            <div className="profile-stat-info">
              <span className="profile-stat-number">{stats.bestScore || 86}</span>
              <span className="profile-stat-title">Best Score</span>
            </div>
          </div>
        </div>

        {/* Analysis History Section */}
        <div className="profile-history-card">
          <div className="profile-history-header">
            <h3 className="profile-history-title">
              <Clock size={20} color="#4F46E5" />
              <span>Recent Resume Audits & History</span>
            </h3>
            <Link to="/upload" className="btn btn-primary btn-sm">
              <Sparkles size={14} />
              <span>Analyze New Resume</span>
            </Link>
          </div>

          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Resume File</th>
                  <th>Target Role</th>
                  <th>Audit Date</th>
                  <th>Overall Score</th>
                  <th>ATS Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="history-filename-cell">
                        <FileText size={18} color="#4F46E5" />
                        <span>{item.filename}</span>
                      </div>
                    </td>
                    <td>{item.type || 'General'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.date}</td>
                    <td>
                      <strong style={{ fontSize: '1.1rem', color: item.score >= 80 ? '#059669' : item.score >= 70 ? '#4F46E5' : '#D97706' }}>
                        {item.score}/100
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${item.score >= 80 ? 'badge-emerald' : item.score >= 70 ? 'badge-indigo' : 'badge-amber'}`}>
                        {item.status || 'Good'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewHistoricalReport(item)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--primary-600)', fontWeight: 700 }}
                      >
                        View Report &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
