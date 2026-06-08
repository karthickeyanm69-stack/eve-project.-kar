import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Trophy, Lock, Sparkles, CheckCircle2, Shield, Calendar, Download, Eye, ChevronRight } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
  userName: string;
}

export default function AchievementsView({ achievements, userName }: AchievementsProps) {
  const [selectedCert, setSelectedCert] = useState<{ id: string; title: string; date: string } | null>(null);

  return (
    <div id="achievements-dashboard" className="space-y-6 text-left">
      
      {/* Achievements Info Box */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">MODULE 11</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 flex items-center gap-2 mt-0.5">
            <Trophy size={22} className="text-blue-600" />
            EVE Achievement Center
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Acquire experience points, unlock streak milestones, and export custom learning achievements to professional environments.
          </p>
        </div>
      </section>

      {/* Main achievements list and badges collection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
        
        {/* Left column: Achievements checklist */}
        <div className="lg:col-span-8 space-y-4">
          <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block">Progress Trackers</span>
          
          <div className="space-y-3">
            {achievements.map((ach) => {
              const isUnlocked = ach.progress >= ach.maxProgress;
              const barPercent = Math.min(100, Math.floor((ach.progress / ach.maxProgress) * 100));
              
              return (
                <div 
                  key={ach.id}
                  className={`p-4 bg-white rounded-2xl border transition-all flex items-center gap-4 ${
                    isUnlocked ? 'border-blue-200' : 'border-slate-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUnlocked ? 'bg-blue-105 bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-405 border border-slate-200 text-slate-400'
                  }`}>
                    {isUnlocked ? <Trophy size={20} className="fill-blue-50/20" /> : <Lock size={18} />}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-slate-800">{ach.title}</h4>
                        <p className="text-xs text-slate-450 text-slate-400 mt-0.5">{ach.description}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 shrink-0">
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    </div>

                    {/* Progress Slider */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-3 max-w-md">
                      <div 
                        className={`h-full rounded-full ${isUnlocked ? 'bg-blue-600' : 'bg-indigo-400'}`} 
                        style={{ width: `${barPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Certificate Generator cards */}
        <div className="lg:col-span-4 space-y-4 text-left">
          <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block">Syllabus Certificates</span>
          
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100/50 flex flex-col items-center justify-center text-center gap-2">
              <Award size={36} className="text-blue-600 animate-pulse" />
              <h4 className="font-heading font-extrabold text-sm mt-2">Verified Professional Credentials</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                You have completed lessons leading to Python Basics certification. Click to preview or publish details.
              </p>
            </div>

            <button
              onClick={() => setSelectedCert({
                id: 'cert-py-01',
                title: 'Python Fundamentals & Scripting',
                date: 'June 2026'
              })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Eye size={14} />
              PREVIEW EXPORT CERT
            </button>
          </div>
        </div>

      </div>

      {/* Elegant Modal: Certificate Preview signed by EVE AI Mentor */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-100 shadow-2xl relative"
            >
              {/* Certificate layout with borders */}
              <div className="m-6 p-8 border-4 border-double border-blue-600 rounded-2xl space-y-6 text-center relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
                  <Award className="w-96 h-96 text-blue-600" />
                </div>

                <div className="flex justify-center items-center gap-1">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center"><Sparkles size={16} /></div>
                  <span className="font-heading font-black text-lg text-blue-600">EVE CERTIFICATION OF MASTERY</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">THIS VERIFIABLE DOCUMENT IS AWARDED TO</span>
                  <h3 className="font-heading font-black text-3xl text-slate-800">{userName}</h3>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    for demonstrating complete intellectual and practical excellence in configuring variables, control scopes, compiler parameters, and automated logic structures of
                  </p>
                  <h4 className="font-heading font-extrabold text-lg text-slate-900 border-b border-dashed border-slate-200 pb-2">
                    {selectedCert.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold max-w-sm mx-auto">
                  <div className="text-left border-r border-slate-100 pr-4">
                    <span className="text-[10px] text-slate-400 block pb-1">COMPLETION STAMP:</span>
                    <span className="text-slate-700">{selectedCert.date}</span>
                  </div>
                  <div className="text-right pl-4">
                    <span className="text-[10px] text-slate-400 block pb-1">AI VERIFICATION KEY:</span>
                    <span className="font-mono text-[9px] text-blue-600">EVE-8402-FLSH83</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                  <span className="text-[10px] text-slate-405 text-slate-450 italic">Signed by EVE Corporate AI Mentor</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedCert(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors"
                    >
                      Close Window
                    </button>
                    <button 
                      onClick={() => alert("Verification credential exported successfully to profile page.")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Download size={12} />
                      Export Badge
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
