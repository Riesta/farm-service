const axios = require("axios");
const express = require("express");
const router = express.Router();
const BatchAyam = require("../models/BatchAyam");
const Ayam = require("../models/Ayam");
const Kandang = require("../models/Kandang");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/authenticateJWT");

const AUTH_SERVICE_URL = "http://localhost:3000/api/user";

//HELPER UNTUK VALIDASI USER DI AUTH-SERVICE
async function validateUserExists(userId) {
  try {
    const res = await axios.get(`${AUTH_SERVICE_URL}/${userId}`);
    return res.status === 200;
  } catch (err) {
    return false;
  }
}

//GET SEMUA
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const data = await BatchAyam.find().populate("updatedBy");
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
});

//GET BY ID
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const data = await BatchAyam.findById(req.params.id).populate("updatedBy");
    if (!data)
      return res.status(404).json({ message: "Batch tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
});

//POST
router.post("/", authenticateJWT, async (req, res) => {
  const { kandangId, ayamId, jumlahAyam } = req.body;
  const userId = req.user.id;

  try {
    //CEK KANDANG
    const kandang = await Kandang.findById(kandangId);
    if (!kandang)
      return res.status(404).json({ message: "Kandang tidak ditemukan" });

    //CEK AYAM
    const ayam = await Ayam.findById(ayamId);
    if (!ayam) return res.status(404).json({ message: "Ayam tidak ditemukan" });

    //AUTH SERVICE
    const userValid = await validateUserExists(userId);
    if (!userValid)
      return res.status(404).json({ message: "User tidak ditemukan" });

    //CEGAH INPUT JIKA KANDANG AKTIF
    const existingBatch = await BatchAyam.findOne({
      kandangId,
      isActive: true,
    });
    if (existingBatch) {
      return res.status(400).json({
        message:
          "Kandang ini sudah memiliki batch aktif. Tidak dapat menambahkan batch baru.",
      });
    }

    //VALIDASI KAPASITAS KANDANG
    const batchLain = await BatchAyam.find({ kandangId, isActive: true });
    const totalAyamSaatIni = batchLain.reduce(
      (total, batch) => total + batch.jumlahAyam,
      0
    );

    if (totalAyamSaatIni + jumlahAyam > kandang.kapasitas) {
      return res.status(400).json({
        message: `Kapasitas kandang melebihi batas. Tersisa: ${
          kandang.kapasitas - totalAyamSaatIni
        } ekor`,
      });
    }

    //SIMPAN BATCH
    const batch = new BatchAyam({
      ...req.body,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await batch.save();

    //UPDATE STATUS AKTIF
    await Kandang.findByIdAndUpdate(kandangId, { status: "aktif" });

    res.status(201).json({ message: "Batch ayam ditambahkan", data: batch });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan batch", error: err.message });
  }
});

//PUT BY ID
router.put("/:id", authenticateJWT, async (req, res) => {
  const updatedBy = req.user.id;

  try {
    const batch = await BatchAyam.findById(req.params.id);
    if (!batch)
      return res.status(404).json({ message: "Batch tidak ditemukan" });

    const userValid = await validateUserExists(updatedBy);
    if (!userValid)
      return res.status(400).json({ message: "User tidak ditemukan" });

    Object.assign(batch, req.body, {
      updatedBy,
      updatedAt: new Date(),
    });

    await batch.save();

    res.json({ message: "Batch ayam diperbarui", data: batch });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate batch", error: err.message });
  }
});

//DELETE
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const batch = await BatchAyam.findById(req.params.id);
    if (!batch)
      return res.status(404).json({ message: "Batch tidak ditemukan" });

    const kandangId = batch.kandangId;

    await batch.deleteOne();

    // Cek apakah masih ada batch aktif di kandang tsb
    const batchAktifLain = await BatchAyam.findOne({
      kandangId,
      isActive: true,
    });

    if (!batchAktifLain) {
      await Kandang.findByIdAndUpdate(kandangId, { status: "kosong" });
    }

    res.json({ message: "Batch ayam dihapus dan status kandang diperiksa" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus batch", error: err.message });
  }
});

module.exports = router;
