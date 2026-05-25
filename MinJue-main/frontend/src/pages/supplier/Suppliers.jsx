import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supplierApi } from '../../api/index';
import { Building2, Star, Clock, ShoppingCart, ShieldCheck, MapPin, Search } from 'lucide-react';
import AIAssistantFloat, { AIAssistantButton } from '../../components/AIAssistantFloat';
import { EmptyState, Pagination } from '../../components/common/UIComponents';
import SupplierChatDialog from '../../components/SupplierChatDialog';

const Suppliers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 辅助函数：处理图片路径（Unsplash 在国内无法访问）
  const getImagePath = (path) => {
    if (!path) return '/products/placeholder-supplier.svg';
    if (path.includes('unsplash.com')) return '/products/placeholder-supplier.svg';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  const handleImageError = (e) => {
    e.target.src = '/products/placeholder-supplier.svg';
  };

  const loadSuppliers = async (page = 1) => {
    setLoading(true);
    try {
      const data = await supplierApi.getList({ page, size: 10, keyword: searchKeyword || undefined });
      const records = data?.records || [];
      setSupplierList(records);
      setTotalPages(data?.pages || 1);
      setCurrentPage(page);
    } catch (e) {
      console.error('加载供应商失败:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers(1);
  }, []);

  const handleSearch = () => {
    loadSuppliers(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* 搜索栏 */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={isEnglish ? 'Search suppliers...' : '搜索供应商名称...'}
              className="w-full bg-white rounded-lg py-3 pl-11 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>
          <button onClick={handleSearch} className="bg-slate-700 text-white px-6 rounded-lg hover:bg-slate-800">
            {isEnglish ? 'Search' : '搜索'}
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white border rounded-xl p-6 animate-pulse flex gap-6">
                <div className="w-48 h-48 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : supplierList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {supplierList.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => navigate(isEnglish ? `/en/supplier/${supplier.id}` : `/supplier/${supplier.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-48 h-48 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                {supplier.logo ? (
                  <img src={getImagePath(supplier.logo)} alt={supplier.name} className="w-full h-full object-cover" onError={handleImageError} />
                ) : (
                  <Building2 size={48} className="text-gray-300" />
                )}
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-slate-700 transition-colors">
                    {supplier.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {supplier.isVerified === 1 && (
                      <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <ShieldCheck size={14} />
                        {isEnglish ? 'Verified' : '已认证'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {supplier.description || (isEnglish ? 'No description' : '暂无介绍')}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 size={16} className="text-slate-600" />
                    <span className="truncate">{supplier.name}</span>
                  </div>
                  {supplier.contactInfo && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{isEnglish ? 'Contact Available' : '联系方式已提供'}</span>
                    </div>
                  )}
                  {supplier.createTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <span>{isEnglish ? 'Since' : '入驻于'} {supplier.createTime.substring(0, 10)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSupplier({
                      id: supplier.id,
                      name: supplier.name,
                      logo: supplier.logo
                    });
                    setIsChatOpen(true);
                  }}
                  className="w-full bg-slate-700 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  {isEnglish ? 'Contact Now' : '立即联系'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(isEnglish ? `/en/supplier/${supplier.id}` : `/supplier/${supplier.id}`);
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:border-slate-700 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {isEnglish ? 'View Profile' : '查看详情'}
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <EmptyState icon={Building2} title={isEnglish ? 'No suppliers found' : '暂无供应商'} />
        )}

        {/* 分页 */}
        <Pagination current={currentPage} total={totalPages} onChange={loadSuppliers} />
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

      {/* Supplier Chat Dialog */}
      <SupplierChatDialog
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
      />
    </div>
  );
};

export default Suppliers;
