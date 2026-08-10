import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/gallery?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative hidden sm:block">
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3.5 py-1.5 focus:outline-none focus:border-slate-400 focus:bg-white transition-all w-64 text-xs font-mono" 
                  placeholder="Search protected images..." 
                  type="text" 
                />
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-[16px]">search</span>
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900">{user?.display_name || 'Operator'}</span>
                <span className="text-[10px] font-mono text-slate-500">{user?.email || ''}</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center bg-slate-100 text-slate-700">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2">
                Sign In
              </Link>
              <Link to="/login" className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
