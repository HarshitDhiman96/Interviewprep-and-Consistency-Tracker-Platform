import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import SpotlightButton from '../components/SpotlightButton';
import InteractiveMascot from '../components/InteractiveMascot';
import { fetchSkills } from '../services/skillsService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, rememberMePreference } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: rememberMePreference });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mascot state controllers
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('loading');

    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      if (data?.success) {
        setStatus('success');
        
        const destination = (() => {
          if (data?.needsInconsistencyReason) return '/dashboard';
          if (!data?.user?.goalCompleted && !data?.user?.primaryGoal) return '/dashboard';
          return null;
        })();

        if (destination) {
          setTimeout(() => navigate(destination), 800);
          return;
        }

        const skillsData = await fetchSkills().catch(() => ({ skills: [] }));
        const hasSkills = Array.isArray(skillsData?.skills) && skillsData.skills.length > 0;
        setTimeout(() => navigate(hasSkills ? '/dashboard' : '/onboarding'), 800);
      } else {
        setError(data?.message || 'Login failed');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 1500);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="auth-page-shell min-h-screen grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-colors duration-300">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm transition-colors z-[9999] cursor-pointer bg-white/80 dark:bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:text-white/50 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      {/* Left side: Content & Form */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 py-24 sm:px-6 lg:px-16 relative w-full">
        
        {/* Mobile Mascot: displayed above form on mobile screens */}
        <div className="lg:hidden w-full max-w-[280px] mx-auto mb-2">
          <InteractiveMascot
            isEmailFocused={isEmailFocused}
            isPasswordFocused={isPasswordFocused}
            status={status}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md p-6 sm:p-8 md:p-10 rounded-3xl bg-white border border-zinc-200 dark:bg-[#131313] dark:border-white/10 transition-colors duration-300 hover:border-zinc-300 dark:hover:border-white/20 shadow-xl shadow-zinc-200/40 dark:shadow-none"
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
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
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full py-2.5 bg-transparent border-b outline-none transition-all duration-300 border-zinc-300 text-zinc-950 focus:border-blue-500 dark:border-white/10 dark:text-[var(--on-surface)] dark:focus:border-blue-500"
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
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full py-2.5 bg-transparent border-b outline-none transition-all duration-300 border-zinc-300 text-zinc-950 focus:border-blue-500 dark:border-white/10 dark:text-[var(--on-surface)] dark:focus:border-blue-500"
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
            <button onClick={() => navigate('/signup')} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer bg-transparent border-none">
              Sign up
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right side: Interactive Animation Showcase (Desktop only) */}
      <div className="lg:col-span-5 hidden lg:flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-[#111111] dark:to-[#0c0c0c] border-l border-zinc-200 dark:border-white/10 p-8">
        
        {/* Glow backdrop ring */}
        <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="w-full max-w-md text-center z-10 flex flex-col items-center">
          <InteractiveMascot
            isEmailFocused={isEmailFocused}
            isPasswordFocused={isPasswordFocused}
            status={status}
          />

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6"
          >
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Your Consistency Companion
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-2 mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              "Show up, do the work, and watch your skills skyrocket." Complete your logging today to keep your daily streak alive.
            </p>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
