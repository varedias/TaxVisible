# 管理后台轻量化重新设计 - 设计文档

## 1. 概述

### 1.1 设计目标
本设计文档描述了 MinJue B2B 平台管理后台的轻量化重新设计方案。采用最简单的技术栈，快速实现核心功能。

**核心设计原则**:
- **极简主义**: 只用必要的技术，避免过度设计
- **快速开发**: 2-3 周完成核心功能
- **易于维护**: 代码简单清晰，新人容易上手

### 1.2 技术栈

**使用的技术**（已有）:
- React 19
- React Router v7
- Axios
- Tailwind CSS
- Lucide React

**不使用的技术**:
- shadcn/ui（直接用 Tailwind 写组件）
- React Query（直接用 axios + useState）
- Zustand（用 React Context）
- Recharts（不需要图表）
- 其他复杂库

## 2. 目录结构

```
frontend/src/admin/
├── api/
│   ├── admin.js          # 管理员 API
│   ├── user.js           # 用户管理 API
│   ├── supplier.js       # 供应商管理 API
│   └── product.js        # 商品管理 API
├── components/
│   ├── common/
│   │   ├── Table.jsx     # 通用表格
│   │   ├── Card.jsx      # 卡片组件
│   │   ├── Badge.jsx     # 标签组件
│   │   ├── Button.jsx    # 按钮组件
│   │   ├── Modal.jsx     # 模态框组件
│   │   └── Pagination.jsx # 分页组件
│   └── RequireAdmin.jsx  # 权限守卫（已有）
├── layouts/
│   ├── AdminLayout.jsx   # 主布局（已有，需优化）
│   ├── Sidebar.jsx       # 侧边栏
│   └── Header.jsx        # 顶部栏
├── pages/
│   ├── Dashboard.jsx     # 仪表盘（已有，需增强）
│   ├── UserList.jsx      # 用户列表（已有，需优化）
│   ├── SupplierAudit.jsx # 供应商审核（已有，需优化）
│   └── ProductList.jsx   # 商品列表（已有，需优化）
├── context/
│   └── AdminContext.jsx  # 全局状态管理
└── routes.jsx            # 路由配置
```

## 3. 组件设计

### 3.1 通用组件

#### 3.1.1 Table（表格组件）

**功能**: 显示数据列表，支持分页。

**Props**:
```jsx
interface TableProps {
  columns: Array<{
    key: string;
    title: string;
    render?: (value, record) => ReactNode;
  }>;
  data: Array<any>;
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page) => void;
  };
}
```

**使用示例**:
```jsx
<Table
  columns={[
    { key: 'id', title: 'ID' },
    { key: 'username', title: '用户名' },
    { 
      key: 'status', 
      title: '状态',
      render: (status) => <Badge type={status === 1 ? 'success' : 'danger'}>
        {status === 1 ? '正常' : '禁用'}
      </Badge>
    }
  ]}
  data={users}
  loading={loading}
  pagination={{
    current: page,
    pageSize: 10,
    total: total,
    onChange: setPage
  }}
/>
```

#### 3.1.2 Card（卡片组件）

**功能**: 显示统计数据。

**Props**:
```jsx
interface CardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red';
  onClick?: () => void;
}
```

#### 3.1.3 Badge（标签组件）

**功能**: 显示状态标签。

**Props**:
```jsx
interface BadgeProps {
  type: 'success' | 'danger' | 'warning' | 'info';
  children: ReactNode;
}
```

#### 3.1.4 Modal（模态框组件）

**功能**: 显示对话框。

**Props**:
```jsx
interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children: ReactNode;
}
```

#### 3.1.5 Pagination（分页组件）

**功能**: 分页控制。

**Props**:
```jsx
interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}
```

### 3.2 布局组件

#### 3.2.1 Sidebar（侧边栏）

**功能**: 显示导航菜单。

**菜单配置**:
```javascript
const menuItems = [
  { key: 'dashboard', label: '仪表盘', icon: LayoutDashboard, path: '/admin/dashboard' },
  { key: 'users', label: '用户管理', icon: Users, path: '/admin/users' },
  { key: 'suppliers', label: '供应商审核', icon: Building2, path: '/admin/suppliers/audit' },
  { key: 'products', label: '商品管理', icon: Package, path: '/admin/products' },
];
```

