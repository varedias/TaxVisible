import { api } from '../../api';

/**
 * 仪表盘 API
 */
export const dashboardApi = {
  /**
   * 获取统计数据
   * @returns {Promise} 统计数据
   */
  getStats: async () => {
    try {
      const res = await api.get('/api/admin/dashboard/stats');
      return res.data;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 返回默认数据，避免页面崩溃
      return {
        userCount: 0,
        supplierCount: 0,
        pendingAuditCount: 0,
        pendingLeasingCount: 0,
        productCount: 0,
        orderCount: 0,
      };
    }
  },

  /**
   * 获取最新用户
   * @param {number} limit - 数量限制
   * @returns {Promise} 用户列表
   */
  getRecentUsers: async (limit = 5) => {
    try {
      const res = await api.get('/api/admin/dashboard/recent-users', {
        params: { limit },
      });
      return res.data || [];
    } catch (error) {
      console.error('获取最新用户失败:', error);
      return [];
    }
  },

  /**
   * 获取最新商品
   * @param {number} limit - 数量限制
   * @returns {Promise} 商品列表
   */
  getRecentProducts: async (limit = 5) => {
    try {
      const res = await api.get('/api/admin/dashboard/recent-products', {
        params: { limit },
      });
      return res.data || [];
    } catch (error) {
      console.error('获取最新商品失败:', error);
      return [];
    }
  },
};
