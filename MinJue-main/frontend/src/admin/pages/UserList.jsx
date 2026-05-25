import { useEffect, useState, useCallback } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Key, UserX, UserCheck } from 'lucide-react';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast } from '../components/common/Toast';
import { userApi } from '../api/user';

/**
 * 用户管理页面 - 完整CRUD + 批量操作
 */
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedIds, setSelectedIds] = useState([]);

  // 弹窗状态
  const [editModal, setEditModal] = useState({ visible: false, user: null, loading: false, isEdit: false });
  const [deleteModal, setDeleteModal] = useState({ visible: false, user: null, loading: false, isBatch: false });
  const [statusModal, setStatusModal] = useState({ visible: false, user: null, loading: false });

  // 表单数据
  const [formData, setFormData] = useState({
    username: '', password: '', nickname: '', email: '', phone: '', role: 'USER', status: 1
  });

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        username: searchTerm,
        role: roleFilter || undefined,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
      });
      setUsers(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
      setSelectedIds([]);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchTerm, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // 搜索防抖
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => setPagination(prev => ({ ...prev, current: 1 })), 500));
  };

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, current: page }));

  // 选择操作
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    const nonAdminUsers = users.filter(u => u.role !== 'ADMIN');
    setSelectedIds(nonAdminUsers.length > 0 && selectedIds.length === nonAdminUsers.length ? [] : nonAdminUsers.map(u => u.id));
  };


  // 打开新增弹窗
  const openCreateModal = () => {
    setFormData({ username: '', password: '', nickname: '', email: '', phone: '', role: 'USER', status: 1 });
    setEditModal({ visible: true, user: null, loading: false, isEdit: false });
  };

  // 打开编辑弹窗
  const openEditModal = (user) => {
    setFormData({
      username: user.username || '',
      password: '', // 编辑时不显示密码
      nickname: user.nickname || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'USER',
      status: user.status ?? 1,
    });
    setEditModal({ visible: true, user, loading: false, isEdit: true });
  };

  // 保存用户
  const handleSave = async () => {
    if (!formData.username.trim()) { toast.error('请输入用户名'); return; }
    if (!editModal.isEdit && !formData.password) { toast.error('请输入密码'); return; }

    setEditModal(prev => ({ ...prev, loading: true }));
    try {
      if (editModal.isEdit) {
        await userApi.update(editModal.user.id, formData);
        toast.success('用户更新成功');
      } else {
        await userApi.create(formData);
        toast.success('用户创建成功');
      }
      setEditModal({ visible: false, user: null, loading: false, isEdit: false });
      fetchUsers();
    } catch (error) {
      toast.error((editModal.isEdit ? '更新' : '创建') + '失败: ' + error.message);
    } finally {
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 删除用户
  const handleDelete = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      if (deleteModal.isBatch) {
        await userApi.batchDelete(selectedIds);
        toast.success(`已删除 ${selectedIds.length} 个用户`);
      } else {
        await userApi.delete(deleteModal.user.id);
        toast.success('用户已删除');
      }
      setDeleteModal({ visible: false, user: null, loading: false, isBatch: false });
      fetchUsers();
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 批量启用
  const handleBatchEnable = async () => {
    if (selectedIds.length === 0) return;
    try {
      await userApi.batchUpdateStatus(selectedIds, 1);
      toast.success(`已启用 ${selectedIds.length} 个用户`);
      fetchUsers();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    }
  };

  // 批量禁用
  const handleBatchDisable = async () => {
    if (selectedIds.length === 0) return;
    try {
      await userApi.batchUpdateStatus(selectedIds, 0);
      toast.success(`已禁用 ${selectedIds.length} 个用户`);
      fetchUsers();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    }
  };

  // 切换用户状态
  const handleToggleStatus = async () => {
    const { user } = statusModal;
    if (!user) return;
    setStatusModal(prev => ({ ...prev, loading: true }));
    try {
      const newStatus = user.status === 1 ? 0 : 1;
      await userApi.updateStatus(user.id, newStatus);
      toast.success(newStatus === 1 ? '用户已启用' : '用户已禁用');
      setStatusModal({ visible: false, user: null, loading: false });
      fetchUsers();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    } finally {
      setStatusModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 重置密码
  const handleResetPassword = async (user) => {
    if (!window.confirm(`确定要重置用户 ${user.username} 的密码为 123456 吗？`)) return;
    try {
      await userApi.resetPassword(user.id);
      toast.success('密码已重置为 123456');
    } catch (error) {
      toast.error('重置失败: ' + error.message);
    }
  };

  // 角色映射
  const roleMap = {
    ADMIN: { type: 'purple', text: '管理员' },
    SUPPLIER: { type: 'info', text: '供应商' },
    USER: { type: 'gray', text: '普通用户' },
  };


  // 表格列配置
  const columns = [
    {
      key: 'select', title: (
        <input type="checkbox" checked={users.filter(u => u.role !== 'ADMIN').length > 0 && selectedIds.length === users.filter(u => u.role !== 'ADMIN').length} onChange={toggleSelectAll} className="w-4 h-4 rounded" />
      ), width: 40,
      render: (_, r) => r.role === 'ADMIN' ? null : <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 rounded" />,
    },
    { key: 'id', title: 'ID' },
    { key: 'username', title: '用户名', render: (_, r) => <span className="font-medium text-gray-900">{r.username}</span> },
    { key: 'nickname', title: '昵称', render: (_, r) => r.nickname || '-' },
    { key: 'email', title: '邮箱', render: (_, r) => r.email || '-' },
    {
      key: 'role', title: '角色',
      render: (_, r) => {
        const role = roleMap[r.role] || { type: 'gray', text: r.role };
        return <Badge type={role.type}>{role.text}</Badge>;
      },
    },
    {
      key: 'status', title: '状态',
      render: (_, r) => <Badge type={r.status === 1 ? 'success' : 'danger'}>{r.status === 1 ? '正常' : '已禁用'}</Badge>,
    },
    { key: 'createTime', title: '注册时间', render: (_, r) => r.createTime ? new Date(r.createTime).toLocaleDateString() : '-' },
    {
      key: 'actions', title: '操作',
      render: (_, r) => {
        if (r.role === 'ADMIN') return <span className="text-gray-400 text-sm">-</span>;
        return (
          <div className="flex gap-1">
            <Button type="default" size="sm" onClick={() => openEditModal(r)} title="编辑"><Edit2 size={14} /></Button>
            <Button type="warning" size="sm" onClick={() => handleResetPassword(r)} title="重置密码"><Key size={14} /></Button>
            <Button type={r.status === 1 ? 'danger' : 'success'} size="sm" onClick={() => setStatusModal({ visible: true, user: r, loading: false })}>
              {r.status === 1 ? '禁用' : '启用'}
            </Button>
            <Button type="danger" size="sm" onClick={() => setDeleteModal({ visible: true, user: r, loading: false, isBatch: false })}><Trash2 size={14} /></Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="text-slate-700" />
          用户管理
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="primary" onClick={openCreateModal}><Plus size={16} className="mr-1" />新增用户</Button>
          <select className="px-3 py-2 border rounded-lg text-sm" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部角色</option>
            <option value="USER">普通用户</option>
            <option value="SUPPLIER">供应商</option>
            <option value="ADMIN">管理员</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, current: 1 })); }}>
            <option value="">全部状态</option>
            <option value="1">正常</option>
            <option value="0">已禁用</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="搜索用户名/昵称..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-56" value={searchTerm} onChange={handleSearchChange} />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      <Table columns={columns} data={users} loading={loading} emptyText="暂无用户数据" />

      {/* 批量操作栏 */}
      {selectedIds.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
          <span className="text-sm text-slate-800">已选择 {selectedIds.length} 项</span>
          <button onClick={handleBatchEnable} className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1">
            <UserCheck size={14} />批量启用
          </button>
          <button onClick={handleBatchDisable} className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1">
            <UserX size={14} />批量禁用
          </button>
          <button onClick={() => setDeleteModal({ visible: true, user: null, loading: false, isBatch: true })} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1">
            <Trash2 size={14} />批量删除
          </button>
        </div>
      )}

      <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} />

      {/* 编辑/新增弹窗 */}
      <Modal visible={editModal.visible} title={editModal.isEdit ? '编辑用户' : '新增用户'} onClose={() => setEditModal({ visible: false, user: null, loading: false, isEdit: false })} onConfirm={handleSave} confirmText="保存" loading={editModal.loading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名 *</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入用户名" value={formData.username} onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))} disabled={editModal.isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{editModal.isEdit ? '新密码（留空不修改）' : '密码 *'}</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={editModal.isEdit ? '留空不修改' : '请输入密码'} value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="昵称" value={formData.nickname} onChange={(e) => setFormData(p => ({ ...p, nickname: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm" value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}>
                <option value="USER">普通用户</option>
                <option value="SUPPLIER">供应商</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="邮箱" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="手机号" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: Number(e.target.value) }))}>
              <option value={1}>正常</option>
              <option value={0}>禁用</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* 状态切换弹窗 */}
      <Modal visible={statusModal.visible} title="确认操作" onClose={() => setStatusModal({ visible: false, user: null, loading: false })} onConfirm={handleToggleStatus} confirmText="确定" confirmType={statusModal.user?.status === 1 ? 'danger' : 'success'} loading={statusModal.loading}>
        <p className="text-gray-600">确定要{statusModal.user?.status === 1 ? '禁用' : '启用'}用户 <span className="font-medium text-gray-900">{statusModal.user?.username}</span> 吗？</p>
        {statusModal.user?.status === 1 && <p className="text-sm text-red-500 mt-2">禁用后该用户将无法登录系统。</p>}
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal visible={deleteModal.visible} title="确认删除" onClose={() => setDeleteModal({ visible: false, user: null, loading: false, isBatch: false })} onConfirm={handleDelete} confirmText="确认删除" confirmType="danger" loading={deleteModal.loading}>
        <p className="text-gray-600">
          {deleteModal.isBatch 
            ? `确定要删除选中的 ${selectedIds.length} 个用户吗？此操作不可恢复。`
            : <>确定要删除用户 <span className="font-medium text-gray-900">{deleteModal.user?.username}</span> 吗？此操作不可恢复。</>
          }
        </p>
      </Modal>
    </div>
  );
};

export default UserList;
