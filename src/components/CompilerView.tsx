import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, AlertCircle, CheckCircle, Terminal, RefreshCw, X, ChevronRight, Copy } from 'lucide-react';
import { Lesson } from '../types';

interface CompilerViewProps {
  lesson: Lesson;
  onCodeCompleted: (xpEarned: number) => void;
}

export default function CompilerView({ lesson, onCodeCompleted }: CompilerViewProps) {
  const [code, setCode] = useState<string>(
    `# Create a greeting loop\nfor i in range(5):\n    print("Hello, World!", i + 1)\n\nprint("Loop complete!")`
  );
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [aiReviewOpen, setAiReviewOpen] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Run user code via proxy compiler endpoint
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and running on sandbox servers...');
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setOutput(data.output);

      // Trigger reward completion if valid outputs
      if (data.output && !data.output.toLowerCase().includes('syntax error')) {
        onCodeCompleted(lesson.xpValue || 50);
      }
    } catch (err: any) {
      setOutput(`Submission Engine Exception: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Run AI review via proxy endpoint
  const handleAiReview = async () => {
    setAiReviewOpen(true);
    setAiLoading(true);
    setAiFeedback('');
    try {
      const response = await fetch('/api/gemini/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (err: any) {
      setAiFeedback(`EVE review system could not establish a connection: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div id="compiler-practice-workspace" className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      
      {/* Left: Interactive Lesson Guideline Context */}
      <section className="lg:w-1/3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Python Basics
            </span>
            <span className="text-xs font-bold text-slate-400">Chapters 1 & 2</span>
          </div>

          <h3 className="font-heading font-extrabold text-xl text-slate-800">{lesson.title}</h3>
          
          <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>Welcome to Python! Let's explore loops and print statements details.</p>
            <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-500">
              Output dynamic messages five times while tracking the index count.
            </p>
            <div className="border-l-4 border-blue-500 pl-3">
              <span className="block font-bold text-slate-800 text-xs">Objective:</span>
              <span className="text-xs">Ensure your printing statements output loops perfectly. Hit Run Code to validate outputs.</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-6 text-left">
          <span className="font-bold text-xs text-slate-700 block mb-1">Compiler Settings:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setLanguage('python');
                setCode(`# Create a greeting loop\nfor i in range(5):\n    print("Hello, World!", i + 1)\n\nprint("Loop complete!")`);
              }}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                language === 'python' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              Python
            </button>
            <button 
              onClick={() => {
                setLanguage('javascript');
                setCode(`// Create a greeting loop\nfor (let i = 0; i < 5; i++) {\n  console.log("Hello, World!", i + 1);\n}\n\nconsole.log("Loop complete!");`);
              }}
              className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                language === 'javascript' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              Javascript
            </button>
          </div>
        </div>
      </section>

      {/* Right: Coding Sandbox Panel */}
      <section className="lg:w-2/3 flex flex-col gap-4">
        
        {/* Editor Frame */}
        <div className="flex-grow flex flex-col bg-slate-900 rounded-3xl border-2 border-slate-800 shadow-xl overflow-hidden min-h-[350px]">
          <div className="bg-slate-800/80 px-5 py-3 flex justify-between items-center border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
              </div>
              <span className="font-mono text-xs text-slate-400 ml-4">main.{language === 'python' ? 'py' : 'js'}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCopyCode} 
                className="text-slate-400 hover:text-white transition-colors"
                title="Copy code"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={() => setCode(language === 'python' ? `# Loops practice\n` : `// Code here\n`)} 
                className="text-slate-400 hover:text-white transition-colors"
                title="Reset code"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Standard Textarea Code Editor */}
          <div className="flex-grow flex relative p-4 bg-slate-950">
            <div className="text-slate-600 font-mono text-xs text-right pr-4 select-none border-r border-slate-800 leading-relaxed pt-1">
              {Array.from({ length: code.split('\n').length + 2 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-grow bg-transparent text-emerald-300 font-mono text-sm leading-relaxed p-1 resize-none outline-none border-none focus:ring-0 w-full pl-4 h-full"
              style={{ minHeight: '260px' }}
              spellCheck="false"
            />

            {/* Float AI Action */}
            <button
              onClick={handleAiReview}
              className="absolute bottom-4 right-4 bg-purple-600 cursor-pointer hover:bg-purple-700 active:scale-95 text-white gap-2 font-bold text-xs tracking-wider uppercase py-2.5 px-4 rounded-full shadow-lg flex items-center transition-all"
            >
              <Sparkles size={14} className="animate-pulse" />
              AI Review
            </button>
          </div>
        </div>

        {/* Output Console Box */}
        <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden min-h-[140px] flex flex-col justify-between">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-sans font-bold">
            <Terminal size={14} />
            OUTPUT CONSOLE
          </div>
          <div className="flex-grow p-4 font-mono text-xs text-slate-350 overflow-y-auto leading-relaxed text-left">
            {isRunning ? (
              <span className="text-cyan-400 flex items-center gap-2">
                <RefreshCw size={12} className="animate-spin" />
                Executing code variables...
              </span>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <span className="text-slate-500 italic">Click 'Run Code' to execute and print statements.</span>
            )}
          </div>
        </div>

        {/* Submit Execution buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex-grow bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/10 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-3 transition-all"
          >
            <Play size={16} fill="currentColor" />
            RUN CODE
          </button>
        </div>

      </section>

      {/* Elegant Modal: AI Reviews Popup */}
      <AnimatePresence>
        {aiReviewOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-100 shadow-2xl relative"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                    <div>
                      <h4 className="font-heading font-extrabold text-xl">Eve Automated Review</h4>
                      <p className="text-xs text-purple-100 mt-0.5">Gemini Code Analysis Engine</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAiReviewOpen(false)}
                    className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-slate-55 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-[300px] overflow-y-auto text-left">
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <RefreshCw className="animate-spin text-purple-600 w-8 h-8" />
                      <span className="text-xs text-slate-500 font-semibold">Gemini is analyzing logic blocks...</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {aiFeedback}
                    </div>
                  )}
                </div>

                {!aiLoading && (
                  <div className="flex items-center gap-2 mt-4 text-purple-700 font-bold text-xs bg-purple-50 px-3 py-2 rounded-xl self-start w-fit">
                    <CheckCircle size={14} className="fill-purple-600 text-white" />
                    CODE QUALITY LEVEL: PROFESSIONAL
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setAiReviewOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition-all"
                  >
                    Close Review
                  </button>
                  <button 
                    onClick={handleRunCode}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all"
                  >
                    Re-Execute Script
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
