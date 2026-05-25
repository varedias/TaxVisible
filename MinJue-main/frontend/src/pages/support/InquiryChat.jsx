import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Paperclip, Image as ImageIcon } from 'lucide-react';

const InquiryChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '您好，我对贵公司的AI视觉检测系统很感兴趣，请问有详细参数吗？', sender: 'buyer', time: '10:30' },
    { id: 2, text: '您好！感谢您的咨询。这是我们的产品详细参数手册。', sender: 'me', time: '10:32' },
    { id: 3, text: '好的，我看一下。另外请问起订量是多少？', sender: 'buyer', time: '10:35' },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-white shadow-lg rounded-xl overflow-hidden my-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-gray-900">询盘 #{id} - 深圳**科技</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">● 在线</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          关联商品: AI视觉检测系统 VIS-2000
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.sender === 'me' 
                  ? 'bg-slate-700 text-white rounded-tr-none' 
                  : 'bg-white text-gray-900 shadow-sm rounded-tl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${msg.sender === 'me' ? 'text-slate-100' : 'text-gray-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex items-center gap-4">
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <Paperclip size={20} />
          </button>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-grow px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
          <button 
            type="submit" 
            className="bg-slate-700 text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryChat;
