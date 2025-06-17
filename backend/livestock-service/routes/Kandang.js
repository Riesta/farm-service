const express = require("express");
const Kandang = require("../models/Kandang");
const Ayam = require("../models/Ayam");
// const { authenticateJWT } = require("../middleware/authenticateJWT");

const router = express.Router();

//GET
router.get("/", async (req, res) => {
  try {
    const kandang = await Kandang.find();
    res.json(kandang);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data kandang", error: err.message });
  }
});

//POST
router.post("/", async (req, res) => {
  try {
    const kandangBaru = new Kandang(req.body);
    await kandangBaru.save();
    res.status(201).json({ message: "Kandang ditambahkan", data: kandangBaru });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menambahkan kandang", error: err.message });
  }
});

//PUT
router.put("/:id", async (req, res) => {
  try {
    const updated = await Kandang.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Kandang tidak ditemukan" });

    // cari ayam yang tipenya sama dengan jenis kandang
    // pada kasus ini kami belum bisa mengecek suhu sesuai umur yang ada pada BatchAyam
    const ayam = await Ayam.findOne({ tipe: updated.jenisKandang });
    const suhuRange = ayam.besar.suhu.min + " --- " + ayam.besar.kelembaban.max;
    const kelembabanRange = ayam.besar.kelembaban.min + " --- " + ayam.besar.kelembaban.max;

    if (updated.suhu < ayam.besar.suhu.min) {
      updated.suhuAlert = "SUHU DI BAWAH JANGKAUAN! " + suhuRange;
    } else if (updated.suhu > ayam.besar.suhu.max) {
      updated.suhuAlert = "SUHU DI ATAS JANGKAUAN! " + suhuRange;
    } else {
      updated.suhuAlert = "suhu aman";
    }
    
    if (updated.kelembaban < ayam.besar.kelembaban.min) {
      updated.kelembabanAlert = "KELEMBABAN DI BAWAH JANGKAUAN! " + kelembabanRange;
    } else if (updated.kelembaban > ayam.besar.kelembaban.min) {
      updated.kelembabanAlert = "KELEMBABAN DI ATAS JANGKAUAN! " + kelembabanRange;
    } else {
      updated.kelembabanAlert = "kelembaban aman";
    }

    if (updated.suhuAlert !== "suhu aman") {
      console.log(updated.suhuAlert);
    }

    if (updated.kelembabanAlert !== "kelembaban aman") {
      console.log(updated.kelembabanAlert);
    }

    const newUpdated = await Kandang.findByIdAndUpdate(req.params.id, updated, {
      new: true,
    });
    if (!newUpdated)
      return res.status(404).json({ message: "Kandang tidak ditemukan" });

    res.json({ message: "Kandang diperbarui", data: newUpdated });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate kandang", error: err.message });
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Kandang.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Kandang tidak ditemukan" });
    res.json({ message: "Kandang dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus kandang", error: err.message });
  }
});

module.exports = router;
