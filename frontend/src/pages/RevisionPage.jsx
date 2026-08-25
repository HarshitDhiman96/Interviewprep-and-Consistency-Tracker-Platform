import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpenCheck, RotateCcw, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { useSkillContext } from '../context/SkillContext';

export default function RevisionPage() {
  const navigate = useNavigate();
  const { revisions, markRevised } = useSkillContext();
  const [query, setQuery] = useState('');

  const filteredRevisions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return revisions;

    return revisions.filter((item) => {
      const topic = (item.topic || '').toLowerCase();
      const skill = (item.skill || '').toLowerCase();
      return topic.includes(normalizedQuery) || skill.includes(normalizedQuery);
    });
  }, [query, revisions]);

  const handleClearRevision = async (revisionId, topic) => {
    try {
      await markRevised(revisionId, topic);
    } catch (error) {
      console.error('Failed to clear revision queue item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-zinc-900 dark:text-white" style={{ background: 'var(--surface)' }}>
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 pt-20 pb-10 px-4 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-blue-500/40 dark:hover:text-blue-300"
                >
                  <ArrowLeft size={14} />
                  Back to Dashboard
                </button>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Revise Concepts
                </h1>
              </div>

              <div className="relative w-full max-w-md">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search revision topics or skills"
                  className="w-full rounded-2xl border border-zinc-200 bg-white/80 py-3 pl-10 pr-10 text-sm text-zinc-700 outline-none transition focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-zinc-200/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171717]/80 md:p-8"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <BookOpenCheck size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Revision Queue</p>
                    <h2 className="text-xl font-black text-zinc-950 dark:text-white">{filteredRevisions.length} items</h2>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredRevisions.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-200 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                      <RotateCcw size={20} />
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white">No revision topics right now</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      Topics you mark for revision will appear here so you can revisit them with focus.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredRevisions.map((revision) => (
                      <motion.div
                        key={revision._id}
                        layout
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        className="rounded-[26px] border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            {revision.skill || 'General'}
                          </span>
                          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{revision.revisionCount || 1}x</span>
                        </div>

                        <h3 className="text-lg font-black text-zinc-900 dark:text-white">{revision.topic}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          Revisit this concept to strengthen the weak area before your next practice session.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleClearRevision(revision._id, revision.topic)}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
                        >
                          <RotateCcw size={15} />
                          Mark as revised
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
