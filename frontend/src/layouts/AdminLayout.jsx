import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { Loader2, Menu } from 'lucide-react';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        navigate('/admin/login');
        return;
      }

      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (err) {
        console.error('Session verification failed:', err);
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogoutState = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Loader2 className="spinner-icon" size={48} />
        <p>Verifying secure session credentials...</p>
        <style>{`
          .admin-loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: var(--color-bg-light);
            gap: 16px;
          }
          .spinner-icon {
            animation: spin 1.2s linear infinite;
            color: var(--color-accent);
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-layout-wrapper">
      <Sidebar user={user} onLogout={handleLogoutState} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h2>SSC Management Portal</h2>
          </div>
          <div className="topbar-profile">
            <span>Welcome, <strong>{user?.name}</strong></span>
          </div>
        </header>
        <main className="admin-main-viewport">
          <Outlet context={{ user }} />
        </main>
      </div>

      <style>{`
        .admin-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f1f5f9;
        }
        .admin-workspace {
          margin-left: var(--sidebar-width);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .admin-topbar {
          height: var(--header-height);
          background-color: #fff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .admin-topbar h2 {
          font-size: 1.25rem;
          color: var(--color-primary);
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hamburger-btn {
          display: none;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 6px 8px;
          cursor: pointer;
          color: var(--color-primary);
        }
        .hamburger-btn:hover {
          background-color: #f8fafc;
        }
        .topbar-profile {
          font-size: 0.9rem;
          color: var(--color-text-dark);
        }
        .admin-main-viewport {
          padding: 32px;
          flex-grow: 1;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .hamburger-btn {
            display: block;
          }
          .admin-workspace {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
