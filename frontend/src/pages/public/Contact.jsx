import React, { useEffect, useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import logo from '../../assets/Main_logo.png'

export default function Contact() {
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const response = await api.getContact();
        setSeo(response.seo);
        if (response.seo) {
          document.title = response.seo.meta_title;
        }
      } catch (err) {
        console.error('Error fetching SEO:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    try {
      const response = await api.submitEnquiry(formData);
      setSubmitSuccess(response.message);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="contact-loader-container">
        <img src={logo} alt="Loading..." className="loader-logo" />
        <div className="loader-bar"><div className="loader-bar-inner"></div></div>
        <p>Loading Contact Portal...</p>
        <style>{`
          .contact-loader-container {
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
          .contact-loader-container p { color: var(--color-text-muted); font-size: 0.9rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="contact-page animate-fade-in">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <span className="banner-subtitle">GET IN TOUCH</span>
          <h1>Contact Us</h1>
          <p>Get in touch with us for admission enquiries, campus visits, or general questions</p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section contact-section">
        <div className="container grid-2">
          {/* Contact Details Card */}
          <div className="card details-card card-accent-green">
            <h2>School Contact Details</h2>
            <p className="details-desc">Feel free to contact us during working hours. Parents can also request offline campus tours.</p>
            
            <div className="details-list">
              <div className="detail-box">
                <div className="detail-icon-wrap"><MapPin size={20} className="detail-icon" /></div>
                <div>
                  <h4>Campus Location</h4>
                  <p>Sir Syed Convent School, Pahasu, District Bulandshahr, Uttar Pradesh - 203396, India</p>
                </div>
              </div>

              <div className="detail-box">
                <div className="detail-icon-wrap"><Phone size={20} className="detail-icon" /></div>
                <div>
                  <h4>Phone Numbers</h4>
                  <p>+91 81919 85717</p>
                </div>
              </div>

              <div className="detail-box">
                <div className="detail-icon-wrap"><Mail size={20} className="detail-icon" /></div>
                <div>
                  <h4>Official Email Addresses</h4>
                  <p>sirsyedconventschoolpahasu@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Embedded Iframe Map (Bulandshahr Region) */}
            <div className="map-wrapper">
              <iframe
                title="School Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14101.442880099496!2d78.22557434999999!3d28.2104523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390b4d45d924d557%3A0xe54e63e264663c0a!2sPahasu%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="240"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form Card */}
          <div className="card form-card-wrapper card-accent-gold">
            <h2>Send an Enquiry</h2>
            <p className="details-desc">Fill out this quick form and our administration team will revert within 24 business hours.</p>

            {submitSuccess && (
              <div className="alert-banner success-banner">
                <CheckCircle2 className="banner-icon" size={24} />
                <div>
                  <h4>Success</h4>
                  <p>{submitSuccess}</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="alert-banner error-banner">
                <AlertCircle className="banner-icon" size={24} />
                <div>
                  <h4>Failed to Send</h4>
                  <p>{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter mobile phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message / Questions *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter details of your query..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner-icon-button" size={18} />
                    <span>Sending Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
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

        .details-desc {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-bottom: 24px;
        }
        .details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }
        .detail-box {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .detail-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-primary-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .detail-icon {
          color: var(--color-primary-light);
        }
        .detail-box h4 {
          font-size: 1rem;
          margin-bottom: 4px;
          color: var(--color-primary);
        }
        .detail-box p {
          color: var(--color-text-body);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .map-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(20, 92, 45, 0.08);
        }
        
        .form-card-wrapper {
          padding: 40px;
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.05rem;
        }
        
        /* Alert Banners */
        .alert-banner {
          display: flex;
          gap: 16px;
          padding: 20px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          align-items: flex-start;
        }
        .success-banner {
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }
        .success-banner .banner-icon { color: var(--color-success); flex-shrink: 0; }
        .error-banner {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        }
        .error-banner .banner-icon { color: var(--color-danger); flex-shrink: 0; }
        
        .spinner-icon-button {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-card-wrapper {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
