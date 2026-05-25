import { useEffect, useState, useCallback } from 'react';
import { Building2, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast } from '../components/common/Toast';
import { supplierApi } from '../api/supplier';

/**
 * 供应商管理页面 - 完整CRUD
 */
const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 弹窗状态
  const [editModal, setEditModal] = useState({ visible: false, supplier: null, loading: false, isEdit: false });
  const [deleteModal, setDeleteModal] = useState({ visible: false, supplier: null, loading: false });
  const [detailModal, setDetailModal] = useState({ visible: false, supplier: null });
  const [auditModal, setAuditModal] = useState({ visible: false, supplier: null, pass: true, reason: '', loading: false });

  // 表单数据
  const [formData, setFormData] = useState({
    name: '', logo: '', description: '', contactName: '', contactPhone: '', contactEmail: '', contactAddress: '', isVerified: 1
  });

  // 获取供应商列表
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await supplierApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        name: searchTerm,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
      });
      setSuppliers(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
    } catch (error) {
      console.error('获取供应商列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchTerm, statusFilter]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  // 搜索防抖
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setPagination(prev => ({ ...prev, current: 1 })), 500));
  };

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, current: page }));

  // 解析联系信息
  const parseContactInfo = (contactInfo) => {
    try { return JSON.parse(contactInfo || '{}'); } catch { return {}; }
  };


  // 打开新增弹窗
  const openCreateModal = () => {
    setFormData({ name: '', logo: '', description: '', contactName: '', contactPhone: '', contactEmail: '', contactAddress: '', isVerified: 1 });
    setEditModal({ visible: true, supplier: null, loading: false, isEdit: false });
  };

  // 打开编辑弹窗
  const openEditModal = (supplier) => {
    const contact = parseContactInfo(supplier.contactInfo);
    setFormData({
      name: supplier.name || '',
      logo: supplier.logo || '',
      description: supplier.description || '',
      contactName: contact.name || '',
      contactPhone: contact.phone || '',
      contactEmail: contact.email || '',
      contactAddress: contact.address || '',
      isVerified: supplier.isVerified ?? 1,
    });
    setEditModal({ visible: true, supplier, loading: false, isEdit: true });
  };

  // 保存供应商
  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error('请输入供应商名称'); return; }

    const data = {
      name: formData.name,
      logo: formData.logo,
      description: formData.description,
      contactInfo: JSON.stringify({
        name: formData.contactName,
        phone: formData.contactPhone,
        email: formData.contactEmail,
        address: formData.contactAddress,
      }),
      isVerified: formData.isVerified,
    };

    setEditModal(prev => ({ ...prev, loading: true }));
    try {
      if (editModal.isEdit) {
        await supplierApi.update(editModal.supplier.id, data);
        toast.success('供应商更新成功');
      } else {
        await supplierApi.create(data);
        toast.success('供应商创建成功');
      }
      setEditModal({ visible: false, supplier: null, loading: false, isEdit: false });
      fetchSuppliers();
    } catch (error) {
      toast.error((editModal.isEdit ? '更新' : '创建') + '失败: ' + error.message);
    } finally {
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 删除供应商
  const handleDelete = async () => {
    const { supplier } = deleteModal;
    if (!supplier) return;
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await supplierApi.delete(supplier.id);
      toast.success('供应商已删除');
      setDeleteModal({ visible: false, supplier: null, loading: false });
      fetchSuppliers();
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 执行审核
  const handleAudit = async () => {
    const { supplier, pass, reason } = auditModal;
    if (!supplier) return;
    if (!pass && !reason.trim()) { toast.warning('请填写拒绝原因'); return; }

    setAuditModal(prev => ({ ...prev, loading: true }));
    try {
      await supplierApi.audit(supplier.id, pass, reason);
      toast.success(pass ? '审核已通过' : '已拒绝该供应商');
      setAuditModal({ visible: false, supplier: null, pass: true, reason: '', loading: false });
      setDetailModal({ visible: false, supplier: null });
      fetchSuppliers();
    } catch (error) {
      toast.error('审核失败: ' + error.message);
    } finally {
      setAuditModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 状态映射
  const statusMap = {
    0: { type: 'warning', text: '待审核' },
    1: { type: 'success', text: '已认证' },
    2: { type: 'danger', text: '已拒绝' },
  };


  // 表格列配置
  const columns = [
    { key: 'id', title: 'ID' },
    {
      key: 'logo', title: 'Logo',
      render: (_, r) => r.logo ? <img src={r.logo} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Building2 size={20} className="text-gray-400" /></div>,
    },
    { key: 'name', title: '公司名称', render: (_, r) => <span className="font-medium text-gray-900">{r.name}</span> },
    {
      key: 'contact', title: '联系方式',
      render: (_, r) => {
        const contact = parseContactInfo(r.contactInfo);
        return <span className="text-sm text-gray-600">{contact.phone || contact.email || '-'}</span>;
      },
    },
    {
      key: 'status', title: '状态',
      render: (_, r) => {
        const status = statusMap[r.isVerified] || { type: 'gray', text: '未知' };
        return <Badge type={status.type}>{status.text}</Badge>;
      },
    },
    { key: 'createTime', title: '创建时间', render: (_, r) => r.createTime ? new Date(r.createTime).toLocaleDateString() : '-' },
    {
      key: 'actions', title: '操作',
      render: (_, r) => (
        <div className="flex gap-1">
          <Button type="outline" size="sm" onClick={() => setDetailModal({ visible: true, supplier: r })}>详情</Button>
          <Button type="default" size="sm" onClick={() => openEditModal(r)}><Edit2 size={14} /></Button>
          {r.isVerified === 0 && (
            <>
              <Button type="success" size="sm" onClick={() => setAuditModal({ visible: true, supplier: r, pass: true, reason: '', loading: false })}>通过</Button>
              <Button type="danger" size="sm" onClick={() => setAuditModal({ visible: true, supplier: r, pass: false, reason: '', loading: false })}>拒绝</Button>
            </>
          )}
          <Button type="danger" size="sm" onClick={() => setDeleteModal({ visible: true, supplier: r, loading: false })}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Building2 className="text-slate-700" />
          供应商管理
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="primary" onClick={openCreateModal}><Plus size={16} className="mr-1" />新增供应商</Button>
          <select className="px-3 py-2 border rounded-lg text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部状态</option>
            <option value="0">待审核</option>
            <option value="1">已认证</option>
            <option value="2">已拒绝</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="搜索供应商名称..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-56" value={searchTerm} onChange={handleSearchChange} />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      <Table columns={columns} data={suppliers} loading={loading} emptyText="暂无供应商数据" />
      <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} />

      {/* 编辑/新增弹窗 */}
      <Modal visible={editModal.visible} title={editModal.isEdit ? '编辑供应商' : '新增供应商'} onClose={() => setEditModal({ visible: false, supplier: null, loading: false, isEdit: false })} onConfirm={handleSave} confirmText="保存" loading={editModal.loading} width="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入公司名称" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." value={formData.logo} onChange={(e) => setFormData(p => ({ ...p, logo: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司简介</label>
            <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} placeholder="公司简介..." value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="联系人姓名" value={formData.contactName} onChange={(e) => setFormData(p => ({ ...p, contactName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="联系电话" value={formData.contactPhone} onChange={(e) => setFormData(p => ({ ...p, contactPhone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="邮箱" value={formData.contactEmail} onChange={(e) => setFormData(p => ({ ...p, contactEmail: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">认证状态</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm" value={formData.isVerified} onChange={(e) => setFormData(p => ({ ...p, isVerified: Number(e.target.value) }))}>
                <option value={0}>待审核</option>
                <option value={1}>已认证</option>
                <option value={2}>已拒绝</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="公司地址" value={formData.contactAddress} onChange={(e) => setFormData(p => ({ ...p, contactAddress: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* 详情弹窗 */}
      <Modal visible={detailModal.visible} title="供应商详情" onClose={() => setDetailModal({ visible: false, supplier: null })} showFooter={false} width="lg">
        {detailModal.supplier && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase">公司名称</label><p className="font-medium text-gray-900 mt-1">{detailModal.supplier.name}</p></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">状态</label><div className="mt-1"><Badge type={statusMap[detailModal.supplier.isVerified]?.type}>{statusMap[detailModal.supplier.isVerified]?.text}</Badge></div></div>
            </div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">公司简介</label><p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">{detailModal.supplier.description || '暂无简介'}</p></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">联系信息</label>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">
                {(() => {
                  const contact = parseContactInfo(detailModal.supplier.contactInfo);
                  return (<div className="space-y-1">{contact.name && <p>联系人: {contact.name}</p>}{contact.phone && <p>电话: {contact.phone}</p>}{contact.email && <p>邮箱: {contact.email}</p>}{contact.address && <p>地址: {contact.address}</p>}{!contact.name && !contact.phone && !contact.email && <p>暂无联系信息</p>}</div>);
                })()}
              </div>
            </div>
            {detailModal.supplier.isVerified === 0 && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="danger" onClick={() => setAuditModal({ visible: true, supplier: detailModal.supplier, pass: false, reason: '', loading: false })}>拒绝</Button>
                <Button type="success" onClick={() => setAuditModal({ visible: true, supplier: detailModal.supplier, pass: true, reason: '', loading: false })}>通过</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal visible={auditModal.visible} title={auditModal.pass ? '确认通过' : '确认拒绝'} onClose={() => setAuditModal({ visible: false, supplier: null, pass: true, reason: '', loading: false })} onConfirm={handleAudit} confirmText={auditModal.pass ? '确认通过' : '确认拒绝'} confirmType={auditModal.pass ? 'success' : 'danger'} loading={auditModal.loading}>
        <div className="space-y-4">
          <p className="text-gray-600">{auditModal.pass ? '确定通过供应商' : '确定拒绝供应商'} <span className="font-medium text-gray-900">{auditModal.supplier?.name}</span> 的入驻申请吗？</p>
          {!auditModal.pass && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">拒绝原因 <span className="text-red-500">*</span></label>
              <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} placeholder="请输入拒绝原因..." value={auditModal.reason} onChange={(e) => setAuditModal(p => ({ ...p, reason: e.target.value }))} />
            </div>
          )}
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal visible={deleteModal.visible} title="确认删除" onClose={() => setDeleteModal({ visible: false, supplier: null, loading: false })} onConfirm={handleDelete} confirmText="确认删除" confirmType="danger" loading={deleteModal.loading}>
        <p className="text-gray-600">确定要删除供应商 <span className="font-medium text-gray-900">{deleteModal.supplier?.name}</span> 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default SupplierList;
