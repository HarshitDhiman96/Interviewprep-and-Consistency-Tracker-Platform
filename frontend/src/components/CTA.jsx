import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTA() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 300);
  };
  return (
    <section
      id="cta"
      className="py-28 px-6"
      style={{ background: 'var(--surface-low)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0"
          style={{ background: 'var(--surface-container)' }}
        >
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-12 flex flex-col justify-center"
          >
            <p className="label-precision mb-4 text-zinc-600">
              JOIN 40,000+ HIGH PERFORMERS
            </p>
            <h2
              className="font-black mb-4 leading-tight text-zinc-950 dark:text-white"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Ready to harness <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                APEX?
              </span>
            </h2>
            <p
              className="mb-8 text-zinc-600"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', lineHeight: 1.75 }}
            >
              Who are already using APEX to land their limits in months.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate('/signup')}
                className="btn-primary flex items-center gap-2 px-7 py-3.5 text-base"
              >
                <Activity size={16} />
                Get Started Free
              </motion.button>
              <p className="label-precision text-zinc-500">
                No credit card required.
              </p>
            </div>
          </motion.div>

          {/* Right: Visual - animated "void sphere" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center min-h-64 bg-zinc-50 dark:bg-[var(--surface-high)] rounded-r-3xl transition-colors duration-300"
          >
            {/* Layered radial sphere effect - Updated for Light Mode */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid rgba(37, 99, 235, 0.15)',
                }}
              />
              {/* Mid ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full"
                style={{
                  inset: '16px',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                }}
              />
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full"
                style={{
                  inset: '36px',
                  border: '1px solid rgba(234, 88, 12, 0.2)',
                }}
              />
              {/* Core glow */}
              <div
                className="w-24 h-24 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
                  boxShadow: '0 0 60px rgba(37, 99, 235, 0.2), 0 0 120px rgba(37, 99, 235, 0.1)',
                }}
              />
              {/* Orbiting dot */}
              <motion.div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: '#2563EB',
                  boxShadow: '0 0 10px #2563EB',
                  left: '50%',
                  top: '0',
                  transformOrigin: '0px 112px',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#EA580C',
                  boxShadow: '0 0 8px #EA580C',
                  left: '50%',
                  top: '8%',
                  transformOrigin: '0px 90px',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
