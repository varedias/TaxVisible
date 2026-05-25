import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  Heart,
  History,
  ListChecks,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getLikedVideos,
  LIKED_VIDEOS_UPDATED_EVENT,
  removeLikedVideo,
} from '../../utils/likedVideosStorage';
import {
  clearViewedContent,
  getViewedContent,
  removeViewedContent,
  VIEW_HISTORY_UPDATED_EVENT,
} from '../../utils/viewHistoryStorage';
import {
  deleteSupplierProduct,
  getPersonalCenterData,
  markAllNotificationsRead,
  markNotificationRead,
  PERSONAL_CENTER_UPDATED_EVENT,
  removeFavoriteItem,
  toggleSupplierProductStatus,
  updatePersonalCenterData,
} from '../../utils/personalCenterStorage';
import { supplierLeasingApi } from '../../api/index';

const formatCurrency = (value) => `¥${Number(value || 0).toLocaleString('zh-CN')}`;

const getImagePath = (path) => {
  if (!path) return '/products/placeholder-content.svg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
};

const statusClassMap = {
  '待回复': 'bg-red-50 text-red-600 border-red-100',
  '待确认': 'bg-amber-50 text-amber-700 border-amber-100',
  '待发货': 'bg-slate-50 text-slate-700 border-slate-100',
  '待验收': 'bg-violet-50 text-violet-700 border-violet-100',
  '方案沟通中': 'bg-sky-50 text-sky-700 border-sky-100',
  '跟进中': 'bg-sky-50 text-sky-700 border-sky-100',
  '已转报价': 'bg-amber-50 text-amber-600 border-amber-100',
  '已收到报价': 'bg-amber-50 text-amber-600 border-amber-100',
  '已完成': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  '已成交': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  '供应商比选': 'bg-orange-50 text-orange-700 border-orange-100',
  '内部立项': 'bg-slate-100 text-slate-700 border-slate-200',
  '在售': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  '已下架': 'bg-slate-100 text-slate-600 border-slate-200',
};

