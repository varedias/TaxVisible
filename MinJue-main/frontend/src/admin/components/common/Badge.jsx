import React from 'react';

/**
 * 标签组件
 * @param {Object} props
 * @param {string} props.type - 类型 (success/danger/warning/info)
 * @param {React.ReactNode} props.children - 内容
 * @param {string} props.className - 额外的类名
 */
const Badge = ({ type = 'info', children, className = '' }) => {
  // 类型对应的样式
  const typeClasses = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-slate-100 text-slate-900',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  const classes = typeClasses[type] || typeClasses.info;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
