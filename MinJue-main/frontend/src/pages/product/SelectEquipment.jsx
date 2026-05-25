import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, ChevronRight, Tag, Send, Loader, X } from 'lucide-react';
import { aiApi } from '../../api/index';

const SelectEquipment = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const categories = [
    { name: 'AI视觉检测', count: 120 },
    { name: '工业相机', count: 145 },
    { name: '镜头光源', count: 132 },
    { name: '测量仪器', count: 89 },
    { name: '工业机器人', count: 67 },
    { name: '包装设备', count: 150 },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = () => {
    setShowChat(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '您好！我是智能设备选择助手。我可以帮您：\n\n1. 根据应用场景推荐合适的设备\n2. 解答设备参数和性能问题\n3. 对比不同设备的优劣\n4. 提供选型建议和配置方案\n\n请告诉我您的需求，例如："我需要一台检测PCB板缺陷的设备"'
        }
      ]);
    }
  };

  const sendMessageToAI = async (userMessage) => {
    setIsLoading(true);
    try {
      const allMessages = [
        {
          role: 'system',
          content: '你是一个专业的工业设备选型助手,专注于AI视觉检测设备、工业相机、镜头光源、测量仪器、工业机器人、包装设备等工业设备的推荐。你需要:\n1. 理解用户的应用场景和需求\n2. 推荐合适的设备类型和具体型号\n3. 解释设备参数和性能指标\n4. 提供专业的选型建议\n5. 回答要专业、精准、实用\n6. 适当时可以推荐具体品牌如海康威视、康耐视、基恩士、Basler等'
        },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userMessage }
      ];

      const data = await aiApi.chat(allMessages);
      const aiResponse = data.content;

      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('AI请求错误:', error);
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '抱歉,我现在遇到了一些问题。请稍后再试,或者直接浏览设备分类查找您需要的产品。' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    sendMessageToAI(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      {/* AI Assistant Banner */}
      <div className="bg-gradient-to-r from-slate-700 to-amber-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Bot size={28} />
              AI 选机助手
            </h1>
            <p className="text-slate-100 text-sm mb-4 max-w-xs">
              不知道选什么？告诉我您的需求，AI 帮您智能匹配最合适的设备。
            </p>
            <button 
              onClick={handleStartChat}
              className="bg-white text-slate-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <Sparkles size={16} />
              开始智能选机
            </button>
          </div>
          <div className="hidden md:block opacity-20">
            <Bot size={120} />
          </div>
        </div>
      </div>

      {/* AI Chat Interface */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-slate-700 to-amber-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold">AI 设备选型助手</h3>
                  <p className="text-xs text-slate-100">在线为您服务</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot size={16} className="text-slate-700" />
                        <span className="text-xs text-gray-500">AI助手</span>
                      </div>
                    )}
                    <div 
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-slate-700 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-500">您</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader size={16} className="animate-spin text-slate-700" />
                    <span className="text-sm text-gray-600">正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="描述您的设备需求..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-slate-700 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex">
          <button
            className={`flex-1 py-4 text-center font-medium text-sm ${activeTab === 'new' ? 'text-slate-700 border-b-2 border-slate-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('new')}
          >
            新设备
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium text-sm ${activeTab === 'used' ? 'text-slate-700 border-b-2 border-slate-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('used')}
          >
            二手设备
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="font-bold text-gray-800 mb-4">热门分类</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">{cat.name}</h3>
                <span className="text-xs text-gray-400">{cat.count} 款设备</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          ))}
        </div>

        <h2 className="font-bold text-gray-800 mt-8 mb-4">精选{activeTab === 'new' ? '新品' : '二手'}</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0"></div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">高性能工作站 {item}号</h3>
                  {activeTab === 'used' && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">95新</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  搭载最新处理器，适合3D渲染、视频剪辑等高负载工作...
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-red-500 font-bold">¥ 12,999</span>
                  <button className="text-slate-700 text-xs font-medium">查看详情</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectEquipment;