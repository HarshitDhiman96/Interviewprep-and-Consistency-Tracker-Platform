import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, User, ArrowLeft, Lock } from 'lucide-react';
import { changePassword as apiChangePassword } from '../services/authService';

// ── Encrypt-scramble button ───────────────────────────────
const CHARS = '!@#$%^&*():{};|,.<>/?';
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

function EncryptButton({ targetText, disabled, loading }) {
  const intervalRef = useRef(null);
  const [text, setText] = useState(targetText);

  const scramble = () => {
    if (disabled) return;
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = targetText
        .split('')
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      setText(scrambled);
      pos++;
      if (pos >= targetText.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current);
    setText(targetText);
  };

  // sync text if loading changes
  useEffect(() => { setText(loading ? 'Updating...' : targetText); }, [loading, targetText]);

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.025 }}
      whileTap={{ scale: disabled ? 1 : 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className={`group relative overflow-hidden w-full py-3.5 rounded-xl font-mono font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 transition-all duration-300 border
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-zinc-100 border-zinc-300 text-zinc-800 hover:text-blue-700
        dark:bg-neutral-800 dark:border-neutral-500 dark:text-neutral-300 dark:hover:text-indigo-300`}
    >
      {/* Shimmer layer */}
      <motion.span
        initial={{ y: '100%' }}
        animate={{ y: '-100%' }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1, ease: 'linear' }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-blue-400/0 from-40% via-blue-400/20 to-blue-400/0 to-60% opacity-0 transition-opacity duration-300 group-hover:opacity-100
          dark:from-indigo-400/0 dark:via-indigo-400/30 dark:to-indigo-400/0"
      />
      <div className="relative z-10 flex items-center gap-2">
        <Lock size={15} />
        <span>{text}</span>
      </div>
    </motion.button>
  );
}

function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Change password form state
  const [formData, setFormData] = useState({ email: '', oldpassword: '', newpassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: '' }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const decoded = decodeToken(token);
    if (!decoded) {
      navigate('/login');
      return;
    }
    setUserData(decoded);
    setFormData((prev) => ({ ...prev, email: decoded.useremail || '' }));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!formData.oldpassword || !formData.newpassword) return;
    setLoading(true);
    setFeedback(null);

    try {
      const data = await apiChangePassword({
        email: formData.email,
        oldpassword: formData.oldpassword,
        newpassword: formData.newpassword,
      });
      if (data?.success) {
        setFeedback({ type: 'success', message: 'Password changed successfully! Logging you out...' });
        setFormData((prev) => ({ ...prev, oldpassword: '', newpassword: '' }));
        setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/login');
        }, 2500);
      } else {
        setFeedback({ type: 'error', message: data?.message || 'Something went wrong.' });
      }
    } catch (err) {
      const msg = err.message || 'Network error. Please try again.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0e0e0e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400 dark:text-white/30" style={{ fontFamily: 'Inter, sans-serif' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-28 pb-16 px-6 bg-zinc-50 dark:bg-[#0e0e0e] transition-colors duration-300"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm mb-8 transition-colors text-zinc-500 hover:text-zinc-900 dark:text-white/40 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto space-y-8">

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 flex items-center gap-6 bg-white border border-zinc-200 shadow-lg shadow-zinc-100 dark:bg-white/5 dark:border-white/8 dark:shadow-none"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-500/20 flex-shrink-0">
            <User size={36} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h1
              className="text-3xl font-black leading-tight text-zinc-950 dark:text-white"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em' }}
            >
              {userData.username || 'APEX User'}
            </h1>
            <p className="text-sm mt-1 text-zinc-500 dark:text-white/40">{userData.useremail}</p>
            <span className="inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              {userData.role || 'Member'}
            </span>
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl p-8 bg-white border border-zinc-200 shadow-lg shadow-zinc-100/50 dark:bg-white/5 dark:border-white/8 dark:shadow-none"
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 border border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20">
              <Lock size={18} className="text-orange-500" />
            </div>
            <div>
              <h2
                className="text-xl font-black text-zinc-950 dark:text-white"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Change Password
              </h2>
              <p className="text-xs mt-0.5 text-zinc-500 dark:text-white/40">
                Update your account password securely
              </p>
            </div>
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium overflow-hidden ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                    : 'bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Email field (pre-filled, readonly hint) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">
                Account Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-xl text-sm bg-zinc-50 border border-zinc-200 text-zinc-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-blue-500"
              />
            </div>

            {/* Old password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  name="oldpassword"
                  value={formData.oldpassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your current password"
                  className="w-full py-3 px-4 pr-11 rounded-xl text-sm bg-zinc-50 border border-zinc-200 text-zinc-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-white/30 dark:hover:text-white/70 transition-colors"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newpassword"
                  value={formData.newpassword}
                  onChange={handleChange}
                  required
                  placeholder="Choose a strong new password"
                  className="w-full py-3 px-4 pr-11 rounded-xl text-sm bg-zinc-50 border border-zinc-200 text-zinc-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-white/30 dark:hover:text-white/70 transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength hint */}
              {formData.newpassword.length > 0 && (
                <p className={`text-xs mt-1 ${formData.newpassword.length >= 8 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {formData.newpassword.length >= 8
                    ? '✓ Password length looks good'
                    : `Use at least 8 characters (${8 - formData.newpassword.length} more needed)`}
                </p>
              )}
            </div>

            <EncryptButton
              targetText="Update Password"
              disabled={loading || formData.newpassword.length < 8}
              loading={loading}
            />
          </form>
        </motion.div>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs text-zinc-400 dark:text-white/20"
        >
          <KeyRound className="inline-block mr-1" size={12} />
          After changing your password, you will be automatically logged out for security.
        </motion.p>
      </div>
    </div>
  );
}
