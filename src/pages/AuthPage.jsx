import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LiquidEther from '../components/LiquidEther';

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
    
    // Technical identification format check (RFC 5322 Standard Regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid technical identifier format (valid email address required).');
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
        setError('Authentication failed: Email or password incorrect.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#09090b] text-on-surface min-h-screen flex items-center justify-center font-body overflow-hidden relative w-full">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
        <LiquidEther
          colors={[ '#00f0ff', '#1e293b', '#7c3aed', '#0284c7' ]}
          mouseForce={35}
          cursorSize={110}
          isViscous={false}
          viscous={25}
          iterationsViscous={15}
          iterationsPoisson={20}
          resolution={0.3}
          isBounce
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.0}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          BFECC={true}
        />
      </div>

      {/* Hairline Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-4" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <main className="w-full max-w-md px-6 z-10 relative">
        <div className="glass-panel rounded-2xl p-8 sm:p-10 flex flex-col items-center border border-white/10 bg-surface-container-high/70 backdrop-blur-2xl shadow-2xl">
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(0,240,255,0.1)] relative">
            <div className="absolute inset-0 rounded-xl border border-neon-cyan/30 animate-pulse opacity-40"></div>
            <span className="material-symbols-outlined text-neon-cyan text-2xl">shield</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase mb-1 text-center">VARMAN</h1>
          <p className="font-code-snippet text-xs text-on-surface-variant/80 mb-6 text-center uppercase tracking-wider">
            {mode === 'login' ? 'Secure Authentication Protocol' : 'Identity Registration Protocol'}
          </p>

          {error && (
            <div className="w-full p-3.5 mb-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-code-snippet text-center leading-normal">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <label className="font-code-snippet text-[11px] text-on-surface-variant/90 flex items-center gap-1.5 font-medium tracking-wider uppercase" htmlFor="email">
                <span className="material-symbols-outlined text-[13px] text-neon-cyan">alternate_email</span> Email Identifier
              </label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 text-white font-code-snippet text-xs focus:outline-none transition-all placeholder:text-white/20 focus:border-neon-cyan/80 focus:ring-1 focus:ring-neon-cyan/40" 
                placeholder="operator@varman.sys" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="font-code-snippet text-[11px] text-on-surface-variant/90 flex items-center gap-1.5 font-medium tracking-wider uppercase" htmlFor="displayName">
                  <span className="material-symbols-outlined text-[13px] text-neon-cyan">badge</span> Operator Alias (Username)
                </label>
                <input 
                  type="text" 
                  id="displayName" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 text-white font-code-snippet text-xs focus:outline-none transition-all placeholder:text-white/20 focus:border-neon-cyan/80 focus:ring-1 focus:ring-neon-cyan/40" 
                  placeholder="kagenou" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={100}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-code-snippet text-[11px] text-on-surface-variant/90 flex items-center gap-1.5 font-medium tracking-wider uppercase" htmlFor="password">
                <span className="material-symbols-outlined text-[13px] text-neon-cyan">key</span> Access Password
              </label>
              <input 
                type="password" 
                id="password" 
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 text-white font-code-snippet text-xs focus:outline-none transition-all placeholder:text-white/20 focus:border-neon-cyan/80 focus:ring-1 focus:ring-neon-cyan/40" 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button 
              className="w-full bg-neon-cyan text-black font-semibold py-3.5 rounded-lg hover:bg-neon-cyan/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-5 text-xs tracking-wider font-code-snippet uppercase border border-neon-cyan" 
              type="submit"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-[16px]">{mode === 'login' ? 'login' : 'person_add'}</span>
              {mode === 'login' 
                ? (loading ? 'AUTHENTICATING...' : 'ESTABLISH SESSION') 
                : (loading ? 'REGISTERING...' : 'REGISTER & LOGIN')
              }
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-5 text-center">
              <p className="text-on-surface-variant/60 text-[11px] font-code-snippet uppercase tracking-wider mb-1.5">
                No access credentials?
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-neon-cyan hover:text-white transition-colors text-xs font-code-snippet uppercase tracking-wider underline decoration-neon-cyan/40 hover:decoration-white"
              >
                Register to Varman
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-on-surface-variant/80 hover:text-white transition-colors text-xs font-code-snippet uppercase tracking-wider underline"
              >
                Back to Login
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 font-code-snippet text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_6px_#00f0ff]"></span>
            Encryption Core Online
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
