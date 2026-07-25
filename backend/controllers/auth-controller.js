// Ye controller user account aur session handle karta hai.
// register me email duplicate check hota hai, password hash hota hai, aur new user default streak/session fields ke saath save hota hai.
// login me email ya username se user milta hai, password verify hota hai, JWT cookie set hoti hai.
// Login ke time last activity aur streak ka gap check hota hai; agar old streak break hua hai
// aur gap 2 din se zyada hai, to user ko inconsistency reason popup dikhane ke liye flag set hota hai.
// me current logged-in user deta hai, logout cookie clear karta hai,
// rememberMe session duration update karta hai, aur changepassword old password verify karke new hashed password save karta hai.

const bcrypt = require('bcrypt')
const jwttoken = require("jsonwebtoken")
const user = require('../models/user-model')
const Streak = require('../models/streak_model')
const Log = require('../models/logs-model')
const { getCookieOptions } = require('../utils/cookie-utils')

const COOKIE_NAME = "token";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeDate = (value = new Date()) => {
  const normalized = new Date(value);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const getGapDays = (lastActiveDate, today = new Date()) => {
  if (!lastActiveDate) {
    return 0;
  }

  const normalizedToday = normalizeDate(today);
  const normalizedLastActiveDate = normalizeDate(lastActiveDate);

  return Math.floor((normalizedToday.getTime() - normalizedLastActiveDate.getTime()) / DAY_IN_MS);
};

const getActivitySnapshot = async (loginuser) => {
  const streak = await Streak.findOne({ userId: loginuser._id });
  const latestLog = await Log.findOne({ user: loginuser._id }).sort({ createdAt: -1 });
  const lastActiveDate = streak?.lastActiveDate || loginuser.lastActiveDate || latestLog?.createdAt || null;
  const currentStreak = streak?.currentStreak || loginuser.currentStreak || (latestLog ? 1 : 0);
  const hasPreviousActivity = Boolean(lastActiveDate || currentStreak > 0);

  return {
    streak,
    latestLog,
    lastActiveDate,
    currentStreak,
    hasPreviousActivity
  };
};

const buildUserResponse = (loginuser) => ({
  id: loginuser._id,
  name: loginuser.name,
  email: loginuser.email,
  role: loginuser.role,
  rememberMe: Boolean(loginuser.rememberMe),
  lastActiveDate: loginuser.lastActiveDate || null,
  currentStreak: loginuser.currentStreak || 0,
  needsInconsistencyReason: Boolean(loginuser.needsInconsistencyReason),
  gapDays: loginuser.inconsistencyGapDays || 0,
  primaryGoal: loginuser.primaryGoal || "",
  goalCompleted: Boolean(loginuser.goalCompleted || loginuser.primaryGoal)
});

const buildAccessToken = (loginuser, rememberMe = false) => (
  jwttoken.sign({
    userid: loginuser._id,
    username: loginuser.name,
    useremail: loginuser.email,
    role: loginuser.role,
    rememberMe
  }, process.env.jwtkey, {
    expiresIn: rememberMe ? "7d" : "2h"
  })
);

const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, role, skills } = req.body;
    //check uniqueness of email 
    const checkunique = await user.findOne({ email });
    if (checkunique) {
      return res.status(409).json({
        success: false,
        message: "email is already registered please enter other "
      })
    }
    //hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedpsswd = await bcrypt.hash(password, salt);

    const newuser = new user({
      name,
      email,
      password: hashedpsswd,
      role,
      skills,
      lastActiveDate: null,
      currentStreak: 0,
      lastLoginDate: null,
      isFirstTimeUser: true,
      needsInconsistencyReason: false,
      inconsistencyGapDays: 0,
      primaryGoal: "",
      goalCompleted: false
    });
    await newuser.save();

    res.status(200).json({ success: true, message: "User registered successfully!" });
  } catch (e) {
    console.log("error while registering user ");
    res.status(500).json({
      success: false,
      message: e.message
    }
    )
  }
}

