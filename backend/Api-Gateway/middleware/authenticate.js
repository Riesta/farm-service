const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak, token tidak tersedia." });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
