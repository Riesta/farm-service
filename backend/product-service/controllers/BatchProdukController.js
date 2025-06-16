const BatchProduk = require("../models/BatchProdukModel");

// 🔍 GET semua data batchProduk
const getAllBatchProduk = async (req, res) => {
  try {
    const batchProdukList = await BatchProduk.find();
    
    res.json(batchProdukList);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data batchProduk",
      error: err.message,
    });
  }
};

// 🔍 GET batchProduk by ID
const getBatchProdukById = async (req, res) => {
  try {
    const batchProduk = await BatchProduk.findById(req.params.id);

    if (!batchProduk)
      return res.status(404).json({ message: "Data batchProduk tidak ditemukan" });

    res.json({
      message: "Data batchProduk berhasil didapatkan",
      data: batchProduk,
    });
  } catch (err) {
    res.status(400).json({
      message: "BatchProduk tidak ditemukan",
      error: err.message,
    });
  }
};

// ➕ POST tambah batchProduk
const addBatchProduk = async (req, res) => {
  try {
    const newBatchProduk = new BatchProduk(req.body);
    await newBatchProduk.save();
    
    res.status(201).json({
      message: "Data batchProduk berhasil ditambahkan",
      data: newBatchProduk,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal menambahkan batchProduk",
      error: err.message,
    });
  }
};

// ✏️ PUT update batchProduk by ID
const editBatchProdukById = async (req, res) => {
  try {
    const updatedBatchProduk = await BatchProduk.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!updatedBatchProduk)
      return res.status(404).json({ message: "Data batchProduk tidak ditemukan" });
    
    res.json({
      message: "Data batchProduk berhasil diperbarui",
      data: updatedBatchProduk,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal memperbarui batchProduk",
      error: err.message,
    });
  }
};

// ❌ DELETE batchProduk by ID
const deleteBatchProdukById = async (req, res) => {
  try {
    const deleted = await BatchProduk.findByIdAndDelete(req.params.id);
    
    if (!deleted)
      return res.status(404).json({ message: "Data batchProduk tidak ditemukan" });
    res.json({ message: "Data batchProduk berhasil dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus batchProduk", error: err.message });
  }
};

module.exports = {
  getAllBatchProduk,
  getBatchProdukById,
  addBatchProduk,
  editBatchProdukById,
  deleteBatchProdukById
};
