import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Mail, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Enquiries() {
  const [enqs, setEnqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getEnquiriesList();
      setEnqs(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load general inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry from records?')) return;
    
    setMsg('');
    setErrorMsg('');
    try {
      await api.deleteEnquiry(id);
      setMsg('Enquiry deleted successfully.');
      setEnqs(enqs.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete enquiry.');
    }
  };

  return (
    <div className="admin-enquiries-page">
      {/* Title */}
      <div className="page-header-flex">
        <div>
          <h1>General Enquiries</h1>
          <p className="subtitle">Inbox logs from website contact forms.</p>
        </div>
      </div>

      {msg && <div className="alert-badge success">{msg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* List content */}
      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner-icon" size={40} />
          <p>Loading enquiry logs...</p>
        </div>
      ) : enqs.length > 0 ? (
        <div className="enquiries-grid-vertical">
          {enqs.map((enq) => (
            <div className="card enquiry-log-card" key={enq.id}>
              <div className="card-top">
                <div className="visitor-meta">
                  <Mail className="mail-icon" size={20} />
                  <div>
                    <h3>{enq.name}</h3>
                    <div className="row-sub">Received: {new Date(enq.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm delete-btn" onClick={() => handleDelete(enq.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="visitor-details-flex">
                <span className="detail-tag">📞 {enq.phone}</span>
                <span className="detail-tag">✉️ {enq.email}</span>
              </div>

              <div className="message-content-box">
                <p>"{enq.message}"</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-card card">
          <AlertCircle size={32} className="warning-icon" />
          <p>No visitor enquiries recorded in database.</p>
        </div>
      )}

      <style>{`
        .page-header-flex { margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 1.8rem; }
        .page-header-flex .subtitle { color: var(--color-text-muted); font-size: 0.9rem; }
        
        .alert-badge { padding: 12px 20px; border-radius: var(--radius-sm); font-weight: 500; font-size: 0.9rem; margin-bottom: 20px; }
        .alert-badge.success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .alert-badge.error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }

        .enquiries-grid-vertical {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .enquiry-log-card {
          border-left: 4px solid var(--color-primary-light);
          position: relative;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .visitor-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .visitor-meta h3 {
          font-size: 1.15rem;
        }
        .mail-icon {
          color: var(--color-accent);
        }
        .delete-btn {
          padding: 8px;
        }
        
        .visitor-details-flex {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .detail-tag {
          font-size: 0.85rem;
          background-color: #f1f5f9;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 500;
          color: var(--color-primary);
        }
        
        .message-content-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 16px 20px;
          margin-top: 16px;
          font-style: italic;
          font-size: 0.95rem;
          color: var(--color-text-dark);
          line-height: 1.6;
        }
        
        .no-data-card {
          text-align: center;
          padding: 50px;
          color: var(--color-text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .warning-icon { color: var(--color-accent); }
      `}</style>
    </div>
  );
}
