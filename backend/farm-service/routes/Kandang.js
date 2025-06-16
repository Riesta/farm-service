const express = require("express");
const Kandang = require("../models/Kandang");
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
    res.json({ message: "Kandang diperbarui", data: updated });
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
