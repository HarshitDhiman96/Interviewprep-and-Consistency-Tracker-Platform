const normalizeDate = (value = new Date()) => {
  const normalized = new Date(value);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const calculateNextStreakState = ({ existingStreak, today = new Date() }) => {
  const normalizedToday = normalizeDate(today);
  const yesterday = new Date(normalizedToday);
  yesterday.setDate(normalizedToday.getDate() - 1);

  if (!existingStreak) {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: normalizedToday,
      changed: true,
      shouldCreate: true
    };
  }

  const lastDate = normalizeDate(existingStreak.lastActiveDate);

  if (lastDate.getTime() === normalizedToday.getTime()) {
    return {
      ...existingStreak,
      lastActiveDate: normalizedToday,
      changed: false,
      shouldCreate: false
    };
  }

  const nextCurrentStreak =
    lastDate.getTime() === yesterday.getTime()
      ? existingStreak.currentStreak + 1
      : 1;

  return {
    ...existingStreak,
    currentStreak: nextCurrentStreak,
    longestStreak: Math.max(existingStreak.longestStreak, nextCurrentStreak),
    lastActiveDate: normalizedToday,
    changed: true,
    shouldCreate: false
  };
};

module.exports = {
  normalizeDate,
  calculateNextStreakState
};
