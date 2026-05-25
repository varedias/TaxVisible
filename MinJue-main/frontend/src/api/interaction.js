import { api } from './index';

const BASE = '/api/v1/interaction';

// 评论 API
export const commentApi = {
  // 获取商品评论列表
  getList({ productId, page = 1, size = 10 }) {
    return api.get(`${BASE}/comment/list`, { params: { productId, page, size } }).then(r => r.data?.data ?? r.data);
  },
  // 获取商品评论数
  getCount(productId) {
    return api.get(`${BASE}/comment/count`, { params: { productId } }).then(r => r.data?.data ?? r.data);
  },
  // 发表评论
  add({ productId, rating, content, images }) {
    return api.post(`${BASE}/comment`, { productId, rating, content, images }).then(r => r.data?.data ?? r.data);
  },
  // 删除评论
  delete(id) {
    return api.delete(`${BASE}/comment/${id}`).then(r => r.data);
  },
  // 评论有用 +1
  helpful(id) {
    return api.post(`${BASE}/comment/${id}/helpful`).then(r => r.data);
  },
};

// 点赞 API
export const likeApi = {
  // 切换点赞状态 → { liked: bool, count: number }
  toggle({ targetId, targetType }) {
    return api.post(`${BASE}/like/toggle`, { targetId, targetType }).then(r => r.data?.data ?? r.data);
  },
  // 检查是否已点赞 → bool
  check({ targetId, targetType }) {
    return api.get(`${BASE}/like/check`, { params: { targetId, targetType } }).then(r => r.data?.data ?? r.data);
  },
  // 获取点赞数 → number
  count({ targetId, targetType }) {
    return api.get(`${BASE}/like/count`, { params: { targetId, targetType } }).then(r => r.data?.data ?? r.data);
  },
};

// 收藏 API
export const favoriteApi = {
  // 切换收藏状态 → { favorited: bool, count: number }
  toggle({ targetId, targetType, targetName, targetImage }) {
    return api.post(`${BASE}/favorite/toggle`, { targetId, targetType, targetName, targetImage }).then(r => r.data?.data ?? r.data);
  },
  // 检查是否已收藏 → bool
  check({ targetId, targetType }) {
    return api.get(`${BASE}/favorite/check`, { params: { targetId, targetType } }).then(r => r.data?.data ?? r.data);
  },
  // 获取用户收藏列表 → IPage
  list({ page = 1, size = 10, targetType } = {}) {
    const params = { page, size };
    if (targetType) params.targetType = targetType;
    return api.get(`${BASE}/favorite/list`, { params }).then(r => r.data?.data ?? r.data);
  },
};

// 分享 API
export const shareApi = {
  // 记录分享
  add({ targetId, targetType, targetName, shareUrl, platform }) {
    return api.post(`${BASE}/share`, { targetId, targetType, targetName, shareUrl, platform }).then(r => r.data?.data ?? r.data);
  },
  // 获取分享数
  count({ targetId, targetType }) {
    return api.get(`${BASE}/share/count`, { params: { targetId, targetType } }).then(r => r.data?.data ?? r.data);
  },
};

// 批量交互状态查询（一次请求获取 liked, favorited, likeCount, favoriteCount, shareCount）
export const interactionApi = {
  getStatus({ targetId, targetType }) {
    return api.get(`${BASE}/status`, { params: { targetId, targetType } }).then(r => r.data?.data ?? r.data);
  },
};
