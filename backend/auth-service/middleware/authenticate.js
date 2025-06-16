const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtSecret } = require("../config");

// 🔐 Middleware JWT
const authenticateJWT = async (req, res, next) => {
  console.log("Authenticating JWT...", token);
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak, token tidak tersedia." });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};
module.exports = authenticateJWT;
