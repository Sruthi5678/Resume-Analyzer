import React, { useState } from 'react';
import { ChevronDown, TrendingUp, Key, Code, FileText, Sparkles, Check, X, Lightbulb } from 'lucide-react';

const RecommendationCard = ({ recommendation, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp size={18} />;
      case 'Key':
        return <Key size={18} />;
      case 'Code':
        return <Code size={18} />;
      case 'FileText':
        return <FileText size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'badge-rose';
      case 'medium':
        return 'badge-amber';
      case 'low':
        return 'badge-indigo';
      default:
        return 'badge-indigo';
    }
  };

  return (
    <div className={`recommendation-card ${isOpen ? 'is-open' : ''}`}>
      {/* Clickable Header */}
      <div
        className="rec-header-clickable"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="rec-title-wrap">
          <div className="rec-icon-bullet">
            {getIcon(recommendation.icon)}
          </div>
          <div>
            <h4 className="rec-heading-title">{recommendation.title}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Category: {recommendation.category}
            </span>
          </div>
        </div>

        <div className="rec-meta-badges">
          <span className={`badge ${getPriorityBadgeClass(recommendation.priority)}`}>
            {recommendation.priority} Priority
          </span>
          <ChevronDown className={`rec-chevron ${isOpen ? 'rotated' : ''}`} size={18} />
        </div>
      </div>

      {/* Expandable Details Content */}
      {isOpen && (
        <div className="rec-body-expanded">
          <p className="rec-desc-text">{recommendation.description}</p>

          {/* Before vs After Comparison Widget */}
          {recommendation.example && (
            <div className="comparison-box">
              <div className="comparison-header">
                Interactive AI Transformation Example
              </div>
              <div className="comparison-grid">
                <div className="comparison-col before">
                  <div className="comparison-tag">
                    <X size={14} />
                    <span>Before (Generic / Passive)</span>
                  </div>
                  <p className="comparison-quote">"{recommendation.example.before}"</p>
                </div>
                <div className="comparison-col after">
                  <div className="comparison-tag">
                    <Check size={14} />
                    <span>After (AI-Optimized & Measurable)</span>
                  </div>
                  <p className="comparison-quote">"{recommendation.example.after}"</p>
                </div>
              </div>
            </div>
          )}

          {recommendation.actionTip && (
            <div className="rec-action-tip">
              <Lightbulb size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#4F46E5' }} />
              <div>
                <strong>Actionable Formula: </strong>
                <span>{recommendation.actionTip}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
