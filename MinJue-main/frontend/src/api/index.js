import axios from 'axios';

// API 配置 (使用 Vite 代理，无需指定完整 URL)
const API_BASE_URL = '';

// 创建 axios 实例
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // AI请求可能较慢，设置60秒超时
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 统一处理响应
api.interceptors.response.use(
    (response) => {
        const { data } = response;
        // 如果后端返回的是标准格式 { code, data, message }
        if (data.code === 200) {
            return data; // 返回整个 data 对象，包含 data.data
        } else {
            // 业务错误：后端返回非200
            const errMsg = data.message || '请求失败';
            if (data.code === 401) {
                // 未登录或 token 过期 — 清除本地状态，跳转登录
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // 仅在非登录页时跳转，避免死循环
                if (!window.location.hash.includes('/login')) {
                    window.location.hash = '#/login';
                }
            }
            throw new Error(errMsg);
        }
    },
    (error) => {
        // HTTP 级别错误（网络/超时/5xx 等）
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.hash.includes('/login')) {
                    window.location.hash = '#/login';
                }
            } else if (status === 403) {
                console.error('无权限访问');
            } else if (status >= 500) {
                console.error('服务器错误，请稍后重试');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('请求超时，请检查网络');
        }
        throw error;
    }
);

// 通用请求方法（保留兼容性）
async function request(url, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const data = await response.json();

        if (data.code === 200) {
            return data.data;
        } else {
            throw new Error(data.message || '请求失败');
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// 验证码 API
export const captchaApi = {
    getImage: () => request('/api/v1/captcha/image'),
};

// 邮箱 API
export const emailApi = {
    sendCode: (email, type = 'register') =>
        request('/api/v1/email/send', {
            method: 'POST',
            body: JSON.stringify({ email, type }),
        }),
};

// 用户 API
export const userApi = {
    login: (loginData) =>
        request('/api/v1/user/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
        }),

    register: (registerData) =>
        request('/api/v1/user/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
        }),

    resetPassword: (resetData) =>
        request('/api/v1/user/reset-password', {
            method: 'POST',
            body: JSON.stringify(resetData),
        }),

    getInfo: () => request('/api/v1/user/info'),
};

// 商品 API (已移至 api/product.js，使用 axios 实例，功能更完整)
// 如需使用请 import { productApi, leasingApi } from '../api/product'

// 分类 API
export const categoryApi = {
    getList: () => request('/api/v1/category/list'),
};

// 供应商 API
export const supplierApi = {
    getList: (params = {}) => {
        const { page = 1, size = 10, keyword } = typeof params === 'object' ? params : { page: params, size: 10 };
        const query = new URLSearchParams({
            page,
            size,
            ...(keyword && { keyword }),
        }).toString();
        return request(`/api/v1/supplier/list?${query}`);
    },

    getDetail: (id) => request(`/api/v1/supplier/${id}`),
};

// 内容/发现 API
export const contentApi = {
    getList: (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            size: params.size || 10,
            ...(params.type && { type: params.type }),
            ...(params.category && { category: params.category }),
            ...(params.keyword && { keyword: params.keyword }),
        }).toString();
        return request(`/api/v1/content/list?${query}`);
    },

    getDetail: (id) => request(`/api/v1/content/${id}`),
};

// 购物车 API
export const cartApi = {
    getCart: () => request('/api/v1/cart'),

    addToCart: (productId, quantity = 1) =>
        request(`/api/v1/cart/add?productId=${productId}&quantity=${quantity}`, {
            method: 'POST',
        }),

    updateQuantity: (productId, quantity) =>
        request(`/api/v1/cart/update?productId=${productId}&quantity=${quantity}`, {
            method: 'PUT',
        }),

    removeFromCart: (productId) =>
        request(`/api/v1/cart/remove/${productId}`, {
            method: 'DELETE',
        }),

    clearCart: () =>
        request('/api/v1/cart/clear', {
            method: 'DELETE',
        }),
};

