import React from 'react';
import { 
  Laptop, 
  BookOpen, 
  Wind, 
  Lightbulb, 
  Flame, 
  Trophy, 
  Bus 
} from 'lucide-react';

export default function Facilities() {
  const facilitiesList = [
    {
      name: 'Smart Classrooms',
      icon: Lightbulb,
      desc: 'All classrooms are equipped with digital smartboards, audio visual aids, and interactive projectors to enhance conceptual clarity.',
      color: '#f59e0b'
    },
    {
      name: 'Air Conditioned (AC) Rooms',
      icon: Wind,
      desc: 'Comfortable temperature-controlled environment throughout the campus to maintain student focus during high heat waves of summer.',
      color: '#3b82f6'
    },
    {
      name: 'Modern Science Laboratory',
      icon: Flame,
      desc: 'Stocked with complete chemicals, test tubes, slides, microscopes, and instrumentation for Physics, Chemistry, and Biology experiments.',
      color: '#ef4444'
    },
    {
      name: 'High-Tech Computer Lab',
      icon: Laptop,
      desc: 'Over 30 individual workstations connected to high-speed internet and equipped with modern educational programming packages.',
      color: '#10b981'
    },
    {
      name: 'Rich School Library',
      icon: BookOpen,
      desc: 'A spacious, quiet reading zone with a compilation of over 5000+ reference volumes, encyclopedias, journals, and daily newspapers.',
      color: '#8b5cf6'
    },
    {
      name: 'Sports Ground & Athletics',
      icon: Trophy,
      desc: 'Huge open fields containing dedicated volleyball nets, football goals, cricket pitches, and badminton courts for physical drills.',
      color: '#ec4899'
    },
    {
      name: 'GPS Transport Network',
      icon: Bus,
      desc: 'A secure bus transit fleet covering Aligarh, Khurja, Dibai, Shikarpur, and Pahasu with verified personnel and real-time tracking.',
      color: '#06b6d4'
    }
  ];

  return (
    <div className="facilities-page">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <h1>Campus Facilities</h1>
          <p>Explore the modern infrastructure driving student growth at Sir Syed Convent School</p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section facilities-grid-section">
        <div className="container">
          <div className="grid-3 facilities-grid">
            {facilitiesList.map((fac, index) => {
              const Icon = fac.icon;
              return (
                <div className="card facility-card" key={index}>
                  <div className="fac-icon-wrapper" style={{ backgroundColor: `${fac.color}15`, color: fac.color }}>
                    <Icon size={28} />
                  </div>
                  <h3>{fac.name}</h3>
                  <p>{fac.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .facility-card {
          border-bottom: 4px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .facility-card:hover {
          border-bottom: 4px solid var(--color-accent);
          transform: translateY(-6px);
        }
        .fac-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .facility-card h3 {
          font-size: 1.3rem;
          margin-bottom: 12px;
        }
        .facility-card p {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
