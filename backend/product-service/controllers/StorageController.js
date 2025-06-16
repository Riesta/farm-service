const Storage = require("../models/StorageModel");

// 🔍 GET semua data storage
const getAllStorage = async (req, res) => {
  try {
    const storageList = await Storage.find();
    
    res.json(storageList);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data storage",
      error: err.message,
    });
  }
};

// 🔍 GET storage by ID
const getStorageById = async (req, res) => {
  try {
    const storage = await Storage.findById(req.params.id);

    if (!storage)
      return res.status(404).json({ message: "Data storage tidak ditemukan" });

    res.json({
      message: "Data storage berhasil didapatkan",
      data: storage,
    });
  } catch (err) {
    res.status(400).json({
      message: "Storage tidak ditemukan",
      error: err.message,
    });
  }
};

// ➕ POST tambah storage
const addStorage = async (req, res) => {
  try {
    const newStorage = new Storage(req.body);
    await newStorage.save();
    
    res.status(201).json({
      message: "Data storage berhasil ditambahkan",
      data: newStorage,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal menambahkan storage",
      error: err.message,
    });
  }
};

// ✏️ PUT update storage by ID
const editStorageById = async (req, res) => {
  try {
    const updatedStorage = await Storage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStorage)
      return res.status(404).json({ message: "Data storage tidak ditemukan" });
    
    res.json({
      message: "Data storage berhasil diperbarui",
      data: updatedStorage,
    });
  } catch (err) {
    res.status(400).json({
      message: "Gagal memperbarui storage",
      error: err.message,
    });
  }
};

// ❌ DELETE storage by ID
const deleteStorageById = async (req, res) => {
  try {
    const deleted = await Storage.findByIdAndDelete(req.params.id);
    
    if (!deleted)
      return res.status(404).json({ message: "Data storage tidak ditemukan" });
    
    res.json({ message: "Data storage berhasil dihapus" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Gagal menghapus storage", error: err.message });
  }
};

module.exports = {
  getAllStorage,
  getStorageById,
  addStorage,
  editStorageById,
  deleteStorageById,
};
