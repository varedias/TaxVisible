import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Search, Trash2, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast } from '../components/common/Toast';
import { orderApi } from '../api/order';

/**
 * 订单管理页面
 */
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [stats, setStats] = useState({});

  // 弹窗状态
  const [detailModal, setDetailModal] = useState({ visible: false, order: null, items: [] });
  const [deleteModal, setDeleteModal] = useState({ visible: false, order: null, isBatch: false });
  const [statusModal, setStatusModal] = useState({ visible: false, order: null, newStatus: 0 });

  // 状态配置
  const statusConfig = {
    0: { label: '待付款', type: 'warning', icon: Clock },
    1: { label: '待发货', type: 'info', icon: Package },
    2: { label: '已发货', type: 'primary', icon: Truck },
    3: { label: '已完成', type: 'success', icon: CheckCircle },
    4: { label: '已取消', type: 'danger', icon: XCircle },
  };

  // 获取订单列表
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        orderNo: searchTerm,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
      });
      setOrders(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
      setSelectedIds([]);
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchTerm, statusFilter]);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const data = await orderApi.getStats();
      setStats(data || {});
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  useEffect(() => { fetchOrders(); fetchStats(); }, [fetchOrders]);

  // 选择操作
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    setSelectedIds(orders.length > 0 && selectedIds.length === orders.length ? [] : orders.map(o => o.id));
  };

  // 搜索防抖
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setPagination(prev => ({ ...prev, current: 1 })), 500));
  };

  // 查看详情
  const handleViewDetail = async (order) => {
    try {
      const data = await orderApi.getDetail(order.id);
      setDetailModal({ visible: true, order: data.order, items: data.items || [] });
    } catch (error) {
      toast.error('获取详情失败');
    }
  };

  // 更新状态
  const handleUpdateStatus = async () => {
    try {
      await orderApi.updateStatus(statusModal.order.id, statusModal.newStatus);
      toast.success('状态更新成功');
      setStatusModal({ visible: false, order: null, newStatus: 0 });
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error('更新失败');
    }
  };

  // 删除订单
  const handleDelete = async () => {
    try {
      if (deleteModal.isBatch) {
        await orderApi.batchDelete(selectedIds);
        toast.success(`已删除 ${selectedIds.length} 个订单`);
      } else {
        await orderApi.delete(deleteModal.order.id);
        toast.success('订单已删除');
      }
      setDeleteModal({ visible: false, order: null, isBatch: false });
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  // 表格列配置
  const columns = [
    {
      key: 'select', title: (
        <input type="checkbox" checked={orders.length > 0 && selectedIds.length === orders.length} onChange={toggleSelectAll} className="w-4 h-4 rounded" />
      ), width: 40,
      render: (_, r) => <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 rounded" />,
    },
    { key: 'orderNo', title: '订单号', render: (_, r) => <span className="font-mono text-sm">{r.orderNo}</span> },
    { key: 'userId', title: '用户ID', width: 80 },
    { key: 'totalAmount', title: '金额', render: (_, r) => <span className="font-bold text-orange-500">¥{r.totalAmount}</span> },
    {
      key: 'status', title: '状态', width: 100,
      render: (_, r) => {
        const config = statusConfig[r.status] || statusConfig[0];
        return <Badge type={config.type}>{config.label}</Badge>;
      }
    },
    { key: 'createTime', title: '下单时间', render: (_, r) => r.createTime ? new Date(r.createTime).toLocaleString() : '-' },
    {
      key: 'actions', title: '操作', width: 180,
      render: (_, r) => (
        <div className="flex gap-2">
          <Button type="default" size="sm" onClick={() => handleViewDetail(r)}><Eye size={14} /></Button>
          <Button type="primary" size="sm" onClick={() => setStatusModal({ visible: true, order: r, newStatus: r.status })}>状态</Button>
          <Button type="danger" size="sm" onClick={() => setDeleteModal({ visible: true, order: r, isBatch: false })}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const countKey = key === '0' ? 'pending' : key === '1' ? 'paid' : key === '2' ? 'shipped' : key === '3' ? 'completed' : 'cancelled';
          return (
            <div key={key} className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${config.type === 'warning' ? 'yellow' : config.type === 'info' ? 'blue' : config.type === 'primary' ? 'indigo' : config.type === 'success' ? 'green' : 'red'}-50`}>
                <Icon size={20} className={`text-${config.type === 'warning' ? 'yellow' : config.type === 'info' ? 'blue' : config.type === 'primary' ? 'indigo' : config.type === 'success' ? 'green' : 'red'}-500`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats[countKey] || 0}</p>
                <p className="text-xs text-gray-500">{config.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-slate-700" />
            <span className="font-medium">订单管理</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <div className="relative">
            <input type="text" placeholder="搜索订单号..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" value={searchTerm} onChange={handleSearchChange} />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          {selectedIds.length > 0 && (
            <button onClick={() => setDeleteModal({ visible: true, order: null, isBatch: true })} className="ml-auto px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1">
              <Trash2 size={14} />批量删除 ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table columns={columns} data={orders} loading={loading} emptyText="暂无订单数据" />
        <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={(p) => setPagination(prev => ({ ...prev, current: p }))} />
      </div>

      {/* 详情弹窗 */}
      <Modal visible={detailModal.visible} title="订单详情" onClose={() => setDetailModal({ visible: false, order: null, items: [] })} showFooter={false}>
        {detailModal.order && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">订单号：</span>{detailModal.order.orderNo}</div>
              <div><span className="text-gray-500">状态：</span><Badge type={statusConfig[detailModal.order.status]?.type}>{statusConfig[detailModal.order.status]?.label}</Badge></div>
              <div><span className="text-gray-500">总金额：</span><span className="text-orange-500 font-bold">¥{detailModal.order.totalAmount}</span></div>
              <div><span className="text-gray-500">下单时间：</span>{detailModal.order.createTime ? new Date(detailModal.order.createTime).toLocaleString() : '-'}</div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">商品列表</h4>
              {detailModal.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    {item.productImage ? <img src={item.productImage} alt="" className="w-full h-full object-cover" /> : <Package className="w-full h-full p-2 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">¥{item.productPrice} × {item.quantity}</p>
                  </div>
                  <div className="text-orange-500 font-bold">¥{item.subtotal}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* 状态更新弹窗 */}
      <Modal visible={statusModal.visible} title="更新订单状态" onClose={() => setStatusModal({ visible: false, order: null, newStatus: 0 })} onConfirm={handleUpdateStatus} confirmText="确认更新">
        <div className="space-y-4">
          <p className="text-gray-600">订单号: <span className="font-mono">{statusModal.order?.orderNo}</span></p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">选择新状态</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={statusModal.newStatus} onChange={(e) => setStatusModal(p => ({ ...p, newStatus: Number(e.target.value) }))}>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal visible={deleteModal.visible} title="确认删除" onClose={() => setDeleteModal({ visible: false, order: null, isBatch: false })} onConfirm={handleDelete} confirmText="确认删除" confirmType="danger">
        <p className="text-gray-600">
          {deleteModal.isBatch 
            ? `确定要删除选中的 ${selectedIds.length} 个订单吗？此操作不可恢复。`
            : <>确定要删除订单 <span className="font-mono">{deleteModal.order?.orderNo}</span> 吗？此操作不可恢复。</>
          }
        </p>
      </Modal>
    </div>
  );
};

export default OrderList;
