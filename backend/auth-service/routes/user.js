const express = require("express");
const User = require("../models/user");

const router = express.Router();

// 🔍 GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil user", error: err.message });
  }
});

module.exports = router;
