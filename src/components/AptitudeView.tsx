import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Brain, Timer, CheckCircle2, XCircle, ChevronRight, RefreshCw, Star } from 'lucide-react';
import { AptitudeQuestion } from '../types';

interface AptitudeViewProps {
  questions: AptitudeQuestion[];
  onAnswerCorrect: (xpEarned: number) => void;
}

export default function AptitudeView({ questions, onAnswerCorrect }: AptitudeViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  const currentQuestion = questions[currentIdx];

  // Timer simulation
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted || testComplete) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitted, testComplete]);

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    setIsSubmitted(true);
    if (selectedOpt === currentQuestion.correctIndex) {
      setScore(score + 1);
      onAnswerCorrect(50); // reward XP
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsSubmitted(false);
    setTimeLeft(60);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setTestComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setTimeLeft(60);
    setScore(0);
    setTestComplete(false);
  };

  return (
    <div id="aptitude-practice-panel" className="max-w-4xl mx-auto space-y-6">
      
      {/* Quiz Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">MODULE 7</span>
          <h2 className="font-heading font-extrabold text-xl text-slate-800 flex items-center gap-2 mt-0.5">
            <Brain size={20} className="text-blue-600" />
            Logical & Quantitative Training
          </h2>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-2 text-slate-600 border border-slate-100">
            <Timer size={16} className={`${timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
            <span className="font-mono text-sm font-bold">{timeLeft}s left</span>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-2xl flex items-center gap-2 text-indigo-700 border border-indigo-100 font-bold">
            <Star size={16} fill="currentColor" />
            <span>Score: {score} / {questions.length}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!testComplete ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-left"
          >
            {/* Category Marker */}
            <span className="bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {currentQuestion.category}
            </span>

            {/* Question Text */}
            <h3 className="font-heading font-extrabold text-lg md:text-xl text-slate-800 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Options layout */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const isWrongSelection = isSelected && !isCorrect;

                let btnStyles = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-transparent';
                if (isSelected && !isSubmitted) {
                  btnStyles = 'bg-blue-50 border-blue-500 text-blue-700 font-bold ring-2 ring-blue-100';
                } else if (isSubmitted) {
                  if (isSelected) {
                    if (isCorrect) {
                      btnStyles = 'bg-green-50 border-green-500 text-green-700 font-bold shadow-sm shadow-green-100';
                    } else {
                      btnStyles = 'bg-red-50 border-red-400 text-red-600 font-bold';
                    }
                  } else if (isCorrect) {
                    btnStyles = 'bg-green-50/50 border-green-300 text-green-600 font-semibold';
                  } else {
                    btnStyles = 'bg-slate-50/50 text-slate-400 border-transparent opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOpt(idx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-semibold">{option}</span>
                    </div>

                    {isSubmitted && (
                      <div className="shrink-0">
                        {isCorrect && idx === selectedOpt && <CheckCircle2 className="text-green-600" size={18} />}
                        {isWrongSelection && <XCircle className="text-red-500" size={18} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed Explanations panel */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-100 "
              >
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Brain size={16} className="text-blue-500" /> EVE Explanation Detail:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* Action buttons */}
            {!isSubmitted ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/10 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 transition-all mt-4"
              >
                SUBMIT ANSWER
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-2 transition-all mt-4"
              >
                <span>{currentIdx === questions.length - 1 ? 'COMPLETE TESTING' : 'NEXT QUESTION'}</span>
                <ChevronRight size={16} />
              </button>
            )}

          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl text-slate-800">Aptitude Round Finished!</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Excellent! You solved {score} out of {questions.length} problems correctly on the standard computational test.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl max-w-xs mx-auto border border-slate-100">
              <span className="text-xs text-slate-400 block font-bold mb-0.5 uppercase tracking-wider">TOTAL SCORE</span>
              <span className="font-heading font-black text-3xl text-blue-600">{score * 50} XP Earned</span>
            </div>

            <button
              onClick={handleRestart}
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw size={14} />
              PRACTICE AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
