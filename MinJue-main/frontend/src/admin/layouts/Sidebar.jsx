import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Package, FileText, MessageSquare, Heart, ShoppingCart } from 'lucide-react';
import { useAdminI18n } from '../context/AdminI18nContext';

/**
 * 侧边栏组件
 */
const Sidebar = () => {
  const location = useLocation();
  const { t } = useAdminI18n();

  // 菜单配置
  const menuItems = [
    { key: 'dashboard', label: t('menu.dashboard'), icon: LayoutDashboard, path: '/admin/dashboard' },
    { key: 'users', label: t('menu.users'), icon: Users, path: '/admin/users' },
    { key: 'suppliers', label: t('menu.suppliers'), icon: Building2, path: '/admin/suppliers' },
    { key: 'products', label: t('menu.products'), icon: Package, path: '/admin/products' },
    { key: 'leasing', label: t('menu.leasing'), icon: FileText, path: '/admin/leasing' },
    { key: 'orders', label: t('menu.orders'), icon: ShoppingCart, path: '/admin/orders' },
    { key: 'comments', label: t('menu.comments'), icon: MessageSquare, path: '/admin/comments' },
    { key: 'interactions', label: t('menu.interactions'), icon: Heart, path: '/admin/interactions' },
  ];

  // 判断菜单是否激活
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo 区域 */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">
            MJ
          </div>
          <span className="text-lg font-bold">
            <span className="text-slate-400">懂视帝</span> Admin
          </span>
        </Link>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-slate-700 text-white shadow-lg shadow-slate-700/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部版本信息 */}
      <div className="px-6 py-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          懂视帝 Admin v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
