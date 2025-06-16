const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    tipe: {
      type: String,
      enum: ["daging", "telur"], // tipe dan rak harus unik
      required: true,
    },
    rak: {
      type: String,
      required: true,
    },
    kapasitas: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["aktif", "kosong", "perawatan"],
      default: "kosong"
    },
  },
  { timestamps: true }
);

// --- Index unik gabungan tipe dan rak  ---
storageSchema.index({ tipe: 1, rak: 1 }, { unique: true });

module.exports = mongoose.model("Storage", storageSchema);
