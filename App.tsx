
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, AdminConfig, UserProfile, MessageRequest, ChatMessage, AuthMethod, ClassCategory, Subject, Lesson, LeaderboardEntry } from './types';
import { DEFAULT_SYSTEM_INSTRUCTION } from './services/geminiService';
import QuizModule from './components/QuizModule';
import AdminPanel from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import ProfileModal from './components/ProfileModal';
import MessagingView from './components/MessagingView';
import AIChat from './components/AIChat';
import LessonViewer from './components/LessonViewer';
import AIImageLab from './components/AIImageLab';
import { Database } from './services/db';

const INITIAL_CONFIG: AdminConfig = {
  appName: 'আইডিয়াল একাডেমি',
  appLogo: '🚀',
  brandColor: '#F43F5E',
  secondaryColor: '#0F172A',
  systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
  welcomeMessage: 'চলো আজকে সেরা ফলাফল করি!',
  messagingEnabled: true,
  rankingEnabled: true,
  authMethod: AuthMethod.PASSWORD,
  parentMobileMandatory: false,
  classes: [
    { 
      id: 'c6', title: 'Class 6', icon: '📝', 
      subjects: [
        { id: 's1', title: 'বিজ্ঞান', icon: '🔬', chapters: [
          { id: 'ch1', title: 'প্রথম অধ্যায়', lessons: [
            { id: 'l1', title: 'বৈজ্ঞানিক পদ্ধতি', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'বিজ্ঞানের প্রাথমিক ধারণা।' }
          ]}
        ]}
      ] 
    },
    { id: 'c7', title: 'Class 7', icon: '🎨', subjects: [] },
    { id: 'c8', title: 'Class 8', icon: '📐', subjects: [] },
    { id: 'c9', title: 'Class 9', icon: '🔭', subjects: [] },
    { id: 'c10', title: 'Class 10', icon: '📈', subjects: [] },
    { id: 'c11', title: 'Class 11', icon: '🧪', subjects: [] },
    { id: 'c12', title: 'Class 12', icon: '🧬', subjects: [] }
  ],
  courses: [],
  navIcons: { dashboard: '🏠', lesson: '📚', quiz: '📝', leaderboard: '🏆', messages: '💬', admin: '⚙️', ai: '🤖' }
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(INITIAL_CONFIG);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [view, setView] = useState<ViewMode>(ViewMode.CLASS_SELECTOR);
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedClass, setSelectedClass] = useState<ClassCategory | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [msgRequests, setMsgRequests] = useState<MessageRequest[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<UserProfile | null>(null);

  const [authName, setAuthName] = useState('');
  const [authMobile, setAuthMobile] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authClass, setAuthClass] = useState('Class 6');

  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const syncData = useCallback(async () => {
    const [savedSettings, savedUser, users, messages] = await Promise.all([
      Database.getSettings(),
      Database.getUserSession(),
      Database.getAllUsers(),
      Database.getMessages()
    ]);
    if (savedSettings) setAdminConfig(savedSettings);
    if (savedUser) {
      setUser(savedUser);
      setTheme(savedUser.theme || 'dark');
    }
    setAllUsers(users);
    setChatHistory(messages);
  }, []);

  useEffect(() => {
    const initApp = async () => {
      await Database.init(INITIAL_CONFIG);
      await syncData();
      setIsInitializing(false);
    };
    initApp();
  }, [syncData]);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8FAFC' : '#020617';
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (user) {
      const updatedUser = { ...user, theme: newTheme };
      setUser(updatedUser);
      await Database.saveUserSession(updatedUser);
    }
  };

  const handleAuth = async () => {
    if (!authMobile || !authPassword) return alert('মোবাইল ও পাসওয়ার্ড দিন!');
    
    setIsAuthProcessing(true);
    try {
      if (authMode === 'register') {
        if (!authName) return alert('আপনার নাম দিন!');
        const newUser: UserProfile = {
          id: 'u-' + Date.now(),
          name: authName,
          className: authClass,
          school: 'আইডিয়াল একাডেমি',
          studentMobile: authMobile,
          parentMobile: '',
          password: authPassword,
          points: 100, rank: 0, brainPower: 50, streak: 1, followersCount: 0, allowMessaging: true,
          theme: 'dark'
        };
        await Database.saveUserSession(newUser);
        setUser(newUser);
      } else {
        const loggedUser = await Database.login(authMobile, authPassword);
        if (loggedUser) {
          setUser(loggedUser);
          setTheme(loggedUser.theme || 'dark');
        } else {
          alert('মোবাইল বা পাসওয়ার্ড সঠিক নয়!');
          setIsAuthProcessing(false);
          return;
        }
      }
      
      await syncData();
      setView(ViewMode.CLASS_SELECTOR);
    } catch (error) {
      alert('সিস্টেম এরর! আবার চেষ্টা করুন।');
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleLogout = async () => {
    await Database.logout();
    setUser(null);
    setAuthMode('login');
    setSelectedProfile(null);
    setView(ViewMode.CLASS_SELECTOR);
  };

  const navigateToClass = async (cls: ClassCategory) => {
    setIsLoadingContent(true);
    const classes = await Database.getContentClasses();
    const refreshedCls = classes.find(c => c.id === cls.id) || cls;
    setSelectedClass(JSON.parse(JSON.stringify(refreshedCls)));
    setSelectedLesson(null);
    setView(ViewMode.CHAPTER_LIST);
    setIsLoadingContent(false);
  };

  const handleViewProfile = (entry: LeaderboardEntry | UserProfile) => {
    const userId = entry.id;
    const fullProfile = allUsers.find(u => u.id === userId);
    if (fullProfile) {
      setSelectedProfile(fullProfile);
    } else {
      const e = entry as LeaderboardEntry;
      setSelectedProfile({
        id: e.id, name: e.name, className: e.className, school: e.school, points: e.points, rank: e.rank,
        studentMobile: '', parentMobile: '', brainPower: 0, streak: 0, followersCount: 0, allowMessaging: true, theme: theme
      });
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-rose-500 font-black italic animate-pulse tracking-tighter uppercase text-xs">Ideal Academy Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Hind_Siliguri']">
        <div className="max-w-md w-full bg-[#0F172A] p-8 md:p-12 rounded-[56px] shadow-2xl border border-slate-800 animate-in zoom-in">
          <div style={{backgroundColor: adminConfig.brandColor}} className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 text-white shadow-xl shadow-rose-900/20">{adminConfig.appLogo}</div>
          <h2 className="text-2xl font-black mb-1 text-center text-white italic tracking-tighter">
            {authMode === 'login' ? 'আবার স্বাগতম!' : 'শুরু করো চ্যাম্পিয়ন!'} 🚀
          </h2>
          <p className="text-slate-400 font-bold mb-8 text-center text-sm italic">
            {authMode === 'login' ? 'আপনার একাউন্টে লগইন করুন' : 'পড়াশোনা হোক এখন আরও সহজ'}
          </p>
          <div className="space-y-4">
            {authMode === 'register' && (
              <input className="w-full bg-slate-800/50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 text-white outline-none transition-all" placeholder="আপনার নাম" value={authName} onChange={e => setAuthName(e.target.value)} />
            )}
            <input className="w-full bg-slate-800/50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 text-white outline-none transition-all" placeholder="মোবাইল নম্বর" maxLength={11} value={authMobile} onChange={e => setAuthMobile(e.target.value)} />
            {authMode === 'register' && (
              <select className="w-full bg-slate-800/50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 text-white outline-none transition-all" value={authClass} onChange={e => setAuthClass(e.target.value)}>
                {adminConfig.classes.map(c => <option key={c.id} value={c.title} className="bg-slate-900">{c.title}</option>)}
              </select>
            )}
            <input type="password" title="Password" className="w-full bg-slate-800/50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 text-white outline-none transition-all" placeholder="পাসওয়ার্ড" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
            
            <button 
              onClick={handleAuth} 
              disabled={isAuthProcessing}
              className="w-full py-5 rounded-3xl text-white font-black shadow-xl hover:brightness-110 transition-all active:scale-95 text-lg flex items-center justify-center" 
              style={{backgroundColor: adminConfig.brandColor}}
            >
              {isAuthProcessing ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (authMode === 'login' ? 'লগইন করো' : 'অ্যাকাউন্ট তৈরি করো')}
            </button>
            
            <p className="text-center text-slate-500 font-bold text-sm">
              {authMode === 'login' ? 'নতুন ইউজার?' : 'আগে থেকেই একাউন্ট আছে?'} 
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-rose-500 ml-2 hover:underline">
                {authMode === 'login' ? 'রেজিস্ট্রেশন করো' : 'লগইন করো'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} font-['Hind_Siliguri'] transition-colors duration-500 overflow-hidden`}>
      <header className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'bg-[#0F172A]/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-xl border-b sticky top-0 z-50`}>
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewMode.CLASS_SELECTOR)}>
          <div style={{backgroundColor: adminConfig.brandColor}} className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-md">{adminConfig.appLogo}</div>
          <h1 className="text-xl font-black italic tracking-tighter">{adminConfig.appName}</h1>
        </div>
        <div className="flex items-center space-x-4">
           {isLoadingContent && <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>}
           <button onClick={() => setView(ViewMode.IMAGE_EDITOR)} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${view === ViewMode.IMAGE_EDITOR ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}>🎨</button>
           <button onClick={() => setView(ViewMode.AI_CHAT)} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${view === ViewMode.AI_CHAT ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'}`}>🤖</button>
           <button onClick={() => handleViewProfile(user)} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>👤</button>
           <button onClick={() => setView(ViewMode.ADMIN)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${view === ViewMode.ADMIN ? 'bg-slate-600 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>⚙️</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 pb-36 no-scrollbar">
        {view === ViewMode.CLASS_SELECTOR && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10">
             <div className="text-center space-y-4 pt-10 px-4">
                <h2 className={`text-4xl md:text-6xl font-black italic tracking-tighter bg-gradient-to-r ${theme === 'dark' ? 'from-white to-slate-500' : 'from-slate-900 to-slate-500'} bg-clip-text text-transparent underline decoration-rose-500 underline-offset-8`}>তোমার ক্লাস বেছে নাও 🚀</h2>
                <p className="text-slate-400 font-bold max-w-lg mx-auto text-sm md:text-base italic">প্রতিটি ক্লাসের জন্য রয়েছে সেরা ভিডিও লেসন এবং কাস্টম কুইজ।</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4">
                {adminConfig.classes.map(cls => (
                  <button key={cls.id} onClick={() => navigateToClass(cls)} className={`group ${theme === 'dark' ? 'bg-[#0F172A] border-slate-800 shadow-slate-900/50' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'} p-8 md:p-12 rounded-[40px] md:rounded-[56px] border-2 hover:border-rose-500 shadow-xl transition-all hover:-translate-y-3 flex flex-col items-center`}>
                    <div className="text-6xl md:text-7xl mb-6 group-hover:scale-125 transition-transform duration-500">{cls.icon}</div>
                    <span className="font-black text-xl md:text-2xl italic tracking-tighter">{cls.title}</span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {view === ViewMode.CHAPTER_LIST && selectedClass && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right">
            <button onClick={() => setView(ViewMode.CLASS_SELECTOR)} className="flex items-center space-x-2 text-slate-400 hover:text-rose-500 font-bold transition">
              <span>← ফিরে যাও</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{selectedClass.icon}</div>
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter">{selectedClass.title}-এর সিলেবাস</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">সকল সাবজেক্ট এবং অধ্যায়সমূহ (Synced)</p>
              </div>
            </div>

            <div className="space-y-6">
              {selectedClass.subjects.length > 0 ? selectedClass.subjects.map(subject => (
                <div key={subject.id} className={`${theme === 'dark' ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-100 shadow-xl'} rounded-[40px] border overflow-hidden`}>
                   <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} p-6 flex items-center space-x-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className="text-2xl">{subject.icon}</div>
                      <h3 className="text-xl font-black tracking-tight">{subject.title}</h3>
                   </div>
                   <div className="p-6 space-y-6">
                      {subject.chapters.map(chapter => (
                        <div key={chapter.id} className="space-y-3">
                           <h4 className="text-rose-500 font-black uppercase text-[10px] tracking-[0.3em] ml-2 italic">{chapter.title}</h4>
                           <div className="grid grid-cols-1 gap-2">
                             {chapter.lessons.map(lesson => (
                               <button 
                                 key={lesson.id} 
                                 onClick={() => { setSelectedLesson(lesson); setView(ViewMode.LESSON_VIEWER); }}
                                 className={`w-full text-left p-4 ${theme === 'dark' ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} rounded-2xl flex items-center justify-between group transition-all`}
                               >
                                 <div className="flex items-center space-x-4">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-rose-500 font-black shadow-inner ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>▶</div>
                                   <span className="font-bold text-sm tracking-tight">{lesson.title}</span>
                                 </div>
                                 <span className="text-[10px] font-black text-slate-400 group-hover:text-rose-500 transition uppercase tracking-tighter">Watch Now</span>
                               </button>
                             ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )) : (
                <div className={`text-center py-24 rounded-[56px] border-2 border-dashed ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-slate-500 font-bold italic">এই ক্লাসের কন্টেন্ট শীঘ্রই ডাটাবেজে যোগ করা হবে। 🛠️</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === ViewMode.LESSON_VIEWER && selectedLesson && (
          <LessonViewer 
            lesson={selectedLesson} 
            onBack={() => setView(ViewMode.CHAPTER_LIST)} 
            onAskAI={() => setView(ViewMode.AI_CHAT)}
          />
        )}

        {view === ViewMode.AI_CHAT && <AIChat />}
        {view === ViewMode.IMAGE_EDITOR && <AIImageLab />}
        
        {view === ViewMode.MESSAGES && (
          <MessagingView 
            brandColor={adminConfig.brandColor}
            history={chatHistory}
            requests={msgRequests}
            activeChatUser={activeChatUser}
            onSelectUser={setActiveChatUser}
            onSendMessage={(receiverId, text) => {
              const newMsg: ChatMessage = { id: 'm-' + Date.now(), senderId: user.id, receiverId, text, timestamp: Date.now() };
              Database.sendMessage(newMsg);
              setChatHistory(prev => [...prev, newMsg]);
            }}
            onAcceptRequest={(id) => setMsgRequests(prev => prev.map(r => r.id === id ? {...r, status: 'accepted'} : r))}
            onDeclineRequest={(id) => setMsgRequests(prev => prev.filter(r => r.id !== id))}
            currentUser={user}
            enableMessaging={adminConfig.messagingEnabled}
            allUsers={allUsers}
          />
        )}
        {view === ViewMode.ADMIN && (
          <AdminPanel 
            config={adminConfig} 
            allUsers={allUsers} 
            onSave={async (newConfig) => { 
              setIsLoadingContent(true);
              await Database.saveSettings(newConfig); 
              setAdminConfig(newConfig); 
              await syncData();
              setView(ViewMode.CLASS_SELECTOR); 
              setIsLoadingContent(false);
            }} 
            onReset={() => {localStorage.clear(); window.location.reload();}} 
          />
        )}
        {view === ViewMode.QUIZ && <QuizModule onFinish={() => setView(ViewMode.CLASS_SELECTOR)} systemInstruction={adminConfig.systemInstruction} userName={user.name} />}
        {view === ViewMode.LEADERBOARD && <Leaderboard currentUser={user} brandColor={adminConfig.brandColor} onViewProfile={handleViewProfile} allUsers={allUsers} />}
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 h-24 ${theme === 'dark' ? 'bg-[#0F172A]/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-xl border-t px-6 flex items-center justify-around z-50`}>
         {[
           { id: ViewMode.CLASS_SELECTOR, label: 'হোম', icon: '🏠' },
           { id: ViewMode.LEADERBOARD, label: 'র‍্যাঙ্ক', icon: '🏆' },
           { id: ViewMode.AI_CHAT, label: 'AI টিউটর', icon: '🤖' },
           { id: ViewMode.QUIZ, label: 'কুইজ', icon: '📝' },
           { id: ViewMode.MESSAGES, label: 'মেসেজ', icon: '💬' }
         ].map(item => (
           <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center justify-center w-full py-2 transition-all active:scale-75 ${view === item.id ? '' : 'opacity-30'}`} style={{color: view === item.id ? adminConfig.brandColor : 'inherit'}}>
             <span className="text-2xl mb-1">{item.icon}</span>
             <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
           </button>
         ))}
      </nav>

      {selectedProfile && (
        <ProfileModal 
          profile={selectedProfile} 
          brandColor={adminConfig.brandColor} 
          onClose={() => setSelectedProfile(null)} 
          onFollow={() => {}} 
          onSendRequest={() => {}} 
          enableMessaging={adminConfig.messagingEnabled} 
          onThemeChange={toggleTheme}
          currentTheme={theme}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
