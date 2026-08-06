import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const {user} = useSelector((state) => state.auth)
  const {loading} = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };

    await handleLogin(payload);
    navigate('/');
  };

  if(!loading && user){
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-stone-950 text-stone-100 overflow-hidden font-sans selection:bg-[#31b8c6] selection:text-stone-950">
      {/* Background Glows */}
      <div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#31b8c6]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-[#31b8c6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-stone-900/40 border border-stone-850 backdrop-blur-xl shadow-2xl shadow-[#31b8c6]/5 z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#31b8c6]">
            Welcome Back
          </h2>
          <p className="text-stone-400 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
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
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-[#31b8c6]/50 focus:border-[#31b8c6] transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#31b8c6] hover:bg-[#279ba7] text-stone-950 font-semibold rounded-lg shadow-lg shadow-[#31b8c6]/20 hover:shadow-[#31b8c6]/30 active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Live Binding State Visualizer */}
        {(email || password) && (
          <div className="mt-6 p-3 bg-stone-950/80 border border-stone-850 rounded-lg text-xs font-mono text-stone-400 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#31b8c6] tracking-wider mb-1">
              Live State Binding:
            </div>
            <div>
              email: <span className="text-stone-200">{email || '""'}</span>
            </div>
            <div>
              password:{' '}
              <span className="text-stone-200">
                {'*'.repeat(password.length) || '""'}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm">
          <p className="text-stone-400">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#31b8c6] hover:text-[#4ad2e0] font-semibold transition-colors duration-200 underline underline-offset-4"
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
