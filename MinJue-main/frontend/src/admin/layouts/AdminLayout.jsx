import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from '../components/common/Toast';
import { AdminI18nProvider } from '../context/AdminI18nContext';

/**
 * 管理后台主布局
 */
const AdminLayout = () => {
  return (
    <AdminI18nProvider>
      <div className="min-h-screen bg-gray-100" style={{ minWidth: '1280px' }}>
        {/* Toast 通知容器 */}
        <ToastContainer />

        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区域 */}
        <div className="ml-60">
          {/* 顶部导航栏 */}
          <Header />

          {/* 页面内容 */}
          <main className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Loading...</span>
                  </div>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </AdminI18nProvider>
  );
};

export default AdminLayout;
