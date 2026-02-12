
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ngoda_chat_history');
    return saved ? JSON.parse(saved) : [
      { 
        role: 'assistant', 
        content: "Habari! I am the NGODA AI Assistant. How can I help you with your Artificial Intelligence journey today?", 
        timestamp: new Date().toLocaleTimeString() 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ngoda_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call Gemini API
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await getGeminiResponse(input, history);

    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initial = [{ 
        role: 'assistant' as const, 
        content: "Chat cleared. How can I help you today?", 
        timestamp: new Date().toLocaleTimeString() 
      }];
      setMessages(initial);
      localStorage.setItem('ngoda_chat_history', JSON.stringify(initial));
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold">NGODA AI Assistant</h3>
            <p className="text-xs text-blue-100 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Online & Ready to Help
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-lg transition text-blue-100 hover:text-white"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in zoom-in-95 duration-200`}
          >
            <div className={`max-w-[85%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white
                ${msg.role === 'user' ? 'bg-indigo-500 ml-2' : 'bg-blue-600 mr-2'}
              `}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`
                p-4 rounded-2xl shadow-sm text-sm
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-800 dark:text-gray-100 text-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700'}
              `}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700">
                <Loader2 size={16} className="animate-spin text-blue-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about AI..."
            className="w-full p-4 pr-16 bg-gray-100 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none dark:text-white"
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-500 mt-2">
          Powered by Gemini AI Technology &bull; NGODA AI School Assistant
        </p>
      </form>
    </div>
  );
};

export default Assistant;
