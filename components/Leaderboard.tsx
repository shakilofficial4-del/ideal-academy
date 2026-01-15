
import React, { useMemo } from 'react';
import { LeaderboardEntry, UserProfile } from '../types';

interface LeaderboardProps {
  currentUser: UserProfile;
  brandColor: string;
  onViewProfile: (entry: LeaderboardEntry) => void;
  allUsers: UserProfile[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, brandColor, onViewProfile, allUsers }) => {
  const leaderboardData = useMemo(() => {
    // Map database users to leaderboard entries
    const entries: LeaderboardEntry[] = allUsers.map(u => ({
      id: u.id,
      name: u.name,
      className: u.className,
      school: u.school,
      points: u.points,
      rank: 0,
      isCurrentUser: u.id === currentUser.id
    }));

    // Ensure at least some data exists for aesthetics
    if (entries.length < 3) {
      const mocks = [
        { id: 'm1', name: 'মাহিন চৌধুরী', className: 'Class 10', school: 'রাজউক উত্তরা', points: 15450, rank: 0 },
        { id: 'm2', name: 'সাদিয়া ইসলাম', className: 'Class 12', school: 'ভিকারুননিসা নূন', points: 14200, rank: 0 },
      ];
      mocks.forEach(m => {
        if (!entries.find(e => e.name === m.name)) entries.push(m);
      });
    }

    // Sort and Rank
    return entries
      .sort((a, b) => b.points - a.points)
      .map((user, idx) => ({ ...user, rank: idx + 1 }))
      .slice(0, 50);
  }, [allUsers, currentUser]);

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20 px-4 font-['Hind_Siliguri']">
      <header className="text-center space-y-2 pt-6">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">মেধা তালিকা 🏆</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">আইডিয়াল একাডেমির সেরা মেধাবীদের তালিকা</p>
      </header>

      {/* 🏅 PODIUM */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-10">
        {/* 2nd Place */}
        {topThree[1] && (
          <div onClick={() => onViewProfile(topThree[1])} className="cursor-pointer group flex flex-col items-center w-full md:w-48 transition-transform hover:scale-105 order-2 md:order-1">
             <div className="relative mb-4">
                <div className="w-24 h-24 rounded-[32px] border-8 border-slate-700 bg-slate-800 flex items-center justify-center text-4xl shadow-xl font-black text-white">
                  {topThree[1].name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-slate-400 text-white border-4 border-slate-900 flex items-center justify-center font-black">2</div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-3xl w-full text-center border border-slate-800 backdrop-blur-md">
                <p className="font-black text-xs text-white truncate">{topThree[1].name}</p>
                <p className="text-[10px] font-black text-slate-400 mt-1">{topThree[1].points} BP</p>
             </div>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div onClick={() => onViewProfile(topThree[0])} className="cursor-pointer group flex flex-col items-center w-full md:w-56 transition-transform hover:scale-105 order-1 md:order-2 z-10 md:-translate-y-8">
             <div className="relative mb-4">
                <div className="w-32 h-32 rounded-[40px] border-8 border-amber-500 bg-slate-800 flex items-center justify-center text-6xl shadow-2xl font-black text-white">
                  {topThree[0].name.charAt(0)}
                  <span className="absolute -top-8 text-4xl animate-bounce">👑</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-amber-500 text-white border-4 border-slate-900 flex items-center justify-center font-black text-xl">1</div>
             </div>
             <div className="bg-slate-900 p-6 rounded-[32px] w-full text-center shadow-2xl border border-amber-500/30">
                <p className="font-black text-white text-sm truncate">{topThree[0].name}</p>
                <p className="text-[10px] font-black text-amber-500 mt-2">{topThree[0].points} BP</p>
             </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div onClick={() => onViewProfile(topThree[2])} className="cursor-pointer group flex flex-col items-center w-full md:w-48 transition-transform hover:scale-105 order-3">
             <div className="relative mb-4">
                <div className="w-24 h-24 rounded-[32px] border-8 border-orange-700/50 bg-slate-800 flex items-center justify-center text-4xl shadow-xl font-black text-white">
                  {topThree[2].name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-orange-600 text-white border-4 border-slate-900 flex items-center justify-center font-black">3</div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-3xl w-full text-center border border-slate-800 backdrop-blur-md">
                <p className="font-black text-xs text-white truncate">{topThree[2].name}</p>
                <p className="text-[10px] font-black text-orange-400 mt-1">{topThree[2].points} BP</p>
             </div>
          </div>
        )}
      </div>

      {/* 📋 LIST (4+) */}
      <div className="bg-slate-900/50 rounded-[48px] shadow-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
        {restOfUsers.map((user) => (
          <div 
            key={user.id} 
            onClick={() => onViewProfile(user)}
            className={`p-6 flex items-center justify-between transition-all hover:bg-slate-800/50 cursor-pointer ${user.isCurrentUser ? 'bg-rose-500/5 border-l-4 border-rose-500' : ''}`}
          >
            <div className="flex items-center space-x-6">
              <span className="w-8 text-center font-black text-slate-600 text-sm">#{user.rank}</span>
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-rose-500 shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div>
                <h5 className={`font-black text-md ${user.isCurrentUser ? 'text-rose-500' : 'text-white'}`}>{user.name}</h5>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user.className} • {user.school}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-white">{user.points}</span>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">BP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
