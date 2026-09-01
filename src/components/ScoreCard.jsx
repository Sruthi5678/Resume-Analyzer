import React from 'react';
import { Target, Search, BarChart3, Layout, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

const ScoreCard = ({ label, score, status, description, color = 'indigo' }) => {
  const getIcon = () => {
    switch (label) {
      case 'ATS Compatibility':
        return <Target size={20} />;
      case 'Skills Match':
        return <Search size={20} />;
      case 'Keyword Optimization':
        return <BarChart3 size={20} />;
      case 'Resume Structure':
        return <Layout size={20} />;
      default:
        return <Target size={20} />;
    }
  };

  const getProgressColor = () => {
    switch (color) {
      case 'purple':
        return 'linear-gradient(90deg, #8B5CF6, #A855F7)';
      case 'cyan':
        return 'linear-gradient(90deg, #06B6D4, #3B82F6)';
      case 'emerald':
        return 'linear-gradient(90deg, #10B981, #059669)';
      default:
        return 'linear-gradient(90deg, #4F46E5, #6366F1)';
    }
  };

  const getBadgeClass = () => {
    if (score >= 85) return 'badge-emerald';
    if (score >= 70) return 'badge-indigo';
    return 'badge-amber';
  };

  return (
    <div className="metric-card">
      <div>
        <div className="metric-card-header">
          <span className="metric-label">{label}</span>
          <div className={`metric-icon-box ${color}`}>
            {getIcon()}
          </div>
        </div>

        <div className="metric-score-row">
          <span className="metric-score-val">{score}</span>
          <span className="metric-score-percent">%</span>
          <span className={`badge ${getBadgeClass()}`} style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
            {status}
          </span>
        </div>

        <div className="metric-mini-bar">
          <div
            className="metric-mini-fill"
            style={{
              width: `${score}%`,
              background: getProgressColor()
            }}
          />
        </div>
      </div>

      <p className="metric-desc">{description}</p>
    </div>
  );
};

export default ScoreCard;
