import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, KeyRound, Mail } from 'lucide-react';
import api from '../../services/api';
import logo from '../../assets/Main_logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(email, password);
      // Success: Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card card card-glass">
        <div className="brand-header">
          <img src={logo} alt="Sir Syed Convent School Logo" className="brand-logo-img" />
          <h2>Sir Syed Convent</h2>
          <p>School Management Portal Login</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Administrative Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <div className="input-with-icon">
              <KeyRound size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-accent login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner-icon-btn" size={18} />
                <span>Authenticating Portal...</span>
              </>
            ) : (
              <span>Sign In to Portal</span>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #145C2D 0%, #1B7D3C 100%);
          padding: 24px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background-color: rgba(255, 255, 255, 0.85);
          padding: 40px;
        }
        .brand-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .brand-logo-img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 12px;
          border: 3px solid rgba(212, 160, 23, 0.4);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .brand-header h2 {
          font-size: 1.6rem;
        }
        .brand-header p {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          margin-top: 4px;
        }
        
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .input-with-icon .form-control {
          padding-left: 44px;
        }
        
        .login-submit-btn {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
        }
        
        .login-error-alert {
          background-color: #fee2e2;
          border: 1px solid #fca5a5;
          color: #991b1b;
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .spinner-icon-btn {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
