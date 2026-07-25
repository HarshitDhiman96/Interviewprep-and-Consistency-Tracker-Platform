const DEFAULT_INACTIVITY_MS = 60_000;

function shouldGenerateSummary({ lastActivityAt, now, inactivityMs = DEFAULT_INACTIVITY_MS }) {
  if (!lastActivityAt || !now) {
    return false;
  }

  const lastActivity = new Date(lastActivityAt).getTime();
  const currentTime = new Date(now).getTime();

  if (Number.isNaN(lastActivity) || Number.isNaN(currentTime)) {
    return false;
  }

  return currentTime - lastActivity >= inactivityMs;
}

module.exports = {
  DEFAULT_INACTIVITY_MS,
  shouldGenerateSummary
};
