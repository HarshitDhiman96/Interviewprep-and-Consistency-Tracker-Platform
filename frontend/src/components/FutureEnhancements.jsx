import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, BarChart3, BrainCircuit, Cpu, GitBranch, Target } from 'lucide-react';

const roadmap = [
  {
    icon: BrainCircuit,
    title: 'AI Mock Interviewer',
    status: 'In development',
    description: 'Practice with an adaptive interviewer that asks follow-up questions, remembers your areas of focus, and helps you improve the way you explain your thinking.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1600&auto=format&fit=crop',
  },
  {
    icon: GitBranch,
    title: 'Roadmap Generator',
    status: 'Planned',
    description: 'Turn a target role and company into a day-by-day preparation route, with priorities that adapt as your logged practice changes.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop',
  },
  {
    icon: Cpu,
    title: 'Collaborative Study Rooms',
    status: 'Planned',
    description: 'Bring focused preparation into a shared space for pair programming, whiteboarding, accountability, and live progress with peers.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop',
  },
  {
    icon: BarChart3,
    title: 'Progress Intelligence',
    status: 'Exploring',
    description: 'A clearer layer of weekly insights that connects logged practice, consistency, and revision activity to the areas moving your preparation forward.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
  },
  {
    icon: Target,
    title: 'Goal Milestones',
    status: 'Planned',
    description: 'Break an interview target into accountable milestones and use your active goal to keep coaching, revision, and daily practice pointed in one direction.',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1600&auto=format&fit=crop',
  },
];

function RoadmapCard({ item, index }) {
  const Icon = item.icon;
  return (
    <article className="site-grid-exempt group relative h-[430px] w-[min(84vw,350px)] shrink-0 overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-900 sm:h-[480px] sm:w-[440px] lg:w-[520px] dark:border-white/15">
      <div
        className="absolute inset-0 scale-100 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-zinc-950/65" />
      <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"><Icon size={21} /></div>
          <span className="label-precision rounded-full border border-white/20 bg-zinc-950/40 px-3 py-1 text-white">0{index + 1} · {item.status}</span>
        </div>
        <div>
          <h3 className="mb-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl" style={{ fontFamily: 'Manrope, sans-serif' }}>{item.title}</h3>
          <p className="text-sm leading-relaxed text-white/75 sm:text-base">{item.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-200">Coming to APEX <ArrowUpRight size={16} /></span>
        </div>
      </div>
    </article>
  );
}

function HorizontalScrollCarousel() {
  const targetRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-57%']);

  return (
    <section ref={targetRef} className="relative h-[240vh] sm:h-[270vh] lg:h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div
          className="flex gap-4 px-5 sm:gap-6 sm:px-8 lg:px-[max(2rem,calc((100vw-1152px)/2))]"
          style={{ x: reduceMotion ? 0 : x }}
        >
          {roadmap.map((item, index) => <RoadmapCard key={item.title} item={item} index={index} />)}
        </motion.div>
      </div>
    </section>
  );
}

export default function FutureEnhancements() {
  return (
    <section id="roadmap" className="bg-zinc-100 py-16 dark:bg-[#111111] sm:py-20">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <p className="label-precision mb-4 text-blue-700 dark:text-blue-300">PRODUCT ROADMAP</p>
        <h2 className="text-balance text-3xl font-black tracking-[-0.04em] text-zinc-950 dark:text-white sm:text-5xl" style={{ fontFamily: 'Manrope, sans-serif' }}>What&apos;s entering APEX.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">A focused set of tools designed to make interview preparation more adaptive, social, and useful over time.</p>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Scroll to explore →</p>
      </div>
      <HorizontalScrollCarousel />
      <p className="px-5 text-center text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400 sm:px-8">Built around deliberate practice, not busywork.</p>
    </section>
  );
}
