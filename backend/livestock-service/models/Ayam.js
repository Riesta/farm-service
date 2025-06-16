const mongoose = require("mongoose");

const ayamSchema = new mongoose.Schema({
  tipe: {
    type: String,
    enum: ["petelur", "pedaging"],
    required: true,
  },
  namaBreed: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
    required: true,
  },
  kecil: {
    usiaHariMulai: { type: Number, required: true },
    pakan: {
      nama: { type: String, required: true },
      jumlahGr: { type: Number, required: true },
    },
    suhu: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    kelembaban: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    }
  },
  besar: {
    usiaHariMulai: { type: Number, required: true },
    pakan: {
      nama: { type: String, required: true },
      jumlahGr: { type: Number, required: true },
    },
    suhu: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    kelembaban: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    }
  },
  // UNTUK PETELUR
  masaPanenTelurAwalHari: { type: Number },
  masaPanenTelurAkhirHari: { type: Number },
  rataRataTelurPerMinggu: { type: Number },

  // UNTUK PEDAGING
  masaPanenDagingHari: { type: Number },
  rataRataBeratPanenGr: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model("Ayam", ayamSchema);
