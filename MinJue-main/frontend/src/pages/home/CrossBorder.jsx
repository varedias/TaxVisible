import React from 'react';
import { Globe, Truck, ShieldCheck, CreditCard, ArrowRight, Package, Search } from 'lucide-react';

const CrossBorder = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amber-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              懂视帝跨境服务<br />
              <span className="text-amber-400">连接全球工业制造</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              一站式跨境工业设备交易解决方案，为您打通全球供应链，提供清关、物流、支付全流程服务。
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                立即入驻 <ArrowRight size={20} />
              </button>
              <button className="px-8 py-3 bg-white text-amber-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">核心服务</h2>
          <p className="text-gray-500">为您解决跨境贸易中的每一个痛点</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-6">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">全球寻源</h3>
            <p className="text-gray-500 leading-relaxed">
              覆盖欧美、日韩等20+国家和地区的优质工业设备供应商，帮您找到最合适的设备资源。
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">跨境物流</h3>
            <p className="text-gray-500 leading-relaxed">
              整合海运、空运、中欧班列等多种物流渠道，提供门到门的一站式物流解决方案。
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">合规保障</h3>
            <p className="text-gray-500 leading-relaxed">
              专业的关务团队，协助处理进出口报关、商检、认证等合规事宜，降低贸易风险。
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-amber-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">20+</div>
              <div className="text-gray-300">覆盖国家</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">5000+</div>
              <div className="text-gray-300">海外供应商</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">10亿+</div>
              <div className="text-gray-300">年交易额</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <div className="text-gray-300">合规保障</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">海外热销设备</h2>
          <button className="text-amber-600 font-medium hover:text-amber-600 flex items-center gap-1">
            查看全部 <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-48 bg-gray-100 relative">
                <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                  德国进口
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-amber-600">
                  高精度五轴加工中心
                </h3>
                <p className="text-sm text-gray-500 mb-3">Siemens 840D系统 | 20000rpm</p>
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold">询价</span>
                  <button className="p-2 bg-gray-50 rounded-full hover:bg-amber-50 text-gray-600 hover:text-amber-600">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrossBorder;
