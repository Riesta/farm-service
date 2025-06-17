const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const ayamRoutes = require("./routes/Ayam");
const kandangRoutes = require("./routes/Kandang");
const batchAyamRoutes = require("./routes/BatchAyam");
const mqttIoTRoutes = require("./routes/MqttIoT");

// Load environment variables
dotenv.config();

// Inisialisasi Express
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routing utama
app.use("/api/livestock/ayam", ayamRoutes);
app.use("/api/livestock/kandang", kandangRoutes);
app.use("/api/livestock/batchAyam", batchAyamRoutes);
app.use("/api/livestock/iot", mqttIoTRoutes);

// Port dan jalankan server
const PORT = process.env.LIVESTOCK_SERVICE_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
