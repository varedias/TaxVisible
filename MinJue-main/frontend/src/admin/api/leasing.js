import { api } from '../../api';

/**
 * 租赁管理 API
 */
export const leasingApi = {
  /**
   * 获取租赁设备列表
   */
  getList: async (params = {}) => {
    const { page = 1, size = 10, type, status, inventoryStatus, keyword } = params;
    const res = await api.get('/api/admin/leasing/list', {
      params: { page, size, type, status, inventoryStatus, name: keyword },
    });
    return res.data;
  },

  /**
   * 获取租赁设备详情
   */
  getDetail: async (id) => {
    const res = await api.get(`/api/admin/leasing/${id}`);
    return res.data;
  },

  /**
   * 创建租赁设备
   */
  create: async (data) => {
    const res = await api.post('/api/admin/leasing/create', data);
    return res.data;
  },

  /**
   * 更新租赁设备
   */
  update: async (id, data) => {
    const res = await api.put(`/api/admin/leasing/${id}`, data);
    return res.data;
  },

  /**
   * 删除租赁设备
   */
  delete: async (id) => {
    const res = await api.delete(`/api/admin/leasing/${id}`);
    return res.data;
  },

  /**
   * 更新租赁设备状态
   */
  updateStatus: async (id, status) => {
    const res = await api.post('/api/admin/leasing/status', { id, status });
    return res.data;
  },

  /**
   * 设备租出
   */
  rentOut: async (id, data) => {
    const res = await api.post(`/api/admin/leasing/${id}/rent-out`, data);
    return res.data;
  },

  /**
   * 设备收回
   */
  takeBack: async (id, data) => {
    const res = await api.post(`/api/admin/leasing/${id}/take-back`, data);
    return res.data;
  },

  /**
   * 获取租赁申请列表
   */
  getApplications: async (params = {}) => {
    const { page = 1, size = 10, status, keyword } = params;
    const res = await api.get('/api/admin/leasing/applications', {
      params: { page, size, status, keyword },
    });
    return res.data;
  },

  /**
   * 审核租赁申请
   */
  reviewApplication: async (id, status) => {
    const res = await api.post('/api/admin/leasing/applications/review', { id, status });
    return res.data;
  },
};
