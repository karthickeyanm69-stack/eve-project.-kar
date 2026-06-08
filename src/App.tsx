import React, { useState } from 'react';
import { Home, School, Terminal, Briefcase, User, Menu, Bell, Trophy, BookOpen, Brain, Zap, Users, BarChart3, Settings } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import CompilerView from './components/CompilerView';
import AptitudeView from './components/AptitudeView';
import InterviewView from './components/InterviewView';
import MiniProjects from './components/MiniProjects';
import AchievementsView from './components/AchievementsView';
import GuildsView from './components/GuildsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';

import { INITIAL_COURSES, INITIAL_CHALLENGES, INITIAL_APTITUDE, INITIAL_PROJECTS, INITIAL_ACHIEVEMENTS, INITIAL_GUILDS, INITIAL_USER } from './data';
import { Course, Lesson, UserState } from './types';

export default function App() {
  const [user, setUser] = useState<UserState>(INITIAL_USER);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [tab, setTab] = useState<'home' | 'learn' | 'practice' | 'career' | 'profile'>('home');
  const [subPractice, setSubPractice] = useState<'compiler' | 'aptitude'>('compiler');
  const [subCareer, setSubCareer] = useState<'coach' | 'projects'>('coach');
  const [subProfile, setSubProfile] = useState<'achievements' | 'guilds' | 'analytics' | 'settings'>('achievements');
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // Daily goal array state
  const [goals, setGoals] = useState([
    { id: 'g1', text: 'Master List Comprehension', done: true, reward: 50 },
    { id: 'g2', text: 'Solve 3 Code Challenges', done: false, reward: 150, inProgress: true },
    { id: 'g3', text: 'Complete a Technical Interview Coaching session', done: false, reward: 200 }
  ]);

  if (!user.isLoggedIn) {
    return (
      <Onboarding 
        onComplete={(name) => {
          setUser(prev => ({
            ...prev,
            displayName: name,
            isLoggedIn: true
          }));
        }} 
      />
    );
  }

  const activeCourse = courses.find(c => c.id === user.activeCourseId) || courses[0];
  const activeLesson = activeCourse.lessons.find(l => l.id === user.activeLessonId) || activeCourse.lessons[0];

  // Callback to raise score points on correct submissions
  const handleXpGain = (amount: number) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLevelThreshold = prev.nextLevelXp;

      if (newXp >= nextLevelThreshold) {
        newLevel += 1;
        nextLevelThreshold = Math.floor(nextLevelThreshold * 1.5);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextLevelThreshold,
        coins: prev.coins + Math.floor(amount / 5)
      };
    });
  };

  const handleLessonCheck = (courseId: string, lessonId: string) => {
    if (!user.completedLessonIds.includes(lessonId)) {
      setUser(prev => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId]
      }));
      handleXpGain(80); // trigger standard XP addition
    }
  };

  // Toggle goals checkbox
  const handleToggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        if (!g.done) {
          handleXpGain(g.reward);
        }
        return { ...g, done: !g.done };
      }
      return g;
    }));
  };

  const getMentorSpeech = () => {
    if (tab === 'home') {
      return `Welcome back, ${user.displayName}! Ready to resume your progression? You are performing 92% higher in active compilers. Let's practice!`;
    }
    if (tab === 'learn') {
      return `Our personalized roadmap matches current tech company interviews. Lock in your foundation blocks before jumping to assessments!`;
    }
    if (tab === 'practice') {
      if (subPractice === 'compiler') {
        return `Try executing python variables and print statements loop formats. Ensure the sandbox debugger outputs valid runs!`;
      }
      return `Aptitude multiple choice lists test your deep math and analytical reasoning cells. Keep your correct submission counts up!`;
    }
    if (tab === 'career') {
      if (subCareer === 'coach') {
        return `Practice speaking or typing answers, and watch EVE scan confidence levels, communication skills, and technical weight!`;
      }
      return `Deploying real mini-projects is critical for GitHub showcase portfolios. Click complete to earn robust badges and experience points!`;
    }
    if (tab === 'profile') {
      if (subProfile === 'achievements') {
        return `Terrific work, dev! You have claimed ${user.badgesCount} badges already. Unlock 12-day streak multipliers to rank higher!`;
      }
      if (subProfile === 'guilds') {
        return `Guild cohorts gather student developers globally. Submit challenges to lead your local guild up the ranks!`;
      }
      if (subProfile === 'analytics') {
        return `Analyzing runtime speeds and diagnostic reports tells us which algorithms need supplementary review nodes. Keep growing!`;
      }
      return `Change profile display names or reset historical simulation logs anytime. Make EVE work specifically for your schedule.`;
    }
    return `You're doing great! Keep solving challenges to unlock custom rewards.`;
  };

  const getPageTitle = () => {
    switch (tab) {
      case 'home': return 'EVE Platform Hub';
      case 'learn': return 'Learning Roadmaps';
      case 'practice': return subPractice === 'compiler' ? 'Python Compiler Workspace' : 'Aptitude Brain Tests';
      case 'career': return subCareer === 'coach' ? 'AI Interview Coach' : 'Mini Projects Showcase';
      case 'profile':
        if (subProfile === 'achievements') return 'Achievements & Badges';
        if (subProfile === 'guilds') return 'Coherent Developer Guilds';
        if (subProfile === 'analytics') return 'Performance Analytics';
        return 'Workspace Settings';
      default: return 'EVE Core Workspace';
    }
  };

  return (
    <div id="eve-core-application" className="h-screen w-full flex bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-blue-100">
      
      {/* 1. LEFT PERSISTENT SIDEBAR NAVIGATION (DESKTOP) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">
        {/* Brand Block */}
        <div 
          onClick={() => setTab('home')}
          className="p-6 flex items-center gap-3 cursor-pointer select-none group border-b border-slate-100"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/10 group-hover:scale-105 transition-transform">
            <div className="text-white font-black text-xl tracking-tight">E</div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-blue-900 block leading-none">EVE AI</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Tutor Workspace</span>
          </div>
        </div>

        {/* Navigation List Category 1: Learn & Practice */}
        <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5">HUBS & CURRICULUM</p>
            <nav className="space-y-1">
              <button
                onClick={() => setTab('home')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'home' 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Home size={16} />
                <span>EVE platform Hub</span>
              </button>
              <button
                onClick={() => setTab('learn')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'learn' 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <School size={16} />
                <span>Learning Paths</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5">SANDBOX ENVIRONMENT</p>
            <nav className="space-y-1">
              <button
                onClick={() => { setTab('practice'); setSubPractice('compiler'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'practice' && subPractice === 'compiler'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Terminal size={16} />
                <span>Python Compiler</span>
              </button>
              <button
                onClick={() => { setTab('practice'); setSubPractice('aptitude'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'practice' && subPractice === 'aptitude'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Brain size={16} />
                <span>Aptitude Brain Tests</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5">CAREER SUCCESS</p>
            <nav className="space-y-1">
              <button
                onClick={() => { setTab('career'); setSubCareer('coach'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'career' && subCareer === 'coach'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Briefcase size={16} />
                <span>AI Interview Coach</span>
              </button>
              <button
                onClick={() => { setTab('career'); setSubCareer('projects'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'career' && subCareer === 'projects'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Trophy size={16} />
                <span>Mini Projects</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5">PERFORMANCE & SECTOR</p>
            <nav className="space-y-1">
              <button
                onClick={() => { setTab('profile'); setSubProfile('achievements'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'profile' && subProfile === 'achievements'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BookOpen size={16} />
                <span>Achievements Nodes</span>
              </button>
              <button
                onClick={() => { setTab('profile'); setSubProfile('guilds'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'profile' && subProfile === 'guilds'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users size={16} />
                <span>Coherent Guilds</span>
              </button>
              <button
                onClick={() => { setTab('profile'); setSubProfile('analytics'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'profile' && subProfile === 'analytics'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BarChart3 size={16} />
                <span>Performance Analytics</span>
              </button>
              <button
                onClick={() => { setTab('profile'); setSubProfile('settings'); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  tab === 'profile' && subProfile === 'settings'
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Settings size={16} />
                <span>Workspace Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Pro Upgrades Info Box */}
        <div className="p-4 border-t border-slate-100 hidden md:block shrink-0">
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg shadow-indigo-100/50">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-85 mb-0.5">PRO LEVEL ACTIVE</p>
            <p className="text-xs font-medium">Unlimited Gemini Explanations & Reviews</p>
            <div className="mt-2.5 w-full bg-white/10 text-white py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase text-center backdrop-blur-md">
              💎 PRO DEV PASS ACTIVE
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN HUB VIEWPORT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Dynamic header stats matching mockup exactly */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm shadow-slate-100/10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
              className="text-slate-600 hover:text-blue-600 p-2 hover:bg-slate-50 rounded-xl transition-colors active:scale-95 duration-100 shrink-0 md:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="font-heading font-extrabold text-base text-slate-800 tracking-tight block max-md:hidden select-none">
              {getPageTitle()}
            </span>
            <span className="font-heading font-black text-xl text-blue-600 tracking-tight cursor-pointer md:hidden block" onClick={() => setTab('home')}>EVE</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Stats badges */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="text-orange-500 font-bold text-lg select-none">🔥</span>
                <div>
                  <span className="text-sm font-black text-slate-805 block leading-tight">{user.streak}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none block">STREAK</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-blue-500 font-bold text-lg select-none">💎</span>
                <div>
                  <span className="text-sm font-black text-slate-805 block leading-tight">{user.xp.toLocaleString()}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none block">XP POINTS</span>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 block"></div>

            {/* User Profile avatar block */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-tight block">{user.displayName}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 leading-none">Level {user.level} · Advanced</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-blue-600 p-0.5 grow-0 shrink-0">
                <div className="w-full h-full rounded-full bg-indigo-50 border overflow-hidden flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
                    alt="avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Double container setup: Left Side (main content) + Right Side (AI Advisor mascot panel) */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          
          {/* Main workspace scrolling panel */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-28 md:pb-16 min-w-0 bg-[#F8FAFC]">
            
            {/* Renders Tab contents */}
            {tab === 'home' && (
              <Dashboard 
                user={user} 
                activeCourse={activeCourse}
                onNavigate={(selected) => setTab(selected)}
                onContinueCourse={() => {
                  setTab('learn');
                }}
                onToggleGoal={handleToggleGoal}
                goals={goals}
              />
            )}

            {tab === 'learn' && (
              <CourseView 
                courses={courses}
                activeCourseId={user.activeCourseId}
                completedLessonIds={user.completedLessonIds}
                onSelectLesson={(courseId, lessonId) => {
                  setUser(prev => ({
                    ...prev,
                    activeCourseId: courseId,
                    activeLessonId: lessonId
                  }));
                  setTab('practice');
                  setSubPractice('compiler');
                }}
                user={user}
                setUser={setUser}
                handleXpGain={handleXpGain}
              />
            )}

            {tab === 'practice' && (
              <div className="space-y-6">
                <div className="flex gap-2 border-b border-slate-200 pb-3 max-w-sm">
                  <button
                    onClick={() => setSubPractice('compiler')}
                    className={`flex-1 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                      subPractice === 'compiler' ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/5' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    Python Practice
                  </button>
                  <button
                    onClick={() => setSubPractice('aptitude')}
                    className={`flex-1 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                      subPractice === 'aptitude' ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/5' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    Aptitude Tests
                  </button>
                </div>

                {subPractice === 'compiler' ? (
                  <CompilerView 
                    lesson={activeLesson}
                    onCodeCompleted={(xpEarned) => {
                      handleLessonCheck(user.activeCourseId, activeLesson.id);
                      handleXpGain(xpEarned);
                    }}
                  />
                ) : (
                  <AptitudeView 
                    questions={INITIAL_APTITUDE}
                    onAnswerCorrect={handleXpGain}
                  />
                )}
              </div>
            )}

            {tab === 'career' && (
              <div className="space-y-6">
                <div className="flex gap-2 border-b border-slate-200 pb-3 max-w-sm">
                  <button
                    onClick={() => setSubCareer('coach')}
                    className={`flex-1 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                      subCareer === 'coach' ? 'bg-blue-600 border-blue-600 text-white shadow-md border-transparent font-bold' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    AI Interview Prep
                  </button>
                  <button
                    onClick={() => setSubCareer('projects')}
                    className={`flex-1 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                      subCareer === 'projects' ? 'bg-blue-600 border-blue-600 text-white shadow-md border-transparent font-bold' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    Mini-Projects
                  </button>
                </div>

                {subCareer === 'coach' ? (
                  <InterviewView />
                ) : (
                  <MiniProjects 
                    projects={INITIAL_PROJECTS}
                    onProjectDone={handleXpGain}
                  />
                )}
              </div>
            )}

            {tab === 'profile' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                  {[
                    { name: 'achievements' as const, label: 'Achievements' },
                    { name: 'guilds' as const, label: 'Coherent Guilds' },
                    { name: 'analytics' as const, label: 'Performance Analytics' },
                    { name: 'settings' as const, label: 'Settings' }
                  ].map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => setSubProfile(sub.name)}
                      className={`text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer ${
                        subProfile === sub.name ? 'bg-blue-600 border-blue-600 text-white shadow-md border-transparent' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {subProfile === 'achievements' && (
                  <AchievementsView 
                    achievements={INITIAL_ACHIEVEMENTS}
                    userName={user.displayName}
                  />
                )}
                {subProfile === 'guilds' && (
                  <GuildsView 
                    initialGuilds={INITIAL_GUILDS}
                  />
                )}
                {subProfile === 'analytics' && (
                  <AnalyticsView 
                    user={user}
                  />
                )}
                {subProfile === 'settings' && (
                  <SettingsView 
                    user={user}
                    onSaveProfile={(updated) => setUser(prev => ({ ...prev, ...updated }))}
                    onResetProgress={() => {
                      setUser(INITIAL_USER);
                      alert("EVE historical logs and levels reset successfully.");
                      setTab('home');
                    }}
                    onSignOut={() => {
                      setUser(prev => ({ ...prev, isLoggedIn: false }));
                    }}
                  />
                )}
              </div>
            )}

          </div>

          {/* 3. RIGHT UTILITY RAIL: AI MENTOR EVE (DESKTOP) */}
          <aside className="w-[300px] shrink-0 bg-white border-l border-slate-200 p-6 hidden xl:flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Box container for the avatar mascot and description */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center flex flex-col items-center">
                
                {/* Visual Mascot character */}
                <div className="relative mb-3">
                  <div className="w-20 h-20 bg-blue-900 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                    <div className="absolute inset-0 bg-[#E0E7FF]"></div>
                    <div className="absolute top-5 left-1/3 w-8 h-12 bg-pink-100 rounded-full"></div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-4 border-b-2 border-slate-700"></div>
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-8 flex justify-between px-0.5">
                       <div className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"></div>
                       <div className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-md"></div>
                </div>

                <h3 className="font-heading font-extrabold text-sm text-slate-800 select-none">Eve · AI Advisor</h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Online Tutor</span>

                {/* Speech tail balloon */}
                <div className="mt-4 bg-white p-4 rounded-xl border border-slate-150 shadow-sm relative text-left">
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    "{getMentorSpeech()}"
                  </p>
                  <div className="absolute -left-1.5 top-5 w-3 h-3 bg-white border-l border-b border-slate-150 transform rotate-45"></div>
                </div>

              </div>

              {/* Upcoming schedules */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">UPCOMING TARGETS</p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 hover:scale-[1.01] transition-all rounded-xl cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <Terminal size={14} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-850 leading-tight">Technical Review • Python lists</h5>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider block">Tomorrow, 10:00 AM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 hover:scale-[1.01] transition-all rounded-xl cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <School size={14} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-850 leading-tight">Math Logic • Array Matrices</h5>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider block">Fri, 2:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky short review button panel */}
            <div className="pt-4 border-t border-slate-100">
               <button 
                 onClick={() => {
                   setTab('practice');
                   setSubPractice('compiler');
                 }}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-4 rounded-xl shadow-md transition-all active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
               >
                 LAUNCH INTERACTIVE COMPILER
               </button>
            </div>
          </aside>

        </div>
      </div>

      {/* 4. NAV DRAWER OVERLAY (MOBILE) */}
      {navDrawerOpen && (
        <div 
          onClick={() => setNavDrawerOpen(false)}
          className="fixed inset-0 bg-slate-950/40 z-[90] transition-opacity duration-300 md:hidden"
        ></div>
      )}

      {/* 5. NAVIGATION DRAWER MENU (MOBILE) */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white rounded-r-3xl shadow-2xl z-[100] transform transition-transform duration-300 flex flex-col p-6 gap-6 md:hidden ${
        navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 text-left">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-600 overflow-hidden shrink-0 shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
              alt="Ananya Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-slate-800 text-base leading-tight">{user.displayName}</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Level {user.level} Dev Mentor</p>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">{user.streak} day streak aced</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 text-left">
          {[
            { label: 'Platform Hub (EVE)', icon: Home, action: () => { setTab('home'); setNavDrawerOpen(false); } },
            { label: 'Learning Paths', icon: School, action: () => { setTab('learn'); setNavDrawerOpen(false); } },
            { label: 'Practice Compiler', icon: Terminal, action: () => { setTab('practice'); setSubPractice('compiler'); setNavDrawerOpen(false); } },
            { label: 'Aptitude Brain Tests', icon: Brain, action: () => { setTab('practice'); setSubPractice('aptitude'); setNavDrawerOpen(false); } },
            { label: 'AI Interview Coach', icon: Briefcase, action: () => { setTab('career'); setSubCareer('coach'); setNavDrawerOpen(false); } },
            { label: 'Achievements & Badges', icon: Trophy, action: () => { setTab('profile'); setSubProfile('achievements'); setNavDrawerOpen(false); } },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center gap-3 p-3.5 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-blue-600 font-semibold text-xs tracking-wide transition-all active:scale-[0.98]"
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => {
            setUser(prev => ({ ...prev, isLoggedIn: false }));
            setNavDrawerOpen(false);
          }}
          className="mt-auto p-4 border-2 border-dashed border-red-100 hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          Sign Out of Workspace
        </button>
      </div>

      {/* 6. RESPONSIVE MOBILE NOTIFICATION TAB BAR */}
      <nav className="fixed bottom-0 left-0 w-full flex md:hidden justify-around items-center px-4 pb-4 pt-2 bg-white border-t border-slate-200 shadow-xl z-50">
        {[
          { key: 'home' as const, icon: Home, label: 'Home' },
          { key: 'learn' as const, icon: School, label: 'Learn' },
          { key: 'practice' as const, icon: Terminal, label: 'Practice' },
          { key: 'career' as const, icon: Briefcase, label: 'Career' },
          { key: 'profile' as const, icon: User, label: 'Profile' },
        ].map((item) => {
          const isSelected = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 focus:outline-none ${
                isSelected 
                  ? 'text-blue-600 font-bold' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon size={18} className={isSelected ? 'text-blue-600' : ''} />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
