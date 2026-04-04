import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import SpotlightButton from '../components/SpotlightButton';
import { fetchSkills } from '../services/skillsService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, rememberMePreference } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: rememberMePreference });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      if (data?.success) {
        const skillsData = await fetchSkills().catch(() => ({ skills: [] }));
        const hasSkills = Array.isArray(skillsData?.skills) && skillsData.skills.length > 0;
        setTimeout(() => navigate(hasSkills ? '/dashboard' : '/onboarding'), 300);
      } else {
        setError(data?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 relative z-10 bg-zinc-50 dark:bg-[#0e0e0e] transition-colors duration-300">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm transition-colors z-[9999] cursor-pointer bg-transparent border-none text-zinc-500 hover:text-zinc-900 dark:text-white/50 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to Home
      </button>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 text-zinc-950 dark:text-[var(--on-surface)]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-600 dark:text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Log in to continue your journey.
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-500 dark:text-[rgba(255,255,255,0.3)]">Username or Email</label>
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2 bg-transparent border-b outline-none transition-all duration-300 border-zinc-300 text-zinc-950 focus:border-blue-500 dark:border-white/10 dark:text-[var(--on-surface)] dark:focus:border-blue-500"
              style={{
                fontFamily: 'Inter, sans-serif',
              }}
              placeholder="johndoe or you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-500 dark:text-[rgba(255,255,255,0.3)]">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 bg-transparent border-b outline-none transition-all duration-300 border-zinc-300 text-zinc-950 focus:border-blue-500 dark:border-white/10 dark:text-[var(--on-surface)] dark:focus:border-blue-500"
              style={{
                fontFamily: 'Inter, sans-serif',
              }}
              placeholder="••••••••"
            />
          </div>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:text-white/70">
            <span>
              Keep me signed in for 7 days
            </span>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={(event) => setFormData((prev) => ({ ...prev, rememberMe: event.target.checked }))}
              className="h-4 w-4 accent-blue-500"
            />
          </label>

          <SpotlightButton
            type="submit"
            disabled={loading}
            className="w-full mt-4 text-base"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={16} />
                Access APEX
              </>
            )}
          </SpotlightButton>
        </form>

        <p className="text-center text-sm mt-8 text-zinc-600 dark:text-[rgba(255,255,255,0.4)]">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign up
          </button>
        </p>
      </motion.div>
    </section>
  );
}
