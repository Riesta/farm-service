const mongoose = require("mongoose");

const produkSchema = new mongoose.Schema(
  {
    tipe: {
      type: String,
      enum: ["karkas", "dada", "paha", "sayap", "telur", "telur omega"],
      required: true,
      unique: true,
    },
    masaSimpanHari: {
      type: Number,
      required: true,
    },
    suhu: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Produk", produkSchema);
