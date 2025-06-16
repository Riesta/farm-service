const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const produkRoutes = require("./routes/ProdukRoute");
const storageRoutes = require("./routes/StorageRoute");
const batchProdukRoutes = require("./routes/BatchProdukRoute");

// Load environment variables
const { port } = require("./config");
const Produk = require("./models/ProdukModel");
const Storage = require("./models/StorageModel");
const BatchProduk = require("./models/BatchProdukModel");

// Inisialisasi Express
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routing utama
app.use("/api/product/storage", storageRoutes);
app.use("/api/product/produk", produkRoutes);
app.use("/api/product/batchProduk", batchProdukRoutes);

// Port dan jalankan server
app.listen(port, () => {
  Produk.syncIndexes();
  BatchProduk.syncIndexes();
  Storage.syncIndexes();
  console.log(`Server running on port ${port}`);
});
