const mqtt = require("mqtt");
const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const app = express();
const port = 3000;

// MQTT & TOPIK
const brokerUrl = "mqtt://broker.emqx.io";
const topic = "peternakan/kandang_ayam";
const client = mqtt.connect(brokerUrl);

// KONEKSI MONGODB
const mongoUri =
  "mongodb+srv://ramadanrizky593:ridan123@cluster0.aigm3ix.mongodb.net/farmDB";
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Terhubung ke MongoDB"))
  .catch((err) => console.error("❌ Gagal terhubung MongoDB:", err.message));

// SKEMA MONGOOSE
const kandangSchema = new mongoose.Schema(
  {
    jenisKandang: String,
    nama: String,
    kapasitas: Number,
    status: String,
    suhu: Number,
    kelembaban: Number,
    cahaya: Number,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: "kandangs" }
);

const Kandang = mongoose.model("Kandang", kandangSchema);

// VARIABEL SIKLUS
let dataKandang = {};
let lastFullCycle = {};
let lastFullCycleList = [];
let cycleCounter = 0;

// MQTT CONNECT & HANDLE MESSAGE
client.on("connect", () => {
  console.log("🔌 Terhubung ke broker MQTT");
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`📡 Menunggu data dari topik: ${topic}`);
    } else {
      console.error("❌ Gagal subscribe:", err.message);
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const id = data.kandangId;

    if (!ObjectId.isValid(id)) {
      console.warn("⛔ ID kandang tidak valid:", id);
      return;
    }

    // Ambil nama kandang dari MongoDB
    const kandang = await Kandang.findById(id);
    if (!kandang) {
      console.warn("❌ Kandang tidak ditemukan di database:", id);
      return;
    }

    const namaKandang = kandang.nama;

    // Simpan data siklus dengan key namaKandang
    dataKandang[namaKandang] = {
      kandangId: id,
      suhu: data.suhu,
      kelembaban: data.kelembaban,
      lux: data.lux,
    };

    // Update MongoDB
    await Kandang.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          suhu: data.suhu,
          kelembaban: data.kelembaban,
          cahaya: data.lux,
          updatedAt: new Date(),
        },
      }
    );

    // Cek apakah data dari semua kandang sudah masuk
    const totalKandang = await Kandang.countDocuments();
    if (Object.keys(dataKandang).length >= totalKandang) {
      cycleCounter++;
      console.log(`\n🔄 Siklus ke-${cycleCounter}:`);
      const newCycleList = [];

      for (const [nama, d] of Object.entries(dataKandang)) {
        console.log(` ${nama}`);
        console.log(`    Suhu: ${d.suhu} °C`);
        console.log(`    Kelembaban: ${d.kelembaban} %`);
        console.log(`    Lux: ${d.lux}`);

        newCycleList.push(d); // Masukkan ke list untuk response API
      }

      console.log("====================================");

      lastFullCycle = { ...dataKandang };
      lastFullCycleList = newCycleList;
      dataKandang = {}; // Reset untuk siklus berikutnya
    }
  } catch (err) {
    console.error("❗ Gagal parsing atau update:", err.message);
  }
});

// ENDPOINT UNTUK MELIHAT DATA TERAKHIR
app.get("/kandang", (req, res) => {
  if (lastFullCycleList.length === 0) {
    return res.status(404).json({ message: "Data belum tersedia" });
  }

  res.json({
    cycle: cycleCounter,
    kandang: lastFullCycleList,
  });
});

// JALANKAN SERVER EXPRESS
app.listen(port, () => {
  console.log(`🚀 Server Express berjalan di http://localhost:${port}/kandang`);
});
