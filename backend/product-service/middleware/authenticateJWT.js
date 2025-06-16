const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

// Middleware untuk memverifikasi JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak diberikan" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Simpan data user hasil decoding
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

module.exports = { authenticateJWT };
