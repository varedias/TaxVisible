import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Search, User, LogIn, UserPlus, Store, Truck, Compass, ShoppingCart, LogOut, Globe, LayoutDashboard } from 'lucide-react';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleProtectedNavigation = (path) => {
    if (!user) {
      navigate('/login');
    } else {
      // 如果是管理员访问个人中心或用户信息，跳转到管理后台
      if (user.role === 'ADMIN' && (path === '/profile' || path === '/user-info')) {
        navigate('/admin/dashboard');
      } else {
        navigate(path);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Bar with Login/Register */}
      <div className="bg-gray-100 border-b border-gray-200 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1">
                      <LayoutDashboard size={12} /> 管理后台
                    </Link>
                    <span className="text-gray-300">|</span>
                  </>
                )}
                <span className="text-slate-700 flex items-center gap-1">
                  <User size={12} /> {user.name}
                </span>
                <span className="text-gray-300">|</span>
                <button onClick={logout} className="hover:text-slate-700 flex items-center gap-1">
                  <LogOut size={12} /> 退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:underline flex items-center gap-1">
                  <LogIn size={12} /> 登录
                </Link>
                <span className="text-gray-300">|</span>
                <Link to="/register" className="hover:text-slate-700 flex items-center gap-1">
                  <UserPlus size={12} /> 免费注册
                </Link>
              </>
            )}
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleProtectedNavigation('/profile')}
              className="hover:text-slate-700 flex items-center gap-1"
            >
              <Store size={12} /> 免费开店
            </button>
            <span className="text-gray-300">|</span>
            <Link to="/en" className="hover:text-slate-700 flex items-center gap-1 text-amber-600 font-medium">
              <Globe size={12} /> 跨境服务
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/help" className="hover:text-slate-700">帮助中心</Link>
            <Link to="/contact" className="hover:text-slate-700">联系客服</Link>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-slate-700 tracking-tighter">懂视帝</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative mx-8 flex-grow max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索商品、内容..."
              className="bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-slate-600 w-full transition-all"
            />
            <button type="submit" className="absolute right-3 text-gray-400 hover:text-slate-700">
              <Search size={18} />
            </button>
          </form>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`${isActive('/') ? 'text-slate-700 border-b-2 border-slate-700 pb-1' : 'text-gray-500'} hover:text-slate-700 font-medium transition-colors`}>首页</Link>
            <Link to="/discovery" className={`${isActive('/discovery') ? 'text-slate-700 border-b-2 border-slate-700 pb-1' : 'text-gray-500'} hover:text-slate-700 font-medium transition-colors`}>发现</Link>
            <Link to="/leasing" className={`${isActive('/leasing') ? 'text-slate-700 border-b-2 border-slate-700 pb-1' : 'text-gray-500'} hover:text-slate-700 font-medium transition-colors`}>租赁</Link>
            <Link to="/mall" className={`${isActive('/mall') ? 'text-slate-700 border-b-2 border-slate-700 pb-1' : 'text-gray-500'} hover:text-slate-700 font-medium transition-colors`}>商城</Link>
            <button
              onClick={() => handleProtectedNavigation('/profile')}
              className={`${isActive('/profile') ? 'text-slate-700 border-b-2 border-slate-700 pb-1' : 'text-gray-500'} hover:text-slate-700 font-medium transition-colors`}
            >
              {user?.role === 'ADMIN' ? '管理中心' : (user?.role === 'SUPPLIER' ? '供应中心' : '个人中心')}
            </button>
            <button
              onClick={() => handleProtectedNavigation('/user-info')}
              className={`${isActive('/user-info') ? 'text-slate-700 border-b-2 border-slate-700 pb-1' : 'text-gray-500'} hover:text-slate-700 font-medium transition-colors`}
            >
              账号设置
            </button>
          </nav>
          <div className="md:hidden">
            {/* Mobile menu button placeholder */}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-slate-700' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">首页</span>
        </Link>
        <Link to="/discovery" className={`flex flex-col items-center ${isActive('/discovery') ? 'text-slate-700' : 'text-gray-400'}`}>
          <Compass size={24} />
          <span className="text-xs mt-1">发现</span>
        </Link>
        <Link to="/mall" className={`flex flex-col items-center ${isActive('/mall') ? 'text-slate-700' : 'text-gray-400'}`}>
          <ShoppingCart size={24} />
          <span className="text-xs mt-1">商城</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-slate-700' : 'text-gray-400'}`}>
          <User size={24} />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;