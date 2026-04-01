import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';

const suggestedSkills = ['DSA', 'Web Development', 'AI/ML', 'System Design', 'Core CS'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { selectedSkills, createSkill, loading, actionError } = useSkillContext();
  const [pendingSkills, setPendingSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [localError, setLocalError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPendingSkills(selectedSkills);
  }, [selectedSkills]);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      navigate('/dashboard');
    }
  }, [navigate, selectedSkills]);

  const normalizedPendingSkills = useMemo(
    () => new Set(pendingSkills.map((skill) => skill.trim().toLowerCase())),
    [pendingSkills],
  );

  const toggleSkill = (skillName) => {
    setLocalError('');
    const normalized = skillName.trim().toLowerCase();

    setPendingSkills((current) => {
      if (current.some((skill) => skill.trim().toLowerCase() === normalized)) {
        return current.filter((skill) => skill.trim().toLowerCase() !== normalized);
      }

      return [...current, skillName.trim()];
    });
  };

  const handleAddCustomSkill = (event) => {
    event.preventDefault();
    setLocalError('');

    const trimmedSkill = customSkill.trim();

    if (!trimmedSkill) {
      setLocalError('Type a custom skill first.');
      return;
    }

    if (normalizedPendingSkills.has(trimmedSkill.toLowerCase())) {
      setLocalError('That skill is already selected.');
      return;
    }

    setPendingSkills((current) => [...current, trimmedSkill]);
    setCustomSkill('');
  };

  const handleLaunch = async () => {
    setLocalError('');

    if (pendingSkills.length === 0) {
      setLocalError('Select at least one skill before continuing.');
      return;
    }

    setSaving(true);

    try {
      const normalizedExisting = new Set(selectedSkills.map((skill) => skill.trim().toLowerCase()));

      for (const skill of pendingSkills) {
        if (!normalizedExisting.has(skill.trim().toLowerCase())) {
          // eslint-disable-next-line no-await-in-loop
          await createSkill(skill);
        }
      }

      navigate('/dashboard');
    } catch (serviceError) {
      setLocalError(serviceError.message || 'Failed to save your selected skills.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 relative z-10 flex flex-col items-center justify-center" style={{ backgroundColor: 'transparent' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass p-10 md:p-14 rounded-[32px] w-full max-w-5xl text-center relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          border: 'none',
        }}
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}>
          Define Your Path
        </h2>
        <p className="text-gray-400 mb-10 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
          Pick the skills you want to track first, review them clearly, then save once when you are ready.
          <span className="block mt-1" style={{ color: '#84adff' }}>Your selected skills stay highlighted so you can easily see what is chosen.</span>
        </p>

        {(actionError || localError) && (
          <div className="mb-6 rounded-2xl px-4 py-3 text-sm border border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
            {localError || actionError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {suggestedSkills.map((skill) => {
            const isSelected = normalizedPendingSkills.has(skill.toLowerCase());

            return (
              <motion.button
                key={skill}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSkill(skill)}
                disabled={loading || saving}
                className={`py-5 px-6 rounded-2xl transition-all duration-300 relative group border text-left ${
                  isSelected
                    ? 'shadow-[0_0_0_2px_rgba(132,173,255,0.35),0_20px_40px_rgba(37,99,235,0.12)]'
                    : ''
                }`}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(132, 173, 255, 0.22), rgba(108, 159, 255, 0.12))' : 'rgba(255, 255, 255, 0.03)',
                  borderColor: isSelected ? 'rgba(132, 173, 255, 0.6)' : 'rgba(255,255,255,0.08)',
                  color: isSelected ? '#dbeafe' : '#a0a0a0',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{skill}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: isSelected ? 'rgba(132, 173, 255, 0.24)' : 'rgba(255,255,255,0.06)',
                      color: isSelected ? '#84adff' : '#6b7280',
                    }}
                  >
                    {isSelected ? <Check size={16} /> : <Plus size={16} />}
                  </span>
                </div>
                <p className="text-xs mt-3 uppercase tracking-[0.2em]" style={{ color: isSelected ? '#84adff' : '#6b7280' }}>
                  {isSelected ? 'Selected' : 'Tap to Select'}
                </p>
              </motion.button>
            );
          })}
        </div>

        <form onSubmit={handleAddCustomSkill} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customSkill}
              onChange={(event) => setCustomSkill(event.target.value)}
              placeholder="Add your own custom skill"
              className="flex-1 rounded-2xl px-5 py-4 bg-white/5 border border-white/10 text-white outline-none placeholder:text-zinc-500"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <button
              type="submit"
              disabled={loading || saving}
              className="px-6 py-4 rounded-2xl font-bold text-[#002d64] disabled:opacity-60"
              style={{
                fontFamily: 'Manrope, sans-serif',
                background: 'linear-gradient(135deg, #84adff 0%, #6c9fff 100%)',
              }}
            >
              Add Custom Skill
            </button>
          </div>
        </form>

        <div className="mb-10 text-left">
          <h3 className="text-xl font-black mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}>
            Selected Skills
          </h3>
          {pendingSkills.length === 0 ? (
            <div className="rounded-2xl p-5 text-sm text-zinc-400 border border-dashed border-white/10">
              No skills selected yet. Choose from the cards above or add a custom one.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {pendingSkills.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    background: 'rgba(132, 173, 255, 0.18)',
                    border: '1px solid rgba(132, 173, 255, 0.45)',
                    color: '#dbeafe',
                  }}
                >
                  <span className="font-semibold">{skill}</span>
                  <button
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLaunch}
          disabled={saving || loading}
          className="btn-primary w-full py-4 text-lg font-bold rounded-xl relative overflow-hidden disabled:opacity-60"
          style={{
            fontFamily: 'Manrope, sans-serif',
            background: 'linear-gradient(135deg, #84adff 0%, #6c9fff 100%)',
            color: '#002d64',
            border: 'none',
            boxShadow: '0 0 20px rgba(132, 173, 255, 0.3)',
          }}
        >
          <span className="relative z-10">{saving ? 'Saving Skills...' : 'Save Skills and Launch Dashboard'}</span>
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
        </motion.button>
      </motion.div>
    </div>
  );
}
