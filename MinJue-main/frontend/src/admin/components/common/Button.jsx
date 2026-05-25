import React from 'react';

/**
 * 按钮组件
 * @param {Object} props
 * @param {string} props.type - 类型 (primary/danger/secondary)
 * @param {boolean} props.loading - 加载状态
 * @param {boolean} props.disabled - 禁用状态
 * @param {string} props.size - 尺寸 (sm/md/lg)
 * @param {React.ReactNode} props.children - 内容
 * @param {Function} props.onClick - 点击事件
 * @param {string} props.className - 额外的类名
 */
const Button = ({
  type = 'primary',
  loading = false,
  disabled = false,
  size = 'md',
  children,
  onClick,
  className = '',
  ...rest
}) => {
  // 类型对应的样式
  const typeClasses = {
    primary: 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
    default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
  };

  // 尺寸对应的样式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const typeClass = typeClasses[type] || typeClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${typeClass} ${sizeClass} ${className}`}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
