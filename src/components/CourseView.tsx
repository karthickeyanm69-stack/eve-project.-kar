import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, HelpCircle, Trophy, Award, Lock, CheckCircle, 
  ChevronRight, Compass, Sparkles, Heart, AlertTriangle, 
  RotateCcw, Code, ArrowRight, Play, Terminal, User, Users,
  Check, X, FileText, ArrowLeft, Flame
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

export interface StoryActiveCourse {
  lang: string;
  langIcon: string;
  storyId: string;
  storyName: string;
  storyIcon: string;
  progress: number;
  chapter: string;
  sessionDone: number;
  lives: number;
  nodes: Array<{
    type: 'session' | 'test' | 'final';
    num: number;
    label: string;
    sub: string;
    status: 'done' | 'active' | 'locked';
  }>;
}

const LANGUAGES = [
  { name: 'Python', icon: '🐍', status: 'Beginner friendly' },
  { name: 'Java', icon: '☕', status: 'OOP focused' },
  { name: 'JavaScript', icon: '⚡', status: 'Web essential' },
  { name: 'TypeScript', icon: '💎', status: 'Type-safe JS' },
  { name: 'Go', icon: '🚀', status: 'Fast systems' },
  { name: 'Rust', icon: '⚙️', status: 'Memory safe' },
];

const STORIES = [
  {
    id: 'katteri',
    name: 'Katteri Forest',
    genre: 'Tamil Folklore Horror',
    genreTag: 'HORROR',
    icon: '👻',
    color: '#9333ea',
    gradient: 'from-[#1e152e] via-[#2d1a4a] to-[#0f0a14]',
    accentColor: 'text-[#a855f7] border-[#a855f7]/20 bg-[#a855f7]/10',
    desc: 'Enter a cursed forest haunted by the Katteri spirit. Every lesson weakens the curse. Every test seals a haunted shrine.',
    chapters: ['Forest Entrance', 'Whispering Woods', 'Abandoned Temple', 'Haunted River', "Katteri's Castle"],
    rewards: ['Spirit Seals', 'Ancient Relics', 'Ghost Hunter Title'],
    villain: 'Katteri Spirit'
  },
  {
    id: 'ops',
    name: 'Operation Knowledge Strike',
    genre: 'Sci-Fi Shooter',
    genreTag: 'SCI-FI',
    icon: '🎯',
    color: '#dc2626',
    gradient: 'from-[#1a0a0a] via-[#330000] to-[#0c0404]',
    accentColor: 'text-[#ef4444] border-[#ef4444]/20 bg-[#ef4444]/10',
    desc: 'Knowledge servers are infected by the Chaos Virus. You are an elite agent — learning is military training.',
    chapters: ['Training Base', 'Desert Battlefield', 'Cyber Facility', 'Virus Stronghold', 'Final Assault'],
    rewards: ['Elite Weapons', 'Military Ranks', 'Combat Badges'],
    villain: 'Chaos Commander'
  },
  {
    id: 'planet',
    name: 'Lost Planet Academy',
    genre: 'Space Exploration',
    genreTag: 'SPACE',
    icon: '🪐',
    color: '#2563eb',
    gradient: 'from-[#0b1329] via-[#1c2a4a] to-[#070b14]',
    accentColor: 'text-[#3b82f6] border-[#3b82f6]/20 bg-[#3b82f6]/10',
    desc: 'Explore the forgotten alien civilization of Nova Prime. Each lesson restores planetary power.',
    chapters: ['Landing Zone', 'Crystal Forest', 'Sky Islands', 'Alien Ruins', 'Core Nexus'],
    rewards: ['Planet Artifacts', 'Explorer Titles', 'Robot Companions'],
    villain: 'Guardian AI'
  },
  {
    id: 'velocity',
    name: 'Velocity Academy',
    genre: 'Racing Championship',
    genreTag: 'RACING',
    icon: '🏁',
    color: '#ea580c',
    gradient: 'from-[#1c120c] via-[#3a200e] to-[#0c0805]',
    accentColor: 'text-[#f97316] border-[#f97316]/20 bg-[#f97316]/10',
    desc: 'Become a rookie racer. Programming knowledge upgrades your vehicle. Tests become championship races.',
    chapters: ['Training Track', 'City Circuit', 'Mountain Drift', 'Night Speedway', 'Grand Championship'],
    rewards: ['Racing Cars', 'Trophies', 'Racing Titles'],
    villain: 'Legendary Racer'
  },
  {
    id: 'kingdom',
    name: 'Kingdom of Coders',
    genre: 'Fantasy RPG',
    genreTag: 'FANTASY',
    icon: '⚔️',
    color: '#059669',
    gradient: 'from-[#091f15] via-[#123e2a] to-[#04100b]',
    accentColor: 'text-[#10b981] border-[#10b981]/20 bg-[#10b981]/10',
    desc: 'You are a young adventurer in an ancient kingdom. Programming lessons unlock magic spells.',
    chapters: ['Village', 'Forest', 'Wizard Tower', 'Dragon Mountain', 'Royal Castle'],
    rewards: ['Magic Spells', 'Legendary Weapons', 'Kingdom Titles'],
    villain: 'Dark Wizard'
  },
  {
    id: 'cyber',
    name: 'Cyberpunk Resistance',
    genre: 'Hacker Adventure',
    genreTag: 'CYBERPUNK',
    icon: '⚡',
    color: '#0891b2',
    gradient: 'from-[#06151f] via-[#0b2b3b] to-[#030a10]',
    accentColor: 'text-[#06b6d4] border-[#06b6d4]/20 bg-[#06b6d4]/10',
    desc: 'A rogue AI controls Neo City. Join the resistance — programming skills become hacking powers.',
    chapters: ['Neon Streets', 'Data District', 'AI Facility', 'Digital Underworld', 'Core Network'],
    rewards: ['Cyber Gear', 'Hacking Skills', 'Resistance Badges'],
    villain: 'Rogue AI'
  },
];

