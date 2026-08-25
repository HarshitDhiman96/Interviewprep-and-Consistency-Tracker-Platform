import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, LayoutDashboard, Menu, NotebookPen, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'revision',
    label: 'Revise Concepts',
    icon: NotebookPen,
    path: '/revision',
  },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  const currentPage = location.pathname.startsWith('/revision') || location.pathname.startsWith('/dashboard/revision')
    ? 'revision'
    : 'dashboard';

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 248 : 80 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative shrink-0 border-r border-[var(--border)] bg-[var(--surface-low)]"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-3 py-4 border-b border-zinc-200/80 dark:border-white/10">
          <AnimatePresence initial={false} mode="wait">
            {isOpen ? (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--on-primary)]">
                  <BarChart3 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">workspace</p>
                  <p className="truncate text-sm font-black text-zinc-900 dark:text-white">APEX</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="brand-collapsed"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex justify-center w-full"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--on-primary)]">
                  <BarChart3 size={18} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            aria-label={isOpen ? 'Collapse sidebar' : 'Open sidebar'}
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-blue-500/40 dark:hover:text-blue-300"
          >
            {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-3 px-3 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: isOpen ? 2 : 0, scale: isOpen ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300'
                    : 'border-transparent bg-transparent text-zinc-700 hover:border-zinc-200 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-300' : 'bg-zinc-200/70 text-zinc-600 dark:bg-white/5 dark:text-zinc-200'}`}>
                  <Icon size={17} />
                </span>
                <AnimatePresence initial={false} mode="wait">
                  {isOpen ? (
                    <motion.span
                      key={`${item.id}-label`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="min-w-0 flex-1 text-sm font-bold tracking-tight"
                    >
                      {item.label}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200/80 px-3 py-4 dark:border-white/10">
          <AnimatePresence initial={false} mode="wait">
            {isOpen ? (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/10"
              >
                <div className="mb-1 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">Focus</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">Keep a short revision queue and revisit weak topics before the next streak window.</p>
              </motion.div>
            ) : (
              <motion.div
                key="tips-collapsed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-center"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  <Sparkles size={14} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
