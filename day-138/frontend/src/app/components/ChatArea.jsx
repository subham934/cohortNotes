import React, { useEffect, useRef } from 'react';
import BattleCard from './BattleCard';

const CHIPS = [
  { label: 'Factorial function in JS', icon: '⚡' },
  { label: 'Binary search in Python', icon: '🔍' },
  { label: 'React custom hook pattern', icon: '⚛️' },
  { label: 'Optimize a SQL JOIN query', icon: '🗄️' },
];

const Welcome = ({ onChipClick }) => (
  <div className="animate-fade-up" style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center', padding: '80px 40px',
    flex: 1,
  }}>
    {/* Animated icon */}
    <div style={{ position: 'relative', marginBottom: 32 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(109,40,217,0.2), rgba(79,70,229,0.1))',
        border: '1px solid rgba(139,92,246,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 30, backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(109,40,217,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>⚔️</div>
      {/* Pulsing ring */}
      <div style={{
        position: 'absolute', inset: -6, borderRadius: 26,
        border: '1px solid rgba(139,92,246,0.15)',
        animation: 'pulse 3s ease-in-out infinite',
      }} />
    </div>

    <h2 className="gradient-text" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
      AI Battle Arena
    </h2>
    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, maxWidth: 380, marginBottom: 36 }}>
      Submit any coding challenge and watch two AI models go head-to-head. An independent judge scores both solutions.
    </p>

    {/* Chips */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {CHIPS.map((c) => (
        <button
          key={c.label}
          onClick={() => onChipClick(c.label)}
          style={{
            padding: '9px 16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#94a3b8', fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
            e.currentTarget.style.color = '#c7d2fe';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <span>{c.icon}</span>
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const LoadingDots = () => (
  <div className="animate-fade-up" style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(15,15,30,0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14, padding: '12px 18px', width: 'fit-content',
  }}>
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="typing-dot" style={{
          width: 7, height: 7, borderRadius: '50%', display: 'block',
          background: i === 0 ? '#818cf8' : i === 1 ? '#a78bfa' : '#c4b5fd',
        }} />
      ))}
    </div>
    <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
      AIs are battling · judge is scoring...
    </span>
  </div>
);

const ChatArea = ({ messages, isLoading, onChipClick }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div id="chat-area" style={{
      flex: 1, overflowY: 'auto', width: '100%',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 32px 0', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {messages.length === 0 && !isLoading ? (
          <Welcome onChipClick={onChipClick} />
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={msg.id} style={{ animationDelay: `${idx * 40}ms` }}>
                {msg.type === 'user' && (
                  <div className="animate-slide-right" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      maxWidth: '65%',
                      background: 'rgba(99,102,241,0.08)',
                      border: '1px solid rgba(99,102,241,0.15)',
                      borderRadius: '18px 18px 4px 18px',
                      padding: '14px 18px',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 6 }}>
                        ⚡ Your Challenge
                      </div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6 }}>{msg.text}</div>
                    </div>
                  </div>
                )}
                {msg.type === 'battle' && (
                  <div className="animate-fade-up">
                    <BattleCard data={msg.data} />
                  </div>
                )}
                {msg.type === 'error' && (
                  <div className="animate-fade-up" style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 12, color: '#fca5a5', fontSize: 13,
                  }}>
                    <span>⚠️</span> {msg.text}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <LoadingDots />}
          </>
        )}
        <div ref={bottomRef} style={{ height: 32 }} />
      </div>
    </div>
  );
};

export default ChatArea;
