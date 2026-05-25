import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { procurementApi } from '../../api/index';
import { ArrowLeft, MapPin, Clock, Calendar, DollarSign, Package, FileText, Send } from 'lucide-react';

const ProcurementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({ price: '', message: '', contact: '' });

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await procurementApi.getDetail(id);
        setProcurement(data);
      } catch (e) {
        console.error('加载采购详情失败:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isEnglish ? 'Procurement Not Found' : '未找到采购信息'}</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-700 hover:underline"
          >
            {isEnglish ? 'Go Back' : '返回上一页'}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isEnglish ? 'Quote submitted successfully!' : '报价提交成功！');
    // Here you would typically send the data to a backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {isEnglish ? 'Back' : '返回'}
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {procurement.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {procurement.createTime ? `发布于 ${new Date(procurement.createTime).toLocaleDateString()}` : ''}
                  </span>
                  {procurement.contactName && (
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      联系人: {procurement.contactName}
                    </span>
                  )}
                </div>
              </div>
              <span className="inline-block bg-slate-50 text-slate-800 px-4 py-2 rounded-lg font-bold text-lg whitespace-nowrap">
                {isEnglish ? 'Open for Quotes' : '正在询价'}
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-slate-700" />
                  {isEnglish ? 'Requirements' : '采购需求'}
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 text-gray-700 leading-relaxed">
                  {procurement.description || '暂无详细描述'}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Send size={20} className="text-slate-700" />
                  {isEnglish ? 'Submit Quote' : '立即报价'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isEnglish ? 'Your Price (Estimated)' : '预估报价'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none"
                      placeholder={isEnglish ? 'e.g. $5000' : '例如：5000元'}
                      value={quoteForm.price}
                      onChange={e => setQuoteForm({ ...quoteForm, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isEnglish ? 'Contact Info' : '联系方式'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none"
                      placeholder={isEnglish ? 'Email or Phone' : '手机号或邮箱'}
                      value={quoteForm.contact}
                      onChange={e => setQuoteForm({ ...quoteForm, contact: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isEnglish ? 'Message' : '留言备注'}
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none h-32 resize-none"
                      placeholder={isEnglish ? 'Describe your offer...' : '请简要描述您的产品优势...'}
                      value={quoteForm.message}
                      onChange={e => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-700 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md"
                  >
                    {isEnglish ? 'Send Quote' : '提交报价'}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">{isEnglish ? 'Key Details' : '关键信息'}</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <Package size={16} /> 采购数量
                    </span>
                    <span className="font-medium text-gray-900">{procurement.quantity ? `${procurement.quantity}台` : '面议'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <DollarSign size={16} /> 预算范围
                    </span>
                    <span className="font-medium text-orange-600">
                      {procurement.budgetMin && procurement.budgetMax
                        ? `¥${Number(procurement.budgetMin).toLocaleString()} - ¥${Number(procurement.budgetMax).toLocaleString()}`
                        : '面议'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <Calendar size={16} /> 截止日期
                    </span>
                    <span className="font-medium text-red-600">{procurement.deadline || '未定'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">{isEnglish ? 'Safety Tips' : '安全提示'}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isEnglish
                    ? 'Please verify the buyer\'s identity before trading. Do not transfer money privately.'
                    : '交易前请务必核实采购方身份，切勿私下转账，建议使用平台担保交易。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementDetail;
