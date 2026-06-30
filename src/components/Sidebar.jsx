import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isProfileTrayOpen, setIsProfileTrayOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Do you want to neutralize the Varman link connection?")) {
      logout();
    }
  };

  const handlePurgeAssets = async (e) => {
    e.stopPropagation();
    if (window.confirm("WARNING: This will permanently delete ALL protected and original assets in your vault from disk. This operation is irreversible. Proceed?")) {
      try {
        await api.delete('/images/purge-all');
        toast.success("All vault assets purged successfully.");
        if (window.location.pathname === '/gallery') {
          window.location.reload();
        }
      } catch (err) {
        console.error("Purge assets failed", err);
        toast.error("Failed to purge vault assets.");
      }
    }
  };

  const handleTerminateAccount = async (e) => {
    e.stopPropagation();
    if (window.confirm("CRITICAL WARNING: This will permanently delete your user account AND purge all files in your secure directory from disk. This operation CANNOT be undone. Terminate account?")) {
      try {
        await api.delete('/auth/terminate-account');
        toast.success("Account terminated successfully.");
        logout();
      } catch (err) {
        console.error("Account termination failed", err);
        toast.error("Failed to terminate account.");
      }
    }
  };

  const getLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 transition-all duration-200 text-[11px] tracking-widest uppercase border-l-2 font-code-snippet ${
      isActive 
        ? 'bg-neon-purple/5 border-neon-purple text-neon-purple' 
        : 'text-on-surface-variant border-transparent hover:bg-neon-purple/5 hover:text-neon-purple'
    }`;

  return (
    <aside className="hidden md:flex flex-col py-6 overflow-y-auto bg-background/80 backdrop-blur-md border-r border-neon-cyan/20 fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40">
      <div className="px-6 mb-8 select-none">
        <div 
          onClick={() => setIsProfileTrayOpen(!isProfileTrayOpen)}
          className="flex items-center gap-3 p-1 cursor-pointer hover:bg-neon-purple/5 transition-colors rounded group"
        >
          <div className="w-11 h-11 overflow-hidden border border-neon-purple/40 group-hover:border-neon-purple group-hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] flex items-center justify-center bg-surface-container-highest rounded-full shrink-0 transition-all duration-300">
            <span className="material-symbols-outlined text-neon-purple text-[24px]">person</span>
          </div>
          <div className="truncate flex-1">
            <h2 className="text-sm font-bold tracking-wide truncate uppercase font-code-snippet text-gradient">{user?.display_name || 'Operator'}</h2>
            <p className="text-[10px] text-on-surface-variant truncate font-code-snippet mt-0.5">{user?.email || 'N/A'}</p>
          </div>
          <span className="material-symbols-outlined text-neon-purple/70 text-[18px] transition-transform duration-200" style={{ transform: isProfileTrayOpen ? 'rotate(180deg)' : 'none' }}>
            expand_more
          </span>
        </div>

        {/* Expandable User Drawer Tray */}
        {isProfileTrayOpen && (
          <div className="mt-3 p-3 bg-neon-cyan/5 border border-neon-cyan/30 space-y-3 font-code-snippet rounded shadow-[0_0_15px_rgba(0,240,255,0.05)]">
            <div className="space-y-1">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Operator Username</span>
              <span className="text-xs text-white break-all block">{user?.display_name || 'N/A'}</span>
            </div>
            <div className="space-y-1 border-t border-neon-cyan/20 pt-2">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Encryption Key (Email)</span>
              <span className="text-xs text-white break-all block">{user?.email || 'N/A'}</span>
            </div>
            
            <div className="border-t border-neon-cyan/20 pt-2 space-y-2">
              <button 
                onClick={handlePurgeAssets}
                className="w-full text-left text-[10px] text-secondary hover:text-white hover:bg-secondary/15 px-2 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                Purge All Assets
              </button>
              <button 
                onClick={handleTerminateAccount}
                className="w-full text-left text-[10px] text-neon-red hover:text-white hover:bg-neon-red/15 px-2 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">no_accounts</span>
                Terminate Account
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        <NavLink to="/dashboard" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[18px]">radar</span>
              <span className={isActive ? 'text-gradient font-bold' : ''}>Threat Monitor</span>
            </>
          )}
        </NavLink>
        <NavLink to="/upload" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[18px]">grain</span>
              <span className={isActive ? 'text-gradient font-bold' : ''}>Disruptor Core</span>
            </>
          )}
        </NavLink>
        <NavLink to="/gallery" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[18px]">folder</span>
              <span className={isActive ? 'text-gradient font-bold' : ''}>Asset Vault</span>
            </>
          )}
        </NavLink>
        <NavLink to="/forensic" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[18px]">science</span>
              <span className={isActive ? 'text-gradient font-bold' : ''}>Forensic Lab</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="px-4 mt-auto flex flex-col items-center gap-2 select-none">
        <button 
          onClick={handleLogout}
          className="text-on-surface-variant/55 hover:text-neon-red hover:bg-neon-red/10 border border-transparent hover:border-neon-red/30 w-12 h-12 flex items-center justify-center transition-all duration-200 rounded-full"
          title="Terminate Connection"
        >
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'wght' 600, 'opsz' 40" }}>power_settings_new</span>
        </button>
        <NavLink 
          to="/about"
          className="text-[11px] tracking-widest uppercase font-code-snippet transition-colors duration-200 mt-2 font-semibold"
        >
          {({ isActive }) => (
            <span className={isActive ? 'text-gradient font-bold' : 'text-on-surface-variant/50 hover-text-gradient'}>ABOUT SYSTEM</span>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
