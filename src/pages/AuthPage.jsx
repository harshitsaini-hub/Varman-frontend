import { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WebThreads from '../components/WebThreads/WebThreads';
import { Shield, Lock, Mail, User as UserIcon, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const { user, login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
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
        setError('Authentication failed: Incorrect email or password. Click "Create an account" if registering a new identity.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans overflow-hidden relative w-full selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── React Bits WebThreads (Waves / Lines Background) ─────────────── */}
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

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15, 23, 42, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      {/* ── MaterialM Auth Card ─────────────────────────────────────────── */}
      <main className="w-full max-w-md px-6 z-10 relative py-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-900/10 flex flex-col items-center">
          {/* Brand Logo & Header */}
          <Link to="/" className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">VARMAN</span>
          </Link>

          <p className="text-xs text-slate-500 mb-6 text-center font-medium">
            {mode === 'login' ? 'Sign In to Varman Protection Console' : 'Create a fresh account to protect your photos'}
          </p>

          {error && (
            <div className="w-full p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="displayName">
                  Full Name / Alias
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="displayName"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    placeholder="Operator Alias"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={100}
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  Remember this Device
                </label>
                <span className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">
                  Forgot Password?
                </span>
              </div>
            )}

            <button
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-5 text-xs"
              type="submit"
              disabled={loading}
            >
              {mode === 'login' ? <LogIn className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4 text-emerald-400" />}
              {mode === 'login'
                ? (loading ? 'Signing in...' : 'Sign In')
                : (loading ? 'Creating Account...' : 'Create Account & Sign In')
              }
            </button>
          </form>

          {/* Mode Switch Footer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-6 pt-6 border-t border-slate-100 w-full justify-center">
            <span>{mode === 'login' ? 'New to Varman?' : 'Already have an account?'}</span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4 ml-1"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
