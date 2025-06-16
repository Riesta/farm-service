const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const produkRoutes = require("./routes/produk");
const storageRoutes = require("./routes/storage");
const batchProdukRoutes = require("./routes/batchProduk");

// Load environment variables
const { port } = require("./config");

// Inisialisasi Express
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routing utama
app.use("/api/product/produk", produkRoutes);
app.use("/api/farm/storage", storageRoutes);
app.use("/api/product/batchProduk", batchProdukRoutes);

// Port dan jalankan server
app.listen(port, () => console.log(`Server running on port ${port}`));
