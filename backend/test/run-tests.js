const assert = require("node:assert/strict");
const {
  TWO_HOURS_IN_MS,
  SEVEN_DAYS_IN_MS,
  resolveCookieSameSite,
  resolveCookieSecure,
  getCookieOptions
} = require("../utils/cookie-utils");
const {
  DEFAULT_ALLOWED_ORIGINS,
  normalizeOrigin,
  getAllowedOrigins,
  isOriginAllowed
} = require("../utils/cors-utils");
const { normalizeDate, calculateNextStreakState } = require("../utils/streak-logic");

const tests = [
  {
    name: "defaults cookie sameSite to lax",
    run: () => {
      assert.equal(resolveCookieSameSite({}), "lax");
    }
  },
  {
    name: "falls back to lax for invalid sameSite values",
    run: () => {
      assert.equal(resolveCookieSameSite({ COOKIE_SAME_SITE: "invalid" }), "lax");
    }
  },
  {
    name: "forces secure cookies when sameSite is none",
    run: () => {
      assert.equal(resolveCookieSecure({ COOKIE_SAME_SITE: "none", NODE_ENV: "development" }), true);
    }
  },
  {
    name: "enables secure cookies in production",
    run: () => {
      assert.equal(resolveCookieSecure({ NODE_ENV: "production" }), true);
    }
  },
  {
    name: "builds a short-lived session cookie by default",
    run: () => {
      assert.deepEqual(getCookieOptions(false, {}), {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: TWO_HOURS_IN_MS
      });
    }
  },
  {
    name: "builds a remember-me cookie",
    run: () => {
      const options = getCookieOptions(true, { COOKIE_SAME_SITE: "none" });

      assert.equal(options.httpOnly, true);
      assert.equal(options.secure, true);
      assert.equal(options.sameSite, "none");
      assert.equal(options.path, "/");
      assert.equal(options.maxAge, SEVEN_DAYS_IN_MS);
    }
  },
  {
    name: "supports a single allowed origin",
    run: () => {
      assert.deepEqual(
        getAllowedOrigins({ CLIENT_URL: "https://frontend.example.com" }),
        [...DEFAULT_ALLOWED_ORIGINS, "https://frontend.example.com"]
      );
    }
  },
  {
    name: "supports multiple comma-separated origins",
    run: () => {
      const origins = getAllowedOrigins({
        CLIENT_URLS: "https://a.example.com, https://b.example.com ,https://c.example.com"
      });

      assert.deepEqual(
        origins.slice(-3),
        ["https://a.example.com", "https://b.example.com", "https://c.example.com"]
      );
    }
  },
  {
    name: "normalizes trailing slashes in configured origins",
    run: () => {
      assert.equal(normalizeOrigin("https://frontend.example.com///"), "https://frontend.example.com");
      const origins = getAllowedOrigins({
        CLIENT_URLS: "https://frontend.example.com/, https://www.frontend.example.com///"
      });

      assert.deepEqual(origins.slice(-2), [
        "https://frontend.example.com",
        "https://www.frontend.example.com"
      ]);
    }
  },
  {
    name: "always includes the deployed frontend as a fallback allowed origin",
    run: () => {
      assert.equal(
        isOriginAllowed("https://celebrated-donut-9a3bb7.netlify.app", {}),
        true
      );
    }
  },
  {
    name: "allows configured origins and blocks others",
    run: () => {
      const env = { CLIENT_URLS: "https://frontend.example.com,https://www.frontend.example.com" };

      assert.equal(isOriginAllowed("https://frontend.example.com", env), true);
      assert.equal(isOriginAllowed("https://www.frontend.example.com", env), true);
      assert.equal(isOriginAllowed("https://evil.example.com", env), false);
    }
  },
  {
    name: "matches origins even when the request origin includes a trailing slash",
    run: () => {
      assert.equal(
        isOriginAllowed("https://frontend.example.com/", {
          CLIENT_URLS: "https://frontend.example.com"
        }),
        true
      );
    }
  },
  {
    name: "rejects empty origins",
    run: () => {
      assert.equal(isOriginAllowed("", { CLIENT_URL: "https://frontend.example.com" }), false);
    }
  },
  {
    name: "normalizeDate resets the time to midnight",
    run: () => {
      const result = normalizeDate(new Date(2026, 3, 6, 18, 45, 10, 123));

      assert.equal(result.getHours(), 0);
      assert.equal(result.getMinutes(), 0);
      assert.equal(result.getSeconds(), 0);
      assert.equal(result.getMilliseconds(), 0);
    }
  },
  {
    name: "creates a first streak for a new user",
    run: () => {
      const result = calculateNextStreakState({
        existingStreak: null,
        today: "2026-04-06T10:00:00.000Z"
      });

      assert.equal(result.currentStreak, 1);
      assert.equal(result.longestStreak, 1);
      assert.equal(result.shouldCreate, true);
      assert.equal(result.changed, true);
    }
  },
  {
    name: "does not change streak when the user is already active today",
    run: () => {
      const result = calculateNextStreakState({
        existingStreak: {
          currentStreak: 4,
          longestStreak: 7,
          lastActiveDate: new Date(2026, 3, 6, 1, 30, 0, 0)
        },
        today: new Date(2026, 3, 6, 20, 0, 0, 0)
      });

      assert.equal(result.currentStreak, 4);
      assert.equal(result.longestStreak, 7);
      assert.equal(result.shouldCreate, false);
      assert.equal(result.changed, false);
    }
  },
  {
    name: "increments streak when the last active day was yesterday",
    run: () => {
      const result = calculateNextStreakState({
        existingStreak: {
          currentStreak: 4,
          longestStreak: 4,
          lastActiveDate: new Date(2026, 3, 5, 9, 0, 0, 0)
        },
        today: new Date(2026, 3, 6, 20, 0, 0, 0)
      });

      assert.equal(result.currentStreak, 5);
      assert.equal(result.longestStreak, 5);
      assert.equal(result.shouldCreate, false);
      assert.equal(result.changed, true);
    }
  },
  {
    name: "resets the current streak after a gap while preserving the longest streak",
    run: () => {
      const result = calculateNextStreakState({
        existingStreak: {
          currentStreak: 6,
          longestStreak: 9,
          lastActiveDate: new Date(2026, 3, 3, 9, 0, 0, 0)
        },
        today: new Date(2026, 3, 6, 20, 0, 0, 0)
      });

      assert.equal(result.currentStreak, 1);
      assert.equal(result.longestStreak, 9);
      assert.equal(result.shouldCreate, false);
      assert.equal(result.changed, true);
    }
  }
];

let passed = 0;

for (const testCase of tests) {
  try {
    testCase.run();
    passed += 1;
    console.log(`PASS ${testCase.name}`);
  } catch (error) {
    console.error(`FAIL ${testCase.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  console.error(`\n${passed}/${tests.length} checks passed.`);
} else {
  console.log(`\nAll ${tests.length} checks passed.`);
}
