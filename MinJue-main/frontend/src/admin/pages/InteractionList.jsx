import { useState, useEffect } from 'react';
import { Heart, Star, Share2, Trash2 } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { likeApi, favoriteApi, shareApi } from '../api/interaction';
import { useAdminI18n } from '../context/AdminI18nContext';

/**
 * 互动数据管理页面 (点赞/收藏/分享)
 */
const InteractionList = () => {
  const { t } = useAdminI18n();
  const [activeTab, setActiveTab] = useState('likes');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({ targetType: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, isBatch: false });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedIds, setSelectedIds] = useState([]);

  // Tab配置
  const tabs = [
    { key: 'likes', label: t('interactions.likes'), icon: Heart, color: 'text-red-500' },
    { key: 'favorites', label: t('interactions.favorites'), icon: Star, color: 'text-yellow-500' },
    { key: 'shares', label: t('interactions.shares'), icon: Share2, color: 'text-slate-600' },
  ];

  // 获取当前API
  const getApi = () => {
    switch (activeTab) {
      case 'likes': return likeApi;
      case 'favorites': return favoriteApi;
      case 'shares': return shareApi;
      default: return likeApi;
    }
  };

  // 加载数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, size: pageSize };
      if (filters.targetType) params.targetType = filters.targetType;
      const res = await getApi().getList(params);
      setData(res.records || []);
      setTotal(res.total || 0);
      setSelectedIds([]);
    } catch (error) {
      console.error('加载数据失败:', error);
      setToast({ show: true, message: '加载失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, activeTab, filters]);

  // 切换Tab时重置
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setFilters({ targetType: '' });
    setSelectedIds([]);
  };

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

  // 删除记录
  const handleDelete = async () => {
    try {
      if (deleteModal.isBatch) {
        await getApi().batchDelete(selectedIds);
      } else {
        await getApi().delete(deleteModal.id);
      }
      setToast({ show: true, message: t('common.success'), type: 'success' });
      setDeleteModal({ open: false, id: null, isBatch: false });
      fetchData();
    } catch (error) {
      setToast({ show: true, message: t('common.error'), type: 'error' });
    }
  };

  // 目标类型映射
  const targetTypeMap = {
    product: t('interactions.product'),
    content: t('interactions.content'),
  };

  // 基础列配置
  const baseColumns = [
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
    { key: 'userId', title: t('interactions.user'), width: 80 },
    { 
      key: 'targetType', 
      title: t('interactions.targetType'), 
      width: 100,
      render: (_, record) => targetTypeMap[record.targetType] || record.targetType
    },
    { key: 'targetId', title: t('interactions.targetId'), width: 80 },
    { 
      key: 'createTime', 
      title: t('common.createTime'), 
      width: 160,
      render: (_, record) => record.createTime ? new Date(record.createTime).toLocaleString() : '-'
    },
    {
      key: 'actions',
      title: t('common.actions'),
      width: 80,
      render: (_, record) => (
        <button
          onClick={() => setDeleteModal({ open: true, id: record.id, isBatch: false })}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title={t('common.delete')}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  // 分享特有列
  const shareColumns = [
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
    { key: 'userId', title: t('interactions.user'), width: 80 },
    { 
      key: 'targetType', 
      title: t('interactions.targetType'), 
      width: 100,
      render: (_, record) => targetTypeMap[record.targetType] || record.targetType
    },
    { key: 'targetId', title: t('interactions.targetId'), width: 80 },
    { 
      key: 'platform', 
      title: t('interactions.platform'), 
      width: 100,
      render: (_, record) => (
        <span className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-xs">
          {record.platform}
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
      width: 80,
      render: (_, record) => (
        <button
          onClick={() => setDeleteModal({ open: true, id: record.id, isBatch: false })}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title={t('common.delete')}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  const columns = activeTab === 'shares' ? shareColumns : baseColumns;

  return (
    <div className="space-y-4">
      {/* Tab切换 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-slate-50 text-slate-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className={activeTab === tab.key ? tab.color : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          <div className="flex-1" />
          <select
            value={filters.targetType}
            onChange={(e) => { setFilters({ targetType: e.target.value }); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">{t('interactions.targetType')}</option>
            <option value="product">{t('interactions.product')}</option>
            <option value="content">{t('interactions.content')}</option>
          </select>
          
          {/* 批量删除按钮 */}
          {selectedIds.length > 0 && (
            <button
              onClick={() => setDeleteModal({ open: true, id: null, isBatch: true })}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-1"
            >
              <Trash2 size={14} />
              批量删除 ({selectedIds.length})
            </button>
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
        <p>{deleteModal.isBatch ? `确定要删除选中的 ${selectedIds.length} 条记录吗？` : t('common.confirmDelete')}</p>
      </Modal>

      {/* Toast提示 */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
};

export default InteractionList;
