
import React, { useState, useRef } from 'react';
import { editImageWithAI } from '../services/geminiService';

const AIImageLab: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setImage(base64);
        setMimeType(file.type);
        setResultImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt.trim()) return;
    setLoading(true);
    try {
      const edited = await editImageWithAI(prompt, image, mimeType);
      if (edited) {
        setResultImage(edited);
      } else {
        alert("ইমেজ এডিট করতে সমস্যা হয়েছে। অন্য প্রম্পট চেষ্টা করুন।");
      }
    } catch (err) {
      alert("সার্ভার কানেকশন এরর!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-20 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black italic tracking-tighter">AI ইমেজ ল্যাব 🎨</h2>
        <p className="text-slate-400 font-bold text-sm">Nano Banana (Gemini 2.5) দিয়ে সহজেই ছবি এডিট করো</p>
      </div>

      <div className="bg-white dark:bg-[#0F172A] p-8 md:p-12 rounded-[48px] shadow-2xl border border-gray-100 dark:border-slate-800 space-y-8">
        <div className="flex flex-col items-center justify-center">
          {!resultImage ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square md:aspect-video rounded-[32px] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group"
            >
              <span className="text-6xl mb-4 group-hover:scale-125 transition-transform">🖼️</span>
              <p className="font-black text-slate-500">একটি ছবি আপলোড করো</p>
            </button>
          ) : (
            <div className="relative w-full rounded-[32px] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
              <img src={resultImage} alt="Preview" className="w-full h-auto" />
              <button 
                onClick={() => {setResultImage(null); setImage(null);}} 
                className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-rose-600 transition"
              >✕</button>
            </div>
          )}
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">কি পরিবর্তন করতে চাও?</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="উদা: 'Add a retro filter' বা 'Remove the background'" 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-rose-500 font-bold transition-all dark:text-white"
              />
              <button 
                onClick={handleEdit}
                disabled={loading || !image}
                className="bg-rose-600 text-white px-8 rounded-2xl font-black shadow-xl hover:scale-105 transition active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'এডিট করো ✨'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {['Retro Filter', 'Cartoon Style', 'HDR Lighting', 'Black and White', 'Remove Background'].map(tag => (
              <button 
                key={tag} 
                onClick={() => setPrompt(tag)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-500 hover:text-rose-500 transition"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageLab;
