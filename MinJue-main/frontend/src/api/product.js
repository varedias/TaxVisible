import { api } from './index';

/**
 * 用户端商品 API
 */
export const productApi = {
  /**
   * 获取商品列表（用户端）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页条数
   * @param {string} params.keyword - 搜索关键词
   * @param {number} params.categoryId - 分类ID
   * @param {string} params.sort - 排序方式
   * @param {boolean} params.includeOffShelf - 是否包含下架商品（默认false）
   */
  getList: async (params = {}) => {
    const { page = 1, size = 12, keyword, categoryId, supplierId, sort, includeOffShelf = false } = params;
    try {
      const res = await api.get('/api/v1/product/list', {
        params: { page, size, name: keyword, categoryId, supplierId, sort, includeOffShelf },
      });
      return res.data;
    } catch (error) {
      console.error('获取商品列表失败:', error);
      return { records: [], total: 0 };
    }
  },

  /**
   * 获取商品详情
   */
  getDetail: async (id) => {
    try {
      const res = await api.get(`/api/v1/product/${id}`);
      return res.data;
    } catch (error) {
      console.error('获取商品详情失败:', error);
      return null;
    }
  },

  /**
   * 获取商品分类
   */
  getCategories: async () => {
    try {
      const res = await api.get('/api/v1/product/categories');
      return res.data;
    } catch (error) {
      console.error('获取分类失败:', error);
      return [];
    }
  },
};

/**
 * 供应商商品管理 API
 */
export const supplierProductApi = {
  /** 获取自己的商品列表 */
  getMyProducts: async (params = {}) => {
    const { page = 1, size = 20 } = params;
    try {
      const res = await api.get('/api/v1/product/supplier/my', { params: { page, size } });
      return res.data;
    } catch (error) {
      console.error('获取供应商商品列表失败:', error);
      return { records: [], total: 0 };
    }
  },
  /** 删除商品 */
  deleteProduct: async (id) => {
    const res = await api.delete(`/api/v1/product/supplier/${id}`);
    return res.data;
  },
  /** 上下架商品 */
  toggleStatus: async (id, status) => {
    const res = await api.post(`/api/v1/product/supplier/${id}/status`, null, { params: { status } });
    return res.data;
  },
};

/**
 * 用户端租赁设备 API
 */
export const leasingApi = {
  /**
   * 获取租赁设备列表
   */
  getList: async (params = {}) => {
    const { page = 1, size = 12, type, keyword } = params;
    try {
      const res = await api.get('/api/v1/leasing/list', {
        params: { page, size, type, name: keyword, status: 1 }, // 只获取上架的
      });
      return res.data;
    } catch (error) {
      console.error('获取租赁列表失败:', error);
      return { records: [], total: 0 };
    }
  },

  /**
   * 获取租赁设备详情
   */
  getDetail: async (id) => {
    try {
      const res = await api.get(`/api/v1/leasing/${id}`);
      return res.data;
    } catch (error) {
      console.error('获取租赁详情失败:', error);
      return null;
    }
  },
};
