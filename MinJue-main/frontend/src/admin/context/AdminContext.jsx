import { createContext, useContext, useState, useEffect } from 'react';

// 创建 Admin Context
const AdminContext = createContext(null);

/**
 * Admin Context Provider
 * 管理管理员用户信息和全局状态
 */
export function AdminProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化时从 localStorage 获取用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('解析用户信息失败:', e);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  // 登录
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  // 退出登录
  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
  };

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

/**
 * useAdmin Hook
 * 获取 Admin Context
 */
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin 必须在 AdminProvider 内部使用');
  }
  return context;
}

export default AdminContext;
