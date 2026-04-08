const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const getAllowedOrigins = (env = process.env) =>
  (env.CLIENT_URLS || env.CLIENT_URL || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

const isOriginAllowed = (origin, env = process.env) => {
  if (!origin) {
    return false;
  }

  return getAllowedOrigins(env).includes(normalizeOrigin(origin));
};

module.exports = {
  normalizeOrigin,
  getAllowedOrigins,
  isOriginAllowed
};
