import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import logo from '../assets/Main_logo.png'; 

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notices', path: '/notices' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top accent bar */}
      <div className="top-accent-bar">
        <div className="container top-bar-inner">
          <span>📞 +91 81919 85717</span>
          <span>✉️ sirsyedconventschoolpahasu@gmail.com</span>
        </div>
      </div>

      <header className={`header-nav ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-container">
          <Link to="/" className="logo-section">
            <img src={logo} alt="Sir Syed Convent School" className="logo-image" />
            <div className="logo-text">
              <span className="school-name">Sir Syed Convent</span>
              <span className="school-tag">School · Pahasu</span>
            </div>
          </Link>

          <nav className="desktop-menu">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admissions" className="btn btn-accent btn-sm header-cta">
              <span>Apply Now</span>
              <ChevronRight size={16} />
            </Link>
          </nav>

          {/* Only render hamburger button if menu is closed to prevent overlapping duplication */}
          {!isOpen && (
            <button className="mobile-toggle" onClick={() => setIsOpen(true)} aria-label="Open menu">
              <Menu size={26} />
            </button>
          )}
        </div>

        {/* Mobile Menu with slide animation */}
        <nav className={`mobile-menu ${isOpen ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-brand">
            <div className="mobile-brand-left">
              <img src={logo} alt="Logo" className="mobile-logo" />
              <span>Sir Syed Convent School</span>
            </div>
            
            {/* 👇 INSIDE SIDEBAR CLOSE BUTTON WITH DEDICATED STYLING */}
            <button 
              className="mobile-close-btn" 
              onClick={() => setIsOpen(false)} 
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.path}
              className={`mobile-nav-item ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admissions"
            className="btn btn-accent cta-mobile"
            onClick={() => setIsOpen(false)}
          >
            Apply Now
          </Link>
        </nav>
      </header>

      <style>{`
        .top-accent-bar {
          background: var(--color-primary);
          color: rgba(255,255,255,0.85);
          font-size: 0.78rem;
          padding: 6px 0;
          border-bottom: 2px solid var(--color-accent);
        }
        .top-bar-inner {
          display: flex;
          justify-content: flex-end;
          gap: 28px;
        }
        .top-bar-inner span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(20, 92, 45, 0.08);
          color: var(--color-text-dark);
          height: var(--header-height);
          display: flex;
          align-items: center;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .header-scrolled {
          box-shadow: 0 4px 24px rgba(20, 92, 45, 0.08);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 14px;
          transition: transform 0.2s ease;
        }
        .logo-section:hover {
          transform: scale(1.02);
        }

        .logo-image {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary-light);
          box-shadow: 0 3px 12px rgba(20, 92, 45, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .logo-section:hover .logo-image {
          transform: rotate(-5deg) scale(1.05);
          box-shadow: 0 4px 16px rgba(20, 92, 45, 0.18);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .school-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.3rem;
          line-height: 1.2;
          color: var(--color-primary);
        }
        .school-tag {
          font-family: var(--font-accent);
          font-size: 0.72rem;
          color: var(--color-text-muted);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .desktop-menu {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-item {
          font-family: var(--font-accent);
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-text-body);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          position: relative;
          transition: color 0.25s ease, background 0.25s ease;
        }
        .nav-item:hover {
          color: var(--color-primary);
          background: var(--color-primary-pale);
        }
        .nav-item.active {
          color: var(--color-primary);
          font-weight: 600;
        }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
          height: 3px;
          background: var(--gradient-gold);
          border-radius: 2px;
        }

        .header-cta {
          margin-left: 12px;
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: background 0.2s ease;
        }
        .mobile-toggle:hover {
          background: var(--color-primary-pale);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 300px;
          height: 100vh;
          background: #fff;
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 4px;
          z-index: 10000;
          box-shadow: -8px 0 40px rgba(0,0,0,0.12);
          transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }
        .mobile-menu-open {
          right: 0;
        }

        .mobile-menu-brand {
          display: flex;
          align-items: center;
          justify-content: space-between; /* Pushes close button to far right */
          padding-bottom: 20px;
          margin-bottom: 8px;
          border-bottom: 2px solid var(--color-primary-pale);
        }
        
        .mobile-brand-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          color: var(--color-primary);
          font-family: var(--font-heading);
          font-size: 0.95rem;
        }
        
        /* New explicit closing X rules */
        .mobile-close-btn {
          background: transparent;
          border: none;
          color: var(--color-text-body);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: color 0.2s, background 0.2s;
        }
        .mobile-close-btn:hover {
          color: var(--color-primary);
          background: var(--color-primary-pale);
        }

        .mobile-logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary-light);
        }

        .mobile-nav-item {
          padding: 12px 14px;
          font-weight: 500;
          color: var(--color-text-body);
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
          animation: fadeInUp 0.3s ease-out both;
        }
        .mobile-nav-item:hover, .mobile-nav-item.active {
          background: var(--color-primary-pale);
          color: var(--color-primary);
          padding-left: 20px;
        }

        .cta-mobile {
          text-align: center;
          margin-top: 16px;
          width: 100%;
          justify-content: center;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1100px) {
          .desktop-menu {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
        }

        @media (max-width: 600px) {
          .top-accent-bar {
            display: none;
          }
          .logo-image {
            width: 42px;
            height: 42px;
          }
          .school-name {
            font-size: 1.1rem;
          }
          .mobile-menu {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}