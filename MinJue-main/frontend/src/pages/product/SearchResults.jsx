import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { productApi } from '../../api/product';
import { contentApi } from '../../api/index';
import { Search, ShoppingBag, FileText, ArrowRight, Filter } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  const [results, setResults] = useState({ products: [], content: [] });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);

  const getImagePath = (path) => {
    if (!path || path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return tags.split(',').map(t => t.trim()).filter(Boolean); }
  };

  useEffect(() => {
    if (!query) {
      setResults({ products: [], content: [] });
      return;
    }
    const loadResults = async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          productApi.getList({ page: 1, size: 20, keyword: query }).catch(() => ({ records: [] })),
          contentApi.getList({ page: 1, size: 20, keyword: query }).catch(() => ({ records: [] }))
        ]);
        setResults({
          products: pRes?.records || [],
          content: cRes?.records || []
        });
      } catch (e) {
        console.error('搜索失败:', e);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [query]);

  const totalResults = results.products.length + results.content.length;

  const ProductCard = ({ product }) => (
    <div
      onClick={() => navigate(isEnglish ? `/en/product/${product.id}` : `/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col"
    >
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        <img src={product.image} alt={isEnglish ? product.nameEn : product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
          {isEnglish ? product.nameEn : product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{isEnglish ? product.supplierEn : product.supplier}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-red-600 font-bold text-lg">¥{product.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">{product.sales} {isEnglish ? 'Sold' : '销量'}</span>
        </div>
      </div>
    </div>
  );

  const ContentCard = ({ item }) => {
    const tags = parseTags(item.tags);
    return (
      <div
        onClick={() => navigate(isEnglish ? `/en/content/${item.id}` : `/content/${item.id}`)}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer flex"
      >
        <div className="w-1/3 bg-gray-100 relative">
          <img src={getImagePath(item.cover)} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {item.type === 'video' ? (isEnglish ? 'Video' : '视频') : (isEnglish ? 'Article' : '文章')}
          </div>
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
              {item.titleEn && isEnglish ? item.titleEn : item.title}
            </h3>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{item.author}</span>
            <span>{(item.views || 0).toLocaleString()} {isEnglish ? 'Views' : '阅读'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isEnglish ? `Search Results for "${query}"` : `"${query}" 的搜索结果`}
          </h1>
          <p className="text-gray-500">
            {isEnglish ? `Found ${totalResults} results` : `共找到 ${totalResults} 个相关结果`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-2 font-medium text-sm transition-colors relative ${activeTab === 'all' ? 'text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isEnglish ? 'All Results' : '全部结果'}
            {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-700"></span>}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 font-medium text-sm transition-colors relative ${activeTab === 'products' ? 'text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isEnglish ? `Products (${results.products.length})` : `商品 (${results.products.length})`}
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-700"></span>}
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 px-2 font-medium text-sm transition-colors relative ${activeTab === 'content' ? 'text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isEnglish ? `Content (${results.content.length})` : `内容 (${results.content.length})`}
            {activeTab === 'content' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-700"></span>}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
            <p className="text-gray-500">{isEnglish ? 'Searching...' : '搜索中...'}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && totalResults === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isEnglish ? 'No results found' : '未找到相关结果'}
            </h3>
            <p className="text-gray-500">
              {isEnglish ? 'Try adjusting your search keywords' : '请尝试更换关键词重新搜索'}
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="space-y-8">
          {/* Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-slate-700" />
                  {isEnglish ? 'Products' : '相关商品'}
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Content Section */}
          {(activeTab === 'all' || activeTab === 'content') && results.content.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 mt-8">
                  <FileText size={20} className="text-green-600" />
                  {isEnglish ? 'Articles & Videos' : '相关内容'}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.content.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
