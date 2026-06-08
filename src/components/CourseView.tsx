import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, HelpCircle, Trophy, Lock, CheckCircle, 
  ChevronRight, Sparkles, Heart, AlertTriangle, 
  RotateCcw, Code, ArrowRight, Play, Terminal, User, Users,
  Check, X, ArrowLeft, Flame, Lightbulb, Bot, Zap, Award
} from 'lucide-react';

interface CourseViewProps {
  courses: any[];
  activeCourseId: string;
  completedLessonIds: string[];
  onSelectLesson: (courseId: string, lessonId: string) => void;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleXpGain: (amount: number) => void;
}

const STORIES = [
  {
    id: 'scifi',
    name: 'Neo-Labyrinth',
    genre: 'Sci-Fi Cyber Breach',
    genreTag: 'SCI-FI',
    icon: 'rocket_launch',
    headerIcon: 'target',
    difficulty: 'Adept',
    duration: '40 MIN',
    color: '#0053db',
    gradient: 'from-[#0b1329] via-[#1c2a4a] to-[#070b14]',
    accentColor: 'text-[#3b82f6] border-[#3b82f6]/20 bg-[#3b82f6]/10',
    desc: 'The central AI, Protocol-7, has locked the city. Use advanced logic to breach the firewalls before the sweepers find you.',
    chapters: ['Central Grid', 'Firewall Breach', 'Data District', 'Sector Decoupling', 'Protocol-7 Terminal'],
    rewards: ['Elite Hardware', 'Megacity Pass', 'Breach badge'],
    villain: 'Protocol-7',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLuHNXiySICwF6tnqK04r6_zeaY9jjJnVMe-bGT1I4J5Y8-THKbUqlc6DQfywpOZl5ZCOhXZSdnZxcsPQD_ctTjvW1ABEGvvYCk1M58cvYwefb37yYeQabgWpOinooVTm2fYtwh-XkoAZkolo4XoAcLqnWh0r6UcmLg9cyDNn39zaewvtxcj4jO0pJimqF6JW6ZeTNjwGygdMH7rQjCoPABNOrQ96C2euwWb_1jOXEzzRZkv-ba4JenkuPsS'
  },
  {
    id: 'horror',
    name: 'Shadow Recursion',
    genre: 'Victorian Gothic Horror',
    genreTag: 'HORROR',
    icon: 'skull',
    headerIcon: 'ghost',
    difficulty: 'Elite',
    duration: '55 MIN',
    color: '#ba1a1a',
    gradient: 'from-[#1a0a0a] via-[#330000] to-[#0c0404]',
    accentColor: 'text-[#ef4444] border-[#ef4444]/20 bg-[#ef4444]/15',
    desc: 'Trapped in a recursive nightmare by The Architect. Every loop is more dangerous. Solve the pattern or stay forever.',
    chapters: ['Cursed Gates', 'Recursive Hallways', 'Mirror Reliquary', 'Haunted Clockwork', 'Citadel'],
    rewards: ['Ancient Relics', 'Exorcism Shields', 'Archivist Title'],
    villain: 'The Architect',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLtXcn9buA9yrFDaxtVb0TImpeBlc0ax6eXIqWwkcCI1x2rOXEr8kildC1UkvPjuCjlpl6D4Bt3Gk3Wt9189AZ4FO-_uTnvjE-AAsVrRyvwlgnhPeIaq7_6tJ9hkpVcmxoMDQijr3BeR3jimxW5I6ZLOrfirbjoTRIvKb1vmVg6hUpeIyg2takahMY1062zIk-Y3yn8YSXjUrgme_Gpw0VRk2--LzLxW_drdvSrpHIWeWq7S3Gyl9JlODjva'
  },
  {
    id: 'fantasy',
    name: 'The Void Engine',
    genre: 'Floating Islands High Fantasy',
    genreTag: 'FANTASY',
    icon: 'auto_fix_high',
    headerIcon: 'swords',
    difficulty: 'Novice',
    duration: '25 MIN',
    color: '#6a1edb',
    gradient: 'from-[#1e152e] via-[#2d1a4a] to-[#0f0a14]',
    accentColor: 'text-[#a855f7] border-[#a855f7]/20 bg-[#a855f7]/10',
    desc: 'The World-Tree is failing. Lord Null has stolen the roots. Weave your code spells to restore the natural order.',
    chapters: ['Windswept Bridges', 'Crystal Ravine', 'Aetheric Shrine', 'Shattered Spire', 'Void Core Nexus'],
    rewards: ['Magic Spells', 'Legendary Weapons', 'Kingdom Titles'],
    villain: 'Lord Null',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsnf2vihwJWt-tU7Q5VM2SVzwYF1q4-oFQ-gJLBYHSNvFvVxTknTL_PbJfBGYnb5xgqiG73ngvy6A_fU2DqzNXOcOImYOCVbVEMGExx_u-WKpTq3auuUNccF1G6BzELH4HzgZzsK8Ey0fTr2JuABxhVeMUtQkqIEv_mKLSJuAT8JABp0R5keP9PmgK9qvghvsrNvwhDqJY-ETc1s9Uop4yje5qU3r2jFDJAaeEbsqSY6QyI81Ya9Eg8BT8m'
  }
];

