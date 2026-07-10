import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Edit, Trash2, Bell, AlertCircle, FileText, X } from 'lucide-react';
import api from '../../services/api';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editor/Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 1
  });
  const [attachment, setAttachment] = useState(null);

  // Status Alerts
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await api.getNotices();
      setNotices(response.notices || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load notices list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', status: 1 });
    setAttachment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      description: notice.description,
      status: notice.status
    });
    setAttachment(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');

    if (!formData.title || !formData.description) {
      setErrorMsg('Title and description are required.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('status', formData.status === 1 || formData.status === '1' ? 1 : 0);
      if (attachment) {
        payload.append('attachment', attachment);
      }

      if (editingId) {
        await api.updateNotice(editingId, payload);
        setMsg('Notice updated successfully.');
      } else {
        await api.createNotice(payload);
        setMsg('Notice posted successfully.');
      }
      
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save notice. Ensure file size is below 5MB.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice permanently?')) return;
    
    setMsg('');
    setErrorMsg('');
    try {
      await api.deleteNotice(id);
      setMsg('Notice deleted successfully.');
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete notice.');
    }
  };

  return (
    <div className="admin-notices-page">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1>Notice Management</h1>
          <p className="subtitle">Publish exam dates, summer vacations, or standard school bulletins.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Post New Notice</span>
        </button>
      </div>

      {msg && <div className="alert-badge success">{msg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* Notices Table */}
      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner-icon" size={40} />
          <p>Retrieving circular entries...</p>
        </div>
      ) : notices.length > 0 ? (
        <div className="table-card card no-padding">
          <table className="admissions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Notice Details</th>
                <th>Attachment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td data-label="Date">{new Date(n.publish_date).toLocaleDateString()}</td>
                  <td data-label="Notice Details">
                    <strong>{n.title}</strong>
                    <p className="row-desc-msg">{n.description.slice(0, 100)}{n.description.length > 100 && '...'}</p>
                  </td>
                  <td data-label="Attachment">
                    {n.attachment ? (
                      <a href={n.attachment} target="_blank" rel="noreferrer" className="doc-link-span">
                        <FileText size={14} />
                        <span>View Attachment</span>
                      </a>
                    ) : (
                      <span className="no-doc">None</span>
                    )}
                  </td>
                  <td data-label="Status">
                    <span className={`badge badge-${n.status === 1 ? 'approved' : 'rejected'}`}>
                      {n.status === 1 ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-btns-flex">
                      <button className="btn btn-outline btn-sm action-icon-btn" onClick={() => openEditModal(n)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm action-icon-btn" onClick={() => handleDelete(n.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-card card">
          <AlertCircle size={32} className="warning-icon" />
          <p>No active notices recorded in database.</p>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <div className="modal-header-flex">
              <h2>{editingId ? 'Edit Circular Notice' : 'Post New Circular Notice'}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Notice Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Summer Holidays Circular 2026"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notice Description *</label>
                <textarea
                  className="form-control"
                  placeholder="Enter complete circular notice bulletin details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Select Document File Attachment (PDF/JPG, Max 5MB)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {attachment && <p className="file-attached-hint">Attached: {attachment.name}</p>}
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="notice_status"
                  checked={formData.status === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))}
                />
                <label htmlFor="notice_status">Publish Notice (Tick to show on homepage/noticeboard)</label>
              </div>

              <div className="modal-actions-flex">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent btn-sm">Save Notice</button>
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

        .row-desc-msg { font-size: 0.8rem; color: var(--color-text-muted); margin-top: 4px; }
        .doc-link-span { display: inline-flex; align-items: center; gap: 6px; color: var(--color-accent); font-weight: 600; font-size: 0.85rem; }
        
        .action-btns-flex { display: flex; gap: 8px; }
        .action-icon-btn { padding: 6px 10px; }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(20, 92, 45, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
        .modal-content {
          width: 100%;
          max-width: 600px;
          border-top: 4px solid var(--color-accent);
          background-color: #fff;
        }
        .modal-header-flex { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
        .close-modal-btn { background: transparent; border: none; cursor: pointer; color: var(--color-text-muted); }
        
        .checkbox-group { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
        .checkbox-group label { margin-bottom: 0; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
        .modal-actions-flex { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        
        .file-attached-hint { font-size: 0.8rem; color: var(--color-success); font-weight: 600; margin-top: 6px; }

        /* Responsive */
        .table-card { overflow-x: auto; }
        @media (max-width: 768px) {
          .page-header-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .page-header-flex h1 {
            font-size: 1.4rem;
          }
        }
        @media (max-width: 600px) {
          .admissions-table thead {
            display: none;
          }
          .admissions-table,
          .admissions-table tbody,
          .admissions-table tr,
          .admissions-table td {
            display: block;
          }
          .admissions-table tr {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          }
          .admissions-table td {
            padding: 6px 0;
            border: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .admissions-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #64748b;
            font-size: 0.75rem;
            text-transform: uppercase;
            min-width: 100px;
            flex-shrink: 0;
          }
          .admissions-table td:last-child {
            margin-bottom: 0;
          }
          .action-btns-flex {
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
