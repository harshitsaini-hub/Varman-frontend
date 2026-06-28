import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ForensicPage from './pages/ForensicPage';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="app-container items-center justify-center text-neon-cyan font-code-snippet">Verifying Authentication...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="flex-1 md:pl-64 min-h-[calc(100vh-64px)] w-full relative">
          {children}
        </div>
      </div>
    </>
  );
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="app-container items-center justify-center text-neon-cyan font-code-snippet">Initializing System...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
      <Route path="/forensic" element={<ProtectedRoute><ForensicPage /></ProtectedRoute>} />
      
      {/* Default route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: 'var(--bg-panel)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '0.9rem',
              },
              success: {
                iconTheme: {
                  primary: 'var(--accent-cyan)',
                  secondary: 'var(--bg-dark)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--danger)',
                  secondary: 'var(--bg-dark)',
                },
              },
            }} 
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;