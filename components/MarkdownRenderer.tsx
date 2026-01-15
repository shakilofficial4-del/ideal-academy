
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-6 text-lg leading-relaxed font-medium">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-3xl font-black text-rose-500 mt-10 mb-4 tracking-tight border-l-8 border-rose-500 pl-6 italic uppercase">
              {line.replace('## ', '')}
            </h2>
          );
        }
        
        // Sub-headers
        if (line.startsWith('### ')) {
          const text = line.replace('### ', '');
          
          // Special styling for Hacks/Danger
          if (text.includes('১০এমএস হ্যাকস') || text.includes('💡')) {
             return (
               <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 p-6 my-6 rounded-3xl animate-in zoom-in">
                  <h4 className="font-black text-emerald-500 flex items-center mb-1 text-sm uppercase tracking-widest">
                    <span className="mr-2 text-xl">💡</span> SMART HACK
                  </h4>
                  <p className="text-emerald-600 font-bold">{text.replace('💡', '').replace('১০এমএস হ্যাকস', '').trim()}</p>
               </div>
             );
          }
          
          if (text.includes('সাবধান') || text.includes('⚠️')) {
             return (
               <div key={idx} className="bg-rose-500/10 border border-rose-500/20 p-6 my-6 rounded-3xl animate-in zoom-in">
                  <h4 className="font-black text-rose-500 flex items-center mb-1 text-sm uppercase tracking-widest">
                    <span className="mr-2 text-xl">⚠️</span> DANGER ZONE
                  </h4>
                  <p className="text-rose-600 font-bold">{text.replace('⚠️', '').replace('সাবধান!', '').trim()}</p>
               </div>
             );
          }

          return (
            <h3 key={idx} className="text-xl font-black text-slate-800 dark:text-slate-200 mt-8 mb-3 uppercase tracking-wider">
              {text}
            </h3>
          );
        }

        // List Items
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start ml-2 group py-1">
              <span className="text-rose-500 mr-4 text-xl group-hover:scale-125 transition-transform">✦</span>
              <p className="text-slate-600 dark:text-slate-400 font-bold">{line.substring(2)}</p>
            </div>
          );
        }

        if (line.trim() === '') return <div key={idx} className="h-2" />;
        
        return (
          <p key={idx} className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
