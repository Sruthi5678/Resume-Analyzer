import React from 'react';
import { BarChart3, Target, Brain, Search, CheckCircle2 } from 'lucide-react';

const FeatureCard = ({ iconName, title, description, badge, highlightPoints = [] }) => {
  const renderIcon = () => {
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 size={24} />;
      case 'Target':
        return <Target size={24} />;
      case 'Brain':
        return <Brain size={24} />;
      case 'Search':
        return <Search size={24} />;
      default:
        return <Brain size={24} />;
    }
  };

  return (
    <div className="card card-glow feature-card-item" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div className="logo-icon-wrapper" style={{ width: '3rem', height: '3rem', borderRadius: '12px' }}>
          {renderIcon()}
        </div>
        {badge && (
          <span className="badge badge-gradient">
            {badge}
          </span>
        )}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
        {description}
      </p>

      {highlightPoints.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          {highlightPoints.map((point, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeatureCard;
