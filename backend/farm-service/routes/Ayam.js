const express = require("express");
const Ayam = require("../models/Ayam");
const { authenticateJWT } = require("../middleware/authenticateJWT");

const router = express.Router();

// 🔍 GET semua data ayam
router.get("/", async (req, res) => {
  try {
    const ayamList = await Ayam.find();
    res.json(ayamList);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data ayam", error: err.message });
  }
});

// ➕ POST tambah ayam
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const newAyam = new Ayam(req.body);
    await newAyam.save();
    res
      .status(201)
      .json({ message: "Data ayam berhasil ditambahkan", data: newAyam });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menambahkan ayam", error: err.message });
  }
});

// ✏️ PUT update ayam by ID
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const updatedAyam = await Ayam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedAyam)
      return res.status(404).json({ message: "Data ayam tidak ditemukan" });
    res.json({ message: "Data ayam berhasil diperbarui", data: updatedAyam });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal memperbarui ayam", error: err.message });
  }
});

// ❌ DELETE ayam by ID
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const deleted = await Ayam.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Data ayam tidak ditemukan" });
    res.json({ message: "Data ayam berhasil dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus ayam", error: err.message });
  }
});

module.exports = router;
