const Produk = require("../models/ProdukModel");

// 🔍 GET semua data produk
const getAllProduk = async (req, res) => {
  try {
    const produkList = await Produk.find();
    
    res.json(produkList);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data produk",
      error: err.message,
    });
  }
};

// 🔍 GET produk by ID
const getProdukById = async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);

    if (!produk)
      return res.status(404).json({ message: "Data produk tidak ditemukan" });

    res.json({
      message: "Data produk berhasil didapatkan",
      data: produk,
    });
  } catch (err) {
    res.status(400).json({
      message: "Produk tidak ditemukan",
      error: err.message,
    });
  }
};

// ➕ POST tambah produk
const addProduk = async (req, res) => {
  try {
    const newProduk = new Produk(req.body);
    await newProduk.save();
    
    res.status(201).json({
      message: "Data produk berhasil ditambahkan",
      data: newProduk,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal menambahkan produk",
      error: err.message,
    });
  }
};

// ✏️ PUT update produk by ID
const editProdukById = async (req, res) => {
  try {
    const updatedProduk = await Produk.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!updatedProduk)
      return res.status(404).json({ message: "Data produk tidak ditemukan" });
    
    res.json({
      message: "Data produk berhasil diperbarui",
      data: updatedProduk,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal memperbarui produk",
      error: err.message,
    });
  }
};

// ❌ DELETE produk by ID
const deleteProdukById = async (req, res) => {
  try {
    const deleted = await Produk.findByIdAndDelete(req.params.id);
    
    if (!deleted)
      return res.status(404).json({ message: "Data produk tidak ditemukan" });
    res.json({ message: "Data produk berhasil dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus produk", error: err.message });
  }
};

module.exports = {
  getAllProduk,
  getProdukById,
  addProduk,
  editProdukById,
  deleteProdukById
};
