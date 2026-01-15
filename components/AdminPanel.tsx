
import React, { useState } from 'react';
import { AdminConfig, AuthMethod, UserProfile, ClassCategory, Subject, Chapter, Lesson } from '../types';

interface AdminPanelProps {
  config: AdminConfig;
  allUsers: UserProfile[];
  onSave: (newConfig: AdminConfig) => void;
  onReset: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, allUsers, onSave, onReset }) => {
  const [localConfig, setLocalConfig] = useState<AdminConfig>(config);
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'content'>('content');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Form states for adding content
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');

  const handleSave = () => {
    onSave(localConfig);
    alert('অভিনন্দন! আপনার সকল কন্টেন্ট এবং সেটিংস সফলভাবে ডাটাবেজে সেভ হয়েছে। ✅');
  };

  const handleAddSubject = () => {
    if (!newSubjectTitle || !selectedClassId) return;
    const newConfig = { ...localConfig };
    const cls = newConfig.classes.find(c => c.id === selectedClassId);
    if (cls) {
      cls.subjects.push({ id: 's-' + Date.now(), title: newSubjectTitle, icon: '📚', chapters: [] });
      setLocalConfig({ ...newConfig });
      setNewSubjectTitle('');
    }
  };

  const handleAddChapter = (subjectId: string) => {
    if (!newChapterTitle || !selectedClassId) return;
    const newConfig = { ...localConfig };
    const cls = newConfig.classes.find(c => c.id === selectedClassId);
    const sub = cls?.subjects.find(s => s.id === subjectId);
    if (sub) {
      sub.chapters.push({ id: 'ch-' + Date.now(), title: newChapterTitle, lessons: [] });
      setLocalConfig({ ...newConfig });
      setNewChapterTitle('');
      setActiveSubjectId(null);
    }
  };

  const handleAddLesson = (subjectId: string, chapterId: string) => {
    if (!newLessonTitle || !newLessonVideo || !selectedClassId) return alert('টাইটেল এবং ভিডিও লিঙ্ক অবশ্যই দিতে হবে!');
    const newConfig = { ...localConfig };
    const cls = newConfig.classes.find(c => c.id === selectedClassId);
    const sub = cls?.subjects.find(s => s.id === subjectId);
    const ch = sub?.chapters.find(c => c.id === chapterId);
    if (ch) {
      ch.lessons.push({ 
        id: 'l-' + Date.now(), 
        title: newLessonTitle, 
        videoUrl: newLessonVideo, 
        description: newLessonDesc || 'এই লেসনের বিস্তারিত শীঘ্রই যোগ হবে।' 
      });
      setLocalConfig({ ...newConfig });
      setNewLessonTitle('');
      setNewLessonVideo('');
      setNewLessonDesc('');
      setActiveChapterId(null);
    }
  };

  const deleteSubject = (subId: string) => {
    if (!confirm('আপনি কি এই সাবজেক্টটি এবং এর সকল কন্টেন্ট ডিলিট করতে চান?')) return;
    const newConfig = { ...localConfig };
    const cls = newConfig.classes.find(c => c.id === selectedClassId);
    if (cls) {
      cls.subjects = cls.subjects.filter(s => s.id !== subId);
      setLocalConfig({ ...newConfig });
    }
  };

  const deleteChapter = (subjectId: string, chapterId: string) => {
    if (!confirm('আপনি কি এই অধ্যায়টি ডিলিট করতে চান?')) return;
    const newConfig = { ...localConfig };
    const cls = newConfig.classes.find(c => c.id === selectedClassId);
    const sub = cls?.subjects.find(s => s.id === subjectId);
    if (sub) {
      sub.chapters = sub.chapters.filter(ch => ch.id !== chapterId);
      setLocalConfig({ ...newConfig });
    }
  };

  const deleteLesson = (subjectId: string, chapterId: string, lessonId: string) => {
    if (!confirm('আপনি কি এই ভিডিও লেসনটি মুছে ফেলতে চান?')) return;
    const newConfig = { ...localConfig };
    const cls = newConfig.classes.find(c => c.id === selectedClassId);
    const sub = cls?.subjects.find(s => s.id === subjectId);
    const ch = sub?.chapters.find(c => c.id === chapterId);
    if (ch) {
      ch.lessons = ch.lessons.filter(l => l.id !== lessonId);
      setLocalConfig({ ...newConfig });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in pb-32 px-4 font-['Hind_Siliguri'] text-white">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-4xl font-black italic tracking-tighter">সিস্টেম অ্যাডমিন ⚙️</h2>
            <p className="text-slate-400 font-bold text-sm">অ্যাপের সকল কন্টেন্ট এবং সেটিংস কন্ট্রোল</p>
         </div>
         <div className="flex space-x-3">
            <button onClick={handleSave} className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition active:scale-95">সব সেভ করো</button>
            <button onClick={onReset} className="bg-slate-800 text-slate-400 px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-700 transition">রিসেট</button>
         </div>
      </header>

      <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-800">
         <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'content' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>📚 কন্টেন্ট ম্যানেজমেন্ট</button>
         <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'settings' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>🎨 অ্যাপ সেটিংস</button>
         <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'users' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>👥 ইউজার ডাটা</button>
      </div>

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-4">
              <h3 className="text-lg font-black italic flex items-center gap-2">
                <span>📍</span> ক্লাস লিস্ট
              </h3>
              {localConfig.classes.map(cls => (
                <button 
                  key={cls.id} 
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${selectedClassId === cls.id ? 'bg-slate-800 border-rose-500 shadow-lg shadow-rose-900/20' : 'bg-slate-900 border-transparent hover:bg-slate-800'}`}
                >
                  <span className="font-bold">{cls.icon} {cls.title}</span>
                  <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">{cls.subjects.length} Subjects</span>
                </button>
              ))}
           </div>

           <div className="md:col-span-2 bg-[#0F172A] p-8 rounded-[40px] border border-slate-800 min-h-[400px]">
              {selectedClassId ? (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                   <div className="bg-slate-900/50 p-6 rounded-3xl border border-dashed border-slate-700">
                      <h4 className="font-black text-sm mb-3 text-slate-300">নতুন সাবজেক্ট যোগ করুন</h4>
                      <div className="flex gap-2">
                        <input className="flex-1 bg-slate-800 p-3 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-rose-500 transition" placeholder="সাবজেক্টের নাম..." value={newSubjectTitle} onChange={e => setNewSubjectTitle(e.target.value)} />
                        <button onClick={handleAddSubject} className="bg-rose-600 px-6 rounded-xl font-black text-xs hover:brightness-110 active:scale-95 transition">যোগ করো</button>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      {localConfig.classes.find(c => c.id === selectedClassId)?.subjects.map(sub => (
                        <div key={sub.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
                           <div className="flex justify-between items-center">
                              <h4 className="font-black text-lg text-white">{sub.icon} {sub.title}</h4>
                              <div className="flex gap-3">
                                <button onClick={() => setActiveSubjectId(sub.id)} className="text-rose-500 text-xs font-black hover:underline">+ অধ্যায়</button>
                                <button onClick={() => deleteSubject(sub.id)} className="text-slate-500 text-xs font-black hover:text-rose-500">ডিলিট</button>
                              </div>
                           </div>
                           
                           {activeSubjectId === sub.id && (
                             <div className="p-4 bg-slate-800 rounded-2xl flex gap-2 animate-in slide-in-from-top-2">
                                <input className="flex-1 bg-slate-900 p-2 rounded-lg outline-none text-xs font-bold" placeholder="অধ্যায়ের নাম..." value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} />
                                <button onClick={() => handleAddChapter(sub.id)} className="bg-emerald-600 px-4 rounded-lg font-black text-[10px] hover:brightness-110">সেভ</button>
                                <button onClick={() => setActiveSubjectId(null)} className="text-slate-400 text-[10px] hover:text-white">বাতিল</button>
                             </div>
                           )}

                           <div className="space-y-4">
                              {sub.chapters.map(ch => (
                                <div key={ch.id} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700 space-y-3">
                                   <div className="flex justify-between items-center">
                                      <p className="font-bold text-sm text-slate-300 flex items-center gap-2">
                                        <span>📖</span> {ch.title}
                                      </p>
                                      <div className="flex gap-3">
                                        <button onClick={() => setActiveChapterId(ch.id)} className="text-emerald-500 text-[10px] font-black hover:underline">+ ভিডিও</button>
                                        <button onClick={() => deleteChapter(sub.id, ch.id)} className="text-slate-500 text-[10px] font-black hover:text-rose-500">মুছে দাও</button>
                                      </div>
                                   </div>

                                   {activeChapterId === ch.id && (
                                     <div className="bg-slate-900 p-4 rounded-xl space-y-3 animate-in slide-in-from-top-2 border border-emerald-500/30">
                                        <input className="w-full bg-slate-800 p-3 rounded-lg text-xs font-bold outline-none border border-transparent focus:border-emerald-500" placeholder="লেসন টাইটেল (যেমন: ১.১ ভূমিকা)" value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} />
                                        <input className="w-full bg-slate-800 p-3 rounded-lg text-xs font-bold outline-none border border-transparent focus:border-emerald-500" placeholder="ইউটিউব এমবেড লিঙ্ক (উদা: https://www.youtube.com/embed/...)" value={newLessonVideo} onChange={e => setNewLessonVideo(e.target.value)} />
                                        <textarea className="w-full bg-slate-800 p-3 rounded-lg text-xs font-bold outline-none border border-transparent focus:border-emerald-500" placeholder="লেসনের সংক্ষিপ্ত বিবরণ..." value={newLessonDesc} onChange={e => setNewLessonDesc(e.target.value)} />
                                        <div className="flex gap-2">
                                          <button onClick={() => handleAddLesson(sub.id, ch.id)} className="bg-emerald-600 flex-1 py-3 rounded-lg font-black text-xs hover:brightness-110 active:scale-95 transition">লেসন পাবলিশ করো 🚀</button>
                                          <button onClick={() => setActiveChapterId(null)} className="bg-slate-800 px-4 rounded-lg text-xs hover:text-white">বাতিল</button>
                                        </div>
                                     </div>
                                   )}

                                   <div className="grid grid-cols-1 gap-2">
                                      {ch.lessons.map(l => (
                                        <div key={l.id} className="p-3 bg-slate-900/80 rounded-xl text-[11px] flex justify-between items-center group hover:bg-slate-900 transition border border-transparent hover:border-slate-700">
                                           <div className="flex items-center gap-2 overflow-hidden">
                                              <span className="text-rose-500 shrink-0">▶</span>
                                              <span className="font-bold truncate">{l.title}</span>
                                           </div>
                                           <div className="flex items-center gap-3 shrink-0 ml-4">
                                              <span className="text-slate-500 text-[9px] hidden md:inline truncate max-w-[120px]">{l.videoUrl}</span>
                                              <button onClick={() => deleteLesson(sub.id, ch.id, l.id)} className="text-slate-600 hover:text-rose-500 font-black transition">✕</button>
                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                   <div className="text-6xl mb-4 animate-bounce">📚</div>
                   <p className="font-black italic text-center">কন্টেন্ট এডিট করতে বাম পাশ থেকে একটি ক্লাস সিলেক্ট করো।<br/>সবশেষে 'সব সেভ করো' বাটনে ক্লিক করতে ভুলবেন না!</p>
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95">
          <div className="bg-slate-900/50 p-8 rounded-[40px] shadow-sm border border-slate-800 space-y-6">
             <h3 className="text-xl font-black flex items-center gap-2">
                <span>🎨</span> সাধারণ সেটিংস
             </h3>
             <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">অ্যাপের নাম</label>
                   <input className="w-full bg-slate-800 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition" value={localConfig.appName} onChange={e => setLocalConfig({...localConfig, appName: e.target.value})} />
                </div>
                <div className="flex flex-col space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">ওয়েলকাম মেসেজ</label>
                   <textarea className="w-full bg-slate-800 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none h-24 transition" value={localConfig.welcomeMessage} onChange={e => setLocalConfig({...localConfig, welcomeMessage: e.target.value})} />
                </div>
             </div>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-[40px] shadow-sm border border-slate-800 space-y-6">
             <h3 className="text-xl font-black flex items-center gap-2">
                <span>💬</span> সোশ্যাল সেটিংস
             </h3>
             <div className="flex items-center justify-between p-6 bg-slate-800 rounded-3xl border border-slate-700">
                <div>
                   <span className="font-bold block text-sm">মেসেজিং সক্রিয়?</span>
                   <span className="text-[10px] text-slate-500 font-bold uppercase">Enable Peer Messaging</span>
                </div>
                <button onClick={() => setLocalConfig({...localConfig, messagingEnabled: !localConfig.messagingEnabled})} className={`w-14 h-8 rounded-full transition-all relative ${localConfig.messagingEnabled ? 'bg-rose-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localConfig.messagingEnabled ? 'left-7' : 'left-1 shadow-inner'}`} />
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-slate-900/50 p-10 rounded-[40px] shadow-sm border border-slate-800 space-y-8 animate-in fade-in">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic">নিবন্ধিত শিক্ষার্থী ({allUsers.length})</h3>
              <div className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full uppercase">Realtime Database</div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-800">
                       <th className="py-4 px-2">নাম</th>
                       <th className="py-4 px-2">শ্রেণী</th>
                       <th className="py-4 px-2">ফোন</th>
                       <th className="py-4 px-2 text-right">পয়েন্ট</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {allUsers.map(u => (
                      <tr key={u.id} className="text-sm font-bold hover:bg-slate-800/30 transition">
                         <td className="py-4 px-2 flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center text-[10px]">{u.name.charAt(0)}</div>
                            {u.name}
                         </td>
                         <td className="py-4 px-2 text-slate-400">{u.className}</td>
                         <td className="py-4 px-2 text-slate-400">{u.studentMobile}</td>
                         <td className="py-4 px-2 text-right text-rose-500">{u.points} BP</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
