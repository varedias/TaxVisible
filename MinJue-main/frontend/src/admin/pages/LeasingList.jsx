import { useEffect, useState, useCallback } from 'react';
import { FileText, Search, Calendar, TrendingUp, Plus, Edit2, Trash2, PackageCheck, RotateCcw } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast } from '../components/common/Toast';
import { leasingApi } from '../api/leasing';

const getToday = () => new Date().toISOString().slice(0, 10);

const formatCurrency = (value, suffix = '') => {
  if (value === null || value === undefined || value === '') return '-';
  return `¥${Number(value).toLocaleString()}${suffix}`;
};

const calcRentalAmount = (item, form) => {
  let unitPrice = Number(item?.monthlyPrice || 0);
  if (form.leasePeriod === 'DAY') unitPrice = Number(item?.dailyPrice || 0);
  if (form.leasePeriod === 'WEEK') unitPrice = Number(item?.weeklyPrice || 0);
  return unitPrice * Math.max(1, Number(form.leaseDuration || 1));
};

/**
 * 租赁管理页面 - 完整CRUD
 */
const LeasingList = () => {
  const [items, setItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 弹窗状态
  const [editModal, setEditModal] = useState({ visible: false, item: null, loading: false, isEdit: false });
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null, loading: false });
  const [statusModal, setStatusModal] = useState({ visible: false, item: null, loading: false });
  const [rentModal, setRentModal] = useState({ visible: false, item: null, loading: false });
  const [returnModal, setReturnModal] = useState({ visible: false, item: null, loading: false });

  // 表单数据
  const [formData, setFormData] = useState({
    name: '', type: 'financing', image: '', description: '', supplier: '',
    warehouseAddress: '', monthlyPrice: '', totalPrice: '', duration: '', dailyPrice: '', weeklyPrice: '', status: 1
  });
  const [rentalForm, setRentalForm] = useState({
    companyName: '', contactName: '', contactPhone: '', deliveryAddress: '', onsiteAddress: '',
    leaseStartDate: getToday(), expectedReturnDate: '', leasePeriod: 'MONTH', leaseDuration: 1, rentalAmount: '', remark: ''
  });
  const [returnForm, setReturnForm] = useState({
    returnDate: getToday(), returnAddress: '', receiverName: '', equipmentCondition: '设备完好', note: ''
  });

  // 获取列表
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leasingApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        type: typeFilter || undefined,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
        inventoryStatus: inventoryFilter !== '' ? Number(inventoryFilter) : undefined,
        keyword: searchTerm,
      });
      setItems(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
    } catch (error) {
      console.error('获取租赁列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, typeFilter, statusFilter, inventoryFilter, searchTerm]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const fetchApplications = useCallback(async () => {
    setApplicationLoading(true);
    try {
      const res = await leasingApi.getApplications({ page: 1, size: 6, status: 0 });
      setApplications(res?.records || []);
    } catch (error) {
      console.error('获取租赁申请失败:', error);
    } finally {
      setApplicationLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

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
    setFormData({ name: '', type: 'financing', image: '', description: '', supplier: '', warehouseAddress: '', monthlyPrice: '', totalPrice: '', duration: '', dailyPrice: '', weeklyPrice: '', status: 1 });
    setEditModal({ visible: true, item: null, loading: false, isEdit: false });
  };

  // 打开编辑弹窗
  const openEditModal = (item) => {
    setFormData({
      name: item.name || '',
      type: item.type || 'financing',
      image: item.image || '',
      description: item.description || '',
      supplier: item.supplier || '',
      warehouseAddress: item.warehouseAddress || '',
      monthlyPrice: item.monthlyPrice || '',
      totalPrice: item.totalPrice || '',
      duration: item.duration || '',
      dailyPrice: item.dailyPrice || '',
      weeklyPrice: item.weeklyPrice || '',
      status: item.status ?? 1,
    });
    setEditModal({ visible: true, item, loading: false, isEdit: true });
  };

  const openRentModal = (item) => {
    setRentalForm({
      companyName: item.lesseeCompany || '',
      contactName: item.lesseeContactName || '',
      contactPhone: item.lesseeContactPhone || '',
      deliveryAddress: item.deliveryAddress || '',
      onsiteAddress: item.onsiteAddress || '',
      leaseStartDate: item.leaseStartDate || getToday(),
      expectedReturnDate: item.expectedReturnDate || '',
      leasePeriod: item.currentLeasePeriod || (item.type === 'operating' ? 'DAY' : 'MONTH'),
      leaseDuration: item.currentLeaseDuration || 1,
      rentalAmount: item.currentRentalAmount || '',
      remark: item.rentalRemark || '',
    });
    setRentModal({ visible: true, item, loading: false });
  };

  const openReturnModal = (item) => {
    setReturnForm({
      returnDate: getToday(),
      returnAddress: item.warehouseAddress || item.returnAddress || '',
      receiverName: item.returnReceiverName || '',
      equipmentCondition: item.equipmentCondition || '设备完好',
      note: '',
    });
    setReturnModal({ visible: true, item, loading: false });
  };

  // 保存设备
  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error('请输入设备名称'); return; }
    if (!formData.monthlyPrice) { toast.error('请输入月租金'); return; }

    setEditModal(prev => ({ ...prev, loading: true }));
    try {
      if (editModal.isEdit) {
        await leasingApi.update(editModal.item.id, formData);
        toast.success('设备更新成功');
      } else {
        await leasingApi.create(formData);
        toast.success('设备创建成功');
      }
      setEditModal({ visible: false, item: null, loading: false, isEdit: false });
      fetchList();
    } catch (error) {
      toast.error((editModal.isEdit ? '更新' : '创建') + '失败: ' + error.message);
    } finally {
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 删除设备
  const handleDelete = async () => {
    const { item } = deleteModal;
    if (!item) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await leasingApi.delete(item.id);
      toast.success('设备已删除');
      setDeleteModal({ visible: false, item: null, loading: false });
      fetchList();
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 切换状态
  const handleToggleStatus = async () => {
    const { item } = statusModal;
    if (!item) return;
    setStatusModal(prev => ({ ...prev, loading: true }));
    try {
      const newStatus = item.status === 1 ? 0 : 1;
      await leasingApi.updateStatus(item.id, newStatus);
      toast.success(newStatus === 1 ? '设备已上架' : '设备已下架');
      setStatusModal({ visible: false, item: null, loading: false });
      fetchList();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    } finally {
      setStatusModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 设备租出
  const handleRentOut = async () => {
    const { item } = rentModal;
    if (!item) return;
    if (!rentalForm.companyName.trim()) { toast.error('请输入承租企业'); return; }
    if (!rentalForm.contactName.trim()) { toast.error('请输入联系人'); return; }
    if (!rentalForm.contactPhone.trim()) { toast.error('请输入联系电话'); return; }
    if (!rentalForm.deliveryAddress.trim()) { toast.error('请输入配送地址'); return; }

    setRentModal(prev => ({ ...prev, loading: true }));
    try {
      await leasingApi.rentOut(item.id, {
        ...rentalForm,
        rentalAmount: rentalForm.rentalAmount === '' ? calcRentalAmount(item, rentalForm) : rentalForm.rentalAmount,
      });
      toast.success('设备已租出');
      setRentModal({ visible: false, item: null, loading: false });
      fetchList();
    } catch (error) {
      toast.error('租出失败: ' + error.message);
    } finally {
      setRentModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 设备收回
  const handleTakeBack = async () => {
    const { item } = returnModal;
    if (!item) return;

    setReturnModal(prev => ({ ...prev, loading: true }));
    try {
      await leasingApi.takeBack(item.id, {
        returnDate: returnForm.returnDate,
        returnAddress: returnForm.returnAddress,
        receiverName: returnForm.receiverName,
        equipmentCondition: returnForm.equipmentCondition,
        note: returnForm.note,
      });
      toast.success('设备已收回');
      setReturnModal({ visible: false, item: null, loading: false });
      fetchList();
    } catch (error) {
      toast.error('收回失败: ' + error.message);
    } finally {
      setReturnModal(prev => ({ ...prev, loading: false }));
    }
  };


  // 表格列配置
  const columns = [
    { key: 'id', title: 'ID' },
    {
      key: 'name',
      title: '设备名称',
      render: (_, r) => (
        <div className="space-y-1">
          <span className="font-medium text-gray-900 line-clamp-1">{r.name}</span>
          <p className="text-xs text-gray-500 line-clamp-1">{r.warehouseAddress || '未填写设备地址'}</p>
        </div>
      ),
    },
    {
      key: 'type', title: '租赁类型',
      render: (_, r) => <Badge type={r.type === 'financing' ? 'info' : 'success'}>{r.type === 'financing' ? '融资租赁' : '经营租赁'}</Badge>,
    },
    {
      key: 'price', title: '价格',
      render: (_, r) => r.type === 'financing'
        ? <span className="text-orange-500 font-bold">{formatCurrency(r.monthlyPrice, '/月')}</span>
        : (
            <div className="space-y-1">
              <p className="text-green-600 font-bold">{formatCurrency(r.dailyPrice, '/天')}</p>
              <p className="text-xs text-gray-500">{formatCurrency(r.monthlyPrice, '/月')}</p>
            </div>
          ),
    },
    { key: 'supplier', title: '供应商', render: (_, r) => r.supplier || '-' },
    {
      key: 'inventoryStatus', title: '租赁状态',
      render: (_, r) => (
        <div className="space-y-1">
          <Badge type={r.inventoryStatus === 1 ? 'warning' : 'success'}>{r.inventoryStatus === 1 ? '已租出' : '待租中'}</Badge>
          {r.inventoryStatus === 1 ? (
            <div className="text-xs text-gray-500">
              <p className="line-clamp-1">{r.lesseeCompany || '未填写承租企业'}</p>
              <p>{r.expectedReturnDate ? `预计收回 ${r.expectedReturnDate}` : '未填写收回日期'}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">{r.returnDate ? `最近收回 ${r.returnDate}` : '当前空闲'}</p>
          )}
        </div>
      ),
    },
    { key: 'leased', title: '已租次数', render: (_, r) => <span className="text-gray-600">{r.leased || 0}次</span> },
    {
      key: 'status', title: '状态',
      render: (_, r) => <Badge type={r.status === 1 ? 'success' : 'danger'}>{r.status === 1 ? '上架中' : '已下架'}</Badge>,
    },
    {
      key: 'actions', title: '操作',
      render: (_, r) => (
        <div className="flex flex-wrap gap-1">
          <Button type="default" size="sm" onClick={() => openEditModal(r)}><Edit2 size={14} /></Button>
          <Button type={r.status === 1 ? 'warning' : 'success'} size="sm" onClick={() => setStatusModal({ visible: true, item: r, loading: false })}>
            {r.status === 1 ? '下架' : '上架'}
          </Button>
          {r.inventoryStatus === 1 ? (
            <Button type="success" size="sm" onClick={() => openReturnModal(r)}><RotateCcw size={14} className="mr-1" />收回</Button>
          ) : (
            <Button type="warning" size="sm" disabled={r.status !== 1} onClick={() => openRentModal(r)}><PackageCheck size={14} className="mr-1" />租出</Button>
          )}
          <Button type="danger" size="sm" onClick={() => setDeleteModal({ visible: true, item: r, loading: false })}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ];

  // 统计数据
  const stats = {
    financing: items.filter(i => i.type === 'financing').length,
    operating: items.filter(i => i.type === 'operating').length,
    rented: items.filter(i => i.inventoryStatus === 1).length,
    available: items.filter(i => i.inventoryStatus !== 1).length,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-slate-700" />
          租赁管理
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="primary" onClick={openCreateModal}><Plus size={16} className="mr-1" />新增设备</Button>
          <select className="px-3 py-2 border rounded-lg text-sm" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部类型</option>
            <option value="financing">融资租赁</option>
            <option value="operating">经营租赁</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部状态</option>
            <option value="1">上架中</option>
            <option value="0">已下架</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm" value={inventoryFilter} onChange={(e) => { setInventoryFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部租赁状态</option>
            <option value="0">待租中</option>
            <option value="1">已租出</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="搜索设备名称/供应商..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-56" value={searchTerm} onChange={handleSearchChange} />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center"><TrendingUp className="text-white" size={20} /></div>
          <div><p className="text-xs text-gray-500">融资租赁</p><p className="text-lg font-bold text-gray-900">{stats.financing}</p></div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"><Calendar className="text-white" size={20} /></div>
          <div><p className="text-xs text-gray-500">经营租赁</p><p className="text-lg font-bold text-gray-900">{stats.operating}</p></div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"><PackageCheck className="text-white" size={20} /></div>
          <div><p className="text-xs text-gray-500">已租出</p><p className="text-lg font-bold text-gray-900">{stats.rented}</p></div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center"><RotateCcw className="text-white" size={20} /></div>
          <div><p className="text-xs text-gray-500">待租中</p><p className="text-lg font-bold text-gray-900">{stats.available}</p></div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">最新租赁申请</h3>
              <p className="mt-1 text-sm text-gray-500">管理员可以在这里快速看到待处理的租赁申请动态</p>
            </div>
            <Badge type="info">待处理 {applications.length} 条</Badge>
          </div>

          <div className="mt-4 space-y-3">
            {applicationLoading ? (
              <div className="rounded-2xl bg-white px-4 py-6 text-sm text-gray-500">正在加载租赁申请...</div>
            ) : applications.length === 0 ? (
              <div className="rounded-2xl bg-white px-4 py-6 text-sm text-gray-500">当前没有待处理租赁申请</div>
            ) : (
              applications.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="font-medium text-gray-900">申请企业：{item.companyName || '未填写'}</div>
                      <div className="mt-2 text-sm text-gray-500">联系人：{item.contactName || '未填写'} · {item.contactPhone || '未填写'}</div>
                      <div className="mt-2 text-sm text-gray-500">设备：{item.leasingName || `设备ID ${item.leasingId}`} · 供应商：{item.supplierName || '未填写'}</div>
                      <div className="mt-2 text-sm text-gray-500">租期：{item.leasePeriod || '未填写'} / {item.leaseDuration || 0}</div>
                      {item.deliveryAddress && <div className="mt-2 text-sm text-gray-500">配送地址：{item.deliveryAddress}</div>}
                    </div>
                    <div className="text-left lg:text-right">
                      <Badge type="warning">待审核</Badge>
                      <div className="mt-2 text-sm font-medium text-slate-700">¥{Number(item.estimatedCost || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} data={items} loading={loading} emptyText="暂无租赁设备" />
      <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} />


      {/* 编辑/新增弹窗 */}
      <Modal visible={editModal.visible} title={editModal.isEdit ? '编辑设备' : '新增设备'} onClose={() => setEditModal({ visible: false, item: null, loading: false, isEdit: false })} onConfirm={handleSave} confirmText="保存" loading={editModal.loading} width="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">设备名称 *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入设备名称" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">租赁类型 *</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm" value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}>
                <option value="financing">融资租赁</option>
                <option value="operating">经营租赁</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">供应商</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="供应商名称" value={formData.supplier} onChange={(e) => setFormData(p => ({ ...p, supplier: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." value={formData.image} onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">设备地址 / 仓库地址</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入设备所在仓库或发货地址" value={formData.warehouseAddress} onChange={(e) => setFormData(p => ({ ...p, warehouseAddress: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">设备描述</label>
            <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="设备描述..." value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
          </div>

          {/* 融资租赁字段 */}
          {formData.type === 'financing' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">月租金 *</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.monthlyPrice} onChange={(e) => setFormData(p => ({ ...p, monthlyPrice: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">设备总价</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.totalPrice} onChange={(e) => setFormData(p => ({ ...p, totalPrice: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">租期</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="如: 36个月" value={formData.duration} onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))} />
              </div>
            </div>
          )}

          {/* 经营租赁字段 */}
          {formData.type === 'operating' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日租金</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.dailyPrice} onChange={(e) => setFormData(p => ({ ...p, dailyPrice: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">周租金</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.weeklyPrice} onChange={(e) => setFormData(p => ({ ...p, weeklyPrice: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">月租金 *</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" value={formData.monthlyPrice} onChange={(e) => setFormData(p => ({ ...p, monthlyPrice: e.target.value }))} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: Number(e.target.value) }))}>
              <option value={1}>上架</option>
              <option value={0}>下架</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* 租出弹窗 */}
      <Modal visible={rentModal.visible} title="租赁出去" onClose={() => setRentModal({ visible: false, item: null, loading: false })} onConfirm={handleRentOut} confirmText="确认租出" confirmType="warning" loading={rentModal.loading} width="xl">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <p className="font-medium text-gray-900">{rentModal.item?.name}</p>
            <p className="text-sm text-gray-500 mt-1">{rentModal.item?.supplier || '未填写供应商'} · {rentModal.item?.warehouseAddress || '未填写设备地址'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">承租企业 *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.companyName} onChange={(e) => setRentalForm(p => ({ ...p, companyName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人 *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.contactName} onChange={(e) => setRentalForm(p => ({ ...p, contactName: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.contactPhone} onChange={(e) => setRentalForm(p => ({ ...p, contactPhone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">配送地址 *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.deliveryAddress} onChange={(e) => setRentalForm(p => ({ ...p, deliveryAddress: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">使用地址</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.onsiteAddress} onChange={(e) => setRentalForm(p => ({ ...p, onsiteAddress: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
              <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.leaseStartDate} onChange={(e) => setRentalForm(p => ({ ...p, leaseStartDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">预计收回日期</label>
              <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.expectedReturnDate} onChange={(e) => setRentalForm(p => ({ ...p, expectedReturnDate: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">租赁周期</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.leasePeriod} onChange={(e) => setRentalForm(p => ({ ...p, leasePeriod: e.target.value }))}>
                {rentModal.item?.type === 'financing' ? (
                  <option value="MONTH">按月</option>
                ) : (
                  <>
                    <option value="DAY">按天</option>
                    <option value="WEEK">按周</option>
                    <option value="MONTH">按月</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">租赁时长</label>
              <input type="number" min="1" className="w-full px-3 py-2 border rounded-lg text-sm" value={rentalForm.leaseDuration} onChange={(e) => setRentalForm(p => ({ ...p, leaseDuration: Math.max(1, Number(e.target.value) || 1) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">租赁金额</label>
              <input type="number" min="0" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={`默认 ${formatCurrency(calcRentalAmount(rentModal.item, rentalForm))}`} value={rentalForm.rentalAmount} onChange={(e) => setRentalForm(p => ({ ...p, rentalAmount: e.target.value }))} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">系统预估租金</p>
            <p className="text-2xl font-bold text-slate-700 mt-1">{formatCurrency(calcRentalAmount(rentModal.item, rentalForm))}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={rentalForm.remark} onChange={(e) => setRentalForm(p => ({ ...p, remark: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* 收回弹窗 */}
      <Modal visible={returnModal.visible} title="收回设备" onClose={() => setReturnModal({ visible: false, item: null, loading: false })} onConfirm={handleTakeBack} confirmText="确认收回" confirmType="success" loading={returnModal.loading} width="lg">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="font-medium text-gray-900">{returnModal.item?.name}</p>
            <p className="text-sm text-gray-500 mt-1">{returnModal.item?.lesseeCompany || '未填写承租企业'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">收回日期</label>
              <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" value={returnForm.returnDate} onChange={(e) => setReturnForm(p => ({ ...p, returnDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">接收人</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={returnForm.receiverName} onChange={(e) => setReturnForm(p => ({ ...p, receiverName: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">收回地址</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={returnForm.returnAddress} onChange={(e) => setReturnForm(p => ({ ...p, returnAddress: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">设备状态</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm" value={returnForm.equipmentCondition} onChange={(e) => setReturnForm(p => ({ ...p, equipmentCondition: e.target.value }))}>
              <option value="设备完好">设备完好</option>
              <option value="轻微磨损">轻微磨损</option>
              <option value="需检修">需检修</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={returnForm.note} onChange={(e) => setReturnForm(p => ({ ...p, note: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* 状态切换弹窗 */}
      <Modal visible={statusModal.visible} title="确认操作" onClose={() => setStatusModal({ visible: false, item: null, loading: false })} onConfirm={handleToggleStatus} confirmText="确定" confirmType={statusModal.item?.status === 1 ? 'danger' : 'success'} loading={statusModal.loading}>
        <p className="text-gray-600">确定要{statusModal.item?.status === 1 ? '下架' : '上架'}设备 <span className="font-medium text-gray-900">{statusModal.item?.name}</span> 吗？</p>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal visible={deleteModal.visible} title="确认删除" onClose={() => setDeleteModal({ visible: false, item: null, loading: false })} onConfirm={handleDelete} confirmText="确认删除" confirmType="danger" loading={deleteModal.loading}>
        <p className="text-gray-600">确定要删除设备 <span className="font-medium text-gray-900">{deleteModal.item?.name}</span> 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default LeasingList;
