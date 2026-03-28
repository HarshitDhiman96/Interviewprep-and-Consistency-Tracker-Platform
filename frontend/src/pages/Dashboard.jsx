import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Target, CalendarDays, Activity, BookOpen, ChevronRight } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';

export default function Dashboard() {
  const { selectedSkills, streak, totalHours, consistency, dailyLogs, addDailyLog } = useSkillContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
    <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden md:flex flex-col w-64 pt-28 px-4 pb-6 relative z-10"
        style={{ 
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div className="flex flex-col gap-2 relative z-20">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                style={{ 
                  background: isActive ? 'rgba(132, 173, 255, 0.1)' : 'transparent',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Icon size={18} style={{ color: isActive ? '#84adff' : 'currentColor' }} />
                {item.label}
              </button>
            )
          })}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 px-4 md:px-8 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <h1 className="text-3xl md:text-5xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: '#fff' }}>
              Command Center
            </h1>
            <p className="text-white/50 text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Current Streak</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(253, 139, 0, 0.15)' }}>
                  <Flame size={16} color="#fd8b00" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: '#fd8b00', textShadow: '0 0 20px rgba(253, 139, 0, 0.3)' }}>{streak}</span>
                <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Days</span>
              </div>
            </motion.div>

            {/* Consistency % */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="p-6 rounded-3xl"
              style={{ background: 'var(--surface-container)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Consistency</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(132, 173, 255, 0.15)' }}>
                  <Target size={16} color="#84adff" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: '#fff' }}>{consistency}%</span>
              </div>
            </motion.div>

            {/* Total Hours */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
              className="p-6 rounded-3xl"
              style={{ background: 'var(--surface-container)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Time Invested</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <Clock size={16} color="#fff" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: '#fff' }}>{totalHours}</span>
                <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Hrs</span>
              </div>
            </motion.div>

            {/* Active Skills */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="p-6 rounded-3xl flex flex-col justify-between"
              style={{ background: 'var(--surface-container)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 block">Active Vectors</span>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(132, 173, 255, 0.1)', color: '#84adff' }}>
                    {skill}
                  </span>
                ))}
                {selectedSkills.length > 3 && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>
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
                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Topic / Problem</label>
                    <input 
                      type="text" 
                      required
                      value={logTopic}
                      onChange={(e) => setLogTopic(e.target.value)}
                      placeholder="e.g. Two Sum, Event Loop..."
                      className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-blue-400 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Time Spent (hrs)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      required
                      value={logTime}
                      onChange={(e) => setLogTime(e.target.value)}
                      placeholder="1.5"
                      className="bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-blue-400 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end w-full">
                  <div className="flex flex-col gap-2 flex-1 w-full">
                     <label className="text-xs font-bold uppercase tracking-widest text-white/50">Skill Category</label>
                     <select 
                       value={logSkill}
                       onChange={(e) => setLogSkill(e.target.value)}
                       className="bg-transparent border-b border-white/10 py-2 text-white/80 outline-none focus:border-blue-400 appearance-none"
                     >
                       {selectedSkills.map(s => <option key={s} value={s} className="bg-neutral-900">{s}</option>)}
                     </select>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                     <label className="text-xs font-bold uppercase tracking-widest text-white/50">Status</label>
                     <div className="flex rounded-lg overflow-hidden border border-white/10 p-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
                       <button type="button" onClick={() => setLogStatus('Solved')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${logStatus === 'Solved' ? 'bg-[#84adff] text-[#002d64]' : 'text-white/50 hover:text-white'}`}>Solved</button>
                       <button type="button" onClick={() => setLogStatus('Stuck')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${logStatus === 'Stuck' ? 'bg-[#fd8b00] text-white' : 'text-white/50 hover:text-white'}`}>Stuck</button>
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
               
               <div className="space-y-4 flex-1 overflow-y-auto">
                 {dailyLogs.filter(l => l.status === 'Stuck').length === 0 ? (
                    <div className="text-white/30 text-sm italic py-8 text-center border border-white/5 rounded-xl border-dashed">No active blocks. You're clear.</div>
                 ) : (
                   dailyLogs.filter(l => l.status === 'Stuck').map((log, i) => (
                     <div key={i} className="p-4 rounded-2xl flex justify-between items-center" style={{ background: 'rgba(253, 139, 0, 0.05)', border: '1px solid rgba(253, 139, 0, 0.1)' }}>
                       <div>
                         <p className="font-bold text-sm" style={{ color: '#fff' }}>{log.topic}</p>
                         <p className="text-xs mt-1 font-semibold" style={{ color: '#fd8b00' }}>{log.skill}</p>
                       </div>
                       <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
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
               <div className="h-48 flex items-end gap-2 sm:gap-4 md:gap-8 pt-4">
                  {[4, 2, 5, 3, 6, 4, 7].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${(val/7)*100}%` }} 
                        transition={{ duration: 1, delay: 1 + (i * 0.1) }}
                        className="w-full rounded-t-lg relative group overflow-hidden"
                        style={{ background: 'linear-gradient(to top, rgba(132, 173, 255, 0.2), #84adff)' }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                      <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-wider">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
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
                 {dailyLogs.length === 0 ? (
                    <div className="text-white/30 text-sm italic py-8 text-center border border-white/5 rounded-xl border-dashed">No topics to revise yet.</div>
                 ) : (
                   dailyLogs.slice(0, 3).map((log, i) => (
                     <div key={i} className="p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                       <div>
                         <p className="font-bold text-sm text-white truncate">{log.topic}</p>
                         <p className="text-[10px] mt-1 text-white/40 uppercase tracking-wider">Last: {new Date(log.date).toLocaleDateString()}</p>
                       </div>
                       <button className="w-full py-2 rounded-lg text-xs font-bold transition-colors bg-white/5 hover:bg-white/10 text-[#84adff]" style={{ fontFamily: 'Inter, sans-serif' }}>
                         Mark Revised
                       </button>
                     </div>
                   ))
                 )}
               </div>
            </motion.div>
          
          </div>

        </div>
      </main>
    </div>
  );
}
