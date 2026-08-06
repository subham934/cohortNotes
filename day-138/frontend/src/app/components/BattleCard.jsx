import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const ScoreBadge = ({ score, isWinner }) => {
  const color = isWinner ? '#10b981' : '#64748b';
  const bg = isWinner ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.08)';
  const border = isWinner ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.15)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      background: bg, border: `1px solid ${border}`,
    }}>
      {isWinner && <span style={{ fontSize: 10 }}>🏆</span>}
      <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
        {score}/10
      </span>
    </div>
  );
};

const SolutionCard = ({ model, content, score, isWinner, delay }) => (
  <div
    className="animate-fade-up"
    style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      animationFillMode: 'forwards',
      background: 'rgba(10, 10, 22, 0.7)',
      backdropFilter: 'blur(16px)',
      border: `1px solid ${isWinner ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 16,
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      boxShadow: isWinner ? '0 0 0 1px rgba(16,185,129,0.06), 0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
    }}
  >
    {/* Top accent bar */}
    <div style={{
      height: 2,
      background: isWinner
        ? 'linear-gradient(90deg, #10b981, #34d399)'
        : 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))',
    }} />

    {/* Card header */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: isWinner ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.1)',
          border: `1px solid ${isWinner ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>🤖</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{model}</div>
          {isWinner && <div style={{ fontSize: 9, color: '#34d399', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>WINNER</div>}
        </div>
      </div>
      <ScoreBadge score={score} isWinner={isWinner} />
    </div>

    {/* Content */}
    <div style={{ padding: '16px 18px 18px' }}>
      <MarkdownRenderer content={content} />
    </div>
  </div>
);

const BattleCard = ({ data }) => {
  const { solution_1, solution_2, judge } = data;
  const s1 = judge?.solution_1_score ?? 10;
  const s2 = judge?.solution_2_score ?? 8;
  const r1 = judge?.solution_1_reasoning ?? '';
  const r2 = judge?.solution_2_reasoning ?? '';
  const aWins = s1 >= s2;

  return (
    <div id="battle-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Battle label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
        }}>⚔️</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          Battle Response
        </span>
      </div>

      {/* Side-by-side solutions */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        <SolutionCard model="Model A" content={solution_1} score={s1} isWinner={aWins} delay={0} />
        <SolutionCard model="Model B" content={solution_2} score={s2} isWinner={!aWins} delay={80} />
      </div>

      {/* Judge Verdict */}
      <div
        className="animate-fade-up"
        style={{
          animationDelay: '160ms', opacity: 0, animationFillMode: 'forwards',
          background: 'rgba(10, 8, 4, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(251,191,36,0.15)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
      >
        {/* Top accent */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(251,191,36,0.5), rgba(245,158,11,0.2), transparent)' }} />

        <div style={{ padding: '16px 20px 20px' }}>
          {/* Verdict header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>⚖️</span>
              <span className="gradient-text-gold" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Judge Verdict
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 9999,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}>
              <span style={{ fontSize: 11 }}>🏆</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                {aWins ? 'Model A' : 'Model B'} Wins
              </span>
            </div>
          </div>

          {/* Reasoning grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[{ label: 'Model A', reasoning: r1, score: s1, winner: aWins }, { label: 'Model B', reasoning: r2, score: s2, winner: !aWins }].map((item) => (
              <div key={item.label} style={{
                padding: '14px 16px', borderRadius: 12,
                background: item.winner ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${item.winner ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    {item.label} Analysis
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
                    color: item.winner ? '#34d399' : '#94a3b8',
                  }}>{item.score}/10</span>
                </div>
                <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{item.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleCard;
