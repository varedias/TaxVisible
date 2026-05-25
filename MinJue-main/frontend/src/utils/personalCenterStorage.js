import { discoveryVideos } from '../data/discoveryVideos';

const STORAGE_PREFIX = 'minjue:personal-center';
export const PERSONAL_CENTER_UPDATED_EVENT = 'minjue:personal-center-updated';

export const LOCAL_PRODUCT_CATEGORIES = [
  { id: 'ai-vision', name: 'AI视觉检测' },
  { id: 'camera', name: '工业相机' },
  { id: 'software', name: '视觉软件' },
  { id: 'automation', name: '自动化配套' },
  { id: 'service', name: '方案服务' },
];

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const getUserScope = (user) => {
  if (user?.id !== undefined && user?.id !== null) {
    return String(user.id);
  }
  if (user?.username) {
    return user.username;
  }
  return 'guest';
};

const getStorageKey = (user) => `${STORAGE_PREFIX}:${getUserScope(user)}`;

const buildAvatar = (seed) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(seed || 'MJ')}&background=0D8ABC&color=fff`;

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const findCategoryName = (categoryId) =>
  LOCAL_PRODUCT_CATEGORIES.find((item) => item.id === categoryId)?.name || '未分类';

const getSeedVideos = () => [
  discoveryVideos[0],
  discoveryVideos[8],
  discoveryVideos[16],
].filter(Boolean);

const createBuyerFavorites = () => {
  const seeds = getSeedVideos();

  return [
    {
      id: 'fav-product-1',
      targetType: 'product',
      targetId: 8,
      title: 'Basler ace系列工业相机套装',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
      supplier: '杭州精准视觉设备厂',
      tags: ['现货', 'GigE', '含镜头'],
      note: '准备和现有产线适配测试。',
      savedAt: '2026-03-24T10:20:00.000Z',
    },
    ...seeds.slice(0, 2).map((video, index) => ({
      id: `fav-content-${video.id}`,
      targetType: 'content',
      targetId: video.id,
      title: video.title,
      image: video.cover,
      supplier: video.author,
      tags: video.tags.slice(0, 3),
      note: index === 0 ? '适合内部方案汇报时引用。' : '后续想拆成采购 checklist。',
      savedAt: index === 0 ? '2026-03-23T14:10:00.000Z' : '2026-03-22T08:30:00.000Z',
    })),
  ];
};

const createBuyerOrders = () => [
  {
    id: 'PO-202603-1021',
    product: 'Basler ace系列工业相机套装',
    supplier: '杭州精准视觉设备厂',
    amount: 4299,
    quantity: 1,
    status: '待发货',
    stage: '供应商备货中',
    orderDate: '2026-03-23',
    expectedDate: '2026-03-29',
    progress: 60,
    tags: ['项目加急', '含镜头'],
  },
  {
    id: 'PO-202603-1008',
    product: 'CCS LED环形光源 LDR2-100',
    supplier: '上海光源智能装备',
    amount: 680,
    quantity: 2,
    status: '已完成',
    stage: '已签收',
    orderDate: '2026-03-18',
    expectedDate: '2026-03-21',
    progress: 100,
    tags: ['备件采购'],
  },
  {
    id: 'PO-202603-0996',
    product: '工业相机选型服务包',
    supplier: '民崛智能',
    amount: 3200,
    quantity: 1,
    status: '待验收',
    stage: '方案交付完成，等待内部评审',
    orderDate: '2026-03-16',
    expectedDate: '2026-03-26',
    progress: 90,
    tags: ['咨询服务'],
  },
];

const createBuyerInquiries = () => [
  {
    id: 'BI-202603-01',
    title: '新能源壳体表面缺陷检测需求',
    supplier: '民崛智能',
    contact: '刘顾问',
    status: '方案沟通中',
    budget: '18-22万',
    createdAt: '2026-03-24 09:30',
    deadline: '2026-03-29',
    message: '希望支持与MES对接，并可先提供演示视频。',
    tags: ['新能源', 'MES', '视觉检测'],
  },
  {
    id: 'BI-202603-02',
    title: '采购工业相机套装用于打样',
    supplier: '杭州精准视觉设备厂',
    contact: '赵经理',
    status: '待对方回复',
    budget: '5000以内',
    createdAt: '2026-03-23 15:10',
    deadline: '2026-03-27',
    message: '需要 2 套含镜头方案，优先现货。',
    tags: ['相机', '现货'],
  },
  {
    id: 'BI-202603-03',
    title: 'OCR 字符识别系统比价',
    supplier: '深圳智视科技',
    contact: '陈工',
    status: '已收到报价',
    budget: '10-15万',
    createdAt: '2026-03-20 10:00',
    deadline: '2026-03-30',
    message: '对接物流面单识别场景，需要动态高速识别。',
    tags: ['OCR', '物流'],
  },
];

const createBuyerProjects = () => [
  {
    id: 'BP-01',
    title: '手机壳体外观缺陷检测项目',
    stage: '供应商比选',
    budget: '20万',
    deadline: '2026-04-12',
    matches: 6,
    progress: 55,
    owner: '采购工程部',
    summary: '正在筛选支持高反光材质检测的视觉方案商。',
  },
  {
    id: 'BP-02',
    title: '产线视觉升级年度预算',
    stage: '内部立项',
    budget: '80万',
    deadline: '2026-04-30',
    matches: 3,
    progress: 35,
    owner: '设备部',
    summary: '计划分批替换老旧 AOI 工位。',
  },
];

const createBuyerNotifications = () => [
  {
    id: 'bn-1',
    title: '询盘已有新回复',
    content: '民崛智能已补充了新能源壳体检测方案的演示安排。',
    time: '2026-03-25 09:40',
    read: false,
    level: 'high',
  },
  {
    id: 'bn-2',
    title: '订单状态更新',
    content: 'Basler ace系列工业相机套装已进入打包阶段。',
    time: '2026-03-24 18:10',
    read: false,
    level: 'medium',
  },
  {
    id: 'bn-3',
    title: '推荐内容上新',
    content: '为你推荐了 3 条工业相机选型相关内容。',
    time: '2026-03-23 20:25',
    read: true,
    level: 'low',
  },
];

const createSupplierProducts = (user) => [
  {
    id: 9001,
    name: 'MJ-AI视觉检测工作站',
    categoryId: 'ai-vision',
    categoryName: findCategoryName('ai-vision'),
    price: 35800,
    originalPrice: 39900,
    stock: 16,
    image: '/Picture/5f45ca8db560b.jpg',
    status: 1,
    views: 1820,
    favorites: 63,
    inquiries: 12,
    updatedAt: '2026-03-24 16:20',
    tags: ['7天交付', '支持打样'],
    description: '面向新能源与 3C 产线的标准化缺陷检测工作站。',
    supplierName: user?.nickname || user?.username || '民崛智能',
  },
  {
    id: 9002,
    name: '模具监测视觉套件 Pro',
    categoryId: 'automation',
    categoryName: findCategoryName('automation'),
    price: 26800,
    originalPrice: 29900,
    stock: 8,
    image: '/Picture/9f1b10429b214030ab65eed8d9217246.jpeg',
    status: 1,
    views: 1260,
    favorites: 41,
    inquiries: 7,
    updatedAt: '2026-03-23 11:10',
    tags: ['模具保护', '远程看板'],
    description: '适合注塑场景的模具状态在线监测方案。',
    supplierName: user?.nickname || user?.username || '民崛智能',
  },
  {
    id: 9003,
    name: '工业相机调试服务包',
    categoryId: 'service',
    categoryName: findCategoryName('service'),
    price: 3200,
    originalPrice: 3600,
    stock: 30,
    image: '/Picture/R-C.jpg',
    status: 0,
    views: 640,
    favorites: 18,
    inquiries: 4,
    updatedAt: '2026-03-21 09:35',
    tags: ['线上支持', '半天交付'],
    description: '提供选型建议、初始参数配置和调试培训。',
    supplierName: user?.nickname || user?.username || '民崛智能',
  },
];

const createSupplierInquiries = () => [
  {
    id: 'SI-202603-01',
    customer: '深圳华景新能源',
    contact: '张工',
    product: 'MJ-AI视觉检测工作站',
    quantity: '2套',
    budget: '18-22万',
    status: '待回复',
    priority: '高',
    createdAt: '2026-03-25 09:20',
    deadline: '2026-03-28',
    lastMessage: '能否本周四安排线上演示？',
    demand: '用于电池壳体表面缺陷检测，需要兼容现有 MES。',
    tags: ['新能源', 'MES', '演示'],
  },
  {
    id: 'SI-202603-02',
    customer: '苏州诺衡自动化',
    contact: '王经理',
    product: '模具监测视觉套件 Pro',
    quantity: '5套',
    budget: '30万以内',
    status: '方案沟通中',
    priority: '中',
    createdAt: '2026-03-24 14:15',
    deadline: '2026-03-31',
    lastMessage: '对方需要补充工位节拍和安装尺寸。',
    demand: '希望先看宁波客户落地案例，并评估安装周期。',
    tags: ['案例', '安装周期'],
  },
  {
    id: 'SI-202603-03',
    customer: '杭州精工制造',
    contact: '李主任',
    product: '工业相机调试服务包',
    quantity: '1项',
    budget: '5000以内',
    status: '已转报价',
    priority: '低',
    createdAt: '2026-03-22 10:05',
    deadline: '2026-03-27',
    lastMessage: '客户已确认可以先走远程调试。',
    demand: '主要想解决镜头畸变和曝光不稳定问题。',
    tags: ['远程服务'],
  },
];

const createSupplierQuotes = () => [
  {
    id: 'SQ-202603-11',
    title: '新能源壳体缺陷检测整线方案',
    customer: '深圳华景新能源',
    amount: 186000,
    status: '待确认',
    expireDate: '2026-03-30',
    updatedAt: '2026-03-25 11:40',
    items: ['双工位检测站', '现场调试', 'MES接口'],
    note: '客户优先关注交期和误报率。',
  },
  {
    id: 'SQ-202603-09',
    title: '模具监测视觉套件批量报价',
    customer: '苏州诺衡自动化',
    amount: 148000,
    status: '跟进中',
    expireDate: '2026-04-02',
    updatedAt: '2026-03-24 16:10',
    items: ['5套套件', '安装指导', '远程培训'],
    note: '等待客户确认现场施工条件。',
  },
  {
    id: 'SQ-202603-05',
    title: '工业相机调试服务包',
    customer: '杭州精工制造',
    amount: 3200,
    status: '已成交',
    expireDate: '2026-03-26',
    updatedAt: '2026-03-23 09:25',
    items: ['参数调优', '半天培训'],
    note: '已安排 3 月 26 日远程支持。',
  },
];

const createSupplierTodos = () => [
  {
    id: 'st-1',
    title: '补充新能源客户的误报率数据',
    owner: '方案工程师',
    dueDate: '2026-03-25',
    status: 'today',
  },
  {
    id: 'st-2',
    title: '更新模具监测套件安装手册',
    owner: '售前支持',
    dueDate: '2026-03-26',
    status: 'todo',
  },
  {
    id: 'st-3',
    title: '回访上周成交客户',
    owner: '客户成功',
    dueDate: '2026-03-24',
    status: 'done',
  },
];

const createSupplierNotifications = () => [
  {
    id: 'sn-1',
    title: '高优先级询盘待处理',
    content: '深圳华景新能源希望在 3 月 28 日前拿到正式方案。',
    time: '2026-03-25 10:15',
    read: false,
    level: 'high',
  },
  {
    id: 'sn-2',
    title: '报价单即将到期',
    content: 'SQ-202603-11 将于 2026-03-30 到期，建议今天跟进。',
    time: '2026-03-25 08:40',
    read: false,
    level: 'medium',
  },
  {
    id: 'sn-3',
    title: '商品访问上涨',
    content: 'MJ-AI视觉检测工作站近 7 天访问量增长 18%。',
    time: '2026-03-24 19:30',
    read: true,
    level: 'low',
  },
];

const createDefaultState = (user) => {
  const displayName = user?.nickname || user?.username || '懂视帝用户';

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    profile: {
      nickname: displayName,
      avatar: user?.avatar || buildAvatar(displayName),
      phone: user?.phone || '138 0000 0000',
      email: user?.email || 'demo@minjue.com',
      company: user?.role === 'SUPPLIER' ? `${displayName}智能装备` : '华东智造采购部',
      city: user?.role === 'SUPPLIER' ? '浙江宁波' : '江苏苏州',
      title: user?.role === 'SUPPLIER' ? '销售负责人' : '采购工程师',
      bio:
        user?.role === 'SUPPLIER'
          ? '专注机器视觉与自动化方案，强调交付效率和客户协同。'
          : '关注工业视觉、自动化设备选型与方案落地效率。',
    },
    buyer: {
      favorites: createBuyerFavorites(),
      orders: createBuyerOrders(),
      inquiries: createBuyerInquiries(),
      projects: createBuyerProjects(),
      notifications: createBuyerNotifications(),
    },
    supplier: {
      shop: {
        name: user?.role === 'SUPPLIER' ? `${displayName}旗舰店` : '民崛智能方案馆',
        slogan: '把复杂视觉方案做成交付更稳的产品',
        description: '专注工业视觉检测、模具监测和产线升级改造，支持远程演示与试样。',
        responseRate: 98,
        replyTime: '15分钟内',
        serviceArea: '长三角 / 珠三角',
        tags: ['支持试样', '可驻场', '售前联调'],
      },
      products: createSupplierProducts(user),
      inquiries: createSupplierInquiries(),
      quotes: createSupplierQuotes(),
      todos: createSupplierTodos(),
      notifications: createSupplierNotifications(),
    },
  };
};

const mergeUserProfile = (state, user) => {
  const nextState = deepClone(state);
  const displayName = user?.nickname || user?.username || nextState.profile.nickname;

  nextState.profile = {
    ...nextState.profile,
    nickname: nextState.profile.nickname || displayName,
    avatar: nextState.profile.avatar || user?.avatar || buildAvatar(displayName),
    phone: nextState.profile.phone || user?.phone || '',
    email: nextState.profile.email || user?.email || '',
  };

  if (!nextState.supplier?.shop?.name && user?.role === 'SUPPLIER') {
    nextState.supplier.shop.name = `${displayName}旗舰店`;
  }

  return nextState;
};

const emitUpdate = (user, state) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(PERSONAL_CENTER_UPDATED_EVENT, {
    detail: {
      scope: getUserScope(user),
      updatedAt: state.updatedAt,
    },
  }));
};

const writeState = (user, state) => {
  if (!user || typeof window === 'undefined') return;

  try {
    const nextState = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(getStorageKey(user), JSON.stringify(nextState));
    emitUpdate(user, nextState);
  } catch (error) {
    console.error('写入个人中心缓存失败:', error);
  }
};

export const getPersonalCenterData = (user) => {
  if (!user || typeof window === 'undefined') return createDefaultState(user);

  try {
    const raw = window.localStorage.getItem(getStorageKey(user));
    const parsed = raw ? JSON.parse(raw) : createDefaultState(user);
    const merged = mergeUserProfile(parsed, user);
    if (!raw) {
      writeState(user, merged);
    }
    return merged;
  } catch (error) {
    console.error('读取个人中心缓存失败:', error);
    const fallback = createDefaultState(user);
    writeState(user, fallback);
    return fallback;
  }
};

export const updatePersonalCenterData = (user, updater) => {
  const current = getPersonalCenterData(user);
  const candidate = typeof updater === 'function' ? updater(deepClone(current)) : updater;
  const nextState = mergeUserProfile(candidate, user);
  writeState(user, nextState);
  return nextState;
};

export const getSupplierProductById = (user, productId) => {
  const state = getPersonalCenterData(user);
  return state.supplier.products.find((item) => Number(item.id) === Number(productId)) || null;
};

export const saveSupplierProduct = (user, productInput) => {
  let savedProduct = null;

  const nextState = updatePersonalCenterData(user, (state) => {
    const supplierName = user?.nickname || user?.username || state.profile.nickname;
    const normalizedProduct = {
      id: productInput.id ? Number(productInput.id) : Date.now(),
      name: productInput.name || '未命名商品',
      categoryId: productInput.categoryId || '',
      categoryName: findCategoryName(productInput.categoryId),
      price: Number(productInput.price || 0),
      originalPrice: Number(productInput.originalPrice || 0),
      stock: Number(productInput.stock || 0),
      image: productInput.image || '/Picture/5f45ca8db560b.jpg',
      status: productInput.status ?? 1,
      views: Number(productInput.views || 0),
      favorites: Number(productInput.favorites || 0),
      inquiries: Number(productInput.inquiries || 0),
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      specs: productInput.specs || '',
      tags: Array.isArray(productInput.tags)
        ? productInput.tags.filter(Boolean)
        : String(productInput.tags || '')
            .split(/[，,]/)
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 4),
      description: productInput.description || '',
      supplierName,
    };

    savedProduct = normalizedProduct;

    const products = [...state.supplier.products];
    const existingIndex = products.findIndex((item) => Number(item.id) === Number(normalizedProduct.id));

    if (existingIndex >= 0) {
      products[existingIndex] = {
        ...products[existingIndex],
        ...normalizedProduct,
      };
    } else {
      products.unshift(normalizedProduct);
    }

    return {
      ...state,
      supplier: {
        ...state.supplier,
        products,
      },
    };
  });

  return {
    state: nextState,
    product: savedProduct,
  };
};

export const deleteSupplierProduct = (user, productId) =>
  updatePersonalCenterData(user, (state) => ({
    ...state,
    supplier: {
      ...state.supplier,
      products: state.supplier.products.filter((item) => Number(item.id) !== Number(productId)),
    },
  }));

export const toggleSupplierProductStatus = (user, productId) =>
  updatePersonalCenterData(user, (state) => ({
    ...state,
    supplier: {
      ...state.supplier,
      products: state.supplier.products.map((item) =>
        Number(item.id) === Number(productId)
          ? {
              ...item,
              status: item.status === 1 ? 0 : 1,
              updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
            }
          : item
      ),
    },
  }));

export const hasFavoriteItem = (user, targetType, targetId) => {
  const state = getPersonalCenterData(user);
  return state.buyer.favorites.some(
    (item) => item.targetType === targetType && Number(item.targetId) === Number(targetId)
  );
};

export const toggleFavoriteItem = (user, item) => {
  let favorited = false;

  const nextState = updatePersonalCenterData(user, (state) => {
    const existed = state.buyer.favorites.some(
      (favorite) =>
        favorite.targetType === item.targetType && Number(favorite.targetId) === Number(item.targetId)
    );

    favorited = !existed;

    return {
      ...state,
      buyer: {
        ...state.buyer,
        favorites: existed
          ? state.buyer.favorites.filter(
              (favorite) =>
                !(favorite.targetType === item.targetType && Number(favorite.targetId) === Number(item.targetId))
            )
          : [
              {
                id: createId('fav'),
                targetType: item.targetType,
                targetId: Number(item.targetId),
                title: item.title || '未命名内容',
                image: item.image || item.cover || item.thumbnail || '',
                supplier: item.supplier || item.author || '',
                tags: Array.isArray(item.tags) ? item.tags.slice(0, 4) : [],
                note: item.note || '',
                savedAt: new Date().toISOString(),
              },
              ...state.buyer.favorites,
            ],
      },
    };
  });

  return {
    favorited,
    state: nextState,
  };
};

export const removeFavoriteItem = (user, favoriteId) =>
  updatePersonalCenterData(user, (state) => ({
    ...state,
    buyer: {
      ...state.buyer,
      favorites: state.buyer.favorites.filter((item) => item.id !== favoriteId),
    },
  }));

export const markNotificationRead = (user, section, notificationId) =>
  updatePersonalCenterData(user, (state) => ({
    ...state,
    [section]: {
      ...state[section],
      notifications: state[section].notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      ),
    },
  }));

export const markAllNotificationsRead = (user, section) =>
  updatePersonalCenterData(user, (state) => ({
    ...state,
    [section]: {
      ...state[section],
      notifications: state[section].notifications.map((item) => ({ ...item, read: true })),
    },
  }));
