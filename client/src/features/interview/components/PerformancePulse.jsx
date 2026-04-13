import React from 'react';

const STATUS_CONFIG = {
  strong:     { label: 'Strong',     color: 'var(--color-text-success, #10B981)', arrow: '↑' },
  'on-track': { label: 'On track',   color: 'var(--color-text-warning, #F59E0B)', arrow: '→' },
  'needs-work':{ label: 'Needs work',color: 'var(--color-text-danger, #EF4444)',  arrow: '↓' },
  neutral:    { label: '',           color: 'transparent',               arrow: ''  },
};

const PerformancePulse = ({ history, performanceStatus }) => {
  // Don't show anything until there are at least 2 scored answers
  if (!history || history.length < 2) return null;

  const cfg = STATUS_CONFIG[performanceStatus] ?? STATUS_CONFIG.neutral;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 500,
      color: cfg.color,
      transition: 'color 0.4s ease',
    }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: cfg.color,
          display: 'inline-block',
        }}
      />
      <span>{cfg.label}</span>
      <span style={{ fontSize: 14 }}>{cfg.arrow}</span>
    </div>
  );
};

export default PerformancePulse;
