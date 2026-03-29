import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, BrainCircuit, GitBranch, BarChart3 } from 'lucide-react';

const enhancements = [
  {
    icon: <BrainCircuit size={24} color="#84adff" />,
    title: 'AI Mock Interviewer',
    desc: 'Real-time AI-powered mock interviews with voice input, dynamic follow-up questions, and instant feedback on communication clarity and technical depth.',
    status: 'In Development',
    statusColor: '#84adff',
  },
  {
    icon: <GitBranch size={24} color="#fd8b00" />,
    title: 'Roadmap Generator',
    desc: 'Input your target company and role. Get a dynamically generated, day-by-day preparation roadmap with adaptive difficulty curves.',
    status: 'Planned Q3',
    statusColor: '#fd8b00',
  },
  {
    icon: <Cpu size={24} color="#a8ff84" />,
    title: 'Collaborative Study Rooms',
    desc: 'Real-time pair programming and whiteboard sessions. Compete on live leaderboards with peers targeting the same companies.',
    status: 'Planned Q4',
    statusColor: '#a8ff84',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function FutureEnhancements() {
  return (
    <section
      id="roadmap"
      className="py-28 px-6 bg-zinc-50 dark:bg-[var(--surface)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="label-precision mb-3">PRODUCT ROADMAP</p>
          <h2
            className="font-black mb-4 text-zinc-950 dark:text-[var(--on-surface)]"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              letterSpacing: '-0.03em',
            }}
          >
            What's entering APEX
          </h2>
          <p className="text-zinc-600 dark:text-[rgba(255,255,255,0.4)]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', maxWidth: '540px' }}>
            We're building the future of preparation infrastructure. Here's what's on the horizon.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {enhancements.map((card) => (
            <motion.div key={card.title} variants={item} className="p-7 relative overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-zinc-200/50 border border-zinc-200 dark:bg-[var(--surface-low)] dark:border-transparent dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(132,173,255,0.08)]">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-zinc-100 dark:bg-[var(--surface-container)] border border-zinc-200 dark:border-transparent"
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3
                className="font-bold mb-2 text-zinc-950 dark:text-[var(--on-surface)]"
                style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.125rem' }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className="mb-5 text-zinc-600 dark:text-[rgba(255,255,255,0.4)]"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: 1.75 }}
              >
                {card.desc}
              </p>

              {/* Status badge */}
              <span
                className="label-precision px-3 py-1 rounded-full"
                style={{
                  color: card.statusColor,
                  background: `${card.statusColor}18`,
                  border: `1px solid ${card.statusColor}28`,
                }}
              >
                {card.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
