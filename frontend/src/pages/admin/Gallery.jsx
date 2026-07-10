import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Image, AlertCircle, X, Camera } from 'lucide-react';
import api from '../../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editor/Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Campus'
  });
  const [imageFile, setImageFile] = useState(null);

  // Status Alerts
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await api.getGallery();
      setImages(response.images || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load gallery images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openUploadModal = () => {
    setFormData({ title: '', category: 'Campus' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');

    if (!formData.title || !formData.category || !imageFile) {
      setErrorMsg('Please enter a title, category, and select an image file.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('image', imageFile);

      await api.uploadGallery(payload);
      setMsg('Image uploaded to gallery successfully.');
      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to upload image. Ensure it is a valid JPG/PNG and size is below 5MB.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image from the gallery?')) return;
    
    setMsg('');
    setErrorMsg('');
    try {
      await api.deleteGallery(id);
      setMsg('Image deleted successfully.');
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete image.');
    }
  };

  return (
    <div className="admin-gallery-page">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1>Gallery Management</h1>
          <p className="subtitle">Upload campus photography, sports meets, or co-curricular moments.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openUploadModal}>
          <Plus size={18} />
          <span>Upload Image</span>
        </button>
      </div>

      {msg && <div className="alert-badge success">{msg}</div>}
      {errorMsg && <div className="alert-badge error">{errorMsg}</div>}

      {/* Grid List */}
      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner-icon" size={40} />
          <p>Retrieving gallery photos...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="grid-4 admin-gallery-grid">
          {images.map((img) => (
            <div className="card admin-gallery-card" key={img.id}>
              {img.image_url.startsWith('/uploads/') ? (
                <img src={img.image_url} alt={img.title} className="admin-gallery-img" />
              ) : (
                <div className="fallback-gallery-img-admin">
                  <Camera size={28} />
                  <span>{img.category}</span>
                </div>
              )}
              <div className="card-info-box">
                <span className="cat-tag-badge">{img.category}</span>
                <h4>{img.title}</h4>
                <button className="btn btn-danger btn-sm delete-btn-full" onClick={() => handleDelete(img.id)}>
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-card card">
          <AlertCircle size={32} className="warning-icon" />
          <p>No gallery images uploaded yet.</p>
        </div>
      )}

      {/* Upload Modal Dialog */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <div className="modal-header-flex">
              <h2>Upload New Gallery Photo</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Photo Caption / Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Science Lab Experiment Session"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gallery Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="Campus">Campus</option>
                  <option value="Events">Events</option>
                  <option value="Sports">Sports</option>
                  <option value="Activities">Activities</option>
                </select>
              </div>

              <div className="form-group">
                <label>Select Photo File * (JPG/PNG, Max 5MB)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  required
                />
                {imageFile && <p className="file-attached-hint">Selected: {imageFile.name}</p>}
              </div>

              <div className="modal-actions-flex">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent btn-sm">Upload Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 1.8rem; }
        .page-header-flex .subtitle { color: var(--color-text-muted); font-size: 0.9rem; }

        .alert-badge { padding: 12px 20px; border-radius: var(--radius-sm); font-weight: 500; font-size: 0.9rem; margin-bottom: 20px; }
        .alert-badge.success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .alert-badge.error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }

        .admin-gallery-card { padding: 0; overflow: hidden; border: 1px solid #cbd5e1; display: flex; flex-direction: column; }
        .admin-gallery-img { width: 100%; height: 180px; object-fit: cover; }
        .fallback-gallery-img-admin { height: 180px; background-color: var(--color-primary); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
        
        .card-info-box { padding: 16px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
        .cat-tag-badge { background-color: #f1f5f9; font-size: 0.7rem; font-weight: 700; color: var(--color-accent); padding: 2px 8px; border-radius: 4px; width: fit-content; text-transform: uppercase; }
        .card-info-box h4 { font-size: 0.95rem; line-height: 1.4; color: var(--color-primary); }
        .delete-btn-full { width: 100%; display: flex; gap: 6px; align-items: center; justify-content: center; margin-top: 8px; }

        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(20, 92, 45, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
        .modal-content { width: 100%; max-width: 500px; border-top: 4px solid var(--color-accent); background-color: #fff; }
        .modal-header-flex { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
        .close-modal-btn { background: transparent; border: none; cursor: pointer; color: var(--color-text-muted); }
        
        .modal-actions-flex { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        .file-attached-hint { font-size: 0.8rem; color: var(--color-success); font-weight: 600; margin-top: 6px; }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .page-header-flex h1 {
            font-size: 1.4rem;
          }
          .grid-4.admin-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .grid-4.admin-gallery-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
