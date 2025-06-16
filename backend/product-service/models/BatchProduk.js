const mongoose = require("mongoose");

const batchProdukSchema = new mongoose.Schema(
  {
    batchAyamId: {
      type: mongoose.Schema.Types.ObjectId,       // batchAyamId, produkId harus gabungan unik
      ref: "BatchAyam",
      required: true,
    },
    produkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produk",
      required: true,
    },
    storageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
      required: true,
    },
    stokAwal: {
      type: Number,
      required: true,
    },
    stokSaatIni: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["tersedia", "kadaluarsa", "dikarantina", "habis"],
      required: true,
    },
    tanggalMasuk: {
      type: Date,
      default: Date.now,
      required: true
    },
  },
  { timestamps: true }
);

// --- Index unik gabungan batchAyamId dan produkId ---
batchProdukSchema.index(
  { batchAyamId: 1, produkId: 1 },
  { unique: true }
);

// --- Index unik gabungan batchAyamId, produkId, dan storageId ---
batchProdukSchema.index(
  { batchAyamId: 1, produkId: 1, storageId: 1 },
  { unique: true }
);

module.exports = mongoose.model("BatchProduk", batchProdukSchema);