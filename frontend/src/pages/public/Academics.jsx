import React, { useEffect, useState } from 'react';
import { Loader2, Calendar, BookOpen, FileText, Clock, GraduationCap, Compass, Sun, Snowflake } from 'lucide-react';
import api from '../../services/api';
import logo from '../../assets/Main_logo.png'
export default function Academics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        const acadData = await api.getAcademics();
        setData(acadData);
        if (acadData.seo) {
          document.title = acadData.seo.meta_title;
        }
      } catch (err) {
        console.error('Error fetching academics page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademics();
  }, []);

  if (loading) {
    return (
      <div className="acad-loader-container">
        <img src={logo} alt="Loading..." className="loader-logo" />
        <div className="loader-bar"><div className="loader-bar-inner"></div></div>
        <p>Loading curriculum and academic details...</p>
        <style>{`
          .acad-loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
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
          .acad-loader-container p { color: var(--color-text-muted); font-size: 0.9rem; }
        `}</style>
      </div>
    );
  }

  const { content } = data || {};

  return (
    <div className="academics-page animate-fade-in">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <span className="banner-subtitle">HOLISTIC DEVELOPMENT</span>
          <h1>Academics & Curriculum</h1>
          <p>Exemplary CBSE education combined with digital learning systems</p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section curriculum-section">
        <div className="container">
          <div className="curriculum-card card card-accent">
            <div className="badge-academic">CBSE PATTERN</div>
            <h2>Our Educational Curriculum</h2>
            <p>{content?.curriculum}</p>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="section section-bg subjects-section">
        <div className="container">
          <h2 className="section-title">Academic Streams</h2>
          <p className="section-subtitle">Structured academic stages designed for holistic learning</p>

          <div className="grid-3 subjects-grid">
            {content?.subjects?.map((subj, index) => {
              const stageIcons = [GraduationCap, BookOpen, Compass];
              const Icon = stageIcons[index % stageIcons.length];
              return (
                <div className="card subject-card" key={index} style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="subject-icon-box">
                    <Icon size={24} />
                  </div>
                  <h3>{subj.stage}</h3>
                  <div className="subjects-list-container">
                    {subj.list?.split(',').map((item, idx) => (
                      <span key={idx} className="subject-tag-pill">{item.trim()}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exams & Timings */}
      <section className="section exams-timings-section">
        <div className="container grid-2">
          {/* Examinations */}
          <div className="card exam-card card-accent-green">
            <div className="exam-header">
              <div className="exam-icon-wrap">
                <FileText size={26} className="exam-icon" />
              </div>
              <h3>Examination & Assessment</h3>
            </div>
            <p className="exam-text">{content?.examinations}</p>
          </div>

          {/* Timings */}
          <div className="card timing-card card-accent-gold">
            <div className="exam-header">
              <div className="exam-icon-wrap">
                <Clock size={26} className="exam-icon" />
              </div>
              <h3>School Working Hours</h3>
            </div>
            <p className="timing-desc">Separate summer and winter shift schedules for comfort:</p>
            <div className="timing-shifts">
              <div className="shift">
                <span className="shift-name">
                  <Sun size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-accent)' }} />
                  Summer Timings:
                </span>
                <span className="shift-time">{content?.timings?.summer}</span>
              </div>
              <div className="shift">
                <span className="shift-name">
                  <Snowflake size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary-light)' }} />
                  Winter Timings:
                </span>
                <span className="shift-time">{content?.timings?.winter}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .banner-subtitle {
          display: inline-block;
          font-family: var(--font-accent);
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--color-accent);
          letter-spacing: 2px;
          margin-bottom: 12px;
        }

        .curriculum-card {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          padding: 50px 40px;
        }
        .badge-academic {
          display: inline-block;
          background: var(--gradient-gold);
          color: #1a2e1a;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          margin-bottom: 20px;
          letter-spacing: 1px;
          box-shadow: 0 2px 10px rgba(212, 160, 23, 0.2);
        }
        .curriculum-card h2 {
          margin-bottom: 16px;
          font-size: 2rem;
        }
        .curriculum-card p {
          font-size: 1.12rem;
          line-height: 1.8;
          color: var(--color-text-body);
        }
        
        .subject-card {
          border-top: 4px solid var(--color-primary-light);
          padding: 36px 30px;
        }
        .subject-icon-box {
          width: 52px;
          height: 52px;
          background-color: var(--color-primary-pale);
          color: var(--color-primary-light);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }
        .subject-card:hover .subject-icon-box {
          background: var(--gradient-primary);
          color: #fff;
          transform: scale(1.1) rotate(-5deg);
        }
        .subject-card h3 {
          font-size: 1.35rem;
          margin-bottom: 18px;
        }
        .subjects-list-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .subject-tag-pill {
          background-color: #fff;
          color: var(--color-text-body);
          border: 1px solid rgba(20, 92, 45, 0.1);
          font-size: 0.8rem;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .subject-card:hover .subject-tag-pill {
          border-color: rgba(20, 92, 45, 0.2);
          background-color: var(--color-primary-pale);
          color: var(--color-primary);
        }

        .card-accent-green {
          border-top: 4px solid var(--color-primary-light);
        }
        .card-accent-gold {
          border-top: 4px solid var(--color-accent);
        }

        .exam-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .exam-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--color-primary-pale);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .exam-icon {
          color: var(--color-primary-light);
        }
        .exam-card h3, .timing-card h3 {
          font-size: 1.45rem;
          margin: 0;
        }
        .exam-text {
          line-height: 1.8;
          color: var(--color-text-body);
        }
        .timing-desc {
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
        .timing-shifts {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .shift {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background-color: #fcfcfc;
          border: 1px solid rgba(20, 92, 45, 0.04);
          border-radius: var(--radius-sm);
          border-left: 4px solid var(--color-accent);
          font-weight: 600;
          box-shadow: var(--shadow-xs);
          transition: all 0.3s ease;
        }
        .shift:hover {
          transform: translateX(4px);
          box-shadow: var(--shadow-sm);
        }
        .shift-name {
          color: var(--color-primary);
          font-size: 0.95rem;
        }
        .shift-time {
          color: var(--color-accent-hover);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .curriculum-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
