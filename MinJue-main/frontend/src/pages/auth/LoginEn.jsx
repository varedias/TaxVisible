import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Building2, ShoppingBag, UserCircle, RefreshCw, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { captchaApi, userApi } from '../../api';

const LoginEn = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [role, setRole] = useState('supplier');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captchaCode: ''
  });
  const [captcha, setCaptcha] = useState({ uuid: '', imageBase64: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Captcha
  const fetchCaptcha = async () => {
    try {
      const data = await captchaApi.getImage();
      setCaptcha(data);
    } catch (err) {
      console.error('Failed to fetch captcha:', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'guest') {
      navigate('/en');
      return;
    }

    if (!formData.captchaCode) {
      setError('Please enter captcha');
      return;
    }

    setLoading(true);
    try {
      const token = await userApi.login({
        username: formData.username,
        password: formData.password,
        role: role,
        captchaUuid: captcha.uuid,
        captchaCode: formData.captchaCode
      });

      localStorage.setItem('token', token);

      // Get User Info
      const userInfo = await userApi.getInfo();
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));

      // Auto-redirect admin to dashboard
      if (userInfo.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/en');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      fetchCaptcha(); // Refresh captcha on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
        }
        .login-left {
          display: none;
          width: 50%;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .login-left { display: flex; }
        }
        .login-left h1 {
          font-size: 4rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .login-left p {
          font-size: 1.5rem;
          opacity: 0.9;
        }
        .login-right {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: white;
          position: relative;
        }
        @media (min-width: 1024px) {
          .login-right { width: 50%; }
        }
        .login-form-wrapper {
          width: 100%;
          max-width: 400px;
        }
        .login-title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-title h2 {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
        }
        .login-title p {
          color: #6b7280;
          margin-top: 0.5rem;
        }
        .role-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .role-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }
        .role-btn:hover {
          border-color: #d97706;
        }
        .role-btn.active {
          border-color: #1e293b;
          background: #fffbeb;
          color: #1e293b;
        }
        .role-btn span {
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.5rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #64748b;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .captcha-wrapper {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .captcha-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }
        .captcha-img {
          height: 44px;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid #e5e7eb;
        }
        .captcha-refresh {
          padding: 0.5rem;
          cursor: pointer;
          color: #64748b;
          transition: transform 0.3s;
        }
        .captcha-refresh:hover {
          transform: rotate(180deg);
        }
        .error-msg {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 1rem;
        }
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .forgot-link {
          color: #64748b;
          font-size: 0.875rem;
          text-decoration: none;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }
        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .submit-btn:hover {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .register-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .register-link a {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
        .lang-switch {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .lang-switch:hover {
          color: #64748b;
        }
      `}</style>

      {/* Left Side - Branding */}
      <div className="login-left">
        <h1>DongShiDi</h1>
        <p>AI Vision Detection Leader</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <Link to="/login" className="lang-switch">
          <Globe size={16} />
          <span>中文</span>
        </Link>

        <div className="login-form-wrapper">
          <div className="login-title">
            <h2>Welcome Back</h2>
            <p>Please select your role</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <button
              type="button"
              onClick={() => setRole('supplier')}
              className={`role-btn ${role === 'supplier' ? 'active' : ''}`}
            >
              <Building2 size={24} />
              <span>Supplier</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
            >
              <ShoppingBag size={24} />
              <span>Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={`role-btn ${role === 'guest' ? 'active' : ''}`}
            >
              <UserCircle size={24} />
              <span>Guest</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {role !== 'guest' && (
              <>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Captcha</label>
                  <div className="captcha-wrapper">
                    <input
                      type="text"
                      className="captcha-input"
                      placeholder="Enter captcha"
                      value={formData.captchaCode}
                      onChange={(e) => setFormData({ ...formData, captchaCode: e.target.value })}
                      maxLength={4}
                      required
                    />
                    {captcha.imageBase64 && (
                      <img
                        src={captcha.imageBase64}
                        alt="Captcha"
                        className="captcha-img"
                        onClick={fetchCaptcha}
                        title="Click to refresh"
                      />
                    )}
                    <RefreshCw
                      size={20}
                      className="captcha-refresh"
                      onClick={fetchCaptcha}
                    />
                  </div>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <div className="form-options">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" id="remember-me" />
                    <label htmlFor="remember-me">Remember me</label>
                  </div>
                  <Link to="/en/forgot-password" className="forgot-link">Forgot password?</Link>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : (role === 'guest' ? 'Guest Access' : 'Login')}
            </button>
          </form>

          <div className="register-link">
            No account? <Link to="/en/register">Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEn;
