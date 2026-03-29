import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, AlertTriangle, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: <Flame size={22} color="#EA580C" />,
    label: 'Daily Session Logging',
    desc:
      'Commit your daily study sessions with zero-latency. Track topics, time spent, and build an unbreakable streak.',
    badge: { text: '🔥 STREAK ACTIVE: 47 DAYS', color: '#EA580C' },
  },
  {
    icon: <Target size={22} color="#2563EB" />,
    label: 'Consistency Metrics',
    desc:
      'Monitor your Total Hours Spent and global Consistency Score to stay motivated and measure your true dedication over time.',
    badge: null,
    progress: true,
  },
  {
    icon: <AlertTriangle size={22} color="#6B7280" />,
    label: 'Weak Area Detection',
    desc:
      'Flag sessions as "Stuck" and let the system identify systemic bottlenecks in your workflow before they compound.',
    badge: { text: '↗ NEEDS FOCUS', color: '#EF4444' },
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-28 px-6 bg-zinc-50 dark:bg-[var(--surface)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-black mb-3 text-zinc-950 dark:text-white"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Engineered for Momentum
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-zinc-600 dark:text-zinc-400"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem' }}
            >
              Precision tools designed to eliminate friction and amplify output.
              <br />No fluff, just performance-to-output architecture.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="label-precision text-zinc-600">
              FEATURE SET v6.0.2
            </span>
          </motion.div>
        </div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.label} variants={item} className="p-7 flex flex-col gap-4 rounded-[1.25rem] bg-white shadow-lg shadow-zinc-200/50 border border-zinc-200 dark:bg-[var(--surface-container)] dark:border-transparent dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/80 dark:hover:shadow-[0_8px_40px_rgba(37,99,235,0.08),0_0_0_1px_rgba(37,99,235,0.06)]">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: '#F3F4F6' }}
              >
                {f.icon}
              </div>

              <h3
                className="font-bold text-zinc-950 dark:text-[var(--on-surface)]"
                style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.125rem' }}
              >
                {f.label}
              </h3>

              <p className="text-zinc-600 dark:text-[rgba(255,255,255,0.4)]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {f.desc}
              </p>

              {/* Progress bar for Analytics card */}
              {f.progress && (
                <div>
                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '68%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: '#2563EB', boxShadow: '0 0 8px rgba(37,99,235,0.5)' }}
                    />
                  </div>
                </div>
              )}

              {/* Badge */}
              {f.badge && (
                <div className="mt-auto">
                  <span
                    className="inline-block px-3 py-1 rounded-full label-precision"
                    style={{
                      background: `${f.badge.color}15`,
                      color: f.badge.color,
                      border: `1px solid ${f.badge.color}30`,
                    }}
                  >
                    {f.badge.text}
                  </span>
                </div>
              )}

              {/* Learn more arrow  */}
              {!f.badge && !f.progress && (
                <div className="mt-auto flex items-center gap-1 text-sm" style={{ color: '#2563EB' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>Explore</span>
                  <ArrowUpRight size={14} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
