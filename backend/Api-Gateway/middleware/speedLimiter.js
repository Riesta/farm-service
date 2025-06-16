const { slowDown } = require("express-slow-down");
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: (hits) => hits * 100, 
});
module.exports = speedLimiter;
