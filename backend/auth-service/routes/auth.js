const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { jwtSecret, jwtExpiresIn } = require("../config");
const User = require("../models/user");

const authenticateJWT = require("../middleware/authenticate");
const { validate } = require("../middleware/validateData");

const { registerRules } = require("../dataRules/registerRules");
const { loginRules } = require("../dataRules/loginRules");
const router = express.Router();

// 🔐 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

// 📝 REGISTER USER
router.post("/register", registerRules(), validate, async (req, res) => {
  const { username, email, password, name, role } = req.body;

  try {
    const exist = await User.findOne({ $or: [{ username }, { email }] });
    if (exist) {
      return res
        .status(409)
        .json({ message: "Username or email already taken" });
    }

    if (!["admin", "employee"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be 'admin' or 'employee'" });
    }

    const hashed = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = new User({
      email,
      password: hashed,
      name,
      username,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

// 🔑 LOGIN USER
router.post("/login", loginRules(), validate, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      samesite: "Strict",
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// 🔒 Protected route
router.get("/protected", (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

// 🔑 GOOGLE OAUTH
require("../config/google");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.user.email });

      if (!user) {
        user = new User({
          name: req.user.name,
          email: req.user.email,
          role: "employee", // default role untuk OAuth user
          profilePicture: req.user.profilePicture,
          oauth: {
            provider: "google",
            providerId: req.user.providerId,
          },
        });
        await user.save();
      }

      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        samesite: "Strict",
        maxAge: 60 * 60 * 1000,
      });
      res.json({
        message: "Google OAuth successful",
        token,
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Google login failed", error: err.message });
    }
  }
);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout berhasil" });
});

module.exports = router;
