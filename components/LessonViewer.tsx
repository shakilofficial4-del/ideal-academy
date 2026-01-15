
import React from 'react';
import { Lesson } from '../types';

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onAskAI: () => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack, onAskAI }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in duration-500">
      <div className="flex items-center justify-between">
         <button onClick={onBack} className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-700 transition flex items-center space-x-2">
            <span>← সিলেবাসে ফিরুন</span>
         </button>
         <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase text-slate-400">Recording Live Mode</span>
         </div>
      </div>

      <div className="relative aspect-video rounded-[48px] overflow-hidden shadow-2xl border-4 border-slate-800 bg-black">
         <iframe 
           src={lesson.videoUrl} 
           title={lesson.title} 
           className="w-full h-full"
           frameBorder="0" 
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
           allowFullScreen
         ></iframe>
      </div>

      <div className="bg-[#0F172A] p-10 rounded-[48px] border border-slate-800 shadow-xl space-y-4">
         <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl font-black italic text-white">{lesson.title}</h2>
            <div className="flex space-x-3">
               <button className="bg-rose-500 text-white p-4 rounded-2xl font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition">নোট সেভ করো</button>
               <button className="bg-slate-800 text-white p-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition">শেয়ার করো</button>
            </div>
         </div>
         <p className="text-slate-400 font-bold leading-relaxed">{lesson.description}</p>
         
         <div className="pt-6 mt-6 border-t border-slate-800">
            <div className="flex items-center justify-between p-6 bg-slate-900 rounded-3xl">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl">🎓</div>
                  <div>
                     <p className="font-black text-white">ইন্সট্রাক্টর: ShikkhaAI Team</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase">Expert in NCTB Curriculum</p>
                  </div>
               </div>
               <button onClick={onAskAI} className="text-rose-500 font-black text-sm hover:underline">প্রশ্ন করো (Ask AI) →</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LessonViewer;
