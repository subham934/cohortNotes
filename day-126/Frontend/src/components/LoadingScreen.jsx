import React, { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [isHacker, setIsHacker] = useState(
    () => document.documentElement.classList.contains('hacker')
  );
  const [dots, setDots] = useState('');

  // React to theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsHacker(document.documentElement.classList.contains('hacker'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Typewriter dots for hacker mode
  useEffect(() => {
    if (!isHacker) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [isHacker]);

  if (isHacker) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-theme-bg text-theme-text select-none relative overflow-hidden">
        <style>{`
          @keyframes hackerPulse {
            0%, 100% { text-shadow: 0 0 8px #00ff46, 0 0 20px #00ff46; opacity: 0.9; }
            50%       { text-shadow: 0 0 20px #00ff46, 0 0 60px #00ff46, 0 0 100px #00ff46; opacity: 1; }
          }
          @keyframes scanline {
            0%   { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes hackerBoot {
            0%   { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .hacker-glow { animation: hackerPulse 2s infinite ease-in-out; }
          .boot-line   { animation: hackerBoot 0.4s ease forwards; }
        `}</style>

        {/* Scanline effect */}
        <div
          className="pointer-events-none absolute inset-x-0 h-[2px] z-10"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(0,255,70,0.4), transparent)',
            animation: 'scanline 3s linear infinite',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #00ff46 0, #00ff46 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #00ff46 0, #00ff46 1px, transparent 0, transparent 50%)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {/* ASCII logo frame */}
          <pre
            className="text-[10px] leading-tight hacker-glow select-none"
            style={{ color: '#00ff46' }}
          >
{`  _   _ _____  _  ___   _  _____    _    ___ 
 | \\ | | ____|| |/ / | | |/ ____|  / \\  |_ _|
 |  \\| |  _|  | ' /| | | | (___   / _ \\  | | 
 | |\\  | |___ | . \\| |_| |\\___  \\/ ___ \\ | | 
 |_| \\_|_____||_|\\_\\ \\___/ |____/_/   \\_\\___|`}
          </pre>

          {/* Terminal boot text */}
          <div className="flex flex-col items-start gap-1 text-sm w-72" style={{ color: '#00cc38' }}>
            <span className="boot-line opacity-70">&gt; INITIALIZING NEXUS CORE SYSTEM...</span>
            <span className="boot-line opacity-70" style={{ animationDelay: '0.2s' }}>&gt; ESTABLISHING SECURE CHANNEL...</span>
            <span className="boot-line opacity-70" style={{ animationDelay: '0.4s' }}>&gt; LOADING NEURAL INTERFACE...</span>
            <span className="boot-line font-bold" style={{ color: '#00ff46', animationDelay: '0.6s' }}>
              &gt; READY{dots}
            </span>
          </div>

          {/* Blinking cursor bar */}
          <div
            className="w-2 h-5 rounded-sm"
            style={{
              background: '#00ff46',
              animation: 'hackerPulse 1s steps(1) infinite',
            }}
          />
        </div>
      </div>
    );
  }

  // Default (dark / light) loader
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-theme-bg text-theme-text font-sans select-none transition-colors duration-300">
      <style>{`
        @keyframes logoPulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            filter: drop-shadow(0 0 12px rgba(49,184,198,0.3)); 
            opacity: 0.7; 
          }
          50% { 
            transform: scale(1.15) rotate(90deg); 
            filter: drop-shadow(0 0 30px rgba(49,184,198,0.8)); 
            opacity: 1; 
          }
        }
        .animate-logoPulse {
          animation: logoPulse 2.5s infinite ease-in-out;
        }
      `}</style>
      <div className="flex flex-col items-center gap-6">
        {/* Animated Sparkle Logo */}
        <div className="animate-logoPulse text-[#31b8c6] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>

        {/* Text Details */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-2xl font-display font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#31b8c6] to-[#158f9c] drop-shadow-[0_2px_10px_rgba(49,184,198,0.1)]">
            NexusAI
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
