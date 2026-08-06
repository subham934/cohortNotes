import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { MatrixRain } from '../../../components/MatrixRain';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleLogin, clearError } = useAuth();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isHacker, setIsHacker] = useState(() =>
    document.documentElement.classList.contains('hacker')
  );

  useEffect(() => {
    clearError();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password });
    if (success) navigate('/');
  };

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-theme-bg text-theme-text overflow-hidden font-sans transition-colors duration-300"
      style={{
        fontFamily: isHacker ? "'Share Tech Mono', monospace" : undefined,
      }}
    >
      {/* Matrix rain in hacker mode */}
      {isHacker && <MatrixRain />}

      {/* Top left logo */}
      <div
        className="absolute top-5 left-5 z-20 flex items-center gap-2 select-none text-theme-accent"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(var(--theme-accent-rgb), 0.3))',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
        <span className="text-lg font-display font-extrabold tracking-tight">
          {isHacker ? '> NexusAI' : 'NexusAI'}
        </span>
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background Glows (hidden in hacker — matrix does the job) */}
      {!isHacker && (
        <>
          <div
            className="absolute -top-48 -left-48 w-[32rem] h-[32rem] rounded-full blur-[120px] pointer-events-none"
            style={{ background: 'rgba(var(--theme-accent-rgb), 0.12)' }}
          />
          <div
            className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] rounded-full blur-[120px] pointer-events-none"
            style={{ background: 'rgba(var(--theme-accent-rgb), 0.08)' }}
          />
        </>
      )}

      {/* Card */}
      <div
        className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-theme-card border border-theme-border backdrop-blur-xl shadow-2xl z-10 transition-all duration-300"
        style={{
          boxShadow: `0 25px 50px -12px rgba(var(--theme-accent-rgb), 0.08)`,
        }}
      >
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-display font-extrabold tracking-tight mt-1 text-theme-accent"
            style={
              isHacker ? { textShadow: '0 0 20px rgba(0,255,70,0.5)' } : {}
            }
          >
            {isHacker ? '> Welcome Back' : 'Welcome Back'}
          </h2>
          <p className="text-theme-muted mt-2 text-sm">
            {isHacker
              ? '// Sign in to access your dashboard'
              : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center select-none animate-fadeIn">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email-input" className="text-xs font-display font-semibold uppercase tracking-wider text-theme-muted mb-2 block cursor-pointer">
              {isHacker ? '// Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-theme-muted pointer-events-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-theme-input border border-theme-border rounded-lg text-theme-text placeholder-theme-muted/50 focus:outline-none transition-all duration-300 text-sm"
                style={{
                  '--tw-ring-color': 'rgba(var(--theme-accent-rgb), 0.4)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--theme-accent)';
                  e.target.style.boxShadow =
                    '0 0 0 2px rgba(var(--theme-accent-rgb), 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password-input" className="text-xs font-display font-semibold uppercase tracking-wider text-theme-muted block cursor-pointer">
                {isHacker ? '// Password' : 'Password'}
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold transition-colors duration-200 text-theme-accent hover:opacity-80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-theme-muted pointer-events-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-theme-input border border-theme-border rounded-lg text-theme-text placeholder-theme-muted/50 focus:outline-none transition-all duration-300 text-sm"
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--theme-accent)';
                  e.target.style.boxShadow =
                    '0 0 0 2px rgba(var(--theme-accent-rgb), 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 font-display font-semibold rounded-lg shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm text-theme-bg"
            style={{
              background: 'var(--theme-accent)',
              boxShadow: `0 10px 25px -5px rgba(var(--theme-accent-rgb), 0.3)`,
              fontFamily: isHacker ? "'Share Tech Mono', monospace" : undefined,
              textShadow: isHacker ? 'none' : undefined,
            }}
          >
            {isHacker ? '> Sign In' : 'Sign In'}
          </button>
        </form>

        {/* Live State Visualizer */}
        {(email || password) && (
          <div className="mt-6 p-3 bg-theme-input border border-theme-border rounded-lg text-xs font-mono text-theme-muted space-y-1">
            <div className="text-[10px] uppercase font-bold text-theme-accent tracking-wider mb-1">
              Live State Binding:
            </div>
            <div>
              email: <span className="text-theme-text">{email || '""'}</span>
            </div>
            <div>
              password:{' '}
              <span className="text-theme-text">
                {'*'.repeat(password.length) || '""'}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm">
          <p className="text-theme-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-display font-semibold transition-colors duration-200 underline underline-offset-4 text-theme-accent hover:opacity-80"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
