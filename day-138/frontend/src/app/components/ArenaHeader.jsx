import React from 'react';

const ArenaHeader = ({ isLoading }) => {
  return (
    <header style={{
      height: 60,
      minHeight: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      background: 'rgba(3, 7, 18, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Arena Chat
        </span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 10px', borderRadius: 9999,
          background: isLoading ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
          border: `1px solid ${isLoading ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isLoading ? '#f59e0b' : '#10b981',
            boxShadow: isLoading ? '0 0 8px rgba(245,158,11,0.6)' : '0 0 8px rgba(16,185,129,0.6)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace',
            color: isLoading ? '#fbbf24' : '#34d399',
          }}>
            {isLoading ? 'Processing' : 'Active'}
          </span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          id="settings-btn"
          title="Settings"
          style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#64748b', cursor: 'pointer', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#a5b4fc'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748b'; }}
        >
          ⚙
        </button>
      </div>

      {/* Bottom shimmer line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
      }} />
    </header>
  );
};

export default ArenaHeader;
