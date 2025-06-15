const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret, jwtExpiresIn } = require("../config");
const User = require("../models/user");

const router = express.Router();

// 🔐 Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiresIn });
};

// Contoh di auth-service
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  res.json(user);
});


// 📝 REGISTER USER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const exist = await User.findOne({ username });
    if (exist)
      return res.status(409).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
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

module.exports = router;
