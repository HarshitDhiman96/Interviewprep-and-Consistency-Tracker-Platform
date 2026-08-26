import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Activity, X, Flame, Target, AlertTriangle, BrainCircuit, CalendarCheck, RotateCcw } from 'lucide-react';
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
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none dark:hidden"
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

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pt-32 xl:grid-cols-[minmax(540px,0.95fr)_minmax(0,1.05fr)] xl:gap-16 xl:px-10 xl:pt-36">
          <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
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
              fontSize: 'clamp(2.65rem, 4.9vw, 4rem)',
              letterSpacing: '-0.04em',
            }}
          >
            <span aria-hidden="true" className="inline-flex items-baseline tracking-[-0.04em]">
              <span className="relative inline-block text-zinc-400 dark:text-white/35">
                IN
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-zinc-500 dark:bg-white/60" />
              </span>
              <span className="text-[#1D4ED8] dark:text-[var(--primary)]">CONSISTENT</span>
            </span>
            <span className="sr-only">Inconsistent</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="max-w-xl mb-9 leading-relaxed"
            style={{
              color: '#4B5563',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.0625rem',
            }}
          >
            Inconsistent today? APEX turns your preparation into a routine you can trust.
            <br />
            <span style={{ color: '#6B7280' }}>Show up, build momentum, and become consistent.</span>
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="relative z-20 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row xl:justify-start">
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
            className="relative mx-auto w-full max-w-2xl xl:max-w-none"
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 0.5, 0, -0.35, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full z-10 bg-white border border-zinc-300 shadow-sm dark:shadow-none dark:bg-[var(--surface-highest)] dark:border-[rgba(132,173,255,0.15)]"
            >
              <span className="label-precision">TIME INVESTED</span>
              <span className="font-bold text-sm" style={{ color: '#2563EB', fontFamily: 'Manrope, sans-serif' }}>
                42.5 hrs
              </span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, -0.35, 0, 0.25, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="rounded-2xl overflow-hidden bg-white shadow-xl shadow-zinc-200/50 border border-zinc-300 dark:bg-[var(--surface-container)] dark:border-[rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-b border-zinc-200 dark:bg-[var(--surface-high)] dark:border-[rgba(255,255,255,0.05)]">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="label-precision text-zinc-700 dark:text-zinc-300">Adaptive Prep System</span>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2563EB' }} />
                </div>
                <span className="label-precision text-emerald-600 dark:text-emerald-300">LIVE</span>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 sm:p-6 md:grid-cols-3 md:gap-4">
                <div className="rounded-xl p-4 md:col-span-2 bg-white border border-zinc-300 shadow-sm dark:border-transparent dark:bg-[var(--surface-low)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10"><BrainCircuit size={17} color="#2563EB" /></div>
                      <div><p className="text-sm font-bold text-zinc-900 dark:text-white">APEX AI Coach</p><p className="label-precision text-zinc-500">MEMORY-AWARE GUIDANCE</p></div>
                    </div>
                    <span className="label-precision rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">ONLINE</span>
                  </div>
                  <div className="ml-auto mb-2 w-[82%] rounded-xl rounded-tr-sm bg-zinc-100 px-3 py-2 text-xs text-zinc-600 dark:bg-white/8 dark:text-zinc-300">I keep missing my revision sessions.</div>
                  <div className="w-[90%] rounded-xl rounded-tl-sm border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-relaxed text-zinc-700 dark:border-blue-400/15 dark:bg-blue-500/10 dark:text-zinc-200">You solved Arrays twice this week. Schedule a 20-minute revision tomorrow to keep your momentum.</div>
                </div>

                <div className="rounded-xl p-4 bg-white border border-zinc-300 shadow-sm dark:border-transparent dark:bg-[var(--surface-low)]">
                  <p className="label-precision mb-1 text-zinc-600 dark:text-zinc-400">CURRENT STREAK</p>
                  <p className="font-black leading-none text-orange-600" style={{ fontSize: '2.25rem', fontFamily: 'Manrope, sans-serif' }}>14</p>
                  <p className="label-precision mt-1 text-orange-600">DAYS ACTIVE</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"><div className="h-full w-[86%] rounded-full bg-blue-600" /></div>
                  <p className="mt-1 text-[10px] text-zinc-500">86% consistency</p>
                </div>

                <div className="rounded-xl p-4 md:col-span-3 bg-white border border-zinc-300 shadow-sm dark:border-transparent dark:bg-[var(--surface-low)]">
                  <div className="mb-3 flex items-center justify-between"><p className="label-precision text-zinc-700 dark:text-zinc-300">YOUR NEXT BEST MOVE</p><span className="label-precision text-blue-600">PERSONALIZED PLAN</span></div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-rose-100 bg-rose-50/70 p-2.5 dark:border-rose-400/10 dark:bg-rose-500/8"><div className="mb-1 flex items-center gap-1.5"><AlertTriangle size={13} className="text-rose-500" /><span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Weak area</span></div><p className="text-[11px] text-zinc-600 dark:text-zinc-400">Dynamic programming needs practice.</p></div>
                    <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-2.5 dark:border-amber-400/10 dark:bg-amber-500/8"><div className="mb-1 flex items-center gap-1.5"><RotateCcw size={13} className="text-amber-600" /><span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Revision queue</span></div><p className="text-[11px] text-zinc-600 dark:text-zinc-400">Revise binary search tomorrow.</p></div>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-2.5 dark:border-emerald-400/10 dark:bg-emerald-500/8"><div className="mb-1 flex items-center gap-1.5"><CalendarCheck size={13} className="text-emerald-600" /><span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Daily log</span></div><p className="text-[11px] text-zinc-600 dark:text-zinc-400">Capture time, mood, and reflection.</p></div>
                  </div>
                </div>
              </div>
            </motion.div>

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
