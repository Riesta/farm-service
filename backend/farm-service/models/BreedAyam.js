const mongoose = require('mongoose');

const breedAyamSchema = new mongoose.Schema({
  idJenisAyam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JenisAyam', // Referensi ke model JenisAyam
    required: true
  },
  nama: {
    type: String,
    required: true,
    unique: true
  },
  deskripsi: {
    type: String
  },
  // ---- Properti spesifik breed (contoh) ----
  
  // Ayam petelur
  masaPanenTelurAwalHari: Number,
  masaPanenTelurAkhirHari: Number,
  rataRataTelurPerMinggu: Number,

  // Ayam pedaging
  masaPanenDagingHari: Number,
  rataRataBeratPanenGr: Number,
  // -------------------------------------------
  
  // Overrides untuk lingkungan spesifik breed
  rekomendasiPakanHarianGr: Number,
  rekomendasiKelembabanMin: Number,
  rekomendasiKelembabanMax: Number,
  rekomendasiSuhuMin: Number,
  rekomendasiSuhuMax: Number,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('BreedAyam', breedAyamSchema);