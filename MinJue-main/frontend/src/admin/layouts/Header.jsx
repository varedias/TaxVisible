import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Home, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminI18n } from '../context/AdminI18nContext';

/**
 * 顶部导航栏组件
 */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { locale, toggleLocale, t } = useAdminI18n();

  // 页面标题映射
  const pageTitles = {
    '/admin/dashboard': t('menu.dashboard'),
    '/admin/users': t('menu.users'),
    '/admin/suppliers': t('menu.suppliers'),
    '/admin/products': t('menu.products'),
    '/admin/leasing': t('menu.leasing'),
    '/admin/comments': t('menu.comments'),
    '/admin/interactions': t('menu.interactions'),
  };

  // 获取当前页面标题
  const getPageTitle = () => {
    return pageTitles[location.pathname] || t('menu.dashboard');
  };

  // 退出登录
  const handleLogout = () => {
    if (window.confirm(t('header.logoutConfirm'))) {
      logout();
      navigate('/login');
    }
  };

  // 返回首页
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* 左侧：页面标题 + 返回首页 */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        <button
          onClick={handleGoHome}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          title={t('header.backHome')}
        >
          <Home size={16} />
          <span>{t('header.backHome')}</span>
        </button>
      </div>

      {/* 右侧：语言切换 + 用户信息 */}
      <div className="flex items-center gap-4">
        {/* 语言切换 */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          <Globe size={18} />
          <span className="font-medium">{locale === 'zh' ? 'EN' : '中文'}</span>
        </button>

        {/* 分隔线 */}
        <div className="w-px h-8 bg-gray-200" />

        {/* 用户信息 */}
        <div className="flex items-center gap-3">
          {/* 头像 */}
          <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
            {user?.username?.charAt(0).toUpperCase() || <User size={18} />}
          </div>
          
          {/* 用户名 */}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">
              {user?.nickname || user?.username || t('header.administrator')}
            </p>
            <p className="text-xs text-gray-500">{t('header.administrator')}</p>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-8 bg-gray-200" />

        {/* 退出按钮 */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">{t('header.logout')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
