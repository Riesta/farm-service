const express = require("express");
const Storage = require("../models/Storage");
const { authenticateJWT } = require("../middleware/authenticateJWT");

const router = express.Router();

// 📄 GET semua storage
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const storage = await Storage.find();
    res.json(storage);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data storage",
      error: err.message,
    });
  }
});

// ➕ POST tambah storage
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const storageBaru = new Storage(req.body);
    await storageBaru.save();
    res.status(201).json({
      message: "Storage ditambahkan",
      data: storageBaru,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal menambahkan storage",
      error: err.message,
    });
  }
});

// // ✏️ PUT update storage
// router.put("/:id", authenticateJWT, async (req, res) => {
//   try {
//     const updated = await Storage.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated)
//       return res.status(404).json({ message: "Storage tidak ditemukan" });
//     res.json({ message: "Storage diperbarui", data: updated });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Gagal mengupdate storage", error: err.message });
//   }
// });

// // ❌ DELETE hapus storage
// router.delete("/:id", authenticateJWT, async (req, res) => {
//   try {
//     const deleted = await Storage.findByIdAndDelete(req.params.id);
//     if (!deleted)
//       return res.status(404).json({ message: "Storage tidak ditemukan" });
//     res.json({ message: "Storage dihapus" });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Gagal menghapus storage", error: err.message });
//   }
// });

module.exports = router;
