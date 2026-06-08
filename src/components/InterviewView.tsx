import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Bot, User, Volume2, Sparkles, AlertCircle, RefreshCw, ChevronRight, Play, Terminal, HelpCircle } from 'lucide-react';

export default function InterviewView() {
  const [category, setCategory] = useState<'Technical' | 'HR Round' | 'System Design'>('Technical');
  const [messages, setMessages] = useState<Array<{ role: 'interviewer' | 'user'; text: string }>>([
    {
      role: 'interviewer',
      text: "Welcome back, Ananya. Let's dive into a technical scenario. Imagine you're designing a notification system for a global social media app. How would you handle a sudden spike of 100M concurrent users? Focus on high-level architecture."
    }
  ]);
  const [currentText, setCurrentText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [communicationScore, setCommunicationScore] = useState(82);
  const [confidenceScore, setConfidenceScore] = useState(65);
  const [technicalScore, setTechnicalScore] = useState(75);
  const [liveTip, setLiveTip] = useState("Keep your posture steady for higher confidence scores.");
  const [isLoading, setIsLoading] = useState(false);
  
  const chatHistoryEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history
  useEffect(() => {
    chatHistoryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle message send & query Gemini API proxy
  const handleSendResponse = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const updatedMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    setCurrentText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          currentText: textToSend,
          history: messages
        })
      });
      const data = await response.json();
      
      setMessages([...updatedMessages, { role: 'interviewer', text: data.reply }]);
      if (data.analysis) {
        setCommunicationScore(data.analysis.communicationScore);
        setConfidenceScore(data.analysis.confidenceScore);
        setTechnicalScore(data.analysis.technicalScore);
        setLiveTip(data.analysis.feedback);
      }
    } catch (err: any) {
      setMessages([...updatedMessages, { role: 'interviewer', text: `Eve speech module failed to resolve answer: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated Mic speech-to-text fallbacks
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Generate standard mock speech answer
      const simulatedSpeech = category === 'Technical'
        ? "To handle 100M concurrency, I'd implement RabbitMQ to throttle requests and distribute processing across stateless scaling containers. Consistent hashing distributes index values gracefully."
        : "I always believe in alignment first. If a peer disagrees, I schedule a private coffee sync to map out qualitative advantages of both proposals, prioritizing user deliverables.";
      handleSendResponse(simulatedSpeech);
    } else {
      setIsRecording(true);
    }
  };

  const handleStartNewSession = () => {
    setMessages([
      {
        role: 'interviewer',
        text: category === 'Technical'
          ? "Welcome back, Ananya. Let's dive into a technical scenario. Imagine you're designing a notification system for a global social media app. How would you handle a sudden spike of 100M concurrent users? Focus on high-level architecture."
          : category === 'HR Round'
          ? "Hello Ananya. Let's practice behavioral techniques. Tell me about a time you made a critical mistake in code production. How did you react, and what did you tell stakeholders?"
          : "Welcome! Let's explore System Design. How would you design a distributed, globally aligned Rate Limiter with sub-millisecond latencies to defend database clusters?"
      }
    ]);
  };

  return (
    <div id="interview-dashboard" className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-800">AI Career Coach</h1>
          <p className="text-slate-400 text-sm mt-0.5">Practice behavioral and technical rounds with Eve, your AI mentor.</p>
        </div>
        <button 
          onClick={handleStartNewSession}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wide px-6 py-3.5 rounded-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer max-md:w-full"
        >
          START NEW SESSION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
        
        {/* Left column: Selecting category and analysis meters */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* Module Select */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 uppercase">Select Module</h3>
            <div className="space-y-2">
              {[
                { name: 'Technical' as const, desc: 'Algorithms & Logic', icon: Terminal },
                { name: 'HR Round' as const, desc: 'Behavioral & Fit', icon: User },
                { name: 'System Design' as const, desc: 'Scale & Architecture', icon: Sparkles },
              ].map((m) => {
                const isActive = category === m.name;
                const IconComponent = m.icon;
                return (
                  <button
                    key={m.name}
                    onClick={() => {
                      setCategory(m.name);
                      // Start matching first dialogue
                      setMessages([
                        {
                          role: 'interviewer',
                          text: m.name === 'Technical'
                            ? "Welcome back, Ananya. Let's dive into a technical scenario. Imagine you're designing a notification system for a global social media app. How would you handle a sudden spike of 100M concurrent users? Focus on high-level architecture."
                            : m.name === 'HR Round'
                            ? "Hello Ananya. Let's practice behavioral techniques. Tell me about a time you made a critical mistake in code production. How did you react, and what did you tell stakeholders?"
                            : "Welcome! Let's explore System Design. How would you design a distributed, globally aligned Rate Limiter with sub-millisecond latencies to defend database clusters?"
                        }
                      ]);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-lg shadow-blue-600/15' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-750'
                    }`}
                  >
                    <IconComponent size={18} className={isActive ? 'text-white shrink-0' : 'text-slate-400 shrink-0'} />
                    <div>
                      <h4 className="font-heading font-black text-sm tracking-tight leading-none">{m.name}</h4>
                      <p className={`text-[10px] uppercase font-bold mt-1 tracking-wider ${isActive ? 'text-blue-150' : 'text-slate-400'}`}>{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Analysis meters matching wireframes */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left space-y-5">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400">Live Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-700">Communication</span>
                  <span className="text-blue-600">{communicationScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${communicationScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-700">Confidence</span>
                  <span className="text-cyan-600">{confidenceScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${confidenceScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-700">Technical Scoring</span>
                  <span className="text-purple-600">{technicalScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${technicalScore}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 italic">"{liveTip}"</p>
            </div>
          </div>

        </aside>

        {/* Right column: Interactive EVE Coach dialog cards */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Main Coach Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-xl text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
            
            <div className="w-28 h-28 relative z-10 shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLsbG8sqHLhn1pup9urHdFJOtdwSpsU94eSsUyhkoAQZ41xmCye_9goMEleM19CCTio0YjRUr3BLvP4YgYZ_nGqP7REvaT1P1E6naQlWYBiOmkyFX_SIN2T5w0MB9JAX0hEL1EWL_DCf-DxJZN-9fEyXWIUVszd4lrJJavPC5w1eGTeKQor52GvfqEgGxrWJDDlb5_9WDvpWVTsTJ6nnh_rGTqhV56ozK_eBN2ldnyxJZi4A4HEoH_bH8MtE"
                alt="AI Career Coach Mascot"
                className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-blue-600 shadow-md"></span>
            </div>

            <div className="z-10 text-center sm:text-left flex-grow">
              <h2 className="font-heading font-black text-2xl">Meet Eve</h2>
              <p className="text-sm text-blue-100 mt-1 max-w-md">Your AI Career Coach. Today we are practicing "Conflict Resolution" and "Scalability".</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <span className="bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">PRO LEVEL 5</span>
                <span className="bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">STREAK: 12 DAYS</span>
              </div>
            </div>
          </div>

          {/* Interactive Chat Canvas Container */}
          <div className="bg-white border border-slate-100 rounded-3xl flex flex-col h-[520px] shadow-sm overflow-hidden relative">
            
            {/* Messages history view */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 text-left">
              {messages.map((msg, i) => {
                const isInterviewer = msg.role === 'interviewer';
                return (
                  <div key={i} className={`flex items-start gap-3 max-w-[85%] ${isInterviewer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isInterviewer ? 'bg-blue-100 text-blue-600' : 'bg-cyan-100 text-cyan-600'
                    }`}>
                      {isInterviewer ? <Bot size={18} /> : <User size={18} />}
                    </div>
                    <div className={`p-4 rounded-2xl relative ${
                      isInterviewer 
                        ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm-soft' 
                        : 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/5'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3 max-w-[85%] animate-pulse mr-auto">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <RefreshCw className="animate-spin text-slate-400" size={14} />
                  </div>
                  <div className="bg-slate-100/80 italic text-slate-500 p-4 rounded-2xl rounded-tl-none border border-slate-200 text-xs">
                    Eve is analyzing your answer alignment metrics and logic...
                  </div>
                </div>
              )}
              <div ref={chatHistoryEndRef} />
            </div>

            {/* Input Form Box with dynamic voice mic simulation */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendResponse(currentText)}
                  className="flex-grow bg-slate-100/80 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 text-sm outline-none placeholder:text-slate-400"
                  placeholder="Type your response..."
                  disabled={isLoading}
                />

                {/* Simulated sound microphone button */}
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  title="Speak response"
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all text-white ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <Mic size={20} />
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></span>
                  )}
                </button>

                <button
                  onClick={() => handleSendResponse(currentText)}
                  disabled={!currentText.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-45 text-white p-3.5 rounded-2xl shadow-md cursor-pointer shrink-0 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>

              <div className="mt-2.5 flex justify-center text-slate-400 text-xs font-semibold gap-1.5">
                <AlertCircle size={14} className="text-slate-300" />
                <span>Voice input is enabled in EVE. Tap the red mic to record.</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
