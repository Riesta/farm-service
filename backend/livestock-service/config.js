// config.js
require("dotenv").config(); // Memuat variabel dari file .env
module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  port: process.env.FARM_SERVICE_PORT || 5000,
};
