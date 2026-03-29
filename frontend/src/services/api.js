import axios from 'axios';

// Axios instance — auto-injects Bearer token from localStorage
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const changePassword = (email, oldpassword, newpassword) =>
  api.post('/api/auth/changepassword', { email, oldpassword, newpassword });

// ── Streak ────────────────────────────────────────────────
export const fetchStreak = () => api.get('/api/streak/fetch');

// ── Analytics ─────────────────────────────────────────────
export const fetchConsistency  = () => api.get('/api/analytics/consistency');
export const fetchWeakAreas    = () => api.get('/api/analytics/weakarea');
export const fetchSkillProgress = () => api.get('/api/analytics/progressskill');
export const fetchWeeklyVelocity = () => api.get('/api/analytics/progressweekly');

// ── Logs ──────────────────────────────────────────────────
export const fetchAllLogs = () => api.get('/api/log/all');
export const addLog = (payload) => api.post('/api/log/add', payload);

// ── Revisions ─────────────────────────────────────────────
export const fetchRevisions = () => api.get('/api/revision/fetch');
export const addRevision    = (skill, topic) => api.post('/api/revision/add', { skill, topic });

// ── Heatmap ───────────────────────────────────────────────
export const fetchHeatmap = (route) =>
  api.get('/api/analytics/heatmap', { params: { route } });
export const saveHeatmapClicks = (clicks) =>
  api.post('/api/analytics/click', { clicks });

export default api;
