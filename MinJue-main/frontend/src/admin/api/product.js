import { api } from '../../api';

/**
 * 商品管理 API
 */
export const productApi = {
  /**
   * 获取商品列表
   */
  getList: async (params = {}) => {
    const { page = 1, size = 10, keyword, status } = params;
    const res = await api.get('/api/admin/product/list', {
      params: { page, size, name: keyword, status },
    });
    return res.data;
  },

  /**
   * 获取商品详情
   */
  getDetail: async (id) => {
    const res = await api.get(`/api/admin/product/${id}`);
    return res.data;
  },

  /**
   * 创建商品
   */
  create: async (data) => {
    const res = await api.post('/api/admin/product/create', data);
    return res.data;
  },

  /**
   * 更新商品
   */
  update: async (id, data) => {
    const res = await api.put(`/api/admin/product/${id}`, data);
    return res.data;
  },

  /**
   * 删除商品
   */
  delete: async (id) => {
    const res = await api.delete(`/api/admin/product/${id}`);
    return res.data;
  },

  /**
   * 强制下架商品
   */
  offShelf: async (id, reason = '') => {
    const res = await api.post('/api/admin/product/off-shelf', { id, reason });
    return res.data;
  },

  /**
   * 上架商品
   */
  onShelf: async (id) => {
    const res = await api.post('/api/admin/product/on-shelf', { id });
    return res.data;
  },

  /**
   * 批量删除商品
   */
  batchDelete: async (ids) => {
    const res = await api.delete('/api/admin/product/batch', { data: ids });
    return res.data;
  },

  /**
   * 批量上架商品
   */
  batchOnShelf: async (ids) => {
    const res = await api.post('/api/admin/product/batch/on-shelf', ids);
    return res.data;
  },

  /**
   * 批量下架商品
   */
  batchOffShelf: async (ids) => {
    const res = await api.post('/api/admin/product/batch/off-shelf', ids);
    return res.data;
  },
};
