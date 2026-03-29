import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Target, CalendarDays, Activity, BookOpen, ChevronRight, User, LogOut } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ActivityHeatmap from '../components/ActivityHeatmap';

export default function Dashboard() {
  const { selectedSkills, streak, totalHours, consistency, dailyLogs, weakAreas, weeklyVelocity, revisions, addDailyLog, markRevised } = useSkillContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  // daily log form state
  const [logTopic, setLogTopic] = useState('');
  const [logTime, setLogTime] = useState('');
  const [logSkill, setLogSkill] = useState(selectedSkills[0]);
  const [logStatus, setLogStatus] = useState('Solved'); // Solved vs Stuck

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!logTopic || !logTime) return;
    addDailyLog({
      id: Date.now(),
      topic: logTopic,
      timeSpent: logTime,
      skill: logSkill,
      status: logStatus,
      date: new Date().toISOString()
    });
    setLogTopic('');
    setLogTime('');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'daily-log', label: 'Daily Log', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics', icon: Target },
    { id: 'revisions', label: 'Revisions', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface)' }}>

      {/* Dashboard Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 bg-zinc-50/95 dark:bg-[#0a0a0a]/95 border-b border-zinc-200 dark:border-white/5 backdrop-blur-md transition-colors duration-300">
        <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400" style={{ fontFamily: 'Manrope, sans-serif' }}>
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

      {/* Main body: sidebar + content */}
      <div className="flex flex-1 pt-16">
      {/* Sidebar — sticky below topbar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden md:flex flex-col w-60 shrink-0 sticky top-16 h-[calc(100vh-4rem)] pb-6 px-3 bg-zinc-50 border-r border-zinc-200 dark:bg-[#0a0a0a] dark:border-white/5 transition-colors duration-300 overflow-y-auto"
      >
        <div className="flex flex-col gap-1 mt-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-left w-full ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-[rgba(132,173,255,0.12)] dark:text-[#84adff]' 
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-8 px-4 md:px-8 pb-12 min-h-0">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-2 text-zinc-950 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
              Welcome back. Let's build momentum.
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* Streak Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-3xl"
              style={{ background: 'var(--surface-container)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-white/50">Current Streak</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(253, 139, 0, 0.15)' }}>
                  <Flame size={16} color="#fd8b00" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: '#fd8b00', textShadow: '0 0 20px rgba(253, 139, 0, 0.3)' }}>{streak}</span>
                <span className="text-sm font-bold text-zinc-500 dark:text-white/50 uppercase tracking-widest">Days</span>
              </div>
            </motion.div>

            {/* Consistency % */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="p-6 rounded-3xl"
              style={{ background: 'var(--surface-container)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-white/50">Consistency</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(132, 173, 255, 0.15)' }}>
                  <Target size={16} color="#84adff" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}>{consistency}%</span>
              </div>
            </motion.div>

            {/* Total Hours */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
              className="p-6 rounded-3xl"
              style={{ background: 'var(--surface-container)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-white/50">Time Invested</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(37, 99, 235, 0.15)' }}>
                  <Clock size={16} className="text-blue-500 dark:text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}>{totalHours}</span>
                <span className="text-sm font-bold text-zinc-500 dark:text-white/50 uppercase tracking-widest">Hrs</span>
              </div>
            </motion.div>

            {/* Active Skills */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="p-6 rounded-3xl flex flex-col justify-between"
              style={{ background: 'var(--surface-container)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-white/50 mb-3 block">Active Vectors</span>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(132, 173, 255, 0.1)', color: '#84adff' }}>
                    {skill}
                  </span>
                ))}
                {selectedSkills.length > 3 && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--on-surface)' }}>
                    +{selectedSkills.length - 3}
                  </span>
                )}
              </div>
            </motion.div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Daily Log Form - spans 2 cols */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
               className="lg:col-span-2 p-6 md:p-8 rounded-[32px]"
               style={{ background: 'var(--surface-container)' }}
            >
              <h3 className="text-xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Log Session</h3>
              <form onSubmit={handleAddLog} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Topic / Problem</label>
                    <input 
                      type="text" 
                      required
                      value={logTopic}
                      onChange={(e) => setLogTopic(e.target.value)}
                      placeholder="e.g. Two Sum, Event Loop..."
                      className="bg-transparent border-b border-zinc-300 dark:border-white/10 py-2 text-zinc-900 dark:text-white outline-none focus:border-blue-400 transition-colors placeholder:text-zinc-400 dark:placeholder:text-white/20"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Time Spent (hrs)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      required
                      value={logTime}
                      onChange={(e) => setLogTime(e.target.value)}
                      placeholder="1.5"
                      className="bg-transparent border-b border-zinc-300 dark:border-white/10 py-2 text-zinc-900 dark:text-white outline-none focus:border-blue-400 transition-colors placeholder:text-zinc-400 dark:placeholder:text-white/20"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end w-full">
                  <div className="flex flex-col gap-2 flex-1 w-full">
                     <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Skill Category</label>
                     <select 
                       value={logSkill}
                       onChange={(e) => setLogSkill(e.target.value)}
                       className="bg-transparent border-b border-zinc-300 dark:border-white/10 py-2 text-zinc-800 dark:text-white/80 outline-none focus:border-blue-400 appearance-none"
                     >
                       {selectedSkills.map(s => <option key={s} value={s} className="bg-zinc-100 dark:bg-neutral-900">{s}</option>)}
                     </select>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                     <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">Status</label>
                     <div className="flex rounded-lg overflow-hidden border border-zinc-300 dark:border-white/10 p-1" style={{ background: 'rgba(0,0,0,0.02)' }}>
                       <button type="button" onClick={() => setLogStatus('Solved')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${logStatus === 'Solved' ? 'bg-[#84adff] text-[#002d64]' : 'text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white'}`}>Solved</button>
                       <button type="button" onClick={() => setLogStatus('Stuck')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${logStatus === 'Stuck' ? 'bg-[#fd8b00] text-white' : 'text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white'}`}>Stuck</button>
                     </div>
                  </div>
                </div>
                
                <button type="submit" className="w-full py-4 rounded-xl font-bold text-lg mt-4 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #84adff 0%, #6c9fff 100%)', color: '#002d64', fontFamily: 'Manrope, sans-serif' }}>
                  Commit Log
                </button>
              </form>
            </motion.div>

            {/* Needs Focus / Revisions */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
               className="p-6 md:p-8 rounded-[32px] flex flex-col h-full min-h-[300px]"
               style={{ background: 'var(--surface-container)' }}
            >
               <h3 className="text-xl font-black mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                 <Target size={20} color="#fd8b00" /> Needs Focus
               </h3>
               
               <div className="space-y-4 flex-1 overflow-y-auto w-full pr-2 pb-2">
                 {weakAreas && weakAreas.length === 0 ? (
                  <div className="text-zinc-400 dark:text-white/30 text-sm italic py-8 text-center border border-zinc-200 dark:border-white/5 rounded-xl border-dashed w-full">No active blocks. You're clear.</div>
                 ) : (
                   weakAreas?.map((area, i) => (
                     <div key={i} className="p-4 rounded-2xl flex justify-between items-center w-full" style={{ background: 'rgba(253, 139, 0, 0.05)', border: '1px solid rgba(253, 139, 0, 0.1)' }}>
                       <div className="flex-1 truncate pr-4">
                         <p className="font-bold text-sm truncate w-full" style={{ color: 'var(--on-surface)' }}>{area.topic}</p>
                         <p className="text-xs mt-1 font-semibold flex items-center gap-2" style={{ color: '#fd8b00' }}>
                            <span>{area.skill}</span>
                            <span className="opacity-60">• {area.stuckCount} struggles</span>
                         </p>
                       </div>
                        <button className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-700 dark:text-white">
                         <ChevronRight size={14} />
                       </button>
                     </div>
                   ))
                 )}
               </div>
            </motion.div>
          </div>

          {/* Bottom Grid for Velocity and Revisions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Weekly Activity Bottom Row - Spans 2 cols */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
               className="lg:col-span-2 p-6 md:p-8 rounded-[32px] relative overflow-hidden"
               style={{ background: 'var(--surface-container)' }}
            >
               <h3 className="text-xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Weekly Velocity</h3>
               <div className="h-48 flex items-end justify-between w-full pt-4">
                  {!weeklyVelocity || weeklyVelocity.length === 0 ? (
                  <div className="w-full text-center text-zinc-400 dark:text-zinc-600 italic text-sm">Waiting for incoming logs...</div>
                  ) : (
                    weeklyVelocity.slice(-7).map((val, i) => {
                      const relevantData = weeklyVelocity.slice(-7);
                      const maxTime = Math.max(...relevantData.map(v => v.totalTime), 1);
                      const heightPercent = (val.totalTime / maxTime) * 100;
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 w-full px-1 sm:px-2">
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${heightPercent}%` }} 
                            transition={{ duration: 1, delay: 1 + (i * 0.1) }}
                            className="w-full rounded-t-lg relative group overflow-hidden"
                            style={{ background: 'linear-gradient(to top, rgba(132, 173, 255, 0.2), #84adff)', minHeight: '4px' }}
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {/* Hover tooltip */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[9px] font-black text-slate-900 pointer-events-none transition-opacity">
                              {val.totalTime}h
                            </div>
                          </motion.div>
                          <span className="text-[9px] md:text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                            Wk {val.week}
                          </span>
                        </div>
                      )
                    })
                  )}
               </div>
            </motion.div>

            {/* Revision Tracker */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
               className="p-6 md:p-8 rounded-[32px] flex flex-col h-full min-h-[300px]"
               style={{ background: 'var(--surface-container)' }}
            >
               <h3 className="text-xl font-black mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                 <BookOpen size={20} color="#84adff" /> Revisions
               </h3>
               
               <div className="space-y-4 flex-1 overflow-y-auto">
                 {revisions.length === 0 ? (
                  <div className="text-zinc-400 dark:text-zinc-600 text-sm italic py-8 text-center border border-zinc-200 dark:border-white/5 rounded-xl border-dashed">No topics to revise yet.</div>
                 ) : (
                   revisions.slice(0, 5).map((log, i) => (
                     <div key={log._id || i} className="p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                       <div>
                        <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{log.topic}</p>
                          <p className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            {log.skill} &nbsp;·&nbsp; {new Date(log.createdAt || log.date).toLocaleDateString()}
                          </p>
                       </div>
                        <button
                          onClick={() => markRevised(log.skill, log.topic)}
                          className="w-full py-2 rounded-lg text-xs font-bold transition-colors bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-[#84adff]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                         Mark Revised
                       </button>
                     </div>
                   ))
                 )}
               </div>
            </motion.div>
          
          </div>

          {/* Activity Heatmap */}
          <ActivityHeatmap dailyLogs={dailyLogs} />

        </div>
      </main>
      </div> {/* end flex body (sidebar + content) */}
    </div>
  );
}
