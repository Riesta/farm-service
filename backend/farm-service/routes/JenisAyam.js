const express = require("express");
const JenisAyam = require("../models/JenisAyam");
const { authenticateJWT } = require("../middleware/authenticateJWT"); // Pastikan path ini sesuai

const router = express.Router();

// GET semua jenis ayam
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const jenis = await JenisAyam.find();
    res.json(jenis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah jenis ayam
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const newJenis = new JenisAyam(req.body);
    await newJenis.save();
    res.status(201).json(newJenis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update jenis ayam
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const updated = await JenisAyam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE hapus jenis ayam
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const deleted = await JenisAyam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
