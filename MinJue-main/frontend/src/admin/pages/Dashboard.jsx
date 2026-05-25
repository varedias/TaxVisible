import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Package, ShoppingCart, Clock, ArrowRight, Heart, MessageSquare, Star, Share2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import Card from '../components/common/Card';
import { dashboardApi } from '../api/dashboard';
import { interactionStatsApi } from '../api/interaction';
import { useAdminI18n } from '../context/AdminI18nContext';

/**
 * 仪表盘页面
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useAdminI18n();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    userCount: 0,
    supplierCount: 0,
    productCount: 0,
    orderCount: 0,
    pendingAuditCount: 0,
    pendingLeasingCount: 0,
  });
  const [interactionStats, setInteractionStats] = useState({
    totalComments: 0,
    totalLikes: 0,
    totalFavorites: 0,
    totalShares: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, usersData, productsData, interactionData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentUsers(5),
          dashboardApi.getRecentProducts(5),
          interactionStatsApi.getStats().catch(() => ({})),
        ]);
        setStats(statsData || {});
        setRecentUsers(usersData || []);
        setRecentProducts(productsData || []);
        setInteractionStats(interactionData || {});
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 统计卡片配置
  const statCards = [
    { title: t('dashboard.totalUsers'), value: stats.userCount || 0, icon: <Users size={24} />, color: 'blue', onClick: () => navigate('/admin/users') },
    { title: t('dashboard.totalSuppliers'), value: stats.supplierCount || 0, icon: <Building2 size={24} />, color: 'green', onClick: () => navigate('/admin/suppliers') },
    { title: t('dashboard.totalProducts'), value: stats.productCount || 0, icon: <Package size={24} />, color: 'orange', onClick: () => navigate('/admin/products') },
    { title: t('dashboard.totalOrders'), value: stats.orderCount || 0, icon: <ShoppingCart size={24} />, color: 'red' },
  ];

  // 周趋势图配置
  const weeklyTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: [t('dashboard.totalUsers'), t('dashboard.totalProducts'), t('dashboard.totalOrders')], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [
      { name: t('dashboard.totalUsers'), type: 'line', smooth: true, data: [12, 15, 18, 22, 28, 35, 42], itemStyle: { color: '#3B82F6' }, areaStyle: { color: 'rgba(59, 130, 246, 0.1)' } },
      { name: t('dashboard.totalProducts'), type: 'line', smooth: true, data: [8, 12, 15, 18, 20, 25, 30], itemStyle: { color: '#F97316' }, areaStyle: { color: 'rgba(249, 115, 22, 0.1)' } },
      { name: t('dashboard.totalOrders'), type: 'line', smooth: true, data: [5, 8, 12, 15, 18, 22, 28], itemStyle: { color: '#EF4444' }, areaStyle: { color: 'rgba(239, 68, 68, 0.1)' } },
    ],
  };

  // 分类分布饼图配置
  const categoryOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 8, name: '视觉检测', itemStyle: { color: '#3B82F6' } },
        { value: 5, name: '自动化设备', itemStyle: { color: '#10B981' } },
        { value: 4, name: '传感器', itemStyle: { color: '#F97316' } },
        { value: 4, name: '工业相机', itemStyle: { color: '#8B5CF6' } },
      ],
    }],
  };

  // 互动统计柱状图配置
  const interactionOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: [t('dashboard.comments'), t('dashboard.likes'), t('dashboard.favorites'), t('dashboard.shares')] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      barWidth: '50%',
      data: [
        { value: interactionStats.totalComments || 15, itemStyle: { color: '#3B82F6', borderRadius: [8, 8, 0, 0] } },
        { value: interactionStats.totalLikes || 28, itemStyle: { color: '#EF4444', borderRadius: [8, 8, 0, 0] } },
        { value: interactionStats.totalFavorites || 18, itemStyle: { color: '#F59E0B', borderRadius: [8, 8, 0, 0] } },
        { value: interactionStats.totalShares || 12, itemStyle: { color: '#10B981', borderRadius: [8, 8, 0, 0] } },
      ],
    }],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => <Card key={index} {...card} />)}
      </div>

      {/* 互动数据小卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg"><MessageSquare size={20} className="text-slate-700" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{interactionStats.totalComments || 0}</p><p className="text-xs text-gray-500">{t('dashboard.comments')}</p></div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg"><Heart size={20} className="text-red-500" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{interactionStats.totalLikes || 0}</p><p className="text-xs text-gray-500">{t('dashboard.likes')}</p></div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg"><Star size={20} className="text-yellow-500" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{interactionStats.totalFavorites || 0}</p><p className="text-xs text-gray-500">{t('dashboard.favorites')}</p></div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg"><Share2 size={20} className="text-green-500" /></div>
          <div><p className="text-2xl font-bold text-gray-900">{interactionStats.totalShares || 0}</p><p className="text-xs text-gray-500">{t('dashboard.shares')}</p></div>
        </div>
      </div>

      {/* 待审核提醒 */}
      {stats.pendingAuditCount > 0 && (
        <div onClick={() => navigate('/admin/suppliers')} className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><Clock size={20} className="text-orange-600" /></div>
            <div><p className="font-medium text-orange-800">{t('dashboard.pendingAudit')}</p><p className="text-sm text-orange-600">{stats.pendingAuditCount} {t('dashboard.pendingAuditTip')}</p></div>
          </div>
          <ArrowRight size={20} className="text-orange-600" />
        </div>
      )}

      {stats.pendingLeasingCount > 0 && (
        <div onClick={() => navigate('/admin/leasing')} className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-sky-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg"><MessageSquare size={20} className="text-sky-600" /></div>
            <div><p className="font-medium text-sky-800">{t('dashboard.pendingLeasing')}</p><p className="text-sm text-sky-600">{stats.pendingLeasingCount} {t('dashboard.pendingLeasingTip')}</p></div>
          </div>
          <ArrowRight size={20} className="text-sky-600" />
        </div>
      )}

      {/* ECharts图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 周趋势图 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.weeklyTrend')}</h3>
          <ReactECharts option={weeklyTrendOption} style={{ height: 280 }} />
        </div>
        {/* 分类分布 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.categoryDistribution')}</h3>
          <ReactECharts option={categoryOption} style={{ height: 280 }} />
        </div>
      </div>

      {/* 互动统计图 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.interactionStats')}</h3>
        <ReactECharts option={interactionOption} style={{ height: 250 }} />
      </div>

      {/* 最新数据 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新用户 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{t('dashboard.recentUsers')}</h3>
            <button onClick={() => navigate('/admin/users')} className="text-sm text-slate-700 hover:text-slate-800">{t('dashboard.viewAll')}</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">{t('common.noData')}</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><Users size={16} className="text-slate-700" /></div>
                    <div><p className="font-medium text-gray-900">{user.username}</p><p className="text-xs text-gray-500">{user.email || '-'}</p></div>
                  </div>
                  <span className="text-xs text-gray-400">{user.createTime ? new Date(user.createTime).toLocaleDateString() : '-'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 最新商品 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{t('dashboard.recentProducts')}</h3>
            <button onClick={() => navigate('/admin/products')} className="text-sm text-slate-700 hover:text-slate-800">{t('dashboard.viewAll')}</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">{t('common.noData')}</div>
            ) : (
              recentProducts.map((product) => (
                <div key={product.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <Package size={16} className="text-gray-400" />}
                    </div>
                    <div><p className="font-medium text-gray-900 line-clamp-1">{product.name}</p><p className="text-xs text-orange-500 font-medium">¥{product.price}</p></div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.status === 1 ? t('dashboard.onShelf') : t('dashboard.offShelf')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
