import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Plus, Users as UsersIcon, ShieldAlert, AlertCircle, X, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function Users() {
  const { user: currentUser } = useOutletContext(); // Retrieve authenticated user context from AdminLayout
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });

  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  // Authorization Check
  if (currentUser?.role !== 'admin') {
    return (
      <div className="unauthorized-card card">
        <ShieldAlert className="warning-icon" size={48} />
        <h2>Access Denied</h2>
        <p>You do not have administrative privileges to access user management functions. Please contact the primary administrator.</p>
        <style>{`
          .unauthorized-card {
            text-align: center;
            padding: 60px 40px;
            max-width: 600px;
            margin: 40px auto;
            border-top: 4px solid var(--color-danger);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .warning-icon { color: var(--color-danger); }
        `}</style>
      </div>
    );
  }

  const handleOpenModal = () => {
    setFormData({ name: '', email: '', password: '', role: 'staff' });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete the account for "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setMsg('');
    setErrorMsg('');

    try {
      await api.deleteUser(userId);
      setMsg(`Account for '${userName}' deleted successfully.`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete user account.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setErrorMsg('Please fill in all details.');
      return;
    }

    try {
      await api.createUser(formData);
      setMsg(`Staff account for '${formData.name}' created successfully.`);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create user account.');
    }
  };

  return (
    <div className="admin-users-page">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1>Portal User Accounts</h1>
          <p className="subtitle">Register management personnel, teachers, or administrators.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
          <Plus size={18} />
          <span>Add New Account</span>
        </button>
      </div>

      {msg && <div className="alert-badge success">{msg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* Users list */}
      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner-icon" size={40} />
          <p>Retrieving portal personnel accounts...</p>
        </div>
      ) : usersList.length > 0 ? (
        <div className="table-card card no-padding table-responsive-wrap">
          <table className="admissions-table users-table">
            <thead>
              <tr>
                <th>Personnel Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id}>
                  <td data-label="Personnel Name">
                    <strong>{usr.name}</strong>
                  </td>
                  <td data-label="Email Address">{usr.email}</td>
                  <td data-label="Assigned Role">
                    <span className="role-tag-badge">{usr.role}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`badge badge-${usr.status === 1 ? 'approved' : 'rejected'}`}>
                      {usr.status === 1 ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td data-label="Registration Date">{new Date(usr.created_at).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    {usr.id !== 1 && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(usr.id, usr.name)}
                        title="Delete user account"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-card card">
          <AlertCircle size={32} className="warning-icon" />
          <p>No user accounts logged.</p>
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <div className="modal-header-flex">
              <h2>Register New Personnel Account</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Syed Faisal Ali"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="faisal@sirsyedconvent.com"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Initial Login Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Portal Role Assignment *</label>
                <select
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                  required
                >
                  <option value="staff">Staff (Edit Content/View forms)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div className="modal-actions-flex">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent btn-sm">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 1.8rem; }
        .page-header-flex .subtitle { color: var(--color-text-muted); font-size: 0.9rem; }

        .alert-badge { padding: 12px 20px; border-radius: var(--radius-sm); font-weight: 500; font-size: 0.9rem; margin-bottom: 20px; }
        .alert-badge.success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .alert-badge.error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }

        .role-tag-badge { background-color: #f1f5f9; padding: 4px 10px; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; color: var(--color-primary); }

        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(20, 92, 45, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
        .modal-content { width: 100%; max-width: 500px; border-top: 4px solid var(--color-accent); background-color: #fff; }
        .modal-header-flex { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
        .close-modal-btn { background: transparent; border: none; cursor: pointer; color: var(--color-text-muted); }
        
        .modal-actions-flex { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; }

        /* Responsive table wrapper - horizontal scroll on mobile */
        .table-responsive-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Tablet and below */
        @media (max-width: 768px) {
          .page-header-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .page-header-flex h1 {
            font-size: 1.4rem;
          }
          .admin-main-viewport {
            padding: 16px;
          }
        }

        /* Mobile: Convert table rows to stacked cards */
        @media (max-width: 600px) {
          .users-table thead {
            display: none;
          }
          .users-table,
          .users-table tbody,
          .users-table tr,
          .users-table td {
            display: block;
          }
          .users-table tr {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius-sm);
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          }
          .users-table tr:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .users-table td {
            padding: 6px 0;
            border: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .users-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: var(--color-text-muted);
            font-size: 0.75rem;
            text-transform: uppercase;
            min-width: 110px;
            flex-shrink: 0;
          }
          .users-table td:last-child {
            margin-bottom: 0;
          }
          .table-card.no-padding {
            padding: 0;
            background: transparent;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
