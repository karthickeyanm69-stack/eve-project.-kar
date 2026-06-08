import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Users, Shield, Award, MessageCircle, Star, Plus } from 'lucide-react';
import { Guild } from '../types';

interface GuildsProps {
  initialGuilds: Guild[];
}

export default function GuildsView({ initialGuilds }: GuildsProps) {
  const [guilds, setGuilds] = useState<Guild[]>(initialGuilds);
  const activeGuild = guilds.find(g => g.joined) || guilds[0];
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      sender: 'Ananya Sharma',
      avatar: 'https://lh3.googleusercontent.com/aida/AP1WRLsaI4OAoQbQAxEYCS9faRJWp-5oE-KDaurFn6UQJhd_OLr3L2AUESaJ2CQcp03XWaDB-IJHY5LD5X-F4fy0XbU34bLo-4ng9yUDmbaljXLqLXhw7J-BtMEZRuU58LgclfrjNcpzv8qcSeZVXFnQanH66BYxfKTw_wjytwVQq2jKUndgjwOa0vFK6IX1XVE77c4IJPErmikgAYibo2c7zjwE2yf2OLjXheJn4yLHwEbhB5o2LNIUtUMY_AwA',
      text: inputText,
      timestamp: 'Just now'
    };
    
    setGuilds(prev => prev.map(g => {
      if (g.id === activeGuild.id) {
        return {
          ...g,
          messages: [...g.messages, newMessage]
        };
      }
      return g;
    }));
    setInputText('');
  };

  const handleJoinGuild = (guildId: string) => {
    setGuilds(prev => prev.map(g => {
      if (g.id === guildId) {
        return { ...g, joined: true, membersCount: g.membersCount + 1 };
      }
      // Leave previous joined for single join mockup
      if (g.joined) {
        return { ...g, joined: false, membersCount: g.membersCount - 1 };
      }
      return g;
    }));
  };

  return (
    <div id="guilds-community-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Sidebar: Explore/Join Guilds */}
      <aside className="lg:col-span-4 space-y-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <Users size={18} className="text-blue-600" />
              Community Guilds
            </h3>
            <button 
              onClick={() => alert("Creating custom guild models is locked behind Pro Level 6.")}
              className="text-blue-600 hover:text-blue-700 p-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              title="Create Guild"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {guilds.map((g) => (
              <div 
                key={g.id}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  g.joined 
                    ? 'bg-blue-50/20 border-blue-200' 
                    : 'bg-slate-50/50 hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md font-bold font-mono">
                      {g.tag}
                    </span>
                    <h4 className="font-heading font-extrabold text-sm text-slate-800 mt-1">{g.name}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono shrink-0">
                    {g.membersCount} / {g.maxMembers}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {g.description}
                </p>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100/50">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                    <Star size={12} fill="currentColor" />
                    <span>{g.totalXp.toLocaleString()} XP</span>
                  </div>
                  {g.joined ? (
                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                      ✓ Active Channel
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinGuild(g.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      Join Guild
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Column: Active Guild Chat Board */}
      <section className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-blue-600/10 shrink-0">
              {activeGuild.tag}
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-slate-800 text-sm tracking-tight">{activeGuild.name}</h4>
              <p className="text-xs text-slate-400">{activeGuild.membersCount} online coders sync</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Award size={12} /> Rank #1
            </span>
          </div>
        </div>

        {/* Channels stream list */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/10">
          {activeGuild.messages && activeGuild.messages.length > 0 ? (
            activeGuild.messages.map((message, idx) => (
              <div key={idx} className="flex gap-3 items-start max-w-[85%] text-left">
                <img 
                  src={message.avatar} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0 shrink-0" 
                />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-800">{message.sender}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{message.timestamp}</span>
                  </div>
                  <div className="bg-slate-100/50 p-3.5 rounded-2xl rounded-tl-none border border-slate-100 mt-1">
                    <p className="text-xs text-slate-700 leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              Channel is offline. Submit questions or notes beneath to ping members.
            </div>
          )}
        </div>

        {/* Input message footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-3 text-xs outline-none placeholder:text-slate-400"
            placeholder="Introduce yourself or share logs..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-3 rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            <Send size={14} />
          </button>
        </div>

      </section>

    </div>
  );
}
