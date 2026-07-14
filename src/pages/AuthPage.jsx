import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LiquidEther from '../components/LiquidEther';

const AuthPage = () => {
  const { user, login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
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
      setError('Invalid technical identifier format (valid email signature required).');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        const displayName = email.split('@')[0];
        await register(email, password, displayName);
      }
    } catch (err) {
      if (mode === 'login') {
        setFailedAttempts(prev => prev + 1);
        setError('user not registered/ password or email is wrong');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center font-body-lg overflow-hidden relative w-full" style={{ backgroundColor: '#0a0c16' }}>
      {/* Dynamic Liquid Ether Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-45">
        <LiquidEther
          colors={[ '#00f0ff', '#00dbe9', '#bd00ff', '#a5f3fc' ]}
          mouseForce={50}
          cursorSize={120}
          isViscous={false}
          viscous={30}
          iterationsViscous={20}
          iterationsPoisson={28}
          resolution={0.35}
          isBounce
          autoDemo={true}
          autoSpeed={0.95}
          autoIntensity={3.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          BFECC={true}
        />
      </div>

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 219, 233, 0.2)" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <main className="w-full max-w-md px-6 z-10 relative">
        <div className="glass-panel rounded-xl p-8 sm:p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-high border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,219,233,0.1)] relative">
            <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>

          <h1 className="font-headline-lg-mobile sm:font-headline-lg text-gradient tracking-tighter uppercase mb-2 text-center">VARMAN</h1>
          <p className="font-code-snippet text-code-snippet text-on-surface-variant mb-8 text-center uppercase tracking-widest">
            {mode === 'login' ? 'Secure Access Protocol' : 'Identity Registration Protocol'}
          </p>

          {error && (
            <div className="w-full p-4 mb-6 bg-error/10 border border-error/20 text-error rounded text-xs font-code-snippet text-center leading-normal">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2 text-xs font-semibold tracking-wider" htmlFor="email">
                <span className="material-symbols-outlined text-[14px]">terminal</span> Technical Identification
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-surface-container-highest border border-outline-variant rounded py-3 px-4 text-on-surface font-code-snippet text-sm focus:outline-none input-glow transition-all placeholder:text-on-surface-variant/30 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan" 
                  placeholder="admin@varman.sys" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2 text-xs font-semibold tracking-wider" htmlFor="password">
                <span className="material-symbols-outlined text-[14px]">key</span> Cryptographic Access
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  id="password" 
                  className="w-full bg-surface-container-highest border border-outline-variant rounded py-3 px-4 text-on-surface font-code-snippet text-sm focus:outline-none input-glow transition-all placeholder:text-on-surface-variant/30 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan" 
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              className="w-full bg-primary-container text-on-primary-container font-semibold py-4 rounded hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 text-xs tracking-widest" 
              type="submit"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-[16px]">{mode === 'login' ? 'login' : 'person_add'}</span>
              {mode === 'login' 
                ? (loading ? 'AUTHENTICATING...' : 'ESTABLISH LINK') 
                : (loading ? 'REGISTERING...' : 'REGISTER & ESTABLISH LINK')
              }
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-6 text-center">
              <p className="text-on-surface-variant/50 text-[10px] font-code-snippet uppercase tracking-widest mb-2">
                No access credentials?
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-neon-cyan hover:text-white transition-colors text-xs font-code-snippet uppercase tracking-widest underline decoration-neon-cyan/40 hover:decoration-white"
              >
                Register to Varman
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
                className="text-on-surface-variant hover:text-white transition-colors text-[10px] font-code-snippet uppercase tracking-widest underline"
              >
                Back to Secure Access
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 font-code-snippet text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_5px_rgba(0,240,255,0.5)]"></span>
            Node Network Secure
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
