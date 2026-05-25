import { useEffect, useState, useCallback } from 'react';
import { Package, Search, ShoppingCart, Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast } from '../components/common/Toast';
import { productApi } from '../api/product';

/**
 * 商品管理页面 - 完整CRUD + 批量操作
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedIds, setSelectedIds] = useState([]);

  // 弹窗状态
  const [offShelfModal, setOffShelfModal] = useState({ visible: false, product: null, reason: '', loading: false });
  const [deleteModal, setDeleteModal] = useState({ visible: false, product: null, loading: false, isBatch: false });
  const [editModal, setEditModal] = useState({ visible: false, product: null, loading: false, isEdit: false });
  const [formData, setFormData] = useState({ name: '', price: '', originalPrice: '', stock: '', image: '', description: '', status: 1 });

  // 获取商品列表
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        keyword: searchTerm,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
      });
      setProducts(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
      setSelectedIds([]);
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchTerm, statusFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // 选择操作
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    setSelectedIds(products.length > 0 && selectedIds.length === products.length ? [] : products.map(p => p.id));
  };

  // 搜索防抖
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setPagination(prev => ({ ...prev, current: 1 })), 500));
  };

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, current: page }));

  // 打开新增弹窗
  const openCreateModal = () => {
    setFormData({ name: '', price: '', originalPrice: '', stock: '', image: '', description: '', status: 1 });
    setEditModal({ visible: true, product: null, loading: false, isEdit: false });
  };

  // 打开编辑弹窗
  const openEditModal = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock || '',
      image: product.image || '',
      description: product.description || '',
      status: product.status ?? 1,
    });
    setEditModal({ visible: true, product, loading: false, isEdit: true });
  };

  // 保存商品
  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error('请输入商品名称'); return; }
    if (!formData.price) { toast.error('请输入商品价格'); return; }
    setEditModal(prev => ({ ...prev, loading: true }));
    try {
      if (editModal.isEdit) {
        await productApi.update(editModal.product.id, formData);
        toast.success('商品更新成功');
      } else {
        await productApi.create(formData);
        toast.success('商品创建成功');
      }
      setEditModal({ visible: false, product: null, loading: false, isEdit: false });
      fetchProducts();
    } catch (error) {
      toast.error((editModal.isEdit ? '更新' : '创建') + '失败: ' + error.message);
    } finally {
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 删除商品
  const handleDelete = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      if (deleteModal.isBatch) {
        await productApi.batchDelete(selectedIds);
        toast.success(`已删除 ${selectedIds.length} 个商品`);
      } else {
        await productApi.delete(deleteModal.product.id);
        toast.success('商品已删除');
      }
      setDeleteModal({ visible: false, product: null, loading: false, isBatch: false });
      fetchProducts();
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 下架商品
  const handleOffShelf = async () => {
    const { product, reason } = offShelfModal;
    if (!product) return;
    setOffShelfModal(prev => ({ ...prev, loading: true }));
    try {
      await productApi.offShelf(product.id, reason);
      toast.success('商品已下架');
      setOffShelfModal({ visible: false, product: null, reason: '', loading: false });
      fetchProducts();
    } catch (error) {
      toast.error('下架失败: ' + error.message);
    } finally {
      setOffShelfModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 上架商品
  const handleOnShelf = async (product) => {
    try {
      await productApi.onShelf(product.id);
      toast.success('商品已上架');
      fetchProducts();
    } catch (error) {
      toast.error('上架失败: ' + error.message);
    }
  };

  // 批量上架
  const handleBatchOnShelf = async () => {
    if (selectedIds.length === 0) return;
    try {
      await productApi.batchOnShelf(selectedIds);
      toast.success(`已上架 ${selectedIds.length} 个商品`);
      fetchProducts();
    } catch (error) {
      toast.error('批量上架失败: ' + error.message);
    }
  };

  // 批量下架
  const handleBatchOffShelf = async () => {
    if (selectedIds.length === 0) return;
    try {
      await productApi.batchOffShelf(selectedIds);
      toast.success(`已下架 ${selectedIds.length} 个商品`);
      fetchProducts();
    } catch (error) {
      toast.error('批量下架失败: ' + error.message);
    }
  };

  // 表格列配置
  const columns = [
    {
      key: 'select', title: (
        <input type="checkbox" checked={products.length > 0 && selectedIds.length === products.length} onChange={toggleSelectAll} className="w-4 h-4 rounded" />
      ), width: 40,
      render: (_, r) => <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 rounded" />,
    },
    {
      key: 'image', title: '图片',
      render: (_, r) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {r.image ? <img src={r.image} alt="" className="w-full h-full object-cover" /> : <ShoppingCart size={20} className="text-gray-400" />}
        </div>
      ),
    },
    { key: 'name', title: '商品名称', render: (_, r) => <span className="font-medium text-gray-900 line-clamp-1">{r.name}</span> },
    { key: 'price', title: '价格', render: (_, r) => <span className="font-bold text-orange-500">¥{r.price}</span> },
    { key: 'stock', title: '库存', render: (_, r) => <span className={r.stock < 10 ? 'text-red-500' : 'text-gray-600'}>{r.stock ?? '-'}</span> },
    { key: 'status', title: '状态', render: (_, r) => <Badge type={r.status === 1 ? 'success' : 'danger'}>{r.status === 1 ? '上架中' : '已下架'}</Badge> },
    { key: 'createTime', title: '创建时间', render: (_, r) => r.createTime ? new Date(r.createTime).toLocaleDateString() : '-' },
    {
      key: 'actions', title: '操作',
      render: (_, r) => (
        <div className="flex gap-2">
          <Button type="default" size="sm" onClick={() => openEditModal(r)}><Edit2 size={14} /></Button>
          {r.status === 1 ? (
            <Button type="warning" size="sm" onClick={() => setOffShelfModal({ visible: true, product: r, reason: '', loading: false })}>下架</Button>
          ) : (
            <Button type="primary" size="sm" onClick={() => handleOnShelf(r)}>上架</Button>
          )}
          <Button type="danger" size="sm" onClick={() => setDeleteModal({ visible: true, product: r, loading: false, isBatch: false })}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="text-slate-700" />
          商品管理
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="primary" onClick={openCreateModal}><Plus size={16} className="mr-1" />新增商品</Button>
          <select className="px-3 py-2 border rounded-lg text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部状态</option>
            <option value="1">上架中</option>
            <option value="0">已下架</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="搜索商品名称..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" value={searchTerm} onChange={handleSearchChange} />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedIds.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <span className="text-sm text-slate-800">已选择 {selectedIds.length} 项</span>
          <button onClick={handleBatchOnShelf} className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1">
            <ArrowUp size={14} />批量上架
          </button>
          <button onClick={handleBatchOffShelf} className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1">
            <ArrowDown size={14} />批量下架
          </button>
          <button onClick={() => setDeleteModal({ visible: true, product: null, loading: false, isBatch: true })} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1">
            <Trash2 size={14} />批量删除
          </button>
        </div>
      )}

      <Table columns={columns} data={products} loading={loading} emptyText="暂无商品数据" />
      <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} />

      {/* 编辑/新增弹窗 */}
      <Modal visible={editModal.visible} title={editModal.isEdit ? '编辑商品' : '新增商品'} onClose={() => setEditModal({ visible: false, product: null, loading: false, isEdit: false })} onConfirm={handleSave} confirmText="保存" loading={editModal.loading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入商品名称" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">价格 *</label>
              <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">原价</label>
              <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.originalPrice} onChange={(e) => setFormData(p => ({ ...p, originalPrice: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">库存</label>
              <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0" value={formData.stock} onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: Number(e.target.value) }))}>
                <option value={1}>上架</option>
                <option value={0}>下架</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." value={formData.image} onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} placeholder="商品描述..." value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* 下架确认弹窗 */}
      <Modal visible={offShelfModal.visible} title="确认下架" onClose={() => setOffShelfModal({ visible: false, product: null, reason: '', loading: false })} onConfirm={handleOffShelf} confirmText="确认下架" confirmType="danger" loading={offShelfModal.loading}>
        <div className="space-y-4">
          <p className="text-gray-600">确定要下架商品 <span className="font-medium text-gray-900">{offShelfModal.product?.name}</span> 吗？</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">下架原因（可选）</label>
            <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} placeholder="请输入下架原因..." value={offShelfModal.reason} onChange={(e) => setOffShelfModal(p => ({ ...p, reason: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal visible={deleteModal.visible} title="确认删除" onClose={() => setDeleteModal({ visible: false, product: null, loading: false, isBatch: false })} onConfirm={handleDelete} confirmText="确认删除" confirmType="danger" loading={deleteModal.loading}>
        <p className="text-gray-600">
          {deleteModal.isBatch 
            ? `确定要删除选中的 ${selectedIds.length} 个商品吗？此操作不可恢复。`
            : <>确定要删除商品 <span className="font-medium text-gray-900">{deleteModal.product?.name}</span> 吗？此操作不可恢复。</>
          }
        </p>
      </Modal>
    </div>
  );
};

export default ProductList;