const Panel = ({ title, subtitle, action, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassMap[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
    {status}
  </span>
);

const MetricCard = ({ icon: Icon, title, value, subtitle, accent, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border p-5 text-left transition-all ${accent} hover:-translate-y-0.5 hover:shadow-md`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-medium text-gray-700">{title}</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="rounded-2xl bg-white/80 p-3 text-gray-700 shadow-sm">
        <Icon size={22} />
      </div>
    </div>
    <div className="mt-3 text-sm text-gray-600">{subtitle}</div>
  </button>
);

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
      <Icon size={26} />
    </div>
    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="mt-5 rounded-full bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const DetailDrawer = ({ detail, onClose, children }) => {
  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/35" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-gray-400">{detail.label}</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{detail.title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const PersonalCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const t = (zh, en) => isEnglish ? en : zh;
  const to = (path) => isEnglish ? `/en${path}` : path;
  const { user, setUser } = useAuth();
  const isSupplier = user?.role === 'SUPPLIER';

  const [activeTab, setActiveTab] = useState('overview');
  const [centerData, setCenterData] = useState(null);
  const [likedVideos, setLikedVideos] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [detail, setDetail] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [settingsForm, setSettingsForm] = useState(null);
  const [shopForm, setShopForm] = useState(null);
  const [hint, setHint] = useState('');
  const [supplierLeasingData, setSupplierLeasingData] = useState({ records: [], total: 0 });
  const [supplierLeasingLoading, setSupplierLeasingLoading] = useState(false);
  const [supplierLeasingFilter, setSupplierLeasingFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate(to('/login'));
    } else if (user.role === 'ADMIN') {
      navigate(to('/admin/dashboard'));
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const syncCenter = (preserveForms = false) => {
      const nextCenter = getPersonalCenterData(user);
      setCenterData(nextCenter);
      setLikedVideos(getLikedVideos(user));
      setViewHistory(getViewedContent(user));
      if (!preserveForms) {
        setSettingsForm(nextCenter.profile);
        setShopForm(nextCenter.supplier.shop);
      }
    };

    syncCenter();

    const handleStorageChange = () => syncCenter(true);
    window.addEventListener(LIKED_VIDEOS_UPDATED_EVENT, handleStorageChange);
    window.addEventListener(VIEW_HISTORY_UPDATED_EVENT, handleStorageChange);
    window.addEventListener(PERSONAL_CENTER_UPDATED_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener(LIKED_VIDEOS_UPDATED_EVENT, handleStorageChange);
      window.removeEventListener(VIEW_HISTORY_UPDATED_EVENT, handleStorageChange);
      window.removeEventListener(PERSONAL_CENTER_UPDATED_EVENT, handleStorageChange);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !isSupplier) return;

    let active = true;
    const loadSupplierLeasing = async () => {
      setSupplierLeasingLoading(true);
      try {
        const data = await supplierLeasingApi.getMyApplications({ page: 1, size: 20 });
        if (active) {
          setSupplierLeasingData({
            records: data?.records || [],
            total: data?.total || 0,
          });
        }
      } catch (error) {
        console.error('加载供应商租赁申请失败:', error);
        if (active) {
          setSupplierLeasingData({ records: [], total: 0 });
        }
      } finally {
        if (active) {
          setSupplierLeasingLoading(false);
        }
      }
    };

    loadSupplierLeasing();
    return () => {
      active = false;
    };
  }, [user, isSupplier]);

  useEffect(() => {
    setKeyword('');
    setProductStatusFilter('all');
    setSupplierLeasingFilter('all');
    setDetail(null);
  }, [activeTab]);

  useEffect(() => {
    if (!hint) return undefined;
    const timer = window.setTimeout(() => setHint(''), 2200);
    return () => window.clearTimeout(timer);
  }, [hint]);

  if (!user || !centerData || !settingsForm || !shopForm) return null;

  const persistCenter = (updater, syncForms = false) => {
    const nextCenter = updatePersonalCenterData(user, updater);
    setCenterData(nextCenter);
    if (syncForms) {
      setSettingsForm(nextCenter.profile);
      setShopForm(nextCenter.supplier.shop);
    }
    return nextCenter;
  };

  const updateAuthUser = (profile) => {
    const nextUser = {
      ...user,
      nickname: profile.nickname,
      name: profile.nickname,
      avatar: profile.avatar,
      phone: profile.phone,
      email: profile.email,
    };
    setUser(nextUser);
    window.localStorage.setItem('user', JSON.stringify(nextUser));
  };

  const handleSaveProfile = () => {
    const nextCenter = persistCenter((state) => ({
      ...state,
      profile: {
        ...state.profile,
        ...settingsForm,
      },
    }), true);
    updateAuthUser(nextCenter.profile);
    setHint('个人资料已保存到本地');
  };

  const handleSaveShop = () => {
    persistCenter((state) => ({
      ...state,
      supplier: {
        ...state.supplier,
        shop: {
          ...state.supplier.shop,
          ...shopForm,
          tags: String(shopForm.tags || '')
            .split(/[，,]/)
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 5),
        },
      },
    }), true);
    setHint('店铺资料已保存到本地');
  };

  const handleRemoveLikedVideo = (video) => {
    removeLikedVideo(user, video.targetId);
    setHint('已从点赞视频中移除');
    setDetail(null);
  };

  const handleRemoveViewedContent = (item) => {
    removeViewedContent(user, item.targetId);
    setHint('已移除一条浏览记录');
    setDetail(null);
  };

  const handleClearViewHistory = () => {
    if (!window.confirm('确定清空全部浏览足迹吗？')) return;
    clearViewedContent(user);
    setHint('浏览足迹已清空');
    setDetail(null);
  };

  const handleRemoveFavorite = (item) => {
    removeFavoriteItem(user, item.id);
    setHint('收藏已移除');
    setDetail(null);
  };

  const handleDeleteProduct = (item) => {
    if (!window.confirm(`确定删除商品“${item.name}”吗？`)) return;
    deleteSupplierProduct(user, item.id);
    setHint('商品已删除');
    setDetail(null);
  };

  const handleToggleProductStatus = (item) => {
    toggleSupplierProductStatus(user, item.id);
    setHint(item.status === 1 ? '商品已下架' : '商品已重新上架');
  };

  const handleSupplierInquiryStatus = (item, nextStatus) => {
    persistCenter((state) => ({
      ...state,
      supplier: {
        ...state.supplier,
        inquiries: state.supplier.inquiries.map((inquiry) =>
          inquiry.id === item.id ? { ...inquiry, status: nextStatus } : inquiry
        ),
      },
    }));
    setHint(`询盘状态已更新为“${nextStatus}”`);
    setDetail(null);
  };

  const handleQuoteStatus = (item, nextStatus) => {
    persistCenter((state) => ({
      ...state,
      supplier: {
        ...state.supplier,
        quotes: state.supplier.quotes.map((quote) =>
          quote.id === item.id ? { ...quote, status: nextStatus } : quote
        ),
      },
    }));
    setHint(`报价状态已更新为“${nextStatus}”`);
    setDetail(null);
  };

  const handleTodoStatus = (item) => {
    const nextStatus = item.status === 'done' ? 'today' : 'done';
    persistCenter((state) => ({
      ...state,
      supplier: {
        ...state.supplier,
        todos: state.supplier.todos.map((todo) =>
          todo.id === item.id ? { ...todo, status: nextStatus } : todo
        ),
      },
    }));
    setHint(nextStatus === 'done' ? '任务已标记完成' : '任务已重新打开');
    setDetail(null);
  };

  const handleNotificationRead = (section, item) => {
    markNotificationRead(user, section, item.id);
    setHint('消息已标记为已读');
    setDetail(null);
  };

  const handleAllNotificationsRead = (section) => {
    markAllNotificationsRead(user, section);
    setHint('当前消息已全部标记为已读');
    setDetail(null);
  };

  const handleSupplierLeasingReview = async (item, status) => {
    try {
      await supplierLeasingApi.reviewApplication(item.id, status);
      setSupplierLeasingData((prev) => ({
        ...prev,
        records: prev.records.map((record) => {
          if (record.id !== item.id) return record;
          return {
            ...record,
            status,
            inventoryStatus: status === 1 ? 1 : record.inventoryStatus,
          };
        }),
      }));
      setHint(status === 1 ? '租赁申请已通过，设备已自动租出' : '租赁申请已驳回');
    } catch (error) {
      console.error('审核租赁申请失败:', error);
      setHint(error.message || '审核租赁申请失败');
    }
  };

  const openContent = (item) => {
    if (item.targetType === 'product') {
      navigate(to(`/product/${item.targetId}`));
    } else {
      navigate(to(`/content/${item.targetId}`));
    }
  };

  const buyerStats = {
    orders: centerData.buyer.orders.length,
    likedVideos: likedVideos.length,
    favorites: centerData.buyer.favorites.length,
    viewed: viewHistory.length,
    inquiries: centerData.buyer.inquiries.length,
    unread: centerData.buyer.notifications.filter((item) => !item.read).length,
  };

  const supplierStats = {
    products: centerData.supplier.products.length,
    activeProducts: centerData.supplier.products.filter((item) => item.status === 1).length,
    pendingInquiries: centerData.supplier.inquiries.filter((item) => item.status === '待回复').length,
    quotes: centerData.supplier.quotes.length,
    unread: centerData.supplier.notifications.filter((item) => !item.read).length,
    todos: centerData.supplier.todos.filter((item) => item.status !== 'done').length,
    leasingReviews: supplierLeasingData.records.filter((item) => item.status === 0).length,
  };

  const filteredSupplierLeasingRecords = supplierLeasingData.records.filter((item) => {
    if (supplierLeasingFilter === 'pending') return item.status === 0;
    if (supplierLeasingFilter === 'approved') return item.status === 1;
    if (supplierLeasingFilter === 'rejected') return item.status === 2;
    return true;
  });

  const buyerMenuItems = [
    { key: 'overview', label: t('概览', 'Overview'), icon: BarChart3, badge: null },
    { key: 'liked-videos', label: t('点赞视频', 'Liked Videos'), icon: Heart, badge: buyerStats.likedVideos },
    { key: 'history', label: t('浏览足迹', 'History'), icon: History, badge: buyerStats.viewed },
    { key: 'favorites', label: t('收藏夹', 'Favorites'), icon: Bookmark, badge: buyerStats.favorites },
    { key: 'orders', label: t('我的订单', 'My Orders'), icon: ShoppingCart, badge: buyerStats.orders },
    { key: 'inquiries', label: t('我的询盘', 'My Inquiries'), icon: MessageSquare, badge: buyerStats.inquiries },
    { key: 'projects', label: t('采购项目', 'Procurement'), icon: Briefcase, badge: centerData.buyer.projects.length },
    { key: 'notifications', label: t('消息中心', 'Messages'), icon: Bell, badge: buyerStats.unread },
    { key: 'settings', label: t('个人设置', 'Settings'), icon: Settings, badge: null },
  ];

  const supplierMenuItems = [
    { key: 'overview', label: t('数据概览', 'Dashboard'), icon: BarChart3, badge: null },
    { key: 'products', label: t('商品管理', 'Products'), icon: Package, badge: supplierStats.products },
    { key: 'leasing-reviews', label: t('租赁审核', 'Leasing Review'), icon: Briefcase, badge: supplierStats.leasingReviews },
    { key: 'inquiries', label: t('询盘管理', 'Inquiry Mgmt'), icon: MessageSquare, badge: supplierStats.pendingInquiries },
    { key: 'quotes', label: t('报价管理', 'Quotes'), icon: FileText, badge: supplierStats.quotes },
    { key: 'shop', label: t('店铺管理', 'Store'), icon: Store, badge: null },
    { key: 'tasks', label: t('今日待办', 'Tasks'), icon: ListChecks, badge: supplierStats.todos },
    { key: 'notifications', label: t('消息中心', 'Messages'), icon: Bell, badge: supplierStats.unread },
    { key: 'settings', label: t('账号设置', 'Account'), icon: Settings, badge: null },
  ];

  const menuItems = isSupplier ? supplierMenuItems : buyerMenuItems;

  const filteredLikedVideos = likedVideos.filter((item) => {
    const content = `${item.title} ${item.author} ${(item.tags || []).join(' ')}`.toLowerCase();
    return content.includes(keyword.toLowerCase());
  });

  const filteredViewHistory = viewHistory.filter((item) => {
    const content = `${item.title} ${item.author} ${(item.tags || []).join(' ')}`.toLowerCase();
    return content.includes(keyword.toLowerCase());
  });

  const filteredFavorites = centerData.buyer.favorites.filter((item) => {
    const content = `${item.title} ${item.supplier} ${(item.tags || []).join(' ')} ${item.note || ''}`.toLowerCase();
    return content.includes(keyword.toLowerCase());
  });

  const filteredProducts = centerData.supplier.products.filter((item) => {
    const matchesKeyword = `${item.name} ${item.categoryName} ${(item.tags || []).join(' ')}`.toLowerCase().includes(keyword.toLowerCase());
    const matchesStatus =
      productStatusFilter === 'all'
        ? true
        : productStatusFilter === 'online'
          ? item.status === 1
          : item.status !== 1;
    return matchesKeyword && matchesStatus;
  });

  const getDetailConfig = () => {
    if (!detail) return null;

    if (detail.type === 'liked-video') {
      return {
        label: t('点赞视频', 'Liked Video'),
        title: detail.data.title,
        image: detail.data.cover,
        subtitle: `${detail.data.author} · ${detail.data.duration || t('未标注时长', 'No duration')}`,
        meta: [
          [t('发布时间', 'Published'), detail.data.publishDate || t('未记录', 'N/A')],
          [t('播放量', 'Views'), (detail.data.views || 0).toLocaleString()],
          [t('点赞时间', 'Liked at'), detail.data.likedAt ? new Date(detail.data.likedAt).toLocaleString('zh-CN') : t('刚刚', 'Just now')],
        ],
        tags: detail.data.tags || [],
        paragraphs: [t('这条视频已同步到你的个人中心，后续可以直接回看、移除或继续分享给同事。', 'This video has been synced to your personal center.')],
        actions: [
          { label: t('打开详情', 'Open Details'), variant: 'primary', onClick: () => navigate(to(`/content/${detail.data.targetId}`)) },
          { label: t('取消点赞', 'Unlike'), variant: 'danger', onClick: () => handleRemoveLikedVideo(detail.data) },
        ],
      };
    }

    if (detail.type === 'history') {
      return {
        label: t('浏览足迹', 'History'),
        title: detail.data.title,
        image: detail.data.cover,
        subtitle: `${detail.data.author} · ${detail.data.duration || t('内容浏览', 'Content view')}`,
        meta: [
          [t('最近浏览', 'Recently viewed'), detail.data.viewedAt ? new Date(detail.data.viewedAt).toLocaleString('zh-CN') : t('刚刚', 'Just now')],
          [t('播放量', 'Views'), (detail.data.views || 0).toLocaleString()],
          [t('内容类型', 'Type'), detail.data.type || 'video'],
        ],
        tags: detail.data.tags || [],
        paragraphs: [t('这是你最近浏览过的内容，方便回到项目评估时继续查看。', 'Recently viewed content for easy reference during project evaluation.')],
        actions: [
          { label: t('重新查看', 'Review'), variant: 'primary', onClick: () => navigate(to(`/content/${detail.data.targetId}`)) },
          { label: t('移除记录', 'Remove'), variant: 'danger', onClick: () => handleRemoveViewedContent(detail.data) },
        ],
      };
    }

    if (detail.type === 'favorite') {
      return {
        label: detail.data.targetType === 'product' ? t('收藏商品', 'Favorite Product') : t('收藏内容', 'Favorite Content'),
        title: detail.data.title,
        image: detail.data.image,
        subtitle: detail.data.supplier || t('已加入收藏夹', 'Added to favorites'),
        meta: [
          [t('收藏时间', 'Saved at'), detail.data.savedAt ? new Date(detail.data.savedAt).toLocaleString('zh-CN') : t('刚刚', 'Just now')],
          [t('类型', 'Type'), detail.data.targetType === 'product' ? t('商品', 'Product') : t('内容', 'Content')],
        ],
        tags: detail.data.tags || [],
        paragraphs: detail.data.note ? [detail.data.note] : [t('这条内容被保存进了你的个人收藏夹。', 'This item was saved to your favorites.')],
        actions: [
          { label: t('打开详情', 'Open Details'), variant: 'primary', onClick: () => openContent(detail.data) },
          { label: t('移除收藏', 'Remove'), variant: 'danger', onClick: () => handleRemoveFavorite(detail.data) },
        ],
      };
    }

    if (detail.type === 'order') {
      return {
        label: t('订单详情', 'Order Details'),
        title: detail.data.product,
        subtitle: `${detail.data.supplier} · ${detail.data.id}`,
        meta: [
          [t('订单金额', 'Amount'), formatCurrency(detail.data.amount)],
          [t('下单时间', 'Order Date'), detail.data.orderDate],
          [t('预计送达', 'Expected Delivery'), detail.data.expectedDate],
          [t('进度', 'Progress'), `${detail.data.progress}%`],
        ],
        tags: detail.data.tags || [],
        paragraphs: [detail.data.stage],
        actions: [{ label: t('前往商城', 'Go to Mall'), variant: 'primary', onClick: () => navigate(to('/mall')) }],
      };
    }

    if (detail.type === 'buyer-inquiry') {
      return {
        label: t('询盘详情', 'Inquiry Details'),
        title: detail.data.title,
        subtitle: `${detail.data.supplier} · ${detail.data.contact}`,
        meta: [
          [t('预算', 'Budget'), detail.data.budget],
          [t('创建时间', 'Created'), detail.data.createdAt],
          [t('期望答复', 'Expected Reply'), detail.data.deadline],
        ],
        tags: detail.data.tags || [],
        paragraphs: [detail.data.message],
        actions: [{ label: t('查看消息中心', 'View Messages'), variant: 'primary', onClick: () => setActiveTab('notifications') }],
      };
    }

    if (detail.type === 'project') {
      return {
        label: t('采购项目', 'Procurement'),
        title: detail.data.title,
        subtitle: `${detail.data.owner} · ${t('当前阶段', 'Current Stage')} ${detail.data.stage}`,
        meta: [
          [t('预算', 'Budget'), detail.data.budget],
          [t('截止时间', 'Deadline'), detail.data.deadline],
          [t('匹配供应商', 'Matched Suppliers'), `${detail.data.matches} ${t('家', '')}`],
          [t('项目进度', 'Progress'), `${detail.data.progress}%`],
        ],
        paragraphs: [detail.data.summary],
        actions: [{ label: t('查看供应商', 'View Suppliers'), variant: 'primary', onClick: () => navigate(to('/suppliers')) }],
      };
    }

    if (detail.type === 'supplier-product') {
      return {
        label: t('商品详情', 'Product Details'),
        title: detail.data.name,
        image: detail.data.image,
        subtitle: `${detail.data.categoryName} · ${detail.data.supplierName}`,
        meta: [
          [t('价格', 'Price'), formatCurrency(detail.data.price)],
          [t('库存', 'Stock'), `${detail.data.stock}`],
          [t('近7天访问', '7-day Views'), `${detail.data.views}`],
          [t('最近更新', 'Updated'), detail.data.updatedAt],
        ],
        tags: detail.data.tags || [],
        paragraphs: [detail.data.description || t('暂无更多描述。', 'No additional description.')],
        actions: [
          { label: t('编辑商品', 'Edit Product'), variant: 'primary', onClick: () => navigate(to(`/publish-product/${detail.data.id}`)) },
          { label: detail.data.status === 1 ? t('立即下架', 'Delist') : t('重新上架', 'Relist'), variant: 'secondary', onClick: () => handleToggleProductStatus(detail.data) },
          { label: t('删除商品', 'Delete'), variant: 'danger', onClick: () => handleDeleteProduct(detail.data) },
        ],
      };
    }

    if (detail.type === 'supplier-inquiry') {
      return {
        label: t('供应商询盘', 'Supplier Inquiry'),
        title: detail.data.product,
        subtitle: `${detail.data.customer} · ${detail.data.contact}`,
        meta: [
          [t('需求数量', 'Quantity'), detail.data.quantity],
          [t('预算区间', 'Budget'), detail.data.budget],
          [t('截止时间', 'Deadline'), detail.data.deadline],
          [t('当前状态', 'Status'), detail.data.status],
        ],
        tags: detail.data.tags || [],
        paragraphs: [detail.data.demand, `${t('最新留言：', 'Latest message:')}${detail.data.lastMessage}`],
        actions: [
          detail.data.status !== '方案沟通中'
            ? { label: t('转为沟通中', 'Start Discussion'), variant: 'primary', onClick: () => handleSupplierInquiryStatus(detail.data, '方案沟通中') }
            : { label: t('转为已转报价', 'Send Quote'), variant: 'primary', onClick: () => handleSupplierInquiryStatus(detail.data, '已转报价') },
        ],
      };
    }

    if (detail.type === 'quote') {
      return {
        label: t('报价详情', 'Quote Details'),
        title: detail.data.title,
        subtitle: `${detail.data.customer} · ${formatCurrency(detail.data.amount)}`,
        meta: [
          [t('更新于', 'Updated'), detail.data.updatedAt],
          [t('有效期至', 'Valid until'), detail.data.expireDate],
          [t('当前状态', 'Status'), detail.data.status],
        ],
        tags: detail.data.items || [],
        paragraphs: [detail.data.note || t('暂无备注。', 'No notes.')],
        actions: [
          detail.data.status !== '已成交'
            ? { label: t('标记为成交', 'Mark Closed'), variant: 'primary', onClick: () => handleQuoteStatus(detail.data, '已成交') }
            : { label: t('转回跟进中', 'Reopen'), variant: 'secondary', onClick: () => handleQuoteStatus(detail.data, '跟进中') },
        ],
      };
    }

    if (detail.type === 'task') {
      return {
        label: t('任务详情', 'Task Details'),
        title: detail.data.title,
        subtitle: `${detail.data.owner} · ${t('截止', 'Due')} ${detail.data.dueDate}`,
        meta: [[t('当前状态', 'Status'), detail.data.status]],
        paragraphs: [t('这是一条本地待办，可用于演示供应商团队的日常协同。', 'A local todo for demonstrating supplier team collaboration.')],
        actions: [{ label: detail.data.status === 'done' ? t('重新打开', 'Reopen') : t('标记完成', 'Mark Done'), variant: 'primary', onClick: () => handleTodoStatus(detail.data) }],
      };
    }

    if (detail.type === 'notification') {
      return {
        label: t('消息详情', 'Message Details'),
        title: detail.data.title,
        subtitle: detail.data.time,
        meta: [[t('优先级', 'Priority'), detail.data.level]],
        paragraphs: [detail.data.content],
        actions: !detail.data.read
          ? [{ label: t('标记为已读', 'Mark Read'), variant: 'primary', onClick: () => handleNotificationRead(detail.section, detail.data) }]
          : [],
      };
    }

    return null;
  };

  const renderDrawer = () => {
    const config = getDetailConfig();
    if (!config) return null;

    return (
      <DetailDrawer detail={{ label: config.label, title: config.title }} onClose={() => setDetail(null)}>
        {config.image && (
          <img
            src={getImagePath(config.image)}
            alt={config.title}
            className="mb-5 h-52 w-full rounded-2xl object-cover"
            onError={(event) => {
              event.target.src = '/products/placeholder-content.svg';
            }}
          />
        )}
        {config.subtitle && <p className="mb-5 text-sm text-gray-500">{config.subtitle}</p>}
        {config.meta?.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            {config.meta.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-gray-50 px-4 py-3">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        )}
        {config.tags?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="space-y-3 text-sm leading-7 text-gray-600">
          {config.paragraphs?.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        {config.actions?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {config.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={
                  action.variant === 'danger'
                    ? 'rounded-full bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100'
                    : action.variant === 'secondary'
                      ? 'rounded-full bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200'
                      : 'rounded-full bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800'
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </DetailDrawer>
    );
  };

  const renderBuyerOverview = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-900 p-7 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-100">
              <Sparkles size={14} />
              Buyer Workspace
            </div>
            <h2 className="mt-4 text-3xl font-bold">{centerData.profile.nickname}{t('，今天继续推进你的采购节奏', ', continue pushing your procurement forward')}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/85">
              {t('你在发现页点赞的视频、浏览过的内容和收藏的信息都会自动沉淀到这里，方便随时回看、汇总和继续询价。', 'Videos liked, content viewed, and saved info on the discovery page are automatically collected here for easy review and inquiry.')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <div className="text-cyan-100">{t('当前职位', 'Title')}</div>
              <div className="mt-1 font-semibold">{centerData.profile.title}</div>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <div className="text-cyan-100">{t('所属城市', 'City')}</div>
              <div className="mt-1 font-semibold">{centerData.profile.city}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Heart} title={t('点赞视频', 'Liked Videos')} value={buyerStats.likedVideos} subtitle={t('从内容详情页点击点赞后，会同步到这里', 'Synced after liking content')} accent="bg-rose-50 border-rose-100" onClick={() => setActiveTab('liked-videos')} />
        <MetricCard icon={Bookmark} title={t('收藏夹', 'Favorites')} value={buyerStats.favorites} subtitle={t('把商品和内容都攒到一个地方', 'Save products and content in one place')} accent="bg-amber-50 border-amber-100" onClick={() => setActiveTab('favorites')} />
        <MetricCard icon={History} title={t('浏览足迹', 'History')} value={buyerStats.viewed} subtitle={t('最近看过什么，一眼就能找回来', 'Easily find recently viewed content')} accent="bg-violet-50 border-violet-100" onClick={() => setActiveTab('history')} />
        <MetricCard icon={ShoppingCart} title={t('订单进度', 'Orders')} value={buyerStats.orders} subtitle={t('同步查看待发货、待验收的采购单', 'View pending and receiving orders')} accent="bg-sky-50 border-sky-100" onClick={() => setActiveTab('orders')} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Panel
          title={t('重点采购项目', 'Key Procurement Projects')}
          subtitle={t('把需求梳理、预算、供应商匹配都放在一个面板里', 'Consolidate requirements, budget, and supplier matching')}
          action={<button type="button" onClick={() => setActiveTab('projects')} className="text-sm font-medium text-slate-700 hover:text-slate-800">{t('查看全部', 'View All')}</button>}
        >
          <div className="space-y-4">
            {centerData.buyer.projects.map((project) => (
              <button
                type="button"
                key={project.id}
                onClick={() => setDetail({ type: 'project', data: project })}
                className="w-full rounded-2xl border border-gray-200 p-4 text-left hover:border-slate-200 hover:bg-slate-50/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-gray-900">{project.title}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>{project.owner}</span>
                      <span>{project.deadline}</span>
                      <StatusPill status={project.stage} />
                    </div>
                  </div>
                  <ChevronRight size={18} className="mt-1 text-gray-400" />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{project.summary}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t('已匹配', 'Matched')} {project.matches} {t('家供应商', 'suppliers')}</span>
                  <span className="font-semibold text-slate-700">{project.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-slate-700" style={{ width: `${project.progress}%` }}></div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          title={t('最新消息', 'Latest News')}
          subtitle={t('这里汇总询盘、订单和推荐提醒', 'Inquiries, orders, and recommendations')}
          action={<button type="button" onClick={() => handleAllNotificationsRead('buyer')} className="text-sm font-medium text-slate-700 hover:text-slate-800">{t('全部已读', 'Mark All Read')}</button>}
        >
          <div className="space-y-4">
            {centerData.buyer.notifications.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setDetail({ type: 'notification', data: item, section: 'buyer' })}
                className="w-full rounded-2xl border border-gray-200 p-4 text-left hover:border-slate-200 hover:bg-slate-50/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {!item.read && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const renderBuyerLikedVideos = () => (
    <Panel
      title={t('我点赞的视频', 'Liked Videos')}
      subtitle={t('从内容详情页点赞后，视频会沉淀到这里，可继续回看或取消点赞', 'Videos liked on the discovery page appear here')}
      action={
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t('搜索视频标题、作者、标签', 'Search videos, authors, tags')} className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
      }
    >
      {filteredLikedVideos.length === 0 ? (
        <EmptyState icon={Heart} title={t('还没有点赞视频', 'No liked videos yet')} description={t('去发现页或内容详情页点个赞，这里就会马上出现你互动过的视频。', 'Like videos on the discovery page and they will appear here.')} actionLabel={t('去发现页看看', 'Go to Discovery')} onAction={() => navigate(to('/discovery'))} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredLikedVideos.map((item) => (
            <div key={item.targetId} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <button type="button" onClick={() => setDetail({ type: 'liked-video', data: item })} className="w-full text-left">
                <img src={getImagePath(item.cover)} alt={item.title} className="h-40 w-full rounded-2xl object-cover" onError={(event) => { event.target.src = '/products/placeholder-content.svg'; }} />
                <div className="mt-4">
                  <div className="line-clamp-2 font-semibold text-gray-900">{item.title}</div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{item.author}</span>
                    <span>{item.duration || '--'}</span>
                  </div>
                </div>
              </button>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => navigate(to(`/content/${item.targetId}`))} className="flex-1 rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">{t('去查看', 'View')}</button>
                <button type="button" onClick={() => handleRemoveLikedVideo(item)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">{t('取消点赞', 'Unlike')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  const renderBuyerHistory = () => (
    <Panel
      title={t('浏览足迹', 'History')}
      subtitle={t('看过的内容会自动保存在本地，方便采购讨论时回溯', 'Viewed content is saved locally for easy reference')}
      action={
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t('搜索浏览记录', 'Search history')} className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-slate-600 focus:outline-none" />
          </div>
          <button type="button" onClick={handleClearViewHistory} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">{t('清空', 'Clear')}</button>
        </div>
      }
    >
      {filteredViewHistory.length === 0 ? (
        <EmptyState icon={History} title={t('还没有浏览足迹', 'No history yet')} description={t('打开任意内容详情页后，这里会自动记录你的浏览轨迹。', 'Browse any content page and your history will be recorded here.')} actionLabel={t('去发现页浏览', 'Browse Discovery')} onAction={() => navigate(to('/discovery'))} />
      ) : (
        <div className="space-y-4">
          {filteredViewHistory.map((item) => (
            <button
              type="button"
              key={item.targetId}
              onClick={() => setDetail({ type: 'history', data: item })}
              className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 p-4 text-left hover:border-slate-200 hover:bg-slate-50/40 md:flex-row md:items-center"
            >
              <img src={getImagePath(item.cover)} alt={item.title} className="h-28 w-full rounded-2xl object-cover md:w-48" onError={(event) => { event.target.src = '/products/placeholder-content.svg'; }} />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-500">{item.author}</div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>{item.duration || '内容浏览'}</span>
                  <span>{item.publishDate || '近期内容'}</span>
                  <span>{item.viewedAt ? new Date(item.viewedAt).toLocaleString('zh-CN') : '刚刚'}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </Panel>
  );

  const renderBuyerFavorites = () => (
    <Panel
      title={t('我的收藏夹', 'My Favorites')}
      subtitle={t('这里同时放商品收藏和内容收藏，适合做对比、备选和内部分享', 'Product and content favorites for comparison and sharing')}
      action={
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t('搜索收藏内容', 'Search favorites')} className="w-full rounded-full border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
      }
    >
      {filteredFavorites.length === 0 ? (
        <EmptyState icon={Bookmark} title={t('收藏夹还是空的', 'Favorites are empty')} description={t('在内容详情页点收藏，或者后续把商品收藏也沉淀到这里。', 'Save items from content pages and they will appear here.')} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredFavorites.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4">
              <button type="button" onClick={() => setDetail({ type: 'favorite', data: item })} className="flex w-full gap-4 text-left">
                <img src={getImagePath(item.image)} alt={item.title} className="h-28 w-36 rounded-2xl object-cover" onError={(event) => { event.target.src = '/products/placeholder-content.svg'; }} />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="mt-2 text-sm text-gray-500">{item.supplier}</div>
                  {item.note && <div className="mt-3 text-sm leading-6 text-gray-600">{item.note}</div>}
                </div>
              </button>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => openContent(item)} className="flex-1 rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">{t('查看详情', 'View Details')}</button>
                <button type="button" onClick={() => handleRemoveFavorite(item)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">{t('删除', 'Remove')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  const renderBuyerOrders = () => (
    <Panel title={t('我的订单', 'My Orders')} subtitle={t('用更细的卡片把采购状态、供应商和履约进度都展开', 'Detailed cards showing order status and progress')}>
      <div className="space-y-4">
        {centerData.buyer.orders.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setDetail({ type: 'order', data: item })}
            className="w-full rounded-2xl border border-gray-200 p-5 text-left hover:border-slate-200 hover:bg-slate-50/40"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-400">{item.id}</div>
                <div className="mt-2 text-lg font-semibold text-gray-900">{item.product}</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span>{item.supplier}</span>
                  <span>{item.orderDate}</span>
                  <StatusPill status={item.status} />
                </div>
              </div>
              <div className="min-w-48">
                <div className="text-right text-lg font-semibold text-slate-700">{formatCurrency(item.amount)}</div>
                <div className="mt-3 h-2 rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-slate-700" style={{ width: `${item.progress}%` }}></div>
                </div>
                <div className="mt-2 text-right text-xs text-gray-500">{item.stage}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );

  const renderBuyerInquiries = () => (
    <Panel title={t('我的询盘', 'My Inquiries')} subtitle={t('把预算、供应商、跟进节奏放在一起，做项目推进会更顺手', 'Budget, supplier, and follow-up in one place')}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {centerData.buyer.inquiries.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setDetail({ type: 'buyer-inquiry', data: item })}
            className="rounded-2xl border border-gray-200 p-5 text-left hover:border-slate-200 hover:bg-slate-50/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-500">{item.supplier} · {item.contact}</div>
              </div>
              <StatusPill status={item.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{item.message}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span>预算 {item.budget}</span>
              <span>·</span>
              <span>截至 {item.deadline}</span>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );

  const renderBuyerProjects = () => (
    <Panel title={t('采购项目', 'Procurement')} subtitle={t('做预算、比价、供应商筛选时，项目面板可以直接拿来演示流程', 'Project panel for budgeting and supplier screening')}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {centerData.buyer.projects.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setDetail({ type: 'project', data: item })}
            className="rounded-2xl border border-gray-200 p-5 text-left hover:border-slate-200 hover:bg-slate-50/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-500">{item.owner}</div>
              </div>
              <StatusPill status={item.stage} />
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{item.summary}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">预算 {item.budget}</span>
              <span className="font-semibold text-slate-700">{item.progress}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-slate-700" style={{ width: `${item.progress}%` }}></div>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );

  const renderNotifications = (section) => {
    const items = centerData[section].notifications;

    return (
      <Panel
        title={t('消息中心', 'Messages')}
        subtitle={t('前端静态存储模式下，也保留了消息流和已读状态', 'Message stream and read status preserved in static mode')}
        action={<button type="button" onClick={() => handleAllNotificationsRead(section)} className="rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">{t('全部已读', 'Mark All Read')}</button>}
      >
        <div className="space-y-4">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setDetail({ type: 'notification', data: item, section })}
              className={`w-full rounded-2xl border p-5 text-left transition-colors ${item.read ? 'border-gray-200 hover:border-slate-200 hover:bg-slate-50/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {!item.read && <span className="h-2 w-2 rounded-full bg-slate-700"></span>}
                    <span className="font-semibold text-gray-900">{item.title}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{item.content}</p>
                </div>
                <div className="text-right text-xs text-gray-400">{item.time}</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    );
  };

  const renderBuyerSettings = () => (
    <Panel
      title={t('个人设置', 'Settings')}
      subtitle={t('资料只保存在浏览器本地，你可以放心做界面演示和交互测试', 'Data is saved locally for demo and testing')}
      action={<button type="button" onClick={handleSaveProfile} className="rounded-full bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">{t('保存资料', 'Save Profile')}</button>}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <input value={settingsForm.nickname || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, nickname: event.target.value }))} placeholder={t('昵称', 'Nickname')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.avatar || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, avatar: event.target.value }))} placeholder={t('头像链接', 'Avatar URL')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.phone || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder={t('手机号', 'Phone')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.email || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, email: event.target.value }))} placeholder={t('邮箱', 'Email')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
        <div className="space-y-5">
          <input value={settingsForm.company || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, company: event.target.value }))} placeholder={t('公司/部门', 'Company/Dept')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.city || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, city: event.target.value }))} placeholder={t('城市', 'City')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.title || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, title: event.target.value }))} placeholder={t('岗位', 'Title')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <textarea value={settingsForm.bio || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, bio: event.target.value }))} rows={5} placeholder={t('个人简介', 'Bio')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
      </div>
    </Panel>
  );

  const renderSupplierOverview = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-br from-sky-900 via-cyan-900 to-emerald-900 p-7 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-100">
              <Store size={14} />
              Supplier Console
            </div>
            <h2 className="mt-4 text-3xl font-bold">{centerData.supplier.shop.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/85">{centerData.supplier.shop.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <div className="text-cyan-100">{t('响应率', 'Response Rate')}</div>
              <div className="mt-1 font-semibold">{centerData.supplier.shop.responseRate}%</div>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <div className="text-cyan-100">{t('平均回复', 'Avg. Reply')}</div>
              <div className="mt-1 font-semibold">{centerData.supplier.shop.replyTime}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Package} title={t('商品总数', 'Total Products')} value={supplierStats.products} subtitle={`${t('其中', 'Of which')} ${supplierStats.activeProducts} ${t('个在售', 'on sale')}`} accent="bg-emerald-50 border-emerald-100" onClick={() => setActiveTab('products')} />
        <MetricCard icon={Briefcase} title={t('租赁待审核', 'Leasing Reviews')} value={supplierStats.leasingReviews} subtitle={t('客户租赁申请会在这里进入审核流转', 'Customer leasing applications await review')} accent="bg-amber-50 border-amber-100" onClick={() => setActiveTab('leasing-reviews')} />
        <MetricCard icon={MessageSquare} title={t('待处理询盘', 'Pending Inquiries')} value={supplierStats.pendingInquiries} subtitle={t('高优先级客户需要尽快跟进', 'High-priority customers need quick follow-up')} accent="bg-red-50 border-red-100" onClick={() => setActiveTab('inquiries')} />
        <MetricCard icon={FileText} title={t('报价单', 'Quotes')} value={supplierStats.quotes} subtitle={t('包含待确认、跟进中和已成交', 'Pending, following up, and closed')} accent="bg-amber-50 border-amber-100" onClick={() => setActiveTab('quotes')} />
        <MetricCard icon={Bell} title={t('消息提醒', 'Notifications')} value={supplierStats.unread} subtitle={`${t('另有', 'Plus')} ${supplierStats.leasingReviews} ${t('条租赁申请待审核', 'leasing reviews pending')}`} accent="bg-sky-50 border-sky-100" onClick={() => setActiveTab('leasing-reviews')} />
      </div>
    </div>
  );

  const renderSupplierProducts = () => (
    <Panel title={t('商品管理', 'Products')} subtitle={t('支持本地新增、编辑、上下架、删除，适合直接做前端演示', 'Add, edit, list, and delete products locally')} action={<button type="button" onClick={() => navigate(to('/publish-product'))} className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"><Plus size={16} />{t('添加商品', 'Add Product')}</button>}>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t('搜索商品名称、分类、标签', 'Search products, categories, tags')} className="w-full rounded-full border border-gray-300 py-2.5 pl-9 pr-4 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
        <div className="flex gap-2">
          {[['all', t('全部', 'All')], ['online', t('在售', 'Online')], ['offline', t('已下架', 'Offline')]].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setProductStatusFilter(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${productStatusFilter === value ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label}</button>
          ))}
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <EmptyState icon={Package} title={t('还没有符合条件的商品', 'No matching products')} description={t('你可以先新增一条商品，或者切换筛选条件查看其他状态。', 'Add a product or switch filters.')} actionLabel={t('发布商品', 'Publish Product')} onAction={() => navigate(to('/publish-product'))} />
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
              <button type="button" onClick={() => setDetail({ type: 'supplier-product', data: item })} className="flex items-center gap-4 text-left">
                <img src={getImagePath(item.image)} alt={item.name} className="h-20 w-24 rounded-2xl object-cover" onError={(event) => { event.target.src = '/products/placeholder-content.svg'; }} />
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="mt-2 text-sm text-gray-500">{item.categoryName} · 库存 {item.stock}</div>
                  <div className="mt-2 text-sm font-medium text-slate-700">{formatCurrency(item.price)}</div>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <StatusPill status={item.status === 1 ? t('在售', 'Online') : t('已下架', 'Offline')} />
                <button type="button" onClick={() => handleToggleProductStatus(item)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">{item.status === 1 ? t('下架', 'Delist') : t('上架', 'List')}</button>
                <button type="button" onClick={() => navigate(to(`/publish-product/${item.id}`))} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100">{t('编辑', 'Edit')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  const renderSupplierLeasingReviews = () => (
    <Panel title={t('租赁审核', 'Leasing Review')} subtitle={t('用户提交租赁申请后，会自动同步到供应商中心，审核通过后设备会直接进入租出状态', 'Leasing applications sync here; approval sets device to leased')}>
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ['all', t('全部', 'All')],
          ['pending', t('待审核', 'Pending')],
          ['approved', t('已通过', 'Approved')],
          ['rejected', t('已驳回', 'Rejected')],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setSupplierLeasingFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${supplierLeasingFilter === value ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {supplierLeasingLoading ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">{t('正在加载租赁申请...', 'Loading leasing applications...')}</div>
      ) : filteredSupplierLeasingRecords.length === 0 ? (
        <EmptyState icon={Briefcase} title={t('当前没有租赁申请', 'No leasing applications')} description={t('当采购方提交租赁申请后，这里会显示待审核数据。', 'Leasing applications from buyers will appear here.')} />
      ) : (
        <div className="space-y-4">
          {filteredSupplierLeasingRecords.map((item) => {
            const statusText = item.status === 0 ? t('待审核', 'Pending') : item.status === 1 ? t('已通过并租出', 'Approved & Leased') : t('已驳回', 'Rejected');
            return (
              <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex gap-4">
                    <img src={getImagePath(item.leasingImage)} alt={item.leasingName} className="h-20 w-24 rounded-2xl object-cover" onError={(event) => { event.target.src = '/products/placeholder-content.svg'; }} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-semibold text-gray-900">{item.leasingName}</h4>
                        <StatusPill status={statusText} />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{item.companyName} · {item.contactName} · {item.contactPhone}</p>
                      <div className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div>{t('租赁周期：', 'Lease Period:')}{item.leasePeriod || t('未填写', 'N/A')} / {item.leaseDuration || 0}</div>
                        <div>{t('预估费用：', 'Est. Cost:')}{formatCurrency(item.estimatedCost)}</div>
                        <div>{t('期望开始：', 'Expected Start:')}{item.expectedStartDate || t('待确认', 'TBD')}</div>
                        <div>{t('设备状态：', 'Device Status:')}{item.inventoryStatus === 1 ? t('已租出', 'Leased') : t('待租中', 'Available')}</div>
                        <div className="md:col-span-2">{t('配送地址：', 'Delivery:')}{item.deliveryAddress || t('未填写', 'N/A')}</div>
                        <div className="md:col-span-2">{t('使用地址：', 'Usage Address:')}{item.onsiteAddress || t('未填写', 'N/A')}</div>
                      </div>
                      {item.remark && <p className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">{item.remark}</p>}
                    </div>
                  </div>

                  {item.status === 0 && (
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => handleSupplierLeasingReview(item, 2)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">{t('驳回', 'Reject')}</button>
                      <button type="button" onClick={() => handleSupplierLeasingReview(item, 1)} className="rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">{t('通过并租出', 'Approve & Lease')}</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );

  const renderSupplierInquiries = () => (
    <Panel title={t('询盘管理', 'Inquiry Mgmt')} subtitle={t('不仅展示列表，还可以直接切换推进状态，模拟真实供应商工作台', 'Switch statuses to simulate a real supplier workspace')}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {[
          { key: '待回复', label: t('待回复', 'Pending Reply') },
          { key: '方案沟通中', label: t('方案沟通中', 'In Discussion') },
          { key: '已转报价', label: t('已转报价', 'Quoted') },
        ].map(({ key, label }) => {
          const items = centerData.supplier.inquiries.filter((item) => item.status === key);
          return (
            <div key={key} className="rounded-2xl bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="rounded-full bg-white px-3 py-1 text-xs text-gray-500">{items.length} {t('条', '')}</div>
              </div>
              <div className="space-y-3">
                {items.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-400">{t('暂无内容', 'No items')}</div>}
                {items.map((item) => (
                  <button type="button" key={item.id} onClick={() => setDetail({ type: 'supplier-inquiry', data: item })} className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-slate-200 hover:bg-slate-50/40">
                    <div className="font-semibold text-gray-900">{item.customer}</div>
                    <div className="mt-2 text-sm text-gray-500">{item.product}</div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{item.lastMessage}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );

  const renderSupplierQuotes = () => (
    <Panel title={t('报价管理', 'Quotes')} subtitle={t('报价项、到期时间和成交状态都可以本地模拟', 'Quote items, expiry, and deal status are simulated locally')}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {centerData.supplier.quotes.map((item) => (
          <button type="button" key={item.id} onClick={() => setDetail({ type: 'quote', data: item })} className="rounded-2xl border border-gray-200 p-5 text-left hover:border-slate-200 hover:bg-slate-50/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-500">{item.customer}</div>
              </div>
              <StatusPill status={item.status} />
            </div>
            <div className="mt-4 text-2xl font-bold text-slate-700">{formatCurrency(item.amount)}</div>
            <div className="mt-2 text-xs text-gray-500">{t('有效期至', 'Valid until')} {item.expireDate}</div>
          </button>
        ))}
      </div>
    </Panel>
  );

  const renderSupplierShop = () => (
    <Panel title={t('店铺管理', 'Store')} subtitle={t('这里做成了表单 + 预览的方式，演示会更直观', 'Form + preview layout for easier demo')} action={<button type="button" onClick={handleSaveShop} className="rounded-full bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">{t('保存店铺信息', 'Save Shop Info')}</button>}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <input value={shopForm.name || ''} onChange={(event) => setShopForm((prev) => ({ ...prev, name: event.target.value }))} placeholder={t('店铺名称', 'Shop Name')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={shopForm.slogan || ''} onChange={(event) => setShopForm((prev) => ({ ...prev, slogan: event.target.value }))} placeholder={t('宣传语', 'Slogan')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <textarea value={shopForm.description || ''} onChange={(event) => setShopForm((prev) => ({ ...prev, description: event.target.value }))} rows={5} placeholder={t('店铺介绍', 'Description')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={shopForm.serviceArea || ''} onChange={(event) => setShopForm((prev) => ({ ...prev, serviceArea: event.target.value }))} placeholder={t('服务区域', 'Service Area')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={Array.isArray(shopForm.tags) ? shopForm.tags.join('，') : shopForm.tags || ''} onChange={(event) => setShopForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder={t('服务标签', 'Service Tags')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
        <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-cyan-950 to-sky-900 p-6 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
            <Building2 size={14} />
            {t('店铺预览', 'Shop Preview')}
          </div>
          <h3 className="mt-4 text-2xl font-bold">{shopForm.name}</h3>
          <p className="mt-3 text-cyan-100">{shopForm.slogan}</p>
          <p className="mt-5 text-sm leading-7 text-cyan-50/80">{shopForm.description}</p>
        </div>
      </div>
    </Panel>
  );

  const renderSupplierTasks = () => (
    <Panel title={t('今日待办', 'Tasks')} subtitle={t('给供应商侧加了一层团队任务感，演示更完整', 'Task list for a more complete supplier demo')}>
      <div className="space-y-4">
        {centerData.supplier.todos.map((item) => (
          <div key={item.id} className="flex w-full items-center justify-between rounded-2xl border border-gray-200 p-5 text-left hover:border-slate-200 hover:bg-slate-50/40">
            <div>
              <button type="button" onClick={() => setDetail({ type: 'task', data: item })} className="text-left">
                <div className="flex items-center gap-2">
                {item.status === 'done' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <CircleAlert size={16} className="text-amber-500" />}
                <span className="font-semibold text-gray-900">{item.title}</span>
                </div>
                <div className="mt-3 text-sm text-gray-500">{item.owner} · 截止 {item.dueDate}</div>
              </button>
            </div>
            <button type="button" onClick={(event) => { event.stopPropagation(); handleTodoStatus(item); }} className={`rounded-full px-4 py-2 text-sm font-medium ${item.status === 'done' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>{item.status === 'done' ? '重新打开' : '标记完成'}</button>
          </div>
        ))}
      </div>
    </Panel>
  );

  const renderSupplierSettings = () => (
    <Panel title={t('账号设置', 'Account')} subtitle={t('供应商侧保留账号信息，和店铺信息做拆分，结构更清晰', 'Account info separated from shop info for clarity')} action={<button type="button" onClick={handleSaveProfile} className="rounded-full bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">{t('保存账号资料', 'Save Account')}</button>}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <input value={settingsForm.nickname || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, nickname: event.target.value }))} placeholder={t('联系人', 'Contact')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.avatar || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, avatar: event.target.value }))} placeholder={t('头像链接', 'Avatar URL')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.phone || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder={t('手机号', 'Phone')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
        <div className="space-y-5">
          <input value={settingsForm.email || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, email: event.target.value }))} placeholder={t('邮箱', 'Email')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <input value={settingsForm.city || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, city: event.target.value }))} placeholder={t('所在城市', 'City')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
          <textarea value={settingsForm.bio || ''} onChange={(event) => setSettingsForm((prev) => ({ ...prev, bio: event.target.value }))} rows={5} placeholder={t('个人简介', 'Bio')} className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-slate-600 focus:outline-none" />
        </div>
      </div>
    </Panel>
  );

  const renderContent = () => {
    if (isSupplier) {
      switch (activeTab) {
        case 'overview': return renderSupplierOverview();
        case 'products': return renderSupplierProducts();
        case 'leasing-reviews': return renderSupplierLeasingReviews();
        case 'inquiries': return renderSupplierInquiries();
        case 'quotes': return renderSupplierQuotes();
        case 'shop': return renderSupplierShop();
        case 'tasks': return renderSupplierTasks();
        case 'notifications': return renderNotifications('supplier');
        case 'settings': return renderSupplierSettings();
        default: return null;
      }
    }

    switch (activeTab) {
      case 'overview': return renderBuyerOverview();
      case 'liked-videos': return renderBuyerLikedVideos();
      case 'history': return renderBuyerHistory();
      case 'favorites': return renderBuyerFavorites();
      case 'orders': return renderBuyerOrders();
      case 'inquiries': return renderBuyerInquiries();
      case 'projects': return renderBuyerProjects();
      case 'notifications': return renderNotifications('buyer');
      case 'settings': return renderBuyerSettings();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {hint && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {hint}
          </div>
        )}

        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${activeTab === item.key ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Icon size={16} />
                  {item.label}
                  {item.badge ? <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{item.badge}</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-20 overflow-hidden rounded-[28px] bg-white shadow-sm">
              <div className={`p-6 text-white ${isSupplier ? 'bg-gradient-to-br from-cyan-700 to-sky-900' : 'bg-gradient-to-br from-slate-800 to-amber-800'}`}>
                <img
                  src={centerData.profile.avatar || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt="Avatar"
                  className="h-16 w-16 rounded-2xl border-2 border-white/50 object-cover bg-white"
                />
                <div className="mt-4 text-xl font-bold">{centerData.profile.nickname}</div>
                <div className="mt-1 text-sm text-white/80">{centerData.profile.title}</div>
                <div className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-6 text-white/90">
                  {isSupplier ? t('商品、询盘、报价和店铺配置都采用前端本地静态存储。', 'Products, inquiries, quotes, and shop config are stored locally.') : t('点赞视频、浏览足迹、收藏夹和采购项目全部前端静态保存。', 'Likes, history, favorites, and projects are saved locally.')}
                </div>
              </div>
              <div className="p-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={`mb-1 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${activeTab === item.key ? 'bg-slate-50 text-slate-800' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.badge ? <span className={`rounded-full px-2.5 py-1 text-xs ${activeTab === item.key ? 'bg-white text-slate-800' : 'bg-gray-100 text-gray-500'}`}>{item.badge}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">{renderContent()}</main>
        </div>
      </div>
      {renderDrawer()}
    </div>
  );
};

export default PersonalCenter;
