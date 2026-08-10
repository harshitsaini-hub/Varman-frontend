import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Shield, LayoutDashboard, Folder, LogOut, ChevronDown, Trash2, UserX } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isProfileTrayOpen, setIsProfileTrayOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("End active Varman session?")) {
      logout();
    }
  };

  const handlePurgeAssets = async (e) => {
    e.stopPropagation();
    if (window.confirm("WARNING: This will permanently delete ALL protected assets in your vault. Proceed?")) {
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
    if (window.confirm("CRITICAL: This will permanently delete your user account and all vault files. Terminate account?")) {
      try {
        await api.delete('/auth/terminate-account');
        toast.success("Account terminated.");
        logout();
      } catch (err) {
        console.error("Account termination failed", err);
        toast.error("Failed to terminate account.");
      }
    }
  };

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 transition-all duration-200 text-xs font-semibold rounded-xl ${
      isActive
        ? 'bg-slate-900 text-white shadow-sm font-bold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const displayName = user?.display_name || (user?.email ? user.email.split('@')[0] : 'Operator');

  return (
    <aside className="hidden md:flex flex-col py-5 px-4 bg-white border-r border-slate-200 fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 selection:bg-emerald-100">
      {/* User Profile Header Card */}
      <div className="mb-6 select-none">
        <div
          onClick={() => setIsProfileTrayOpen(!isProfileTrayOpen)}
          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl border border-slate-200/80 group"
        >
          <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center bg-slate-100 text-slate-700 font-bold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="truncate flex-1">
            <h2 className="text-xs font-bold truncate text-slate-900">{displayName}</h2>
            <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{user?.email || ''}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isProfileTrayOpen ? 'rotate-180 text-slate-700' : ''
            }`}
          />
        </div>

        {/* Profile Expandable Drawer */}
        {isProfileTrayOpen && (
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 shadow-sm text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Chosen Alias</span>
              <span className="text-xs text-slate-900 font-semibold break-all">{displayName}</span>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Identifier</span>
              <span className="text-xs text-slate-900 font-mono break-all">{user?.email || 'N/A'}</span>
            </div>

            <div className="border-t border-slate-200 pt-2 space-y-1">
              <button
                onClick={handlePurgeAssets}
                className="w-full text-left text-xs text-slate-700 hover:text-amber-700 hover:bg-amber-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                Purge Vault Assets
              </button>
              <button
                onClick={handleTerminateAccount}
                className="w-full text-left text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <UserX className="w-3.5 h-3.5 text-red-600" />
                Terminate Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5">
        <NavLink to="/dashboard" className={getLinkClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/upload" className={getLinkClass}>
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Protect Image</span>
        </NavLink>

        <NavLink to="/gallery" className={getLinkClass}>
          <Folder className="w-4 h-4" />
          <span>Asset Vault</span>
        </NavLink>
      </nav>

      {/* Footer & Logout */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono font-semibold text-slate-500">Varman CPU Engine</span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
