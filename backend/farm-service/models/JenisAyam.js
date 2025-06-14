const mongoose = require("mongoose");

const jenisAyamSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      enum: ["Petelur", "Pedaging"], // bisa disesuaikan
    },
    deskripsi: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt dan updatedAt otomatis
  }
);

module.exports = mongoose.model("JenisAyam", jenisAyamSchema);
