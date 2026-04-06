const getAllowedOrigins = (env = process.env) =>
  (env.CLIENT_URLS || env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isOriginAllowed = (origin, env = process.env) => {
  if (!origin) {
    return false;
  }

  return getAllowedOrigins(env).includes(origin);
};

module.exports = {
  getAllowedOrigins,
  isOriginAllowed
};
