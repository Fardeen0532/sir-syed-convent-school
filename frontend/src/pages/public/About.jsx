import React, { useEffect, useState } from 'react';
import { Loader2, Users, Target, BookOpen, Compass, Award, Star } from 'lucide-react';
import api from '../../services/api';
import logo from '../../assets/Main_logo.png'

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutData = await api.getAbout();
        setData(aboutData);
        if (aboutData.seo) {
          document.title = aboutData.seo.meta_title;
        }
      } catch (err) {
        console.error('Error fetching about page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="about-loader-container">
        <img src={logo} alt="Loading..." className="loader-logo" />
        <div className="loader-bar"><div className="loader-bar-inner"></div></div>
        <p>Loading school history and vision...</p>
        <style>{`
          .about-loader-container {
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
          .about-loader-container p { color: var(--color-text-muted); font-size: 0.9rem; }
        `}</style>
      </div>
    );
  }

  const { content } = data || {};

  return (
    <div className="about-page animate-fade-in">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <span className="banner-subtitle">ESTABLISHED 2017</span>
          <h1>About Our Institution</h1>
          <p>Inspiring young minds with academic rigor and moral values in bulandshahr region</p>
        </div>
      </section>

      {/* Overview */}
      <section className="section overview-section">
        <div className="container">
          <div className="overview-card card card-accent">
            <span className="overview-crest">✦</span>
            <h2>School Overview</h2>
            <p className="overview-text">{content?.overview}</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section section-bg vision-mission-section">
        <div className="container grid-2">
          <div className="card vision-card card-accent-gold">
            <div className="icon-wrapper bg-gold-gradient">
              <Compass size={28} />
            </div>
            <h3>Our Vision</h3>
            <p>{content?.vision}</p>
          </div>

          <div className="card mission-card card-accent-green">
            <div className="icon-wrapper bg-green-gradient">
              <Target size={28} />
            </div>
            <h3>Our Mission</h3>
            <p>{content?.mission}</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section history-section">
        <div className="container grid-2 align-center">
          <div className="history-text">
            <span className="small-highlight">✦ OUR LEGACY</span>
            <h2>Our History</h2>
            <p className="history-paragraph">{content?.history}</p>
          </div>
          <div className="history-shield card">
            <div className="shield-icon-wrapper">
              <BookOpen size={48} className="shield-icon" />
            </div>
            <h3>Honoring Sir Syed Ahmad Khan</h3>
            <p>
              Founded with the objective of bringing modern sciences and English-medium education 
              to Bulandshahr, Khurja, and Dibai regions, reflecting the educational vision of Aligarh Muslim University's pioneer.
            </p>
            <div className="shield-stars">
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
            </div>
          </div>
        </div>
      </section>

      {/* Management Committee */}
      <section className="section section-bg management-section">
        <div className="container">
          <h2 className="section-title">Management Committee</h2>
          <p className="section-subtitle">Dedicated leadership steering Sir Syed Convent School</p>

          <div className="grid-4 committee-grid">
            {content?.management?.map((member, index) => (
              <div className="card member-card" key={index} style={{ animationDelay: `${index * 80}ms` }}>
                <div className="member-avatar-wrapper">
                  <div className="member-avatar">
                    <span>{member.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="avatar-ring"></div>
                </div>
                <h3>{member.name}</h3>
                <span className="member-role">{member.role}</span>
              </div>
            ))}
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

        .overview-card {
          text-align: center;
          max-width: 960px;
          margin: 0 auto;
          padding: 50px 40px;
          position: relative;
        }
        .overview-crest {
          font-size: 1.8rem;
          color: var(--color-accent);
          display: block;
          margin-bottom: 12px;
        }
        .overview-card h2 {
          font-size: 2rem;
          margin-bottom: 20px;
        }
        .overview-text {
          font-size: 1.15rem;
          color: var(--color-text-body);
          line-height: 1.9;
        }
        
        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: #fff;
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease;
        }
        .card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }
        
        .bg-gold-gradient {
          background: var(--gradient-gold);
          color: #1a2e1a;
        }
        .bg-green-gradient {
          background: var(--gradient-primary);
          color: #fff;
        }

        .card-accent-gold {
          border-top: 4px solid var(--color-accent);
        }
        .card-accent-green {
          border-top: 4px solid var(--color-primary-light);
        }

        .vision-card h3, .mission-card h3 {
          font-size: 1.6rem;
          margin-bottom: 16px;
        }
        
        .align-center {
          align-items: center;
        }
        .history-text {
          padding-right: 20px;
        }
        .history-text h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .history-paragraph {
          color: var(--color-text-body);
          font-size: 1.08rem;
          line-height: 1.8;
        }
        .history-shield {
          text-align: center;
          padding: 50px 40px;
          background: var(--gradient-hero);
          color: #fff;
          border: none;
          box-shadow: var(--shadow-xl);
          border-radius: var(--radius-lg);
          position: relative;
          overflow: hidden;
        }
        .history-shield::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E");
        }
        .shield-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .history-shield h3 {
          color: #fff;
          margin: 0 0 16px;
          font-size: 1.6rem;
        }
        .history-shield p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .shield-icon {
          color: var(--color-accent);
          animation: float 4s ease-in-out infinite;
        }
        .shield-stars {
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        /* Management Committee Profiles */
        .committee-grid {
          margin-top: 20px;
        }
        .member-card {
          text-align: center;
          padding: 36px 24px;
          border: 1px solid rgba(20, 92, 45, 0.05);
        }
        .member-avatar-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
        }
        .member-avatar {
          width: 100%;
          height: 100%;
          background: var(--color-primary-pale);
          color: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.6rem;
          position: relative;
          z-index: 2;
          box-shadow: var(--shadow-sm);
        }
        .avatar-ring {
          position: absolute;
          inset: -4px;
          border: 2px solid var(--color-accent);
          border-radius: 50%;
          opacity: 0.4;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .member-card:hover .avatar-ring {
          transform: scale(1.1);
          opacity: 0.8;
          border-color: var(--color-accent-hover);
        }
        .member-card h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        .member-role {
          font-family: var(--font-accent);
          font-size: 0.85rem;
          color: var(--color-accent-hover);
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        @media (max-width: 768px) {
          .overview-card {
            padding: 30px 20px;
          }
          .history-text {
            padding-right: 0;
            margin-bottom: 30px;
          }
          .history-shield {
            padding: 36px 20px;
          }
        }
      `}</style>
    </div>
  );
}
