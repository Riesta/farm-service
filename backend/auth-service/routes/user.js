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

// 🔍 GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil user", error: err.message });
  }
});

// 🔐 Middleware JWT
const authenticateJWT = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak disediakan" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

module.exports = router;