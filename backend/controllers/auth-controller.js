const bcrypt = require('bcrypt')
const jwttoken = require("jsonwebtoken")
const user = require('../models/user-model')
const { getCookieOptions } = require('../utils/cookie-utils')

const COOKIE_NAME = "token";

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
      res.status(500).json({
        success: false,
        message: "email is already registered please enter other "
      })
    }
    //hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedpsswd = await bcrypt.hash(password, salt);

    const newuser = new user({ name, email, password: hashedpsswd, role, skills });
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
      await loginuser.save();

      const accesstoken = buildAccessToken(loginuser, Boolean(rememberMe));

      res.cookie(COOKIE_NAME, accesstoken, getCookieOptions(Boolean(rememberMe)));
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: loginuser._id,
          name: loginuser.name,
          email: loginuser.email,
          role: loginuser.role,
          rememberMe: Boolean(rememberMe)
        }
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
    const currentUser = await user.findById(req.user.id).select("name email role rememberMe");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        rememberMe: Boolean(currentUser.rememberMe)
      }
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

module.exports = { register, login, changepassword, me, logout, updateRememberPreference }
