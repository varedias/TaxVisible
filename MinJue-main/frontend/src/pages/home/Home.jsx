import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Play, FileText, Eye, Building2, Clock, Menu, X, CheckCircle2 } from 'lucide-react';
import { productApi } from '../../api/product';
import { supplierApi, procurementApi } from '../../api/index';
import AIAssistantFloat, { AIAssistantButton } from '../../components/AIAssistantFloat';
import { discoveryVideos } from '../../data/discoveryVideos';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 真实数据状态
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [discoveryContent, setDiscoveryContent] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState({ products: true, suppliers: true, content: true, procurements: true });

  // 加载首页数据
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    // 并行加载首页数据
    await Promise.all([
      loadProducts(),
      loadSuppliers(),
      loadContent(),
      loadProcurements()
    ]);
  };

  const loadProducts = async () => {
    try {
      const res = await productApi.getList({ page: 1, size: 6 });
      if (res && res.records) {
        setFeaturedProducts(res.records);
      }
    } catch (e) {
      console.error('加载商品失败:', e);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await supplierApi.getList(1, 6);
      if (data && data.records) {
        setSupplierList(data.records);
      }
    } catch (e) {
      console.error('加载供应商失败:', e);
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadContent = async () => {
    try {
      setDiscoveryContent(getFeaturedDiscoveryContent());
    } catch (e) {
      console.error('加载内容失败:', e);
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
    }
  };

  const loadProcurements = async () => {
    try {
      const data = await procurementApi.getList({ page: 1, size: 6 });
      if (data && data.records) {
        setProcurements(data.records);
      }
    } catch (e) {
      console.error('加载采购信息失败:', e);
    } finally {
      setLoading(prev => ({ ...prev, procurements: false }));
    }
  };

  // 辅助函数：处理图片路径
  const getImagePath = (path, type = 'product') => {
    if (!path) return `/products/placeholder-${type}.svg`;
    if (path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  // 图片加载失败时的占位图
  const handleImageError = (e) => {
    e.target.src = '/products/placeholder-product.svg';
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getDiscoveryTypeLabel = (type) => {
    if (type === 'article') return '文章';
    if (type === 'vlog') return '探厂';
    return '视频';
  };

  const getDiscoveryCategoryLabel = (category) => {
    if (category === 'review') return '测评';
    if (category === 'tutorial') return '选型指南';
    if (category === 'vlog') return '产线实拍';
    if (category === 'analysis') return '行业观察';
    if (category === 'trading') return '买卖行情';
    return '推荐内容';
  };

  const getDiscoverySummary = (item) => {
    if (item.summary) return item.summary;

    const [primaryTag = '工业视觉', secondaryTag = '设备选型'] = item.tags || [];
    return `${item.author}围绕${primaryTag}、${secondaryTag}和${getDiscoveryCategoryLabel(item.category)}做了完整分享，适合快速了解应用场景、方案亮点与采购判断点。`;
  };

  const getFeaturedDiscoveryContent = () => {
    const rankedVideos = [...discoveryVideos].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 20;
      const scoreB = (b.views || 0) + (b.likes || 0) * 20;
      return scoreB - scoreA;
    });

    const preferredCategories = ['review', 'vlog', 'tutorial', 'analysis'];
    const curatedItems = preferredCategories
      .map((category) => rankedVideos.find((item) => item.category === category))
      .filter(Boolean);

    const fallbackItems = rankedVideos.filter(
      (item) => !curatedItems.some((selectedItem) => selectedItem.id === item.id)
    );

    return [...curatedItems, ...fallbackItems]
      .slice(0, 4)
      .map((item) => ({
        ...item,
        summary: getDiscoverySummary(item),
      }));
  };

  // 完整的设备分类数据
  const equipmentCategories = [
    {
      id: 1,
      name: 'AI视觉检测设备',
      subcategories: [
        { name: '2D视觉检测系统', products: ['平面缺陷检测', '尺寸测量系统', '字符识别OCR', '条码扫描系统', '表面质量检测'] },
        { name: '3D视觉检测系统', products: ['激光三角测量', '结构光扫描', '飞行时间ToF', '双目立体视觉', '线激光轮廓测量'] },
        { name: '智能分拣系统', products: ['视觉引导分拣', 'Delta并联机器人', '颜色识别分拣', '形状识别分拣', '混合物料分拣'] },
        { name: 'AI深度学习检测', products: ['缺陷识别算法', '目标检测系统', '图像分类系统', '语义分割', '实例分割'] },
        { name: '在线检测系统', products: ['高速检测系统', '连续流水线检测', '实时质量监控', '数据追溯系统', 'MES集成'] }
      ]
    },
    {
      id: 2,
      name: '工业相机',
      subcategories: [
        { name: '面阵相机', products: ['CCD相机', 'CMOS相机', '高分辨率相机', '高速相机', '低照度相机'] },
        { name: '线阵相机', products: ['单线阵相机', '多线阵相机', '彩色线阵', '红外线阵', 'TDI线阵相机'] },
        { name: '智能相机', products: ['嵌入式视觉', '一体化相机', 'AI智能相机', '边缘计算相机', '工业物联网相机'] },
        { name: '特殊相机', products: ['红外热成像', '紫外相机', '高光谱相机', 'X射线相机', '偏振相机'] },
        { name: '3D相机', products: ['TOF相机', '结构光相机', '双目相机', '激光轮廓相机', '光场相机'] }
      ]
    },
    {
      id: 3,
      name: '镜头与光源',
      subcategories: [
        { name: '工业镜头', products: ['定焦镜头', '变焦镜头', '远心镜头', '鱼眼镜头', '线扫描镜头'] },
        { name: 'LED光源', products: ['环形光源', '条形光源', '背光源', '同轴光源', 'AOI光源'] },
        { name: '特殊光源', products: ['紫外光源', '红外光源', '激光光源', 'X射线光源', '多光谱光源'] },
        { name: '光源控制器', products: ['恒流源控制器', '频闪控制器', '调光控制器', '多通道控制器', 'PWM控制器'] },
        { name: '光学配件', products: ['偏振镜', '滤光片', '扩散板', '光纤导光', '积分球'] }
      ]
    },
    {
      id: 4,
      name: '图像采集卡',
      subcategories: [
        { name: 'PCIe采集卡', products: ['单路采集卡', '多路采集卡', '高速采集卡', 'GPU采集卡', 'FPGA采集卡'] },
        { name: 'USB采集卡', products: ['USB3.0采集卡', 'USB3.1采集卡', '外置采集盒', '便携式采集', 'USB3.2采集'] },
        { name: '专用接口卡', products: ['Camera Link', 'CoaXPress', 'GigE采集卡', '10GigE采集卡', '25GigE采集卡'] },
        { name: '图像处理卡', products: ['FPGA处理卡', 'GPU处理卡', 'DSP处理卡', 'AI加速卡', 'NPU处理卡'] },
        { name: '视频采集卡', products: ['HDMI采集', 'SDI采集', '模拟信号采集', '4K采集卡', '8K采集卡'] }
      ]
    },
    {
      id: 5,
      name: '视觉软件',
      subcategories: [
        { name: '图像处理软件', products: ['Halcon', 'VisionPro', 'OpenCV', 'Matlab Vision', 'Labview Vision'] },
        { name: 'AI训练平台', products: ['TensorFlow', 'PyTorch', '深度学习框架', '模型训练工具', 'AutoML平台'] },
        { name: '3D视觉软件', products: ['点云处理', '三维重建', '3D测量软件', 'CAD比对', '逆向工程'] },
        { name: '机器人视觉', products: ['视觉定位', '轨迹规划', '手眼标定', '机器人引导', '抓取规划'] },
        { name: '质量管理系统', products: ['MES系统', 'SPC统计', '追溯系统', '报表分析', 'BI数据看板'] }
      ]
    },
    {
      id: 6,
      name: '机器人与自动化',
      subcategories: [
        { name: '工业机器人', products: ['六轴机器人', 'SCARA机器人', 'Delta机器人', '协作机器人', 'AGV搬运机器人'] },
        { name: '机械手', products: ['气动机械手', '电动机械手', '伺服机械手', '真空吸盘', '夹爪'] },
        { name: '输送系统', products: ['皮带输送', '链板输送', '滚筒输送', '柔性输送', '螺旋输送'] },
        { name: '定位系统', products: ['精密平移台', '旋转台', 'XYZ平台', '六自由度平台', '音圈电机平台'] },
        { name: '控制系统', products: ['PLC控制器', '运动控制卡', '伺服驱动器', '触摸屏HMI', '工业电脑'] }
      ]
    },
    {
      id: 7,
      name: '测量仪器',
      subcategories: [
        { name: '激光测量', products: ['激光测距', '激光轮廓', '激光跟踪仪', '激光干涉仪', '激光扫描仪'] },
        { name: '光学测量', products: ['影像测量仪', '光学显微镜', '工具显微镜', '投影仪', '轮廓投影仪'] },
        { name: '接触式测量', products: ['三坐标测量', '轮廓仪', '粗糙度仪', '圆度仪', '硬度计'] },
        { name: '在线测量', products: ['在线测厚', '在线测宽', '在线尺寸', '在线重量', '在线缺陷检测'] },
        { name: '光谱分析', products: ['光谱仪', '色差仪', '光泽度仪', '白度仪', '雾度仪'] }
      ]
    },
    {
      id: 8,
      name: '工程机械',
      subcategories: [
        { name: '挖掘机械', products: ['大型挖掘机(40-100吨)', '超大型挖掘机(100吨以上)', '中型挖掘机(13-40吨)', '小型挖掘机(13吨以下)', '微型挖掘机'] },
        { name: '铲土运输机械', products: ['推土机', '平地机', '铲运机', '装载机', '滑移装载机'] },
        { name: '起重机械', products: ['汽车起重机', '履带起重机', '塔式起重机', '门式起重机', '桥式起重机'] },
        { name: '压实机械', products: ['压路机', '夯实机', '振动压路机', '轮胎压路机', '冲击压路机'] },
        { name: '筑养路机械', products: ['沥青摊铺机', '混凝土搅拌站', '铣刨机', '灌缝机', '划线机'] }
      ]
    },
    {
      id: 9,
      name: '酒店用品',
      subcategories: [
        { name: '客房布草', products: ['床单', '被套', '枕套', '毛巾', '浴袍'] },
        { name: '一次性用品', products: ['牙刷', '牙膏', '洗发水', '沐浴露', '拖鞋'] },
        { name: '客房电器', products: ['电水壶', '吹风机', '台灯', '保险箱', '冰箱'] },
        { name: '餐饮设备', products: ['咖啡机', '制冰机', '洗碗机', '消毒柜', '烤箱'] },
        { name: '清洁用品', products: ['吸尘器', '清洁剂', '垃圾桶', '拖把', '抹布'] }
      ]
    },
    {
      id: 10,
      name: '水工业',
      subcategories: [
        { name: '泵阀管道', products: ['离心泵', '闸阀', '钢管', '塑料管', '球阀'] },
        { name: '水处理设备', products: ['净水器', '纯水机', '消毒设备', '过滤器', '反渗透设备'] },
        { name: '仪器仪表', products: ['流量计', '压力表', '水质分析仪', '液位计', 'PH计'] },
        { name: '水泵系统', products: ['潜水泵', '污水泵', '增压泵', '循环泵', '变频供水设备'] },
        { name: '水处理药剂', products: ['絮凝剂', '消毒剂', '阻垢剂', '除藻剂', 'PH调节剂'] }
      ]
    },
    {
      id: 11,
      name: '电子元器件',
      subcategories: [
        { name: '被动元件', products: ['电阻', '电容', '电感', '变压器', '晶振'] },
        { name: '主动元件', products: ['二极管', '三极管', 'MOS管', 'IGBT', '集成电路'] },
        { name: '连接器', products: ['排针排母', '接线端子', 'USB连接器', 'HDMI接口', '网络接口'] },
        { name: '传感器', products: ['温度传感器', '压力传感器', '位移传感器', '光电传感器', '加速度传感器'] },
        { name: '显示器件', products: ['LED灯', 'LCD屏', 'OLED屏', '数码管', '点阵屏'] }
      ]
    },
    {
      id: 12,
      name: '包装设备',
      subcategories: [
        { name: '包装机械', products: ['封口机', '真空包装机', '收缩包装机', '贴标机', '打包机'] },
        { name: '灌装设备', products: ['液体灌装机', '粉剂灌装机', '颗粒灌装机', '膏体灌装机', '自动灌装线'] },
        { name: '包装材料', products: ['塑料膜', '纸箱', '托盘', '缓冲材料', '标签'] },
        { name: '码垛设备', products: ['码垛机器人', '自动码垛机', '拆垛机', '输送系统', '仓储系统'] },
        { name: '检测设备', products: ['金属检测机', 'X光检测机', '重量检测', '视觉检测', '泄漏检测'] }
      ]
    }
  ];

  const activeEquipmentCategory = equipmentCategories.find((category) => category.id === selectedCategory);

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      {/* 搜索栏 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索设备分类、产品型号、供应商..."
                className="w-full bg-gray-50 text-gray-900 rounded-lg py-4 pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-10 py-4 rounded-lg font-medium hover:from-slate-800 hover:to-slate-900 transition-all shadow-md"
            >
              搜索
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 发现推荐模块 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
                发现推荐
              </h2>
              {/* subtitle removed */}
            </div>
            <button
              onClick={() => navigate('/discovery')}
              className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group flex-shrink-0"
            >
              查看更多
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {loading.content ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-64 lg:h-72 bg-gray-200"></div>
                  <div className="p-6 lg:p-7">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-24"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3 w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6 w-3/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : discoveryContent.length > 0 ? (
              discoveryContent.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/content/${item.id}`)}
                className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all cursor-pointer bg-white flex flex-col"
              >
                <div className="relative h-64 lg:h-72 bg-gray-100 overflow-hidden">
                  <img
                    src={getImagePath(item.cover || item.thumbnail)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={handleImageError}
                  />
                  {(item.type === 'video' || item.type === 'vlog') && (
                    <>
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 flex items-center justify-center transition-all z-10 pointer-events-none">
                        <div className="bg-white/90 rounded-full p-4 lg:p-5 group-hover:bg-slate-700 transition-colors shadow-lg">
                          <Play size={30} className="text-slate-700 group-hover:text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      item.type === 'article'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {item.type === 'article' && <FileText size={12} className="inline mr-1" />}
                      {getDiscoveryTypeLabel(item.type)}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {getDiscoveryCategoryLabel(item.category)}
                    </span>
                    {item.uploadTime && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-600">
                        {item.uploadTime}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-xl leading-9 text-gray-900 line-clamp-3 mb-3 group-hover:text-slate-700 min-h-[108px]">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-[15px] leading-7 text-gray-500 line-clamp-3 min-h-[84px] mb-5">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(item.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500 gap-4 pt-4 border-t border-gray-100">
                    <span className="font-medium truncate">{item.author}</span>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {(item.views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">暂无推荐内容</div>
            )}
          </div>
        </div>

        {/* 企业级产品分类模块 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* 标题栏 */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-8 py-5 flex items-center justify-between">
            <h2 className="text-white font-bold text-2xl flex items-center gap-3">
              <span className="w-1 h-8 bg-white rounded-full"></span>
              设备分类
            </h2>
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* 左侧分类侧边栏 */}
            <div className={`
              w-full md:w-72 lg:w-80 border-r border-gray-200 flex-shrink-0 bg-gray-50
              ${isMobileMenuOpen ? 'block' : 'hidden md:block'}
            `}>
              <div className="h-full">
                {equipmentCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`
                      px-6 py-5 border-b border-gray-200 cursor-pointer transition-all duration-200
                      ${selectedCategory === category.id
                        ? 'bg-slate-700 text-white border-l-4 border-l-white shadow-md'
                        : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-slate-700'
                      }
                    `}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
                          ${selectedCategory === category.id
                            ? 'bg-white text-slate-700'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-700 group-hover:text-white'
                          }
                          transition-colors
                        `}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-semibold text-base leading-6">{category.name}</span>
                      </div>
                      <ChevronRight
                        size={20}
                        className={`
                          flex-shrink-0 transition-transform
                          ${selectedCategory === category.id ? 'rotate-180 text-white' : 'text-gray-400 group-hover:text-slate-700'}
                        `}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧内容展示区 */}
            <div className="flex-grow bg-white min-h-[600px]">
              {selectedCategory ? (
                <div className="p-8 animate-fadeIn">
                  {/* 分类标题 */}
                  <div className="mb-8 pb-6 border-b-2 border-gray-200">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {activeEquipmentCategory?.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      共 {activeEquipmentCategory?.subcategories.length} 个子分类 ·
                      优质供应商认证 · 全方位技术支持
                    </p>
                  </div>

                  {/* 子分类网格布局 */}
                  <div className="space-y-8">
                    {activeEquipmentCategory?.subcategories.map((sub, subIdx) => (
                      <div
                        key={subIdx}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                      >
                        {/* 子分类标题 */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-1 h-6 bg-slate-700 rounded-full"></div>
                          <h4 className="font-bold text-xl text-gray-900">
                            {sub.name}
                          </h4>
                          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {sub.products.length} 项产品
                          </span>
                        </div>

                        {/* 产品列表 */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                          {sub.products.map((product, pIdx) => (
                            <React.Fragment key={pIdx}>
                              <span className="text-sm text-gray-700 hover:text-slate-700 cursor-pointer hover:font-medium transition-all px-2 py-1 rounded hover:bg-slate-50">
                                {product}
                              </span>
                              {pIdx < sub.products.length - 1 && (
                                <span className="text-gray-300">|</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-gray-400">
                  <div className="w-32 h-32 mb-6 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center">
                    <Search size={64} className="text-slate-300" />
                  </div>
                  <p className="text-xl font-medium text-gray-500 mb-2">请选择左侧分类</p>
                  <p className="text-sm text-gray-400">点击左侧分类查看详细的子分类和产品信息</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 优选商品模块 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
                优选商品
              </h2>
              <p className="text-sm text-gray-500 mt-2 ml-5">以下价格仅供参考,实际价格请联系供应商议价</p>
            </div>
            <button onClick={() => navigate('/mall')} className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group">
              查看更多
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {loading.products ? (
              [1,2,3,4,5,6].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-36 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="h-36 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={getImagePath(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={handleImageError}
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px] group-hover:text-slate-700">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs text-gray-400">已售{product.sales || 0}</span>
                  <span className="text-xs text-gray-400 ml-auto">浏览{product.views || 0}</span>
                </div>
                <div className="text-red-500 font-bold">
                  ¥<span className="text-lg">{Number(product.price || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-500 font-normal">/台</span>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-6 text-center text-gray-400 py-12">暂无商品</div>
            )}
          </div>
        </div>

        {/* 优质供应商模块 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
              优质供应商
            </h2>
            <button onClick={() => navigate('/suppliers')} className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group">
              更多供应商
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading.suppliers ? (
              [1,2].map(i => (
                <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-grow"><div className="h-5 bg-gray-200 rounded mb-3 w-1/3"></div><div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div></div>
                  </div>
                </div>
              ))
            ) : supplierList.length > 0 ? (
              supplierList.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => navigate(`/supplier/${supplier.id}`)}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {supplier.logo ? (
                      <img src={getImagePath(supplier.logo, 'supplier')} alt={supplier.name} className="w-full h-full object-cover" onError={handleImageError} />
                    ) : (
                      <Building2 size={32} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-slate-700">{supplier.name}</h3>
                      {supplier.isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1"><CheckCircle2 size={12} />已认证</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {supplier.description || '暂无介绍'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {supplier.contactInfo && (
                        <span className="flex items-center gap-1">
                          <Building2 size={14} className="text-slate-600" />
                          联系方式已提供
                        </span>
                      )}
                      {supplier.createTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          入驻于 {supplier.createTime.substring(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-12">暂无供应商</div>
            )}
          </div>
        </div>

        {/* 最新采购模块 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
              最新采购
            </h2>
            <button onClick={() => navigate('/suppliers')} className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group">
              查看全部
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-4">
            {procurements.length > 0 ? procurements.map((procurement) => (
              <div
                key={procurement.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex-grow pr-4 group-hover:text-slate-700 text-base">
                    {procurement.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-1 rounded">
                    {procurement.createTime ? new Date(procurement.createTime).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">数量:</span>
                    <span className="font-medium text-gray-900">{procurement.quantity || '-'}台</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">预算:</span>
                    <span className="font-medium text-orange-600">
                      {procurement.budgetMin && procurement.budgetMax
                        ? `¥${Number(procurement.budgetMin).toLocaleString()} - ¥${Number(procurement.budgetMax).toLocaleString()}`
                        : '面议'}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">截止:</span>
                    <span className="font-medium text-red-600">{procurement.deadline || '未定'}</span>
                  </span>
                </div>
                {procurement.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">{procurement.description}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/procurement/${procurement.id}`);
                    }}
                    className="flex-1 px-5 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-medium rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all shadow-md"
                  >
                    我要报价
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/procurement/${procurement.id}`);
                    }}
                    className="flex-1 px-5 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-slate-700 hover:text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-12">暂无采购信息</div>
            )}
          </div>
        </div>
      </div>

      {/* AI助手悬浮按钮 */}
      {!isAIAssistantOpen && (
        <AIAssistantButton onClick={() => setIsAIAssistantOpen(true)} />
      )}

      {/* AI助手悬浮窗 */}
      <AIAssistantFloat
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default Home;
