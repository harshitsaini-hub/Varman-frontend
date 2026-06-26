import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container items-center justify-center" style={{ background: 'radial-gradient(circle at center, var(--bg-panel) 0%, var(--bg-dark) 100%)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div className="flex-col items-center justify-center mb-8 text-center">
          <Shield size={48} color="var(--accent-cyan)" style={{ marginBottom: '16px' }} />
          <h1 className="text-gradient" style={{ fontSize: '2rem', margin: 0 }}>Varman</h1>
          <p style={{ marginTop: '8px' }}>Adversarial AI Defense Engine</p>
        </div>

        {error && (
          <div className="badge badge-failed" style={{ display: 'block', padding: '12px', marginBottom: '24px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email Address" 
              style={{ paddingLeft: '44px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field" 
              placeholder="Password" 
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Authenticating...' : 'Establish Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
