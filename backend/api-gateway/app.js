const express = require("express");
const speedLimiter = require("./middleware/speedLimiter");
const limiter = require("./middleware/limiter");
const authenticate = require("./middleware/authenticate");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 6969;
const setupServiceProxy = require("./utils/proxy");
app.use(morgan("tiny"));
app.use(express.json());
app.use(limiter);
app.use(speedLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK api gateway belom R.I.P" });
});

//todo pakai env
app.use("/api/auth", setupServiceProxy("/auth", "http://localhost:3000"));

app.use(
  "/api/farm",
  authenticate,
  setupServiceProxy("/farm", "http://localhost:5000")
);

app.listen(PORT, () => {
  console.log(`API Gateway berjalan di port ${PORT}`);
});
