// config.js
require("dotenv").config(); // Memuat variabel dari file .env
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  port: process.env.PORT || 3000,
};
