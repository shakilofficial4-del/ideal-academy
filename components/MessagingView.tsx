
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, MessageRequest } from '../types';

interface MessagingViewProps {
  brandColor: string;
  history: ChatMessage[];
  requests: MessageRequest[];
  activeChatUser: UserProfile | null;
  onSelectUser: (user: UserProfile | null) => void;
  onSendMessage: (receiverId: string, text: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  currentUser: { id: string; name: string };
  enableMessaging: boolean;
  allUsers: UserProfile[];
}

const MessagingView: React.FC<MessagingViewProps> = ({ 
  brandColor, history, requests, activeChatUser, 
  onSelectUser, onSendMessage, onAcceptRequest, 
  onDeclineRequest, currentUser, enableMessaging,
  allUsers
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'requests'>('inbox');
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, activeChatUser]);

  if (!enableMessaging) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-20 rounded-[40px] text-center shadow-xl border border-gray-100">
         <div className="text-6xl mb-6">🚫</div>
         <h3 className="text-2xl font-black text-slate-800">মেসেজিং বর্তমানে বন্ধ রয়েছে</h3>
         <p className="text-gray-400 font-bold mt-2">অ্যাডমিন এই ফিচারটি সাময়িকভাবে ডিজেবল করে রেখেছেন।</p>
      </div>
    );
  }

  // Pending incoming requests
  const pendingRequests = requests.filter(r => 
    r.receiverId === currentUser.id && r.status === 'pending'
  );

  // Users we can chat with (who sent us accepted requests or whose requests we accepted)
  // For the sake of the MVP, let's allow chatting with anyone who isn't us if messaging is enabled
  const inboxUsers = allUsers.filter(u => u.id !== currentUser.id);

  const currentMessages = activeChatUser 
    ? history.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === currentUser.id))
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeChatUser && inputText.trim()) {
      onSendMessage(activeChatUser.id, inputText);
      setInputText('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[600px] bg-white rounded-[40px] shadow-2xl border border-gray-100 flex overflow-hidden animate-in fade-in">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-50 flex flex-col bg-slate-50/20">
         <div className="p-6">
            <h3 className="text-xl font-black mb-6 text-slate-800">মেসেজ বক্স 💬</h3>
            <div className="flex bg-gray-100 p-1 rounded-2xl">
               <button 
                 onClick={() => setActiveTab('inbox')}
                 className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${activeTab === 'inbox' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400'}`}
               >
                 ইনবক্স {inboxUsers.length > 0 && `(${inboxUsers.length})`}
               </button>
               <button 
                 onClick={() => setActiveTab('requests')}
                 className={`flex-1 py-2.5 rounded-xl font-black text-xs transition relative ${activeTab === 'requests' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400'}`}
               >
                 অনুরোধ {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                 {pendingRequests.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />}
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {activeTab === 'inbox' ? (
              inboxUsers.length > 0 ? inboxUsers.map(user => (
                <button 
                  key={user.id} 
                  onClick={() => onSelectUser(user)}
                  className={`w-full p-4 rounded-2xl flex items-center space-x-3 transition-all ${activeChatUser?.id === user.id ? 'bg-white border border-rose-100 shadow-sm' : 'hover:bg-gray-100/50'}`}
                >
                  <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center font-black text-rose-600 shrink-0">{user.name.charAt(0)}</div>
                  <div className="text-left overflow-hidden">
                    <p className="font-black text-sm text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{user.className}</p>
                  </div>
                </button>
              )) : (
                <div className="text-center py-10 opacity-40">
                   <p className="text-xs font-bold">কোনো ইউজার নেই</p>
                </div>
              )
            ) : (
              pendingRequests.length > 0 ? pendingRequests.map(req => {
                const sender = allUsers.find(u => u.id === req.senderId);
                return (
                  <div key={req.id} className="p-4 bg-white border border-gray-100 rounded-2xl space-y-3">
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-xs">{sender?.name?.charAt(0) || req.senderName.charAt(0)}</div>
                        <div>
                           <p className="font-black text-xs text-slate-800">{sender?.name || req.senderName}</p>
                           <p className="text-[9px] font-bold text-gray-400">মেসেজ রিকোয়েস্ট</p>
                        </div>
                     </div>
                     <div className="flex space-x-2">
                        <button 
                          onClick={() => onAcceptRequest(req.id)}
                          className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-[10px] font-black"
                        >
                          গ্রহণ করো
                        </button>
                        <button 
                          onClick={() => onDeclineRequest(req.id)}
                          className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black"
                        >
                          মুছে দাও
                        </button>
                     </div>
                  </div>
                );
              }) : (
                <div className="text-center py-10 opacity-40">
                   <p className="text-xs font-bold">কোনো অনুরোধ নেই</p>
                </div>
              )
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {activeChatUser ? (
          <>
            <div className="p-6 bg-white border-b border-gray-50 flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-black">{activeChatUser.name.charAt(0)}</div>
                  <div>
                    <p className="font-black text-sm text-slate-800">{activeChatUser.name}</p>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">অনলাইন</span>
                  </div>
               </div>
               <button onClick={() => onSelectUser(null)} className="text-gray-400 hover:text-rose-500 transition font-black">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
               {currentMessages.map(msg => (
                 <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold shadow-sm ${msg.senderId === currentUser.id ? 'bg-rose-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-gray-100'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               <div ref={msgEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-50 flex space-x-3">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="কিছু লিখুন..." 
                 className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 ring-rose-500/20 font-bold text-sm text-slate-800" 
               />
               <button type="submit" style={{ backgroundColor: brandColor }} className="px-6 rounded-2xl text-white font-black text-sm hover:brightness-110 shadow-lg transition active:scale-95">পাঠান</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-4xl mb-6">💬</div>
            <h3 className="text-xl font-black text-slate-800">আপনার ইনবক্স</h3>
            <p className="text-gray-400 text-sm max-w-xs mt-2">অন্যান্য শিক্ষার্থীদের সাথে যোগাযোগ করতে বাম পাশ থেকে একটি চ্যাট সিলেক্ট করুন।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingView;