const INITIAL_NODES = [
  { type: 'session' as const, num: 1, label: 'Session 1', sub: 'Variables & Data Types', status: 'active' as const },
  { type: 'session' as const, num: 2, label: 'Session 2', sub: 'Operators & Expressions', status: 'locked' as const },
  { type: 'session' as const, num: 3, label: 'Session 3', sub: 'Control Flow', status: 'locked' as const },
  { type: 'test' as const, num: 1, label: 'Knowledge Test 1', sub: 'Sessions 1–3 Trivia', status: 'locked' as const },
  { type: 'session' as const, num: 4, label: 'Session 4', sub: 'Loops & Iteration', status: 'locked' as const },
  { type: 'session' as const, num: 5, label: 'Session 5', sub: 'Functions & Routines', status: 'locked' as const },
  { type: 'session' as const, num: 6, label: 'Session 6', sub: 'Collections & Lists', status: 'locked' as const },
  { type: 'test' as const, num: 2, label: 'Knowledge Test 2', sub: 'Sessions 4–6 Trivia', status: 'locked' as const },
  { type: 'session' as const, num: 7, label: 'Session 7', sub: 'File I/O Streams', status: 'locked' as const },
  { type: 'session' as const, num: 8, label: 'Session 8', sub: 'Error & Exception Gates', status: 'locked' as const },
  { type: 'session' as const, num: 9, label: 'Session 9', sub: 'OOP Structures', status: 'locked' as const },
  { type: 'final' as const, num: 1, label: 'Final Test & Crown', sub: 'Earn Your Digital Certificate', status: 'locked' as const },
];

