import { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WebThreads from '../components/WebThreads/WebThreads';
import { Shield, Key, Mail, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

const AuthPage = () => {
  const { user, login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        const name = displayName.trim() || email.split('@')[0];
        await register(email, password, name);
      }
    } catch (err) {
      if (mode === 'login') {
        setError('Authentication failed: Incorrect email or password.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans overflow-hidden relative w-full selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── React Bits WebThreads Background Canvas ────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <WebThreads
          color1="#059669"
          color2="#10b981"
          color3="#0f172a"
          speed={0.25}
          threadCount={7}
          frequency={4.5}
          spread={0.22}
          glow={0.03}
          falloff={0.65}
          thickness={1.2}
          brightness={0.7}
          opacity={0.85}
          mouseInteraction={true}
          mouseStrength={0.4}
        />
      </div>

      {/* Subtle Hairline Grid Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15, 23, 42, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      {/* Main Form Container Card */}
      <main className="w-full max-w-md px-6 z-10 relative py-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 flex flex-col items-center border border-slate-200/80 shadow-2xl shadow-slate-900/10">
          {/* Logo Badge */}
          <Link to="/" className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 shadow-sm hover:scale-105 transition-transform">
            <Shield className="w-7 h-7 text-emerald-600" />
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center">
            {mode === 'login' ? 'Welcome Back to Varman' : 'Create Varman Account'}
          </h1>
          <p className="text-xs text-slate-500 mb-6 text-center font-medium mt-1">
            {mode === 'login' ? 'Sign in to access your protected image vault' : 'Register to start protecting your photos'}
          </p>

          {error && (
            <div className="w-full p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5" htmlFor="email">
                <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5" htmlFor="displayName">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" /> Display Name / Username
                </label>
                <input
                  type="text"
                  id="displayName"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  placeholder="Operator Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={100}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5" htmlFor="password">
                <Key className="w-3.5 h-3.5 text-emerald-600" /> Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-5 text-xs shadow-md"
              type="submit"
              disabled={loading}
            >
              {mode === 'login' ? <LogIn className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4 text-emerald-400" />}
              {mode === 'login'
                ? (loading ? 'Authenticating...' : 'Sign In to Dashboard')
                : (loading ? 'Registering...' : 'Create Account & Sign In')
              }
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-6 text-center">
              <p className="text-slate-500 text-xs font-medium mb-1">
                Don't have an account yet?
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-emerald-600 hover:text-emerald-700 transition-colors text-xs font-bold underline underline-offset-4"
              >
                Register a new account
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-slate-600 hover:text-slate-900 transition-colors text-xs font-semibold underline underline-offset-4"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AES-256 Client-Side Key Derivation Active
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
