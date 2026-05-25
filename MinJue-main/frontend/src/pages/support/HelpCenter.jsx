import React from 'react';
import { useLocation } from 'react-router-dom';
import { HelpCircle, Book, MessageCircle, FileText } from 'lucide-react';

const HelpCenter = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  const faqs = isEnglish ? [
    { q: 'How do I register as a supplier?', a: 'Click "Open Store" or "Register" at the top, then select the supplier role to sign up.' },
    { q: 'How do I post a product?', a: 'After logging in, go to "Supplier Center" and click "Product Management" to publish a new item.' },
    { q: 'What is the transaction process?', a: 'Buyer inquiry -> Seller quote -> Mutual confirmation -> Contract signing -> Payment -> Shipping -> Acceptance.' },
    { q: 'What if I forget my password?', a: 'On the login page, click "Forgot Password" and recover via your registered phone number or email.' },
  ] : [
    { q: '如何注册成为供应商？', a: '点击顶部的"免费开店"或"免费注册"，选择供应商身份进行注册。' },
    { q: '如何发布商品？', a: '登录后进入"供应中心"，点击"商品管理"即可发布新商品。' },
    { q: '交易流程是怎样的？', a: '买家询盘 -> 卖家报价 -> 双方确认 -> 签订合同 -> 支付 -> 发货 -> 验收。' },
    { q: '忘记密码怎么办？', a: '在登录页面点击"忘记密码"，通过注册手机号或邮箱找回。' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{isEnglish ? 'Help Center' : '帮助中心'}</h1>
        <p className="text-gray-500">{isEnglish ? 'FAQs and Guides' : '常见问题解答与操作指南'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 mx-auto mb-4">
            <Book size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">{isEnglish ? 'Getting Started' : '新手指南'}</h3>
          <p className="text-gray-500 text-sm">{isEnglish ? 'Learn platform basics' : '了解平台基本功能和操作流程'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">{isEnglish ? 'FAQ' : '常见问题'}</h3>
          <p className="text-gray-500 text-sm">{isEnglish ? 'Troubleshoot common issues' : '解决使用过程中遇到的问题'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">{isEnglish ? 'Rules' : '规则中心'}</h3>
          <p className="text-gray-500 text-sm">{isEnglish ? 'Trading rules and violations' : '平台交易规则与违规处理'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <HelpCircle className="text-slate-700" /> {isEnglish ? 'FAQ' : '常见问题'}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <h3 className="font-medium text-gray-900 mb-2">Q: {faq.q}</h3>
              <p className="text-gray-600 text-sm">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
