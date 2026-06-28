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
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-neon-cyan/20 h-16">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="font-bold text-[24px] text-neon-cyan tracking-widest uppercase font-headline hover:text-white transition-colors duration-300">
            VARMAN
          </Link>
          <div className="hidden md:flex gap-6 h-full items-center">
            <Link to="/dashboard" className="text-neon-cyan font-bold border-b-2 border-neon-cyan pb-1 h-full flex items-center text-xs tracking-widest uppercase hover:text-white transition-colors duration-300">
              DEFENSE SHELL
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="bg-surface-container-highest/50 border border-neon-cyan/30 text-neon-cyan placeholder:text-neon-cyan/50 rounded-none px-4 py-1.5 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all w-80 text-[10px] tracking-wider font-code-snippet" 
              placeholder="SEARCH_VAULT..." 
              type="text" 
            />
            <span className="material-symbols-outlined absolute right-2 top-2.5 text-neon-cyan/70 text-[14px]">search</span>
          </div>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] text-on-surface font-semibold font-code-snippet">{user?.display_name || 'Operator'}</span>
            <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-code-snippet">{user?.email || 'N/A'}</span>
          </div>
          <div className="w-8 h-8 rounded-none overflow-hidden border border-neon-cyan/50 flex items-center justify-center bg-surface-container-highest">
            <span className="material-symbols-outlined text-neon-cyan/70">account_circle</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
