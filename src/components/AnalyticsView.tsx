import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Calendar, Zap, Award, Target, Flame, HeartHandshake } from 'lucide-react';
import { UserState } from '../types';

interface AnalyticsProps {
  user: UserState;
}

export default function AnalyticsView({ user }: AnalyticsProps) {
  const barMax = Math.max(...user.weeklyProgress.map(w => w.xp));

  return (
    <div id="analytics-panel" className="space-y-6 text-left">
      
      {/* Analytics info header */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">MODULE 15</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 flex items-center gap-2 mt-0.5">
            <BarChart3 size={22} className="text-blue-600" />
            EVE Learning Analytics & Metrics
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Evaluate coding accuracy levels, interview prep progress metrics, and weekly activity points to estimated career ready rankings.
          </p>
        </div>
      </section>

      {/* Analytics Bento Cards layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed">
        
        {/* Core Career Readiness Score Gauge */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between text-center relative overflow-hidden">
          <div className="text-left mb-4">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">CAREER READY METRIC</span>
            <h4 className="font-heading font-extrabold text-slate-800 text-lg">Readiness index</h4>
          </div>

          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            {/* SVG Readiness Arc Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-100" cx="80" cy="80" fill="transparent" r="64" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-blue-600" 
                cx="80" 
                cy="80" 
                fill="transparent" 
                r="64" 
                stroke="currentColor" 
                strokeWidth="8"
                strokeDasharray="401.9"
                strokeDashoffset={401.9 - (401.9 * user.careerReadinessScore) / 100}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute text-center">
              <span className="font-heading font-black text-4xl text-slate-800">{user.careerReadinessScore}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">ESTIMATION</span>
            </div>
          </div>

          <p className="text-xs text-slate-450 text-slate-400 leading-normal mt-4 italic">
            You rank higher than 84% of candidates seeking junior software engineer positions this month.
          </p>
        </div>

        {/* Weekly Progress Bar Diagram */}
        <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between text-left">
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">ACTIVITY SUMMARY</span>
              <h4 className="font-heading font-extrabold text-slate-800 text-lg">Experience Points (Weekly)</h4>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
              1,320 XP Total
            </span>
          </div>

          {/* Simple HTML bar chart with labels */}
          <div className="flex justify-between items-end h-40 gap-4 pt-4 px-2 border-b border-slate-150 border-slate-100 pb-2">
            {user.weeklyProgress.map((w, index) => {
              const hPercent = (w.xp / barMax) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full flex justify-center group-hover:visible">
                    <span className="absolute bottom-2 scale-0 group-hover:scale-100 bg-slate-800 text-white font-mono text-[9px] font-bold py-1 px-1.5 rounded-md transition-all shadow-md z-20">
                      {w.xp}XP
                    </span>
                  </div>
                  <div 
                    className="w-full bg-blue-600/10 hover:bg-blue-600 rounded-t-lg transition-all duration-300 shadow-sm hover:shadow-blue-600/10" 
                    style={{ height: `${hPercent}%`, minHeight: '8%' }}
                  ></div>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">{w.day}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid statistics summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LEARNING TIMELINE', value: '45.8 hrs', desc: 'Active platform sessions', icon: Calendar, color: 'text-indigo-600' },
          { label: 'COMPILER ACCURACY', value: '94.2%', desc: 'Syntax/logic validation rate', icon: Zap, color: 'text-cyan-600' },
          { label: 'CHALLENGES ACED', value: '18 / 20', desc: 'Daily algorithms code submissions', icon: Target, color: 'text-purple-600' },
          { label: 'GUILD INFLUENCE', value: '+1,240', desc: 'Total community score additions', icon: HeartHandshake, color: 'text-green-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="font-heading font-black text-2xl text-slate-800">{stat.value}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{stat.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
