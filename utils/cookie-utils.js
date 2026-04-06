const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

const resolveCookieSameSite = (env = process.env) => {
  const sameSite = (env.COOKIE_SAME_SITE || "lax").toLowerCase();

  if (sameSite === "strict" || sameSite === "lax" || sameSite === "none") {
    return sameSite;
  }

  return "lax";
};

const resolveCookieSecure = (env = process.env) => {
  const sameSite = resolveCookieSameSite(env);

  if (sameSite === "none") {
    return true;
  }

  return env.COOKIE_SECURE === "true" || env.NODE_ENV === "production";
};

const getCookieOptions = (rememberMe = false, env = process.env) => ({
  httpOnly: true,
  secure: resolveCookieSecure(env),
  sameSite: resolveCookieSameSite(env),
  path: "/",
  ...(rememberMe ? { maxAge: SEVEN_DAYS_IN_MS } : { maxAge: TWO_HOURS_IN_MS })
});

module.exports = {
  TWO_HOURS_IN_MS,
  SEVEN_DAYS_IN_MS,
  resolveCookieSameSite,
  resolveCookieSecure,
  getCookieOptions
};
