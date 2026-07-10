import React, { useEffect, useState } from 'react';
import { 
  Loader2, 
  Search, 
  FileDown, 
  Eye,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function Admissions() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Update feedback state
  const [updateMsg, setUpdateMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const data = await api.getAdmissionsList(searchTerm, statusFilter);
      setApps(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load admission applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdmissions();
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdateMsg('');
    setErrorMsg('');
    try {
      await api.updateAdmissionStatus(id, newStatus);
      setUpdateMsg('Application status updated successfully.');
      // Refresh list
      const updated = apps.map(app => app.id === id ? { ...app, status: newStatus } : app);
      setApps(updated);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update status.');
    }
  };

  const handleCsvExport = () => {
    const token = localStorage.getItem('admin_token');
    // Open in new tab with JWT auth token query param, or trigger standard download
    window.open(`/api/admin/admissions/export?token=${token}`, '_blank');
  };

  return (
    <div className="admin-admissions-page">
      {/* Title block */}
      <div className="page-header-flex">
        <div>
          <h1>Admission Applications</h1>
          <p className="subtitle">Search, inspect documents, review status, or download records.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleCsvExport}>
          <FileDown size={18} />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Messages */}
      {updateMsg && <div className="alert-badge success">{updateMsg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* Filters block */}
      <div className="filters-card card">
        <form onSubmit={handleSearchSubmit} className="search-form-flex">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by student, parent, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-accent btn-sm">Search</button>
        </form>

        <div className="status-filter-group">
          <label>Filter Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="contacted">Contacted</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner-icon" size={40} />
          <p>Retrieving applications list...</p>
        </div>
      ) : apps.length > 0 ? (
        <div className="table-card card no-padding table-responsive-wrap">
          <table className="admissions-table responsive-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student & Class</th>
                <th>Parent Details</th>
                <th>Contact Info</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => {
                let docObj = {};
                try {
                  docObj = JSON.parse(app.documents || '{}');
                } catch (e) {}

                return (
                  <tr key={app.id}>
                    <td data-label="ID">#{app.id}</td>
                    <td data-label="Student & Class">
                      <strong>{app.student_name}</strong>
                      <div className="row-sub text-accent">{app.class_applied}</div>
                    </td>
                    <td data-label="Parent">{app.parent_name}</td>
                    <td data-label="Contact">
                      <div>📞 {app.phone}</div>
                      <div className="row-sub">{app.email}</div>
                    </td>
                    <td data-label="Documents">
                      <div className="docs-links-flex">
                        {docObj.birth_certificate ? (
                          <a href={docObj.birth_certificate} target="_blank" rel="noreferrer" className="doc-link">
                            <Eye size={12} />
                            <span>Birth Cert</span>
                          </a>
                        ) : (
                          <span className="no-doc">No Birth Cert</span>
                        )}
                        {docObj.marksheet ? (
                          <a href={docObj.marksheet} target="_blank" rel="noreferrer" className="doc-link">
                            <Eye size={12} />
                            <span>Marksheet</span>
                          </a>
                        ) : (
                          <span className="no-doc">No Marksheet</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Status">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`status-select select-${app.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="contacted">Contacted</option>
                      </select>
                    </td>
                    <td data-label="Date Applied">{new Date(app.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-card card">
          <AlertCircle size={32} className="warning-icon" />
          <p>No admission applications match your current search/filters.</p>
        </div>
      )}

      <style>{`
        .page-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .page-header-flex h1 { font-size: 1.8rem; }
        .page-header-flex .subtitle { color: var(--color-text-muted); font-size: 0.9rem; }
        
        .alert-badge {
          padding: 12px 20px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .alert-badge.success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .alert-badge.error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }

        .filters-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          flex-wrap: wrap;
        }
        .search-form-flex {
          display: flex;
          gap: 12px;
          flex-grow: 1;
          max-width: 500px;
        }
        .search-box {
          position: relative;
          width: 100%;
        }
        .search-box input {
          width: 100%;
          padding: 8px 16px 8px 40px;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          outline: none;
        }
        .search-box input:focus { border-color: var(--color-accent); }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .status-filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .filter-select {
          padding: 8px 16px;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
        }

        .no-padding { padding: 0; }
        .table-card {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          background-color: #fff;
        }
        .admissions-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admissions-table th {
          background-color: #f8fafc;
          padding: 16px 20px;
          font-weight: 600;
          color: var(--color-primary);
          border-bottom: 1px solid #e2e8f0;
        }
        .admissions-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .row-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .text-accent {
          color: var(--color-accent);
          font-weight: 600;
        }
        
        .docs-links-flex {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .doc-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--color-info);
          font-weight: 600;
          font-size: 0.8rem;
        }
        .doc-link:hover { text-decoration: underline; }
        .no-doc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .status-select {
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.8rem;
          border: 1px solid #cbd5e1;
          text-transform: uppercase;
        }
        .select-pending { background-color: #fef3c7; color: #d97706; }
        .select-approved { background-color: #d1fae5; color: #065f46; }
        .select-rejected { background-color: #fee2e2; color: #991b1b; }
        .select-contacted { background-color: #dbeafe; color: #1e40af; }
        
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

        /* Responsive */
        .table-responsive-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 768px) {
          .page-header-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .page-header-flex h1 {
            font-size: 1.4rem;
          }
          .filters-card {
            flex-direction: column;
            align-items: stretch;
          }
          .search-form-flex {
            max-width: 100%;
          }
          .status-filter-group {
            width: 100%;
            justify-content: space-between;
          }
        }
        @media (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table,
          .responsive-table tbody,
          .responsive-table tr,
          .responsive-table td {
            display: block;
          }
          .responsive-table tr {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          }
          .responsive-table td {
            padding: 6px 0;
            border: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .responsive-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #64748b;
            font-size: 0.75rem;
            text-transform: uppercase;
            min-width: 100px;
            flex-shrink: 0;
          }
          .responsive-table td:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
