import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 分页组件
 * @param {Object} props
 * @param {number} props.current - 当前页码
 * @param {number} props.pageSize - 每页条数
 * @param {number} props.total - 总条数
 * @param {Function} props.onChange - 页码变化回调
 */
const Pagination = ({ current = 1, pageSize = 10, total = 0, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  
  // 如果没有数据或只有一页，不显示分页
  if (total === 0 || totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (current > 1) {
      onChange(current - 1);
    }
  };

  const handleNext = () => {
    if (current < totalPages) {
      onChange(current + 1);
    }
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
      {/* 左侧信息 */}
      <div className="text-sm text-gray-500">
        共 <span className="font-medium text-gray-700">{total}</span> 条，
        第 <span className="font-medium text-gray-700">{current}</span> / {totalPages} 页
      </div>

      {/* 右侧分页按钮 */}
      <div className="flex items-center gap-1">
        {/* 上一页 */}
        <button
          onClick={handlePrev}
          disabled={current === 1}
          className={`p-2 rounded-md transition-colors ${
            current === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* 页码 */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onChange(page)}
            disabled={page === '...'}
            className={`min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-colors ${
              page === current
                ? 'bg-slate-700 text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* 下一页 */}
        <button
          onClick={handleNext}
          disabled={current === totalPages}
          className={`p-2 rounded-md transition-colors ${
            current === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
