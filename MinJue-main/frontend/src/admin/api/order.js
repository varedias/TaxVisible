import { api } from '../../api/index';

const BASE_URL = '/api/admin/order';

/**
 * 订单管理 API
 */
export const orderApi = {
  // 获取订单列表
  getList: async (params = {}) => {
    const { page = 1, size = 10, orderNo, status } = params;
    const res = await api.get(`${BASE_URL}/list`, {
      params: { page, size, orderNo, status }
    });
    return res.data || { records: [], total: 0 };
  },

  // 获取订单详情
  getDetail: async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  // 更新订单状态
  updateStatus: async (id, status) => {
    const res = await api.put(`${BASE_URL}/${id}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  // 删除订单
  delete: async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  },

  // 批量删除订单
  batchDelete: async (ids) => {
    const res = await api.delete(`${BASE_URL}/batch`, { data: ids });
    return res.data;
  },

  // 获取订单统计
  getStats: async () => {
    const res = await api.get(`${BASE_URL}/stats`);
    return res.data;
  },
};
