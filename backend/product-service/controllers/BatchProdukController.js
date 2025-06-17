const { mongoose } = require("mongoose");
const BatchProduk = require("../models/BatchProdukModel");
const Storage = require("../models/StorageModel");
const BatchAyam = require("../models/BatchAyamModel");
const Produk = require("../models/ProdukModel");
const { ObjectId } = require("mongodb");

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
    const batchProduk = await BatchProduk.findById(req.params.id).populate(
      ["batchAyamId",
      "storageId",
      "updatedBy"]
    ).exec();

    if (!batchProduk)
      return res
        .status(404)
        .json({ message: "Data batchProduk tidak ditemukan" });

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
    const userHeader = req.headers["x-user"];
    if (!userHeader) {
      return res
        .status(401)
        .json({ message: "Informasi user tidak ada di header." });
    }

    const user = JSON.parse(userHeader);
    const updatedBy = user.id;

    const { batchAyamId, produkId, storageId, stokAwal, tanggalMasuk } =
      req.body;

    const batchProdukData = {
      batchAyamId: new ObjectId(batchAyamId),
      produkId: new ObjectId(produkId),
      storageId: new ObjectId(storageId),
      stokAwal: stokAwal,
      updatedBy: new ObjectId(updatedBy),
    };

    if (tanggalMasuk) {
      batchProdukData.tanggalMasuk = tanggalMasuk;
    }

    const stokSaatIni = stokAwal;

    const storage = await Storage.findById(storageId);
    if (stokSaatIni > storage.kapasitas) {
      return res
        .status(404)
        .json({ message: "Stok tidak boleh melebihi kapasitas storage!" });
    }

    const newBatchProduk = new BatchProduk(batchProdukData);
    await newBatchProduk.save();

    await updateStorageStatusByStorageId(storageId);

    res.status(201).json({
      message:
        "Data batchProduk berhasil ditambahkan dan status storage diperbarui",
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
    const userHeader = req.headers["x-user"];
    if (!userHeader) {
      return res
        .status(401)
        .json({ message: "Informasi user tidak ada di header." });
    }

    const user = JSON.parse(userHeader);
    const updatedBy = user.id;

    const { storageId } = req.params;
    const { stokSaatIni } = req.body;

    const totalStok = await calculateTotalStokByStorageId(storageId);
    if (stokSaatIni > totalStok) {
      return res
        .status(404)
        .json({ message: "Stok tidak boleh melebihi kapasitas storage!" });
    }

    const updatedBatchProduk = await BatchProduk.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: updatedBy },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBatchProduk) {
      return res
        .status(404)
        .json({ message: "Data batchProduk tidak ditemukan" });
    }

    res.json({
      message:
        "Data batchProduk berhasil diperbarui dan status storage diperiksa",
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
    const batch = await BatchProduk.findById(req.params.id);

    if (!batch)
      return res.status(404).json({ message: "Batch tidak ditemukan" });

    const storageId = batch.storageId;

    await batch.deleteOne();

    await updateStorageStatusByStorageId(storageId);

    res.json({ message: "Batch produk dihapus dan status storage diperiksa" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus batch", error: err.message });
  }
};

const calculateTotalStokByStorageId = async (storageId) => {
  // if (!mongoose.Types.ObjectId.isValid(storageId)) {
  //   throw new Error("Format Storage ID tidak valid.");
  // }

  try {
    const result = await BatchProduk.aggregate([
      {
        $match: {
          storageId: new mongoose.Types.ObjectId(storageId),
        },
      },
      {
        $group: {
          _id: null,
          totalStok: { $sum: "$stokSaatIni" },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalStok : 0;
  } catch (err) {
    console.error(
      "Error in calculateTotalStokByStorageId (aggregation failed):",
      err
    );
    throw err;
  }
};

const updateStorageStatusByStorageId = async (storageId) => {
  if (!mongoose.Types.ObjectId.isValid(storageId)) {
    throw new Error("Format Storage ID untuk update status tidak valid.");
  }
  const currentTotalStok = await calculateTotalStokByStorageId(storageId); // Memanggil helper lain
  const newStatus = currentTotalStok > 0 ? "aktif" : "kosong";

  await Storage.findByIdAndUpdate(storageId, { status: newStatus });
};

module.exports = {
  getAllBatchProduk,
  getBatchProdukById,
  addBatchProduk,
  editBatchProdukById,
  deleteBatchProdukById,
};
