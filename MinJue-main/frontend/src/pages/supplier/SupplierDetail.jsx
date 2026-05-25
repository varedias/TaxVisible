import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Award, Star, Phone, Mail, MessageCircle, Building, Users, Package, TrendingUp, Shield, ChevronRight, Heart, ArrowLeft } from 'lucide-react';
import { supplierApi, contentApi } from '../../api/index';
import { productApi } from '../../api/product';
import SupplierChatDialog from '../../components/SupplierChatDialog';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const [activeTab, setActiveTab] = useState('products');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [supplierData, setSupplierData] = useState(null);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 辅助函数
  const getImagePath = (path) => {
    if (!path || path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  const safeJsonParse = (str, fallback = null) => {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch { return fallback; }
  };

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await supplierApi.getDetail(id);
        const sData = data?.data || data;
        if (!sData || !sData.id) {
          setSupplierData(null);
          setLoading(false);
          return;
        }
        setSupplierData(sData);

        // 加载该供应商的商品
        try {
          const pRes = await productApi.getList({ page: 1, size: 20, supplierId: sData.id });
          setSupplierProducts(pRes?.records || []);
        } catch (e) {
          console.error('加载供应商商品失败:', e);
        }
      } catch (e) {
        console.error('加载供应商详情失败:', e);
        setSupplierData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  // 如果找不到供应商，显示错误
  if (!supplierData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isEnglish ? 'Supplier Not Found' : '供应商不存在'}</h2>
          <button onClick={() => navigate('/suppliers')} className="text-slate-700 hover:text-slate-800">
            {isEnglish ? 'Back to Suppliers' : '返回供应商列表'}
          </button>
        </div>
      </div>
    );
  }

  // 解析联系方式
  const contact = safeJsonParse(supplierData.contactInfo, {});
  const yearsInBusiness = supplierData.createTime
    ? Math.max(1, new Date().getFullYear() - new Date(supplierData.createTime).getFullYear())
    : 1;

  // 构建供应商详情对象
  const supplier = {
    id: supplierData.id,
    name: supplierData.name,
    logo: supplierData.logo,
    banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 0,
    years: yearsInBusiness,
    location: contact.address || contact.city || '中国',
    founded: supplierData.createTime ? supplierData.createTime.substring(0, 4) + '年' : '未知',
    employees: contact.employees || '未公开',
    type: contact.companyType || '有限责任公司',
    registered: contact.registeredCapital || '未公开',
    responseRate: 95,
    responseTime: '3小时内',
    description: supplierData.description || '暂无介绍',
    isVerified: supplierData.isVerified === 1,
    stats: {
      products: supplierProducts.length,
      followers: 0,
      sales: supplierProducts.reduce((sum, p) => sum + (p.sales || 0), 0),
      satisfaction: '96.0'
    },
    contact: {
      phone: contact.phone || '未公开',
      mobile: contact.mobile || '未公开',
      email: contact.email || '未公开',
      wechat: contact.wechat || '未公开',
      address: contact.address || '中国'
    },
    advantages: [
      { icon: Award, title: '品质保证', desc: '所有产品均通过质量认证' },
      { icon: Shield, title: '售后无忧', desc: '提供专业售后服务' },
      { icon: TrendingUp, title: '技术领先', desc: '持续技术创新' },
      { icon: Users, title: '专业团队', desc: '经验丰富的技术团队' },
    ],
    products: supplierProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price || 0),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      image: p.image,
      sales: p.sales || 0,
    })),
    reviews: [],
    news: []
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-slate-700 to-slate-800 overflow-hidden">
        <img
          src={supplier.banner}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            <div className="flex items-end gap-6">
              <img
                src={supplier.logo}
                alt={supplier.name}
                className="w-32 h-32 rounded-xl bg-white p-2 shadow-lg"
              />
              <div className="text-white pb-2">
                <h1 className="text-3xl font-bold mb-2">{supplier.name}</h1>
                <p className="text-slate-100 mb-3">{supplier.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={18} />
                    <span className="font-medium">{supplier.rating}</span>
                    <span className="text-slate-200">({supplier.reviewCount}{isEnglish ? ' reviews' : '评价'})</span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{isEnglish ? `${supplier.years} years` : `经营${supplier.years}年`}</span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{supplier.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-slate-700"
        >
          <ArrowLeft size={20} />
          返回
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{isEnglish ? 'Company Stats' : '企业数据'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{supplier.stats.products}</div>
                  <div className="text-sm text-gray-600">{isEnglish ? 'Products' : '在售商品'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{supplier.stats.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{isEnglish ? 'Followers' : '关注人数'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{supplier.stats.sales.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{isEnglish ? 'Total Sales' : '累计销量'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{supplier.stats.satisfaction}%</div>
                  <div className="text-sm text-gray-600">{isEnglish ? 'Satisfaction' : '好评率'}</div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{isEnglish ? 'Contact' : '联系方式'}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-slate-700" />
                  <div>
                    <div className="text-sm text-gray-500">{isEnglish ? 'Phone' : '联系电话'}</div>
                    <div className="font-medium">{supplier.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-slate-700" />
                  <div>
                    <div className="text-sm text-gray-500">{isEnglish ? 'Email' : '电子邮箱'}</div>
                    <div className="font-medium">{supplier.contact.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageCircle size={18} className="text-slate-700" />
                  <div>
                    <div className="text-sm text-gray-500">{isEnglish ? 'WeChat' : '微信号'}</div>
                    <div className="font-medium">{supplier.contact.wechat}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={18} className="text-slate-700" />
                  <div>
                    <div className="text-sm text-gray-500">{isEnglish ? 'Address' : '公司地址'}</div>
                    <div className="font-medium">{supplier.contact.address}</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={18} />
                  {isEnglish ? 'Chat Now' : '在线咨询'}
                </button>
                <button className="w-full border-2 border-slate-700 text-slate-700 py-3 rounded-lg hover:bg-slate-50 font-medium flex items-center justify-center gap-2 transition-colors">
                  <Heart size={18} />
                  {isEnglish ? 'Follow' : '关注店铺'}
                </button>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{isEnglish ? 'Company Info' : '企业信息'}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{isEnglish ? 'Type' : '企业类型'}</span>
                  <span className="text-gray-900 font-medium">{supplier.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isEnglish ? 'Founded' : '成立时间'}</span>
                  <span className="text-gray-900 font-medium">{supplier.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isEnglish ? 'Capital' : '注册资本'}</span>
                  <span className="text-gray-900 font-medium">{supplier.registered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isEnglish ? 'Employees' : '员工人数'}</span>
                  <span className="text-gray-900 font-medium">{supplier.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isEnglish ? 'Response Rate' : '响应率'}</span>
                  <span className="text-green-600 font-medium">{supplier.responseRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isEnglish ? 'Response Time' : '响应时间'}</span>
                  <span className="text-green-600 font-medium">{supplier.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Advantages */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{isEnglish ? 'Advantages' : '企业优势'}</h3>
              <div className="space-y-4">
                {supplier.advantages.map((adv, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <adv.icon className="text-slate-700" size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{adv.title}</div>
                      <div className="text-sm text-gray-600">{adv.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b">
                <div className="flex">
                  {[
                    { id: 'products', label: isEnglish ? 'Products' : '全部商品', count: supplier.products.length },
                    { id: 'reviews', label: isEnglish ? 'Reviews' : '店铺评价', count: supplier.reviews.length },
                    { id: 'about', label: isEnglish ? 'About' : '企业介绍', count: null },
                    { id: 'news', label: isEnglish ? 'News' : '企业动态', count: supplier.news.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 font-medium transition-all ${activeTab === tab.id
                          ? 'text-slate-700 border-b-2 border-slate-700'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Products Tab */}
                {activeTab === 'products' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supplier.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-white border rounded-xl hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                      >
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={getImagePath(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-slate-700">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                            <span>{isEnglish ? `${product.sales} sold` : `已售${product.sales}`}</span>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-red-600 font-bold">
                                <span className="text-xs">¥</span>
                                <span className="text-xl">{product.price.toLocaleString()}</span>
                              </div>
                              {product.originalPrice && (
                                <div className="text-xs text-gray-400 line-through">
                                  ¥{product.originalPrice.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {supplier.reviews.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <Star size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">{isEnglish ? 'No Reviews' : '暂无评价'}</p>
                        <p className="text-sm mt-2">{isEnglish ? 'This supplier has no reviews yet' : '该供应商暂时还没有用户评价'}</p>
                      </div>
                    ) : (
                      supplier.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start gap-4">
                            <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full" />
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium text-gray-900">{review.user}</div>
                                  <div className="text-sm text-gray-500">{review.date}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700">{review.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{isEnglish ? 'Company Introduction' : '企业简介'}</h3>
                      <p className="text-gray-700 leading-relaxed">{supplier.description}</p>
                    </div>
                    {supplier.isVerified && (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                        <Shield size={20} />
                        <span className="font-medium">{isEnglish ? 'This supplier is verified' : '该供应商已通过平台认证'}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{isEnglish ? 'Key Advantages' : '核心优势'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supplier.advantages.map((adv, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-slate-50 rounded-lg">
                              <adv.icon className="text-slate-700" size={20} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{adv.title}</div>
                              <div className="text-sm text-gray-600">{adv.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* News Tab */}
                {activeTab === 'news' && (
                  <div className="space-y-6">
                    {supplier.news.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <Building size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">{isEnglish ? 'No News' : '暂无动态'}</p>
                        <p className="text-sm mt-2">{isEnglish ? 'This supplier has no news yet' : '该供应商暂未发布企业动态'}</p>
                      </div>
                    ) : (
                      supplier.news.map((news) => (
                        <div key={news.id} className="flex gap-4 border-b pb-6 last:border-b-0">
                          <img src={news.image} alt={news.title} className="w-48 h-32 rounded-lg object-cover" />
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-slate-700 cursor-pointer">
                              {news.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{news.summary}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{news.date}</span>
                              <button className="text-slate-700 text-sm hover:underline flex items-center gap-1">
                                {isEnglish ? 'Read More' : '查看详情'}
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Dialog */}
      <SupplierChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        supplier={supplier}
      />
    </div>
  );
};

export default SupplierDetail;
