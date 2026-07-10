import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Mail, 
  FileText, 
  Image as ImageIcon, 
  BellRing, 
  Settings, 
  Users, 
  LogOut
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/Main_logo.png';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, role: ['admin', 'staff'] },
    { name: 'Admissions', path: '/admin/admissions', icon: FileSpreadsheet, role: ['admin', 'staff'] },
    { name: 'Enquiries', path: '/admin/enquiries', icon: Mail, role: ['admin', 'staff'] },
    { name: 'Pages CMS', path: '/admin/pages', icon: FileText, role: ['admin', 'staff'] },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon, role: ['admin', 'staff'] },
    { name: 'Notices', path: '/admin/notices', icon: BellRing, role: ['admin', 'staff'] },
    { name: 'Settings & SEO', path: '/admin/settings', icon: Settings, role: ['admin', 'staff'] },
    { name: 'Users', path: '/admin/users', icon: Users, role: ['admin'] } // Admin only route
  ];

  const handleLogout = async () => {
    try {
      await api.logout();
      onLogout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Logo" className="sidebar-logo-img" />
        <div>
          <h3>SSC Admin</h3>
          <p>Portal Gateway</p>
        </div>
      </div>

      <div className="user-profile-badge">
        <div className="avatar">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'Administrator'}</p>
          <span className="user-role-tag">{user?.role}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems
          .filter(item => item.role.includes(user?.role || 'staff'))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      <style>{`
        .admin-sidebar {
          width: var(--sidebar-width);
          background-color: var(--color-primary);
          color: #fff;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-brand {
          height: var(--header-height);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-logo-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(212, 160, 23, 0.4);
        }
        .sidebar-brand h3 {
          color: #fff;
          font-size: 1.1rem;
          font-family: var(--font-heading);
        }
        .sidebar-brand p {
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }
        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: #fff;
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #f8fafc;
        }
        .user-role-tag {
          font-size: 0.7rem;
          background-color: var(--color-primary-light);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--color-accent);
          text-transform: uppercase;
          font-weight: 600;
          display: inline-block;
          margin-top: 2px;
          width: fit-content;
        }
        .sidebar-nav {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
          overflow-y: auto;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          color: #cbd5e1;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .sidebar-link:hover {
          background-color: var(--color-primary-light);
          color: #fff;
        }
        .sidebar-link.active {
          background-color: var(--color-accent);
          color: #fff;
        }
        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: transparent;
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #f1f5f9;
          font-size: 0.95rem;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background-color 0.2s;
        }
        .sidebar-logout:hover {
          background-color: #ef4444;
          color: #fff;
        }
      `}</style>
    </aside>
  );
}
