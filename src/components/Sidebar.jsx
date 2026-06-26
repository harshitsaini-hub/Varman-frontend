import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Image as ImageIcon, LogOut, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navLinkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="sidebar" style={{ minWidth: '260px' }}>
      <div className="flex items-center gap-2 mb-8 mt-2">
        <Shield size={32} color="var(--accent-cyan)" />
        <h2 style={{ margin: 0 }} className="text-gradient">Varman</h2>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/upload" className={navLinkClass}>
          <UploadCloud size={20} />
          <span>Protect Image</span>
        </NavLink>
        <NavLink to="/gallery" className={navLinkClass}>
          <ImageIcon size={20} />
          <span>Gallery</span>
        </NavLink>
      </nav>

      <div className="mt-auto">
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.display_name}</p>
          <p style={{ margin: 0, fontSize: '0.8rem' }}>{user?.email}</p>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
