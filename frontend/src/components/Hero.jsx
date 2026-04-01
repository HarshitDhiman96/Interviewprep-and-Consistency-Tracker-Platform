import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Activity, X, Flame, Target, AlertTriangle } from 'lucide-react';
import ParticleField from './ParticleField';
import { useNavigate } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const demoHighlights = [
  {
    icon: Flame,
    title: 'Daily Session Logging',
    description: 'Log time spent, topic, difficulty, and outcome so your consistency builds automatically.',
  },
  {
    icon: Target,
    title: 'Weak Area Detection',
    description: 'Spot patterns in stuck topics and see where extra revision will move the needle fastest.',
  },
  {
    icon: AlertTriangle,
    title: 'Progress Analytics',
    description: 'Track streaks, heatmaps, weekly effort, and revision counts from one focused dashboard.',
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleNavigate = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#0e0e0e] transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <ParticleField />
          <div
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: '800px',
              height: '800px',
              background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.04) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 md:pt-48 pb-16">
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-emerald-50 border border-emerald-200 dark:border-[rgba(132,173,255,0.12)] dark:bg-[var(--surface-low)]">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500 dark:bg-[var(--primary)]" />
              <span className="label-precision text-emerald-700 dark:text-[rgba(255,255,255,0.5)]">
                System Status: Operational
              </span>
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="font-black leading-none mb-6 text-zinc-950 dark:text-white"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              letterSpacing: '-0.04em',
            }}
          >
            Experience{' '}
            <span
              className="text-glow-blue"
              style={{
                background: 'linear-gradient(135deg, #2563EB 30%, #1D4ED8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontStyle: 'italic',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
              }}
            >
              Liftoff
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="max-w-xl mb-10 leading-relaxed"
            style={{
              color: '#4B5563',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.0625rem',
            }}
          >
            Your journey to mastery starts with preparation and relentless consistency.
            <br />
            <span style={{ color: '#6B7280' }}>Harness the momentum of APEX.</span>
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full relative z-20">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0px 0px 25px rgba(37,99,235,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate('/signup')}
              className="flex justify-center items-center gap-2 px-8 py-4 text-base w-full sm:w-auto rounded-xl font-bold bg-[#3B82F6] text-white transition-all duration-300 hover:bg-[#2563EB]"
            >
              <Activity size={16} />
              Start Your Streak
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDemoOpen(true)}
              className="flex justify-center items-center gap-2 px-8 py-4 text-base w-full sm:w-auto rounded-xl font-bold transition-all duration-300 bg-zinc-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200 hover:border-zinc-400 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/12 dark:hover:text-white"
            >
              <Play size={15} />
              View Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
            className="relative max-w-3xl w-full"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full z-10 bg-white border border-zinc-300 shadow-sm dark:shadow-none dark:bg-[var(--surface-highest)] dark:border-[rgba(132,173,255,0.15)]"
            >
              <span className="label-precision">TIME INVESTED</span>
              <span className="font-bold text-sm" style={{ color: '#2563EB', fontFamily: 'Manrope, sans-serif' }}>
                42.5 hrs
              </span>
            </motion.div>

            <div className="rounded-2xl overflow-hidden bg-white shadow-xl shadow-zinc-200/50 border border-zinc-300 dark:bg-[var(--surface-container)] dark:border-[rgba(255,255,255,0.06)] dark:ambient-glow">
              <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-b border-zinc-200 dark:bg-[var(--surface-high)] dark:border-[rgba(255,255,255,0.05)]">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="label-precision text-zinc-700 dark:text-zinc-300">Command Center</span>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2563EB' }} />
                </div>
                <button className="label-precision text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">Dismiss x</button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-4 bg-white border border-zinc-300 shadow-sm dark:border-transparent dark:bg-[var(--surface-low)]">
                  <p className="label-precision mb-1 text-zinc-700 dark:text-zinc-300">Current Streak</p>
                  <p className="font-black leading-none" style={{ fontSize: '2.5rem', fontFamily: 'Manrope, sans-serif', color: '#EA580C' }}>
                    47
                  </p>
                  <p className="label-precision mt-1" style={{ color: '#EA580C', opacity: 0.9 }}>
                    DAYS ACTIVE
                  </p>
                </div>

                <div className="rounded-xl p-4 col-span-2 bg-white border border-zinc-300 shadow-sm dark:border-transparent dark:bg-[var(--surface-low)]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="label-precision text-zinc-700 dark:text-zinc-300">Session Overview</p>
                    <p className="label-precision" style={{ color: '#2563EB' }}>+12.4%</p>
                  </div>
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.8 + i * 0.04, duration: 0.4, ease: 'backOut' }}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i === 11 ? '#2563EB' : 'rgba(37, 99, 235, 0.2)',
                          transformOrigin: 'bottom',
                          boxShadow: i === 11 ? '0 0 8px rgba(37, 99, 235, 0.4)' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-4 col-span-3 bg-white border border-zinc-300 shadow-sm dark:border-transparent dark:bg-[var(--surface-low)]">
                  <p className="label-precision mb-3 text-zinc-700 dark:text-zinc-300">Skill Consistency</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'DSA', score: 87, color: '#2563EB' },
                      { label: 'System Design', score: 62, color: '#EA580C' },
                      { label: 'Web Dev', score: 91, color: '#16A34A' },
                    ].map((d) => (
                      <div key={d.label}>
                        <div className="flex justify-between mb-1">
                          <span className="label-precision text-zinc-600 dark:text-zinc-400">{d.label}</span>
                          <span className="label-precision" style={{ color: d.color }}>{d.score}%</span>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: '#E5E7EB' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${d.score}%` }}
                            transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{
                              background: d.color,
                              boxShadow: `0 0 8px ${d.color}40`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: '80%',
                height: '60px',
                background: 'radial-gradient(ellipse, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
                filter: 'blur(16px)',
              }}
            />
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setIsDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-3xl rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#101010] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-white/10">
                <div>
                  <h3 className="text-2xl font-black text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Product Glimpse
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    A quick look at the core features APEX gives you after signup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDemoOpen(false)}
                  className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {demoHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl p-5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 mb-4">
                        <Icon size={20} color="#2563EB" />
                      </div>
                      <h4 className="text-lg font-black text-zinc-950 dark:text-white mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {item.title}
                      </h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
