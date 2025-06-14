const express = require("express");
const BreedAyam = require("../models/BreedAyam");
const { authenticateJWT } = require("../middleware/authenticateJWT");

const router = express.Router();

// 📄 GET semua breed ayam
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const breeds = await BreedAyam.find().populate("idJenisAyam");
    res.json(breeds);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data", error: err.message });
  }
});

// ➕ POST tambah breed ayam
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const breed = new BreedAyam(req.body);
    await breed.save();
    res.status(201).json({ message: "Breed ayam ditambahkan", data: breed });
  } catch (err) {
    res.status(400).json({ message: "Gagal menambahkan breed", error: err.message });
  }
});

// ✏️ PUT update breed ayam
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const updated = await BreedAyam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Breed ayam tidak ditemukan" });
    res.json({ message: "Breed ayam diperbarui", data: updated });
  } catch (err) {
    res.status(400).json({ message: "Gagal mengupdate", error: err.message });
  }
});

// ❌ DELETE hapus breed ayam
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const deleted = await BreedAyam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Breed ayam tidak ditemukan" });
    res.json({ message: "Breed ayam dihapus" });
  } catch (err) {
    res.status(400).json({ message: "Gagal menghapus", error: err.message });
  }
});

module.exports = router;
