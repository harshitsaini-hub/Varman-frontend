import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Menu, X, Search, LayoutDashboard, Folder, LogOut, Cpu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/gallery?q=${encodeURIComponent(search)}`);
    }
  };

  const displayName = user?.display_name || (user?.email ? user.email.split('@')[0] : 'Operator');

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 font-sans">
      <div className="flex justify-between items-center px-4 sm:px-6 h-16 w-full max-w-7xl mx-auto">
        {/* Left: Brand Logo & Status */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            VARMAN
          </Link>

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Engine Active</span>
            </div>
          )}
        </div>

        {/* Right: Search Bar & User Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative hidden sm:block">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl px-3.5 py-1.5 focus:outline-none focus:border-slate-400 focus:bg-white transition-all w-52 md:w-64 text-xs font-medium"
                  placeholder="Search vault assets..."
                  type="text"
                />
                <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
              </div>

              {/* User Avatar Chip */}
              <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{displayName}</span>
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{user?.email || ''}</span>
                </div>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2">
                Sign In
              </Link>
              <Link to="/login" className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {user && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            Dashboard
          </Link>

          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            Protect Image
          </Link>

          <Link
            to="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <Folder className="w-4 h-4 text-slate-500" />
            Asset Vault
          </Link>

          <div className="border-t border-slate-100 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
