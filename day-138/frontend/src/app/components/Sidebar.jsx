import React from 'react';

const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Sidebar = ({ history, activeHistoryId, onNewBattle, onSelectHistory }) => {
  return (
    <aside style={{
      width: 256,
      minWidth: 256,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(5, 5, 16, 0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            boxShadow: '0 4px 16px rgba(109,40,217,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, flexShrink: 0,
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', letterSpacing: '0.02em' }}>Arena</div>
            <div style={{ fontSize: 10, color: '#6366f1', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Battle</div>
          </div>
        </div>
      </div>

      {/* New Session */}
      <div style={{ padding: '16px 16px 8px' }}>
        <button
          id="btn-new-battle"
          onClick={onNewBattle}
          className="btn-primary"
          style={{
            width: '100%', padding: '10px 16px', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 600, border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'inherit', letterSpacing: '0.02em',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1, marginBottom: 1 }}>+</span>
          New Session
        </button>
      </div>

      {/* History */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 6px', fontFamily: 'monospace' }}>
          History
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {history.map((item) => {
            const isActive = activeHistoryId === item.id;
            return (
              <button
                key={item.id}
                id={`history-item-${item.id}`}
                onClick={() => onSelectHistory(item.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '9px 10px',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                  transition: 'all 0.18s ease', fontFamily: 'inherit',
                  borderLeft: isActive ? '2px solid rgba(99,102,241,0.6)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isActive ? '#a5b4fc' : '#64748b' }}>
                  <HistoryIcon />
                  <span style={{ fontSize: 12.5, color: isActive ? '#e2e8f0' : '#94a3b8', fontWeight: isActive ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {item.title}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2, paddingLeft: 22, fontFamily: 'monospace' }}>{item.time}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(109,40,217,0.3)',
        }}>D</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>Developer</div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Free Tier</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
