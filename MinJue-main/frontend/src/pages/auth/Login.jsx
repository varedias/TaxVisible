import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Building2, ShoppingBag, UserCircle, RefreshCw, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { captchaApi, userApi } from '../../api';

const Login = () => {
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

  // 获取验证码
  const fetchCaptcha = async () => {
    try {
      const data = await captchaApi.getImage();
      setCaptcha(data);
    } catch (err) {
      console.error('获取验证码失败:', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 游客直接进入首页
    if (role === 'guest') {
      navigate('/');
      return;
    }

    if (!formData.captchaCode) {
      setError('请输入验证码');
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

      // 获取用户信息
      const userInfo = await userApi.getInfo();
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));

      // 如果是管理员，跳转到管理后台（自动识别，不需要选择管理员角色）
      if (userInfo.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || '登录失败');
      fetchCaptcha(); // 刷新验证码
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
          border-color: #64748b;
          background: #fffbeb;
          color: #64748b;
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
          color: #1e293b;
        }
      `}</style>

      {/* Left Side - Branding */}
      <div className="login-left">
        <h1>懂视帝</h1>
        <p>AI视觉检测领导者</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <Link to="/en/login" className="lang-switch">
          <Globe size={16} />
          <span>English</span>
        </Link>
        <div className="login-form-wrapper">
          <div className="login-title">
            <h2>欢迎回来</h2>
            <p>请选择您的身份登录</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <button
              type="button"
              onClick={() => setRole('supplier')}
              className={`role-btn ${role === 'supplier' ? 'active' : ''}`}
            >
              <Building2 size={24} />
              <span>供应商</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
            >
              <ShoppingBag size={24} />
              <span>采购方</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={`role-btn ${role === 'guest' ? 'active' : ''}`}
            >
              <UserCircle size={24} />
              <span>游客</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {role !== 'guest' && (
              <>
                <div className="form-group">
                  <label className="form-label">账号</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder={role === 'supplier' ? "供应商账号" : "采购方账号"}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">密码</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="请输入密码"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">验证码</label>
                  <div className="captcha-wrapper">
                    <input
                      type="text"
                      className="captcha-input"
                      placeholder="请输入验证码"
                      value={formData.captchaCode}
                      onChange={(e) => setFormData({ ...formData, captchaCode: e.target.value })}
                      maxLength={4}
                      required
                    />
                    {captcha.imageBase64 && (
                      <img
                        src={captcha.imageBase64}
                        alt="验证码"
                        className="captcha-img"
                        onClick={fetchCaptcha}
                        title="点击刷新验证码"
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
                    <label htmlFor="remember-me">记住我</label>
                  </div>
                  <Link to="/forgot-password" className="forgot-link">忘记密码?</Link>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '登录中...' : (role === 'guest' ? '游客访问' : '登录')}
            </button>
          </form>

          <div className="register-link">
            还没有账号? <Link to="/register">立即注册</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
