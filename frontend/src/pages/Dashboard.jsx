import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  ListFilter,
  LogOut,
  MessageSquare,
  Plus,
  Sparkles,
  Target,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from '../components/ActivityHeatmap';
import ThemeToggle from '../components/ThemeToggle';
import { useSkillContext } from '../context/SkillContext';
import { useAuth } from '../context/AuthContext';
import GoalOnboardingModal from '../components/GoalOnboardingModal';
import { sendCoachMessage, summarizeCoachConversation } from '../services/aiChatService';

const STATUS_OPTIONS = ['Solved', 'Stuck', 'Revised'];
const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Great' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😐', label: 'Average' },
  { emoji: '😞', label: 'Bad' },
  { emoji: '😫', label: 'Burned Out' },
];
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
  const { user, isAuthenticated, authLoading, logout, refreshAuth, updateGoal } = useAuth();
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
  const [logReflection, setLogReflection] = useState('');
  const [logMood, setLogMood] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [goalModalDismissed, setGoalModalDismissed] = useState(false);

  // --- Task 1: Weekly Velocity Month-wise state & aggregation ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // --- Task 2: AI Coach drawer & tooltip state ---
  const [coachOpen, setCoachOpen] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [coachMessages, setCoachMessages] = useState([]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');
  const [conversationId, setConversationId] = useState('');

  const MONTH_NAMES = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

  const availableYears = useMemo(() => {
    const yearsSet = new Set([new Date().getFullYear()]);
    if (Array.isArray(dailyLogs)) {
      dailyLogs.forEach((log) => {
        if (log.createdAt) {
          const year = new Date(log.createdAt).getFullYear();
          if (!Number.isNaN(year)) {
            yearsSet.add(year);
          }
        }
      });
    }
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [dailyLogs]);

  const monthlyWeeklyVelocity = useMemo(() => {
    const weeks = [
      { label: 'Week 1', labelLong: '1st Week', range: '1st - 7th', totalTime: 0, totalLogs: 0 },
      { label: 'Week 2', labelLong: '2nd Week', range: '8th - 14th', totalTime: 0, totalLogs: 0 },
      { label: 'Week 3', labelLong: '3rd Week', range: '15th - 21st', totalTime: 0, totalLogs: 0 },
      { label: 'Week 4', labelLong: '4th Week', range: '22nd - 28th', totalTime: 0, totalLogs: 0 },
      { label: 'Week 5', labelLong: '5th Week', range: '29th - End', totalTime: 0, totalLogs: 0 },
    ];

    if (!Array.isArray(dailyLogs)) return weeks;

    dailyLogs.forEach((log) => {
      const logDate = new Date(log.createdAt);
      if (
        logDate.getMonth() === selectedMonth &&
        logDate.getFullYear() === selectedYear
      ) {
        const day = logDate.getDate();
        const timeSpent = Number(log.timespent) || 0;

        if (day >= 1 && day <= 7) {
          weeks[0].totalTime += timeSpent;
          weeks[0].totalLogs += 1;
        } else if (day >= 8 && day <= 14) {
          weeks[1].totalTime += timeSpent;
          weeks[1].totalLogs += 1;
        } else if (day >= 15 && day <= 21) {
          weeks[2].totalTime += timeSpent;
          weeks[2].totalLogs += 1;
        } else if (day >= 22 && day <= 28) {
          weeks[3].totalTime += timeSpent;
          weeks[3].totalLogs += 1;
        } else if (day >= 29) {
          weeks[4].totalTime += timeSpent;
          weeks[4].totalLogs += 1;
        }
      }
    });

    return weeks;
  }, [dailyLogs, selectedMonth, selectedYear]);

  const totalMonthlyTime = useMemo(() => {
    return monthlyWeeklyVelocity.reduce((sum, wk) => sum + wk.totalTime, 0);
  }, [monthlyWeeklyVelocity]);

  const totalMonthlyLogs = useMemo(() => {
    return monthlyWeeklyVelocity.reduce((sum, wk) => sum + wk.totalLogs, 0);
  }, [monthlyWeeklyVelocity]);

  const avgWeeklyTime = useMemo(() => {
    return (totalMonthlyTime / 5).toFixed(1);
  }, [totalMonthlyTime]);

  const mostActiveWeek = useMemo(() => {
    let maxTime = -1;
    let bestWeek = 'None';
    monthlyWeeklyVelocity.forEach((wk) => {
      if (wk.totalTime > maxTime) {
        maxTime = wk.totalTime;
        bestWeek = wk.labelLong;
      }
    });
    return maxTime > 0 ? `${bestWeek}` : 'None';
  }, [monthlyWeeklyVelocity]);

  const monthlyMotivationalMessage = useMemo(() => {
    if (totalMonthlyTime === 0) {
      return "No study time logged yet for this month. Take the first step and commit a log now! 🌟";
    }
    if (totalMonthlyTime < 10) {
      return "A solid start! Push yourself to reach 10 hours and build that initial momentum. 🚀";
    }
    if (totalMonthlyTime < 25) {
      return "Amazing consistency! Keep pushing, every hour invested builds your future mastery. 💪";
    }
    return "Phenomenal effort! You are operating at peak efficiency this month. Keep shining! 🔥";
  }, [totalMonthlyTime]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleCoachSend = async (event) => {
    event?.preventDefault();

    if (!coachInput.trim() || coachLoading) {
      return;
    }

    const userMessage = coachInput.trim();
    setCoachInput('');
    setCoachLoading(true);
    setCoachError('');
    setCoachMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const payload = await sendCoachMessage({
        message: userMessage,
        conversationId,
      });

      if (payload?.conversationId) {
        setConversationId(payload.conversationId);
      }

      setCoachMessages((prev) => [...prev, { role: 'model', text: payload?.message || 'I could not respond right now.' }]);
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to reach the AI coach right now.';
      setCoachError(message);
      setCoachMessages((prev) => [...prev, { role: 'model', text: message }]);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleCloseCoach = async () => {
    if (!conversationId) {
      setCoachOpen(false);
      return;
    }

    try {
      // console.log('[AI Coach] Closing conversation and triggering summary for:', conversationId);
      const result = await summarizeCoachConversation({ conversationId });
      // console.log('[AI Coach] Summary result:', result);
      setCoachMessages((prev) => [...prev, { role: 'system', text: `Summary saved: ${result?.summary || 'No summary available.'}` }]);
    } catch (error) {
      console.error('[AI Coach] Summary failed:', error?.response?.data || error.message);
    } finally {
      setCoachOpen(false);
    }
  };

  useEffect(() => {
    if (user?.goalCompleted || user?.primaryGoal) {
      setGoalModalDismissed(true);
    }
  }, [user?.goalCompleted, user?.primaryGoal]);

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
        reflection: logReflection,
        mood: logMood,
      });
      setLogTopic('');
      setLogTime('');
      setLogDifficulty('Medium');
      setLogStatus('Solved');
      setLogReflection('');
      setLogMood('');
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

  const handleGoalSubmit = async (goal) => {
    try {
      await updateGoal(goal);
      setGoalModalDismissed(true);
      await refreshAuth().catch(() => null);
      setPageToast({ type: 'success', message: 'Goal updated successfully!' });
    } catch (err) {
      setPageToast({ type: 'error', message: err.message || 'Failed to update goal' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface)' }}>
      <GoalOnboardingModal
        isOpen={isAuthenticated && user && !goalModalDismissed && !user.goalCompleted && !user.primaryGoal}
        onSubmit={handleGoalSubmit}
      />
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

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Mood (Optional)</label>
                  <div className="flex gap-2">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.label}
                        type="button"
                        onClick={() => setLogMood(logMood === mood.label ? '' : mood.label)}
                        className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all border ${
                          logMood === mood.label
                            ? 'bg-blue-100 border-blue-200 dark:bg-blue-500/20 dark:border-blue-500/30 ring-2 ring-blue-500/20'
                            : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20'
                        }`}
                        title={mood.label}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Reflection (Optional)</label>
                  <textarea
                    value={logReflection}
                    onChange={(e) => setLogReflection(e.target.value)}
                    placeholder="What went well today? What challenges did you face? What slowed you down?"
                    className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-400 transition-colors placeholder:text-zinc-400 dark:placeholder:text-white/20 min-h-[100px] resize-none"
                  />
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
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="xl:col-span-2 p-6 md:p-8 rounded-[32px] flex flex-col gap-6" style={{ background: 'var(--surface-container)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>Weekly Velocity</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Weekly progress for {MONTH_NAMES[selectedMonth]} {selectedYear}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/10 outline-none text-sm font-semibold transition-all duration-200 cursor-pointer"
                  >
                    {MONTH_NAMES.map((name, index) => (
                      <option key={name} value={index} className="bg-white dark:bg-neutral-900 text-zinc-900 dark:text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/10 outline-none text-sm font-semibold transition-all duration-200 cursor-pointer"
                  >
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr} className="bg-white dark:bg-neutral-900 text-zinc-900 dark:text-white">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Chart Column */}
                <div className="lg:col-span-2 flex flex-col justify-end">
                  <div className="h-56 flex items-end justify-between gap-3 px-2">
                    {monthlyWeeklyVelocity.map((week) => {
                      const maxTime = Math.max(...monthlyWeeklyVelocity.map((w) => w.totalTime), 1);
                      const height = (week.totalTime / maxTime) * 100;
                      return (
                        <div key={week.label} className="group relative flex-1 flex flex-col items-center gap-3 h-full justify-end">
                          {/* Tooltip */}
                          <div className="absolute bottom-[calc(100%-4px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-10 w-28 bg-zinc-950/95 dark:bg-white text-white dark:text-zinc-950 text-center rounded-xl py-2 px-3 text-xs shadow-xl border border-white/10 dark:border-zinc-200">
                            <p className="font-extrabold text-blue-400 dark:text-blue-600">{week.totalTime} hrs</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{week.totalLogs} logs</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-950 dark:bg-white border-r border-b border-white/10 dark:border-zinc-200 rotate-45 -translate-y-1" />
                          </div>
                          {/* Bar background track */}
                          <div className="w-full h-40 bg-zinc-100 dark:bg-white/[0.03] rounded-2xl relative overflow-hidden group-hover:scale-x-[1.03] transition-transform duration-200 cursor-pointer">
                            {/* Animated active bar */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(height, week.totalTime > 0 ? 6 : 0)}%` }}
                              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                              className="w-full absolute bottom-0 rounded-2xl"
                              style={{
                                background: week.totalTime > 0
                                  ? 'linear-gradient(to top, rgba(37, 99, 235, 0.3), var(--primary))'
                                  : 'transparent',
                                boxShadow: week.totalTime > 0 ? '0 0 16px rgba(37, 99, 235, 0.25)' : 'none'
                              }}
                            />
                            {/* Accent Glow on Hover */}
                            {week.totalTime > 0 && (
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--primary) 10%, transparent 60%)' }} />
                            )}
                          </div>
                          {/* Labels */}
                          <div className="text-center">
                            <span className="block text-[11px] font-black text-zinc-800 dark:text-zinc-200 tracking-tight">{week.labelLong}</span>
                            <span className="block text-[9px] text-zinc-500 dark:text-zinc-500 font-medium mt-0.5">{week.range}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats & Motivation Column */}
                <div className="flex flex-col justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Monthly Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200/40 dark:border-white/5">
                        <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Total Time</span>
                        <strong className="text-lg font-black text-zinc-900 dark:text-white">{totalMonthlyTime}h</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200/40 dark:border-white/5">
                        <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Daily Logs</span>
                        <strong className="text-lg font-black text-zinc-900 dark:text-white">{totalMonthlyLogs}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200/40 dark:border-white/5">
                        <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Weekly Avg</span>
                        <strong className="text-lg font-black text-zinc-900 dark:text-white">{avgWeeklyTime}h</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200/40 dark:border-white/5">
                        <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Best Week</span>
                        <strong className="text-xs font-bold text-blue-600 dark:text-[#84adff] truncate block mt-0.5">{mostActiveWeek}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100/50 dark:bg-blue-950/10 dark:border-blue-900/20 text-xs">
                    <p className="font-semibold text-blue-800 dark:text-blue-300 leading-relaxed">
                      {monthlyMotivationalMessage}
                    </p>
                  </div>
                </div>
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

      {/* --- Task 2: AI Personal Coach Floating Widget & Drawer --- */}
      <div className="fixed bottom-6 right-6 z-[101] flex flex-col items-end">
        <AnimatePresence>
          {/* Coach Chat Panel / Drawer */}
          {coachOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4, x: 140, y: 200 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.4, x: 140, y: 200 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-[320px] sm:w-[400px] h-[500px] rounded-[30px] shadow-[0_24px_60px_rgba(0,0,0,0.3)] border overflow-hidden flex flex-col mb-4 bg-zinc-950 border-white/10 dark:bg-white dark:border-zinc-200"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b flex items-center justify-between bg-zinc-900 border-white/10 dark:bg-zinc-50 dark:border-zinc-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-400 dark:text-blue-600">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white dark:text-zinc-950 flex items-center gap-1.5 leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      AI Personal Coach <Sparkles size={13} className="text-amber-400" />
                    </h4>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online • Analyzing logs
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseCoach}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-700 hover:bg-white/5 dark:hover:bg-zinc-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-blue-500/10 text-blue-400 dark:text-blue-600 mt-0.5">
                    <Bot size={16} />
                  </div>
                  <div className="p-3.5 rounded-[20px] rounded-tl-sm text-xs leading-relaxed max-w-[80%] bg-zinc-900 border border-white/5 text-zinc-200 dark:bg-zinc-100 dark:border-zinc-200/50 dark:text-zinc-800">
                    <p>
                      Hey there! I am your AI Coach. I am here to help you stay motivated, analyze your study consistency, and help you improve on your weaknesses. 🤖
                    </p>
                  </div>
                </div>

                {coachMessages.map((message, index) => {
                  const isUser = message.role === 'user';
                  const isSystem = message.role === 'system';

                  return (
                    <div key={`${message.role}-${index}`} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-blue-500/10 text-blue-400 dark:text-blue-600 mt-0.5">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className={`p-3.5 rounded-[20px] text-xs leading-relaxed max-w-[80%] border ${
                        isUser
                          ? 'bg-blue-600 text-white border-blue-500'
                          : isSystem
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-zinc-900 border-white/5 text-zinc-200 dark:bg-zinc-100 dark:border-zinc-200/50 dark:text-zinc-800'
                      } ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  );
                })}

                {coachLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-blue-500/10 text-blue-400 dark:text-blue-600 mt-0.5">
                      <Bot size={16} />
                    </div>
                    <div className="p-3.5 rounded-[20px] rounded-tl-sm text-xs leading-relaxed max-w-[80%] bg-zinc-900 border border-white/5 text-zinc-200 dark:bg-zinc-100 dark:border-zinc-200/50 dark:text-zinc-800">
                      <p>Thinking...</p>
                    </div>
                  </div>
                )}

                {coachError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 text-xs">
                    {coachError}
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <form onSubmit={handleCoachSend} className="p-4 border-t bg-zinc-900 border-white/10 dark:bg-zinc-50 dark:border-zinc-200">
                <div className="relative">
                  <input
                    type="text"
                    value={coachInput}
                    onChange={(event) => setCoachInput(event.target.value)}
                    disabled={coachLoading}
                    placeholder="Ask your AI coach..."
                    className="w-full pl-4 pr-10 py-3 rounded-xl text-xs bg-zinc-950 border border-white/10 dark:bg-white dark:border-zinc-200 text-zinc-200 dark:text-zinc-800 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={coachLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-400 disabled:opacity-50"
                  >
                    <Sparkles size={14} className={coachLoading ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Attention-grabbing Speech Bubble Tooltip */}
          {!coachOpen && !bubbleDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: 1.5, duration: 0.4 }}
              className="absolute right-20 bottom-1 flex items-start gap-2.5 p-4 rounded-2xl shadow-xl w-64 border bg-zinc-950 border-white/10 text-white dark:bg-white dark:border-zinc-200 dark:text-zinc-800"
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                Let's talk about your consistency and your weakness! 💬
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBubbleDismissed(true);
                }}
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-700 hover:bg-white/5 dark:hover:bg-zinc-100 transition-all duration-200"
              >
                <X size={12} />
              </button>
              {/* Arrow */}
              <div className="absolute top-1/2 -translate-y-1/2 left-full w-2.5 h-2.5 bg-zinc-950 border-t border-r border-white/10 dark:bg-white dark:border-zinc-200 rotate-45 -translate-x-1.5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Coach Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={!coachOpen ? { y: [0, -8, 0] } : {}}
          transition={{
            y: {
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }
          }}
          onClick={() => {
            setCoachOpen(!coachOpen);
            setBubbleDismissed(true);
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 bg-zinc-900 border border-white/10 text-white dark:bg-white dark:text-zinc-900 dark:border-zinc-200/80 cursor-pointer"
        >
          {coachOpen ? <X size={22} /> : <MessageSquare size={22} className="text-[#84adff] dark:text-blue-600" />}
        </motion.button>
      </div>
    </div>
  );
}
