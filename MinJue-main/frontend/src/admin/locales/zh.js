/**
 * 中文语言包
 */
export default {
  // 通用
  common: {
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    search: '搜索',
    reset: '重置',
    actions: '操作',
    status: '状态',
    createTime: '创建时间',
    noData: '暂无数据',
    success: '操作成功',
    error: '操作失败',
    confirmDelete: '确定要删除吗？',
    yes: '是',
    no: '否',
  },

  // 侧边栏菜单
  menu: {
    dashboard: '仪表盘',
    users: '用户管理',
    suppliers: '供应商审核',
    products: '商品管理',
    leasing: '租赁管理',
    orders: '订单管理',
    comments: '评论管理',
    interactions: '互动数据',
  },

  // 顶部导航
  header: {
    backHome: '返回首页',
    logout: '退出',
    logoutConfirm: '确定要退出登录吗？',
    administrator: '管理员',
  },

  // 仪表盘
  dashboard: {
    title: '仪表盘',
    totalUsers: '用户总数',
    totalSuppliers: '供应商数量',
    totalProducts: '商品数量',
    totalOrders: '订单数量',
    pendingAudit: '待审核供应商',
    pendingAuditTip: '个供应商等待审核',
    pendingLeasing: '待处理租赁申请',
    pendingLeasingTip: '条租赁申请等待处理',
    recentUsers: '最新注册用户',
    recentProducts: '最新上架商品',
    viewAll: '查看全部',
    onShelf: '上架',
    offShelf: '下架',
    // 图表
    weeklyTrend: '本周数据趋势',
    categoryDistribution: '商品分类分布',
    interactionStats: '用户互动统计',
    comments: '评论',
    likes: '点赞',
    favorites: '收藏',
    shares: '分享',
  },

  // 用户管理
  users: {
    title: '用户管理',
    username: '用户名',
    nickname: '昵称',
    email: '邮箱',
    phone: '手机号',
    role: '角色',
    status: '状态',
    createUser: '新增用户',
    editUser: '编辑用户',
    password: '密码',
    roleUser: '普通用户',
    roleAdmin: '管理员',
    statusActive: '正常',
    statusDisabled: '禁用',
  },

  // 供应商管理
  suppliers: {
    title: '供应商审核',
    name: '供应商名称',
    contact: '联系人',
    phone: '联系电话',
    address: '地址',
    auditStatus: '审核状态',
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    approve: '通过',
    reject: '拒绝',
    createSupplier: '新增供应商',
    editSupplier: '编辑供应商',
  },

  // 商品管理
  products: {
    title: '商品管理',
    name: '商品名称',
    category: '分类',
    price: '价格',
    stock: '库存',
    status: '状态',
    onShelf: '上架',
    offShelf: '下架',
    createProduct: '新增商品',
    editProduct: '编辑商品',
    image: '商品图片',
    description: '商品描述',
  },

  // 租赁管理
  leasing: {
    title: '租赁管理',
    name: '设备名称',
    dailyPrice: '日租金',
    monthlyPrice: '月租金',
    status: '状态',
    available: '可租',
    rented: '已租',
    createLeasing: '新增租赁',
    editLeasing: '编辑租赁',
  },

  // 评论管理
  comments: {
    title: '评论管理',
    content: '评论内容',
    user: '用户',
    product: '商品',
    rating: '评分',
    status: '状态',
    visible: '显示',
    hidden: '隐藏',
    show: '显示',
    hide: '隐藏',
  },

  // 互动数据
  interactions: {
    title: '互动数据',
    likes: '点赞记录',
    favorites: '收藏记录',
    shares: '分享记录',
    targetType: '目标类型',
    targetId: '目标ID',
    user: '用户',
    platform: '分享平台',
    product: '商品',
    content: '内容',
  },
};
