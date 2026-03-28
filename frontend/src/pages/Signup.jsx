import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import SpotlightButton from '../components/SpotlightButton';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => navigate('/login'), 300);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-12 px-6 relative z-10" style={{ background: 'var(--surface)' }}>
      <motion.button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md p-8 md:p-10 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px) saturate(120%)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: '#fff' }}>
            Join the APEX
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
            Start building your streak today.
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full py-2 bg-transparent border-b outline-none transition-all duration-300 focus:border-blue-500"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              }}
              placeholder="Your Name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2 bg-transparent border-b outline-none transition-all duration-300 focus:border-blue-500"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 bg-transparent border-b outline-none transition-all duration-300 focus:border-blue-500"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
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

        <p className="text-center text-sm mt-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 transition-colors">
            Log in
          </button>
        </p>
      </motion.div>
    </section>
  );
}
