import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Star, MessageCircle, Grid3x3, List, X, AlertCircle } from 'lucide-react';
import AIAssistantFloat from '../../components/AIAssistantFloat';
import { productApi } from '../../api/product';
import { LoadingSpinner, EmptyState } from '../../components/common/UIComponents';

const Mall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 数据状态
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });

  // 计算总页数
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pagination.current <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (pagination.current >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', pagination.current - 1, pagination.current, pagination.current + 1, '...', totalPages);
      }
    }
    return pages;
  };

  // 辅助函数：处理图片路径
  // 辅助函数：处理图片路径（Unsplash 在国内无法访问，替换为本地占位图）
  const getImagePath = (path) => {
    if (!path) return '/products/placeholder-product.svg';
    if (path.includes('unsplash.com')) return '/products/placeholder-product.svg';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  // 图片加载失败时的占位图
  const handleImageError = (e) => {
    e.target.src = '/products/placeholder-product.svg';
  };

  // 获取分类
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await productApi.getCategories();
      setCategories([{ id: 'all', name: isEnglish ? 'All Products' : '全部商品' }, ...(data || []).map(c => ({ id: c.id, name: c.name }))]);
    };
    fetchCategories();
  }, []);

  // 获取商品列表
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sortMap = { hot: null, sales: 'sales', 'price-low': 'price-low', 'price-high': 'price-high', newest: 'newest' };
      const res = await productApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        keyword: searchTerm,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortMap[sortBy],
      });
      setProducts(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
    } catch (error) {
      console.error('获取商品失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchTerm, selectedCategory, sortBy]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = () => setPagination(prev => ({ ...prev, current: 1 }));

  const sortOptions = [
    { id: 'hot', name: isEnglish ? 'Popular' : '综合排序' },
    { id: 'sales', name: isEnglish ? 'Best Selling' : '销量优先' },
    { id: 'price-low', name: isEnglish ? 'Price: Low to High' : '价格从低到高' },
    { id: 'price-high', name: isEnglish ? 'Price: High to Low' : '价格从高到低' },
    { id: 'newest', name: isEnglish ? 'Newest' : '最新上架' }
  ];

  // 商品卡片
  const ProductCard = ({ product }) => {
    const isOffShelf = product.status === 0;
    return (
      <div onClick={() => !isOffShelf && navigate(isEnglish ? `/en/product/${product.id}` : `/product/${product.id}`)} className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden group ${isOffShelf ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img src={getImagePath(product.image)} alt={product.name} className={`w-full h-full object-cover ${!isOffShelf && 'group-hover:scale-110'} transition-transform duration-300`} onError={handleImageError} />
          {isOffShelf && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} /><span className="font-medium">{isEnglish ? 'Discontinued' : '商品已下架'}</span>
              </div>
            </div>
          )}
          {!isOffShelf && product.sales > 1000 && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">{isEnglish ? 'Hot' : '热卖'}</div>}
          {!isOffShelf && <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">{isEnglish ? 'Free Shipping' : '包邮'}</div>}
          {!isOffShelf && <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"><button className="w-full bg-slate-700 bg-opacity-95 text-white py-2 rounded-lg text-sm font-medium">{isEnglish ? 'View Details' : '查看详情'}</button></div>}
        </div>
        <div className="p-4">
          <h3 className={`text-sm font-medium line-clamp-2 mb-2 min-h-[40px] ${isOffShelf ? 'text-gray-400' : 'text-gray-900 group-hover:text-slate-700'}`}>{product.name}</h3>
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /><span>4.9</span></div>
            <span>|</span><span>{isEnglish ? `Sold ${product.sales || 0}` : `已售${product.sales || 0}`}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className={`font-bold ${isOffShelf ? 'text-gray-400' : 'text-red-600'}`}><span className="text-xs">¥</span><span className="text-2xl">{Number(product.price).toLocaleString()}</span></div>
              {product.originalPrice && <div className="text-xs text-gray-400 line-through">¥{Number(product.originalPrice).toLocaleString()}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 pt-8">
        {isAIAssistantOpen && (
          <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden border-2 border-slate-200">
            <div className="bg-gradient-to-r from-slate-700 to-amber-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><MessageCircle size={24} className="text-slate-700" /></div>
                <div><h3 className="font-bold text-lg">{isEnglish ? 'AI Equipment Selection Assistant' : 'AI 设备选型助手'}</h3></div>
              </div>
              <button onClick={() => setIsAIAssistantOpen(false)} className="hover:bg-white hover:bg-opacity-20 rounded-full p-2"><X size={24} /></button>
            </div>
            <div className="h-96"><AIAssistantFloat isOpen={true} onClose={() => setIsAIAssistantOpen(false)} isInline={true} /></div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder={isEnglish ? 'Search product name, model, brand...' : '搜索商品名称、型号、品牌...'} className="w-full bg-gray-50 text-gray-900 rounded-lg py-3 pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <button onClick={handleSearch} className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium">{isEnglish ? 'Search' : '搜索'}</button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Filter size={18} />{isEnglish ? 'Categories' : '商品分类'}</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setPagination(p => ({ ...p, current: 1 })); }} className={`w-full text-left px-4 py-3 rounded-lg transition-all ${selectedCategory === cat.id ? 'bg-slate-50 text-slate-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {sortOptions.map((option) => (
                    <button key={option.id} onClick={() => { setSortBy(option.id); setPagination(p => ({ ...p, current: 1 })); }} className={`px-4 py-2 rounded-lg text-sm transition-all ${sortBy === option.id ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{option.name}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-100 text-slate-700' : 'text-gray-400 hover:bg-gray-100'}`}><Grid3x3 size={20} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-100 text-slate-700' : 'text-gray-400 hover:bg-gray-100'}`}><List size={20} /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text={isEnglish ? 'Loading products...' : '正在加载商品...'} />
            ) : products.length === 0 ? (
              <EmptyState title={isEnglish ? 'No products' : '暂无商品'} description={isEnglish ? 'Try another category or search term' : '试试其他分类或搜索关键词'} />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}

            {pagination.total > pagination.pageSize && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="text-sm text-gray-500">
                  {isEnglish
                    ? `Total ${pagination.total} items, Page ${pagination.current} of ${totalPages}`
                    : `共 ${pagination.total} 条，第 ${pagination.current} / ${totalPages} 页`}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPagination(p => ({ ...p, current: Math.max(1, p.current - 1) }))}
                    disabled={pagination.current === 1}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${pagination.current === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {isEnglish ? 'Previous' : '上一页'}
                  </button>
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && setPagination(p => ({ ...p, current: page }))}
                      disabled={page === '...'}
                      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                        page === pagination.current
                          ? 'bg-slate-700 text-white'
                          : page === '...'
                          ? 'text-gray-400 cursor-default'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagination(p => ({ ...p, current: Math.min(totalPages, p.current + 1) }))}
                    disabled={pagination.current === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${pagination.current === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {isEnglish ? 'Next' : '下一页'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isAIAssistantOpen && (
        <button onClick={() => setIsAIAssistantOpen(true)} className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-slate-700 to-amber-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all">
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default Mall;
