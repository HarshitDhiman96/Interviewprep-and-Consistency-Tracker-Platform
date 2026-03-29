import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Activity Calendar Heatmap
 * Renders a 52-week × 7-day GitHub-style contribution grid
 * derived from the user's daily logs.
 */
export default function ActivityHeatmap({ dailyLogs = [] }) {
  const WEEKS = 26; // 6 months of view

  // Build a map: "YYYY-MM-DD" → count
  const activityMap = useMemo(() => {
    const map = {};
    dailyLogs.forEach(log => {
      const d = new Date(log.createdAt || log.date);
      if (isNaN(d)) return;
      const key = d.toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [dailyLogs]);

  // Build grid: last WEEKS weeks, Sunday-first
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the most recent Sunday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay()); // roll back to Sunday
  startDate.setDate(startDate.getDate() - (WEEKS - 1) * 7); // go back WEEKS-1 more weeks

  const weeks = [];
  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      const key = date.toISOString().slice(0, 10);
      const count = activityMap[key] || 0;
      const isFuture = date > today;
      week.push({ date, key, count, isFuture });
    }
    weeks.push(week);
  }

  // Month label positions
  const monthLabels = [];
  weeks.forEach((week, wi) => {
    const firstInWeek = week[0].date;
    if (firstInWeek.getDate() <= 7) {
      monthLabels.push({
        label: firstInWeek.toLocaleString('default', { month: 'short' }),
        col: wi,
      });
    }
  });

  const getColor = (count, isFuture) => {
    if (isFuture) return '';
    if (count === 0) return 'bg-zinc-100 dark:bg-zinc-800/60';
    if (count === 1) return 'bg-blue-200 dark:bg-blue-900/60';
    if (count === 2) return 'bg-blue-400 dark:bg-blue-700';
    if (count === 3) return 'bg-blue-500 dark:bg-blue-500';
    return 'bg-blue-700 dark:bg-blue-400';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalActiveDays = Object.keys(activityMap).length;
  const totalLogs = dailyLogs.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 md:p-8 rounded-[32px] transition-colors duration-300"
      style={{ background: 'var(--surface-container)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-xl font-black text-zinc-900 dark:text-white"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Activity Heatmap
          </h3>
          <p className="text-xs mt-0.5 text-zinc-500 dark:text-zinc-400">
            {totalActiveDays} active days &nbsp;·&nbsp; {totalLogs} total logs
          </p>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">Less</span>
          {['bg-zinc-100 dark:bg-zinc-800/60', 'bg-blue-200 dark:bg-blue-900/60', 'bg-blue-400 dark:bg-blue-700', 'bg-blue-500 dark:bg-blue-500', 'bg-blue-700 dark:bg-blue-400'].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {weeks.map((week, wi) => {
              const label = monthLabels.find(m => m.col === wi);
              return (
                <div key={wi} className="flex-shrink-0" style={{ width: 16, marginRight: 3 }}>
                  {label ? (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                      {label.label}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Grid: day labels + cells */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 mt-0.5">
              {dayLabels.map((d, i) => (
                <div key={d} className="h-[14px] flex items-center">
                  {i % 2 === 1 ? (
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-600 w-6 text-right pr-0.5 leading-none">
                      {d.slice(0, 3)}
                    </span>
                  ) : (
                    <span className="w-6" />
                  )}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map(({ date, key, count, isFuture }) => (
                    <div
                      key={key}
                      title={
                        isFuture
                          ? ''
                          : count === 0
                          ? `${key} — No activity`
                          : `${key} — ${count} log${count > 1 ? 's' : ''}`
                      }
                      className={`w-[14px] h-[14px] rounded-sm transition-all duration-150 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 cursor-default ${
                        isFuture
                          ? 'bg-transparent'
                          : getColor(count, isFuture)
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
