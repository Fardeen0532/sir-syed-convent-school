import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import logo from '../assets/Main_logo.png';
export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-pattern"></div>
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col">
          <div className="footer-logo">
            <img src={logo} alt="Sir Syed Convent School Logo" className="footer-logo-img" />
            <div>
              <h4>Sir Syed Convent School</h4>
              <span className="footer-tagline">Empowering Minds, Shaping Futures</span>
            </div>
          </div>
          <p className="footer-desc">
            Named in honor of Sir Syed Ahmad Khan, our school is dedicated to spreading enlightenment through academic excellence, modern resources, and strong moral values.
          </p>
          <div className="footer-contact-details">
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="contact-detail">
              <div className="contact-icon-wrap"><MapPin size={16} /></div>
              <span>Pahasu, District Bulandshahr, UP - 203396</span>
            </a>
            <a href="tel:+918191985717" className="contact-detail">
              <div className="contact-icon-wrap"><Phone size={16} /></div>
              <span>+91 81919 85717</span>
            </a>
            <a href="mailto:sirsyedconventschoolpahasu@gmail.com" className="contact-detail">
              <div className="contact-icon-wrap"><Mail size={16} /></div>
              <span>sirsyedconventschoolpahasu@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <nav className="footer-links">
            {[
              { name: 'About Overview', path: '/about' },
              { name: 'Academics & Timing', path: '/academics' },
              { name: 'Admissions Portal', path: '/admissions' },
              { name: 'Campus Facilities', path: '/facilities' },
              { name: 'Faculty & Board', path: '/faculty' },
              { name: 'Photo Gallery', path: '/gallery' },
              { name: 'Notice Board', path: '/notices' },
            ].map(link => (
              <Link key={link.path} to={link.path}>
                <ArrowRight size={14} className="link-arrow" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Regions Column */}
        <div className="footer-col">
          <h4>Service Regions</h4>
          <p className="footer-seo-text">
            Direct bus network and admission for students from:
          </p>
          <div className="seo-tags">
            {['Pahasu', 'Bulandshahr', 'Khurja', 'Dibai', 'Shikarpur', 'Aligarh', 'Anupshahr', 'Jahangirabad'].map(tag => (
              <span className="seo-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>© {new Date().getFullYear()} Sir Syed Convent School. All Rights Reserved </p>
          <p> Powered by Himfox technologies</p>
          <div className="admin-link">
            <Link to="/admin/login">Staff Admin Portal →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background: var(--color-primary);
          color: rgba(255,255,255,0.8);
          padding: 80px 0 0;
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
        }
        .footer-pattern {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 50px;
          margin-bottom: 50px;
          position: relative;
          z-index: 1;
        }

        .footer-col h4 {
          color: #fff;
          font-size: 1.15rem;
          margin-bottom: 24px;
          font-family: var(--font-heading);
          position: relative;
          padding-bottom: 12px;
        }
        .footer-col h4::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 36px;
          height: 3px;
          background: var(--gradient-gold);
          border-radius: 2px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .footer-logo-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(212, 160, 23, 0.35);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .footer-logo h4 {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          font-size: 1.25rem !important;
        }
        .footer-logo h4::after { display: none !important; }
        .footer-tagline {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: var(--font-accent);
        }

        .footer-desc {
          margin-bottom: 24px;
          line-height: 1.7;
          color: rgba(255,255,255,0.6);
        }

        .footer-contact-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-detail {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          padding: 6px 0;
        }
        .contact-detail:hover {
          color: var(--color-accent);
          transform: translateX(4px);
        }
        .contact-icon-wrap {
          width: 32px;
          height: 32px;
          background: rgba(212, 160, 23, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .contact-detail:hover .contact-icon-wrap {
          background: var(--color-accent);
          color: #1a2e1a;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-links a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.65);
        }
        .link-arrow {
          color: var(--color-accent);
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.3s ease;
        }
        .footer-links a:hover {
          color: var(--color-accent);
          transform: translateX(6px);
        }
        .footer-links a:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .footer-seo-text {
          margin-bottom: 16px;
          line-height: 1.6;
          color: rgba(255,255,255,0.55);
        }
        .seo-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .seo-tag {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6);
          padding: 5px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        .seo-tag:hover {
          background: rgba(212, 160, 23, 0.15);
          color: var(--color-accent);
          border-color: rgba(212, 160, 23, 0.3);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 22px 0;
          background: rgba(0,0,0,0.15);
          position: relative;
          z-index: 1;
        }
        .bottom-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
        }
        .admin-link a {
          color: var(--color-accent);
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .admin-link a:hover {
          text-decoration: underline;
          color: #E8C547;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .bottom-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