export default function CourseView({ 
  user,
  setUser,
  handleXpGain 
}: CourseViewProps) {
  const [selectedLang, setSelectedLang] = useState<string>('Python');
  const [viewState, setViewState] = useState<'story-select' | 'session' | 'quiz' | 'cert'>('story-select');
  const [activeStory, setActiveStory] = useState<typeof STORIES[0] | null>(null);
  
  // Slide tracker
  const [slideIndex, setSlideIndex] = useState(0);
  
  // Quiz variables states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [lives, setLives] = useState(5);
  const [quizScore, setQuizScore] = useState(0);

  // Analogy sidebar
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [analogyLoading, setAnalogyLoading] = useState(false);
  const [analogyText, setAnalogyText] = useState('');

  // Course completion triggers
  const [completedSessions, setCompletedSessions] = useState<number>(1);

  // Toast flags
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const selectStory = (story: typeof STORIES[0]) => {
    setActiveStory(story);
    setSlideIndex(0);
    setQuizIndex(0);
    setSelectedQuizOpt(null);
    setQuizAnswered(false);
    setLives(5);
    setViewState('session');
    triggerToast(`💡 Entered Story: ${story.name}!`);
  };

  const handleAnalogyReq = async (concept: string) => {
    setShowAnalogy(true);
    setAnalogyLoading(true);
    setAnalogyText('');
    try {
      const response = await fetch('/api/gemini/analogy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, language: selectedLang })
      });
      const data = await response.json();
      setAnalogyText(data.analogy || data.error || 'Failed to retrieve structural analogy from deep-link reactor.');
    } catch (err: any) {
      setAnalogyText(`Error establishing secure neural link output: ${err.message}`);
    } finally {
      setAnalogyLoading(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOpt(optIdx);
    setQuizAnswered(true);

    const questions = getQuizQuestions();
    const correct = questions[quizIndex].correct;

    if (optIdx === correct) {
      setQuizScore(prev => prev + 1);
      triggerToast(`✅ Core Integrity Secured! +50 XP`);
      handleXpGain(50);
    } else {
      setLives(prev => Math.max(0, prev - 1));
      triggerToast(`💥 Firewall alarm triggered! Integrity Warning`);
    }
  };

  const handleNextQuiz = () => {
    const questions = getQuizQuestions();
    if (quizIndex < questions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswered(false);
      setSelectedQuizOpt(null);
    } else {
      // Completed the story module! Give rewards
      setViewState('cert');
      handleXpGain(250);
      triggerToast(`🏆 Campaign Graduated successfully! +250 XP!`);
      if (setUser) {
        setUser((prev: any) => ({
          ...prev,
          badgesCount: prev.badgesCount + 1,
          streak: prev.streak + 1
        }));
      }
    }
  };

  const getQuizQuestions = () => {
    return [
      {
        q: `Which keyword is used to declare a variable that CANNOT be reassigned in modern JavaScript / TypeScript?`,
        opts: ['let', 'const', 'var', 'define'],
        correct: 1,
        exp: "In modern JS/TS, 'const' binds a variable to its initial reference value, causing standard runtime compilers to throw write errors if reassignment is attempted. This increases execution integrity!"
      },
      {
        q: `In Python, which declaration is syntactically valid to store raw text?`,
        opts: ['const user = "Ananya"', 'let user = "Ananya"', 'user = "Ananya"', 'string user = "Ananya"'],
        correct: 2,
        exp: "Python processes variables dynamic-typed, meaning declarations do not require static keywords like const or let. Simply assigning user = value initializes memory bounds instantly!"
      },
      {
        q: `What is the output of checking energy_level = 100 with: let canFly = energy_level > 0; in JavaScript?`,
        opts: ['true (boolean)', '100 (number)', 'undefined', 'SyntaxError: canFly is active'],
        correct: 0,
        exp: "Comparison operations check relational variables and yield standard boolean elements (true or false). Since 100 > 0 holds absolute logical truth, true compiles back!"
      }
    ];
  };

  return (
    <div id="immersive-adventure-learning-campaign" className="bg-[#191c1e] text-slate-100 rounded-3xl p-6 border-b-4 border-slate-950/40 relative min-h-[680px]">
      
      {/* 1. TOP HEADER SHELL */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          {viewState !== 'story-select' && (
            <button 
              onClick={() => setViewState('story-select')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer active:scale-90"
            >
              <ArrowLeft className="text-slate-350" size={16} />
            </button>
          )}
          <div>
            <h1 className="font-heading text-lg font-black tracking-tight flex items-center gap-2">
              <Bot size={20} className="text-blue-500 animate-pulse" />
              EVE Adventure Mode
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {viewState === 'story-select' ? 'Story Selection Hub' : activeStory?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Path mode select toggle */}
          <select 
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-[#2d3133] border border-white/15 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500/50"
          >
            <option value="Python">🐍 PYTHON PATH</option>
            <option value="JavaScript">⚡ JAVASCRIPT PATH</option>
            <option value="TypeScript">💎 TYPESCRIPT PATH</option>
          </select>
        </div>
      </header>

      {/* ── SCREEN 1: STORY SELECTION HUB ── */}
      {viewState === 'story-select' && (
        <div className="space-y-6">
          {/* Hero Banner Section */}
          <div className="mb-6 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-white/5 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[2px] w-8 bg-blue-500"></div>
              <span className="font-heading font-extrabold text-xs uppercase text-blue-400 tracking-widest">Select World Campaign</span>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every line of code you write shapes the outcome. Choose a realm where your {selectedLang} skills are the only thing standing between survival and extinction.
            </p>
          </div>

          {/* Grid Worlds layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORIES.map((story) => (
              <div 
                key={story.id}
                className="group relative flex flex-col justify-between bg-[#24282c] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-500/20 shadow-xl"
              >
                {/* Header Image Cover */}
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24282c] via-[#24282c]/20 to-transparent"></div>
                  
                  {/* Genre floating pill */}
                  <span className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-md ${
                    story.genreTag === 'SCI-FI' ? 'bg-blue-600/90' : story.genreTag === 'HORROR' ? 'bg-red-600/90' : 'bg-purple-600/90'
                  }`}>
                    {story.genreTag}
                  </span>
                </div>

                {/* Content body */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div className="mb-4 text-left">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:bg-blue-500/10 transition-colors">
                        <span className="text-blue-400">⚡</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                          {story.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 tracking-wider">DIFFICULTY: {story.difficulty}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-2.5 font-semibold">
                      {story.desc}
                    </p>
                  </div>

                  {/* Card bottom footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      ⏱️ {story.duration}
                    </span>
                    <button 
                      onClick={() => selectStory(story)}
                      className="bg-blue-600 hover:bg-blue-500 hover:shadow-lg text-white font-extrabold text-[10px] uppercase py-2.5 px-4 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md tracking-wider flex items-center gap-1.5"
                    >
                      <span>Select</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Journey Statistics Section */}
          <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#212428] border border-white/5 rounded-2xl p-6 text-left">
              <h4 className="font-heading text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame size={16} className="text-orange-500 animate-pulse" />
                Your Campaign Analytics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1a1c1e] p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase">Worlds Cleared</p>
                  <p className="font-heading text-lg font-black text-blue-500 mt-1">12</p>
                </div>
                <div className="bg-[#1a1c1e] p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase">Total XP</p>
                  <p className="font-heading text-lg font-black text-[#57dffe] mt-1">4.8k</p>
                </div>
                <div className="bg-[#1a1c1e] p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase">Enemies Defeated</p>
                  <p className="font-heading text-lg font-black text-[#8343f4] mt-1">9</p>
                </div>
                <div className="bg-[#1a1c1e] p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase">Success Rate</p>
                  <p className="font-heading text-lg font-black text-slate-100 mt-1">92%</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 rounded-2xl p-6 text-left relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="relative z-10">
                <Award size={36} className="text-yellow-300 mb-3 animate-bounce" />
                <h4 className="font-heading text-sm font-black text-white">Elite Adventurer Pass</h4>
                <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                  Conquer any "Elite" difficulty recursive challenge this week to unlock custom spacecraft chassis models!
                </p>
              </div>
              <button 
                onClick={() => triggerToast(`🎒 VIP Rewards: 12 standard weapon cases assigned!`)}
                className="relative z-10 inline-flex items-center justify-center mt-5 bg-white text-blue-900 font-extrabold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-all hover:bg-slate-100 active:scale-95 cursor-pointer shadow-md"
              >
                Claim Gear
              </button>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </section>
        </div>
      )}

      {/* ── SCREEN 2: ACTIVE SESSION SLIDES LECTURE ── */}
      {viewState === 'session' && activeStory && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header tracker with progress percent */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-[#2d3133] rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                style={{ width: slideIndex === 0 ? '33%' : slideIndex === 1 ? '66%' : '100%' }}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-400 text-right">
              {slideIndex === 0 ? '33%' : slideIndex === 1 ? '66%' : '100%'}
            </span>
          </div>

          {/* Narrative Advisor character grid */}
          <section className="flex flex-col md:flex-row gap-6 items-start text-left">
            {/* Guide Avatar Box */}
            <div className="flex-shrink-0 relative">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-[#57dffe]/10 p-1 border-b-4 border-[#00687a] overflow-hidden bento-card shadow-lg bg-[#24282c]">
                <img 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLuSrDCS3PhH_2Ux20vYrHEGDHFQW-AAFPZ3vxb3Wda7BtKdmZHpDZEVnMx7gbmvNm3Pp8IoiJTnbK3QjO9kpkSjVse7FTVnhBssP4oClIYlyXEoeEf5Awc_8aLHRr_AbbLC0FkPvbz23FWM7gFid6jqtSwx9mq1ZE6wIfKs4_TkWPG51UfysbOTDr_oGz5VIQS7UORHQ3iwPpT2mfMA93lw4JvadQyoWU3rtvo4sMZ4wMwig9GPXcNr09E" 
                  alt="EVA adviser guide" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white px-2 py-0.5 rounded-lg font-bold text-[9px] uppercase tracking-wider block shadow">
                Mentor
              </span>
            </div>

            {/* Bubble dialog text */}
            <div className="flex-1 bg-[#24282c] border border-white/5 p-5 rounded-2xl relative shadow-md">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                SESSION {completedSessions} · VARIABLES & TYPES
              </span>
              <p className="text-sm font-semibold text-slate-200 leading-relaxed italic">
                {slideIndex === 0 && `"Think of a Variable as an allocated storage lock-box in your reactor memory banks. To access it, we bind its identifier with values. In ${selectedLang}, we declare structures elegantly!"`}
                {slideIndex === 1 && `"Excellent progress, pilot in training! Now we inspect operators. These formulas perform arithmetic gates or logical checks to update reactor health systems."`}
                {slideIndex === 2 && `"Magnificent. Takeaways secured! Let's examine conditional structures before triggering our combat test checkpoint terminal."`}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-blue-400">
                <Lightbulb size={15} />
                <span className="text-[10px] font-extrabold uppercase tracking-wide">
                  {selectedLang === 'Python' ? "PRO TIP: Variables in Python do NOT require typing keywords!" : "PRO TIP: Default to 'const' assignments for secure scoping!"}
                </span>
              </div>
            </div>
          </section>

          {/* Dynamic interactive slide content rows */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
            
            {/* Left Column: Interactive Code block */}
            <div className="md:col-span-7 bg-[#0f172a] rounded-2xl p-5 border-b-4 border-slate-950 overflow-hidden relative shadow-inner">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                  system_reactor.{selectedLang === 'Python' ? 'py' : 'js'}
                </span>
              </div>

              {selectedLang === 'Python' ? (
                <pre className="font-mono text-xs text-slate-205 leading-relaxed selection:bg-blue-600/25">
                  <code>
<span className="text-pink-400">pilot_name</span> = <span className="text-emerald-400">"Ananya"</span><br />
<span className="text-pink-400">energy_level</span> = <span className="text-amber-400">100</span><br />
<span className="text-pink-400">gate_unlocked</span> = <span className="text-blue-400">True</span><br /><br />
<span className="text-slate-500"># Verify containment limits</span><br />
<span className="text-pink-400">if</span> energy_level &gt; <span className="text-amber-400">0</span>:<br />
&nbsp;&nbsp;&nbsp;&nbsp;print(<span className="text-emerald-400">f"Systems Charged, &#123;pilot_name&#125;!"</span>)
                  </code>
                </pre>
              ) : (
                <pre className="font-mono text-xs text-slate-205 leading-relaxed selection:bg-blue-600/25">
                  <code>
<span className="text-pink-400">const</span> pilotName = <span className="text-emerald-400">"Ananya"</span>;<br />
<span className="text-pink-400">let</span> energyLevel = <span className="text-amber-401">100</span>;<br />
<span className="text-pink-400">const</span> gateUnlocked = <span className="text-blue-400">true</span>;<br /><br />
<span className="text-slate-500">// Verify containment limits</span><br />
<span className="text-pink-400">if</span> (energyLevel &gt; <span className="text-amber-401">0</span>) &#123;<br />
&nbsp;&nbsp;console.log(<span className="text-emerald-400">`Systems Charged, $&#123;pilotName&#125;!`</span>);<br />
&#125;
                  </code>
                </pre>
              )}
            </div>

            {/* Right Column: Key Concept card */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-[#8343f4]/15 border border-[#8343f4]/20 p-5 rounded-2xl relative shadow-md">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-yellow-400">⭐</span>
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-slate-100">
                    Key Lesson Takeaway
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {slideIndex === 0 && "Variables reserve memory blocks. Constant modifiers protect crucial configurations, while dynamic let/assignment bounds allow reactor levels to decrement."}
                  {slideIndex === 1 && "Couplers like multiplication, modulus remainder checks, and strict equality evaluate conditions immediately in high-intensity computations."}
                  {slideIndex === 2 && "If conditional gates establish detour tracks. This prevents logic execution from running into locked gates or empty reactor pipelines."}
                </p>
              </div>

              {/* Neural Analogy Box Trigger */}
              <button 
                onClick={() => handleAnalogyReq(slideIndex === 0 ? 'variables' : slideIndex === 1 ? 'operators' : 'control flow')}
                className="w-full bg-[#acedff]/10 hover:bg-[#acedff]/15 border border-[#acedff]/20 p-4 rounded-2xl flex items-center justify-between text-[#4cd7f6] transition-all cursor-pointer group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Bot size={18} className="animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Need a simpler analogy?
                  </span>
                </div>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Navigation slides buttons */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <button 
              onClick={() => setViewState('story-select')}
              className="px-5 py-3 rounded-xl border border-white/10 font-bold text-xs hover:bg-white/5 transition-all cursor-pointer active:scale-95"
            >
              Back to worlds
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map(idx => (
                <span 
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === slideIndex ? 'bg-blue-500 w-6' : 'bg-white/10'
                  }`}
                ></span>
              ))}
            </div>

            <div className="flex gap-3">
              {slideIndex > 0 && (
                <button 
                  onClick={() => setSlideIndex(prev => prev - 1)}
                  className="px-4 py-3 rounded-xl border border-white/10 font-bold text-xs hover:bg-white/5 transition-all text-slate-300 cursor-pointer"
                >
                  PREV
                </button>
              )}
              {slideIndex < 2 ? (
                <button 
                  onClick={() => setSlideIndex(prev => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase py-3 px-6 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
                >
                  <span>CONTINUE</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setQuizIndex(0);
                    setSelectedQuizOpt(null);
                    setQuizAnswered(false);
                    setViewState('quiz');
                    triggerToast(`🧠 Node Trivia Quiz loaded!`);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase py-3 px-6 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/10 cursor-pointer transition-all active:scale-95"
                >
                  <span>START TRIVIA QUIZ</span>
                  <Code size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SCREEN 3: ACTIVE TRIVIA QUIZ ── */}
      {viewState === 'quiz' && activeStory && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header quiz section with close, progress, lives */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewState('story-select')}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
              <div className="w-32 md:w-48 h-3 bg-[#2d3133] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-[#0053db] rounded-full transition-all duration-500"
                  style={{ width: `${((quizIndex + 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Lives and scores */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1 text-red-500 font-extrabold text-xs animate-pulse">
                <Heart size={16} fill="currentColor" />
                <span>{lives} LIVES</span>
              </div>
              <span className="text-xs text-slate-405 font-bold uppercase tracking-wider">
                SCORE: {quizScore} / 3
              </span>
            </div>
          </div>

          {/* Test container card */}
          {(() => {
            const questions = getQuizQuestions();
            const question = questions[quizIndex];
            if (!question) return null;

            return (
              <div className="bg-[#212428] border border-white/5 rounded-2xl p-6 text-left space-y-6 shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-yellow-400 bg-yellow-450/10 border border-yellow-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    REACTIVE QUESTION CHECKPOINT
                  </span>
                  <h3 className="font-heading font-black text-slate-100 text-sm md:text-base leading-snug mt-4">
                    {question.q}
                  </h3>
                </div>

                {/* Tactical options */}
                <div className="flex flex-col gap-3.5">
                  {question.opts.map((opt, oIdx) => {
                    const isSelected = selectedQuizOpt === oIdx;
                    const isCorrectAnswer = oIdx === question.correct;
                    const showSuccess = quizAnswered && isCorrectAnswer;
                    const showFail = quizAnswered && isSelected && !isCorrectAnswer;

                    return (
                      <button 
                        key={oIdx}
                        disabled={quizAnswered}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                          quizAnswered 
                            ? showSuccess
                              ? 'bg-green-950/40 border-green-500 text-green-300 font-bold'
                              : showFail
                                ? 'bg-red-950/40 border-red-500 text-red-300 font-bold'
                                : 'bg-[#1e2023] border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                            : isSelected
                              ? 'bg-blue-600/10 border-blue-500 text-blue-300'
                              : 'bg-[#24282c] border-white/5 hover:border-slate-500 hover:bg-[#2d3133] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 ${
                            quizAnswered
                              ? showSuccess
                                ? 'bg-green-600 border-green-500 text-white shadow-md'
                                : showFail
                                  ? 'bg-red-600 border-red-500 text-white'
                                  : 'bg-slate-800 border-white/5 text-slate-500'
                              : isSelected
                                ? 'bg-blue-600 border-blue-500 text-white shadow'
                                : 'bg-slate-800 border-white/5 text-slate-300'
                          }`}>
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </div>
                          <span className="text-xs font-semibold">{opt}</span>
                        </div>

                        {quizAnswered && (
                          <div>
                            {showSuccess && <Check size={16} className="text-green-405" />}
                            {showFail && <X size={16} className="text-red-405" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action answer explanation layout banner */}
                {quizAnswered && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-colors ${
                    selectedQuizOpt === question.correct 
                      ? 'bg-green-950/20 border-green-500/30 text-green-300' 
                      : 'bg-red-950/20 border-red-500/30 text-red-300'
                  }`}>
                    <div className="flex gap-2.5 items-start">
                      {selectedQuizOpt === question.correct 
                        ? <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                        : <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      }
                      <div>
                        <h5 className="font-extrabold text-[10px] uppercase tracking-wider mb-1">
                          {selectedQuizOpt === question.correct ? 'COMPILE STATUS: SUCCESS' : 'COMPILE STATUS: EXECUTION FAILURE'}
                        </h5>
                        <p className="font-semibold text-slate-305">{question.exp}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue bottom bar */}
                {quizAnswered && (
                  <div className="text-right pt-2">
                    <button 
                      onClick={handleNextQuiz}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md inline-flex hover:shadow-lg"
                    >
                      <span>{quizIndex < questions.length - 1 ? 'NEXT QUESTION' : 'COMPUTE CERTIFICATE'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── SCREEN 4: GRADUATION CERTIFICATE VIEW ── */}
      {viewState === 'cert' && activeStory && (
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-[#1a1c1e] to-indigo-950 text-slate-100 p-8 rounded-3xl border border-yellow-500/30 text-center shadow-2xl relative overflow-hidden text-left space-y-6"
          >
            {/* Elegant Golden styling and ornaments */}
            <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300"></div>

            <div className="w-20 h-20 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-full mx-auto flex items-center justify-center text-5xl mb-3 shadow-xl relative">
              🏆
              <span className="absolute -bottom-1 -right-1 bg-green-500 p-1 border-2 border-[#191c1e] rounded-full">
                <Check size={14} className="text-white font-extrabold" />
              </span>
            </div>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-yellow-400 tracking-widest uppercase block">
                COMPILATION DIPLOMA COMPLETED
              </span>
              <h1 className="font-heading font-black text-2xl text-white mt-1.5 tracking-tight leading-none">
                EVE {selectedLang} Path Master
              </h1>
              <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
                Congratulations, <span className="text-white font-extrabold">{user.displayName || "Pilot"}</span>! You conquered the recursive firewalls and narrative chambers of the {activeStory.name} campaign!
              </p>
            </div>

            <hr className="border-t border-white/5 max-w-md mx-auto" />

            {/* Completion Stats columns */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                <span className="font-heading font-extrabold text-lg text-yellow-405 block">3 / 3</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Sessions</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                <span className="font-heading font-extrabold text-lg text-yellow-405 block">+250 XP</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">XP Reward</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
                <span className="font-heading font-extrabold text-lg text-yellow-405 block">Perfect</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Evaluation</span>
              </div>
            </div>

            <hr className="border-t border-white/5 max-w-md mx-auto" />

            <div className="text-center">
              <button 
                onClick={() => setViewState('story-select')}
                className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 hover:opacity-95 text-[#191c1e] font-black text-xs uppercase py-4 px-8 rounded-2xl tracking-wider shadow-lg shadow-amber-500/10 transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
              >
                <span>🎉 Create New Adventure Path</span>
              </button>
            </div>

            <p className="text-[9px] text-slate-500 text-center font-bold tracking-widest uppercase mt-4">
              EVE PLATFORM SECURED SYSTEMS
            </p>
          </motion.div>
        </div>
      )}

      {/* ── AI ANALOGY SIDEBAR DRAWER PANEL ── */}
      <AnimatePresence>
        {showAnalogy && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/80 backdrop-blur-sm">
            {/* Click backdrop to exit */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setShowAnalogy(false)} />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="relative w-full max-w-md h-full bg-[#1e2023] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between text-left"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Bot size={20} className="animate-pulse" />
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-100">
                      EVA AI Neural Analogy
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowAnalogy(false)}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-350 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="text-xs text-slate-400 mt-2 font-semibold">
                  We connected with the AI tutor engine to generate a real-world concept.
                </div>

                {/* Content block */}
                <div className="bg-[#191c1e] border border-white/5 p-5 rounded-2xl min-h-[300px] overflow-y-auto relative">
                  {analogyLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-blue-405 tracking-wider animate-pulse">GENERATING ANALOGY...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-300 font-medium">
                      {(analogyText || '').split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('-')) {
                          return (
                            <li key={idx} className="list-disc ml-4 pl-1 text-slate-300">
                              {trimmed.slice(1).trim()}
                            </li>
                          );
                        }
                        if (trimmed === '') return <div key={idx} className="h-2" />;
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer footer */}
              <div>
                <button 
                  onClick={() => setShowAnalogy(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md active:scale-95 text-center block"
                >
                  Continue Lesson
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT TOAST SYSTEM */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 right-8 z-[200] max-w-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xs uppercase tracking-widest px-5 py-4 rounded-xl shadow-2xl flex items-center gap-2 border border-blue-500/30"
          >
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
