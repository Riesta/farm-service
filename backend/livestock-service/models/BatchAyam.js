const mongoose = require("mongoose");

const batchAyamSchema = new mongoose.Schema({
  kandangId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kandang",
    required: true,
  },
  ayamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ayam",
    required: true,
  },
  sumber: {
    type: String,
    required: true,
  },
  usiaAyamSaatMasukHari: {
    type: Number,
    required: true,
  },
  jumlahAyam: {
    type: Number,
    required: true,
  },
  produksiTerakhir: {
    timestamp: Date,
    jumlah: Number,
  },
  beratRataRataGr: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  catatanTambahan: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  }, { timestamps: true });

// ✅ Tambahkan baris ini
module.exports = mongoose.model("BatchAyam", batchAyamSchema);
