import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Mail, 
  BellRing, 
  Image as ImageIcon, 
  Loader2, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.getDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to retrieve dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner-icon" size={40} />
        <p>Fetching latest system logs and KPIs...</p>
        <style>{`
          .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 12px; }
          .spinner-icon { animation: spin 1s linear infinite; color: var(--color-accent); }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const { summary, recent } = stats || {};

  return (
    <div className="admin-dashboard-container">
      {/* Page Title */}
      <div className="dashboard-header-flex">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Real-time status of school admissions, circulars, and messages.</p>
        </div>
        <div className="quick-actions-btns">
          <Link to="/admin/notices" className="btn btn-accent btn-sm">
            <PlusCircle size={16} />
            <span>Create Notice</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-icon-box bg-blue">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <p className="kpi-label">Total Admissions</p>
            <h3 className="kpi-value">{summary?.admissions || 0}</h3>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon-box bg-amber">
            <Mail size={24} />
          </div>
          <div>
            <p className="kpi-label">Pending Enquiries</p>
            <h3 className="kpi-value">{summary?.enquiries || 0}</h3>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon-box bg-purple">
            <BellRing size={24} />
          </div>
          <div>
            <p className="kpi-label">Active Circulars</p>
            <h3 className="kpi-value">{summary?.notices || 0}</h3>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon-box bg-teal">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="kpi-label">Gallery Images</p>
            <h3 className="kpi-value">{summary?.gallery || 0}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid-2 activities-grid">
        {/* Recent Admissions */}
        <div className="card list-panel-card">
          <div className="panel-header-flex">
            <h3>Recent Admissions</h3>
            <Link to="/admin/admissions" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="panel-list">
            {recent?.admissions && recent.admissions.length > 0 ? (
              recent.admissions.map((app) => (
                <div className="panel-item" key={app.id}>
                  <div>
                    <h4>{app.student_name}</h4>
                    <p className="item-sub">Applied for: {app.class_applied}</p>
                  </div>
                  <span className={`badge badge-${app.status}`}>{app.status}</span>
                </div>
              ))
            ) : (
              <p className="no-data-text">No admission applications received yet.</p>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="card list-panel-card">
          <div className="panel-header-flex">
            <h3>Recent Visitor Enquiries</h3>
            <Link to="/admin/enquiries" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="panel-list">
            {recent?.enquiries && recent.enquiries.length > 0 ? (
              recent.enquiries.map((enq) => (
                <div className="panel-item-vertical" key={enq.id}>
                  <div className="vertical-item-header">
                    <h4>{enq.name}</h4>
                    <span className="item-date">{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="vertical-item-msg">"{enq.message.length > 100 ? `${enq.message.slice(0, 100)}...` : enq.message}"</p>
                </div>
              ))
            ) : (
              <p className="no-data-text">No general enquiries logged yet.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .dashboard-header-flex h1 {
          font-size: 2rem;
        }
        .dashboard-header-flex .subtitle {
          color: var(--color-text-muted);
        }
        
        .kpi-card {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .kpi-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .bg-blue { background-color: #3b82f6; }
        .bg-amber { background-color: #f59e0b; }
        .bg-purple { background-color: #8b5cf6; }
        .bg-teal { background-color: #14b8a6; }
        
        .kpi-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        .kpi-value {
          font-size: 1.6rem;
          font-weight: 700;
        }
        
        .activities-grid {
          margin-top: 32px;
        }

        @media (max-width: 768px) {
          .dashboard-header-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .dashboard-header-flex h1 {
            font-size: 1.4rem;
          }
          .grid-4.kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .kpi-card {
            padding: 16px;
            gap: 12px;
          }
          .kpi-icon-box {
            width: 40px;
            height: 40px;
          }
          .kpi-icon-box svg {
            width: 20px;
            height: 20px;
          }
          .kpi-value {
            font-size: 1.2rem;
          }
          .grid-2.activities-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .grid-4.kpi-grid {
            grid-template-columns: 1fr;
          }
        }
        .list-panel-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .panel-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 12px;
        }
        .panel-header-flex h3 {
          font-size: 1.15rem;
        }
        .view-all-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: var(--color-accent);
          font-weight: 600;
        }
        
        .panel-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .panel-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .panel-item h4 {
          font-size: 0.95rem;
        }
        .item-sub {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        
        .panel-item-vertical {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 16px;
          background-color: #f8fafc;
          border-radius: var(--radius-sm);
        }
        .vertical-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .vertical-item-header h4 {
          font-size: 0.95rem;
        }
        .item-date {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .vertical-item-msg {
          font-size: 0.85rem;
          font-style: italic;
          color: var(--color-text-dark);
        }
        .no-data-text {
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          padding: 20px 0;
        }
      `}</style>
    </div>
  );
}
