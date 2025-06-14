const { slowDown } = require("express-slow-down");
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per windowMs, then...
  delayMs: (hits) => hits * 100, // add 100ms of delay per hit over the limit
});
module.exports = speedLimiter;
