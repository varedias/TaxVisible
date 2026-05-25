import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Image as ImageIcon, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { messageApi } from '../api/index';
import { useAuth } from '../context/AuthContext';

const SupplierChatDialog = ({ isOpen, onClose, supplier }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const welcomeMessage = {
    id: 'welcome',
    text: `您好！欢迎咨询${supplier?.name || '我们'}，我是在线客服小王，请问有什么可以帮您？`,
    sender: 'supplier',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatar: supplier?.logo || 'https://ui-avatars.com/api/?name=CS&background=3B82F6&color=fff'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 打开对话时加载历史消息
  useEffect(() => {
    if (isOpen && supplier?.id) {
      setMessage('');
      setHistoryLoaded(false);
      loadHistory();
    }
  }, [isOpen, supplier]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const loadHistory = async () => {
    if (!user || !supplier?.id) {
      setMessages([welcomeMessage]);
      setHistoryLoaded(true);
      return;
    }
    try {
      const history = await messageApi.getHistory(supplier.id);
      if (history && history.length > 0) {
        const formatted = history.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.isFromSupplier ? 'supplier' : 'user',
          time: msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          avatar: msg.isFromSupplier
            ? (supplier?.logo || 'https://ui-avatars.com/api/?name=CS&background=3B82F6&color=fff')
            : 'https://ui-avatars.com/api/?name=User&background=10B981&color=fff',
        }));
        setMessages([welcomeMessage, ...formatted]);
        // 标记已读
        messageApi.markRead(supplier.id).catch(() => {});
      } else {
        setMessages([welcomeMessage]);
      }
    } catch (e) {
      console.error('加载聊天记录失败:', e);
      setMessages([welcomeMessage]);
    } finally {
      setHistoryLoaded(true);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      time: now,
      avatar: 'https://ui-avatars.com/api/?name=User&background=10B981&color=fff'
    };

    setMessages(prev => [...prev, userMessage]);
    const msgText = message;
    setMessage('');

    // 持久化到后端
    if (user && supplier?.id) {
      try {
        await messageApi.send({
          supplierId: supplier.id,
          content: msgText,
          messageType: 'TEXT',
        });
      } catch (e) {
        console.error('发送消息失败:', e);
      }
    }

    // 自动回复（模拟供应商在线客服）
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: getAutoReply(msgText),
        sender: 'supplier',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: supplier?.logo || 'https://ui-avatars.com/api/?name=CS&background=3B82F6&color=fff'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const getAutoReply = (userMsg) => {
    const msg = userMsg.toLowerCase();
    if (msg.includes('价格') || msg.includes('多少钱') || msg.includes('报价')) {
      return '关于价格，我们会根据您的采购数量提供最优惠的报价。请告诉我您的具体需求量，我马上为您核算。';
    } else if (msg.includes('参数') || msg.includes('规格') || msg.includes('性能')) {
      return '好的，我们的产品参数资料非常详细。稍后我会发送完整的技术参数文档给您，您也可以留下联系方式，我们的技术工程师会与您详细沟通。';
    } else if (msg.includes('质量') || msg.includes('认证') || msg.includes('保修')) {
      return '我们的产品都经过严格的质量检测，拥有ISO9001、CE等多项认证。提供1年免费保修，终身维护服务。';
    } else if (msg.includes('交货') || msg.includes('发货') || msg.includes('物流')) {
      return '常规产品我们都有现货，可以3-5个工作日内发货。定制产品根据具体需求，一般15-30天交货。全国包邮，物流信息实时跟踪。';
    } else if (msg.includes('样品') || msg.includes('试用') || msg.includes('测试')) {
      return '我们支持提供样品试用，您可以先测试效果再决定批量采购。样品费用后期批量订购可抵扣。';
    } else {
      return '收到您的问题了，我这边马上为您查询相关信息。您也可以直接拨打我们的服务热线，会有专业顾问为您详细解答。';
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileMessage = {
        id: Date.now(),
        text: `[文件] ${file.name}`,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://ui-avatars.com/api/?name=User&background=10B981&color=fff',
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // 模拟供应商回复
      setTimeout(() => {
        const reply = {
          id: Date.now() + 1,
          text: '收到您的文件了，我会尽快查看并回复您。',
          sender: 'supplier',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: supplier?.logo || 'https://ui-avatars.com/api/?name=CS&background=3B82F6&color=fff'
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  const quickReplies = [
    '请问产品价格？',
    '有技术参数资料吗？',
    '能提供样品吗？',
    '交货周期多久？'
  ];

  const handleQuickReply = (text) => {
    setMessage(text);
  };

  const dialogBackdropStyle = {
    backdropFilter: 'blur(16px) saturate(120%)',
    WebkitBackdropFilter: 'blur(16px) saturate(120%)',
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-4"
      style={dialogBackdropStyle}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="联系供应商"
    >
      <div
        className="w-full max-w-4xl h-[600px] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl border border-white/60 bg-white/95 shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={supplier?.logo || 'https://ui-avatars.com/api/?name=S&background=fff&color=3B82F6'}
              alt={supplier?.name}
              className="w-12 h-12 rounded-full bg-white p-1"
            />
            <div>
              <h3 className="font-bold text-lg">{supplier?.name || '供应商'}</h3>
              <p className="text-xs text-slate-100 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                在线
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <Phone size={20} />
            </button>
            <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <Video size={20} />
            </button>
            <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-slate-700 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                    } ${msg.isFile ? 'border-2 border-dashed border-gray-300' : ''}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-2">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="px-6 py-3 bg-white border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">快捷回复：</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1.5 text-sm bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 rounded-b-2xl">
          <form onSubmit={handleSend} className="flex items-end gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="text-gray-400 hover:text-slate-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="发送文件"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-slate-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="发送图片"
                >
                  <ImageIcon size={20} />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-slate-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="表情"
                >
                  <Smile size={20} />
                </button>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="输入消息... (Shift+Enter换行，Enter发送)"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent resize-none"
                rows="2"
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-slate-700 text-white p-3 rounded-xl hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0 self-end"
            >
              <Send size={20} />
            </button>
          </form>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierChatDialog;
