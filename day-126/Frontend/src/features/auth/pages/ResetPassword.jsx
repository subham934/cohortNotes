import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../../../components/ThemeToggle';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { handleResetPassword, clearError } = useAuth();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!token) {
      setLocalError('Reset token is missing from the URL.');
      return;
    }

    setIsSubmitting(true);
    const success = await handleResetPassword({ token, password });
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
            New Password
          </h2>
          <p className="text-theme-muted mt-2 text-sm leading-relaxed">
            Please enter and confirm your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {(localError || error) && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center select-none animate-fadeIn">
              {localError || error}
            </div>
          )}

          {/* Password Input */}
          <div>
            <label htmlFor="password-input" className="text-xs font-display font-semibold uppercase tracking-wider text-theme-muted mb-2 block cursor-pointer">
              New Password
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
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-theme-input border border-theme-border rounded-lg text-theme-text placeholder-theme-muted/50 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password-input" className="text-xs font-display font-semibold uppercase tracking-wider text-theme-muted mb-2 block cursor-pointer">
              Confirm Password
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                id="confirm-password-input"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
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
                Saving Password...
              </>
            ) : (
              'Save New Password'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-theme-muted">
            Go back to{' '}
            <Link
              to="/login"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-display font-semibold transition-colors duration-200 underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ── CUSTOM SUCCESS RESET PASSWORD MODAL ── */}
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
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-2xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#31b8c6] to-[#158f9c] mb-3">
              Reset Successful!
            </h2>
            
            <p className="text-theme-text text-sm mb-4 font-normal">
              Your password has been successfully updated.
            </p>

            <p className="text-theme-muted text-xs mb-8 leading-relaxed">
              You can now sign in to your NexusAI account with your new password.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/login');
              }}
              className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-display font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm font-bold"
            >
              Sign In Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
