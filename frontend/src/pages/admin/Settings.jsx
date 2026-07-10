import React, { useEffect, useState } from 'react';
import { Loader2, Settings as SettingsIcon, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Settings() {
  const [seoList, setSeoList] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // SEO form state
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    keywords: ''
  });

  const fetchSeoSettings = async () => {
    setLoading(true);
    setMsg('');
    setErrorMsg('');
    try {
      const data = await api.getSettings();
      setSeoList(data.seo || []);
      
      // Populate fields for currently selected slug
      const current = (data.seo || []).find(s => s.slug === selectedSlug);
      if (current) {
        setFormData({
          meta_title: current.meta_title,
          meta_description: current.meta_description,
          keywords: current.keywords
        });
      } else {
        setFormData({ meta_title: '', meta_description: '', keywords: '' });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load SEO settings catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, [selectedSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErrorMsg('');

    try {
      await api.updateSettings({
        slug: selectedSlug,
        ...formData
      });
      setMsg(`SEO Settings for page '${selectedSlug}' updated successfully.`);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  const pagesMap = {
    home: 'Home Page',
    about: 'About Us',
    academics: 'Academics & Timings',
    admissions: 'Online Admissions',
    facilities: 'Campus Facilities',
    faculty: 'School Faculty',
    gallery: 'Photo Gallery',
    notices: 'Notice Board Circulars',
    contact: 'Contact & Map Location'
  };

  return (
    <div className="admin-settings-page">
      {/* Title */}
      <div className="page-header-flex">
        <div>
          <h1>SEO Settings Panel</h1>
          <p className="subtitle">Optimize search indexing meta tags for all public routes.</p>
        </div>
      </div>

      {msg && <div className="alert-badge success">{msg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* Selector and form card */}
      <div className="grid-2 editor-grid">
        {/* Pages Selector Panel */}
        <div className="card list-panel">
          <h3>Target Web Pages</h3>
          <p className="panel-desc">Select a page route below to configure titles, descriptions, and Google indexing keywords:</p>
          
          <div className="route-links-list">
            {Object.keys(pagesMap).map((slug) => (
              <button
                key={slug}
                className={`route-btn ${selectedSlug === slug ? 'active' : ''}`}
                onClick={() => setSelectedSlug(slug)}
              >
                <span>{pagesMap[slug]}</span>
                <span className="route-path">/{slug === 'home' ? '' : slug}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Form Panel */}
        {loading ? (
          <div className="loader-container">
            <Loader2 className="spinner-icon" size={40} />
            <p>Loading meta tag configurations...</p>
          </div>
        ) : (
          <div className="card editor-card">
            <div className="editor-badge-header">
              <SettingsIcon size={16} />
              <span>Editing Metadata: /{selectedSlug === 'home' ? '' : selectedSlug}</span>
            </div>

            <form onSubmit={handleSubmit} className="seo-form">
              <div className="form-group">
                <label>Browser Page Title (Meta Title) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="e.g. Admissions Open 2026 | Sir Syed Convent"
                  required
                />
              </div>

              <div className="form-group">
                <label>Search Description (Meta Description) *</label>
                <textarea
                  className="form-control"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Summarize page content for search engines..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Keywords (Comma separated tags for search presence)</label>
                <textarea
                  className="form-control"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="e.g. school admission Bulandshahr, CBSE school Pahasu, AMU staff"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-accent save-seo-btn" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="spinner-icon-btn" size={18} />
                    <span>Saving Search Config...</span>
                  </>
                ) : (
                  <span>Update Page SEO Settings</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .page-header-flex { margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 1.8rem; }
        .page-header-flex .subtitle { color: var(--color-text-muted); font-size: 0.9rem; }
        
        .alert-badge { padding: 12px 20px; border-radius: var(--radius-sm); font-weight: 500; font-size: 0.9rem; margin-bottom: 20px; }
        .alert-badge.success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .alert-badge.error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }

        .editor-grid { align-items: start; }
        .list-panel h3 { font-size: 1.15rem; margin-bottom: 8px; }
        .panel-desc { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 20px; }
        
        .route-links-list { display: flex; flex-direction: column; gap: 8px; }
        .route-btn { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-radius: var(--radius-sm); background-color: #f8fafc; border: 1px solid #cbd5e1; cursor: pointer; text-align: left; transition: all 0.2s; font-weight: 600; font-size: 0.9rem; }
        .route-btn:hover { background-color: #f1f5f9; color: var(--color-primary); }
        .route-btn.active { background-color: var(--color-primary); color: #fff; border-color: var(--color-primary); }
        
        .route-path { font-size: 0.75rem; color: var(--color-text-muted); }
        .route-btn.active .route-path { color: #94a3b8; }
        
        .editor-card { border-top: 4px solid var(--color-accent); }
        .editor-badge-header { display: inline-flex; align-items: center; gap: 6px; background-color: #f1f5f9; padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: var(--color-accent); margin-bottom: 24px; }
        .seo-form textarea { min-height: 100px; }
        .save-seo-btn { width: 100%; padding: 12px; margin-top: 14px; }
        
        .spinner-icon-btn { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header-flex h1 {
            font-size: 1.4rem;
          }
          .grid-2.editor-grid {
            grid-template-columns: 1fr;
          }
          .route-links-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .route-btn {
            padding: 10px 14px;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
        }
        @media (max-width: 480px) {
          .route-links-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
