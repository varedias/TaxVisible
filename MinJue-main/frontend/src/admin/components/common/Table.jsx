import React from 'react';

/**
 * 通用表格组件
 * @param {Object} props
 * @param {Array} props.columns - 列配置 [{key, title, render?}]
 * @param {Array} props.data - 数据源
 * @param {boolean} props.loading - 加载状态
 * @param {string} props.emptyText - 空状态文字
 */
const Table = ({ columns = [], data = [], loading = false, emptyText = '暂无数据' }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        {/* 表头 */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 font-semibold">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        {/* 表体 */}
        <tbody>
          {loading ? (
            // 加载状态
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500">
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
                  <span>加载中...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            // 空状态
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span>{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            // 数据行
            data.map((record, index) => (
              <tr key={record.id || index} className="bg-white border-b hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render
                      ? col.render(record[col.key], record)
                      : record[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
