import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import { aiApi } from '../api/index';
import ReactMarkdown from 'react-markdown';

const AIAssistantFloat = ({ isOpen, onClose, isInline = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '您好！我是智能设备选择助手。我可以帮您：\n\n1. 根据应用场景推荐合适的设备\n2. 解答设备参数和性能问题\n3. 对比不同设备的优劣\n4. 提供选型建议和配置方案\n\n请告诉我您的需求，例如："我需要一台检测PCB板缺陷的设备"'
        }
      ]);
    }
  }, [isOpen]);

  const sendMessageToAI = async (userMessage) => {
    // 立即显示用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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

      // 只添加AI回复（用户消息已经添加了）
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('AI请求错误:', error);
      setMessages(prev => [...prev, 
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

  if (!isOpen) return null;

  // 如果是内联模式（商城页面），返回简化的内容区域
  if (isInline) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot size={14} className="text-slate-700" />
                    <span className="text-xs text-gray-500">AI助手</span>
                  </div>
                )}
                <div 
                  className={`rounded-2xl px-6 py-4 ${
                    msg.role === 'user' 
                      ? 'bg-slate-700 text-white rounded-br-none' 
                      : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-gray-900">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
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
              <div className="bg-white rounded-2xl rounded-bl-none px-6 py-4 flex items-center gap-2 shadow-sm">
                <Loader size={16} className="animate-spin text-slate-700" />
                <span className="text-sm text-gray-600">正在思考...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="描述您的设备需求，例如：我需要检测PCB板缺陷的设备..."
              className="flex-1 px-6 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 默认悬浮窗模式
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 悬浮窗 */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
          isMinimized 
            ? 'w-80 h-16' 
            : 'w-96 h-[600px]'
        } flex flex-col`}
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-slate-700 to-amber-600 text-white p-4 rounded-t-2xl flex items-center justify-between cursor-move">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot size={24} className="text-slate-700" />
            </div>
            {!isMinimized && (
              <div>
                <h3 className="font-bold text-sm">AI 设备选型助手</h3>
                <p className="text-xs text-slate-100">在线为您服务</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              title={isMinimized ? "展开" : "最小化"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button 
              onClick={onClose}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              title="关闭"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 消息区域 */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot size={14} className="text-slate-700" />
                        <span className="text-xs text-gray-500">AI助手</span>
                      </div>
                    )}
                    <div 
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-slate-700 text-white rounded-br-none' 
                          : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-gray-900">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
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
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                    <Loader size={16} className="animate-spin text-slate-700" />
                    <span className="text-sm text-gray-600">正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="描述您的设备需求..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-slate-700 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 悬浮触发按钮组件
export const AIAssistantButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-slate-700 to-amber-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
      title="打开AI助手"
    >
      <div className="relative">
        <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
      </div>
    </button>
  );
};

export default AIAssistantFloat;
