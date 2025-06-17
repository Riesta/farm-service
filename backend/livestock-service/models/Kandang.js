const mongoose = require("mongoose");

const kandangSchema = new mongoose.Schema(
  {
    jenisKandang: {
      type: String,
      enum: ["petelur", "pedaging"],
      required: true,
    },
    nama: {
      type: String,
      required: true,
    },
    kapasitas: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["aktif", "kosong", "perawatan"],
      default: "kosong",
    },
    suhu: {
      type: Number,
      required: false,
    },
    kelembaban: {
      type: Number,
      required: false,
    },
    cahaya: {
      type: Number,
      required: false,
    },
    suhuAlert: {
      type: String,
      required: false,
    },
    kelembabanAlert: {
      type: String,
      required: false,
    },
    cahayaAlert: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Kandang", kandangSchema);
