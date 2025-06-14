const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const jenisAyamRoutes = require("./routes/JenisAyam"); // ✅ Tambahan
const breedAyamRoutes = require("./routes/BreedAyam");

// Load environment variables
dotenv.config();

// Inisialisasi Express
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routing utama
app.use("/api/jenis-ayam", jenisAyamRoutes); // ✅ Tambahan
app.use("/api/breed-ayam", breedAyamRoutes);

// Port dan jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
