import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Faculty() {
  return (
    <div className="faculty-page">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <h1>Our Faculty</h1>
          <p>Meet the distinguished mentors guiding students toward excellence</p>
        </div>
      </section>

      {/* AMU Graduate Spotlight */}
      <section className="section spotlight-section">
        <div className="container spotlight-card card card-glass">
          <GraduationCap className="spotlight-icon" size={48} />
          <h2>AMU Graduates Faculty Hub</h2>
          <p>
            At Sir Syed Convent School, we take immense pride in our core teaching credentials. 
            A significant portion of our administrative heads and senior subject mentors are 
            distinguished alumni of Aligarh Muslim University (AMU), ensuring the highest caliber of academic pedagogy, 
            moral training, and grooming standards.
          </p>
        </div>
      </section>

      <style>{`
        .spotlight-card {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          background-color: var(--color-primary);
          color: #fff;
          padding: 40px 60px;
        }
        .spotlight-card h2 {
          color: #fff;
          font-size: 2rem;
          margin: 16px 0 12px;
        }
        .spotlight-card p {
          color: #cbd5e1;
          font-size: 1.1rem;
          line-height: 1.7;
        }
        .spotlight-icon {
          color: var(--color-accent);
        }
      `}</style>
    </div>
  );
}

