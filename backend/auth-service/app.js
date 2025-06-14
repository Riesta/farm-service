const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const { port } = require("./config");

const app = express();
app.use(bodyParser.json());

connectDB(); // 🔌 Koneksi ke MongoDB Atlas
app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server Berjalan pada port ${port}`);
});
