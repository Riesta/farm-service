const express = require("express");
const router = express.Router();
const BatchAyam = require("../models/BatchAyam");
const Ayam = require("../models/Ayam");
const Kandang = require("../models/Kandang");

const user = require("../models/user");

//GET SEMUA
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
  const { kandangId, ayamId, jumlahAyam } = req.body;
  const userHeader = req.headers["x-user"];
  if (!userHeader) {
    return res
      .status(401)
      .json({ message: "Informasi user tidak ada di header." });
  }

  const user = JSON.parse(userHeader);
  const userId = user.id;

  try {
    //CEK KANDANG
    const kandang = await Kandang.findById(kandangId);
    if (!kandang)
      return res.status(404).json({ message: "Kandang tidak ditemukan" });

    //CEK AYAM
    const ayam = await Ayam.findById(ayamId);
    if (!ayam) return res.status(404).json({ message: "Ayam tidak ditemukan" });


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
router.put("/:id", async (req, res) => {
  const userHeader = req.headers["x-user"];
  if (!userHeader) {
    return res
      .status(401)
      .json({ message: "Informasi user tidak ada di header." });
  }

  const user = JSON.parse(userHeader);
  const updatedBy = user.id; 

  try {
    const batch = await BatchAyam.findById(req.params.id);
    if (!batch)
      return res.status(404).json({ message: "Batch tidak ditemukan" });

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
router.delete("/:id", async (req, res) => {
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
