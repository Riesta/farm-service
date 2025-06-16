const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const produkRoutes = require("./routes/Produk");
// const kandangRoutes = require("./routes/Kandang");
const batchProdukRoutes = require("./routes/BatchProduk");

// Load environment variables
dotenv.config();

// Inisialisasi Express
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routing utama
app.use("/api/produk/produk", produkRoutes);
// app.use("/api/farm/kandang", kandangRoutes);
app.use("/api/produk/batchProduk", batchProdukRoutes);

// Port dan jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
