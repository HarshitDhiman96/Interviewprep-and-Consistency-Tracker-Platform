import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchStreak,
  fetchConsistency,
  fetchWeakAreas,
  fetchSkillProgress,
  fetchWeeklyVelocity,
  fetchAllLogs,
  addLog as apiAddLog,
  fetchRevisions,
  addRevision as apiAddRevision,
} from '../services/api';

const SkillContext = createContext();

export function SkillProvider({ children }) {
  const [selectedSkills, setSelectedSkills] = useState(['DSA']);

  // Dashboard stats
  const [streak, setStreak]             = useState(0);
  const [totalHours, setTotalHours]     = useState(0);
  const [dailyLogs, setDailyLogs]       = useState([]);
  const [consistency, setConsistency]   = useState(0);
  const [weakAreas, setWeakAreas]       = useState([]);
  const [weeklyVelocity, setWeeklyVelocity] = useState([]);
  const [revisions, setRevisions]       = useState([]);
  const [loading, setLoading]           = useState(false);

  // Heatmap UI state
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);

  // ── Fetch all dashboard data ─────────────────────────────
  const refreshDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const [
        streakRes,
        consistencyRes,
        skillRes,
        logsRes,
        velocityRes,
        weakRes,
        revisionsRes,
      ] = await Promise.allSettled([
        fetchStreak(),
        fetchConsistency(),
        fetchSkillProgress(),
        fetchAllLogs(),
        fetchWeeklyVelocity(),
        fetchWeakAreas(),
        fetchRevisions(),
      ]);

      if (streakRes.status === 'fulfilled') {
        setStreak(streakRes.value.data?.currentStreak ?? 0);
      }
      if (consistencyRes.status === 'fulfilled') {
        setConsistency(consistencyRes.value.data?.consistency ?? 0);
      }
      if (skillRes.status === 'fulfilled' && skillRes.value.data?.data) {
        const total = skillRes.value.data.data.reduce(
          (acc, curr) => acc + (curr.totalTime || 0), 0
        );
        setTotalHours(total);
      }
      if (logsRes.status === 'fulfilled' && logsRes.value.data?.success) {
        setDailyLogs(logsRes.value.data.data);
      }
      if (velocityRes.status === 'fulfilled' && velocityRes.value.data?.success) {
        setWeeklyVelocity(velocityRes.value.data.data);
      }
      if (weakRes.status === 'fulfilled' && weakRes.value.data?.success) {
        setWeakAreas(weakRes.value.data.weakAreas);
      }
      if (revisionsRes.status === 'fulfilled' && revisionsRes.value.data?.success) {
        setRevisions(revisionsRes.value.data.data);
      }
    } catch (err) {
      console.error('Dashboard refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // ── Add a daily log (POST + refresh stats) ───────────────
  const addDailyLog = async (log) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // offline fallback
      setDailyLogs(prev => [log, ...prev]);
      setTotalHours(prev => prev + Number(log.timeSpent));
      return;
    }

    try {
      const payload = {
        skill: log.skill,
        status: log.status?.toLowerCase(), // backend expects lowercase: "solved"/"stuck"
        topic: log.topic,
        difficulty: log.difficulty || 'Medium',
        timespent: Number(log.timeSpent),
      };
      const res = await apiAddLog(payload);
      if (res.data?.success && res.data?.data) {
        setDailyLogs(prev => [res.data.data, ...prev]);
        setTotalHours(prev => prev + Number(log.timeSpent));
        // refresh streak + consistency after adding log
        await refreshDashboard();
      }
    } catch (err) {
      console.error('Failed to add log:', err);
    }
  };

  // ── Mark a topic as revised ──────────────────────────────
  const markRevised = async (skill, topic) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await apiAddRevision(skill, topic);
      if (res.data?.success) {
        // Update revisions optimistically
        setRevisions(prev => {
          const existing = prev.find(r => r.skill === skill && r.topic === topic);
          if (existing) {
            return prev.map(r =>
              r.skill === skill && r.topic === topic
                ? { ...r, revisionCount: (r.revisionCount || 1) + 1 }
                : r
            );
          }
          return [res.data.revision, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to mark revision:', err);
    }
  };

  const value = {
    selectedSkills,
    setSelectedSkills,
    streak,
    totalHours,
    dailyLogs,
    consistency,
    weakAreas,
    weeklyVelocity,
    revisions,
    loading,
    addDailyLog,
    markRevised,
    refreshDashboard,
    isHeatmapVisible,
    setIsHeatmapVisible,
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
}

export function useSkillContext() {
  return useContext(SkillContext);
}
