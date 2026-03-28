import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What exactly is the APEX platform?',
    a: 'APEX is a high-performance interview preparation and consistency tracking platform. It helps you build disciplined streaks, track domain-specific progress, and identify weak points before your interviews—all within a focused, distraction-free environment.',
  },
  {
    q: 'How does the streak system work?',
    a: 'You maintain a streak by completing at least one session per day. Each session logs your practice time, topics covered, and performance score. The dashboard visualizes this over time, creating a thermal map of your momentum.',
  },
  {
    q: 'Which domains are supported?',
    a: 'Currently we support Data Structures & Algorithms, System Design, Behavioral (STAR framework), and SQL. Each domain has tailored question banks, complexity tracking, and targeted weak-area reports.',
  },
  {
    q: 'Is this built for beginners or experienced engineers?',
    a: 'Both. The adaptive difficulty engine adjusts question complexity based on your actual performance—not self-reported levels. Whether you\'re a fresher or a senior engineer targeting FAANG, the platform scales with you.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Yes. The free tier includes full streak tracking, limited analytics, and up to 30 practice questions per month. Pro unlocks unlimited access, AI-powered analysis, and personalized weak-area detection.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section
      id="faq"
      className="py-28 px-6"
      style={{ background: 'var(--surface-low)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="label-precision mb-3">FAQ</p>
          <h2
            className="font-black"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              letterSpacing: '-0.03em',
              color: '#fff',
            }}
          >
            Questions from APEX
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <div className="faq-card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span
                    className="font-semibold"
                    style={{ fontFamily: 'Manrope, sans-serif', color: '#fff', fontSize: '0.9375rem' }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <div className="gradient-line mb-4" />
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: 1.8 }}>
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
