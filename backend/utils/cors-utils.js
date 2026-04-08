const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://celebrated-donut-9a3bb7.netlify.app"
];

const getAllowedOrigins = (env = process.env) =>
  [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...(env.CLIENT_URLS || env.CLIENT_URL || "").split(",")
  ]
    .map(normalizeOrigin)
    .filter(Boolean)
    .filter((origin, index, origins) => origins.indexOf(origin) === index);

const isOriginAllowed = (origin, env = process.env) => {
  if (!origin) {
    return false;
  }

  return getAllowedOrigins(env).includes(normalizeOrigin(origin));
};

module.exports = {
  DEFAULT_ALLOWED_ORIGINS,
  normalizeOrigin,
  getAllowedOrigins,
  isOriginAllowed
};
