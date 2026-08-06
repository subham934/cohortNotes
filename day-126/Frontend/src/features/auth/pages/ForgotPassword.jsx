import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../../../components/ThemeToggle';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { handleForgotPassword, clearError } = useAuth();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await handleForgotPassword({ email });
    setIsSubmitting(false);
    if (success) {
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-theme-bg text-theme-text overflow-hidden font-sans selection:bg-[#31b8c6] selection:text-stone-950 transition-colors duration-300">
      {/* Top left logo & name */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2 text-[#31b8c6] drop-shadow-[0_0_12px_rgba(49,184,198,0.25)] select-none">
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
          NexusAI
        </span>
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background Glows */}
      <div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#31b8c6]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-[#31b8c6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-theme-card border border-theme-border backdrop-blur-xl shadow-2xl shadow-[#31b8c6]/5 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#31b8c6] to-[#158f9c] mt-1">
            Reset Password
          </h2>
          <p className="text-theme-muted mt-2 text-sm leading-relaxed">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center select-none animate-fadeIn">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email-input" className="text-xs font-display font-semibold uppercase tracking-wider text-theme-muted mb-2 block cursor-pointer">
              Email Address
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
                className="w-full pl-10 pr-4 py-3 bg-theme-input border border-theme-border rounded-lg text-theme-text placeholder-theme-muted/50 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 font-display font-semibold rounded-lg shadow-lg active:scale-[0.98] transition-all duration-300 text-sm flex items-center justify-center gap-2
              ${isSubmitting 
                ? 'bg-[#31b8c6]/50 text-stone-950/70 cursor-not-allowed shadow-none' 
                : 'bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 cursor-pointer'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-stone-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-theme-muted">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-display font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ── CUSTOM SUCCESS EMAIL SENT MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div className="w-full max-w-md p-8 rounded-2xl bg-theme-card border border-theme-border shadow-2xl shadow-black/80 z-50 animate-scaleIn text-center mx-4">
            <div className="mx-auto w-16 h-16 bg-[#31b8c6]/10 border border-[#31b8c6]/20 rounded-full flex items-center justify-center text-[#31b8c6] mb-6 shadow-[0_0_20px_rgba(49,184,198,0.15)] animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#31b8c6] to-[#158f9c] mb-3">
              Reset Link Sent
            </h2>
            
            <p className="text-theme-text text-sm mb-4">
              We've sent a password recovery link to:
              <br />
              <strong className="text-[#31b8c6] break-all block mt-1.5 font-semibold">{email}</strong>
            </p>

            <p className="text-theme-muted text-xs mb-8 leading-relaxed font-normal">
              Please check your registered email inbox (and spam folder) and click the link to reset your password.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/login');
              }}
              className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-display font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
            >
              Got it, Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
