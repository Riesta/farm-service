const axios = require("axios");
const express = require("express");
const router = express.Router();
const BatchProduk = require("../models/BatchProdukModel");
const Produk = require("../models/ProdukModel");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/authenticateJWT");

const AUTH_SERVICE_URL = "http://localhost:3000/api/user";

// 🔍 Helper untuk validasi user dari auth-service
async function validateUserExists(userId) {
  try {
    const res = await axios.get(`${AUTH_SERVICE_URL}/${userId}`);
    return res.status === 200;
  } catch (err) {
    return false;
  }
}

// 📄 GET semua batch produk
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const data = await BatchProduk.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data",
      error: err.message,
    });
  }
});

// // 📄 GET satu batch berdasarkan ID
// router.get("/:id", authenticateJWT, async (req, res) => {
//   try {
//     const data = await BatchProduk.findById(req.params.id).populate("updatedBy");
//     if (!data)
//       return res.status(404).json({ message: "Batch tidak ditemukan" });
//     res.json(data);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Gagal mengambil data", error: err.message });
//   }
// });

// // ➕ POST tambah batch produk
// router.post("/", authenticateJWT, async (req, res) => {
//   const { kandangId, produkId, jumlahProduk } = req.body;
//   const userId = req.user.id;

//   try {
//     // 🔍 Cek kandang
//     const kandang = await Kandang.findById(kandangId);
//     if (!kandang)
//       return res.status(404).json({ message: "Kandang tidak ditemukan" });

//     // 🔍 Cek produk
//     const produk = await Produk.findById(produkId);
//     if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });

//     // 🔍 Validasi user dari auth-service
//     const userValid = await validateUserExists(userId);
//     if (!userValid)
//       return res.status(404).json({ message: "User tidak ditemukan" });

//     // ❌ Cegah input jika sudah ada batch aktif di kandang tersebut
//     const existingBatch = await BatchProduk.findOne({
//       kandangId,
//       isActive: true,
//     });
//     if (existingBatch) {
//       return res.status(400).json({
//         message:
//           "Kandang ini sudah memiliki batch aktif. Tidak dapat menambahkan batch baru.",
//       });
//     }

//     // ✅ Validasi kapasitas kandang (optional jika kamu masih ingin batasi kapasitas)
//     const batchLain = await BatchProduk.find({ kandangId, isActive: true });
//     const totalProdukSaatIni = batchLain.reduce(
//       (total, batch) => total + batch.jumlahProduk,
//       0
//     );

//     if (totalProdukSaatIni + jumlahProduk > kandang.kapasitas) {
//       return res.status(400).json({
//         message: `Kapasitas kandang melebihi batas. Tersisa: ${
//           kandang.kapasitas - totalProdukSaatIni
//         } ekor`,
//       });
//     }

//     // 🐔 Simpan batch
//     const batch = new BatchProduk({
//       ...req.body,
//       updatedBy: userId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     await batch.save();

//     // 🔄 Update kandang jadi aktif
//     await Kandang.findByIdAndUpdate(kandangId, { status: "aktif" });

//     res.status(201).json({ message: "Batch produk ditambahkan", data: batch });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Gagal menambahkan batch", error: err.message });
//   }
// });

// // ✏️ PUT update batch produk
// router.put("/:id", authenticateJWT, async (req, res) => {
//   const updatedBy = req.user.id;

//   try {
//     const batch = await BatchProduk.findById(req.params.id);
//     if (!batch)
//       return res.status(404).json({ message: "Batch tidak ditemukan" });

//     const userValid = await validateUserExists(updatedBy);
//     if (!userValid)
//       return res.status(400).json({ message: "User tidak ditemukan" });

//     Object.assign(batch, req.body, {
//       updatedBy,
//       updatedAt: new Date(),
//     });

//     await batch.save();

//     res.json({ message: "Batch produk diperbarui", data: batch });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Gagal mengupdate batch", error: err.message });
//   }
// });

// // ❌ DELETE batch produk
// router.delete("/:id", authenticateJWT, async (req, res) => {
//   try {
//     const batch = await BatchProduk.findById(req.params.id);
//     if (!batch)
//       return res.status(404).json({ message: "Batch tidak ditemukan" });

//     const kandangId = batch.kandangId;

//     await batch.deleteOne();

//     // Cek apakah masih ada batch aktif di kandang tsb
//     const batchAktifLain = await BatchProduk.findOne({
//       kandangId,
//       isActive: true,
//     });

//     if (!batchAktifLain) {
//       await Kandang.findByIdAndUpdate(kandangId, { status: "kosong" });
//     }

//     res.json({ message: "Batch produk dihapus dan status kandang diperiksa" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Gagal menghapus batch", error: err.message });
//   }
// });

module.exports = router;