// 订单 API
export const orderApi = {
    create: (orderData) =>
        request('/api/v1/order/create', {
            method: 'POST',
            body: JSON.stringify(orderData),
        }),

    // 直接下单（不需要购物车）
    directOrder: (orderData) =>
        request('/api/v1/order/direct', {
            method: 'POST',
            body: JSON.stringify(orderData),
        }),

    getList: (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            size: params.size || 10,
            ...(params.status !== undefined && { status: params.status }),
        }).toString();
        return request(`/api/v1/order/list?${query}`);
    },

    getDetail: (orderId) => request(`/api/v1/order/${orderId}`),

    pay: (orderId) =>
        request(`/api/v1/order/pay/${orderId}`, {
            method: 'POST',
        }),

    cancel: (orderId) =>
        request(`/api/v1/order/cancel/${orderId}`, {
            method: 'POST',
        }),
};

// 采购需求 API
export const procurementApi = {
    getList: (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            size: params.size || 10,
            ...(params.keyword && { keyword: params.keyword }),
            ...(params.status !== undefined && { status: params.status }),
        }).toString();
        return request(`/api/v1/procurement/list?${query}`);
    },
    getDetail: (id) => request(`/api/v1/procurement/${id}`),
    create: (data) =>
        request('/api/v1/procurement', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getMy: (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            size: params.size || 10,
        }).toString();
        return request(`/api/v1/procurement/my?${query}`);
    },
    close: (id) =>
        request(`/api/v1/procurement/${id}/close`, { method: 'POST' }),
};

// 统一搜索 API
export const searchApi = {
    search: (params = {}) => {
        const query = new URLSearchParams({
            keyword: params.keyword || '',
            type: params.type || 'all',
            page: params.page || 1,
            size: params.size || 12,
        }).toString();
        return request(`/api/v1/search?${query}`);
    },
};

// 租赁申请 API
export const leasingApplicationApi = {
    apply: (data) =>
        request('/api/v1/leasing/apply', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getMy: (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            size: params.size || 10,
        }).toString();
        return request(`/api/v1/leasing/applications?${query}`);
    },
};

// 供应商租赁审核 API
export const supplierLeasingApi = {
    getMyApplications: (params = {}) => {
        const query = new URLSearchParams({
            page: params.page || 1,
            size: params.size || 10,
            ...(params.status !== undefined && params.status !== '' ? { status: params.status } : {}),
            ...(params.keyword ? { keyword: params.keyword } : {}),
        }).toString();
        return request(`/api/v1/leasing/supplier/applications?${query}`);
    },
    reviewApplication: (id, status) =>
        request(`/api/v1/leasing/supplier/applications/${id}/review`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        }),
};

// 从 product.js 重新导出，方便统一引用
export { productApi, leasingApi } from './product';

// AI 代理 API
export const aiApi = {
    chat: async (messages, options = {}) => {
        const res = await api.post('/api/v1/ai/chat', {
            messages,
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 1000,
        });
        return res.data; // { content: '...' }
    },
};

// IM 消息 API
export const messageApi = {
    send: async (data) => {
        const res = await api.post('/api/v1/message/send', data);
        return res.data;
    },
    getHistory: async (supplierId, params = {}) => {
        const res = await api.get(`/api/v1/message/history/${supplierId}`, {
            params: { page: params.page || 1, size: params.size || 50 },
        });
        return res.data;
    },
    markRead: async (supplierId) => {
        const res = await api.post(`/api/v1/message/read/${supplierId}`);
        return res.data;
    },
    getUnreadCount: async () => {
        const res = await api.get('/api/v1/message/unread-count');
        return res.data;
    },
};

export default {
    captcha: captchaApi,
    email: emailApi,
    user: userApi,
    category: categoryApi,
    supplier: supplierApi,
    content: contentApi,
    cart: cartApi,
    order: orderApi,
    procurement: procurementApi,
    search: searchApi,
};
