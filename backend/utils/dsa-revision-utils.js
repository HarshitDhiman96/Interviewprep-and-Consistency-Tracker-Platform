const getNormalizedProblemName = (problemName = '') => (problemName || '').trim().replace(/\s+/g, ' ').toLowerCase();

const DEFAULT_INTERVALS = {
  solved_independently: [3, 7, 14, 30],
  logic_understood: [3, 3, 3, 3],
  needed_solution: [1, 3, 3, 3],
};

const getNextIntervalForResult = (result, currentInterval = 0) => {
  if (result === 'solved_independently') {
    const intervals = DEFAULT_INTERVALS.solved_independently;
    return intervals[Math.min(currentInterval, intervals.length - 1)] ?? 30;
  }

  if (result === 'logic_understood') {
    return DEFAULT_INTERVALS.logic_understood[Math.min(currentInterval, DEFAULT_INTERVALS.logic_understood.length - 1)] ?? 3;
  }

  if (result === 'needed_solution') {
    return DEFAULT_INTERVALS.needed_solution[Math.min(currentInterval, DEFAULT_INTERVALS.needed_solution.length - 1)] ?? 3;
  }

  return 3;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getDefaultReviewWindow = (result, currentInterval) => {
  const intervalDays = getNextIntervalForResult(result, currentInterval);
  return addDays(new Date(), intervalDays);
};

module.exports = {
  getNormalizedProblemName,
  getNextIntervalForResult,
  getDefaultReviewWindow,
  addDays,
  DEFAULT_INTERVALS,
};
