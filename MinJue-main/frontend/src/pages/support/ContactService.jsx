import React from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Clock, MessageSquare } from 'lucide-react';

const ContactService = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{isEnglish ? 'Contact Us' : '联系客服'}</h1>
        <p className="text-gray-500">{isEnglish ? 'We are here to help' : '我们随时为您提供帮助'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{isEnglish ? 'Contact Info' : '联系方式'}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-700 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{isEnglish ? 'Support Email' : '客服邮箱'}</h3>
                  <p className="text-slate-700 font-bold text-lg mt-1">2478686497@qq.com</p>
                  <p className="text-gray-500 text-sm mt-1">{isEnglish ? 'Mon-Sun 9:00-18:00' : '周一至周日 9:00-18:00'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{isEnglish ? 'Business Email' : '商务邮箱'}</h3>
                  <p className="text-gray-600 mt-1">2696432359@qq.com</p>
                  <p className="text-gray-500 text-sm mt-1">{isEnglish ? 'Usually replies within 24h' : '通常在24小时内回复'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="text-slate-700" /> {isEnglish ? 'Send Message' : '在线留言'}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Your Name' : '您的姓名'}</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-slate-600 focus:border-slate-600" placeholder={isEnglish ? 'Enter your name' : '请输入姓名'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Phone' : '联系电话'}</label>
              <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-slate-600 focus:border-slate-600" placeholder={isEnglish ? 'Enter phone number' : '请输入手机号'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isEnglish ? 'Message' : '问题描述'}</label>
              <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-slate-600 focus:border-slate-600" placeholder={isEnglish ? 'Describe your issue in detail...' : '请详细描述您遇到的问题...'}></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
              {isEnglish ? 'Submit' : '提交留言'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactService;
