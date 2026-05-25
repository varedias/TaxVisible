import { api } from '../../api/index';

const BASE_URL = '/api/admin/interaction';

/**
 * 评论管理API
 */
export const commentApi = {
  // 获取评论列表
  getList: async (params = {}) => {
    const { page = 1, size = 10, productId, status, rating } = params;
    const res = await api.get(`${BASE_URL}/comment/list`, {
      params: { page, size, productId, status, rating }
    });
    return res.data || { records: [], total: 0 };
  },

  // 更新评论状态
  updateStatus: async (id, status) => {
    const res = await api.put(`${BASE_URL}/comment/${id}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  // 删除评论
  delete: async (id) => {
    const res = await api.delete(`${BASE_URL}/comment/${id}`);
    return res.data;
  },

  // 批量删除评论
  batchDelete: async (ids) => {
    const res = await api.delete(`${BASE_URL}/comment/batch`, { data: ids });
    return res.data;
  },

  // 批量更新状态
  batchUpdateStatus: async (ids, status) => {
    const res = await api.put(`${BASE_URL}/comment/batch/status`, { ids, status });
    return res.data;
  },
};

/**
 * 点赞管理API
 */
export const likeApi = {
  // 获取点赞列表
  getList: async (params = {}) => {
    const { page = 1, size = 10, targetType, targetId } = params;
    const res = await api.get(`${BASE_URL}/like/list`, {
      params: { page, size, targetType, targetId }
    });
    return res.data || { records: [], total: 0 };
  },

  // 删除点赞
  delete: async (id) => {
    const res = await api.delete(`${BASE_URL}/like/${id}`);
    return res.data;
  },

  // 批量删除
  batchDelete: async (ids) => {
    const res = await api.delete(`${BASE_URL}/like/batch`, { data: ids });
    return res.data;
  },
};

/**
 * 收藏管理API
 */
export const favoriteApi = {
  // 获取收藏列表
  getList: async (params = {}) => {
    const { page = 1, size = 10, targetType, userId } = params;
    const res = await api.get(`${BASE_URL}/favorite/list`, {
      params: { page, size, targetType, userId }
    });
    return res.data || { records: [], total: 0 };
  },

  // 删除收藏
  delete: async (id) => {
    const res = await api.delete(`${BASE_URL}/favorite/${id}`);
    return res.data;
  },

  // 批量删除
  batchDelete: async (ids) => {
    const res = await api.delete(`${BASE_URL}/favorite/batch`, { data: ids });
    return res.data;
  },
};

/**
 * 分享管理API
 */
export const shareApi = {
  // 获取分享列表
  getList: async (params = {}) => {
    const { page = 1, size = 10, targetType, platform } = params;
    const res = await api.get(`${BASE_URL}/share/list`, {
      params: { page, size, targetType, platform }
    });
    return res.data || { records: [], total: 0 };
  },

  // 删除分享记录
  delete: async (id) => {
    const res = await api.delete(`${BASE_URL}/share/${id}`);
    return res.data;
  },

  // 批量删除
  batchDelete: async (ids) => {
    const res = await api.delete(`${BASE_URL}/share/batch`, { data: ids });
    return res.data;
  },
};

/**
 * 统计API
 */
export const interactionStatsApi = {
  // 获取统计数据
  getStats: async () => {
    const res = await api.get(`${BASE_URL}/stats`);
    return res.data || {};
  },
};
