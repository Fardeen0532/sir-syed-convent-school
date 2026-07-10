import React, { useEffect, useState } from 'react';
import { 
  Loader2, 
  CheckCircle, 
  Upload, 
  AlertCircle,
  ClipboardList,
  User,
  Phone,
  Mail,
  FileBadge,
  FileText,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import logo from '../../assets/Main_logo.png'

export default function Admissions() {
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    student_name: '',
    class_applied: '',
    parent_name: '',
    phone: '',
    email: ''
  });
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [marksheet, setMarksheet] = useState(null);
  
  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [appId, setAppId] = useState('');

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const adData = await api.getAdmissions();
        setSeo(adData.seo);
        if (adData.seo) {
          document.title = adData.seo.meta_title;
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

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    if (!formData.student_name || !formData.class_applied || !formData.parent_name || !formData.phone || !formData.email) {
      setSubmitError('Please fill in all standard details.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('student_name', formData.student_name);
      payload.append('class_applied', formData.class_applied);
      payload.append('parent_name', formData.parent_name);
      payload.append('phone', formData.phone);
      payload.append('email', formData.email);

      if (birthCertificate) {
        payload.append('birth_certificate', birthCertificate);
      }
      if (marksheet) {
        payload.append('marksheet', marksheet);
      }

      const response = await api.submitAdmission(payload);
      setSubmitSuccess(response.message);
      setAppId(response.applicationId);
      
      // Reset form
      setFormData({
        student_name: '',
        class_applied: '',
        parent_name: '',
        phone: '',
        email: ''
      });
      setBirthCertificate(null);
      setMarksheet(null);
      
      document.getElementById('birth_certificate_input').value = '';
      const mkNode = document.getElementById('marksheet_input');
      if (mkNode) mkNode.value = '';

    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Admission submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const classesList = [
    'Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 
    'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 
    'Class IX', 'Class X'
  ];

  if (loading) {
    return (
      <div className="adm-loader-container">
        <img src={logo} alt="Loading..." className="loader-logo" />
        <div className="loader-bar"><div className="loader-bar-inner"></div></div>
        <p>Loading Admissions Portal...</p>
        <style>{`
          .adm-loader-container {
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
          .adm-loader-container p { color: var(--color-text-muted); font-size: 0.9rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admissions-page animate-fade-in">
      {/* Banner */}
      <section className="banner">
        <div className="container">
          <h1>Student Admissions</h1>
          <p>Begin your child's journey to academic excellence and moral growth</p>
        </div>
      </section>

      {/* Overview / Criteria */}
      <section className="section criteria-section">
        <div className="container grid-2">
          {/* Step process */}
          <div className="card process-card card-accent-green">
            <div className="card-header">
              <div className="header-icon-wrap">
                <ClipboardList className="header-icon" size={24} />
              </div>
              <h2>Admission Process</h2>
            </div>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Submit Application</h4>
                  <p>Fill out the online admission form below and upload the requested documents.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>Document Verification</h4>
                  <p>Our administrative desk reviews the submitted certificates and credentials.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>Parent & Student Interaction</h4>
                  <p>A brief offline discussion or assessment is scheduled at the school campus.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">4</div>
                <div className="step-content">
                  <h4>Admission Confirmation</h4>
                  <p>Pay admission fees and complete final registrations to secure the child's seat.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility & Documents */}
          <div className="card documents-card card-accent-gold">
            <div className="card-header">
              <div className="header-icon-wrap">
                <FileBadge className="header-icon" size={24} />
              </div>
              <h2>Required Documents</h2>
            </div>
            <p className="doc-notice">Ensure clear scanned copies of these documents are prepared before filling the application:</p>
            <ul className="docs-checklist">
              <li>
                <div className="check-icon-wrap"><CheckCircle size={16} className="check-icon" /></div>
                <span>Date of Birth Certificate issued by municipal authority.</span>
              </li>
              <li>
                <div className="check-icon-wrap"><CheckCircle size={16} className="check-icon" /></div>
                <span>Report card or marksheet of the previous academic class.</span>
              </li>
              <li>
                <div className="check-icon-wrap"><CheckCircle size={16} className="check-icon" /></div>
                <span>Transfer Certificate (TC) from the previous recognized school.</span>
              </li>
              <li>
                <div className="check-icon-wrap"><CheckCircle size={16} className="check-icon" /></div>
                <span>Passport-sized photographs of the student and parents.</span>
              </li>
              <li>
                <div className="check-icon-wrap"><CheckCircle size={16} className="check-icon" /></div>
                <span> APAAR ID (ABC) if available.</span>
              </li>
              <li>
                <div className="check-icon-wrap"><CheckCircle size={16} className="check-icon" /></div>
                <span>Aadhaar card copy of student and parents.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Online Admission Form */}
      <section className="section section-bg form-section">
        <div className="container form-container-box">
          <div className="card form-card-wrapper card-accent-green">
            <h2 className="form-title">Online Admission Application Form</h2>
            <p className="form-subtitle">Fields marked with * are required.</p>

            {submitSuccess && (
              <div className="alert-banner success-banner">
                <CheckCircle className="banner-icon" size={24} />
                <div>
                  <h4>Submission Successful!</h4>
                  <p>{submitSuccess}</p>
                  {appId && <span className="app-id-badge">Application ID: <strong>{appId}</strong></span>}
                </div>
              </div>
            )}

            {submitError && (
              <div className="alert-banner error-banner">
                <AlertCircle className="banner-icon" size={24} />
                <div>
                  <h4>Submission Failed</h4>
                  <p>{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admission-form">
              {/* Student Info */}
              <div className="form-section-header">
                <div className="form-section-icon"><User size={18} /></div>
                <h3>Student Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="student_name">Student Full Name *</label>
                  <input
                    type="text"
                    id="student_name"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="class_applied">Class Applied For *</label>
                  <select
                    id="class_applied"
                    name="class_applied"
                    value={formData.class_applied}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Target Class</option>
                    {classesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Parent Info */}
              <div className="form-section-header" style={{ marginTop: '36px' }}>
                <div className="form-section-icon"><Phone size={18} /></div>
                <h3>Parent / Guardian Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="parent_name">Parent / Guardian Full Name *</label>
                  <input
                    type="text"
                    id="parent_name"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter parent's full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter 10-digit mobile number"
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
                    placeholder="Enter contact email address"
                    required
                  />
                </div>
              </div>

              {/* Documents Upload */}
              <div className="form-section-header" style={{ marginTop: '36px' }}>
                <div className="form-section-icon"><Upload size={18} /></div>
                <h3>Upload Required Supporting Documents</h3>
              </div>
              <p className="upload-terms">Please upload clear scans or photos. Maximum size: 5MB. File types allowed: JPG, PNG, PDF.</p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="birth_certificate_input">Birth Certificate File</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="birth_certificate_input"
                      onChange={(e) => handleFileChange(e, setBirthCertificate)}
                      className="file-upload-input"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <div className="file-upload-trigger">
                      <FileText size={24} className="upload-icon" />
                      <span>{birthCertificate ? birthCertificate.name : 'Choose Birth Certificate file'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="marksheet_input">Previous Class Marksheet / Report Card</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="marksheet_input"
                      onChange={(e) => handleFileChange(e, setMarksheet)}
                      className="file-upload-input"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <div className="file-upload-trigger">
                      <FileText size={24} className="upload-icon" />
                      <span>{marksheet ? marksheet.name : 'Choose Marksheet file'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-accent submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner-icon-button" size={20} />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Admission Form</span>
                    <ShieldCheck size={18} />
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

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          border-bottom: 2px solid var(--color-primary-pale);
          padding-bottom: 16px;
        }
        .header-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-primary-pale);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-icon {
          color: var(--color-primary-light);
        }
        .card-accent-green {
          border-top: 4px solid var(--color-primary-light);
        }
        .card-accent-gold {
          border-top: 4px solid var(--color-accent);
        }
        .process-card h2, .documents-card h2 {
          font-size: 1.5rem;
          margin: 0;
        }
        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
        }
        /* Dotted timeline line */
        .steps-list::before {
          content: '';
          position: absolute;
          top: 16px;
          bottom: 16px;
          left: 18px;
          width: 2px;
          border-left: 2px dashed rgba(20, 92, 45, 0.15);
        }
        .step-item {
          display: flex;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .step-num {
          width: 36px;
          height: 36px;
          background: var(--gradient-primary);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .step-item h4 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .step-item p {
          color: var(--color-text-muted);
          font-size: 0.88rem;
          line-height: 1.5;
        }
        
        .doc-notice {
          color: var(--color-text-muted);
          margin-bottom: 24px;
          font-size: 0.98rem;
        }
        .docs-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .docs-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          font-size: 0.98rem;
        }
        .check-icon-wrap {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e6f7f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .check-icon {
          color: var(--color-success);
        }

        .form-container-box {
          max-width: 850px;
        }
        .form-card-wrapper {
          padding: 50px 40px;
        }
        .form-title {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        .form-subtitle {
          color: var(--color-text-muted);
          margin-bottom: 36px;
        }
        
        .form-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--color-primary);
          border-bottom: 2px solid var(--color-primary-pale);
          padding-bottom: 10px;
          margin-bottom: 24px;
        }
        .form-section-icon {
          width: 32px;
          height: 32px;
          background: var(--color-primary-pale);
          color: var(--color-primary-light);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-section-header h3 {
          font-size: 1.15rem;
          margin: 0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        
        /* Premium File Upload Fields */
        .file-upload-wrapper {
          position: relative;
          height: 60px;
          cursor: pointer;
        }
        .file-upload-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .file-upload-trigger {
          position: absolute;
          inset: 0;
          background: #fff;
          border: 2px dashed #d4e2d4;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          transition: all 0.3s ease;
          color: var(--color-text-muted);
        }
        .file-upload-wrapper:hover .file-upload-trigger {
          border-color: var(--color-primary-light);
          color: var(--color-primary-light);
          background-color: var(--color-primary-pale);
        }
        .upload-icon {
          flex-shrink: 0;
        }
        .file-upload-trigger span {
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .submit-btn {
          width: 100%;
          margin-top: 40px;
          padding: 16px;
          font-size: 1.05rem;
        }
        .spinner-icon-button {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Alert Banners */
        .alert-banner {
          display: flex;
          gap: 16px;
          padding: 24px;
          border-radius: var(--radius-md);
          margin-bottom: 36px;
          align-items: flex-start;
        }
        .success-banner {
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }
        .success-banner .banner-icon {
          color: var(--color-success);
          flex-shrink: 0;
        }
        .app-id-badge {
          display: inline-block;
          margin-top: 10px;
          background-color: var(--color-success);
          color: #fff;
          padding: 5px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }
        .error-banner {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        }
        .error-banner .banner-icon {
          color: var(--color-danger);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-card-wrapper {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
