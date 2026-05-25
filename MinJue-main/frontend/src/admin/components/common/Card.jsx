import React from 'react';

/**
 * 统计卡片组件
 * @param {Object} props
 * @param {string} props.title - 标题
 * @param {number|string} props.value - 数值
 * @param {React.ReactNode} props.icon - 图标
 * @param {string} props.color - 颜色主题 (blue/green/orange/red)
 * @param {Function} props.onClick - 点击事件
 * @param {string} props.subText - 副标题文字
 */
const Card = ({ title, value, icon, color = 'blue', onClick, subText }) => {
  // 颜色配置
  const colorClasses = {
    blue: {
      bg: 'bg-slate-50',
      icon: 'text-slate-700',
      border: 'border-slate-100',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-100',
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      border: 'border-orange-100',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border ${colors.border} p-6 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        {/* 左侧内容 */}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subText && (
            <p className="text-sm text-gray-500 mt-1">{subText}</p>
          )}
        </div>

        {/* 右侧图标 */}
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <div className={colors.icon}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
