import { api } from '../../api';

/**
 * 供应商管理 API
 */
export const supplierApi = {
  /**
   * 获取待审核供应商列表
   */
  getAuditList: async (params = {}) => {
    const { page = 1, size = 10 } = params;
    const res = await api.get('/api/admin/supplier/audit/list', {
      params: { page, size },
    });
    return res.data;
  },

  /**
   * 获取所有供应商列表
   */
  getList: async (params = {}) => {
    const { page = 1, size = 10, status, name } = params;
    const res = await api.get('/api/admin/supplier/list', {
      params: { page, size, status, name },
    });
    return res.data;
  },

  /**
   * 获取供应商详情
   */
  getDetail: async (id) => {
    const res = await api.get(`/api/admin/supplier/${id}`);
    return res.data;
  },

  /**
   * 创建供应商
   */
  create: async (data) => {
    const res = await api.post('/api/admin/supplier/create', data);
    return res.data;
  },

  /**
   * 更新供应商
   */
  update: async (id, data) => {
    const res = await api.put(`/api/admin/supplier/${id}`, data);
    return res.data;
  },

  /**
   * 删除供应商
   */
  delete: async (id) => {
    const res = await api.delete(`/api/admin/supplier/${id}`);
    return res.data;
  },

  /**
   * 审核供应商
   */
  audit: async (id, pass, reason = '') => {
    const res = await api.post('/api/admin/supplier/audit', { id, pass, reason });
    return res.data;
  },

  /**
   * 更新供应商状态
   */
  updateStatus: async (id, status) => {
    const res = await api.post('/api/admin/supplier/status', { id, status });
    return res.data;
  },
};
