import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronRight, Sparkles } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const GOAL_OPTIONS = [
  'Crack an Internship',
  'Crack a Software Engineering Job',
  'Learn DSA',
  'Learn Web Development',
  'Learn AI/ML',
  'Improve Consistency',
  'Prepare for Placements',
  'Custom Goal'
];

export default function GoalOnboardingModal({ isOpen, onSubmit }) {
  const { needsInconsistencyReason } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldShow = isOpen && !needsInconsistencyReason;

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalGoal = selectedGoal === 'Custom Goal' ? customGoal : selectedGoal;
    if (!finalGoal) return;

    setIsSubmitting(true);
    try {
      await onSubmit(finalGoal);
    } catch (error) {
      console.error('Error submitting goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
    <motion.div
      key="goal-onboarding-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden"
      >
            {/* Header Gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative p-8 md:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                  <Target size={32} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-zinc-950 dark:text-white mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  What is your primary goal?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                  This helps us provide better recommendations and personalized coaching for your journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {GOAL_OPTIONS.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalSelect(goal)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left ${
                        selectedGoal === goal
                          ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-300 ring-2 ring-blue-500/20'
                          : 'bg-zinc-50 border-zinc-100 text-zinc-600 hover:bg-zinc-100 dark:bg-white/5 dark:border-white/5 dark:text-white/60 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="font-semibold text-sm">{goal}</span>
                      {selectedGoal === goal && <Sparkles size={16} />}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedGoal === 'Custom Goal' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40 mb-2 ml-1">
                        Enter your goal
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          required
                          value={customGoal}
                          onChange={(e) => setCustomGoal(e.target.value)}
                          placeholder="e.g. Master High-Level Design"
                          className="w-full py-4 px-5 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedGoal || (selectedGoal === 'Custom Goal' && !customGoal)}
                  className="group relative w-full py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', fontFamily: 'Manrope, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Finish Onboarding</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
        </button>
      </form>
    </div>
  </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
