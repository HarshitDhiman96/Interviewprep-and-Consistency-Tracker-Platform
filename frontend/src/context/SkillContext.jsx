import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchConsistency, fetchSkillProgress, fetchWeakAreas, fetchWeeklyProgress } from '../services/analyticsService';
import { addLog, fetchAllLogs, fetchDailyLog, fetchWeekLog, filterLogsBySkill } from '../services/logService';
import { addRevision, deleteRevision, fetchRevisions } from '../services/revisionService';
import { addSkill, deleteSkill, fetchSkills } from '../services/skillsService';
import { fetchStreak } from '../services/streakService';

const SkillContext = createContext();

const getCurrentWeekRange = () => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

const isEmptyStateError = (error) => error?.status === 400 || error?.status === 404;

export function SkillProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [streak, setStreak] = useState(0);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [activeSkillFilter, setActiveSkillFilter] = useState('');
  const [consistencyStats, setConsistencyStats] = useState({
    consistency: 0,
    activeDays: 0,
    totalDays: 0,
  });
  const [weakAreas, setWeakAreas] = useState([]);
  const [weeklyVelocity, setWeeklyVelocity] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [skillProgress, setSkillProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [pageToast, setPageToast] = useState(null);

  const selectedSkills = useMemo(() => skills.map((skill) => skill.name), [skills]);
  const totalHours = useMemo(
    () => skillProgress.reduce((sum, item) => sum + (item.totalTime || 0), 0),
    [skillProgress],
  );

  const resetDashboardState = useCallback(() => {
    setSkills([]);
    setStreak(0);
    setDailyLogs([]);
    setTodayLogs([]);
    setWeeklyLogs([]);
    setFilteredLogs([]);
    setActiveSkillFilter('');
    setConsistencyStats({ consistency: 0, activeDays: 0, totalDays: 0 });
    setWeakAreas([]);
    setWeeklyVelocity([]);
    setRevisions([]);
    setSkillProgress([]);
    setError('');
    setActionError('');
    setCelebration(null);
    setPageToast(null);
  }, []);

  const refreshDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      resetDashboardState();
      return;
    }

    setLoading(true);
    setError('');

    const today = new Date().toISOString();
    const weekRange = getCurrentWeekRange();

    const [
      skillsResult,
      streakResult,
      consistencyResult,
      progressResult,
      logsResult,
      velocityResult,
      weakAreasResult,
      revisionsResult,
      todayResult,
      weekResult,
    ] = await Promise.allSettled([
      fetchSkills(),
      fetchStreak(),
      fetchConsistency(),
      fetchSkillProgress(),
      fetchAllLogs(),
      fetchWeeklyProgress(),
      fetchWeakAreas(),
      fetchRevisions(),
      fetchDailyLog(today),
      fetchWeekLog(weekRange),
    ]);

    if (skillsResult.status === 'fulfilled') {
      const nextSkills = skillsResult.value.skills || [];
      setSkills(nextSkills);
      setActiveSkillFilter((current) => {
        if (current && nextSkills.some((skill) => skill.name === current)) {
          return current;
        }

        return nextSkills[0]?.name || '';
      });
    } else if (!isEmptyStateError(skillsResult.reason)) {
      setError(skillsResult.reason.message);
    }

    if (streakResult.status === 'fulfilled') {
      setStreak(streakResult.value.currentStreak ?? 0);
    }

    if (consistencyResult.status === 'fulfilled') {
      setConsistencyStats({
        consistency: consistencyResult.value.consistency ?? 0,
        activeDays: consistencyResult.value.activeDays ?? 0,
        totalDays: consistencyResult.value.totalDays ?? 0,
      });
    }

    if (progressResult.status === 'fulfilled') {
      setSkillProgress(progressResult.value.data || []);
    } else if (!isEmptyStateError(progressResult.reason)) {
      setError(progressResult.reason.message);
    }

    if (logsResult.status === 'fulfilled') {
      setDailyLogs(logsResult.value.data || []);
    } else if (!isEmptyStateError(logsResult.reason)) {
      setError(logsResult.reason.message);
    }

    if (velocityResult.status === 'fulfilled') {
      setWeeklyVelocity(velocityResult.value.data || []);
    } else if (!isEmptyStateError(velocityResult.reason)) {
      setError(velocityResult.reason.message);
    }

    if (weakAreasResult.status === 'fulfilled') {
      setWeakAreas(weakAreasResult.value.weakAreas || []);
    } else if (!isEmptyStateError(weakAreasResult.reason)) {
      setError(weakAreasResult.reason.message);
    }

    if (revisionsResult.status === 'fulfilled') {
      setRevisions(revisionsResult.value.data || []);
    } else if (!isEmptyStateError(revisionsResult.reason)) {
      setError(revisionsResult.reason.message);
    }

    if (todayResult.status === 'fulfilled') {
      setTodayLogs(todayResult.value.data || []);
    } else if (isEmptyStateError(todayResult.reason)) {
      setTodayLogs([]);
    } else {
      setError(todayResult.reason.message);
    }

    if (weekResult.status === 'fulfilled') {
      setWeeklyLogs(weekResult.value.data || []);
    } else if (isEmptyStateError(weekResult.reason)) {
      setWeeklyLogs([]);
    } else {
      setError(weekResult.reason.message);
    }

    setLoading(false);
  }, [resetDashboardState]);

  const refreshFilteredLogs = useCallback(async (skillName) => {
    const token = localStorage.getItem('token');

    if (!token || !skillName) {
      setFilteredLogs([]);
      return;
    }

    try {
      const data = await filterLogsBySkill(skillName);
      setFilteredLogs(data.data || []);
    } catch (serviceError) {
      if (isEmptyStateError(serviceError)) {
        setFilteredLogs([]);
        return;
      }

      setActionError(serviceError.message);
      setPageToast({ type: 'error', message: serviceError.message });
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  useEffect(() => {
    refreshFilteredLogs(activeSkillFilter);
  }, [activeSkillFilter, refreshFilteredLogs]);

  const createSkill = async (skillName) => {
    try {
      setActionError('');
      const data = await addSkill(skillName.trim());

      if (data.success) {
        await refreshDashboard();
      }

      return data;
    } catch (serviceError) {
      setActionError(serviceError.message);
      setPageToast({ type: 'error', message: serviceError.message });
      throw serviceError;
    }
  };

  const removeSkill = async (skillId) => {
    try {
      setActionError('');
      const data = await deleteSkill(skillId);

      if (data.success) {
        await refreshDashboard();
      }

      return data;
    } catch (serviceError) {
      setActionError(serviceError.message);
      setPageToast({ type: 'error', message: serviceError.message });
      throw serviceError;
    }
  };

  const addDailyLog = async (log) => {
    try {
      setActionError('');

      const payload = {
        skill: log.skill,
        status: log.status?.toLowerCase(),
        topic: log.topic,
        difficulty: log.difficulty?.toLowerCase() || 'medium',
        timespent: Number(log.timeSpent),
      };

      const data = await addLog(payload);

      if (data.success && data.data) {
        const newLog = data.data;

        setDailyLogs((prev) => [newLog, ...prev]);
        setTodayLogs((prev) => [newLog, ...prev]);
        setWeeklyLogs((prev) => [newLog, ...prev]);
        setFilteredLogs((prev) =>
          activeSkillFilter && activeSkillFilter === newLog.skill ? [newLog, ...prev] : prev,
        );

        refreshDashboard();
      }

      return data;
    } catch (serviceError) {
      setActionError(serviceError.message);
      setPageToast({ type: 'error', message: serviceError.message });
      throw serviceError;
    }
  };

  const markRevised = async (revisionId, topic) => {
    try {
      setActionError('');
      const data = await deleteRevision(revisionId);

      if (data.success) {
        setRevisions((prev) => prev.filter((item) => item._id !== revisionId));
        setCelebration({
          title: 'Yahhh, one more topic unlocked',
          message: `${topic} moved out of your revision queue.`,
        });
        setPageToast({
          type: 'success',
          message: `${topic} marked as revised.`,
        });
      }

      return data;
    } catch (serviceError) {
      setActionError(serviceError.message);
      setPageToast({ type: 'error', message: serviceError.message });
      throw serviceError;
    }
  };

  const value = {
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
    consistency: consistencyStats.consistency,
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
    refreshDashboard,
    createSkill,
    removeSkill,
    isHeatmapVisible,
    setIsHeatmapVisible,
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
}

export function useSkillContext() {
  return useContext(SkillContext);
}
