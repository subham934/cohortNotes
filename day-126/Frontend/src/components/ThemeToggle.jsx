import React, { useEffect, useState } from 'react';

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'hacker');
  if (theme === 'hacker') root.classList.add('hacker');
  localStorage.setItem('theme', theme);
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (!saved || saved === 'light') return 'dark';
    return saved;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'hacker' : 'dark'));
  const isHacker = theme === 'hacker';

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggle}
      title={isHacker ? 'Switch to Dark Mode' : 'Switch to Hacker Mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        padding: 0,
        flexShrink: 0,
        borderRadius: '12px',
        border: isHacker
          ? '1px solid rgba(0,255,70,0.25)'
          : '1px solid rgba(255,255,255,0.08)',
        background: isHacker ? 'rgba(0,20,0,0.6)' : 'rgba(8,11,18,0.4)',
        color: isHacker ? '#00ff46' : '#31b8c6',
        cursor: 'pointer',
        transition:
          'background 0.2s, border-color 0.2s, box-shadow 0.2s, color 0.2s',
      }}
    >
      {isHacker ? (
        /* Terminal / hacker icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ) : (
        /* Moon icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
