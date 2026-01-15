
import React, { useState } from 'react';

const ActivityCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'riddle' | 'game'>('riddle');
  const [points, setPoints] = useState(0);

  const riddles = [
    { q: "যত বেশি নেবে, ততই পেছনে ফেলে আসবে। জিনিসটা কী?", a: "পায়ের ছাপ" },
    { q: "সব সময় আসে, কিন্তু কখনো পৌঁছায় না। সেটা কী?", a: "আগামীকাল" },
    { q: "আমার কান আছে কিন্তু শুনতে পাই না। আমি কে?", a: "ভুট্টা" }
  ];

  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextRiddle = () => {
    setCurrentRiddle((prev) => (prev + 1) % riddles.length);
    setShowAnswer(false);
    setPoints(p => p + 10);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">অ্যাক্টিভিটি জোন 🎡</h2>
          <p className="text-gray-500 font-bold text-sm">পড়াশোনার ফাঁকে ব্রেইনকে একটু রিফ্রেশ করে নাও!</p>
        </div>
        <div className="bg-rose-50 px-4 py-2 rounded-2xl border-2 border-rose-100">
          <span className="text-rose-600 font-black text-xl">🔥 {points} BP</span>
        </div>
      </div>

      <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('riddle')}
          className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'riddle' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500'}`}
        >
          ধাঁধা (Riddle)
        </button>
        <button 
          onClick={() => setActiveTab('game')}
          className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'game' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500'}`}
        >
          মেমোরি বুস্টার 🧠
        </button>
      </div>

      {activeTab === 'riddle' ? (
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-center animate-in zoom-in duration-300">
          <div className="text-5xl mb-6">🤔</div>
          <h3 className="text-xl md:text-2xl font-black mb-8 leading-relaxed">"{riddles[currentRiddle].q}"</h3>
          
          {showAnswer ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-3xl mb-8 animate-in slide-in-from-bottom-4">
              <p className="text-sm font-bold uppercase mb-1">সঠিক উত্তর হলো:</p>
              <p className="text-2xl font-black">{riddles[currentRiddle].a}</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowAnswer(true)}
              className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition active:scale-95 mb-8"
            >
              উত্তর দেখো
            </button>
          )}

          <div className="flex justify-center">
            <button 
              onClick={nextRiddle}
              className="text-rose-600 font-black flex items-center space-x-2 hover:underline"
            >
              <span>পরবর্তী ধাঁধা</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[40px] shadow-xl border border-gray-100 text-center">
          <div className="text-6xl mb-6">🎮</div>
          <h3 className="text-2xl font-black mb-4">গেমটি শীঘ্রই আসছে...</h3>
          <p className="text-gray-500 font-bold mb-8">ততক্ষণ পর্যন্ত কুইজ দিয়ে তোমার জ্ঞান ঝালাই করে নাও!</p>
          <button className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-rose-100">কুইজ সেকশনে যাও</button>
        </div>
      )}
    </div>
  );
};

export default ActivityCenter;
