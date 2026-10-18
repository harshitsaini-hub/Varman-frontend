import { useState, useEffect, useContext } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';
import WebThreads from '../components/WebThreads/WebThreads';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  AlertTriangle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

const AuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { user, login, register } = useContext(AuthContext);
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [forgotStep, setForgotStep] = useState(1); // 1: request OTP, 2: verify OTP + new password

  // Common inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Forgot password inputs
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // State
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [loading, setLoading] = useState(false);

  // Synchronize internal mode if initialMode prop changes (e.g. routing between /login and /forgot-password)
  useEffect(() => {
    setMode(initialMode);
    setError('');
    setSuccessBanner('');
    if (initialMode !== 'forgot') {
      setForgotStep(1);
    }
  }, [initialMode]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const switchToMode = (targetMode) => {
    setMode(targetMode);
    setError('');
    setSuccessBanner('');
    if (targetMode === 'forgot') {
      navigate('/forgot-password', { replace: true });
    } else {
      setForgotStep(1);
      navigate('/login', { replace: true });
    }
  };

  const handleLoginRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessBanner('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        const name = displayName.trim() || email.trim().split('@')[0];
        await register(email.trim(), password, name);
      }
    } catch (err) {
      if (mode === 'login') {
        if (err.response?.status === 401) {
          setError('Authentication failed: Incorrect email or password. Click "Create an account" if registering a new identity.');
        } else {
          setError(getErrorMessage(err, 'Authentication failed. Please check your credentials.'));
        }
      } else {
        if (err.response?.status === 409) {
          setError('An account with this email already exists. Please log in.');
        } else {
          setError(getErrorMessage(err, 'Registration failed. Please try again.'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessBanner('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password/request', {
        email: email.trim(),
      });
      setForgotStep(2);
      setCountdown(60);
      toast.success(res.data?.message || 'Verification code sent to your email.');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No account found with this email.');
      } else if (err.response?.status === 429) {
        setError(getErrorMessage(err, 'Too many requests. Please wait a moment before trying again.'));
      } else if (err.response?.status === 503) {
        const detail = err.response?.data?.detail;
        if (detail && typeof detail === 'string') {
          setError(`Service unavailable: ${detail}. In this environment, email delivery is unconfigured.`);
        } else {
          setError('Email service is not configured or temporarily unavailable on this deployment.');
        }
      } else {
        setError(getErrorMessage(err, 'Failed to send verification code. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessBanner('');

    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password/reset', {
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });

      // Clear reset state
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setPassword('');
      setForgotStep(1);
      setMode('login');
      navigate('/login', { replace: true });

      const msg = res.data?.message || 'Password updated. Please log in with your new password.';
      setSuccessBanner(msg);
      toast.success(msg);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to reset password. Please check your verification code.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans overflow-hidden relative w-full selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── React Bits WebThreads Background ─────────────────────────────── */}
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

      {/* ── Auth Card ───────────────────────────────────────────────────── */}
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
            {mode === 'login' && 'Sign In to Varman Protection Console'}
            {mode === 'register' && 'Create a fresh account to protect your photos'}
            {mode === 'forgot' && forgotStep === 1 && 'Reset your password with a 6-digit email code'}
            {mode === 'forgot' && forgotStep === 2 && 'Enter verification code and choose a new password'}
          </p>

          {/* Success Banner */}
          {successBanner && (
            <div className="w-full p-3.5 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="w-full p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          {/* ── LOGIN / REGISTER FORM ────────────────────────────────────── */}
          {mode !== 'forgot' && (
            <form onSubmit={handleLoginRegister} className="w-full space-y-4">
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
                  {mode === 'register' ? 'Password (minimum 8 characters)' : 'Password'}
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
                  <button
                    type="button"
                    onClick={() => switchToMode('forgot')}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer underline underline-offset-2"
                  >
                    Forgot Password?
                  </button>
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
          )}

          {/* ── FORGOT PASSWORD STEP 1: REQUEST OTP ──────────────────────── */}
          {mode === 'forgot' && forgotStep === 1 && (
            <form onSubmit={handleRequestOtp} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="forgotEmail">
                  Account Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="forgotEmail"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  We will send a 6-digit one-time verification code to this email address.
                </p>
              </div>

              <button
                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-5 text-xs"
                type="submit"
                disabled={loading}
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>

              <button
                type="button"
                onClick={() => switchToMode('login')}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1.5 mx-auto mt-4 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}

          {/* ── FORGOT PASSWORD STEP 2: VERIFY OTP & RESET ───────────────── */}
          {mode === 'forgot' && forgotStep === 2 && (
            <form onSubmit={handleResetPassword} className="w-full space-y-4">
              {/* Vault Warning Banner */}
              <div className="w-full p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800">Encrypted Vault Warning</p>
                  <p className="text-amber-700 mt-0.5">
                    Resetting your password will make any images previously stored in your encrypted vault inaccessible, because they are encrypted with your old password.
                  </p>
                </div>
              </div>

              {/* OTP Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700" htmlFor="otp">
                    6-Digit Verification Code
                  </label>
                  {countdown > 0 ? (
                    <span className="text-[11px] font-medium text-slate-500">
                      Resend in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      disabled={loading}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend Code
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    id="otp"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-sm font-mono tracking-widest text-center focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="newPassword">
                  New Password (minimum 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    title={showNewPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-10 text-slate-900 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-4 text-xs"
                type="submit"
                disabled={loading}
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                {loading ? 'Resetting Password...' : 'Reset Password & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => switchToMode('login')}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1.5 mx-auto mt-4 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}

          {/* Mode Switch Footer */}
          {mode !== 'forgot' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-6 pt-6 border-t border-slate-100 w-full justify-center">
              <span>{mode === 'login' ? 'New to Varman?' : 'Already have an account?'}</span>
              <button
                type="button"
                onClick={() => switchToMode(mode === 'login' ? 'register' : 'login')}
                className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4 ml-1"
              >
                {mode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