export default function CourseView({ 
  user, 
  setUser, 
  handleXpGain 
}: CourseViewProps) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedLangIcon, setSelectedLangIcon] = useState<string>('🐍');
  const [pendingStory, setPendingStory] = useState<typeof STORIES[0] | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<StoryActiveCourse | null>(null);

  // In-session or quiz states
  const [viewState, setViewState] = useState<'hub' | 'story-select' | 'map' | 'session' | 'quiz' | 'cert'>('hub');
  const [activeNodeIdx, setActiveNodeIdx] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // XP Float Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  const getNodesList = () => {
    return INITIAL_NODES.map((node, i) => {
      if (i === 0) return { ...node, status: 'active' as const };
      return { ...node, status: 'locked' as const };
    });
  };

  const selectLanguage = (name: string, icon: string) => {
    setSelectedLang(name);
    setSelectedLangIcon(icon);
    
    // Check if user already has an active adventure of this language
    if (activeCourse && activeCourse.lang === name) {
      setViewState('map');
    } else {
      setViewState('story-select');
    }
  };

  const proposeStorySelection = (story: typeof STORIES[0]) => {
    setPendingStory(story);
    setConfirmModalOpen(true);
  };

  const confirmAndStartAdventure = () => {
    if (!pendingStory || !selectedLang) return;
    
    const newCourse: StoryActiveCourse = {
      lang: selectedLang,
      langIcon: selectedLangIcon,
      storyId: pendingStory.id,
      storyName: pendingStory.name,
      storyIcon: pendingStory.icon,
      progress: 0,
      chapter: `Chapter 1: ${pendingStory.chapters[0]}`,
      sessionDone: 0,
      lives: 5,
      nodes: getNodesList(),
    };

    setActiveCourse(newCourse);
    setConfirmModalOpen(false);
    setViewState('map');
    
    // Sync to user state in App.tsx
    if (setUser) {
      setUser((prev: any) => ({
        ...prev,
        activeCourseId: `story-${pendingStory.id}`,
      }));
    }

    triggerToast(`🗺️ Adventure Started! +100 XP`);
    if (handleXpGain) handleXpGain(100);
  };

  // Helper functions for content simulation
  const getSessionSlides = (storyId: string, lang: string, sessionNum: number) => {
    const story = STORIES.find(s => s.id === storyId) || STORIES[0];
    const topics: Record<number, string> = {
      1: 'Variables & Data Types',
      2: 'Operators & Expressions',
      3: 'Control Flow (If/Else Conditions)',
      4: 'Loops & Fast Iterators',
      5: 'Functions & Reusable Blocks',
      6: 'Collections & Dynamic Lists',
      7: 'File Streams & Systems',
      8: 'Fault Gates & Exception Guards',
      9: 'OOP & Real Classes'
    };
    const topic = topics[sessionNum] || 'Advanced Algorithms';

    const pythonCode: Record<number, string> = {
      1: `# Creating Python variables\nhero_name = "Agent Alpha"\nshield_level = 100\ncritical_power = 95.8\ngate_unlocked = True\n\nprint(f"User {hero_name} deployed. Power: {critical_power}%")`,
      2: `# Python arithmetic and logical gates\na = 11\nb = 3\nforce_power = a ** b # raising power\nremaining_bits = a % b # modulo\n\nprint(force_power)  # 1331\nprint(remaining_bits) # 2`,
      3: `# Python condition branches\nhp_percentage = 45\n\nif hp_percentage > 75:\n    print("Shield active")\nelif hp_percentage > 25:\n    print("Armor degraded, warning!")\nelse:\n    print("Critical core collapse imminent!")`
    };

    const javascriptCode: Record<number, string> = {
      1: `// Creating JavaScript variables\nconst heroName = "Agent Alpha";\nlet shieldLevel = 100;\nlet criticalPower = 95.8;\nconst gateUnlocked = true;\n\nconsole.log(\`User \${heroName} deployed. Power: \${criticalPower}%\`);`,
      2: `// JavaScript arithmetic and logical elements\nconst a = 11;\nconst b = 3;\nconst forcePower = a ** b; // exponential\nconst remainingBits = a % b; // remainder\n\nconsole.log(forcePower);  // 1331\nconsole.log(remainingBits); // 2`,
      3: `// JavaScript condition structures\nlet hpPercentage = 45;\n\nif (hpPercentage > 75) {\n  console.log("Shield active");\n} else if (hpPercentage > 25) {\n  console.log("Armor degraded, warning!");\n} else {\n  console.log("Critical core collapse imminent!");\n}`
    };

    const defaultCode = (num: number) => {
      if (lang === 'Python') {
        return `# ${topic} in Python\ndef execute_task(data):\n    # Core session ${num} solution\n    results = []\n    for item in data:\n        results.append(item * 2)\n    return results\n\nprint(execute_task([1, 2, 3]))`;
      }
      return `// ${topic} in ${lang}\nfunction executeTask(data) {\n  // Core session ${num} solution\n  return data.map(item => item * 2);\n}\n\nconsole.log(executeTask([1, 2, 3]));`;
    };

    const codeSource = lang === 'Python' ? pythonCode : javascriptCode;
    const codeSample = codeSource[sessionNum] || defaultCode(sessionNum);

    const activeChapter = story.chapters[Math.min(Math.floor((sessionNum - 1) / 2), story.chapters.length - 1)];

    return [
      {
        type: 'story',
        title: `Adventure Objective`,
        scene: activeChapter,
        dialogue: `Brave seeker, lesson ${sessionNum} of our campaign is offline! We must unlock the properties of: "${topic}". Defeating ${story.villain} requires precision syntax execution! Keep your focus constant!`,
        content: `Today, in this section, we study how ${topic} governs computing mechanics in ${lang}. Read through the active simulator example step-by-step and memorize the compiler flags.`
      },
      {
        type: 'code',
        title: 'Core Code Terminal',
        scene: '📟 Sandbox Code Tracker',
        content: `Analyze the valid ${lang} source script in the visual console emulator below. Pay careful attention to structural indentation, keyword bounds, and assignments.`,
        code: codeSample
      },
      {
        type: 'takeaway',
        title: 'Core Takeaways',
        scene: '💡 Key Concept Formula',
        points: [
          `Solidify your understanding of key blocks governing ${topic} parameters.`,
          `Avoid invalid lexical errors inside real ${lang} executions.`,
          `Your correct answers on next node quiz will restore depleted vital heart shields.`
        ]
      }
    ];
  };

  const getQuizData = (lang: string) => {
    return [
      {
        q: `In ${lang}, which variable definition block is syntactically valid?`,
        opts: [
          lang === 'Python' ? 'var x = 5' : 'const x: int = 5',
          lang === 'Python' ? 'int x = 5' : 'let x === 5',
          lang === 'Python' ? 'x = 5' : 'let x = 5',
          lang === 'Python' ? 'integer x = 5' : 'const let x = 5'
        ],
        correct: 2,
        exp: `${lang} parses declarations elegantly. In Python, variables are initialized with a simple '=', with dynamic type inferences. In JavaScript/TypeScript, 'let' or 'const' is used.`
      },
      {
        q: `What does the comparison expression \`10 > 5 and 5 < 2\` evaluate to in ${lang}?`,
        opts: [
          'True / true',
          'False / false',
          'None / null',
          'SyntaxError / Compilation Failures'
        ],
        correct: 1,
        exp: `The Left side (10 > 5) evaluates to True, but the Right side (5 < 2) is False. Since the dynamic AND logic operator requires both conditions to be truthy, it results in False.`
      },
      {
        q: `Which cycle is optimized for iterating through complete array lists or sequence nodes without manual counter increments?`,
        opts: [
          'While loops',
          'Recursive procedures',
          'For loops / For Each iterations',
          'Switch conditions'
        ],
        correct: 2,
        exp: `'for' range loops or sequential iterators automatically read items from sequences element-by-element, ensuring optimal cycle counts.`
      }
    ];
  };

  // Node Actions
  const handleNodeClick = (idx: number) => {
    if (!activeCourse) return;
    const node = activeCourse.nodes[idx];
    if (node.status === 'locked') {
      triggerToast('🔒 Complete previous milestones to unlock this sector!');
      return;
    }

    setActiveNodeIdx(idx);
    if (node.type === 'session') {
      setSlideIndex(0);
      setViewState('session');
    } else {
      setQuizIndex(0);
      setQuizAnswered(false);
      setSelectedQuizOpt(null);
      setQuizScore(0);
      setViewState('quiz');
    }
  };

  // Slide interactions
  const handleNextSlide = () => {
    setSlideIndex(prev => prev + 1);
  };

  const handlePrevSlide = () => {
    setSlideIndex(prev => prev - 1);
  };

  const completeActiveSession = () => {
    if (activeNodeIdx === null || !activeCourse) return;
    
    const updatedNodes = [...activeCourse.nodes];
    updatedNodes[activeNodeIdx].status = 'done';
    
    // Unlock next node
    if (activeNodeIdx + 1 < updatedNodes.length) {
      updatedNodes[activeNodeIdx + 1].status = 'active';
    }

    const currentSessionsCompleted = activeCourse.sessionDone + 1;
    const pct = Math.floor((currentSessionsCompleted / 9) * 100);

    const updatedCourse: StoryActiveCourse = {
      ...activeCourse,
      nodes: updatedNodes,
      sessionDone: currentSessionsCompleted,
      progress: Math.min(pct, 95),
      chapter: activeNodeIdx + 1 < updatedNodes.length 
        ? `Chapter ${Math.ceil((activeNodeIdx + 2) / 2)}: ${STORIES.find(s => s.id === activeCourse.storyId)?.chapters[Math.min(Math.floor((activeNodeIdx + 1) / 2), 4)]}`
        : activeCourse.chapter
    };

    setActiveCourse(updatedCourse);
    setViewState('map');
    triggerToast(`⚡ Node Complete! +25 XP`);
    if (handleXpGain) handleXpGain(25);
  };

  // Quiz interactions
  const handleSelectOption = (optIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOpt(optIdx);
    setQuizAnswered(true);

    const questions = getQuizData(activeCourse?.lang || 'Python');
    const question = questions[quizIndex];

    if (optIdx === question.correct) {
      setQuizScore(prev => prev + 1);
      triggerToast(`💚 Correct explanation restored! +35 XP`);
      if (handleXpGain) handleXpGain(35);
    } else {
      // Lose a heart/shield
      if (activeCourse) {
        const nextLives = Math.max(0, activeCourse.lives - 1);
        setActiveCourse(prev => prev ? { ...prev, lives: nextLives } : null);
        triggerToast(`💥 Heart Lost! Code integrity warning`);
      }
    }
  };

  const handleNextQuestion = () => {
    const questions = getQuizData(activeCourse?.lang || 'Python');
    if (quizIndex < questions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswered(false);
      setSelectedQuizOpt(null);
    } else {
      // Quiz finished
      if (!activeCourse || activeNodeIdx === null) return;
      
      const updatedNodes = [...activeCourse.nodes];
      updatedNodes[activeNodeIdx].status = 'done';
      
      if (activeNodeIdx + 1 < updatedNodes.length) {
        updatedNodes[activeNodeIdx + 1].status = 'active';
      }

      const isFinal = activeCourse.nodes[activeNodeIdx].type === 'final';

      const updatedCourse: StoryActiveCourse = {
        ...activeCourse,
        nodes: updatedNodes,
        progress: isFinal ? 100 : activeCourse.progress
      };

      setActiveCourse(updatedCourse);

      if (isFinal) {
        setViewState('cert');
        if (handleXpGain) handleXpGain(300);
      } else {
        setViewState('map');
        triggerToast(`👑 Test Cleared successfully! +100 XP`);
        if (handleXpGain) handleXpGain(100);
      }
    }
  };

  const abortChallenge = () => {
    setViewState('map');
  };

  const completeGraduation = () => {
    // Reset active course back to choosing languages for high replay value
    setActiveCourse(null);
    setSelectedLang(null);
    setViewState('hub');
    triggerToast(`🎓 Level graduation compiled successfully!`);
    
    // Add certificate count to global user profile
    if (setUser) {
      setUser((prev: any) => ({
        ...prev,
        badgesCount: prev.badgesCount + 1,
        activeCourseId: 'python-basics' // default fallback
      }));
    }
  };

  return (
    <div id="story-campaign-module" className="space-y-6 select-none relative font-sans text-slate-800">
      
      {/* Dynamic Floating Toast System */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-[200] max-w-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-blue-500/30"
          >
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION OVERLAY MODAL */}
      <AnimatePresence>
        {confirmModalOpen && pendingStory && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white border border-slate-200 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 shadow-lg border border-slate-100"
                style={{ background: pendingStory.gradient }}
              >
                {pendingStory.icon}
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight leading-none mb-2">
                Launch {pendingStory.name}?
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-5">
                Prepare to bind {selectedLang} to this campaign narrative. You'll master variables, operators and arrays to defeat {pendingStory.villain}.
              </p>

              <div className="bg-red-50 border border-red-200/50 p-4 rounded-2xl mb-6 text-left">
                <div className="flex gap-2.5 items-start">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-red-900 uppercase tracking-wide leading-none">Campaign Lock Active:</h5>
                    <p className="text-[10px] text-red-700 leading-normal mt-1.5 font-medium">
                      Once initiated, you must clear the core nodes to switch storylines. Prepare your variables carefully!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-650 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAndStartAdventure}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:opacity-95 rounded-xl font-black text-xs uppercase tracking-wide shadow-md"
                >
                  Confirm Adventure
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── VIEW 1: HUB LANDING PATH ── */}
      {viewState === 'hub' && (
        <div className="space-y-6">
          <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-center">
              <Compass size={240} className="text-white shrink-0 scale-125 rotate-12" />
            </div>
            <div className="relative z-10 max-w-xl text-left">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-300">
                <Sparkles size={11} className="text-yellow-400" /> Story-Based Campaigns
              </div>
              <h2 className="font-heading font-black text-3xl tracking-tight text-white mt-3.5">
                Immersion Learning Path
              </h2>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-2">
                Replace linear reading cards with interactive fiction campaigns. Upgrading variables and looping structures boosts performance shields and heals vital core integrity.
              </p>
            </div>
          </section>

          {/* Active Campaign Box */}
          {activeCourse ? (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.002] text-left">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                    {activeCourse.storyIcon}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase mt-1">
                      <span>{activeCourse.langIcon}</span>
                      <span>{activeCourse.lang} Active Path</span>
                    </div>
                    <h3 className="font-heading font-black text-lg text-slate-900 mt-2 tracking-tight">
                      {activeCourse.storyName} Campaign
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">
                      {activeCourse.chapter}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Campaign Shields</span>
                    <span className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1 mt-0.5 justify-end">
                      {'❤️'.repeat(activeCourse.lives)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 mx-1"></div>
                  <button 
                    onClick={() => setViewState('map')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase py-3.5 px-6 rounded-xl shadow-md flex items-center gap-2 tracking-wider transition-all active:translate-y-0.5 cursor-pointer"
                  >
                    Enter Campaign
                    <Play size={12} fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* Progress Level Bar */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>Progress map completions</span>
                  <span>{activeCourse.progress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${activeCourse.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAFC] border-2 border-dashed border-slate-250 p-8 rounded-3xl text-center text-slate-400">
              <Compass size={40} className="mx-auto text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">No Active Adventure Course</h4>
              <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto leading-relaxed">
                Unlock immersive story modes. Select a target coding language below to activate your interactive story sandbox path now!
              </p>
            </div>
          )}

          {/* Languages Grid Section */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-left mb-3.5">
              Available Adventure Paths
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {LANGUAGES.map((lang) => {
                const isCurrent = activeCourse?.lang === lang.name;
                return (
                  <button 
                    key={lang.name}
                    onClick={() => selectLanguage(lang.name, lang.icon)}
                    className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md cursor-pointer ${
                      isCurrent 
                        ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10' 
                        : 'bg-white border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-2xl shrink-0">
                      {lang.icon}
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-slate-850 tracking-tight leading-none mt-1">
                        {lang.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                        {lang.status}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive features card */}
          <section className="bg-white p-6 rounded-3xl border border-slate-150">
            <h4 className="font-heading font-black text-sm text-slate-800 text-left mb-4 uppercase tracking-wider">
              Course Structure Details
            </h4>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-150 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📖</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Reading sessions (1 - 9)</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Dialogue narratives and live formatted console coding studies.</p>
                  </div>
                </div>
                <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 py-1 rounded-md uppercase tracking-wider">9 Nodes</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-150 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📝</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Trivia Knowledge Tests (1 - 3)</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Interactive check blocks with damage mechanics on incorrect submissions.</p>
                  </div>
                </div>
                <span className="text-[9px] bg-amber-50 border border-amber-100/50 text-amber-655 font-bold px-2 py-1 rounded-md uppercase tracking-wider">3 Nodes</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-150 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏆</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Comprehensive Graduation</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Final comprehensive check releasing custom diploma badges +300 XP.</p>
                  </div>
                </div>
                <span className="text-[9px] bg-green-50 border border-green-150 text-green-600 font-bold px-2 py-1 rounded-md uppercase tracking-wider">1 Certificate</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── VIEW 2: STORY SELECT SCREEN ── */}
      {viewState === 'story-select' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200">
            <div className="text-left">
              <button 
                onClick={() => setViewState('hub')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-1.5"
              >
                <ArrowLeft size={14} /> Back to languages
              </button>
              <h2 className="font-heading font-black text-xl text-slate-900 tracking-tight leading-none mt-2">
                Select {selectedLang} Story Module
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">
                Choose your adventure atmosphere
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              {selectedLangIcon}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {STORIES.map((story) => (
              <div 
                key={story.id}
                onClick={() => proposeStorySelection(story)}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.015] flex flex-col justify-between"
              >
                {/* Visual top border */}
                <div className={`h-24 bg-gradient-to-r ${story.gradient} flex items-center justify-center relative`}>
                  <span className="text-5xl filter drop-shadow-md">{story.icon}</span>
                  <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest">
                    {story.genreTag}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider leading-none">
                      {story.genre}
                    </span>
                    <h3 className="font-heading font-black text-base text-slate-850 mt-1.5 tracking-tight leading-snug">
                      {story.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-2">
                      {story.desc}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
                    <div className="flex gap-2">
                      {story.rewards.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="bg-slate-50 border border-slate-150 rounded-lg text-[9px] font-extrabold text-slate-500 px-2 py-1">
                          🎁 {item}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        proposeStorySelection(story);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase px-4 py-2.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
                    >
                      Begin Story <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW 3: IN-GAME CAMPAIGN MAP ── */}
      {viewState === 'map' && activeCourse && (
        <div className="space-y-6">
          {/* Header Progress Strip info */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 text-left relative overflow-hidden">
            <div className="absolute right-4 bottom-[-16px] pointer-events-none opacity-10">
              <Compass size={130} />
            </div>
            <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
              <div className="flex gap-3.5 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl">
                  {activeCourse.storyIcon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-300 text-[10px] font-black tracking-widest uppercase">
                    <span>{activeCourse.langIcon}</span>
                    <span>{activeCourse.lang} Active Campaign</span>
                  </div>
                  <h2 className="font-heading font-black text-xl text-white tracking-tight leading-none mt-2">
                    {activeCourse.storyName}
                  </h2>
                  <p className="text-[11px] text-slate-300 font-bold mt-1.5">
                    {activeCourse.chapter}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Vital Integrity</span>
                  <div className="text-sm font-extrabold tracking-tight mt-1 flex gap-1 justify-end animate-pulse">
                    {'❤️'.repeat(activeCourse.lives)}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <button 
                  onClick={() => setViewState('hub')}
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-[10px] uppercase px-4 py-3 rounded-xl transition-all"
                >
                  Change Language
                </button>
              </div>
            </div>

            {/* Micro Progress Bar inside header */}
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex justify-between text-[11px] text-slate-350 font-bold mb-1.5">
                <span>Core Nodes Unlocked (Completed)</span>
                <span>{activeCourse.progress}% Completed</span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeCourse.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interactive path node timeline block */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl relative overflow-hidden">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-left mb-6 flex items-center gap-2">
              <Terminal size={14} className="text-blue-600" /> Progression Track Timeline
            </h3>

            {/* Double column timeline connector path */}
            <div className="relative space-y-6 pt-2 before:absolute before:left-9 before:top-4 before:bottom-4 before:w-1 before:bg-slate-100 text-left">
              {activeCourse.nodes.map((node, i) => {
                const isActive = node.status === 'active';
                const isDone = node.status === 'done';
                const isLocked = node.status === 'locked';

                let nodeIcon = <Lock size={15} />;
                if (isDone) nodeIcon = <CheckCircle size={18} className="text-green-500" />;
                else if (isActive) {
                  if (node.type === 'session') nodeIcon = <BookOpen size={16} className="text-blue-500" />;
                  else if (node.type === 'test') nodeIcon = <HelpCircle size={16} className="text-amber-500" />;
                  else nodeIcon = <Trophy size={16} className="text-green-600" />;
                }

                return (
                  <motion.div 
                    key={node.label + i}
                    whileHover={!isLocked ? { x: 4 } : {}}
                    onClick={() => handleNodeClick(i)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                      isLocked 
                        ? 'bg-slate-50/50 border-slate-150 cursor-not-allowed opacity-65' 
                        : isActive 
                          ? 'bg-blue-50/20 border-blue-200 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/10 cursor-pointer pointer-events-auto' 
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer'
                    }`}
                  >
                    {/* Circle Orb */}
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 z-10 transition-colors ${
                      isDone 
                        ? 'bg-green-50 border-green-200 text-green-600' 
                        : isActive 
                          ? 'bg-white border-blue-500 text-blue-600 shadow-sm animate-pulse' 
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {nodeIcon}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                            isDone ? 'text-green-600' : 'text-slate-400'
                          }`}>
                            Milestone Node {i + 1} · {node.type.toUpperCase()}
                          </span>
                          <h4 className={`font-heading font-extrabold text-sm mt-0.5 tracking-tight ${
                            isLocked ? 'text-slate-400' : 'text-slate-900'
                          }`}>
                            {node.label}
                          </h4>
                          <p className="text-xs text-slate-450 mt-1 font-semibold block">
                            {node.sub}
                          </p>
                        </div>

                        {!isLocked && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            isDone 
                              ? 'bg-green-50 text-green-600 border-green-200/50' 
                              : isActive 
                                ? 'bg-blue-600 text-white border-blue-500' 
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {isDone ? 'Complete' : isActive ? 'Enter Now' : 'Unlocked'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <button 
              onClick={() => setViewState('hub')}
              className="mt-8 select-none border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all w-full md:max-w-xs mx-auto text-center"
            >
              <ArrowLeft size={14} /> Back to Hub Choose Mode
            </button>
          </div>
        </div>
      )}

      {/* ── VIEW 4: ACTIVE SESSION LECTURE SLIDES ── */}
      {viewState === 'session' && activeCourse && activeNodeIdx !== null && (
        <div className="max-w-2xl mx-auto space-y-6 text-left">
          {/* Top session back grid bar */}
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 mb-2">
            <button 
              onClick={() => setViewState('map')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={14} /> Abort Campaign Node
            </button>
            <div className="flex items-center gap-2 text-xs font-black text-slate-700 tracking-wider">
              <span>LECTURE SESSION</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{slideIndex + 1} / 3</span>
            </div>
          </div>

          {/* Interactive Slide Panel Render */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={slideIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[340px] flex flex-col justify-between"
            >
              {/* Slide Contents matching type */}
              {(() => {
                const slides = getSessionSlides(activeCourse.storyId, activeCourse.lang, activeCourse.nodes[activeNodeIdx].num);
                const slide = slides[slideIndex];

                if (slide.type === 'story') {
                  return (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                          {slide.title}
                        </span>
                        <span className="text-xs text-slate-400 font-extrabold tracking-tight">
                          📍 {slide.scene}
                        </span>
                      </div>

                      {/* Mascot dialogue bubble structure */}
                      <div className="flex gap-4 items-start bg-slate-50/50 p-5 rounded-2xl border border-slate-150">
                        <div className="w-12 h-12 rounded-full border border-slate-150 flex items-center justify-center text-3xl shrink-0 bg-white shadow-sm">
                          {activeCourse.storyIcon}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                            Advisor Dialogue Signal:
                          </h5>
                          <p className="text-xs text-slate-700 font-black leading-relaxed italic mt-1">
                            "{slide.dialogue}"
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description Block:</h4>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-1.5">
                          {slide.content}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (slide.type === 'code') {
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                          {slide.title}
                        </span>
                        <span className="text-xs text-slate-400 font-extrabold tracking-tight">
                          {slide.scene}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {slide.content}
                      </p>

                      {/* Code visual console matching CSS dark styles */}
                      <div className="bg-[#0f0f1c] text-[#a8d8a8] border border-slate-800 rounded-2xl p-5 font-mono text-xs shadow-inner overflow-x-auto leading-relaxed relative">
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-650 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-450 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                        </div>
                        <span className="text-[9px] text-[#8884a0] uppercase tracking-widest font-bold border-b border-white/5 pb-1 mb-3.5 block">
                          SYSTEM CONSOLE COMPILER
                        </span>
                        <pre className="whitespace-pre">{slide.code}</pre>
                      </div>
                    </div>
                  );
                }

                if (slide.type === 'takeaway') {
                  return (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                          {slide.title}
                        </span>
                        <span className="text-xs text-slate-400 font-extrabold tracking-tight">
                          {slide.scene}
                        </span>
                      </div>

                      <div className="p-5 bg-green-50/10 border border-green-200/50 rounded-2xl space-y-3.5">
                        <h5 className="text-[10px] font-extrabold text-[#2ecc71] tracking-widest uppercase">
                          Important Formulas to remember
                        </h5>
                        <ul className="space-y-3">
                          {slide.points.map((point: string, id: number) => (
                            <li key={id} className="flex gap-2 text-xs font-semibold text-slate-700 leading-normal items-start">
                              <CheckCircle size={15} className="text-[#2ecc71] shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                }

                return null;
              })()}

              {/* Navigation Action Buttons footer */}
              <div className="mt-8 border-t border-slate-150 pt-5 flex justify-between items-center">
                {/* Dots index indicator */}
                <div className="flex gap-1.5 shrink-0">
                  {[0, 1, 2].map(idx => (
                    <span 
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx < slideIndex 
                          ? 'w-2 bg-blue-600/50' 
                          : idx === slideIndex 
                            ? 'w-6 bg-blue-600' 
                            : 'w-2 bg-slate-205'
                      }`}
                    ></span>
                  ))}
                </div>

                <div className="flex gap-3.5">
                  {slideIndex > 0 && (
                    <button 
                      onClick={handlePrevSlide}
                      className="py-2.5 px-5 border border-slate-205 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs"
                    >
                      Back
                    </button>
                  )}
                  {slideIndex < 2 ? (
                    <button 
                      onClick={handleNextSlide}
                      className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      Continue <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button 
                      onClick={completeActiveSession}
                      className="py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-md shadow-green-500/10"
                    >
                      Complete Session <CheckCircle size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── VIEW 5: ACTIVE QUIZ WORKSPACE ── */}
      {viewState === 'quiz' && activeCourse && activeNodeIdx !== null && (
        <div className="max-w-2xl mx-auto space-y-6 text-left">
          
          {/* Active stats details panel */}
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200">
            <button 
              onClick={abortChallenge}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={14} /> Cancel Test
            </button>
            <div className="flex items-center gap-4">
              <div className="flex gap-1 items-center font-bold text-xs">
                <span className="text-slate-450 uppercase tracking-wider">Integrity:</span>
                <span className="flex gap-0.5">{'❤️'.repeat(activeCourse.lives)}</span>
              </div>
            </div>
          </div>

          {/* Core quiz question renderer */}
          {(() => {
            const questions = getQuizData(activeCourse.lang);
            const question = questions[quizIndex];
            if (!question) return null;

            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6"
              >
                {/* Header progress tracker */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                      ACTIVE EVALUATION
                    </span>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                      Question {quizIndex + 1} of {questions.length}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Accuracy Score: <span className="text-green-600 font-extrabold">{quizScore} / {quizIndex}</span>
                  </span>
                </div>

                {/* Question title */}
                <h3 className="font-heading font-extrabold text-slate-900 text-base leading-snug">
                  {question.q}
                </h3>

                {/* Multiple Options list */}
                <div className="flex flex-col gap-3">
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
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          quizAnswered 
                            ? showSuccess
                              ? 'bg-green-50/70 border-green-500 text-green-900 font-bold'
                              : showFail
                                ? 'bg-red-50/70 border-red-500 text-red-900 font-bold'
                                : 'bg-slate-50/10 border-slate-150 text-slate-400 cursor-not-allowed opacity-75'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/20 cursor-pointer pointer-events-auto'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Key circle letter indicators */}
                          <div className={`w-7 h-7 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 ${
                            quizAnswered
                              ? showSuccess
                                ? 'bg-green-500 border-green-500 text-white'
                                : showFail
                                  ? 'bg-red-500 border-red-500 text-white'
                                  : 'bg-slate-100 border-slate-200 text-slate-400'
                              : isSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}>
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </div>
                          <span className="text-xs font-semibold leading-relaxed">{opt}</span>
                        </div>

                        {quizAnswered && (
                          <div className="shrink-0 ml-3">
                            {showSuccess && <Check size={16} className="text-green-600" />}
                            {showFail && <X size={16} className="text-red-500" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback explanation card */}
                {quizAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed font-semibold transition-colors ${
                      selectedQuizOpt === question.correct 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex gap-2.5 items-start">
                      {selectedQuizOpt === question.correct 
                        ? <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                        : <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
                      }
                      <div>
                        <h5 className="font-bold text-[10px] uppercase tracking-wider mb-1.5">
                          {selectedQuizOpt === question.correct ? 'Correct Answer Explanation' : 'Code Compilation Failed!'}
                        </h5>
                        <p>{question.exp}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Footer Proceed button */}
                {quizAnswered && (
                  <div className="text-right">
                    <button 
                      onClick={handleNextQuestion}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md inline-flex items-center gap-1.5 transition-all"
                    >
                      {quizIndex < questions.length - 1 ? 'Next Question' : 'Finish Test Suite'}
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* ── VIEW 6: COMPLETED GRADUATION CERTIFICATE VIEW ── */}
      {viewState === 'cert' && activeCourse && (
        <div className="max-w-2xl mx-auto space-y-6 text-left">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl border border-yellow-500/30 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Visual Gold Ornaments styling */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,180,41,0.06)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="w-24 h-24 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-full mx-auto flex items-center justify-center text-5xl mb-6 shadow-xl border-4 border-white/10 relative">
              🏆
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-slate-900">
                <Check size={14} className="text-white" />
              </div>
            </div>

            <span className="text-[10px] font-black text-yellow-400 block tracking-widest uppercase">
              CERTIFICATE OF COMPLETION
            </span>
            <h1 className="font-heading font-black text-2xl text-white mt-3.5 tracking-tight">
              {activeCourse.lang} campaign Master
            </h1>
            <p className="text-xs text-slate-350 font-semibold max-w-sm mx-auto leading-relaxed mt-2.5">
              Awarded to <span className="text-slate-100 font-extrabold">{user.displayName}</span> for conquering the cursed narrative paths of the {activeCourse.storyName} campaign successfully.
            </p>

            <hr className="border-t border-white/5 my-6 max-w-md mx-auto" />

            {/* Achievement Statistics counters */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <span className="font-heading font-black text-lg text-yellow-400 tracking-tight block">9 / 9</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Sessions</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <span className="font-heading font-black text-lg text-yellow-400 tracking-tight block">+300 XP</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Graduation</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <span className="font-heading font-black text-lg text-yellow-400 tracking-tight block">A+ Pass</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Difficulty</span>
              </div>
            </div>

            <hr className="border-t border-white/5 my-6 max-w-md mx-auto" />

            <button 
              onClick={completeGraduation}
              className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 hover:opacity-95 text-slate-950 font-black text-xs uppercase py-4 px-8 rounded-2xl tracking-wider shadow-lg shadow-amber-500/10 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              🎉 Create New Adventure Path
            </button>
            
            <p className="text-[9px] text-slate-450 mt-4 uppercase tracking-widest font-black block">
              EVE PLATFORM SECURED SYSTEMS
            </p>
          </motion.div>
        </div>
      )}

    </div>
  );
}
