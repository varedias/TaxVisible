import React from 'react';
import { Loader, Package, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * 全局 Loading Spinner
 */
export const LoadingSpinner = ({ text = '加载中...', className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
    <Loader size={36} className="animate-spin text-slate-700 mb-3" />
    <p className="text-gray-500 text-sm">{text}</p>
  </div>
);

/**
 * 骨架屏 — 卡片列表
 */
export const SkeletonCards = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
        <div className="bg-gray-200 h-40 w-full" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * 骨架屏 — 表格
 */
export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="bg-gray-50 border-b px-6 py-3 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="px-6 py-4 flex gap-4 border-b border-gray-100 last:border-0">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="h-3 bg-gray-200 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * 空状态
 */
export const EmptyState = ({
  icon: Icon = Package,
  title = '暂无数据',
  description = '',
  action,
  actionText = '去看看',
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon size={36} className="text-gray-300" />
    </div>
    <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
    {action && (
      <button onClick={action} className="text-slate-700 hover:text-slate-800 text-sm font-medium flex items-center gap-1">
        {actionText}
      </button>
    )}
  </div>
);

/**
 * 错误提示
 */
export const ErrorDisplay = ({
  message = '加载失败，请稍后重试',
  onRetry,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle size={36} className="text-red-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-700 mb-1">出错了</h3>
    <p className="text-sm text-gray-400 mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-sm">
        <RefreshCw size={16} />
        重新加载
      </button>
    )}
  </div>
);

/**
 * 分页组件
 */
export const Pagination = ({ current, total, onChange, className = '' }) => {
  if (total <= 1) return null;

  const pages = [];
  const max = 5;
  let start = Math.max(1, current - Math.floor(max / 2));
  let end = Math.min(total, start + max - 1);
  if (end - start < max - 1) start = Math.max(1, end - max + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center gap-1 mt-6 ${className}`}>
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        上一页
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">1</button>
          {start > 2 && <span className="px-1 text-gray-400">...</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-sm border rounded-lg ${p === current ? 'bg-slate-700 text-white border-slate-700' : 'hover:bg-gray-50'}`}
        >
          {p}
        </button>
      ))}
      {end < total && (
        <>
          {end < total - 1 && <span className="px-1 text-gray-400">...</span>}
          <button onClick={() => onChange(total)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">{total}</button>
        </>
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        下一页
      </button>
    </div>
  );
};
