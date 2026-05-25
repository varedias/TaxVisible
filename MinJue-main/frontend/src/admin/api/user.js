import { api } from '../../api';

/**
 * 用户管理 API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  getList: async (params = {}) => {
    const { page = 1, size = 10, username, role, status } = params;
    const res = await api.get('/api/admin/user/list', {
      params: { page, size, username, role, status },
    });
    return res.data;
  },

  /**
   * 获取用户详情
   */
  getDetail: async (id) => {
    const res = await api.get(`/api/admin/user/${id}`);
    return res.data;
  },

  /**
   * 创建用户
   */
  create: async (data) => {
    const res = await api.post('/api/admin/user/create', data);
    return res.data;
  },

  /**
   * 更新用户
   */
  update: async (id, data) => {
    const res = await api.put(`/api/admin/user/${id}`, data);
    return res.data;
  },

  /**
   * 删除用户
   */
  delete: async (id) => {
    const res = await api.delete(`/api/admin/user/${id}`);
    return res.data;
  },

  /**
   * 更新用户状态
   */
  updateStatus: async (userId, status) => {
    const res = await api.put(`/api/admin/user/${userId}/status`, null, {
      params: { status },
    });
    return res.data;
  },

  /**
   * 重置用户密码
   */
  resetPassword: async (id) => {
    const res = await api.post(`/api/admin/user/${id}/reset-password`);
    return res.data;
  },

  /**
   * 批量删除用户
   */
  batchDelete: async (ids) => {
    const res = await api.delete('/api/admin/user/batch', { data: ids });
    return res.data;
  },

  /**
   * 批量更新用户状态
   */
  batchUpdateStatus: async (ids, status) => {
    const res = await api.put('/api/admin/user/batch/status', { ids, status });
    return res.data;
  },
};
