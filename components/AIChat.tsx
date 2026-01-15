
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI, ChatMode } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; mode?: ChatMode }[]>([
    { role: 'ai', text: 'হ্যালো চ্যাম্পিয়ন! আজকে আমি তোমাকে কীভাবে সাহায্য করতে পারি? তুমি চাইলে আমার **Think Mode** ব্যবহার করে কঠিন অংক বা কোডিং সমাধান করে নিতে পারো! 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('pro');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMsg, mode);
      setMessages(prev => [...prev, { role: 'ai', text: response, mode }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'ওপস! ইন্টারনেটে একটু সমস্যা হচ্ছে। আবার চেষ্টা করবে কি?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in">
      {/* Header with Mode Selector */}
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-xl">🤖</div>
          <div>
            <h3 className="font-black text-slate-800">Shikkha AI Tutor</h3>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Powered by Gemini 3</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button onClick={() => setMode('fast')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'fast' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-400'}`}>⚡ Fast</button>
          <button onClick={() => setMode('pro')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'pro' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-400'}`}>💎 Pro</button>
          <button onClick={() => setMode('think')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'think' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-400'}`}>🧠 Think</button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-rose-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.role === 'ai' && msg.mode === 'think' && (
                <div className="text-[9px] font-black uppercase text-rose-500 mb-2 flex items-center">
                  <span className="mr-1">🧠</span> Deep Thinking Response
                </div>
              )}
              <MarkdownRenderer content={msg.text} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 p-5 rounded-3xl rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-50 flex space-x-3">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'think' ? "আপনার জটিল প্রশ্নটি এখানে লিখুন..." : "যেকোনো কিছু জিজ্ঞাসা করুন..."}
          className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 ring-rose-500/20 font-bold"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-rose-600 text-white px-8 rounded-2xl font-black shadow-lg shadow-rose-100 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          পাঠান
        </button>
      </form>
    </div>
  );
};

export default AIChat;
