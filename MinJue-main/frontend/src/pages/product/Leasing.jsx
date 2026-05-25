import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Calendar, TrendingUp, Building2, Award, Clock, Star, FileText, AlertCircle, X, Check } from 'lucide-react';
import { leasingApi } from '../../api/product';
import { leasingApplicationApi } from '../../api/index';
import { useAuth } from '../../context/AuthContext';

const Leasing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('financing');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });

  // 租赁申请弹窗状态
  const [applyModal, setApplyModal] = useState({ visible: false, product: null });
  const [applyForm, setApplyForm] = useState({
    leasePeriod: 'MONTH',
    leaseDuration: 1,
    companyName: '',
    contactName: '',
    contactPhone: '',
    deliveryAddress: '',
    onsiteAddress: '',
    expectedStartDate: '',
    remark: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const closeApplyModal = useCallback(() => {
    setApplyModal({ visible: false, product: null });
  }, []);

  // 获取租赁设备列表
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leasingApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        type: activeTab,
        keyword: searchTerm,
      });
      setProducts(res?.records || []);
      setPagination(prev => ({ ...prev, total: res?.total || 0 }));
    } catch (error) {
      console.error('获取租赁设备失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, activeTab, searchTerm]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = () => setPagination(prev => ({ ...prev, current: 1 }));
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 打开租赁申请弹窗
  const openApplyModal = (product) => {
    if (!user) { navigate(isEnglish ? '/en/login' : '/login'); return; }
    setApplyForm({
      leasePeriod: product.type === 'operating' ? 'DAY' : 'MONTH',
      leaseDuration: 1,
      companyName: '',
      contactName: '',
      contactPhone: '',
      deliveryAddress: '',
      onsiteAddress: '',
      expectedStartDate: '',
      remark: ''
    });
    setApplyModal({ visible: true, product });
  };

  useEffect(() => {
    if (!applyModal.visible) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeApplyModal();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [applyModal.visible, closeApplyModal]);

  // 提交租赁申请
  const handleApplySubmit = async () => {
    if (!applyForm.companyName.trim()) { alert(isEnglish ? 'Please enter company name' : '请输入企业名称'); return; }
    if (!applyForm.contactName.trim()) { alert(isEnglish ? 'Please enter contact person' : '请输入联系人'); return; }
    if (!applyForm.contactPhone.trim()) { alert(isEnglish ? 'Please enter phone number' : '请输入联系电话'); return; }
    if (!applyForm.deliveryAddress.trim()) { alert(isEnglish ? 'Please enter delivery address' : '请输入配送地址'); return; }
    setSubmitting(true);
    try {
      const p = applyModal.product;
      let estimatedCost = 0;
      if (applyForm.leasePeriod === 'DAY') estimatedCost = (p.dailyPrice || 0) * applyForm.leaseDuration;
      else if (applyForm.leasePeriod === 'WEEK') estimatedCost = (p.weeklyPrice || 0) * applyForm.leaseDuration;
      else estimatedCost = (p.monthlyPrice || 0) * applyForm.leaseDuration;

      await leasingApplicationApi.apply({
        leasingId: p.id,
        leaseType: p.type === 'financing' ? 'FINANCIAL' : 'OPERATING',
        leasePeriod: applyForm.leasePeriod,
        leaseDuration: applyForm.leaseDuration,
        estimatedCost,
        companyName: applyForm.companyName,
        contactName: applyForm.contactName,
        contactPhone: applyForm.contactPhone,
        deliveryAddress: applyForm.deliveryAddress,
        onsiteAddress: applyForm.onsiteAddress,
        expectedStartDate: applyForm.expectedStartDate || null,
        remark: applyForm.remark,
      });
      alert(isEnglish ? 'Application submitted, pending review!' : '租赁申请已提交，请等待审核！');
      setApplyModal({ visible: false, product: null });
    } catch (e) {
      alert((isEnglish ? 'Submission failed: ' : '提交失败: ') + (e.message || (isEnglish ? 'Network error' : '网络错误')));
    } finally {
      setSubmitting(false);
    }
  };

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

  // 设备卡片组件
  const ProductCard = ({ product }) => {
    const isOffShelf = product.status === 0;
    const isRentedOut = product.inventoryStatus === 1;
    const isFinancing = product.type === 'financing';

    // 解析benefits和tags
    let benefits = [];
    let tags = [];
    try {
      benefits = typeof product.benefits === 'string' ? JSON.parse(product.benefits) : (product.benefits || []);
      tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : (product.tags || []);
    } catch { /* ignore */ }

    return (
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden group ${isOffShelf ? 'opacity-60' : 'cursor-pointer'}`}>
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${!isOffShelf && 'group-hover:scale-110'} transition-transform duration-300`} />
          {isOffShelf ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} /><span className="font-medium">{isEnglish ? 'Unavailable' : '设备已下架'}</span>
              </div>
            </div>
          ) : isRentedOut ? (
            <div className="absolute inset-0 bg-black bg-opacity-45 flex items-center justify-center">
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                {isEnglish ? 'Currently Rented' : '设备租赁中'}
              </div>
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">{isEnglish ? `Rented ${product.leased || 0} times` : `已租${product.leased || 0}次`}</div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-bold text-base line-clamp-2 flex-grow pr-2 ${isOffShelf ? 'text-gray-400' : 'text-gray-900 group-hover:text-slate-700'}`}>{product.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating || 4.8}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Building2 size={14} /><span>{product.supplier}</span>
          </div>

          {(product.warehouseAddress || product.deliveryAddress) && (
            <div className="mb-3 text-xs text-gray-500 line-clamp-2">
              {isEnglish ? 'Ships from:' : '发货地:'} {product.warehouseAddress || product.deliveryAddress}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className={`px-2 py-1 text-xs rounded-full ${isFinancing ? 'bg-slate-50 text-slate-800' : 'bg-green-50 text-green-700'}`}>{tag}</span>
            ))}
          </div>

          {isFinancing ? (
            <div className="border-t pt-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{isEnglish ? 'Monthly Rent' : '月租金'}</p>
                  <div className={`font-bold ${isOffShelf ? 'text-gray-400' : 'text-orange-600'}`}>
                    <span className="text-2xl">¥{Number(product.monthlyPrice).toLocaleString()}</span><span className="text-sm">{isEnglish ? '/mo' : '/月'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">{isEnglish ? 'Duration' : '租期'}</p>
                  <p className="text-sm font-semibold text-gray-700">{product.duration}</p>
                </div>
              </div>
              {product.totalPrice && <div className="text-xs text-gray-500 mb-3">{isEnglish ? 'Total Price:' : '设备总价:'} ¥{Number(product.totalPrice).toLocaleString()}</div>}
              <button disabled={isOffShelf || isRentedOut} onClick={() => !isOffShelf && !isRentedOut && openApplyModal(product)} className={`w-full py-2.5 rounded-lg font-medium transition-all ${isOffShelf || isRentedOut ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900'}`}>
                {isOffShelf ? (isEnglish ? 'Unavailable' : '暂不可租') : isRentedOut ? (isEnglish ? 'Rented' : '租赁中') : (isEnglish ? 'Lease Now' : '立即租赁')}
              </button>
            </div>
          ) : (
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div><p className="text-xs text-gray-500 mb-1">{isEnglish ? 'Daily' : '日租'}</p><p className={`text-sm font-bold ${isOffShelf ? 'text-gray-400' : 'text-orange-600'}`}>¥{product.dailyPrice}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">{isEnglish ? 'Weekly' : '周租'}</p><p className={`text-sm font-bold ${isOffShelf ? 'text-gray-400' : 'text-orange-600'}`}>¥{product.weeklyPrice}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">{isEnglish ? 'Monthly' : '月租'}</p><p className={`text-sm font-bold ${isOffShelf ? 'text-gray-400' : 'text-orange-600'}`}>¥{product.monthlyPrice}</p></div>
              </div>
              <button disabled={isOffShelf || isRentedOut} onClick={() => !isOffShelf && !isRentedOut && openApplyModal(product)} className={`w-full py-2.5 rounded-lg font-medium transition-all ${isOffShelf || isRentedOut ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'}`}>
                {isOffShelf ? (isEnglish ? 'Unavailable' : '暂不可租') : isRentedOut ? (isEnglish ? 'Rented' : '租赁中') : (isEnglish ? 'Lease Now' : '立即租赁')}
              </button>
            </div>
          )}

          {benefits.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit, idx) => (
                  <span key={idx} className="text-xs text-gray-500 flex items-center gap-1"><Check size={12} className="text-green-500" />{benefit}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const dialogBackdropStyle = {
    backdropFilter: 'blur(16px) saturate(120%)',
    WebkitBackdropFilter: 'blur(16px) saturate(120%)',
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 pt-8">
        <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2">
          <button onClick={() => handleTabChange('financing')} className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${activeTab === 'financing' ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center gap-2"><TrendingUp size={20} /><span>{isEnglish ? 'Financial Lease' : '融资租赁'}</span></div>
            <p className={`text-xs mt-1 ${activeTab === 'financing' ? 'text-slate-100' : 'text-gray-400'}`}>{isEnglish ? 'Long-term · Ownership · Tax Benefits' : '长期持有 · 设备归属 · 税收优惠'}</p>
          </button>
          <button onClick={() => handleTabChange('operating')} className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${activeTab === 'operating' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center gap-2"><Calendar size={20} /><span>{isEnglish ? 'Operating Lease' : '经营租赁'}</span></div>
            <p className={`text-xs mt-1 ${activeTab === 'operating' ? 'text-green-100' : 'text-gray-400'}`}>{isEnglish ? 'Flexible · Ready-to-use · No Purchase' : '灵活租期 · 即租即用 · 无需购置'}</p>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder={isEnglish ? `Search ${activeTab === 'financing' ? 'financial' : 'operating'} lease equipment...` : `搜索${activeTab === 'financing' ? '融资' : '经营'}租赁设备...`} className="w-full bg-gray-50 text-gray-900 rounded-lg py-3 pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <button onClick={handleSearch} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><Filter size={20} /><span className="hidden md:inline">{isEnglish ? 'Filter' : '筛选'}</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {activeTab === 'financing' ? (
            <>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center"><Award className="text-white" size={20} /></div><h3 className="font-bold text-gray-900">{isEnglish ? 'Equipment Ownership' : '设备所有权'}</h3></div>
                <p className="text-sm text-gray-600">{isEnglish ? 'Ownership transfers after lease term' : '租期结束后,设备所有权归您'}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center"><FileText className="text-white" size={20} /></div><h3 className="font-bold text-gray-900">{isEnglish ? 'Tax Benefits' : '税收优惠'}</h3></div>
                <p className="text-sm text-gray-600">{isEnglish ? 'Deductible lease payments' : '租金可抵扣,降低企业税负'}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center"><TrendingUp className="text-white" size={20} /></div><h3 className="font-bold text-gray-900">{isEnglish ? 'Fixed Asset' : '固定资产'}</h3></div>
                <p className="text-sm text-gray-600">{isEnglish ? 'Capitalize as fixed asset' : '计入固定资产,优化财务结构'}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"><Calendar className="text-white" size={20} /></div><h3 className="font-bold text-gray-900">{isEnglish ? 'Flexible Terms' : '灵活租期'}</h3></div>
                <p className="text-sm text-gray-600">{isEnglish ? 'Daily/Weekly/Monthly rental' : '按天/周/月租赁,随用随还'}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 border border-cyan-200">
                <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center"><Clock className="text-white" size={20} /></div><h3 className="font-bold text-gray-900">{isEnglish ? 'Fast Delivery' : '快速交付'}</h3></div>
                <p className="text-sm text-gray-600">{isEnglish ? 'Ships within 24 hours' : '24小时内快速发货配送'}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center"><Building2 className="text-white" size={20} /></div><h3 className="font-bold text-gray-900">{isEnglish ? 'Maintenance-free' : '免维护'}</h3></div>
                <p className="text-sm text-gray-600">{isEnglish ? 'Lessor handles maintenance' : '设备维护由出租方负责'}</p>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div><p className="mt-4 text-gray-500">{isEnglish ? 'Loading...' : '加载中...'}</p></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl"><p className="text-gray-500">{isEnglish ? 'No leasing equipment available' : '暂无租赁设备'}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {/* 分页 */}
        {pagination.total > pagination.pageSize && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">
              {isEnglish ? `Total ${pagination.total} items, Page ${pagination.current} of ${totalPages}` : <>共 <span className="font-medium text-gray-700">{pagination.total}</span> 条，第 <span className="font-medium text-gray-700">{pagination.current}</span> / {totalPages} 页</>}
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

      {/* 租赁申请弹窗 */}
      {applyModal.visible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-4"
          style={dialogBackdropStyle}
          onClick={closeApplyModal}
          role="dialog"
          aria-modal="true"
          aria-label={isEnglish ? 'Lease Application Form' : '租赁申请表单'}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/60 bg-white/95 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">{isEnglish ? 'Apply for Lease' : '申请租赁'}</h3>
              <button onClick={closeApplyModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* 设备信息 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{applyModal.product?.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {applyModal.product?.type === 'financing' ? (isEnglish ? 'Financial Lease' : '融资租赁') : (isEnglish ? 'Operating Lease' : '经营租赁')} · {applyModal.product?.supplier}
                </p>
                {applyModal.product?.warehouseAddress && (
                  <p className="text-sm text-gray-500 mt-1">{isEnglish ? 'Ships from:' : '发货地:'} {applyModal.product.warehouseAddress}</p>
                )}
              </div>

              {/* 租赁周期 */}
              {applyModal.product?.type !== 'financing' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Lease Period *' : '租赁周期 *'}</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={applyForm.leasePeriod}
                    onChange={e => setApplyForm(f => ({ ...f, leasePeriod: e.target.value }))}
                  >
                    <option value="DAY">{isEnglish ? 'By Day' : '按天'}</option>
                    <option value="WEEK">{isEnglish ? 'By Week' : '按周'}</option>
                    <option value="MONTH">{isEnglish ? 'By Month' : '按月'}</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEnglish ? `Lease Duration * (${applyForm.leasePeriod === 'DAY' ? 'days' : applyForm.leasePeriod === 'WEEK' ? 'weeks' : 'months'})` : `租赁时长 * (${applyForm.leasePeriod === 'DAY' ? '天' : applyForm.leasePeriod === 'WEEK' ? '周' : '月'})`}
                </label>
                <input
                  type="number" min="1"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={applyForm.leaseDuration}
                  onChange={e => setApplyForm(f => ({ ...f, leaseDuration: Math.max(1, parseInt(e.target.value) || 1) }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Company Name *' : '企业名称 *'}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder={isEnglish ? 'Enter company name' : '请输入企业名称'}
                  value={applyForm.companyName}
                  onChange={e => setApplyForm(f => ({ ...f, companyName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Contact Person *' : '联系人 *'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder={isEnglish ? 'Contact name' : '联系人姓名'}
                    value={applyForm.contactName}
                    onChange={e => setApplyForm(f => ({ ...f, contactName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Phone Number *' : '联系电话 *'}</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder={isEnglish ? 'Phone number' : '手机号码'}
                    value={applyForm.contactPhone}
                    onChange={e => setApplyForm(f => ({ ...f, contactPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Delivery Address *' : '配送地址 *'}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder={isEnglish ? 'Enter delivery address' : '请输入收货/配送地址'}
                  value={applyForm.deliveryAddress}
                  onChange={e => setApplyForm(f => ({ ...f, deliveryAddress: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Usage Address' : '使用地址'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder={isEnglish ? 'Equipment usage location' : '设备实际使用地点'}
                    value={applyForm.onsiteAddress}
                    onChange={e => setApplyForm(f => ({ ...f, onsiteAddress: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Expected Start Date' : '期望开始日期'}</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={applyForm.expectedStartDate}
                    onChange={e => setApplyForm(f => ({ ...f, expectedStartDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Remarks' : '备注'}</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows={3}
                  placeholder={isEnglish ? 'Other requirements (optional)' : '其他需求说明（可选）'}
                  value={applyForm.remark}
                  onChange={e => setApplyForm(f => ({ ...f, remark: e.target.value }))}
                />
              </div>

              {/* 预估费用 */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{isEnglish ? 'Estimated Cost' : '预估费用'}</p>
                <p className="text-2xl font-bold text-slate-700 mt-1">
                  ¥{(() => {
                    const p = applyModal.product;
                    let unit = p?.monthlyPrice || 0;
                    if (applyForm.leasePeriod === 'DAY') unit = p?.dailyPrice || 0;
                    else if (applyForm.leasePeriod === 'WEEK') unit = p?.weeklyPrice || 0;
                    return (Number(unit) * applyForm.leaseDuration).toLocaleString();
                  })()}
                </p>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={closeApplyModal}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {isEnglish ? 'Cancel' : '取消'}
              </button>
              <button
                onClick={handleApplySubmit}
                disabled={submitting}
                className="flex-1 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? (isEnglish ? 'Submitting...' : '提交中...') : (isEnglish ? 'Submit Application' : '提交申请')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leasing;
