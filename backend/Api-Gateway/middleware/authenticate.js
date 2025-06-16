const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;

    if (!userId) return res.status(404).json({ message: "User not found" });

    req.user = userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
