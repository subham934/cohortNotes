import React, { useRef, useEffect } from 'react';

const InputArea = ({ input, setInput, onSend, onKeyDown, isLoading }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.min(ref.current.scrollHeight, 130) + 'px';
    }
  }, [input]);

  return (
    <div style={{
      padding: '16px 32px 24px',
      maxWidth: 960, margin: '0 auto', width: '100%',
      flexShrink: 0,
    }}>
      {/* Glass input container */}
      <div
        className="input-glow"
        style={{
          display: 'flex', flexDirection: 'column', gap: 0,
          background: 'rgba(10, 10, 22, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.25s',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}
      >
        <textarea
          ref={ref}
          id="chat-input"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          placeholder="Enter a coding problem to battle..."
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', width: '100%',
            padding: '16px 18px 0',
            fontSize: 14, color: '#e2e8f0', lineHeight: 1.6,
            fontFamily: 'inherit',
            maxHeight: 130,
          }}
        />

        {/* Bottom toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px 12px',
        }}>
          <span style={{ fontSize: 11, color: '#1e293b', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
            ↵ Enter to send &nbsp;·&nbsp; Shift+↵ for new line
          </span>

          <button
            id="battle-btn"
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className="btn-primary"
            style={{
              padding: '8px 20px', borderRadius: 10, border: 'none',
              color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              opacity: (isLoading || !input.trim()) ? 0.4 : 1,
              pointerEvents: (isLoading || !input.trim()) ? 'none' : 'auto',
            }}
          >
            {isLoading ? (
              <>
                <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Battling
              </>
            ) : (
              <> ⚡ Battle </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
