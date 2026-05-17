import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const tags = [
  { value: '', label: 'Choose a tag' },
  { value: 'burnout', label: 'Burnout' },
  { value: 'distraction', label: 'Distraction' },
  { value: 'no plan', label: 'No plan' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

export default function InconsistencyReasonPopup() {
  const { needsInconsistencyReason, inconsistencyGapDays, submitReason } = useAuth();
  const [reason, setReason] = useState('');
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('[InconsistencyPopup] popup render decision', {
      needsInconsistencyReason,
      inconsistencyGapDays,
      willRender: Boolean(needsInconsistencyReason),
    });
  }, [inconsistencyGapDays, needsInconsistencyReason]);

  useEffect(() => {
    if (!needsInconsistencyReason) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [needsInconsistencyReason]);

  if (!needsInconsistencyReason) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedReason = reason.trim();

    if (trimmedReason.length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitReason({ reason: trimmedReason, tag });
      setReason('');
      setTag('');
    } catch (err) {
      setError(err.message || 'Unable to submit right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-zinc-950/70 px-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inconsistency-title"
    >
      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-950/20 dark:border-white/10 dark:bg-[var(--surface-container)]"
      >
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 id="inconsistency-title" className="text-xl font-black text-zinc-950 dark:text-white">
              We noticed a break in your consistency
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-white/60">
              Help us understand what happened
              {inconsistencyGapDays > 0 ? ` after ${inconsistencyGapDays} days away.` : '.'}
            </p>
          </div>
        </div>

        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">
          Why were you inconsistent?
        </label>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          minLength={10}
          required
          rows={5}
          autoFocus
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-950 outline-none transition focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-400"
          placeholder="Share the real reason so your future plan can adapt."
        />

        <label className="mb-2 mt-5 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/40">
          Optional tag
        </label>
        <select
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-400"
        >
          {tags.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-6 w-full px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </motion.form>
    </div>
  );
}
