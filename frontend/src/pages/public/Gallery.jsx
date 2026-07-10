import React, { useEffect, useState } from 'react';
import { Loader2, Grid } from 'lucide-react';
import api from '../../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.getGallery();
        setImages(response.images || []);
        setFilteredImages(response.images || []);
        if (response.seo) {
          document.title = response.seo.meta_title;
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleFilter = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === tab));
    }
  };

  const tabs = ['All', 'Campus', 'Events', 'Sports', 'Activities'];

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner-icon" size={40} />
        <p>Loading school photo galleries...</p>
        <style>{`
          .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 12px; }
          .spinner-icon { animation: spin 1s linear infinite; color: var(--color-accent); }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <h1>Campus Gallery</h1>
          <p>Captured moments of sports tournaments, science exhibitions, and classroom activities</p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="section gallery-section">
        <div className="container">
          <div className="gallery-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          {filteredImages.length > 0 ? (
            <div className="grid-3 image-grid">
              {filteredImages.map((img) => (
                <div className="gallery-card card-no-padding" key={img.id}>
                  {img.image_url.startsWith('/uploads/') ? (
                    <img 
                      src={img.image_url} 
                      alt={img.title} 
                      className="gallery-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="fallback-gallery-img">
                      <Grid size={32} className="fallback-icon" />
                      <span>{img.category} Photo</span>
                    </div>
                  )}
                  <div className="gallery-info">
                    <span className="info-cat">{img.category}</span>
                    <h4>{img.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-images card">
              <p>No photos uploaded under the "{activeTab}" category yet.</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .gallery-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .tab-btn {
          background-color: #fff;
          border: 1px solid #cbd5e1;
          color: var(--color-primary);
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .tab-btn:hover, .tab-btn.active {
          background-color: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .tab-btn.active {
          box-shadow: var(--shadow-sm);
        }
        
        .card-no-padding {
          border-radius: var(--radius-md);
          border: 1px solid #cbd5e1;
          background-color: #fff;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card-no-padding:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .gallery-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }
        .fallback-gallery-img {
          height: 250px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          gap: 12px;
        }
        .fallback-icon {
          color: var(--color-accent);
        }
        .gallery-info {
          padding: 16px 20px;
        }
        .info-cat {
          font-size: 0.75rem;
          color: var(--color-accent);
          font-weight: 700;
          text-transform: uppercase;
        }
        .gallery-info h4 {
          font-size: 1.05rem;
          margin-top: 4px;
          color: var(--color-primary);
        }
        
        .no-images {
          text-align: center;
          padding: 40px;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
