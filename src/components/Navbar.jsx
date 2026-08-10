import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Menu, X, Search, LayoutDashboard, Folder, LogOut } from 'lucide-react';

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

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 font-sans">
      <div className="flex justify-between items-center px-4 sm:px-6 h-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            VARMAN
          </Link>

          {user && (
            <div className="hidden md:flex gap-6 h-full items-center">
              <Link to="/dashboard" className="text-xs font-semibold tracking-wider text-slate-600 hover:text-slate-900 transition-colors uppercase">
                Dashboard
              </Link>
              <Link to="/upload" className="text-xs font-semibold tracking-wider text-slate-600 hover:text-slate-900 transition-colors uppercase">
                Protect Image
              </Link>
              <Link to="/gallery" className="text-xs font-semibold tracking-wider text-slate-600 hover:text-slate-900 transition-colors uppercase">
                Vault
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="relative hidden sm:block">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3.5 py-1.5 focus:outline-none focus:border-slate-400 focus:bg-white transition-all w-52 md:w-64 text-xs font-mono"
                  placeholder="Search vault..."
                  type="text"
                />
                <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
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
