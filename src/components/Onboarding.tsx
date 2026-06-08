import React, { useState } from 'react';
import { motion } from 'motion/react';
import { School, Terminal, Sparkles, Verified, ArrowRight, HelpCircle, LogIn, ChevronRight, BookOpen } from 'lucide-react';

interface OnboardingProps {
  onComplete: (username: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState<'welcome' | 'overview' | 'roadmap' | 'login'>('welcome');
  const [username, setUsername] = useState('Ananya Sharma');
  const [email, setEmail] = useState('ananya@eve.com');
  const [password, setPassword] = useState('********');

  const handleStart = () => {
    setSlide('overview');
  };

  const handleNext = () => {
    if (slide === 'overview') {
      setSlide('roadmap');
    } else if (slide === 'roadmap') {
      setSlide('login');
    } else {
      onComplete(username || 'Ananya');
    }
  };

  return (
    <div id="onboarding-container" className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 py-4 md:px-12 z-10 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div id="logo-block" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <School size={20} />
          </div>
          <span className="font-heading font-extrabold text-2xl text-blue-600 tracking-tight">EVE</span>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => setSlide('login')} 
            className="font-semibold text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            SIGN IN
          </button>
          <div className="hidden md:flex gap-1 items-center bg-blue-50 px-3 py-1.5 rounded-full text-blue-600 font-semibold text-xs tracking-wider">
            <Verified size={14} /> PROFESSIONAL PATH READY
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center py-10 px-4 md:px-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Slide transitions */}
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
            {slide === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="slide-welcome"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold text-xs uppercase tracking-wider">
                  <Verified size={14} className="fill-blue-700 text-white" />
                  Professional Path Ready
                </div>
                <h1 className="font-heading font-black text-5xl md:text-6xl text-slate-900 leading-[1.1] tracking-tight">
                  Learn Smarter.<br />
                  <span className="text-blue-600">Advance Faster.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-md leading-relaxed">
                  Master coding, aptitude, and career-ready interview skills with personalized AI guidance designed for the next generation of engineers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
                  <button
                    id="btn-get-started"
                    onClick={handleStart}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-600/20 active:translate-y-0.5 min-w-[200px] flex items-center justify-center gap-2 transition-all"
                  >
                    GET STARTED
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => setSlide('login')}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-base font-bold py-4 px-8 rounded-2xl active:translate-y-0.5 flex items-center justify-center transition-all"
                  >
                    LOGIN
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-8 justify-center md:justify-start">
                  <span className="text-sm text-slate-400">New here? <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => setSlide('login')}>Create an account</span></span>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <div className="flex -space-x-1">
                    <img className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="avatar" />
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">20k+</div>
                  </div>
                </div>
              </motion.div>
            )}

            {slide === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="slide-overview"
              >
                <h2 className="font-heading font-extrabold text-4xl text-slate-900 leading-tight">
                  Everything you need to land top software jobs
                </h2>
                <p className="text-slate-500 leading-relaxed text-base max-w-md">
                  We blend hands-on practice, logical brain tests, and automated corporate interview loops.
                </p>

                <div className="grid grid-cols-2 gap-4 text-left w-full pt-2">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3"><Terminal size={18} /></div>
                    <span className="font-bold text-slate-800 text-sm block">Coding Compilers</span>
                    <span className="text-xs text-slate-400 block mt-1">Python, JS, Node fallbacks</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3"><Sparkles size={18} /></div>
                    <span className="font-bold text-slate-800 text-sm block">AI Advisor (EVE)</span>
                    <span className="text-xs text-slate-400 block mt-1">24/7 personal tutor feedbacks</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mb-3"><School size={18} /></div>
                    <span className="font-bold text-slate-800 text-sm block">Aptitude Prep</span>
                    <span className="text-xs text-slate-400 block mt-1">Quantitative logic and trivia</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3"><Verified size={18} /></div>
                    <span className="font-bold text-slate-800 text-sm block">Corporate Interviews</span>
                    <span className="text-xs text-slate-400 block mt-1">HR, Technical, Voice-activated</span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mt-6"
                >
                  CONTINUE ROADMAP
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {slide === 'roadmap' && (
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 w-full max-w-md"
                id="slide-roadmap"
              >
                <h2 className="font-heading font-extrabold text-4xl text-slate-900">
                  Your Learning Pathway
                </h2>
                <p className="text-slate-500 text-sm">
                  The gamified professional track generates structured checkpoints for complete concept mastery.
                </p>

                {/* Vertical roadmap diagram */}
                <div className="space-y-3 pt-2 text-left relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-1 before:bg-blue-100">
                  <div className="flex items-center gap-4 relative">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold z-10 shadow-md">1</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Interactive Reading Sessions</h4>
                      <p className="text-xs text-slate-400">Byte-sized nodes and theory lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative">
                    <div className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold z-10">2</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Practice Quizzes & Codes</h4>
                      <p className="text-xs text-slate-400">Sandbox edits and challenge reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative">
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold z-10">3</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Gemini AI Explanations</h4>
                      <p className="text-xs text-slate-400">24/7 infinite code hints and review guidelines</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold z-10">4</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Certificate Generation</h4>
                      <p className="text-xs text-slate-400">Export verified skill badges to LinkedIn</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-[24px]"
                >
                  SETUP PROFILE
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {slide === 'login' && (
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 w-full max-w-sm text-left"
                id="slide-login"
              >
                <h2 className="font-heading font-extrabold text-3xl text-slate-900">
                  Welcome to EVE
                </h2>
                <p className="text-slate-500 text-sm">
                  Sign in or edit details to populate your gamified learning profile.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-500 tracking-wider block mb-1">YOUR DISPLAY NAME</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ananya Sharma"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 tracking-wider block mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 tracking-wider block mb-1">PASSPHRASE</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    ENTER PLATFORM
                    <LogIn size={16} />
                  </button>

                  <div className="flex gap-2 justify-center items-center py-2">
                    <span className="h-[1px] bg-slate-200 flex-grow"></span>
                    <span className="text-xs text-slate-400 tracking-wider">OR SIGN IN WITH</span>
                    <span className="h-[1px] bg-slate-200 flex-grow"></span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleNext}
                      className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-600 py-2.5 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.2 3.31v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      GOOGLE
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-600 py-2.5 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4 fill-slate-800" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GITHUB
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive 3D Mentor Mascot Block */}
          <div className="order-1 md:order-2 flex justify-center relative">
            <div className="absolute top-0 right-10 animate-bounce bg-cyan-100 p-3 rounded-2xl shadow-sm rotate-12">
              <Terminal className="text-cyan-700 w-5 h-5" />
            </div>
            <div className="absolute bottom-10 left-0 bg-yellow-100 p-3 rounded-xl shadow-sm -rotate-12">
              <Sparkles className="text-yellow-700 w-5 h-5" />
            </div>
            <div className="absolute top-20 left-10 opacity-10">
              <span className="font-mono text-9xl text-blue-600 font-extrabold select-none">&lt;/&gt;</span>
            </div>

            {/* Premium Mascot Ring */}
            <div className="relative w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl max-w-full">
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLtIB8RCDUSnP9D1o3Y3XRqCSTdadOvf1CqdHtUWuxEtL4WUsIo8wnWKBp6DB00yBPuuKTKq4llxmjE6H6On4NIN2cSyCWwM0jLz1PWUtQ60PdcKQ2pF0jDj7ypJtsD2o_qyfPinaeS32EADt5gnYSLDQ6eaoouUOUEtAVilIo9nVqvaLV7SeLX8AjxTh4uSd8GKXi6uUlYmJc3QEjO8Goo14UizjexKfXB2702SsisB8blnRvcM8HUXqaEH"
                alt="EVE Coach Mascot"
                className="w-[85%] h-[85%] object-contain"
              />
            </div>
          </div>

        </div>
      </main>

      {/* Value Props Section */}
      <section className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm-soft">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0"><Sparkles size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-lg mb-1">EVE AI Mentorship</h3>
              <p className="text-sm text-slate-500 leading-relaxed">24/7 personalized advisor that reviews code, analyzes answers, and creates dynamic custom learning routes.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm-soft">
            <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl shrink-0"><BookOpen size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-lg mb-1">Career Paths</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Curated paths focusing strictly on corporate job readiness, coding tests, and structured professional portfolios.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm-soft">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0"><Verified size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-lg mb-1">Gamified Success</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Earn badges, XP levels, and coins. Maintain daily streaks and compete on global software developer guild ranks.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
