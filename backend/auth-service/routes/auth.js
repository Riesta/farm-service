const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { jwtSecret, jwtExpiresIn } = require("../config");
const User = require("../models/user");

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
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// 🔐 Middleware JWT
const authenticateJWT = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// 🔒 Protected route
router.get("/protected", authenticateJWT, (req, res) => {
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

module.exports = router;
