import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Building2, ShoppingBag, RefreshCw, Send, Globe } from 'lucide-react';
import { captchaApi, emailApi, userApi } from '../../api';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    nickname: '',
    captchaCode: '',
    emailCode: ''
  });
  const [captcha, setCaptcha] = useState({ uuid: '', imageBase64: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送邮箱验证码
  const handleSendEmailCode = async () => {
    if (!formData.email) {
      setError('请先输入邮箱地址');
      return;
    }
    if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      setError('邮箱格式不正确');
      return;
    }

    setSendingEmail(true);
    setError('');
    try {
      await emailApi.sendCode(formData.email, 'register');
      setSuccess('验证码已发送到您的邮箱');
      setCountdown(60);
    } catch (err) {
      setError(err.message || '发送失败');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    if (!formData.phone) {
      setError('请输入手机号码');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    if (!formData.captchaCode) {
      setError('请输入图形验证码');
      return;
    }

    if (!formData.emailCode) {
      setError('请输入邮箱验证码');
      return;
    }

    setLoading(true);
    try {
      await userApi.register({
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        email: formData.email,
        phone: formData.phone,
        nickname: formData.nickname || formData.username,
        role: role === 'supplier' ? 'SUPPLIER' : 'USER',
        captchaUuid: captcha.uuid,
        captchaCode: formData.captchaCode,
        emailCode: formData.emailCode
      });

      setSuccess('注册成功！正在跳转到登录页...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || '注册失败');
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <style>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }
        .register-card {
          width: 100%;
          max-width: 480px;
          margin: auto;
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .register-header h1 {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .register-header p {
          color: #6b7280;
        }
        .role-selector {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .role-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          font-weight: 500;
        }
        .role-btn:hover {
          border-color: #d97706;
        }
        .role-btn.active {
          border-color: #1e293b;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
        }
        .form-group {
          margin-bottom: 1rem;
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
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: #64748b;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .email-wrapper {
          display: flex;
          gap: 0.5rem;
        }
        .email-input {
          flex: 1;
        }
        .send-btn {
          padding: 0.75rem 1rem;
          background: #64748b;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
          font-size: 0.875rem;
        }
        .send-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .captcha-wrapper {
          display: flex;
          gap: 0.5rem;
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
          padding: 0.5rem;
          background: #fef2f2;
          border-radius: 8px;
        }
        .success-msg {
          color: #059669;
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: #ecfdf5;
          border-radius: 8px;
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
          margin-top: 1rem;
        }
        .submit-btn:hover {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .login-link a {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
        }
        .login-link a:hover {
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

      <div className="register-card">
        <Link to="/en/register" className="lang-switch">
          <Globe size={16} />
          <span>English</span>
        </Link>
        <div className="register-header">
          <h1>注册账号</h1>
          <p>加入懂视帝平台</p>
        </div>

        {/* Role Selection */}
        <div className="role-selector">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
          >
            <ShoppingBag size={20} />
            <span>我是采购方</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`role-btn ${role === 'supplier' ? 'active' : ''}`}
          >
            <Building2 size={20} />
            <span>我是供应商</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">用户名</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">邮箱</label>
            <div className="email-wrapper">
              <div className="input-wrapper email-input">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <button
                type="button"
                className="send-btn"
                onClick={handleSendEmailCode}
                disabled={sendingEmail || countdown > 0}
              >
                <Send size={16} />
                {countdown > 0 ? `${countdown}s` : '发送'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">手机号码</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="请输入手机号码"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">邮箱验证码</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '0.75rem' }}
              placeholder="请输入邮箱验证码"
              value={formData.emailCode}
              onChange={(e) => setFormData({ ...formData, emailCode: e.target.value })}
              maxLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="请输入密码 (至少6位)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">确认密码</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">图形验证码</label>
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
          {success && <div className="success-msg">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '注册中...' : '立即注册'}
          </button>
        </form>

        <div className="login-link">
          已有账号? <Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
