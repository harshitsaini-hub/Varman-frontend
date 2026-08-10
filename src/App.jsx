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
import EngineSpecPage from './pages/EngineSpecPage';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-mono text-xs">Verifying Authentication...</div>;
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
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-mono text-xs">Initializing Varman...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/spec" element={<EngineSpecPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      
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
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.85rem',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#0F172A',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#0F172A',
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