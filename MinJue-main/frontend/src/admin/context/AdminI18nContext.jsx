import { createContext, useContext, useState, useCallback } from 'react';
import zh from '../locales/zh';
import en from '../locales/en';

const locales = { zh, en };

const AdminI18nContext = createContext(null);

/**
 * 管理后台国际化Provider
 */
export const AdminI18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('admin_locale') || 'zh';
  });

  // 切换语言
  const toggleLocale = useCallback(() => {
    setLocale(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('admin_locale', next);
      return next;
    });
  }, []);

  // 获取翻译文本
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = locales[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [locale]);

  return (
    <AdminI18nContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </AdminI18nContext.Provider>
  );
};

/**
 * 使用国际化Hook
 */
export const useAdminI18n = () => {
  const context = useContext(AdminI18nContext);
  if (!context) {
    throw new Error('useAdminI18n must be used within AdminI18nProvider');
  }
  return context;
};
