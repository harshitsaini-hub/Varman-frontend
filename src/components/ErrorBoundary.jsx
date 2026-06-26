import React, { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleRestart = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="app-container items-center justify-center" 
          style={{ 
            minHeight: '100vh',
            width: '100vw',
            background: 'radial-gradient(circle at center, var(--bg-panel) 0%, var(--bg-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "var(--font-sans)",
            color: "var(--text-main)"
          }}
        >
          <div 
            className="glass-panel" 
            style={{ 
              maxWidth: '480px', 
              width: '90%', 
              textAlign: 'center',
              padding: '40px',
              border: '1px solid var(--accent-violet)',
              boxShadow: '0 0 30px var(--accent-violet-glow)'
            }}
          >
            <ShieldAlert size={56} color="var(--accent-violet)" style={{ margin: '0 auto 20px' }} />
            <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>System Crash Detected</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
              The Varman cockpit encountered an unexpected runtime failure. The security integrity of your active operations remains unaffected, but the interface requires a reload.
            </p>
            {this.state.error && (
              <div 
                style={{ 
                  textAlign: 'left', 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem', 
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-cyan)',
                  marginBottom: '24px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                {this.state.error.toString()}
              </div>
            )}
            <button 
              className="btn btn-primary" 
              onClick={this.handleRestart}
              style={{ 
                width: '100%', 
                gap: '10px', 
                borderColor: 'var(--accent-violet)', 
                color: '#fff',
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(0, 240, 255, 0.1))',
                boxShadow: '0 0 10px var(--accent-violet-glow)' 
              }}
            >
              <RefreshCw size={16} />
              <span>Restart Console</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