const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password, rememberMe = false } = req.body;
    const loginuser = await user.findOne({ $or: [{ email: email }, { name: email }] });
    if (!loginuser) {
      return res.status(401).json({
        success: false,
        message: "please register yourself first then try to login in our database"
      })
    }
    else {
      const ispassmatch = await bcrypt.compare(password, loginuser.password);
      if (!ispassmatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password or username"
        });
      }
      loginuser.rememberMe = Boolean(rememberMe);
      const activitySnapshot = await getActivitySnapshot(loginuser);
      const gapDays = getGapDays(activitySnapshot.lastActiveDate);
      const wasFirstLogin =
        Boolean(loginuser.isFirstTimeUser) &&
        !loginuser.lastLoginDate &&
        !activitySnapshot.hasPreviousActivity;
      const hasBrokenExistingStreak =
        !wasFirstLogin &&
        activitySnapshot.hasPreviousActivity &&
        gapDays > 2;

      loginuser.lastActiveDate = activitySnapshot.lastActiveDate || loginuser.lastActiveDate;
      loginuser.currentStreak = activitySnapshot.currentStreak || 0;
      loginuser.needsInconsistencyReason = Boolean(hasBrokenExistingStreak);
      loginuser.inconsistencyGapDays = hasBrokenExistingStreak ? gapDays : 0;
      loginuser.lastLoginDate = new Date();
      loginuser.isFirstTimeUser = false;
      await loginuser.save();

      const accesstoken = buildAccessToken(loginuser, Boolean(rememberMe));

      res.cookie(COOKIE_NAME, accesstoken, getCookieOptions(Boolean(rememberMe)));
      res.status(200).json({
        success: true,
        message: "Login successful",
        needsInconsistencyReason: Boolean(loginuser.needsInconsistencyReason),
        gapDays: loginuser.inconsistencyGapDays || 0,
        inconsistencyCheck: {
          lastActiveDate: activitySnapshot.lastActiveDate,
          currentStreak: activitySnapshot.currentStreak,
          gapDays,
          wasFirstLogin,
          hasPreviousActivity: activitySnapshot.hasPreviousActivity,
          shouldShowPopup: Boolean(loginuser.needsInconsistencyReason)
        },
        user: buildUserResponse(loginuser),
        jwtkey:accesstoken
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const me = async (req, res) => {
  try {
    const currentUser = await user.findById(req.user.id).select("name email role rememberMe lastActiveDate currentStreak needsInconsistencyReason inconsistencyGapDays primaryGoal goalCompleted");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      needsInconsistencyReason: Boolean(currentUser.needsInconsistencyReason),
      gapDays: currentUser.inconsistencyGapDays || 0,
      user: buildUserResponse(currentUser)
    });
  } catch (e) {
    console.error("error while fetching current user", e);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch the current session"
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      ...getCookieOptions(false),
      maxAge: undefined
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (e) {
    console.error("error while logging out", e);
    return res.status(500).json({
      success: false,
      message: "Unable to log out right now"
    });
  }
};

const updateRememberPreference = async (req, res) => {
  try {
    const { rememberMe } = req.body;

    if (typeof rememberMe !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "rememberMe must be a boolean value"
      });
    }

    const currentUser = await user.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    currentUser.rememberMe = rememberMe;
    await currentUser.save();

    const accesstoken = buildAccessToken(currentUser, rememberMe);
    res.cookie(COOKIE_NAME, accesstoken, getCookieOptions(rememberMe));

    return res.status(200).json({
      success: true,
      message: rememberMe
        ? "Remember me enabled for 7 days"
        : "Remember me disabled. Session switched back to the shorter cookie window.",
      rememberMe
    });
  } catch (e) {
    console.error("error while updating remember me preference", e);
    return res.status(500).json({
      success: false,
      message: "Unable to update your session preference"
    });
  }
};

const changepassword = async (req, res) => {
  try {
    const { email, oldpassword, newpassword } = req.body;

    if (!email || !oldpassword || !newpassword) {
      return res.status(400).json({
        success: false,
        message: "email, old password and new password are all required"
      })
    }

    // Find the user by email
    const finduser = await user.findOne({ email })
    if (!finduser) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      })
    }

    // Verify the old password is correct
    const isOldPasswordValid = await bcrypt.compare(oldpassword, finduser.password)
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      })
    }

    // Ensure new password is different from old one
    const isSamePassword = await bcrypt.compare(newpassword, finduser.password)
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password"
      })
    }

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    const hashednewpsswd = await bcrypt.hash(newpassword, salt);
    finduser.password = hashednewpsswd;
    await finduser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })

  } catch (e) {
    console.error("error while changing password ", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    })
  }
}

const updateGoal = async (req, res) => {
  try {
    const { primaryGoal } = req.body;
    if (!primaryGoal) {
      return res.status(400).json({
        success: false,
        message: "Primary goal is required"
      });
    }

    const currentUser = await user.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    currentUser.primaryGoal = primaryGoal;
    currentUser.goalCompleted = true;
    currentUser.goalCreatedAt = currentUser.goalCreatedAt || new Date();
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      user: buildUserResponse(currentUser)
    });
  } catch (e) {
    console.error("error while updating goal", e);
    return res.status(500).json({
      success: false,
      message: "Unable to update your goal"
    });
  }
};

module.exports = { register, login, changepassword, me, logout, updateRememberPreference, updateGoal }
