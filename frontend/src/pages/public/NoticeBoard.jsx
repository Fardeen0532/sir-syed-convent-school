import React, { useEffect, useState } from 'react';
import { Loader2, Search, Calendar, Download, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.getNotices();
        setNotices(response.notices || []);
        setFilteredNotices(response.notices || []);
        if (response.seo) {
          document.title = response.seo.meta_title;
        }
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredNotices(notices);
    } else {
      const lowerVal = value.toLowerCase();
      setFilteredNotices(
        notices.filter(notice => 
          notice.title.toLowerCase().includes(lowerVal) || 
          notice.description.toLowerCase().includes(lowerVal)
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner-icon" size={40} />
        <p>Loading active notices...</p>
        <style>{`
          .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 12px; }
          .spinner-icon { animation: spin 1s linear infinite; color: var(--color-accent); }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="notice-board-page">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <h1>School Notice Board</h1>
          <p>Read current news, academic updates, schedules, and circular downloads</p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section notice-section">
        <div className="container">
          {/* Search bar */}
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search circulars, notifications, and exams..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          {/* Notices listing */}
          <div className="notices-list">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div className="notice-card card" key={notice.id}>
                  <div className="notice-meta">
                    <div className="notice-date-badge">
                      <Calendar size={16} />
                      <span>
                        {new Date(notice.publish_date).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="notice-content">
                    <h3>{notice.title}</h3>
                    <p className="notice-description">{notice.description}</p>
                    
                    {notice.attachment && (
                      <div className="attachment-box">
                        <span className="attachment-name">Attachment Available</span>
                        <a
                          href={notice.attachment}
                          className="btn btn-accent btn-sm download-btn"
                          download
                        >
                          <Download size={16} />
                          <span>Download Attachment</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notices card">
                <AlertCircle className="alert-icon" size={32} />
                <p>No notices found matching your search search query.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .search-bar-wrapper {
          display: flex;
          align-items: center;
          background-color: #fff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 4px 16px;
          max-width: 600px;
          margin: 0 auto 50px;
          box-shadow: var(--shadow-sm);
        }
        .search-icon {
          color: var(--color-text-muted);
          margin-right: 12px;
        }
        .search-input {
          width: 100%;
          border: none;
          padding: 12px 0;
          outline: none;
          font-size: 1rem;
        }
        
        .notices-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        .notice-card {
          border-left: 5px solid var(--color-accent);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .notice-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .notice-date-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-accent);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .notice-content h3 {
          font-size: 1.4rem;
          margin-bottom: 8px;
        }
        .notice-description {
          color: var(--color-text-dark);
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .attachment-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 12px 20px;
          margin-top: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .attachment-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        
        .no-notices {
          text-align: center;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--color-text-muted);
        }
        .alert-icon {
          color: var(--color-accent);
        }
        @media (max-width: 480px) {
          .attachment-box {
            flex-direction: column;
            align-items: flex-start;
          }
          .download-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
