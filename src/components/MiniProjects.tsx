import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Folder, ArrowRight, CheckCircle, Award, Shield, FileCode, CheckSquare, Sparkles } from 'lucide-react';
import { MiniProject } from '../types';

interface MiniProjectsProps {
  projects: MiniProject[];
  onProjectDone: (xpEarned: number) => void;
}

export default function MiniProjects({ projects, onProjectDone }: MiniProjectsProps) {
  const [selectedProj, setSelectedProj] = useState<MiniProject | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleToggleCheck = (stepId: string) => {
    setChecks(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleVerifyProject = (projId: string) => {
    if (completedList.includes(projId)) return;
    setCompletedList(prev => [...prev, projId]);
    onProjectDone(300); // 300 XP
  };

  return (
    <div id="mini-projects-hub" className="space-y-6 text-left">
      
      {/* Banner */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">MODULE 9</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 flex items-center gap-2 mt-0.5">
            <Folder size={22} className="text-blue-600" />
            AI Mini-Projects Workspaces
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Integrate customized code utilities and compile portfolio items. Mark off tasks in sequence to generate verifiable achievement cards.
          </p>
        </div>
      </section>

      {!selectedProj ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const isDone = completedList.includes(proj.id);
            return (
              <div 
                key={proj.id}
                className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors"
                id={`project-card-${proj.id}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      proj.level === 'Beginner' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {proj.level} Path
                    </span>
                    {isDone && <CheckCircle className="text-green-600 shrink-0" size={20} />}
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-slate-800 mt-4">{proj.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">{proj.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">+300 XP Award</span>
                  <button
                    onClick={() => {
                      setSelectedProj(proj);
                      setChecks({});
                    }}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    Launch Roadmap
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <button 
                onClick={() => setSelectedProj(null)} 
                className="text-xs text-slate-405 font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider block mb-2"
              >
                ← Return to Projects
              </button>
              <h3 className="font-heading font-black text-2xl text-slate-800">{selectedProj.title}</h3>
            </div>
            <span className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {selectedProj.level}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
            
            {/* Guide Steps */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="font-bold text-xs text-slate-400 block tracking-wider uppercase">Project Roadmap Steps</span>
              
              <div className="space-y-2">
                {selectedProj.steps.map((step, sIdx) => {
                  const sId = `${selectedProj.id}-step-${sIdx}`;
                  const isChecked = checks[sId] || false;
                  return (
                    <div 
                      key={sIdx}
                      onClick={() => handleToggleCheck(sId)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isChecked ? 'bg-blue-50/20 border-blue-100' : 'bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <span className="text-[9px] font-black">✓</span>}
                      </div>
                      <span className={`text-xs font-semibold ${isChecked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Verified checklist block */}
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50">
                <h4 className="font-bold text-purple-800 text-sm flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600 animate-pulse" />
                  EVE Autonomous Evaluator
                </h4>
                <p className="text-xs text-purple-600 leading-relaxed mt-2">
                  Once all steps are configured, hit "Verify Implementation" to securely trigger local state matching or request automated Gemini grading.
                </p>
              </div>
            </div>

            {/* Template Starter Code View */}
            <div className="lg:col-span-5 flex flex-col gap-3 text-left">
              <span className="font-bold text-xs text-slate-404 text-slate-400 block tracking-wider uppercase">Starter Template Context</span>
              <div className="bg-slate-900 text-slate-300 rounded-3xl p-5 font-mono text-xs overflow-x-auto border-2 border-slate-800 flex-grow max-h-[300px]">
                <pre>{selectedProj.starterCode}</pre>
              </div>

              {checkedTotal(selectedProj, checks) ? (
                <button
                  onClick={() => handleVerifyProject(selectedProj.id)}
                  disabled={completedList.includes(selectedProj.id)}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    completedList.includes(selectedProj.id)
                      ? 'bg-green-100 text-green-700 border border-green-200 shadow-none'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10 active:translate-y-0.5'
                  }`}
                >
                  <Award size={18} />
                  <span>{completedList.includes(selectedProj.id) ? 'PORTFOLIO VERIFIED' : 'VERIFY IMPLEMENTATION'}</span>
                </button>
              ) : (
                <div className="bg-slate-50 text-slate-405 text-slate-400 text-xs p-4 rounded-2xl border border-slate-100 text-center italic">
                  Mark off all checklist tasks first to proceed with audit submissions.
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}

// Logic checks
function checkedTotal(proj: MiniProject, map: Record<string, boolean>) {
  return proj.steps.every((_, i) => map[`${proj.id}-step-${i}`] === true);
}
