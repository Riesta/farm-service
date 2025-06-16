const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = limiter;
