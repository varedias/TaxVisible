import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Phone, Heart, Share2, Shield, Truck, Clock, MessageCircle, ThumbsUp, ChevronRight, Package, Award, CheckCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import { productApi } from '../../api/product';
import { supplierApi } from '../../api/index';
import { commentApi, favoriteApi } from '../../api/interaction';
import { useAuth } from '../../context/AuthContext';
import SupplierChatDialog from '../../components/SupplierChatDialog';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('detail');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [productData, setProductData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useAuth();

  // 辅助函数：处理图片路径（Unsplash 在国内无法访问）
  const getImagePath = (path) => {
    if (!path) return '/products/placeholder-product.svg';
    if (path.includes('unsplash.com')) return '/products/placeholder-product.svg';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  const handleImageError = (e) => {
    e.target.src = '/products/placeholder-product.svg';
  };

  // 安全解析JSON
  const safeJsonParse = (str, fallback = []) => {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch { return fallback; }
  };

  // 加载商品详情
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await productApi.getDetail(id);
        const data = res?.data || res;
        if (!data || !data.id) {
          setProductData(null);
          setLoading(false);
          return;
        }
        setProductData(data);

        // 加载供应商信息
        if (data.supplierId) {
          try {
            const sres = await supplierApi.getDetail(data.supplierId);
            const sdata = sres?.data || sres;
            setSupplierData(sdata);
          } catch (e) {
            console.error('加载供应商失败:', e);
          }
        }

        // 加载相关商品（同分类）
        try {
          const rres = await productApi.getList({ page: 1, size: 6, categoryId: data.categoryId });
          const records = rres?.records || [];
          setRelatedProducts(records.filter(p => p.id !== data.id).slice(0, 4));
        } catch (e) {
          console.error('加载相关商品失败:', e);
        }
      } catch (e) {
        console.error('加载商品详情失败:', e);
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // 加载评论
  const loadComments = async (page = 1) => {
    try {
      const res = await commentApi.getList({ productId: id, page, size: 10 });
      setComments(res?.records || []);
      setCommentTotalPages(res?.pages || 1);
      setCommentPage(page);
    } catch (e) {
      console.error('加载评论失败:', e);
    }
  };

  // 加载评论数
  const loadCommentCount = async () => {
    try {
      const count = await commentApi.getCount(id);
      setCommentCount(count || 0);
    } catch (e) { /* ignore */ }
  };

  // 检查收藏状态
  const checkFavoriteStatus = async () => {
    if (!user) return;
    try {
      const result = await favoriteApi.check({ targetId: Number(id), targetType: 'product' });
      setIsFavorited(!!result);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    if (!loading && productData) {
      loadComments(1);
      loadCommentCount();
      checkFavoriteStatus();
    }
  }, [loading, productData, user]);

  // 提交评论
  const handleSubmitComment = async () => {
    if (!user) { navigate('/login'); return; }
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      await commentApi.add({ productId: Number(id), rating: newRating, content: newComment.trim() });
      setNewComment('');
      setNewRating(5);
      await loadComments(1);
      await loadCommentCount();
    } catch (e) {
      console.error('评论失败:', e);
    } finally {
      setSubmittingComment(false);
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.delete(commentId);
      await loadComments(commentPage);
      await loadCommentCount();
    } catch (e) {
      console.error('删除评论失败:', e);
    }
  };

  // 切换收藏
  const handleToggleFavorite = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await favoriteApi.toggle({
        targetId: Number(id), targetType: 'product',
        targetName: productData?.name || '', targetImage: productData?.image || ''
      });
      setIsFavorited(!!res?.favorited);
    } catch (e) {
      console.error('收藏操作失败:', e);
    }
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-500">{isEnglish ? 'Loading...' : '加载中...'}</p>
        </div>
      </div>
    );
  }

  // 如果找不到商品，显示404
  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isEnglish ? 'Product Not Found' : '商品不存在'}</h1>
          <button
            onClick={() => navigate(isEnglish ? '/en/mall' : '/mall')}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
          >
            {isEnglish ? 'Back to Marketplace' : '返回商城'}
          </button>
        </div>
      </div>
    );
  }

  // 解析相册（JSON数组）
  const albumImages = safeJsonParse(productData.album, []);
  const allImages = [productData.image, ...albumImages].filter(Boolean);
  if (allImages.length === 0) allImages.push('/Picture/default-product.jpg');

  // 解析规格参数（JSON对象或数组）
  const parsedSpecs = safeJsonParse(productData.specs, null);
  const specsArray = Array.isArray(parsedSpecs)
    ? parsedSpecs
    : parsedSpecs && typeof parsedSpecs === 'object'
      ? Object.entries(parsedSpecs).map(([label, value]) => ({ label, value: String(value) }))
      : [
          { label: isEnglish ? 'Product Name' : '商品名称', value: productData.name },
          { label: isEnglish ? 'Stock' : '库存', value: `${productData.stock || 0}${isEnglish ? ' units' : '件'}` },
          { label: isEnglish ? 'Sales' : '销量', value: `${productData.sales || 0}${isEnglish ? ' units' : '件'}` },
        ];

  // 构建商品详情对象（适配渲染模板）
  const product = {
    id: productData.id,
    name: productData.name,
    subtitle: productData.description || '',
    price: Number(productData.price || 0),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    rating: 4.8,
    reviewCount: commentCount || productData.sales || 0,
    sales: productData.sales || 0,
    stock: productData.stock || 0,
    images: allImages,
    tags: isEnglish ? ['2-Year Warranty', '7-Day Return'] : ['质保2年', '7天无理由退换'],
    supplier: {
      id: supplierData?.id || productData.supplierId || 0,
      name: supplierData?.name || (isEnglish ? 'Supplier' : '供应商'),
      logo: supplierData?.logo || `https://ui-avatars.com/api/?name=S&background=0D8ABC&color=fff`,
      rating: 4.9,
      years: supplierData?.createTime ? new Date().getFullYear() - new Date(supplierData.createTime).getFullYear() || 1 : 1,
      responseRate: 98,
      responseTime: isEnglish ? 'Within 2 hours' : '2小时内',
      location: isEnglish ? 'China' : '中国',
      description: supplierData?.description || (isEnglish ? 'Professional Equipment Supplier' : '专业设备供应商'),
      isVerified: supplierData?.isVerified === 1,
    },
    specs: specsArray,
    features: [
      '高品质保证',
      '专业技术支持',
      '完善售后服务',
      '快速交付',
      '性价比高'
    ],
    description: productData.description || '',
    serviceFeatures: [
      { icon: Shield, title: isEnglish ? 'Quality Assurance' : '质量保证', desc: isEnglish ? 'Genuine products, inspection supported' : '正品保证,支持验货' },
      { icon: Truck, title: isEnglish ? 'Free Shipping' : '包邮配送', desc: isEnglish ? 'Nationwide free shipping, ships in 48h' : '全国包邮,48小时发货' },
      { icon: Clock, title: isEnglish ? 'Worry-free After-sales' : '售后无忧', desc: isEnglish ? '7-day no-reason returns' : '7天无理由退换货' },
      { icon: Award, title: isEnglish ? '2-Year Warranty' : '质保2年', desc: isEnglish ? 'Manufacturer warranty' : '厂家质保,全国联保' },
    ],
    detailDescription: `
      <h3>${isEnglish ? 'Product Introduction' : '产品简介'}</h3>
      <p>${productData.description || (isEnglish ? 'No description available' : '暂无描述')}</p>
      <h3>${isEnglish ? 'Applications' : '应用场景'}</h3>
      <ul>
        <li>${isEnglish ? 'Industrial automation inspection' : '工业自动化检测'}</li>
        <li>${isEnglish ? 'Quality control systems' : '质量控制系统'}</li>
        <li>${isEnglish ? 'Production line integration' : '生产线集成'}</li>
        <li>${isEnglish ? 'Precision measurement applications' : '精密测量应用'}</li>
      </ul>
    `,
    reviews: [],
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate(isEnglish ? '/en' : '/')} className="hover:text-slate-700">{isEnglish ? 'Home' : '首页'}</button>
            <ChevronRight size={16} />
            <button onClick={() => navigate(isEnglish ? '/en/mall' : '/mall')} className="hover:text-slate-700">{isEnglish ? 'Marketplace' : '商城'}</button>
            <ChevronRight size={16} />
            <span className="text-gray-900">{isEnglish ? 'Product Details' : '商品详情'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-slate-700 mb-4"
        >
          <ArrowLeft size={20} />
          {isEnglish ? 'Back' : '返回'}
        </button>

        {/* Product Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  src={getImagePath(product.images[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-slate-700' : 'border-transparent hover:border-gray-300'
                      }`}
                  >
                    <img src={getImagePath(img)} alt="" className="w-full h-full object-cover" onError={handleImageError} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.subtitle}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                  <span className="ml-2 text-gray-900 font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{product.reviewCount} {isEnglish ? 'reviews' : '评价'}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{isEnglish ? 'Sold' : '已售'} {product.sales}</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <div className="text-slate-700 font-bold">
                    <span className="text-lg">¥</span>
                    <span className="text-4xl">{product.price.toLocaleString()}</span>
                  </div>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-400 line-through text-lg">¥{product.originalPrice.toLocaleString()}</span>
                    </>
                  )}
                </div>
                <div className="text-sm text-slate-800 font-medium flex items-center gap-1"><Lightbulb size={14} />{isEnglish ? 'Reference price, contact supplier for actual pricing' : '参考价格,实际价格请联系供应商议价'}</div>
                <div className="text-xs text-gray-600 mt-1">{isEnglish ? 'Bulk discounts and customization available' : '支持批量采购优惠、定制服务'}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {product.serviceFeatures.map((feature, idx) => (
                  <div key={idx} className="text-center">
                    <feature.icon className="mx-auto mb-2 text-slate-700" size={24} />
                    <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                    <div className="text-xs text-gray-500">{feature.desc}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-600 w-20">{isEnglish ? 'Quantity' : '数量'}</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">{isEnglish ? `Stock: ${product.stock} units` : `库存:${product.stock}件`}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex-1 bg-slate-700 text-white py-4 rounded-lg hover:bg-slate-800 font-medium text-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle size={20} />
                    {isEnglish ? 'Contact Supplier' : '联系供应商'}
                  </button>
                  <button className="flex-1 border-2 border-slate-700 text-slate-700 py-4 rounded-lg hover:bg-slate-50 font-medium text-lg flex items-center justify-center gap-2 transition-colors">
                    <Phone size={20} />
                    {isEnglish ? 'Phone Inquiry' : '电话咨询'}
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`border-2 p-4 rounded-lg transition-colors ${isFavorited ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Heart size={20} className={isFavorited ? 'fill-red-500' : ''} />
                  </button>
                </div>
              </div>

              {/* Supplier Info */}
              <div className="border-t pt-6">
                <div
                  onClick={() => navigate(isEnglish ? `/en/supplier/${product.supplier.id}` : `/supplier/${product.supplier.id}`)}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-all"
                >
                  <img src={product.supplier.logo} alt={product.supplier.name} className="w-16 h-16 rounded-lg" />
                  <div className="flex-grow">
                    <div className="font-bold text-gray-900 mb-1">{product.supplier.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{product.supplier.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⭐ {product.supplier.rating}</span>
                      <span>{isEnglish ? `${product.supplier.years} years in business` : `经营${product.supplier.years}年`}</span>
                      <span>{product.supplier.location}</span>
                    </div>
                  </div>
                  <div className="text-slate-700 flex items-center gap-1">
                    {isEnglish ? 'Visit Store' : '进店逛逛'}
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="border-b">
            <div className="flex">
              {['detail', 'specs', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium transition-all ${activeTab === tab
                      ? 'text-slate-700 border-b-2 border-slate-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab === 'detail' && (isEnglish ? 'Details' : '商品详情')}
                  {tab === 'specs' && (isEnglish ? 'Specifications' : '规格参数')}
                  {tab === 'reviews' && (isEnglish ? `Reviews (${commentCount})` : `用户评价 (${commentCount})`)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'detail' && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.detailDescription }} />
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="flex py-3 border-b">
                    <span className="text-gray-600 w-32">{spec.label}</span>
                    <span className="text-gray-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* 发表评论 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{isEnglish ? 'Write a Review' : '发表评价'}</h3>
                  {user ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">{isEnglish ? 'Rating:' : '评分：'}</span>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setNewRating(s)} className="focus:outline-none">
                            <Star size={20} className={s <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={isEnglish ? 'Share your experience with this product...' : '分享您对这款产品的使用体验...'}
                        className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={handleSubmitComment}
                          disabled={submittingComment || !newComment.trim()}
                          className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {submittingComment ? (isEnglish ? 'Submitting...' : '提交中...') : (isEnglish ? 'Submit Review' : '提交评价')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <button onClick={() => navigate('/login')} className="text-slate-700 hover:underline">{isEnglish ? 'Sign In' : '登录'}</button> {isEnglish ? 'to post a review' : '后可发表评论'}
                    </div>
                  )}
                </div>

                {/* 评论列表 */}
                {comments.length > 0 ? comments.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'U')}&background=random`}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{review.userName || (isEnglish ? 'Anonymous' : '匿名用户')}</div>
                            <div className="text-sm text-gray-500">{review.createTime?.substring(0, 10)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < (review.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                              ))}
                            </div>
                            {user && user.username === review.userName && (
                              <button onClick={() => handleDeleteComment(review.id)} className="text-xs text-red-500 hover:underline ml-2">{isEnglish ? 'Delete' : '删除'}</button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.content}</p>
                        {review.images && (
                          <div className="flex gap-2 mb-2">
                            {review.images.split(',').filter(Boolean).map((img, idx) => (
                              <img key={idx} src={img} alt="" className="w-16 h-16 rounded object-cover" />
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => commentApi.helpful(review.id).then(() => loadComments(commentPage))}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-slate-700"
                        >
                          <ThumbsUp size={14} /> {isEnglish ? 'Helpful' : '有用'} ({review.helpful || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-400 py-12">{isEnglish ? 'No reviews yet. Be the first!' : '暂无评价，快来写第一条评价吧！'}</div>
                )}

                {/* 评论分页 */}
                {commentTotalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    {Array.from({ length: commentTotalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => loadComments(p)}
                        className={`w-8 h-8 rounded text-sm ${commentPage === p ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{isEnglish ? 'Related Products' : '相关推荐'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? relatedProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(isEnglish ? `/en/product/${item.id}` : `/product/${item.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                  <img
                    src={getImagePath(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    onError={handleImageError}
                  />
                </div>
                <h3 className="text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-slate-700">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold">¥{Number(item.price || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{isEnglish ? 'Sold' : '已售'}{item.sales || 0}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-4 text-center text-gray-400 py-8">{isEnglish ? 'No related products' : '暂无相关推荐'}</div>
            )}
          </div>
        </div>
      </div>

      {/* Supplier Chat Dialog */}
      <SupplierChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        supplier={{
          id: product.supplier.id,
          name: product.supplier.name,
          logo: product.supplier.logo
        }}
      />
    </div>
  );
};

export default ProductDetail;
