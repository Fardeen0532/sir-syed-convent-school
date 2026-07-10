import React, { useEffect, useState } from 'react';
import { Loader2, FileEdit, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function PageEditor() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Page contents state
  const [homeData, setHomeData] = useState({
    hero_title: '', hero_subtitle: '', hero_cta_text: '', hero_cta_link: '',
    welcome_title: '', welcome_body: '',
    chairman_name: '', chairman_role: '', chairman_message: '',
    principal_name: '', principal_role: '', principal_message: ''
  });

  const [aboutData, setAboutData] = useState({
    overview: '', vision: '', mission: '', history: ''
  });

  const [academicsData, setAcademicsData] = useState({
    curriculum: '', examinations: '', summer_timings: '', winter_timings: ''
  });

  const loadPageContent = async (slug) => {
    setLoading(true);
    setMsg('');
    setErrorMsg('');
    try {
      let response;
      if (slug === 'home') {
        response = await api.getHome();
        const c = response.content || {};
        setHomeData({
          hero_title: c.hero?.title || '',
          hero_subtitle: c.hero?.subtitle || '',
          hero_cta_text: c.hero?.cta_text || '',
          hero_cta_link: c.hero?.cta_link || '',
          welcome_title: c.welcome?.title || '',
          welcome_body: c.welcome?.body || '',
          chairman_name: c.chairman_message?.name || '',
          chairman_role: c.chairman_message?.role || '',
          chairman_message: c.chairman_message?.message || '',
          principal_name: c.principal_message?.name || '',
          principal_role: c.principal_message?.role || '',
          principal_message: c.principal_message?.message || ''
        });
      } else if (slug === 'about') {
        response = await api.getAbout();
        const c = response.content || {};
        setAboutData({
          overview: c.overview || '',
          vision: c.vision || '',
          mission: c.mission || '',
          history: c.history || ''
        });
      } else if (slug === 'academics') {
        response = await api.getAcademics();
        const c = response.content || {};
        setAcademicsData({
          curriculum: c.curriculum || '',
          examinations: c.examinations || '',
          summer_timings: c.timings?.summer || '',
          winter_timings: c.timings?.winter || ''
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load page content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageContent(selectedPage);
  }, [selectedPage]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErrorMsg('');

    try {
      let serializedContent = {};
      let title = '';

      if (selectedPage === 'home') {
        title = 'Home Page';
        // Preserve why choose us which is seeded
        const original = await api.getHome();
        const why = original.content?.why_choose_us || [];
        
        serializedContent = {
          hero: {
            title: homeData.hero_title,
            subtitle: homeData.hero_subtitle,
            cta_text: homeData.hero_cta_text,
            cta_link: homeData.hero_cta_link
          },
          welcome: {
            title: homeData.welcome_title,
            body: homeData.welcome_body
          },
          chairman_message: {
            name: homeData.chairman_name,
            role: homeData.chairman_role,
            message: homeData.chairman_message
          },
          principal_message: {
            name: homeData.principal_name,
            role: homeData.principal_role,
            message: homeData.principal_message
          },
          why_choose_us: why
        };
      } else if (selectedPage === 'about') {
        title = 'About Us';
        const original = await api.getAbout();
        const management = original.content?.management || [];
        
        serializedContent = {
          overview: aboutData.overview,
          vision: aboutData.vision,
          mission: aboutData.mission,
          history: aboutData.history,
          management: management
        };
      } else if (selectedPage === 'academics') {
        title = 'Academics';
        const original = await api.getAcademics();
        const subjects = original.content?.subjects || [];
        
        serializedContent = {
          curriculum: academicsData.curriculum,
          examinations: academicsData.examinations,
          timings: {
            summer: academicsData.summer_timings,
            winter: academicsData.winter_timings
          },
          subjects: subjects
        };
      }

      await api.updatePage(selectedPage, serializedContent, title);
      setMsg(`Page '${selectedPage}' content saved and published successfully!`);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save page changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-page">
      {/* Title */}
      <div className="page-header-flex">
        <div>
          <h1>Content Management System (CMS)</h1>
          <p className="subtitle">Select a website page to update dynamic blocks and banners.</p>
        </div>
      </div>

      {msg && <div className="alert-badge success">{msg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* Dropdown Selector */}
      <div className="selector-card card">
        <label htmlFor="page_select">Select Page to Edit:</label>
        <select 
          id="page_select" 
          value={selectedPage} 
          onChange={(e) => setSelectedPage(e.target.value)}
          className="page-select-dropdown"
        >
          <option value="home">Home Page Sections</option>
          <option value="about">About Us Overview</option>
          <option value="academics">Academics & Timings</option>
        </select>
      </div>

      {/* Form Editor */}
      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner-icon" size={40} />
          <p>Loading page components...</p>
        </div>
      ) : (
        <div className="card editor-form-card">
          <div className="editor-badge-header">
            <FileEdit size={16} />
            <span>Editing: {selectedPage.toUpperCase()}</span>
          </div>

          <form onSubmit={handleSave} className="cms-editor-form">
            {/* 1. HOME PAGE FIELDS */}
            {selectedPage === 'home' && (
              <>
                <h3 className="section-divider">1. Hero Banner Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Hero Title</label>
                    <input 
                      type="text" className="form-control" 
                      value={homeData.hero_title}
                      onChange={(e) => setHomeData(p => ({ ...p, hero_title: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hero Subtitle</label>
                    <input 
                      type="text" className="form-control" 
                      value={homeData.hero_subtitle}
                      onChange={(e) => setHomeData(p => ({ ...p, hero_subtitle: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>CTA Button Text</label>
                    <input 
                      type="text" className="form-control" 
                      value={homeData.hero_cta_text}
                      onChange={(e) => setHomeData(p => ({ ...p, hero_cta_text: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>CTA Route Link</label>
                    <input 
                      type="text" className="form-control" 
                      value={homeData.hero_cta_link}
                      onChange={(e) => setHomeData(p => ({ ...p, hero_cta_link: e.target.value }))}
                    />
                  </div>
                </div>

                <h3 className="section-divider" style={{ marginTop: '30px' }}>2. Welcome Greeting Box</h3>
                <div className="form-group">
                  <label>Welcome Block Title</label>
                  <input 
                    type="text" className="form-control" 
                    value={homeData.welcome_title}
                    onChange={(e) => setHomeData(p => ({ ...p, welcome_title: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Welcome Body Content</label>
                  <textarea 
                    className="form-control" 
                    value={homeData.welcome_body}
                    onChange={(e) => setHomeData(p => ({ ...p, welcome_body: e.target.value }))}
                  ></textarea>
                </div>

                <h3 className="section-divider" style={{ marginTop: '30px' }}>3. Leadership Message Cards</h3>
                <div className="form-grid">
                  {/* Chairman */}
                  <div className="form-group span-cols">
                    <label>Chairman Name</label>
                    <input 
                      type="text" className="form-control" 
                      value={homeData.chairman_name}
                      onChange={(e) => setHomeData(p => ({ ...p, chairman_name: e.target.value }))}
                    />
                    <label style={{ marginTop: '8px' }}>Chairman Message</label>
                    <textarea 
                      className="form-control" 
                      value={homeData.chairman_message}
                      onChange={(e) => setHomeData(p => ({ ...p, chairman_message: e.target.value }))}
                    ></textarea>
                  </div>
                  
                  {/* Principal */}
                  <div className="form-group span-cols">
                    <label>Principal Name</label>
                    <input 
                      type="text" className="form-control" 
                      value={homeData.principal_name}
                      onChange={(e) => setHomeData(p => ({ ...p, principal_name: e.target.value }))}
                    />
                    <label style={{ marginTop: '8px' }}>Principal Message</label>
                    <textarea 
                      className="form-control" 
                      value={homeData.principal_message}
                      onChange={(e) => setHomeData(p => ({ ...p, principal_message: e.target.value }))}
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            {/* 2. ABOUT PAGE FIELDS */}
            {selectedPage === 'about' && (
              <>
                <div className="form-group">
                  <label>School Overview Paragraph</label>
                  <textarea 
                    className="form-control" 
                    value={aboutData.overview}
                    onChange={(e) => setAboutData(p => ({ ...p, overview: e.target.value }))}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Vision Statement</label>
                  <textarea 
                    className="form-control" 
                    value={aboutData.vision}
                    onChange={(e) => setAboutData(p => ({ ...p, vision: e.target.value }))}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Mission Statement</label>
                  <textarea 
                    className="form-control" 
                    value={aboutData.mission}
                    onChange={(e) => setAboutData(p => ({ ...p, mission: e.target.value }))}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>School Founding History</label>
                  <textarea 
                    className="form-control" 
                    value={aboutData.history}
                    onChange={(e) => setAboutData(p => ({ ...p, history: e.target.value }))}
                  ></textarea>
                </div>
              </>
            )}

            {/* 3. ACADEMICS PAGE FIELDS */}
            {selectedPage === 'academics' && (
              <>
                <div className="form-group">
                  <label>Curriculum Outline Description</label>
                  <textarea 
                    className="form-control" 
                    value={academicsData.curriculum}
                    onChange={(e) => setAcademicsData(p => ({ ...p, curriculum: e.target.value }))}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Examinations & Assessment Guidelines</label>
                  <textarea 
                    className="form-control" 
                    value={academicsData.examinations}
                    onChange={(e) => setAcademicsData(p => ({ ...p, examinations: e.target.value }))}
                  ></textarea>
                </div>

                <h3 className="section-divider" style={{ marginTop: '30px' }}>School Working Shift Timings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Summer Timings (e.g. 07:30 AM - 01:30 PM)</label>
                    <input 
                      type="text" className="form-control" 
                      value={academicsData.summer_timings}
                      onChange={(e) => setAcademicsData(p => ({ ...p, summer_timings: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Winter Timings (e.g. 08:15 AM - 02:15 PM)</label>
                    <input 
                      type="text" className="form-control" 
                      value={academicsData.winter_timings}
                      onChange={(e) => setAcademicsData(p => ({ ...p, winter_timings: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Save Buttons */}
            <button
              type="submit"
              className="btn btn-accent save-btn-full"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="spinner-icon-btn" size={18} />
                  <span>Publishing Modifications...</span>
                </>
              ) : (
                <span>Save and Publish Changes</span>
              )}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .page-header-flex { margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 1.8rem; }
        .page-header-flex .subtitle { color: var(--color-text-muted); font-size: 0.9rem; }
        
        .alert-badge { padding: 12px 20px; border-radius: var(--radius-sm); font-weight: 500; font-size: 0.9rem; margin-bottom: 20px; }
        .alert-badge.success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .alert-badge.error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }

        .selector-card { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; padding: 18px 24px; }
        .selector-card label { font-weight: 600; font-size: 0.95rem; }
        .page-select-dropdown { padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: var(--radius-sm); font-size: 0.95rem; outline: none; }
        
        .editor-form-card { border-top: 4px solid var(--color-primary); }
        .editor-badge-header { display: inline-flex; align-items: center; gap: 6px; background-color: #f1f5f9; padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: var(--color-accent); margin-bottom: 24px; }
        
        .section-divider { border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; font-size: 1.15rem; color: var(--color-primary); margin-bottom: 18px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .span-cols { grid-column: span 2; }
        
        .cms-editor-form textarea { min-height: 120px; }
        .save-btn-full { width: 100%; padding: 12px; margin-top: 24px; }
        
        .spinner-icon-btn { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header-flex h1 {
            font-size: 1.4rem;
          }
          .selector-card {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .span-cols {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
