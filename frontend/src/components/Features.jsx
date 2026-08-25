import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, BrainCircuit, CalendarCheck, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IMAGE_PADDING = 12;

const features = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop',
    eyebrow: 'Your adaptive mentor',
    heading: 'Coaching that remembers the work you have done.',
    icon: BrainCircuit,
    title: 'A personalized AI coach, not generic advice.',
    description: 'APEX keeps the context from your coaching conversations and study activity, so each follow-up can connect to your goals, prior obstacles, and progress.',
    details: ['Conversation-aware recommendations', 'Memory-backed coaching context', 'Actionable follow-up prompts'],
    cta: 'Meet your coach',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop',
    eyebrow: 'Make progress visible',
    heading: 'Turn daily effort into a consistency system.',
    icon: CalendarCheck,
    title: 'Log the work. Build the streak. See the pattern.',
    description: 'Capture skills, topics, time, difficulty, outcome, mood, and reflection in one focused daily log. APEX turns that activity into streaks, weekly progress, and a measurable consistency score.',
    details: ['Daily and weekly progress', 'Streaks that update automatically', 'Goal-guided preparation'],
    cta: 'Start tracking',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop',
    eyebrow: 'Know what to do next',
    heading: 'Find weak spots before they become roadblocks.',
    icon: Target,
    title: 'From stuck sessions to a focused revision plan.',
    description: 'APEX detects topics with low practice or repeated stuck sessions, then helps you create a revision queue around the areas most likely to improve your interview readiness.',
    details: ['Weak topic detection', 'Targeted revision queue', 'Progress and activity analytics'],
    cta: 'Build your plan',
  },
];

function StickyFeatureImage({ imageUrl }) {
  const targetRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['end end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.65, 0.86]);

  return (
    <motion.div
      ref={targetRef}
      className="site-grid-exempt sticky top-3 h-[calc(100svh-24px)] overflow-hidden rounded-[28px] border border-white/20 bg-zinc-950 shadow-2xl shadow-zinc-950/20"
      style={{ scale: reduceMotion ? 1 : scale, backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <motion.div className="absolute inset-0 bg-zinc-950" style={{ opacity: reduceMotion ? 0.7 : opacity }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(37,99,235,0.24),transparent_42%)]" />
    </motion.div>
  );
}

function FeatureOverlay({ eyebrow, heading }) {
  const targetRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [160, -160]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.42, 0.72, 0.9], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      className="pointer-events-none absolute inset-0 z-10 flex min-h-screen items-center justify-center px-6 text-center text-white"
      style={{ y: reduceMotion ? 0 : y, opacity: reduceMotion ? 1 : opacity }}
    >
      <div className="max-w-4xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-blue-200 sm:text-sm">{eyebrow}</p>
        <h3 className="text-balance text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl md:text-7xl" style={{ fontFamily: 'Manrope, sans-serif' }}>{heading}</h3>
      </div>
    </motion.div>
  );
}

function FeatureDetail({ feature, index }) {
  const navigate = useNavigate();
  const Icon = feature.icon;
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-12 md:gap-12 md:pb-28 md:pt-16">
      <div className="md:col-span-4">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/10"><Icon size={22} className="text-blue-600 dark:text-blue-300" /></div>
        <p className="label-precision text-blue-700 dark:text-blue-300">0{index + 1} / APEX SYSTEM</p>
        <h3 className="mt-3 text-3xl font-black tracking-[-0.035em] text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>{feature.title}</h3>
      </div>
      <div className="md:col-span-8">
        <p className="max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-xl">{feature.description}</p>
        <div className="my-7 grid gap-3 sm:grid-cols-3">
          {feature.details.map((detail) => <div key={detail} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:bg-[#181818] dark:text-zinc-200">{detail}</div>)}
        </div>
        <button type="button" onClick={() => navigate('/signup')} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] dark:bg-[var(--primary)] dark:text-[#002d64]">
          {feature.cta} <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TextParallaxFeature({ feature, index }) {
  return (
    <div style={{ paddingLeft: IMAGE_PADDING, paddingRight: IMAGE_PADDING }}>
      <div className="relative h-[125svh] min-h-[760px] md:h-[140vh]">
        <StickyFeatureImage imageUrl={feature.imageUrl} />
        <FeatureOverlay eyebrow={feature.eyebrow} heading={feature.heading} />
      </div>
      <FeatureDetail feature={feature} index={index} />
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative bg-zinc-50 py-16 dark:bg-[var(--surface)] sm:py-20">
      <div className="mx-auto max-w-6xl px-5 pb-12 text-center sm:px-8 sm:pb-16">
        <p className="label-precision mb-4 text-blue-700 dark:text-blue-300">THE APEX ADVANTAGE</p>
        <h2 className="text-balance text-3xl font-black tracking-[-0.04em] text-zinc-950 dark:text-white sm:text-5xl" style={{ fontFamily: 'Manrope, sans-serif' }}>A preparation system that adapts to you.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">Build consistency with an AI coach that understands your study history, shows the patterns, and helps you take the next useful step.</p>
      </div>
      {features.map((feature, index) => <TextParallaxFeature key={feature.title} feature={feature} index={index} />)}
    </section>
  );
}
