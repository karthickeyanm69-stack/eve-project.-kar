import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bolt, Trophy, Target, Play, ChevronRight, MessageSquare, ArrowUpRight, Flame, HelpCircle } from 'lucide-react';
import { UserState, Course } from '../types';

interface DashboardProps {
  user: UserState;
  activeCourse: Course;
  onNavigate: (tab: 'home' | 'learn' | 'practice' | 'career' | 'profile') => void;
  onContinueCourse: () => void;
  onToggleGoal: (id: string) => void;
  goals: { id: string; text: string; done: boolean; reward: number; inProgress?: boolean }[];
}

export default function Dashboard({ user, activeCourse, onNavigate, onContinueCourse, onToggleGoal, goals }: DashboardProps) {
  const percentXp = Math.floor((user.xp / user.nextLevelXp) * 100);

  return (
    <div id="dashboard-hub" className="space-y-6">
      
      {/* EVE AI Mentor Top Box */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden transition-transform duration-300 hover:scale-[1.005]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-blue-100 overflow-hidden shadow-sm shadow-blue-100/50">
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLtJRRFclTLLvzIxnKDsf11JBGYzbR3pYae1VWrLTGayv94UrLxZ6Iy_eaB2MC41epXmpCNzViQwqqAVmqTVdmolMg0hsu1vK5Oess4ENmZqV9YTiWtIcRJIOxnjge3YB5YG0Exik9hkIcQMFv52BuCzkXdaHea9YBB3jLzAcTdOIpYnX3B3OS8bk0SuCdMr1LO593AzW6Ci8lqribKJop-ZI69w-tdXtqxc6PMsDXUv2XlFbrQWIGv2lM8"
              alt="Expressive AI Robot Tutor"
              className="w-14 h-14 object-contain animate-bounce"
            />
          </div>
          <div className="flex flex-col text-center sm:text-left">
            <span className="font-sans font-extrabold text-[10px] uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-md self-center sm:self-start">EVE AI SECURE MENTOR</span>
            <h2 className="font-heading font-black text-2xl text-slate-850 mt-2 tracking-tight">Ready to master Data Structures today, Ananya?</h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">Your performance in Arrays was 92% higher than average. Let's tackle Linked Lists next.</p>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <MessageSquare className="w-32 h-32 text-blue-600" />
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* User Level & XP Tracking Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-3xl text-white shadow-xl shadow-blue-900/10 flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-blue-200 tracking-widest uppercase block">CURRENT LEVEL</span>
              <span className="font-heading font-black text-4xl block mt-1">Level {user.level}</span>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-md">
              <Trophy size={24} className="text-yellow-300" />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-blue-100 font-bold">{user.xp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP</span>
              <span className="text-sm font-black text-white bg-blue-500/50 px-2.5 py-0.5 rounded-full">{percentXp}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div 
                className="h-full bg-cyan-300 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
                style={{ width: `${percentXp}%` }}
              ></div>
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-blue-100/90 uppercase tracking-wider text-center">{(user.nextLevelXp - user.xp).toLocaleString()} XP until next level mastery</p>
        </div>

        {/* Active Course: Python Fundamentals Progress */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between transition-transform duration-300 hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                <Bolt size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-heading font-black text-lg text-slate-800 leading-tight">{activeCourse.title}</h3>
                <span className="text-xs text-slate-400 font-bold block mt-1">Chapter 4: Advanced Data Types</span>
              </div>
            </div>

            {/* Circular Progress SVG */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-slate-100" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="5"></circle>
                <circle 
                  className="text-blue-600" 
                  cx="32" 
                  cy="32" 
                  fill="transparent" 
                  r="26" 
                  stroke="currentColor" 
                  strokeWidth="5"
                  strokeDasharray="163.3"
                  strokeDashoffset={163.3 - (163.3 * activeCourse.progress) / 100}
                ></circle>
              </svg>
              <span className="absolute text-xs font-black text-slate-800">{activeCourse.progress}%</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={14} /> 15m left
            </span>
            <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight size={14} /> Intermediate
            </span>
            <span className="bg-cyan-50 text-cyan-600 px-3 py-1.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-cyan-100/50">
              <Sparkles size={14} /> AI-Powered
            </span>
          </div>

          <button
            onClick={onContinueCourse}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-2xl mt-5 shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 transition-all active:translate-y-0.5 cursor-pointer"
          >
            Continue Learning
            <Play size={14} fill="currentColor" />
          </button>
        </div>

      </div>

      {/* Goal Checklists & Stat Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Today's Goal List */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              Today's Goal Challenge
            </h3>
            <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-100">
              {goals.filter(g => g.done).length} / {goals.length} Goals Complete
            </span>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => (
              <div 
                key={goal.id}
                onClick={() => onToggleGoal(goal.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  goal.done 
                    ? 'bg-blue-50/20 border-blue-200' 
                    : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  goal.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {goal.done && <span className="text-[10px] font-black">✓</span>}
                </div>
                <div className="flex-grow text-left">
                  <h4 className={`font-bold text-sm leading-tight ${goal.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {goal.text}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                    {goal.done ? `Completed · +${goal.reward} XP` : `In Progress · +${goal.reward} XP`}
                  </span>
                </div>
                {goal.inProgress && !goal.done && (
                  <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-cyan-400 animate-pulse w-1/3"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Stats Grid Counters */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50/20 p-6 rounded-3xl border border-purple-150 flex flex-col items-center justify-center text-center gap-2 transition-transform duration-350 hover:scale-[1.01]">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-600/10">
              <Trophy size={20} />
            </div>
            <span className="font-heading font-black text-4xl text-purple-700 mt-2">{user.badgesCount}</span>
            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Badges Earned</span>
          </div>

          <div className="bg-cyan-50/20 p-6 rounded-3xl border border-cyan-150 flex flex-col items-center justify-center text-center gap-2 transition-transform duration-350 hover:scale-[1.01]">
            <div className="w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Bolt size={20} />
            </div>
            <span className="font-heading font-black text-4xl text-cyan-600 mt-2">158</span>
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Lessons Finished</span>
          </div>

          <div className="col-span-2 bg-[#F1F5F9] p-6 rounded-3xl border border-slate-200 flex justify-between items-center transition-transform duration-350 hover:scale-[1.005]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold">
                <Flame size={20} className="fill-white" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-black text-lg text-slate-800 leading-tight">{user.streak} Day Active Streak</h4>
                <p className="text-xs text-slate-500 font-medium">Keep it up! Your next streak milestone releases premium custom badges.</p>
              </div>
            </div>
            <div className="h-2.5 w-24 bg-slate-200 rounded-full overflow-hidden shrink-0 max-sm:hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