#### 3.2.2 Header（顶部栏）

**功能**: 显示页面标题和用户信息。

**显示内容**:
- 当前页面标题
- 用户头像和用户名
- 退出登录按钮

### 3.3 页面组件

#### 3.3.1 Dashboard（仪表盘）

**功能**:
- 显示 4 个统计卡片（用户、供应商、商品、订单）
- 显示待审核供应商数量（可点击跳转）
- 显示最新用户列表（5 条）
- 显示最新商品列表（5 条）

**数据获取**:
```javascript
const [stats, setStats] = useState({
  users: 0,
  suppliers: 0,
  pendingSuppliers: 0,
  products: 0,
  orders: 0
});

useEffect(() => {
  fetchDashboardStats();
}, []);

const fetchDashboardStats = async () => {
  const data = await dashboardApi.getStats();
  setStats(data);
};
```

#### 3.3.2 UserList（用户列表）

**功能**:
- 显示用户列表
- 搜索用户（用户名）
- 禁用/启用用户
- 分页

**状态管理**:
```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const [searchTerm, setSearchTerm] = useState('');

const fetchUsers = async () => {
  setLoading(true);
  const data = await userApi.getList({ page, username: searchTerm });
  setUsers(data.records);
  setTotal(data.total);
  setLoading(false);
};

const handleToggleStatus = async (userId, currentStatus) => {
  const newStatus = currentStatus === 1 ? 0 : 1;
  await userApi.updateStatus(userId, newStatus);
  fetchUsers();
};
```

#### 3.3.3 SupplierAudit（供应商审核）

**功能**:
- 显示待审核供应商列表
- 查看供应商详情（模态框）
- 审核通过/拒绝
- 分页

**审核流程**:
```javascript
const [selectedSupplier, setSelectedSupplier] = useState(null);
const [rejectReason, setRejectReason] = useState('');

const handleAudit = async (pass) => {
  if (!pass && !rejectReason) {
    alert('请填写拒绝原因');
    return;
  }
  
  await supplierApi.audit(selectedSupplier.id, pass, rejectReason);
  setSelectedSupplier(null);
  setRejectReason('');
  fetchSuppliers();
};
```

#### 3.3.4 ProductList（商品列表）

**功能**:
- 显示商品列表
- 搜索商品（商品名称）
- 筛选商品（状态）
- 强制下架商品
- 分页

**下架操作**:
```javascript
const handleOffShelf = async (productId) => {
  if (!confirm('确定要强制下架该商品吗？')) return;
  
  await productApi.offShelf(productId);
  fetchProducts();
};
```

## 4. API 设计

### 4.1 API 客户端

使用现有的 `api/index.js` 中的 `api` 实例（已配置好 axios 拦截器）。

### 4.2 API 模块

#### 4.2.1 Dashboard API

```javascript
// admin/api/dashboard.js
import { api } from '../../api';

export const dashboardApi = {
  // 获取统计数据
  getStats: () => api.get('/api/admin/dashboard/stats'),
  
  // 获取最新用户
  getRecentUsers: () => api.get('/api/admin/dashboard/recent-users'),
  
  // 获取最新商品
  getRecentProducts: () => api.get('/api/admin/dashboard/recent-products'),
};
```

#### 4.2.2 User API

```javascript
// admin/api/user.js
import { api } from '../../api';

export const userApi = {
  // 获取用户列表
  getList: (params) => api.get('/api/admin/user/list', { params }),
  
  // 更新用户状态
  updateStatus: (userId, status) => 
    api.put(`/api/admin/user/${userId}/status`, null, { params: { status } }),
};
```

#### 4.2.3 Supplier API

```javascript
// admin/api/supplier.js
import { api } from '../../api';

export const supplierApi = {
  // 获取待审核供应商列表
  getAuditList: (params) => api.get('/api/admin/supplier/audit/list', { params }),
  
  // 审核供应商
  audit: (id, pass, reason) => 
    api.post('/api/admin/supplier/audit', { id, pass, reason }),
};
```

#### 4.2.4 Product API

```javascript
// admin/api/product.js
import { api } from '../../api';

export const productApi = {
  // 获取商品列表
  getList: (params) => api.get('/api/admin/product/list', { params }),
  
  // 强制下架
  offShelf: (productId) => api.put(`/api/admin/product/${productId}/off-shelf`),
};
```

