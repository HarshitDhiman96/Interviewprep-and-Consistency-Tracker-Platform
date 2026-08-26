import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import SpotlightButton from '../components/SpotlightButton';
import InteractiveMascot from '../components/InteractiveMascot';
import { registerUser } from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (data?.success) {
        setStatus('success');
        setTimeout(() => navigate('/login'), 800);
      } else {
        setError(data?.message || 'Registration failed');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 1500);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
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
              Join the APEX
            </h1>
            <p className="text-sm text-zinc-600 dark:text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Start building your streak today.
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-500 dark:text-[rgba(255,255,255,0.3)]">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full py-2.5 bg-transparent border-b outline-none transition-all duration-300 border-zinc-300 text-zinc-950 focus:border-blue-500 dark:border-white/10 dark:text-[var(--on-surface)] dark:focus:border-blue-500"
                style={{
                  fontFamily: 'Inter, sans-serif',
                }}
                placeholder="Your Name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-500 dark:text-[rgba(255,255,255,0.3)]">Email</label>
              <input
                type="email"
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
                placeholder="you@example.com"
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

            <SpotlightButton
              type="submit"
              disabled={loading}
              className="w-full mt-4 text-base"
            >
              {loading ? 'Processing...' : (
                <>
                  <Activity size={16} />
                  Create Account
                </>
              )}
            </SpotlightButton>
          </form>

          <p className="text-center text-sm mt-8 text-zinc-600 dark:text-[rgba(255,255,255,0.4)]">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer bg-transparent border-none">
              Log in
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
              "Every master was once a beginner who refused to quit." Create an account and start tracking your path to success today.
            </p>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
