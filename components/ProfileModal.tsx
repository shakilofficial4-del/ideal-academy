
import React from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  brandColor: string;
  onClose: () => void;
  onFollow: () => void;
  onSendRequest: () => void;
  enableMessaging: boolean;
  requestStatus?: 'pending' | 'accepted' | 'declined';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  currentTheme?: 'light' | 'dark';
  onLogout?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  profile, brandColor, onClose, onFollow, 
  onSendRequest, enableMessaging, requestStatus,
  onThemeChange, currentTheme, onLogout
}) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`${currentTheme === 'dark' ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-100'} w-full max-w-md rounded-[48px] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300 border`}>
        <button onClick={onClose} className={`absolute top-6 right-6 w-10 h-10 ${currentTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-full flex items-center justify-center font-black hover:scale-110 transition`}>×</button>
        
        <div className={`${currentTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} h-32 relative`}>
           <div style={{ backgroundColor: brandColor }} className="w-24 h-24 rounded-[32px] absolute -bottom-10 left-8 border-8 border-white dark:border-[#0F172A] flex items-center justify-center text-white text-4xl font-black italic shadow-xl">
             {profile.name.charAt(0)}
           </div>
        </div>

        <div className="p-8 pt-14 space-y-6">
           <div>
              <h2 className={`text-2xl font-black tracking-tighter ${currentTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profile.name}</h2>
              <p className="text-gray-400 font-bold text-sm uppercase">{profile.className} • {profile.school}</p>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className={`${currentTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} p-4 rounded-3xl text-center`}>
                 <p className={`text-xl font-black ${currentTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{profile.points}</p>
                 <p className="text-[9px] font-black text-gray-400 uppercase">পয়েন্ট</p>
              </div>
              <div className={`${currentTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} p-4 rounded-3xl text-center`}>
                 <p className="text-xl font-black text-rose-600">#{profile.rank}</p>
                 <p className="text-[9px] font-black text-gray-400 uppercase">র‍্যাঙ্ক</p>
              </div>
              <div className={`${currentTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} p-4 rounded-3xl text-center`}>
                 <p className={`text-xl font-black ${currentTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{profile.followersCount}</p>
                 <p className="text-[9px] font-black text-gray-400 uppercase">ফলোয়ার</p>
              </div>
           </div>

           {onThemeChange && (
             <div className="space-y-3">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">App Theme</h4>
               <div className={`flex p-1.5 rounded-2xl ${currentTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                 <button 
                   onClick={() => onThemeChange('light')}
                   className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${currentTheme === 'light' ? 'bg-white shadow-md text-rose-600' : 'text-slate-500'}`}
                 >
                   <span>☀️</span> <span>Day</span>
                 </button>
                 <button 
                   onClick={() => onThemeChange('dark')}
                   className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${currentTheme === 'dark' ? 'bg-rose-600 shadow-md text-white' : 'text-slate-500'}`}
                 >
                   <span>🌙</span> <span>Night</span>
                 </button>
               </div>
             </div>
           )}

           <div className="flex flex-col gap-3 pt-2">
              <div className="flex space-x-3">
                <button onClick={onFollow} className={`flex-1 py-4 rounded-2xl font-black transition-all ${profile.isFollowing ? 'bg-slate-100 text-slate-500' : 'bg-rose-600 text-white shadow-lg shadow-rose-900/10'}`}>
                  {profile.isFollowing ? 'আনফলো করো' : 'ফলো করো'}
                </button>
                {enableMessaging && profile.allowMessaging && (
                  <button disabled={requestStatus === 'pending' || requestStatus === 'accepted'} onClick={onSendRequest} className={`flex-1 py-4 rounded-2xl font-black shadow-lg transition-all ${requestStatus === 'accepted' ? 'bg-green-600 text-white' : requestStatus === 'pending' ? 'bg-amber-100 text-amber-600' : currentTheme === 'dark' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                    {requestStatus === 'accepted' ? 'মেসেজ বক্স ওপেন' : requestStatus === 'pending' ? 'অনুরোধ পাঠানো হয়েছে' : 'মেসেজ রিকোয়েস্ট'}
                  </button>
                )}
              </div>
              {onLogout && (
                <button onClick={onLogout} className="w-full py-4 rounded-2xl font-black border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  লগআউট করো 👋
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
