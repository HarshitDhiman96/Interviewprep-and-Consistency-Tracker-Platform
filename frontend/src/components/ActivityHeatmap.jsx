import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const WEEKS = 26;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HEATMAP_COLORS = [
  'bg-zinc-100 dark:bg-zinc-800/60',
  'bg-blue-200 dark:bg-blue-900/60',
  'bg-blue-400 dark:bg-blue-700',
  'bg-blue-500 dark:bg-blue-500',
  'bg-blue-700 dark:bg-blue-400',
];

const getLocalDateKey = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatWord = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown';

export default function ActivityHeatmap({ dailyLogs = [] }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  const activityMap = useMemo(() => {
    const map = {};

    dailyLogs.forEach((log) => {
      const key = getLocalDateKey(log.createdAt || log.date);

      if (!key) {
        return;
      }

      if (!map[key]) {
        map[key] = {
          count: 0,
          totalTime: 0,
          logs: [],
        };
      }

      map[key].count += 1;
      map[key].totalTime += Number(log.timespent || log.timeSpent || 0);
      map[key].logs.push(log);
    });

    return map;
  }, [dailyLogs]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());
  startDate.setDate(startDate.getDate() - (WEEKS - 1) * 7);

  const weeks = [];
  for (let weekIndex = 0; weekIndex < WEEKS; weekIndex += 1) {
    const week = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);

      const key = getLocalDateKey(cellDate);
      const activity = key && activityMap[key] ? activityMap[key] : { count: 0, totalTime: 0, logs: [] };
      const isFuture = cellDate > today;

      week.push({
        date: cellDate,
        key,
        activity,
        isFuture,
      });
    }

    weeks.push(week);
  }

  const monthLabels = weeks.map((week, index) => {
    const firstInWeek = week[0].date;

    if (firstInWeek.getDate() <= 7) {
      return {
        col: index,
        label: firstInWeek.toLocaleString('default', { month: 'short' }),
      };
    }

    return null;
  });

  const totalActiveDays = Object.keys(activityMap).length;
  const totalLogs = dailyLogs.length;
  const todayKey = getLocalDateKey(today);
  const activeKey = hoveredKey || (todayKey && activityMap[todayKey] ? todayKey : null);
  const highlightedDay = activeKey
    ? {
        key: activeKey,
        activity: activityMap[activeKey] || { count: 0, totalTime: 0, logs: [] },
        date: new Date(`${activeKey}T00:00:00`),
      }
    : null;

  const getColor = (count, isFuture) => {
    if (isFuture) {
      return '';
    }

    if (count <= 0) {
      return HEATMAP_COLORS[0];
    }

    if (count === 1) {
      return HEATMAP_COLORS[1];
    }

    if (count === 2) {
      return HEATMAP_COLORS[2];
    }

    if (count === 3) {
      return HEATMAP_COLORS[3];
    }

    return HEATMAP_COLORS[4];
  };

  const handleHover = (key, isFuture) => {
    if (isFuture || !key) {
      return;
    }

    setHoveredKey((current) => (current === key ? current : key));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 md:p-8 rounded-[32px] transition-colors duration-300 overflow-hidden"
      style={{ background: 'var(--surface-container)' }}
    >
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-8">
        <div>
          <h3
            className="text-xl font-black text-zinc-900 dark:text-white"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Activity Heatmap
          </h3>
          <p className="text-xs mt-0.5 text-zinc-500 dark:text-zinc-400">
            {totalActiveDays} active days · {totalLogs} total logs
          </p>
        </div>

        <div className="xl:w-[360px] min-h-[228px] rounded-3xl p-4 bg-zinc-100/90 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Hover Details
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">Less</span>
              {HEATMAP_COLORS.map((color) => (
                <div key={color} className={`w-3 h-3 rounded-sm ${color}`} />
              ))}
              <span className="text-xs text-zinc-400 dark:text-zinc-500">More</span>
            </div>
          </div>

          {highlightedDay ? (
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {highlightedDay.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {highlightedDay.activity.count} log{highlightedDay.activity.count > 1 ? 's' : ''} · {highlightedDay.activity.totalTime}h invested
                </p>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {highlightedDay.activity.logs.map((log) => (
                  <div
                    key={log._id || `${log.topic}-${log.createdAt || log.date}`}
                    className="rounded-2xl px-3 py-2 bg-white/70 dark:bg-white/5"
                  >
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {log.topic}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {log.skill} · {formatWord(log.status)} · {formatWord(log.difficulty)} · {log.timespent || log.timeSpent}h
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Hover a day to inspect the logs submitted on that date.
            </p>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 mb-3">
          <div />
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
          >
            {weeks.map((_, weekIndex) => {
              const label = monthLabels.find((item) => item?.col === weekIndex);

              return (
                <div key={`label-${weekIndex}`} className="min-w-0">
                  {label ? (
                    <span className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                      {label.label}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 items-stretch">
          <div className="grid grid-rows-7 gap-2">
            {DAY_LABELS.map((day, index) => (
              <div key={day} className="flex items-center h-full">
                {index % 2 === 1 ? (
                  <span className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 leading-none">
                    {day}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
          >
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-2">
                {week.map(({ key, activity, isFuture }) => (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => handleHover(key, isFuture)}
                    onFocus={() => handleHover(key, isFuture)}
                    className={`w-full aspect-square rounded-[0.7rem] transition-colors duration-150 border ${
                      isFuture
                        ? 'bg-transparent border-transparent cursor-default'
                        : `${getColor(activity.count, isFuture)} border-white/40 dark:border-white/5 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-400`
                    }`}
                    title={
                      isFuture
                        ? ''
                        : activity.count === 0
                          ? `${key} - No activity`
                          : `${key} - ${activity.count} log${activity.count > 1 ? 's' : ''}`
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
