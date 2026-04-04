import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  ListFilter,
  LogOut,
  Plus,
  Target,
  Trash2,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from '../components/ActivityHeatmap';
import ThemeToggle from '../components/ThemeToggle';
import { useSkillContext } from '../context/SkillContext';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Solved', 'Stuck', 'Revised'];
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const statCards = [
  {
    id: 'streak',
    label: 'Current Streak',
    icon: Flame,
    accent: '#fd8b00',
  },
  {
    id: 'consistency',
    label: 'Consistency',
    icon: Target,
    accent: '#84adff',
  },
  {
    id: 'hours',
    label: 'Time Invested',
    icon: Clock,
    accent: '#2563eb',
  },
  {
    id: 'skills',
    label: 'Active Skills',
    icon: Activity,
    accent: '#10b981',
  },
];

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString();
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading, logout } = useAuth();
  const {
    skills,
    selectedSkills,
    streak,
    totalHours,
    dailyLogs,
    todayLogs,
    weeklyLogs,
    filteredLogs,
    activeSkillFilter,
    setActiveSkillFilter,
    consistency,
    consistencyStats,
    weakAreas,
    weeklyVelocity,
    revisions,
    skillProgress,
    celebration,
    setCelebration,
    pageToast,
    setPageToast,
    loading,
    error,
    actionError,
    addDailyLog,
    markRevised,
    createSkill,
    removeSkill,
  } = useSkillContext();

  const [logTopic, setLogTopic] = useState('');
  const [logTime, setLogTime] = useState('');
  const [logSkill, setLogSkill] = useState('');
  const [logStatus, setLogStatus] = useState('Solved');
  const [logDifficulty, setLogDifficulty] = useState('Medium');
  const [newSkillName, setNewSkillName] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!celebration) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCelebration(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [celebration, setCelebration]);

  useEffect(() => {
    if (error) {
      setPageToast({ type: 'error', message: error });
    }
  }, [error, setPageToast]);

  useEffect(() => {
    if (actionError) {
      setPageToast({ type: 'error', message: actionError });
    }
  }, [actionError, setPageToast]);

  useEffect(() => {
    if (!formMessage) {
      return undefined;
    }

    setPageToast({ type: 'success', message: formMessage });
    const timeoutId = window.setTimeout(() => {
      setFormMessage('');
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [formMessage, setPageToast]);

  useEffect(() => {
    if (!pageToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPageToast(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [pageToast, setPageToast]);

  const skillOptions = useMemo(() => selectedSkills, [selectedSkills]);

  const handleLogout = () => {
    logout().finally(() => navigate('/'));
  };

  const handleAddLog = async (event) => {
    event.preventDefault();
    setFormMessage('');

    if (!logTopic || !logTime || !logSkill) {
      setFormMessage('Pick a skill and complete the log fields first.');
      return;
    }

    try {
      await addDailyLog({
        topic: logTopic,
        timeSpent: logTime,
        skill: logSkill,
        status: logStatus,
        difficulty: logDifficulty,
      });
      setLogTopic('');
      setLogTime('');
      setLogDifficulty('Medium');
      setLogStatus('Solved');
      setFormMessage('Log saved to the database.');
    } catch (serviceError) {
      setFormMessage(serviceError.message);
    }
  };

  const handleCreateSkill = async (event) => {
    event.preventDefault();
    setFormMessage('');

    if (!newSkillName.trim()) {
      return;
    }

    try {
      await createSkill(newSkillName);
      setNewSkillName('');
      setFormMessage('Skill added successfully.');
    } catch (serviceError) {
      setFormMessage(serviceError.message);
    }
  };

  const handleMarkRevised = async (skill, topic) => {
    setFormMessage('');

    try {
      await markRevised(skill, topic);
    } catch (serviceError) {
      setFormMessage(serviceError.message);
    }
  };

  const stats = {
    streak,
    consistency: `${consistency}%`,
    hours: `${totalHours}h`,
    skills: selectedSkills.length,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 bg-zinc-50/95 dark:bg-[#0a0a0a]/95 border-b border-zinc-200 dark:border-white/5 backdrop-blur-md transition-colors duration-300">
        <span
          className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          APEX
        </span>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <ThemeToggle />
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/70 dark:hover:text-white dark:border-white/10"
          >
            <User size={15} />
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:hover:text-red-300 dark:border-red-500/20"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-24 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-2 text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Live data from your Express API and database.
            </p>
          </motion.div>

          <AnimatePresence>
            {celebration && (
              <motion.div
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="rounded-[28px] px-5 py-4 border border-emerald-200 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(132,173,255,0.12))] dark:border-emerald-500/20 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(59,130,246,0.14))]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="font-black text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {celebration.title}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {celebration.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="rounded-2xl px-4 py-3 text-sm border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300">
              Refreshing your latest skills, logs, analytics, and revisions.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 rounded-3xl" style={{ background: 'var(--surface-container)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-white/50">{card.label}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${card.accent}20` }}>
                      <Icon size={16} color={card.accent} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}>
                      {stats[card.id]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <ActivityHeatmap dailyLogs={dailyLogs} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="xl:col-span-2 p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <h3 className="text-xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Log Session</h3>
              <form onSubmit={handleAddLog} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Topic / Problem</label>
                    <input
                      type="text"
                      required
                      value={logTopic}
                      onChange={(event) => setLogTopic(event.target.value)}
                      placeholder="e.g. Binary Search on Answers"
                      className="bg-transparent border-b border-zinc-300 dark:border-white/10 py-2 text-zinc-900 dark:text-white outline-none focus:border-blue-400 transition-colors placeholder:text-zinc-400 dark:placeholder:text-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Time Spent (hrs)</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      required
                      value={logTime}
                      onChange={(event) => setLogTime(event.target.value)}
                      placeholder="1.5"
                      className="bg-transparent border-b border-zinc-300 dark:border-white/10 py-2 text-zinc-900 dark:text-white outline-none focus:border-blue-400 transition-colors placeholder:text-zinc-400 dark:placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Skill Category</label>
                    <select
                      value={logSkill}
                      onChange={(event) => setLogSkill(event.target.value)}
                      className="bg-transparent border-b border-zinc-300 dark:border-white/10 py-2 text-zinc-800 dark:text-white/80 outline-none focus:border-blue-400 appearance-none"
                    >
                      <option value="">Select a skill</option>
                      {skillOptions.map((skillName) => (
                        <option key={skillName} value={skillName} className="bg-zinc-100 dark:bg-neutral-900">
                          {skillName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {DIFFICULTY_OPTIONS.map((difficulty) => (
                        <button
                          key={difficulty}
                          type="button"
                          onClick={() => setLogDifficulty(difficulty)}
                          className={`py-2 text-sm font-bold rounded-lg transition-all border ${
                            logDifficulty === difficulty
                              ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                              : 'text-zinc-500 border-zinc-300 hover:text-zinc-900 dark:text-white/50 dark:border-white/10 dark:hover:text-white'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Status</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setLogStatus(status)}
                        className={`py-2 text-sm font-bold rounded-lg transition-all border ${
                          logStatus === status
                            ? status === 'Stuck'
                              ? 'bg-orange-400 text-white border-orange-300'
                              : status === 'Revised'
                                ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                                : 'bg-[#84adff] text-[#002d64] border-blue-200'
                            : 'text-zinc-500 border-zinc-300 hover:text-zinc-900 dark:text-white/50 dark:border-white/10 dark:hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #84adff 0%, #6c9fff 100%)', color: '#002d64', fontFamily: 'Manrope, sans-serif' }}>
                  Commit Log
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px] flex flex-col gap-6" style={{ background: 'var(--surface-container)' }}>
              <div>
                <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Skills</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage the skills that power your logs, filters, and analytics.</p>
              </div>
              <form onSubmit={handleCreateSkill} className="flex gap-3">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(event) => setNewSkillName(event.target.value)}
                  placeholder="Add a new skill"
                  className="flex-1 rounded-xl px-4 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none"
                />
                <button type="submit" className="px-4 rounded-xl bg-blue-500 text-white font-semibold flex items-center gap-2">
                  <Plus size={16} />
                  Add
                </button>
              </form>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {skills.length === 0 ? (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl p-4">
                    No skills in the database yet. Add one to unlock filtered analytics and log categories.
                  </div>
                ) : (
                  skills.map((skill) => (
                    <div key={skill._id} className="flex items-center justify-between rounded-2xl px-4 py-3 bg-zinc-100 dark:bg-white/5">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{skill.name}</p>
                      </div>
                      <button type="button" onClick={() => removeSkill(skill._id)} className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-white/10 flex items-center justify-center text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={18} color="#84adff" />
                <h3 className="text-xl font-black" style={{ fontFamily: 'Manrope, sans-serif' }}>Today&apos;s Logs</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{todayLogs.length} records captured today.</p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {todayLogs.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No logs recorded today.</p>
                ) : (
                  todayLogs.map((log) => (
                    <div key={log._id} className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5">
                      <p className="font-semibold text-zinc-900 dark:text-white">{log.topic}</p>
                      <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">{log.skill} • {log.status} • {log.difficulty} • {log.timespent}h</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} color="#10b981" />
                <h3 className="text-xl font-black" style={{ fontFamily: 'Manrope, sans-serif' }}>Last 7 Days</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{weeklyLogs.length} records from the last week.</p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {weeklyLogs.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No weekly logs found.</p>
                ) : (
                  weeklyLogs.slice(0, 6).map((log) => (
                    <div key={log._id} className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5">
                      <p className="font-semibold text-zinc-900 dark:text-white">{log.topic}</p>
                      <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">{formatDate(log.createdAt)} • {log.skill} • {log.difficulty} • {log.timespent}h</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <div className="flex items-center gap-2 mb-4">
                <ListFilter size={18} color="#fd8b00" />
                <h3 className="text-xl font-black" style={{ fontFamily: 'Manrope, sans-serif' }}>Filter By Skill</h3>
              </div>
              <select
                value={activeSkillFilter}
                onChange={(event) => setActiveSkillFilter(event.target.value)}
                className="w-full rounded-xl px-4 py-3 mb-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none"
              >
                <option value="">Choose a skill</option>
                {selectedSkills.map((skillName) => (
                  <option key={skillName} value={skillName}>
                    {skillName}
                  </option>
                ))}
              </select>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{filteredLogs.length} matching study records.</p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {filteredLogs.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No logs match the selected skill yet.</p>
                ) : (
                  filteredLogs.slice(0, 6).map((log) => (
                    <div key={log._id} className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5">
                      <p className="font-semibold text-zinc-900 dark:text-white">{log.topic}</p>
                      <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">{log.status} • {log.difficulty} • {log.timespent}h • {formatDate(log.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="xl:col-span-2 p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Weekly Velocity</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{weeklyVelocity.length} weekly progress points.</p>
              <div className="h-48 flex items-end justify-between gap-2">
                {weeklyVelocity.length === 0 ? (
                  <div className="w-full text-center text-zinc-400 dark:text-zinc-600 italic text-sm">Waiting for weekly progress data...</div>
                ) : (
                  weeklyVelocity.slice(-7).map((entry) => {
                    const maxTime = Math.max(...weeklyVelocity.slice(-7).map((item) => item.totalTime || 0), 1);
                    const height = ((entry.totalTime || 0) / maxTime) * 100;
                    return (
                      <div key={`${entry.year}-${entry.week}`} className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max(height, 4)}%`, background: 'linear-gradient(to top, rgba(132, 173, 255, 0.2), #84adff)' }} />
                        <span className="text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Wk {entry.week}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Skill Progress</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Live totals grouped by your skills.</p>
              <div className="space-y-4">
                {skillProgress.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Skill totals will appear after your first few logs.</p>
                ) : (
                  skillProgress.map((item) => (
                    <div key={item.skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">{item.skill}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.totalLogs} logs • {item.totalTime}h</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min((item.totalTime / Math.max(totalHours, 1)) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Consistency Snapshot</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">A quick snapshot of your study rhythm.</p>
              <div className="space-y-3">
                <div className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5 flex items-center justify-between">
                  <span>Consistency</span>
                  <strong>{consistencyStats.consistency}%</strong>
                </div>
                <div className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5 flex items-center justify-between">
                  <span>Active Days</span>
                  <strong>{consistencyStats.activeDays}</strong>
                </div>
                <div className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5 flex items-center justify-between">
                  <span>Total Span Days</span>
                  <strong>{consistencyStats.totalDays}</strong>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} color="#fd8b00" />
                <h3 className="text-xl font-black" style={{ fontFamily: 'Manrope, sans-serif' }}>Needs Focus</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{weakAreas.length} topics currently needing extra attention.</p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {weakAreas.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No weak areas detected right now.</p>
                ) : (
                  weakAreas.map((area) => (
                    <div key={`${area.skill}-${area.topic}`} className="rounded-2xl p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
                      <p className="font-semibold text-zinc-900 dark:text-white">{area.topic}</p>
                      <p className="text-xs mt-1 text-orange-700 dark:text-orange-300">{area.skill} • stuck {area.stuckCount} • solved {area.solvedCount}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} color="#84adff" />
                <h3 className="text-xl font-black" style={{ fontFamily: 'Manrope, sans-serif' }}>Revisions</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{revisions.length} revision records ready for follow-up.</p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {revisions.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No revision topics yet.</p>
                ) : (
                  revisions.slice(0, 6).map((revision) => (
                    <div key={revision._id} className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5">
                      <p className="font-semibold text-zinc-900 dark:text-white">{revision.topic}</p>
                      <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">{revision.skill} • revised {revision.revisionCount} times</p>
                      <button type="button" onClick={() => handleMarkRevised(revision._id, revision.topic)} className="mt-3 w-full py-2 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        Mark Revised
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 md:p-8 rounded-[32px]" style={{ background: 'var(--surface-container)' }}>
              <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Recent Activity</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{dailyLogs.length} total study records so far.</p>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {dailyLogs.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Your database-backed activity feed will appear here.</p>
                ) : (
                  dailyLogs.slice(0, 8).map((log) => (
                    <div key={log._id} className="rounded-2xl p-4 bg-zinc-100 dark:bg-white/5">
                      <p className="font-semibold text-zinc-900 dark:text-white">{log.topic}</p>
                      <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">{formatDate(log.createdAt)} • {log.skill} • {log.status} • {log.difficulty} • {log.timespent}h</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {pageToast && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,540px)]"
          >
            <div
              className={`rounded-[24px] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] border backdrop-blur-md ${
                pageToast.type === 'error'
                  ? 'bg-red-50/95 border-red-200 text-red-700 dark:bg-red-500/12 dark:border-red-500/20 dark:text-red-300'
                  : 'bg-white/95 border-zinc-200 text-zinc-800 dark:bg-white/10 dark:border-white/10 dark:text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    pageToast.type === 'error'
                      ? 'bg-red-100 text-red-600 dark:bg-red-500/18 dark:text-red-300'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-500/18 dark:text-blue-300'
                  }`}
                >
                  {pageToast.type === 'error' ? <Info size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{pageToast.message}</p>
                  <p className="text-xs opacity-70 mt-1">This message will fade out automatically.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
