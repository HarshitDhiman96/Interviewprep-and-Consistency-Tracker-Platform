import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, AlertTriangle, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: <Flame size={22} color="#fd8b00" />,
    label: 'Daily Session Logging',
    desc:
      'Commit your daily study sessions with zero-latency. Track topics, time spent, and build an unbreakable streak.',
    badge: { text: '🔥 STREAK ACTIVE: 47 DAYS', color: '#fd8b00' },
  },
  {
    icon: <Target size={22} color="#84adff" />,
    label: 'Consistency Metrics',
    desc:
      'Monitor your Total Hours Spent and global Consistency Score to stay motivated and measure your true dedication over time.',
    badge: null,
    progress: true,
  },
  {
    icon: <AlertTriangle size={22} color="rgba(255,255,255,0.4)" />,
    label: 'Weak Area Detection',
    desc:
      'Flag sessions as "Stuck" and let the system identify systemic bottlenecks in your workflow before they compound.',
    badge: { text: '↗ NEEDS FOCUS', color: '#ff5f57' },
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
      className="relative py-28 px-6"
      style={{ background: 'var(--surface)' }}
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
              className="font-black mb-3"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                letterSpacing: '-0.03em',
                color: '#fff',
              }}
            >
              Engineered for Momentum
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem' }}
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
            <span className="label-precision" style={{ color: 'rgba(132,173,255,0.5)' }}>
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
            <motion.div key={f.label} variants={item} className="feature-card p-7 flex flex-col gap-4">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--surface-high)' }}
              >
                {f.icon}
              </div>

              <h3
                className="font-bold"
                style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.125rem', color: '#fff' }}
              >
                {f.label}
              </h3>

              <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {f.desc}
              </p>

              {/* Progress bar for Analytics card */}
              {f.progress && (
                <div>
                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-high)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '68%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--primary)', boxShadow: '0 0 8px rgba(132,173,255,0.5)' }}
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
                <div className="mt-auto flex items-center gap-1 text-sm" style={{ color: 'var(--primary)' }}>
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