## 5. 状态管理

使用 React Context 管理全局状态（用户信息、加载状态等）。

```javascript
// admin/context/AdminContext.jsx
import { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <AdminContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
```

## 6. 路由配置

```javascript
// admin/routes.jsx
import { lazy } from 'react';
import AdminLayout from './layouts/AdminLayout';
import RequireAdmin from './components/RequireAdmin';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserList = lazy(() => import('./pages/UserList'));
const SupplierAudit = lazy(() => import('./pages/SupplierAudit'));
const ProductList = lazy(() => import('./pages/ProductList'));

export const adminRoutes = {
  path: '/admin',
  element: (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  ),
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'users', element: <UserList /> },
    { path: 'suppliers/audit', element: <SupplierAudit /> },
    { path: 'products', element: <ProductList /> },
  ],
};
```

## 7. 样式设计

### 7.1 颜色方案

```javascript
// Tailwind 配置
const colors = {
  primary: '#3b82f6',    // 蓝色
  success: '#10b981',    // 绿色
  warning: '#f59e0b',    // 橙色
  danger: '#ef4444',     // 红色
};
```

### 7.2 组件样式示例

**按钮**:
```jsx
// 主要按钮
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
  确定
</button>

// 危险按钮
<button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
  删除
</button>

// 次要按钮
<button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
  取消
</button>
```

**卡片**:
```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
  {/* 内容 */}
</div>
```

**表格**:
```jsx
<table className="w-full text-sm">
  <thead className="bg-gray-50 border-b">
    <tr>
      <th className="px-6 py-3 text-left">标题</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4">内容</td>
    </tr>
  </tbody>
</table>
```

## 8. 错误处理

### 8.1 API 错误处理

已在 `api/index.js` 中配置了响应拦截器，统一处理错误：
- 401: 自动跳转登录页
- 其他错误: 显示错误消息

### 8.2 表单验证

简单的客户端验证：

```javascript
const validateForm = (data) => {
  if (!data.username) {
    alert('请输入用户名');
    return false;
  }
  if (!data.reason && !data.pass) {
    alert('拒绝时必须填写原因');
    return false;
  }
  return true;
};
```

## 9. 性能优化

### 9.1 路由懒加载

所有页面组件使用 `React.lazy()` 懒加载。

### 9.2 防抖搜索

搜索输入使用防抖，减少 API 请求：

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  fetchData();
}, [debouncedTerm]);
```

## 10. 测试策略

### 10.1 手动测试

重点测试以下场景：
- 用户列表加载和搜索
- 用户禁用/启用操作
- 供应商审核流程（通过/拒绝）
- 商品列表加载和下架操作
- 分页功能
- 错误处理（网络错误、401 错误）

### 10.2 浏览器测试

在以下浏览器测试：
- Chrome 最新版
- Firefox 最新版
- Edge 最新版

## 11. 实施步骤

### 第 1 周：基础框架

1. 创建通用组件（Table、Card、Badge、Button、Modal、Pagination）
2. 优化 AdminLayout（Sidebar、Header）
3. 配置路由
4. 创建 AdminContext

### 第 2 周：核心功能

1. 实现仪表盘页面
2. 优化用户列表页面
3. 优化供应商审核页面

### 第 3 周：商品管理和优化

1. 优化商品列表页面
2. 优化样式和交互
3. 测试和修复 Bug
4. 性能优化

## 12. 验收标准

### 12.1 功能完整性
- ✅ 仪表盘显示统计数据
- ✅ 用户列表、搜索、禁用/启用功能正常
- ✅ 供应商审核流程正常
- ✅ 商品列表、搜索、下架功能正常
- ✅ 分页功能正常

### 12.2 代码质量
- ✅ 代码清晰易懂
- ✅ 组件可复用
- ✅ 无明显性能问题

### 12.3 用户体验
- ✅ 界面美观、统一
- ✅ 操作流畅
- ✅ 错误提示友好
- ✅ 加载状态明确

---

**设计文档版本**: 1.0 (轻量化)  
**预计工期**: 2-3 周  
**设计负责人**: Kiro AI Assistant
