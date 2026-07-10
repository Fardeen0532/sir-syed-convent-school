import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Bus, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  Star,
  Phone
} from 'lucide-react';
import api from '../../services/api';
import logo from '../../assets/Main_logo.png';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const homeData = await api.getHome();
        setData(homeData);
        if (homeData.seo) {
          document.title = homeData.seo.meta_title;
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  if (loading) {
    return (
      <div className="home-loader-container">
        <img src={logo} alt="Loading..." className="loader-logo" />
        <div className="loader-bar"><div className="loader-bar-inner"></div></div>
        <p>Loading Sir Syed Convent School...</p>
        <style>{`
          .home-loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 80vh;
            gap: 18px;
          }
          .loader-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
            box-shadow: 0 4px 20px rgba(20, 92, 45, 0.15);
          }
          .loader-bar {
            width: 200px;
            height: 4px;
            background: var(--color-primary-pale, #e8f5ec);
            border-radius: 4px;
            overflow: hidden;
          }
          .loader-bar-inner {
            width: 40%;
            height: 100%;
            background: var(--gradient-gold, #D4A017);
            border-radius: 4px;
            animation: shimmer 1.2s ease-in-out infinite;
          }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
          .home-loader-container p { color: var(--color-text-muted); font-size: 0.9rem; }
        `}</style>
      </div>
    );
  }

  const { content, latestNotices, galleryPreview } = data || {};
  const hero = content?.hero || {};
  const welcome = content?.welcome || {};
  const chairman = content?.chairman_message || {};
  const principal = content?.principal_message || {};
  const benefits = content?.why_choose_us || [];

  return (
    <div className="home-page-container">
      {/* ═══ 1. HERO SECTION ═══ */}
      <section className="hero-section">        
        {/* Animated background shapes */}
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge-open">
            <Star size={14} />
            <Star size={14} />
            <Star size={14} />
            <Star size={14} />
            <Star size={14} />
          </div>

          <h1>{hero.title || 'Sir Syed Convent School'}</h1>
          <p className="hero-tagline">{hero.subtitle || 'Empowering Minds, Shaping Futures'}</p>
          
          <div className="hero-motto">
            <span>"My Lord, Increase Me In My Knowledge"</span>
          </div>

          <div className="hero-cta-group">
            <Link to={hero.cta_link || '/admissions'} className="btn btn-accent btn-hero-primary">
              <span>{hero.cta_text || 'Online Admission Form'}</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-outline btn-hero-outline">
              Explore School
            </Link>
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Legacy</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Students Enrolled</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Expert Faculty</span>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ 2. WELCOME SECTION ═══ */}
      <section className="section welcome-section">
        <div className="container welcome-grid">
          <div className="welcome-text-block">
            <span className="small-highlight">✦ WELCOME TO SSCS</span>
            <h2>{welcome.title || 'Welcome Section'}</h2>
            <p className="welcome-body">{welcome.body || 'Welcome body content...'}</p>
            <div className="welcome-points">
              <div className="point-item">
                <div className="point-icon-wrap"><CheckCircle2 className="point-icon" size={18} /></div>
                <span>Nurturing leadership and values</span>
              </div>
              <div className="point-item">
                <div className="point-icon-wrap"><CheckCircle2 className="point-icon" size={18} /></div>
                <span>Modern science and computer laboratories</span>
              </div>
              <div className="point-item">
                <div className="point-icon-wrap"><CheckCircle2 className="point-icon" size={18} /></div>
                <span>Experienced faculty from premier universities</span>
              </div>
            </div>
            <Link to="/about" className="btn btn-primary welcome-cta">
              Read Our Story <ArrowRight size={16} />
            </Link>
          </div>
          <div className="welcome-visual-block">
            <div className="visual-card visual-card-main">
              <img src={logo} alt="Sir Syed Convent School" className="welcome-logo" />
              <h3>Sir Syed Convent School</h3>
              <p>Pahasu, Bulandshahr</p>
            </div>
            <div className="visual-card visual-card-badge">
              <Award size={32} className="badge-icon" />
              <span className="badge-number">15+</span>
              <span className="badge-label">Years of Academic Dedication</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. LEADERSHIP MESSAGES ═══ */}
      <section className="section section-bg messages-section">
        <div className="container">
          <h2 className="section-title">Leadership Messages</h2>
          <p className="section-subtitle">Hear from the pillars of Sir Syed Convent School</p>
          
          <div className="grid-2 message-grid">
            <div className="card message-card card-accent">
              <div className="quote-badge">"</div>
              <p className="message-text">"{chairman.message}"</p>
              <div className="profile-footer">
                <div className="profile-avatar">{chairman.name?.charAt(0)}</div>
                <div className="profile-details">
                  <h4>{chairman.name}</h4>
                  <span>{chairman.role}</span>
                </div>
              </div>
            </div>

            <div className="card message-card card-accent">
              <div className="quote-badge">"</div>
              <p className="message-text">"{principal.message}"</p>
              <div className="profile-footer">
                <div className="profile-avatar">{principal.name?.charAt(0)}</div>
                <div className="profile-details">
                  <h4>{principal.name}</h4>
                  <span>{principal.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. WHY CHOOSE US ═══ */}
      <section className="section benefits-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-subtitle">Excellence in primary and secondary education</p>

          <div className="grid-4 benefits-grid">
            {benefits.map((benefit, index) => {
              const icons = [Award, ShieldCheck, Bus, BookOpen];
              const Icon = icons[index % icons.length];
              return (
                <div className="card benefit-card" key={index} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="benefit-icon-wrapper">
                    <Icon size={26} />
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 5. NOTICES ═══ */}
      <section className="section section-bg notices-preview-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Latest Notices</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>Stay informed with recent school announcements</p>
            </div>
            <Link to="/notices" className="btn btn-outline btn-sm flex-cta">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="notices-list-preview">
            {latestNotices && latestNotices.length > 0 ? (
              latestNotices.map((notice) => (
                <div className="notice-row" key={notice.id}>
                  <div className="notice-date">
                    <Calendar size={18} />
                    <span>{new Date(notice.publish_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="notice-main">
                    <h3>{notice.title}</h3>
                    <p>{notice.description}</p>
                  </div>
                  {notice.attachment && (
                    <a href={notice.attachment} className="btn btn-accent btn-sm" download>
                      Download
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data-text">No active notices posted currently.</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 6. GALLERY ═══ */}
      <section className="section gallery-preview-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Campus & Life Gallery</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>Glimpses of daily school activities and events</p>
            </div>
            <Link to="/gallery" className="btn btn-outline btn-sm flex-cta">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-4 gallery-grid-preview">
            {galleryPreview && galleryPreview.length > 0 ? (
              galleryPreview.map((img) => (
                <div className="gallery-preview-card" key={img.id}>
                  <div className="gallery-placeholder">
                    <span className="cat-badge">{img.category}</span>
                    <p className="title">{img.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-text">No gallery images uploaded yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 7. CONTACT CTA ═══ */}
      <section className="contact-cta-section">
        <div className="container cta-box">
          <div className="cta-icon-circle">
            <Phone size={32} />
          </div>
          <h2>Ready to Shape Your Child's Future?</h2>
          <p>Get in touch with our administrative staff or schedule a campus tour today.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-accent">
              Contact School <ArrowRight size={16} />
            </Link>
            <a href="tel:+918191985717" className="btn btn-outline btn-hero-outline">
              📞 +91 81919 85717
            </a>
          </div>
        </div>
      </section>

      <style>{`
        /* ═══ HERO ═══ */
        .hero-section {
          background: var(--gradient-hero);
          color: #fff;
          padding: 100px 0 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: var(--gradient-gold);
        }

        .hero-bg-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.06;
          background: #fff;
        }
        .shape-1 { width: 400px; height: 400px; top: -100px; right: -100px; animation: float 8s ease-in-out infinite; }
        .shape-2 { width: 300px; height: 300px; bottom: -80px; left: -80px; animation: float 10s ease-in-out infinite reverse; }
        .shape-3 { width: 180px; height: 180px; top: 40%; left: 10%; animation: float 6s ease-in-out infinite 1s; }

        .hero-content { max-width: 850px; margin: 0 auto; position: relative; z-index: 1; }

        .hero-badge-open {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 160, 23, 0.2);
          border: 1px solid rgba(212, 160, 23, 0.4);
          color: var(--color-accent);
          font-weight: 700;
          font-size: 0.82rem;
          padding: 8px 22px;
          border-radius: var(--radius-full);
          margin-bottom: 28px;
          letter-spacing: 1.5px;
          backdrop-filter: blur(6px);
        }

        .hero-section h1 {
          color: #fff;
          font-size: 3.8rem;
          font-weight: 800;
          margin-bottom: 18px;
          line-height: 1.1;
          text-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .hero-tagline {
          color: rgba(255,255,255,0.85);
          font-size: 1.35rem;
          margin-bottom: 20px;
          font-weight: 300;
        }
        .hero-motto {
          margin-bottom: 36px;
        }
        .hero-motto span {
          display: inline-block;
          font-family: var(--font-heading);
          font-style: italic;
          color: var(--color-accent);
          font-size: 1.1rem;
          padding: 8px 24px;
          border-left: 3px solid var(--color-accent);
          border-right: 3px solid var(--color-accent);
          letter-spacing: 0.5px;
        }

        .hero-cta-group {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 50px;
        }
        .btn-hero-primary {
          padding: 15px 32px;
          font-size: 1rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding: 28px 48px;
        }
        .stat-item { text-align: center; }
        .stat-number { display: block; font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--color-accent); }
        .stat-label { font-size: 0.82rem; color: rgba(255,255,255,0.7); letter-spacing: 0.5px; }
        .stat-divider { width: 1px; height: 48px; background: rgba(255,255,255,0.15); }

        /* ═══ WELCOME ═══ */
        .welcome-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 60px; align-items: center; }
        .small-highlight { color: var(--color-accent); font-weight: 700; letter-spacing: 2px; font-size: 0.82rem; margin-bottom: 14px; display: block; font-family: var(--font-accent); }
        .welcome-text-block h2 { font-size: 2.4rem; margin-bottom: 20px; }
        .welcome-body { color: var(--color-text-muted); margin-bottom: 28px; font-size: 1.05rem; }
        .welcome-points { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
        .point-item { display: flex; align-items: center; gap: 14px; }
        .point-icon-wrap {
          width: 32px; height: 32px;
          background: var(--color-primary-pale);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .point-icon { color: var(--color-primary-light); }
        .point-item span { font-weight: 500; }
        .welcome-cta { margin-top: 8px; }

        .welcome-visual-block { position: relative; }
        .visual-card {
          border-radius: var(--radius-lg);
          padding: 40px;
          text-align: center;
        }
        .visual-card-main {
          background: var(--gradient-hero);
          color: #fff;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .welcome-logo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          margin-bottom: 20px;
          animation: float 5s ease-in-out infinite;
        }
        .visual-card-main h3 { color: #fff; font-size: 1.5rem; margin-bottom: 4px; }
        .visual-card-main p { color: rgba(255,255,255,0.7); font-size: 0.95rem; }

        .visual-card-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: #fff;
          box-shadow: var(--shadow-lg);
          padding: 20px 24px;
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-accent);
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
        .badge-icon { color: var(--color-accent); margin-bottom: 4px; }
        .badge-number { display: block; font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--color-primary); }
        .badge-label { font-size: 0.75rem; color: var(--color-text-muted); display: block; }

        /* ═══ MESSAGES ═══ */
        .quote-badge { font-size: 4.5rem; font-family: 'Georgia', serif; color: var(--color-accent); line-height: 0.5; margin-bottom: 16px; opacity: 0.6; }
        .message-card { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .message-text { font-style: italic; color: var(--color-text-body); margin-bottom: 28px; font-size: 1.02rem; line-height: 1.8; }
        .profile-footer { display: flex; align-items: center; gap: 14px; padding-top: 20px; border-top: 1px solid rgba(20, 92, 45, 0.06); }
        .profile-avatar {
          width: 44px; height: 44px;
          background: var(--gradient-primary);
          color: #fff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1.1rem;
        }
        .profile-details h4 { font-size: 1.05rem; }
        .profile-details span { font-size: 0.82rem; color: var(--color-text-muted); font-weight: 500; }

        /* ═══ BENEFITS ═══ */
        .benefit-card {
          text-align: center;
          border: 1px solid transparent;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .benefit-card:hover {
          border-color: var(--color-accent);
          box-shadow: var(--shadow-gold);
        }
        .benefit-icon-wrapper {
          width: 56px; height: 56px;
          background: var(--color-primary-pale);
          color: var(--color-primary-light);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          transition: all 0.3s ease;
        }
        .benefit-card:hover .benefit-icon-wrapper {
          background: var(--color-primary);
          color: #fff;
          transform: scale(1.1) rotate(-5deg);
        }
        .benefit-card h3 { font-size: 1.15rem; margin-bottom: 12px; }
        .benefit-card p { font-size: 0.9rem; color: var(--color-text-muted); }

        /* ═══ NOTICES ═══ */
        .section-header-flex {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 36px; padding-bottom: 20px;
          border-bottom: 2px solid var(--color-primary-pale);
        }
        .section-header-flex .section-title::after { display: none; }
        .notice-row {
          background: #fff; border-radius: var(--radius-md); padding: 24px 32px;
          display: flex; align-items: center; gap: 32px;
          margin-bottom: 14px; box-shadow: var(--shadow-xs);
          border-left: 4px solid transparent;
          transition: all 0.3s ease;
        }
        .notice-row:hover {
          border-left-color: var(--color-accent);
          box-shadow: var(--shadow-md);
          transform: translateX(4px);
        }
        .notice-date { display: flex; flex-direction: column; align-items: center; color: var(--color-accent); font-weight: 700; font-size: 0.88rem; min-width: 100px; gap: 4px; }
        .notice-main { flex-grow: 1; }
        .notice-main h3 { font-size: 1.15rem; margin-bottom: 5px; }
        .notice-main p { color: var(--color-text-muted); font-size: 0.92rem; }

        /* ═══ GALLERY ═══ */
        .gallery-preview-card { border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); }
        .gallery-placeholder {
          height: 240px;
          background: var(--gradient-primary);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 24px; text-align: center; color: #fff;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .gallery-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s ease;
        }
        .gallery-placeholder:hover::before { background: rgba(0,0,0,0.15); }
        .gallery-placeholder:hover { transform: scale(1.03); }
        .cat-badge { background: var(--color-accent); color: #1a2e1a; font-size: 0.72rem; padding: 4px 12px; border-radius: var(--radius-full); font-weight: 700; margin-bottom: 14px; letter-spacing: 0.5px; position: relative; z-index: 1; }
        .gallery-placeholder .title { font-weight: 600; font-size: 0.95rem; position: relative; z-index: 1; }

        /* ═══ CTA SECTION ═══ */
        .contact-cta-section {
          background: var(--gradient-hero);
          padding: 90px 0;
          color: #fff;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E");
        }
        .cta-box { max-width: 700px; position: relative; z-index: 1; }
        .cta-icon-circle {
          width: 72px; height: 72px;
          background: rgba(212, 160, 23, 0.15);
          border: 2px solid rgba(212, 160, 23, 0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          color: var(--color-accent);
          animation: pulse 2s ease-in-out infinite;
        }
        .contact-cta-section h2 { color: #fff; font-size: 2.3rem; margin-bottom: 14px; }
        .contact-cta-section p { color: rgba(255,255,255,0.75); font-size: 1.12rem; margin-bottom: 36px; }
        .cta-buttons { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

        .no-data-text { color: var(--color-text-muted); text-align: center; padding: 40px 0; font-style: italic; }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }

        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2.4rem; }
          .hero-tagline { font-size: 1.1rem; }
          .hero-stats { flex-direction: column; gap: 20px; padding: 24px; }
          .stat-divider { width: 60px; height: 1px; }
          .welcome-grid { grid-template-columns: 1fr; gap: 40px; }
          .visual-card-badge { position: relative; bottom: auto; right: auto; margin-top: 16px; }
          .hero-cta-group { flex-direction: column; align-items: center; }
          .notice-row { flex-direction: column; align-items: flex-start; gap: 14px; padding: 20px; }
          .notice-date { flex-direction: row; min-width: unset; gap: 8px; }
          .cta-buttons { flex-direction: column; }
          .section-header-flex { flex-direction: column; gap: 16px; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
