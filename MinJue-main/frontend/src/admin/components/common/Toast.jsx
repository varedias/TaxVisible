import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

/**
 * Toast 通知组件
 * 用于显示操作反馈信息
 */

// Toast 容器 - 管理多个 toast
let toastContainer = null;
let toastId = 0;

// 创建 toast 的方法
export const toast = {
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error'),
  warning: (message) => showToast(message, 'warning'),
  info: (message) => showToast(message, 'info'),
};

function showToast(message, type) {
  if (toastContainer) {
    toastContainer.addToast({ id: ++toastId, message, type });
  }
}

// Toast 单项组件
const ToastItem = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 入场动画
    setTimeout(() => setIsVisible(true), 10);
    
    // 自动关闭
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-orange-500" />,
    info: <AlertCircle size={20} className="text-slate-600" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-orange-50 border-orange-200',
    info: 'bg-slate-50 border-slate-200',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${
        bgColors[type]
      } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
    >
      {icons[type]}
      <span className="text-sm text-gray-700 flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  );
};

// Toast 容器组件
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastContainer = {
      addToast: (toast) => {
        setToasts((prev) => [...prev, toast]);
      },
    };
    return () => {
      toastContainer = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
