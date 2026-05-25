import { useState, useEffect } from 'react';
import { MessageSquare, Eye, EyeOff, Trash2, Star, CheckSquare } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { commentApi } from '../api/interaction';
import { useAdminI18n } from '../context/AdminI18nContext';

/**
 * 评论管理页面
 */
const CommentList = () => {
  const { t } = useAdminI18n();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({ status: '', rating: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, isBatch: false });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedIds, setSelectedIds] = useState([]);

  // 加载数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, size: pageSize };
      if (filters.status !== '') params.status = filters.status;
      if (filters.rating !== '') params.rating = filters.rating;
      const res = await commentApi.getList(params);
      setData(res.records || []);
      setTotal(res.total || 0);
      setSelectedIds([]);
    } catch (error) {
      console.error('加载评论失败:', error);
      setToast({ show: true, message: '加载失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, filters]);

  // 切换选择
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(item => item.id));
    }
  };

  // 切换评论状态
  const handleToggleStatus = async (record) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await commentApi.updateStatus(record.id, newStatus);
      setToast({ show: true, message: t('common.success'), type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ show: true, message: t('common.error'), type: 'error' });
    }
  };

  // 批量更新状态
  const handleBatchStatus = async (status) => {
    if (selectedIds.length === 0) return;
    try {
      await commentApi.batchUpdateStatus(selectedIds, status);
      setToast({ show: true, message: t('common.success'), type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ show: true, message: t('common.error'), type: 'error' });
    }
  };

  // 删除评论
  const handleDelete = async () => {
    try {
      if (deleteModal.isBatch) {
        await commentApi.batchDelete(selectedIds);
      } else {
        await commentApi.delete(deleteModal.id);
      }
      setToast({ show: true, message: t('common.success'), type: 'success' });
      setDeleteModal({ open: false, id: null, isBatch: false });
      fetchData();
    } catch (error) {
      setToast({ show: true, message: t('common.error'), type: 'error' });
    }
  };

  // 渲染星级
  const renderRating = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );

  // 表格列配置
  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={data.length > 0 && selectedIds.length === data.length}
          onChange={toggleSelectAll}
          className="w-4 h-4 rounded"
        />
      ),
      width: 40,
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(record.id)}
          onChange={() => toggleSelect(record.id)}
          className="w-4 h-4 rounded"
        />
      ),
    },
    { key: 'id', title: 'ID', width: 60 },
    { key: 'userId', title: t('comments.user'), width: 80 },
    { key: 'productId', title: t('comments.product'), width: 80 },
    { 
      key: 'content', 
      title: t('comments.content'),
      render: (_, record) => (
        <div className="max-w-xs truncate" title={record.content}>{record.content}</div>
      )
    },
    { 
      key: 'rating', 
      title: t('comments.rating'), 
      width: 120,
      render: (_, record) => renderRating(record.rating)
    },
    { 
      key: 'status', 
      title: t('comments.status'), 
      width: 80,
      render: (_, record) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          record.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {record.status === 1 ? t('comments.visible') : t('comments.hidden')}
        </span>
      )
    },
    { 
      key: 'createTime', 
      title: t('common.createTime'), 
      width: 160,
      render: (_, record) => record.createTime ? new Date(record.createTime).toLocaleString() : '-'
    },
    {
      key: 'actions',
      title: t('common.actions'),
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(record)}
            className={`p-1.5 rounded-lg transition-colors ${
              record.status === 1 
                ? 'text-gray-600 hover:bg-gray-100' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={record.status === 1 ? t('comments.hide') : t('comments.show')}
          >
            {record.status === 1 ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, id: record.id, isBatch: false })}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t('common.delete')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-slate-700" />
            <span className="font-medium">{t('comments.title')}</span>
          </div>
          <select
            value={filters.status}
            onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">{t('comments.status')}</option>
            <option value="1">{t('comments.visible')}</option>
            <option value="0">{t('comments.hidden')}</option>
          </select>
          <select
            value={filters.rating}
            onChange={(e) => { setFilters(f => ({ ...f, rating: e.target.value })); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">{t('comments.rating')}</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
          </select>
          
          {/* 批量操作按钮 */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500">已选 {selectedIds.length} 项</span>
              <button
                onClick={() => handleBatchStatus(1)}
                className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
              >
                <Eye size={14} className="inline mr-1" />批量显示
              </button>
              <button
                onClick={() => handleBatchStatus(0)}
                className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <EyeOff size={14} className="inline mr-1" />批量隐藏
              </button>
              <button
                onClick={() => setDeleteModal({ open: true, id: null, isBatch: true })}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={14} className="inline mr-1" />批量删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table columns={columns} data={data} loading={loading} />
        <Pagination current={page} total={total} pageSize={pageSize} onChange={setPage} />
      </div>

      {/* 删除确认弹窗 */}
      <Modal
        open={deleteModal.open}
        title={t('common.confirm')}
        onClose={() => setDeleteModal({ open: false, id: null, isBatch: false })}
        onConfirm={handleDelete}
        confirmText={t('common.delete')}
        confirmType="danger"
      >
        <p>{deleteModal.isBatch ? `确定要删除选中的 ${selectedIds.length} 条评论吗？` : t('common.confirmDelete')}</p>
      </Modal>

      {/* Toast提示 */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
};

export default CommentList;
